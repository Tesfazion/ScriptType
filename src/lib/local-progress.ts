import {
  calculateSessionXp,
  dateInTimezone,
  getLevelProgress,
  nextActiveStreak,
  type TypingMetrics,
} from "../../shared/domain";
import { normalizeCompletedStageIds } from "../../shared/typing-curriculum";

export type PracticeMode =
  | "typing"
  | "memory"
  | "audio"
  | "keyboard"
  | "race"
  | "speed"
  | "accuracy"
  | "challenge";

export type PracticeSession = TypingMetrics & {
  id: string;
  verseId: string;
  completedAt: string;
  xpEarned: number;
  activeStreak: number;
  mode: PracticeMode;
  memoryScore?: number;
  stageId?: string;
  syncStatus?: "pending" | "blocked" | "device";
};

export type LocalProgress = {
  xp: number;
  activeStreak: number;
  lastActiveDate: string | null;
  weeklyGoal: number;
  weekStart: string;
  qualifiedDates: string[];
  sessions: PracticeSession[];
  completedVerseIds: string[];
  updatedAt: string;
  completedKeyboardStageIds: string[];
  bestWpm: number;
  wordsTyped: number;
  perfectLessons: number;
};

const STORAGE_KEY = "scripttype.device-progress.v1";
const DEFAULT_WEEKLY_GOAL = 5;
const LEGACY_MAX_WEEKLY_GOAL = 14;
export const MAX_WEEKLY_GOAL = 7;

export function normalizeWeeklyGoal(goal: number): number {
  if (
    !Number.isInteger(goal) ||
    goal < 1 ||
    goal > LEGACY_MAX_WEEKLY_GOAL
  ) {
    throw new Error("Saved weekly goal must be between 1 and 14 practice days.");
  }
  return Math.min(goal, MAX_WEEKLY_GOAL);
}

function currentTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function startOfWeek(date: string): string {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  const day = parsed.getUTCDay();
  parsed.setUTCDate(parsed.getUTCDate() - ((day + 6) % 7));
  return parsed.toISOString().slice(0, 10);
}

function isLocalProgress(value: unknown): value is LocalProgress {
  if (!value || typeof value !== "object") return false;
  const progress = value as Partial<LocalProgress>;
  return (
    typeof progress.xp === "number" &&
    typeof progress.activeStreak === "number" &&
    Array.isArray(progress.sessions) &&
    Array.isArray(progress.completedVerseIds) &&
    Array.isArray(progress.qualifiedDates) &&
    typeof progress.weeklyGoal === "number" &&
    Number.isInteger(progress.weeklyGoal) &&
    progress.weeklyGoal >= 1 &&
    progress.weeklyGoal <= LEGACY_MAX_WEEKLY_GOAL &&
    typeof progress.weekStart === "string" &&
    typeof progress.updatedAt === "string"
  );
}

function emptyProgress(): LocalProgress {
  const today = dateInTimezone(new Date(), currentTimeZone());
  return {
    xp: 0,
    activeStreak: 0,
    lastActiveDate: null,
    weeklyGoal: DEFAULT_WEEKLY_GOAL,
    weekStart: startOfWeek(today),
    qualifiedDates: [],
    sessions: [],
    completedVerseIds: [],
    updatedAt: new Date().toISOString(),
    completedKeyboardStageIds: [],
    bestWpm: 0,
    wordsTyped: 0,
    perfectLessons: 0,
  };
}

export function readLocalProgress(): LocalProgress {
  if (typeof window === "undefined") return emptyProgress();

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return emptyProgress();

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    throw new Error(
      "Saved device progress could not be read. Clear ScriptType device data in your browser settings to start fresh.",
    );
  }

  if (!isLocalProgress(parsed)) {
    throw new Error(
      "Saved device progress has an unsupported format. Clear ScriptType device data in your browser settings to start fresh.",
    );
  }

  return {
    ...parsed,
    weeklyGoal: normalizeWeeklyGoal(parsed.weeklyGoal),
    completedKeyboardStageIds: normalizeCompletedStageIds(
      Array.isArray(parsed.completedKeyboardStageIds)
        ? parsed.completedKeyboardStageIds
        : [],
    ),
  };
}

export function saveLocalProgress(progress: LocalProgress): void {
  if (typeof window === "undefined") {
    throw new Error("Device progress can only be saved in a browser.");
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getProgressSummary(progress: LocalProgress) {
  const today = dateInTimezone(new Date(), currentTimeZone());
  const weekStart = startOfWeek(today);
  const currentWeekDates =
    progress.weekStart === weekStart ? progress.qualifiedDates : [];
  const sessions = progress.sessions;
  const memorySessions = sessions.filter((session) => session.mode === "memory");
  const averageWpm =
    sessions.length === 0
      ? 0
      : Math.round(
          sessions.reduce((total, session) => total + session.wpm, 0) /
            sessions.length,
        );
  const averageAccuracy =
    sessions.length === 0
      ? 0
      : Math.round(
          (sessions.reduce((total, session) => total + session.accuracy, 0) /
            sessions.length) *
            10,
        ) / 10;

  return {
    level: getLevelProgress(progress.xp),
    activeStreak: progress.activeStreak,
    weeklyGoal: progress.weeklyGoal,
    weeklySessions: currentWeekDates.length,
    versesCompleted: new Set(sessions.map((session) => session.verseId)).size,
    chaptersCompleted: 0,
    averageWpm,
    averageAccuracy,
    memorySessions,
    sessions,
  };
}

export function recordLocalSession({
  verseId,
  metrics,
  mode,
  memoryScore,
  stageId,
}: {
  verseId: string;
  metrics: TypingMetrics;
  mode: PracticeMode;
  memoryScore?: number;
  stageId?: string;
}): PracticeSession {
  const progress = readLocalProgress();
  const now = new Date();
  const today = dateInTimezone(now, currentTimeZone());
  const weekStart = startOfWeek(today);
  const activeStreak = nextActiveStreak(
    progress.lastActiveDate,
    today,
    progress.activeStreak,
  );
  const xpEarned = calculateSessionXp({
    isPerfect: metrics.accuracy === 100,
    isMemory: mode === "memory" && (memoryScore ?? 0) >= 70,
    streak: activeStreak,
    isKeyboardLesson: mode === "keyboard",
  });
  const session: PracticeSession = {
    ...metrics,
    id: crypto.randomUUID(),
    verseId,
    completedAt: now.toISOString(),
    xpEarned,
    activeStreak,
    mode,
    syncStatus: "device",
    ...(memoryScore === undefined ? {} : { memoryScore }),
    ...(stageId === undefined ? {} : { stageId }),
  };
  const qualifiedDates =
    progress.weekStart === weekStart ? [...progress.qualifiedDates] : [];
  if (!qualifiedDates.includes(today)) qualifiedDates.push(today);

  saveLocalProgress({
    ...progress,
    xp: progress.xp + xpEarned,
    activeStreak,
    lastActiveDate: today,
    weekStart,
    qualifiedDates,
    sessions: [session, ...progress.sessions].slice(0, 500),
    completedVerseIds: Array.from(
      new Set([...progress.completedVerseIds, verseId]),
    ),
    updatedAt: now.toISOString(),
    completedKeyboardStageIds:
      stageId && mode === "keyboard" && metrics.accuracy >= 90
        ? Array.from(new Set([...(progress.completedKeyboardStageIds ?? []), stageId]))
        : (progress.completedKeyboardStageIds ?? []),
    bestWpm: Math.max(progress.bestWpm ?? 0, metrics.wpm),
    wordsTyped: (progress.wordsTyped ?? 0) + Math.max(1, Math.round(metrics.correctCharacters / 5)),
    perfectLessons: (progress.perfectLessons ?? 0) + (metrics.accuracy === 100 ? 1 : 0),
  });

  return session;
}

export function setLocalWeeklyGoal(goal: number): void {
  if (!Number.isInteger(goal) || goal < 1 || goal > MAX_WEEKLY_GOAL) {
    throw new Error("Weekly goal must be between 1 and 7 practice days.");
  }
  const progress = readLocalProgress();
  saveLocalProgress({
    ...progress,
    weeklyGoal: goal,
    updatedAt: new Date().toISOString(),
  });
}
