import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import type { PracticeSession } from "@/lib/local-progress";
import type { ProgressView } from "@/lib/progress-types";
import { normalizeCompletedStageIds } from "../../shared/typing-curriculum";

const EMPTY_PROGRESS: ProgressView = {
  xp: 0,
  activeStreak: 0,
  weeklyGoal: 5,
  weeklySessions: 0,
  qualifiedDates: [],
  versesCompleted: 0,
  chaptersCompleted: 0,
  averageWpm: 0,
  averageAccuracy: 0,
  averageMemoryScore: null,
  completedVerseIds: [],
  sessions: [],
  completedKeyboardStageIds: [],
  bestWpm: 0,
  wordsTyped: 0,
  perfectLessons: 0,
  pendingSyncCount: 0,
  achievementIds: [],
};
const ACCOUNT_CACHE_KEY = "scripttype.account-progress.v1";

function isCachedSession(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const session = value as Partial<PracticeSession>;
  return (
    typeof session.id === "string" &&
    typeof session.verseId === "string" &&
    typeof session.completedAt === "string" &&
    typeof session.wpm === "number" &&
    typeof session.accuracy === "number"
  );
}

function isCachedProgress(value: unknown): value is ProgressView {
  if (!value || typeof value !== "object") return false;
  const progress = value as Partial<ProgressView>;
  return (
    typeof progress.xp === "number" &&
    typeof progress.activeStreak === "number" &&
    typeof progress.weeklyGoal === "number" &&
    Array.isArray(progress.qualifiedDates) &&
    Array.isArray(progress.completedVerseIds) &&
    Array.isArray(progress.sessions) &&
    progress.sessions.every(isCachedSession) &&
    (progress.achievementIds === undefined ||
      Array.isArray(progress.achievementIds)) &&
    typeof progress.averageWpm === "number" &&
    typeof progress.averageAccuracy === "number"
  );
}

function cacheAccountProgress(uid: string, progress: ProgressView): ProgressView {
  if (typeof window === "undefined") return progress;
  try {
    window.localStorage.setItem(
      `${ACCOUNT_CACHE_KEY}.${uid}`,
      JSON.stringify(progress),
    );
    return progress;
  } catch {
    return {
      ...progress,
      cacheWarning: "Account progress loaded, but this device could not save an offline copy.",
    };
  }

}

export function readCachedAccountProgress(uid: string): ProgressView | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(`${ACCOUNT_CACHE_KEY}.${uid}`);
  if (!stored) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    throw new Error("The offline copy of account progress could not be read.");
  }
  if (!isCachedProgress(parsed)) {
    throw new Error("The offline copy of account progress has an unsupported format.");
  }
  return {
    ...parsed,
    achievementIds: parsed.achievementIds ?? [],
  };
}

function numberField(
  value: unknown,
  fieldName: string,
  fallback = 0,
): number {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`Account progress contains an invalid ${fieldName} value.`);
  }
  return value;
}

function sessionFromDocument(
  id: string,
  value: Record<string, unknown>,
): PracticeSession | null {
  const metrics = value.metrics;
  if (!metrics || typeof metrics !== "object") return null;
  const metricValues = metrics as Record<string, unknown>;
  if (
    typeof value.verseId !== "string" ||
    typeof value.mode !== "string" ||
    !["typing", "memory", "audio", "keyboard", "speed", "accuracy", "challenge"].includes(value.mode)
  ) {
    return null;
  }
  const completedAt =
    value.completedAt instanceof Timestamp
      ? value.completedAt.toDate().toISOString()
      : typeof value.completedAt === "string"
        ? value.completedAt
        : "";
  if (!completedAt) return null;

  return {
    id,
    verseId: value.verseId,
    mode: value.mode as PracticeSession["mode"],
    completedAt,
    xpEarned: numberField(value.xpEarned, "session XP"),
    activeStreak: numberField(value.activeStreak, "session streak"),
    wpm: numberField(metricValues.wpm, "session WPM"),
    accuracy: numberField(metricValues.accuracy, "session accuracy"),
    elapsedSeconds: numberField(metricValues.elapsedSeconds, "session duration"),
    mistakeCount: numberField(metricValues.mistakeCount, "session mistakes"),
    correctCharacters: numberField(metricValues.correctCharacters, "correct character count"),
    totalCharacters: numberField(metricValues.totalCharacters, "total character count"),
    ...(typeof value.memoryScore === "number"
      ? { memoryScore: numberField(value.memoryScore, "memory score") }
      : {}),
    ...(typeof value.stageId === "string" ? { stageId: value.stageId } : {}),
  };
}

function startOfWeek(date: string): string {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  parsed.setUTCDate(parsed.getUTCDate() - ((parsed.getUTCDay() + 6) % 7));
  return parsed.toISOString().slice(0, 10);
}

export async function readAccountProgress(uid: string): Promise<ProgressView> {
  if (!firestore) {
    throw new Error("Account progress is unavailable because Firebase is not configured.");
  }

  const summaryRef = doc(firestore, "users", uid, "progress", "summary");
  const [summarySnapshot, sessionsSnapshot, achievementsSnapshot] = await Promise.all([
    getDoc(summaryRef),
    getDocs(
      query(
        collection(firestore, "users", uid, "sessions"),
        orderBy("completedAt", "desc"),
        limit(100),
      ),
    ),
    getDocs(collection(firestore, "users", uid, "achievements")),
  ]);
  const sessions = sessionsSnapshot.docs
    .map((item) => sessionFromDocument(item.id, item.data()))
    .filter((session): session is PracticeSession => session !== null);
  const data = summarySnapshot.exists() ? summarySnapshot.data() : {};
  const completedVerseIds = Array.from(new Set(sessions.map((item) => item.verseId)));
  const qualifiedDates = Array.isArray(data.qualifiedDates)
    ? data.qualifiedDates.filter((date): date is string => typeof date === "string")
    : [];
  const weekStart =
    typeof data.weekStart === "string"
      ? data.weekStart
      : startOfWeek(new Date().toISOString().slice(0, 10));
  const thisWeekStart = startOfWeek(new Date().toISOString().slice(0, 10));
  const weeklySessions =
    weekStart === thisWeekStart
      ? new Set(qualifiedDates).size
      : 0;
  const memorySessions = sessions.filter((item) => item.memoryScore !== undefined);
  const computedWpm =
    sessions.length === 0
      ? 0
      : Math.round(sessions.reduce((sum, item) => sum + item.wpm, 0) / sessions.length);
  const computedAccuracy =
    sessions.length === 0
      ? 0
      : Math.round(
          (sessions.reduce((sum, item) => sum + item.accuracy, 0) /
            sessions.length) *
            10,
        ) / 10;

  if (!summarySnapshot.exists() && sessions.length === 0) {
    return cacheAccountProgress(uid, EMPTY_PROGRESS);
  }

  return cacheAccountProgress(uid, {
    xp: numberField(data.xp, "XP"),
    activeStreak: numberField(data.activeStreak, "active streak"),
    weeklyGoal: numberField(data.weeklyGoal, "weekly goal", 5),
    weeklySessions,
    qualifiedDates,
    versesCompleted: numberField(data.versesCompleted, "completed verses", completedVerseIds.length),
    chaptersCompleted: numberField(data.chaptersCompleted, "completed chapters"),
    averageWpm: numberField(data.averageWpm, "average WPM", computedWpm),
    averageAccuracy: numberField(data.averageAccuracy, "average accuracy", computedAccuracy),
    averageMemoryScore:
      memorySessions.length === 0
        ? null
        : Math.round(
            memorySessions.reduce((sum, item) => sum + (item.memoryScore ?? 0), 0) /
              memorySessions.length,
          ),
    completedVerseIds,
    sessions,
    completedKeyboardStageIds: Array.isArray(data.completedKeyboardStageIds)
      ? normalizeCompletedStageIds(data.completedKeyboardStageIds)
      : [],
    bestWpm: numberField(data.bestWpm, "best WPM"),
    wordsTyped: numberField(data.wordsTyped, "words typed"),
    perfectLessons: numberField(data.perfectLessons, "perfect lessons"),
    pendingSyncCount: 0,
    achievementIds: achievementsSnapshot.docs.map((achievement) => achievement.id),
  });
}
