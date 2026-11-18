import type { PracticeSession } from "@/lib/local-progress";

export type ProgressView = {
  xp: number;
  activeStreak: number;
  weeklyGoal: number;
  weeklySessions: number;
  qualifiedDates: string[];
  versesCompleted: number;
  chaptersCompleted: number;
  averageWpm: number;
  averageAccuracy: number;
  averageMemoryScore: number | null;
  completedVerseIds: string[];
  sessions: PracticeSession[];
  completedKeyboardStageIds?: string[];
  bestWpm?: number;
  wordsTyped?: number;
  perfectLessons?: number;
  pendingSyncCount: number;
  achievementIds: string[];
  cacheWarning?: string;
};
