import {
  normalizeCompletedStageIds,
  typingStages,
  type TypingStage,
} from "./typing-curriculum";

export type TypingRank = {
  level: number;
  name: string;
};

export type TypingLevelProgress = {
  level: number;
  rank: string;
  xpInLevel: number;
  xpNeeded: number;
  progressPercent: number;
};

export type TypingBadge = {
  id: string;
  name: string;
  description: string;
};

export const typingRanks: TypingRank[] = [
  { level: 50, name: "ScriptType Legend" },
  { level: 30, name: "Keyboard Master" },
  { level: 20, name: "Typing Warrior" },
  { level: 10, name: "Speed Learner" },
  { level: 5, name: "Keyboard Explorer" },
  { level: 1, name: "Typing Novice" },
];

export const typingBadges: TypingBadge[] = [
  { id: "first-lesson", name: "First Lesson", description: "Complete your first typing lesson." },
  { id: "home-row", name: "Home Row Hero", description: "Complete the home row lesson." },
  { id: "guided-learner", name: "Guided Learner", description: "Complete the finger placement lesson." },
  { id: "100-words", name: "First 100 Words", description: "Type 100 total words." },
  { id: "500-words", name: "500 Words Typed", description: "Type 500 total words." },
  { id: "1000-words", name: "1000 Words Typed", description: "Type 1,000 total words." },
  { id: "7-day-streak", name: "7-Day Streak", description: "Practice for 7 consecutive days." },
  { id: "30-day-streak", name: "30-Day Streak", description: "Practice for 30 consecutive days." },
  { id: "50-wpm", name: "50 WPM", description: "Reach 50 words per minute." },
  { id: "80-wpm", name: "80 WPM", description: "Reach 80 words per minute." },
  { id: "100-wpm", name: "100 WPM", description: "Reach 100 words per minute." },
  { id: "accuracy-master", name: "Accuracy Master", description: "Complete a lesson with 100% accuracy." },
  { id: "coding-champion", name: "Coding Champion", description: "Complete the coding practice stage." },
  { id: "typing-god", name: "Fluent Foundations", description: "Complete all 15 typing lessons." },
];

export function getTypingLevelProgress(totalXp: number): TypingLevelProgress {
  const xp = Math.max(0, Math.floor(totalXp));
  const level = Math.max(1, Math.floor(xp / 500) + 1);
  const xpInLevel = xp % 500;
  const rank =
    [...typingRanks]
      .sort((a, b) => b.level - a.level)
      .find((item) => level >= item.level)?.name ?? "Typing Novice";

  return {
    level,
    rank,
    xpInLevel,
    xpNeeded: 500,
    progressPercent: Math.min(100, Math.floor((xpInLevel / 500) * 100)),
  };
}

export function getNextTypingStage(completedStageIds: string[]): TypingStage | null {
  const completed = new Set(normalizeCompletedStageIds(completedStageIds));
  return typingStages.find((stage) => !completed.has(stage.id)) ?? null;
}

export function isTypingStageUnlocked(stageNumber: number, completedStageIds: string[]): boolean {
  if (stageNumber <= 1) return true;
  const previousStage = typingStages.find((stage) => stage.number === stageNumber - 1);
  return previousStage
    ? normalizeCompletedStageIds(completedStageIds).includes(previousStage.id)
    : false;
}

export function getTypingBadgeIds({
  completedLessons,
  completedStageIds,
  streak,
  bestWpm,
  perfectLessons,
  wordsTyped,
}: {
  completedLessons: number;
  completedStageIds: string[];
  streak: number;
  bestWpm: number;
  perfectLessons: number;
  wordsTyped: number;
}): string[] {
  const normalizedStageIds = normalizeCompletedStageIds(completedStageIds);
  const unlocked = new Set<string>();
  if (completedLessons > 0) unlocked.add("first-lesson");
  if (normalizedStageIds.includes("home-row")) unlocked.add("home-row");
  if (normalizedStageIds.includes("finger-positioning")) unlocked.add("guided-learner");
  if (wordsTyped >= 100) unlocked.add("100-words");
  if (wordsTyped >= 500) unlocked.add("500-words");
  if (wordsTyped >= 1000) unlocked.add("1000-words");
  if (streak >= 7) unlocked.add("7-day-streak");
  if (streak >= 30) unlocked.add("30-day-streak");
  if (bestWpm >= 50) unlocked.add("50-wpm");
  if (bestWpm >= 80) unlocked.add("80-wpm");
  if (bestWpm >= 100) unlocked.add("100-wpm");
  if (perfectLessons > 0) unlocked.add("accuracy-master");
  if (normalizedStageIds.includes("coding-symbols")) unlocked.add("coding-champion");
  if (normalizedStageIds.length >= typingStages.length) unlocked.add("typing-god");
  return [...unlocked];
}
