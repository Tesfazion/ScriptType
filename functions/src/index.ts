import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";

initializeApp();
const db = getFirestore();

const verses: Record<string, string> = {
  "john-1-1":
    "In the beginning was the Word, and the Word was with God, and the Word was God.",
  "psalm-119-105":
    "Thy word is a lamp unto my feet, and a light unto my path.",
  "philippians-4-13":
    "I can do all things through Christ which strengtheneth me.",
  "proverbs-3-5-6":
    "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
  "romans-8-28":
    "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
  "psalm-23-1": "The LORD is my shepherd; I shall not want.",
  "matthew-5-16":
    "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.",
  "isaiah-40-31":
    "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
};

type PracticeRequest = {
  verseId: string;
  typedText: string;
  elapsedMs: number;
  startedAtMs: number;
  mode: "typing" | "memory" | "audio";
  idempotencyKey: string;
};

function calculateMetrics(expected: string, actual: string, elapsedMs: number) {
  const elapsedSeconds = Math.max(0, elapsedMs / 1000);
  const totalCharacters = Math.max(expected.length, actual.length);
  let correctCharacters = 0;
  for (let index = 0; index < Math.min(expected.length, actual.length); index += 1) {
    if (expected[index] === actual[index]) correctCharacters += 1;
  }
  const mistakeCount = totalCharacters - correctCharacters;
  const accuracy =
    totalCharacters === 0 ? 100 : (correctCharacters / totalCharacters) * 100;
  const wpm =
    elapsedSeconds < 5
      ? 0
      : Math.round((correctCharacters / 5 / elapsedSeconds) * 60);

  return {
    wpm,
    accuracy: Math.round(accuracy * 10) / 10,
    elapsedSeconds: Math.round(elapsedSeconds),
    mistakeCount,
    correctCharacters,
    totalCharacters,
  };
}

function normalizeWords(text: string) {
  return text
    .toLocaleLowerCase("en")
    .replace(/[^\p{L}\p{N}\s']/gu, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function memoryScore(expected: string, recalled: string) {
  const expectedWords = normalizeWords(expected);
  const recalledWords = normalizeWords(recalled);
  const previous = new Array<number>(recalledWords.length + 1).fill(0);
  for (let row = 1; row <= expectedWords.length; row += 1) {
    const current = new Array<number>(recalledWords.length + 1).fill(0);
    for (let column = 1; column <= recalledWords.length; column += 1) {
      current[column] =
        expectedWords[row - 1] === recalledWords[column - 1]
          ? previous[column - 1] + 1
          : Math.max(previous[column], current[column - 1]);
    }
    previous.splice(0, previous.length, ...current);
  }
  const totalWords = Math.max(expectedWords.length, recalledWords.length);
  const matches = previous[recalledWords.length];
  return totalWords === 0 ? 100 : Math.round((matches / totalWords) * 100);
}

function dateInTimezone(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

function isConsecutive(previousDate: string, today: string) {
  const previous = new Date(`${previousDate}T00:00:00.000Z`);
  const tomorrowFromPrevious = new Date(previous);
  tomorrowFromPrevious.setUTCDate(tomorrowFromPrevious.getUTCDate() + 1);
  return tomorrowFromPrevious.toISOString().slice(0, 10) === today;
}

export const completePractice = onCall(
  { region: "us-central1", enforceAppCheck: true },
  async (request): Promise<Record<string, unknown>> => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign in to save practice.");
    }

    const data = request.data as Partial<PracticeRequest>;
    if (
      typeof data.verseId !== "string" ||
      typeof data.typedText !== "string" ||
      typeof data.elapsedMs !== "number" ||
      typeof data.startedAtMs !== "number" ||
      !["typing", "memory", "audio"].includes(data.mode ?? "") ||
      typeof data.idempotencyKey !== "string"
    ) {
      throw new HttpsError("invalid-argument", "The practice result is incomplete.");
    }
    const verseId = data.verseId;
    const typedText = data.typedText;
    const elapsedMs = data.elapsedMs;
    const startedAtMs = data.startedAtMs;
    const mode = data.mode as "typing" | "memory" | "audio";
    const idempotencyKey = data.idempotencyKey;
    if (idempotencyKey.length < 8 || idempotencyKey.length > 128) {
      throw new HttpsError("invalid-argument", "The practice key is invalid.");
    }
    if (elapsedMs < 0 || elapsedMs > 86_400_000) {
      throw new HttpsError("invalid-argument", "The elapsed time is invalid.");
    }
    if (typedText.length > 1_000) {
      throw new HttpsError("invalid-argument", "The typed result is too large.");
    }
    if (Date.now() - startedAtMs > 86_400_000) {
      throw new HttpsError("failed-precondition", "This practice session expired.");
    }

    const expected = verses[verseId];
    if (!expected) {
      throw new HttpsError("not-found", "This Scripture passage is unavailable.");
    }

    const uid = request.auth.uid;
    const sessionRef = db
      .collection("users")
      .doc(uid)
      .collection("sessions")
      .doc(idempotencyKey);

    return db.runTransaction(async (transaction) => {
      const existing = await transaction.get(sessionRef);
      if (existing.exists) {
        return existing.data() as Record<string, unknown>;
      }

      const now = Timestamp.now();
      const profileRef = db.collection("users").doc(uid);
      const summaryRef = profileRef.collection("progress").doc("summary");
      const [profile, summary] = await Promise.all([
        transaction.get(profileRef),
        transaction.get(summaryRef),
      ]);
      const profileData = profile.data() ?? {};
      const summaryData = summary.data() ?? {};
      const timezone =
        typeof profileData.timezone === "string"
          ? profileData.timezone
          : "UTC";
      const today = dateInTimezone(now.toDate(), timezone);
      const previousDate =
        typeof summaryData.lastActiveDate === "string"
          ? summaryData.lastActiveDate
          : null;
      const previousStreak =
        typeof summaryData.activeStreak === "number"
          ? summaryData.activeStreak
          : 0;
      const activeStreak =
        previousDate === today
          ? previousStreak
          : previousDate && isConsecutive(previousDate, today)
            ? previousStreak + 1
            : 1;

      const metrics = calculateMetrics(
        expected,
        typedText,
        elapsedMs,
      );
      const recallScore =
        mode === "memory"
          ? memoryScore(expected, typedText)
          : undefined;
      const xpEarned =
        15 +
        (metrics.accuracy === 100 ? 10 : 0) +
        (mode === "memory" && (recallScore ?? 0) >= 70 ? 10 : 0) +
        (activeStreak > 0 && activeStreak % 7 === 0 ? 5 : 0);
      const previousXp =
        typeof summaryData.xp === "number" ? summaryData.xp : 0;
      const xp = previousXp + xpEarned;
      const level = Math.min(100, Math.floor(Math.sqrt(xp / 100)) + 1);
      const weekStart = today.slice(0, 8) + "01";

      const result = {
        sessionId: idempotencyKey,
        xpEarned,
        activeStreak,
        metrics,
        ...(recallScore === undefined ? {} : { memoryScore: recallScore }),
      };

      transaction.set(
        sessionRef,
        {
          verseId,
          mode,
          completedAt: now,
          xpEarned,
          activeStreak,
          metrics,
          ...(recallScore === undefined ? {} : { memoryScore: recallScore }),
        },
        { merge: false },
      );
      transaction.set(
        summaryRef,
        {
          xp,
          level,
          activeStreak,
          lastActiveDate: today,
          weekStart,
          updatedAt: now,
        },
        { merge: true },
      );
      transaction.set(
        profileRef,
        {
          updatedAt: now,
        },
        { merge: true },
      );

      logger.info("Practice completed", {
        uid,
        verseId,
        xpEarned,
        level,
      });

      return result;
    });
  },
);
