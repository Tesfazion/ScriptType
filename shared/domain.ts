export type TypingMetrics = {
  wpm: number;
  accuracy: number;
  elapsedSeconds: number;
  mistakeCount: number;
  correctCharacters: number;
  totalCharacters: number;
};

export type MemoryMetrics = {
  score: number;
  recalledWords: number;
  totalWords: number;
};

export type LevelProgress = {
  level: number;
  rank: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
};

const RANKS = [
  { level: 50, name: "Kingdom Scribe" },
  { level: 20, name: "Scripture Warrior" },
  { level: 10, name: "Faith Builder" },
  { level: 5, name: "Disciple" },
  { level: 1, name: "Seeker" },
];

export function calculateTypingMetrics(
  expected: string,
  actual: string,
  elapsedMs: number,
): TypingMetrics {
  const elapsedSeconds = Math.max(0, elapsedMs / 1000);
  const comparedLength = Math.min(expected.length, actual.length);
  let correctCharacters = 0;

  for (let index = 0; index < comparedLength; index += 1) {
    if (expected[index] === actual[index]) correctCharacters += 1;
  }

  const totalCharacters = Math.max(expected.length, actual.length);
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

function normalizeWords(text: string): string[] {
  return text
    .toLocaleLowerCase("en")
    .replace(/[^\p{L}\p{N}\s']/gu, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function calculateMemoryMetrics(
  expected: string,
  recalled: string,
): MemoryMetrics {
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
  const recalledCount = previous[recalledWords.length];

  return {
    score:
      totalWords === 0 ? 100 : Math.round((recalledCount / totalWords) * 100),
    recalledWords: recalledCount,
    totalWords,
  };
}

export function getLevelProgress(totalXp: number): LevelProgress {
  const xp = Math.max(0, Math.floor(totalXp));
  const level = Math.min(100, Math.floor(Math.sqrt(xp / 100)) + 1);
  const currentLevelXp = (level - 1) ** 2 * 100;
  const nextLevelXp = level === 100 ? currentLevelXp : level ** 2 * 100;
  const rank = RANKS.find((item) => level >= item.level)?.name ?? "Seeker";
  const progressPercent =
    level === 100
      ? 100
      : Math.min(
          100,
          Math.floor(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100),
        );

  return { level, rank, currentLevelXp, nextLevelXp, progressPercent };
}

export function calculateSessionXp({
  isPerfect,
  isMemory,
  streak,
}: {
  isPerfect: boolean;
  isMemory: boolean;
  streak: number;
}): number {
  return 15 + (isPerfect ? 10 : 0) + (isMemory ? 10 : 0) + (streak > 0 && streak % 7 === 0 ? 5 : 0);
}

export function dateInTimezone(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function nextActiveStreak(
  previousDate: string | null,
  today: string,
  previousStreak: number,
): number {
  if (!previousDate) return 1;
  if (previousDate === today) return previousStreak;

  const previous = new Date(`${previousDate}T00:00:00.000Z`);
  const yesterday = new Date(`${today}T00:00:00.000Z`);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  return previous.getTime() === yesterday.getTime() ? previousStreak + 1 : 1;
}
