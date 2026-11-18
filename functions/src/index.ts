import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { HttpsError, onCall } from "firebase-functions/v2/https";

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

const keyboardStageIds = new Set([
  "keyboard-introduction",
  "home-row",
  "finger-positioning",
  "left-hand-practice",
  "right-hand-practice",
  "top-row",
  "bottom-row",
  "common-letters",
  "common-words",
  "sentences",
  "paragraphs",
  "coding-symbols",
  "developer-typing",
  "speed-building",
  "advanced-fluency",
  "basic-words",
  "real-world-typing",
  "coding-practice",
  "speed-drills",
  "accuracy-drills",
  "professional-practice",
]);

const keyboardStageTexts: Record<string, string> = {
  "keyboard-introduction": "Sit comfortably, relax your shoulders, and keep your wrists level. Find the letter keys, number row, and space bar.",
  "home-row": "asdf jkl; asdf jkl; fall ask flask; sad lads; all ask a salad.",
  "finger-positioning": "Each finger has a home key and a small zone to reach. Move only the finger you need, then return to home row.",
  "left-hand-practice": "qwer asdf zxcv; read a craft, write a verse, and start a fresh task.",
  "right-hand-practice": "yuiop hjkl nm; join your rhythm, keep your hands calm, and type one more line.",
  "top-row": "qwert yuiop quiet power; type every letter with a light reach and return.",
  "bottom-row": "zxcv bnm; move each finger down gently, then return to the home row.",
  "common-letters": "there are many ways to share an idea; start with steady hands and clear words.",
  "common-words": "People work together to make good ideas clear, useful, and easy to share.",
  sentences: "A calm pace builds confidence. Can you finish this sentence with care?",
  paragraphs: "Good typing is built one thoughtful line at a time. Stay relaxed, let your eyes move ahead, and pause when your hands need a moment. A comfortable rhythm makes longer passages feel easier to manage.",
  "coding-symbols": "let total = (first + second); if (total > 0) { print(total); }",
  "developer-typing": "const greet = (name) => { return `Hello, ${name}!`; };",
  "speed-building": "Keep a smooth rhythm and let each accurate word lead naturally into the next.",
  "advanced-fluency": "I have completed the review and added clear notes for the next steps. Thank you for your thoughtful collaboration.",
  "basic-words": "red bed sun fun; we can make a new word and read it again.",
  "real-world-typing": "Hello Maya, I have shared the notes for our meeting. Please let me know what you think.",
  "coding-practice": "const greet = (name) => { return `Hello, ${name}!`; };",
  "speed-drills": "Keep a smooth rhythm and let each accurate word lead naturally into the next.",
  "accuracy-drills": "Accuracy grows when you pause, notice the next key, and choose a relaxed pace.",
  "professional-practice": "I have completed the review and added clear notes for the next steps. Thank you for your thoughtful collaboration.",
};

const keyboardStageLessonIds: Record<string, string> = {
  "keyboard-introduction": "keyboard-introduction-lesson",
  "home-row": "home-row-lesson",
  "finger-positioning": "finger-positioning-lesson",
  "left-hand-practice": "left-hand-practice-lesson",
  "right-hand-practice": "right-hand-practice-lesson",
  "top-row": "top-row-lesson",
  "bottom-row": "bottom-row-lesson",
  "common-letters": "common-letters-lesson",
  "common-words": "common-words-lesson",
  sentences: "sentences-lesson",
  paragraphs: "paragraphs-lesson",
  "coding-symbols": "coding-symbols-lesson",
  "developer-typing": "developer-typing-lesson",
  "speed-building": "speed-building-lesson",
  "advanced-fluency": "advanced-fluency-lesson",
  "basic-words": "basic-words-lesson",
  "real-world-typing": "real-world-typing-lesson",
  "coding-practice": "coding-practice-lesson",
  "speed-drills": "speed-drills-lesson",
  "accuracy-drills": "accuracy-drills-lesson",
  "professional-practice": "professional-practice-lesson",
};

const legacyStageIds: Record<string, string> = {
  "basic-words": "common-letters",
  "real-world-typing": "paragraphs",
  "coding-practice": "coding-symbols",
  "speed-drills": "speed-building",
  "accuracy-drills": "advanced-fluency",
  "professional-practice": "advanced-fluency",
};

const orderedKeyboardStageIds = [
  "keyboard-introduction",
  "home-row",
  "finger-positioning",
  "left-hand-practice",
  "right-hand-practice",
  "top-row",
  "bottom-row",
  "common-letters",
  "common-words",
  "sentences",
  "paragraphs",
  "coding-symbols",
  "developer-typing",
  "speed-building",
  "advanced-fluency",
];

const RACE_TEXTS = [
  "Build a steady rhythm, keep your hands relaxed, and let every accurate word move you forward.",
  "Small, focused practice builds confidence. Stay comfortable and choose accuracy before speed.",
  "Clear thoughts deserve clear words. Keep your eyes ahead and your fingers light on every key.",
];
const RACE_ALIAS_PATTERN = /^[a-zA-Z0-9_-]{3,24}$/;
const MINIMUM_TIMED_PRACTICE_MS = 5_000;
const ACCURACY_GOAL_PERCENT = 95;

type PracticeRequest = {
  verseId: string;
  typedText: string;
  elapsedMs: number;
  startedAtMs: number;
  mode: "typing" | "memory" | "audio" | "keyboard" | "speed" | "accuracy" | "challenge";
  idempotencyKey: string;
  stageId?: string;
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
  return totalWords === 0
    ? 100
    : Math.round((previous[recalledWords.length] / totalWords) * 100);
}

function dateInTimezone(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function isConsecutive(previousDate: string, today: string) {
  const previous = new Date(`${previousDate}T00:00:00.000Z`);
  const tomorrowFromPrevious = new Date(previous);
  tomorrowFromPrevious.setUTCDate(tomorrowFromPrevious.getUTCDate() + 1);
  return tomorrowFromPrevious.toISOString().slice(0, 10) === today;
}

function normalizeStageIds(stageIds: unknown[]): string[] {
  return Array.from(
    new Set(
      stageIds
        .filter((id): id is string => typeof id === "string")
        .map((id) => legacyStageIds[id] ?? id)
        .filter((id) => orderedKeyboardStageIds.includes(id)),
    ),
  );
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
      !["typing", "memory", "audio", "keyboard", "speed", "accuracy", "challenge"].includes(data.mode ?? "") ||
      typeof data.idempotencyKey !== "string"
    ) {
      throw new HttpsError("invalid-argument", "The practice result is incomplete.");
    }
    const { verseId, typedText, elapsedMs, startedAtMs, idempotencyKey } = data;
    const mode = data.mode as PracticeRequest["mode"];
    const stageId =
      typeof data.stageId === "string" && keyboardStageIds.has(data.stageId)
        ? data.stageId
        : undefined;
    if (data.stageId !== undefined && !stageId) {
      throw new HttpsError("invalid-argument", "The typing stage is invalid.");
    }
    if ((mode === "keyboard") !== (stageId !== undefined)) {
      throw new HttpsError("invalid-argument", "Keyboard lessons require a valid stage.");
    }
    if (stageId && verseId !== keyboardStageLessonIds[stageId]) {
      throw new HttpsError("invalid-argument", "The lesson does not match the selected stage.");
    }
    if (idempotencyKey.length < 8 || idempotencyKey.length > 128) {
      throw new HttpsError("invalid-argument", "The practice key is invalid.");
    }
    if (elapsedMs < 0 || elapsedMs > 86_400_000 || typedText.length > 1_000) {
      throw new HttpsError("invalid-argument", "The practice result is outside its allowed limits.");
    }
    if (Date.now() - startedAtMs > 86_400_000 || startedAtMs > Date.now() + 60_000) {
      throw new HttpsError("failed-precondition", "This practice session expired.");
    }

    const expected = stageId ? keyboardStageTexts[stageId] : verses[verseId];
    if (!expected) {
      throw new HttpsError("not-found", "This practice passage is unavailable.");
    }
    const uid = request.auth.uid;
    const sessionRef = db.collection("users").doc(uid).collection("sessions").doc(idempotencyKey);

    return db.runTransaction(async (transaction) => {
      const existing = await transaction.get(sessionRef);
      if (existing.exists) return existing.data() as Record<string, unknown>;

      const now = Timestamp.now();
      const profileRef = db.collection("users").doc(uid);
      const summaryRef = profileRef.collection("progress").doc("summary");
      const [profile, summary] = await Promise.all([
        transaction.get(profileRef),
        transaction.get(summaryRef),
      ]);
      const profileData = profile.data() ?? {};
      const summaryData = summary.data() ?? {};
      const timezone = typeof profileData.timezone === "string" ? profileData.timezone : "UTC";
      const today = dateInTimezone(now.toDate(), timezone);
      const previousDate = typeof summaryData.lastActiveDate === "string" ? summaryData.lastActiveDate : null;
      const previousStreak = typeof summaryData.activeStreak === "number" ? summaryData.activeStreak : 0;
      const activeStreak =
        previousDate === today
          ? previousStreak
          : previousDate && isConsecutive(previousDate, today)
            ? previousStreak + 1
            : 1;
      const metrics = calculateMetrics(expected, typedText, elapsedMs);
      if (
        (mode === "accuracy" || mode === "challenge") &&
        metrics.accuracy < ACCURACY_GOAL_PERCENT
      ) {
        throw new HttpsError(
          "failed-precondition",
          `This practice requires at least ${ACCURACY_GOAL_PERCENT}% accuracy.`,
        );
      }
      if (mode === "challenge" && elapsedMs < MINIMUM_TIMED_PRACTICE_MS) {
        throw new HttpsError(
          "failed-precondition",
          "Daily challenges require at least five seconds of practice.",
        );
      }
      if (
        mode === "speed" &&
        metrics.wpm <
          Math.max(
            1,
            typeof summaryData.bestWpm === "number" ? summaryData.bestWpm : 0,
          )
      ) {
        throw new HttpsError(
          "failed-precondition",
          "Match or beat your current WPM baseline to complete speed practice.",
        );
      }
      const recallScore = mode === "memory" ? memoryScore(expected, typedText) : undefined;
      const xpEarned =
        (mode === "keyboard" ? 20 : 15) +
        (metrics.accuracy === 100 ? (mode === "keyboard" ? 30 : 10) : 0) +
        (mode === "memory" && (recallScore ?? 0) >= 70 ? 10 : 0) +
        (activeStreak > 0 && activeStreak % 7 === 0 ? 100 : 0);
      const previousXp = typeof summaryData.xp === "number" ? summaryData.xp : 0;
      const xp = previousXp + xpEarned;
      const previousStageIds = normalizeStageIds(
        Array.isArray(summaryData.completedKeyboardStageIds)
          ? summaryData.completedKeyboardStageIds
          : [],
      );
      const completedStageId = stageId ? legacyStageIds[stageId] ?? stageId : undefined;
      const stageIndex = completedStageId ? orderedKeyboardStageIds.indexOf(completedStageId) : -1;
      if (
        stageIndex > 0 &&
        !previousStageIds.includes(orderedKeyboardStageIds[stageIndex - 1])
      ) {
        throw new HttpsError(
          "failed-precondition",
          "Complete the previous typing lesson before continuing.",
        );
      }
      const completedKeyboardStageIds =
        completedStageId && metrics.accuracy >= 90
          ? Array.from(new Set([...previousStageIds, completedStageId]))
          : previousStageIds;
      const bestWpm = Math.max(
        typeof summaryData.bestWpm === "number" ? summaryData.bestWpm : 0,
        metrics.wpm,
      );
      const wordsTyped =
        (typeof summaryData.wordsTyped === "number" ? summaryData.wordsTyped : 0) +
        Math.max(1, Math.round(metrics.correctCharacters / 5));
      const perfectLessons =
        (typeof summaryData.perfectLessons === "number" ? summaryData.perfectLessons : 0) +
        (metrics.accuracy === 100 ? 1 : 0);
      const keyboardLessonsCompleted =
        (typeof summaryData.keyboardLessonsCompleted === "number"
          ? summaryData.keyboardLessonsCompleted
          : 0) + (mode === "keyboard" ? 1 : 0);
      const achievementIds = new Set<string>(
        Array.isArray(summaryData.achievementIds)
          ? summaryData.achievementIds.filter(
              (id: unknown): id is string => typeof id === "string",
            )
          : [],
      );
      if (keyboardLessonsCompleted > 0) achievementIds.add("first-lesson");
      if (completedKeyboardStageIds.includes("home-row")) achievementIds.add("home-row");
      if (completedKeyboardStageIds.includes("finger-positioning")) achievementIds.add("guided-learner");
      if (wordsTyped >= 100) achievementIds.add("100-words");
      if (wordsTyped >= 500) achievementIds.add("500-words");
      if (wordsTyped >= 1_000) achievementIds.add("1000-words");
      if (activeStreak >= 7) achievementIds.add("7-day-streak");
      if (activeStreak >= 30) achievementIds.add("30-day-streak");
      if (bestWpm >= 50) achievementIds.add("50-wpm");
      if (bestWpm >= 80) achievementIds.add("80-wpm");
      if (bestWpm >= 100) achievementIds.add("100-wpm");
      if (perfectLessons > 0) achievementIds.add("accuracy-master");
      if (completedKeyboardStageIds.includes("coding-symbols")) achievementIds.add("coding-champion");
      if (completedKeyboardStageIds.length >= orderedKeyboardStageIds.length) achievementIds.add("typing-god");
      const newAchievementIds = Array.from(achievementIds).filter(
        (id) =>
          !(
            Array.isArray(summaryData.achievementIds) &&
            summaryData.achievementIds.includes(id)
          ),
      );
      const achievementRefs = newAchievementIds.map((id) =>
        profileRef.collection("achievements").doc(id),
      );
      const existingAchievements = await Promise.all(
        achievementRefs.map((ref) => transaction.get(ref)),
      );
      const unlockedAchievements = newAchievementIds.flatMap((id, index) =>
        existingAchievements[index].exists ? [] : [id],
      );
      const achievementTime = now;
      unlockedAchievements.forEach((id) => {
        transaction.set(profileRef.collection("achievements").doc(id), {
          unlockedAt: achievementTime,
          sourceSessionId: idempotencyKey,
        });
      });
      const result = {
        sessionId: idempotencyKey,
        xpEarned,
        activeStreak,
        metrics,
        unlockedAchievements,
        ...(recallScore === undefined ? {} : { memoryScore: recallScore }),
      };

      transaction.set(sessionRef, {
        verseId,
        mode,
        completedAt: now,
        xpEarned,
        activeStreak,
        metrics,
        ...(recallScore === undefined ? {} : { memoryScore: recallScore }),
        ...(completedStageId === undefined ? {} : { stageId: completedStageId }),
      });
      transaction.set(
        summaryRef,
        {
          xp,
          level: Math.min(100, Math.floor(xp / 500) + 1),
          activeStreak,
          lastActiveDate: today,
          completedKeyboardStageIds,
          bestWpm,
          wordsTyped,
          perfectLessons,
          keyboardLessonsCompleted,
          achievementIds: Array.from(achievementIds),
          updatedAt: now,
        },
        { merge: true },
      );
      transaction.set(profileRef, { updatedAt: now }, { merge: true });

      logger.info("Practice completed", { uid, verseId, xpEarned });
      return result;
    });
  },
);

type RaceRequest = {
  raceId: string;
  typedText: string;
  elapsedMs: number;
  alias: string;
};

function raceDate(raceId: string): string | null {
  const match = /^(?:global|group-[A-Za-z0-9_-]{1,64})-(\d{4}-\d{2}-\d{2})$/.exec(raceId);
  if (!match) return null;
  const timestamp = Date.parse(`${match[1]}T00:00:00.000Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === match[1]
    ? match[1]
    : null;
}

function getRaceChallenge(date: string): string {
  const day = new Date(`${date}T00:00:00.000Z`).getUTCDate();
  return RACE_TEXTS[day % RACE_TEXTS.length];
}

function parseRaceScope(
  raceId: string,
): { scope: "global" } | { scope: "group"; groupId: string } {
  if (raceId.startsWith("global-")) return { scope: "global" };
  const match = /^group-([A-Za-z0-9_-]{1,64})-\d{4}-\d{2}-\d{2}$/.exec(raceId);
  if (match) return { scope: "group", groupId: match[1] };
  throw new HttpsError("invalid-argument", "This race is unavailable.");
}

export const updateRaceSettings = onCall(
  { region: "us-central1", enforceAppCheck: true },
  async (request): Promise<Record<string, unknown>> => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign in to update race settings.");
    }
    const data = request.data as { alias?: unknown; globalOptIn?: unknown };
    if (
      typeof data.alias !== "string" ||
      !RACE_ALIAS_PATTERN.test(data.alias) ||
      typeof data.globalOptIn !== "boolean"
    ) {
      throw new HttpsError("invalid-argument", "Choose a 3–24 character alias and race visibility.");
    }
    const uid = request.auth.uid;
    const userRef = db.collection("users").doc(uid);
    const globalResultRef = db.collection("globalRaceResults").doc(uid);
    await db.runTransaction(async (transaction) => {
      const currentGlobalResult = await transaction.get(globalResultRef);
      transaction.set(
        userRef,
        {
          raceSettings: {
            alias: data.alias,
            globalOptIn: data.globalOptIn,
            updatedAt: Timestamp.now(),
          },
        },
        { merge: true },
      );
      if (!data.globalOptIn && currentGlobalResult.exists) {
        transaction.delete(globalResultRef);
      } else if (data.globalOptIn && currentGlobalResult.exists) {
        transaction.set(
          globalResultRef,
          { alias: data.alias, optedIn: true },
          { merge: true },
        );
      }
    });
    return { alias: data.alias, globalOptIn: data.globalOptIn };
  },
);

export const submitRaceResult = onCall(
  { region: "us-central1", enforceAppCheck: true },
  async (request): Promise<Record<string, unknown>> => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign in to enter a typing race.");
    }
    const data = request.data as Partial<RaceRequest>;
    if (
      typeof data.raceId !== "string" ||
      typeof data.typedText !== "string" ||
      typeof data.elapsedMs !== "number" ||
      typeof data.alias !== "string" ||
      !RACE_ALIAS_PATTERN.test(data.alias)
    ) {
      throw new HttpsError("invalid-argument", "The race result is incomplete.");
    }
    const date = raceDate(data.raceId);
    if (!date) throw new HttpsError("invalid-argument", "This race is unavailable.");
    if (date !== new Date().toISOString().slice(0, 10)) {
      throw new HttpsError("failed-precondition", "Only today's race accepts submissions.");
    }
    if (data.elapsedMs < 5_000 || data.elapsedMs > 86_400_000) {
      throw new HttpsError("failed-precondition", "The race duration is invalid.");
    }
    const scope = parseRaceScope(data.raceId);
    const expectedText = getRaceChallenge(date);
    if (data.typedText.length !== expectedText.length) {
      throw new HttpsError("failed-precondition", "Complete the race text before submitting.");
    }
    const metrics = calculateMetrics(expectedText, data.typedText, data.elapsedMs);
    if (metrics.accuracy < 90) {
      throw new HttpsError("failed-precondition", "Race results require at least 90% accuracy.");
    }

    const uid = request.auth.uid;
    const profileRef = db.collection("users").doc(uid);
    const profile = await profileRef.get();
    const raceSettings = profile.data()?.raceSettings;
    if (!raceSettings || raceSettings.alias !== data.alias) {
      throw new HttpsError("failed-precondition", "Save your race alias before entering.");
    }
    if (scope.scope === "global" && raceSettings.globalOptIn !== true) {
      throw new HttpsError(
        "permission-denied",
        "Turn on global race visibility in settings to appear in public rankings.",
      );
    }
    if (scope.scope === "group") {
      const member = await db
        .collection("groups")
        .doc(scope.groupId)
        .collection("members")
        .doc(uid)
        .get();
      if (!member.exists) {
        throw new HttpsError("permission-denied", "Join this invited group before racing.");
      }
    }

    const resultRef = db.collection("races").doc(data.raceId).collection("results").doc(uid);
    await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(resultRef);
      const previousWpm = existing.data()?.wpm;
      if (typeof previousWpm === "number" && previousWpm >= metrics.wpm) return;
      const result = {
        uid,
        alias: data.alias,
        wpm: metrics.wpm,
        accuracy: metrics.accuracy,
        elapsedSeconds: metrics.elapsedSeconds,
        completedAt: Timestamp.now(),
      };
      transaction.set(resultRef, result);
      if (scope.scope === "global") {
        transaction.set(
          db.collection("globalRaceResults").doc(uid),
          { ...result, raceId: data.raceId, optedIn: true },
        );
      }
    });
    return {
      wpm: metrics.wpm,
      accuracy: metrics.accuracy,
      elapsedSeconds: metrics.elapsedSeconds,
    };
  },
);

type LeaderboardRequest = {
  raceId?: string;
};

export const getRaceLeaderboard = onCall(
  { region: "us-central1", enforceAppCheck: true },
  async (request): Promise<Record<string, unknown>> => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign in to view race results.");
    }
    const data = request.data as Partial<LeaderboardRequest>;
    const raceId =
      typeof data.raceId === "string"
        ? data.raceId
        : `global-${new Date().toISOString().slice(0, 10)}`;
    const date = raceDate(raceId);
    if (!date) {
      throw new HttpsError("invalid-argument", "This race is unavailable.");
    }
    if (date !== new Date().toISOString().slice(0, 10)) {
      throw new HttpsError("failed-precondition", "Only today's race results are available.");
    }
    const scope = parseRaceScope(raceId);
    if (scope.scope === "group") {
      const member = await db
        .collection("groups")
        .doc(scope.groupId)
        .collection("members")
        .doc(request.auth.uid)
        .get();
      if (!member.exists) {
        throw new HttpsError("permission-denied", "Join this invited group to view its race.");
      }
    }
    const snapshot =
      scope.scope === "global"
        ? await db
            .collection("globalRaceResults")
            .where("raceId", "==", raceId)
            .orderBy("wpm", "desc")
            .limit(50)
            .get()
        : await db
            .collection("races")
            .doc(raceId)
            .collection("results")
            .orderBy("wpm", "desc")
            .limit(50)
            .get();
    const entries = snapshot.docs.map((entry) => {
      const result = entry.data();
      return {
        alias:
          typeof result.alias === "string" ? result.alias : "ScriptType Learner",
        wpm: typeof result.wpm === "number" ? result.wpm : 0,
        accuracy: typeof result.accuracy === "number" ? result.accuracy : 0,
      };
    });
    return { entries };
  },
);
