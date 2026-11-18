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
};

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
    !["typing", "memory", "audio"].includes(value.mode)
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
  const [summarySnapshot, sessionsSnapshot] = await Promise.all([
    getDoc(summaryRef),
    getDocs(
      query(
        collection(firestore, "users", uid, "sessions"),
        orderBy("completedAt", "desc"),
        limit(100),
      ),
    ),
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

  if (!summarySnapshot.exists() && sessions.length === 0) return EMPTY_PROGRESS;

  return {
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
  };
}
