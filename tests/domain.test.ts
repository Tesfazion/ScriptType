import { describe, expect, it } from "vitest";
import {
  calculateMemoryMetrics,
  calculateSessionXp,
  calculateTypingMetrics,
  dateInTimezone,
  getLevelProgress,
  nextActiveStreak,
} from "../shared/domain";
import {
  getKeyboardGuidance,
  normalizeCompletedStageIds,
  typingStages,
} from "../shared/typing-curriculum";
import {
  getNextTypingStage,
  getTypingBadgeIds,
  getTypingLevelProgress,
  isTypingStageUnlocked,
} from "../shared/typing-progress";
import { resolvePreference } from "../shared/account-preferences";
import { normalizeWeeklyGoal } from "../src/lib/local-progress";

describe("typing metrics", () => {
  it("calculates WPM, accuracy, elapsed time, and mistakes", () => {
    const result = calculateTypingMetrics("hello world", "hello worle", 30_000);
    expect(result).toEqual({
      wpm: 4,
      accuracy: 90.9,
      elapsedSeconds: 30,
      mistakeCount: 1,
      correctCharacters: 10,
      totalCharacters: 11,
    });
  });

  it("does not produce a WPM result for a session shorter than five seconds", () => {
    expect(calculateTypingMetrics("word", "word", 4_999).wpm).toBe(0);
  });
});

describe("memory scoring", () => {
  it("normalizes punctuation and case while preserving recall order", () => {
    expect(calculateMemoryMetrics("Thy word is a lamp.", "thy WORD is a lamp").score).toBe(100);
    expect(calculateMemoryMetrics("one two three", "three two one").score).toBe(33);
  });
});

describe("progression", () => {
  it("limits legacy weekly goals to the seven days available in a week", () => {
    expect(normalizeWeeklyGoal(7)).toBe(7);
    expect(normalizeWeeklyGoal(14)).toBe(7);
    expect(() => normalizeWeeklyGoal(0)).toThrow();
  });

  it("resolves level thresholds and rank milestones", () => {
    expect(getLevelProgress(400)).toMatchObject({ level: 3, rank: "Seeker", progressPercent: 0 });
    expect(getLevelProgress(2_500).rank).toBe("Disciple");
    expect(getLevelProgress(10_000).rank).toBe("Faith Builder");
  });

  it("awards streak XP only at a seven-day milestone", () => {
    expect(calculateSessionXp({ isPerfect: true, isMemory: true, streak: 7 })).toBe(135);
    expect(calculateSessionXp({ isPerfect: false, isMemory: false, streak: 6 })).toBe(15);
  });

  it("counts a same-day activity once and extends only an adjacent-day streak", () => {
    expect(nextActiveStreak("2026-11-16", "2026-11-17", 6)).toBe(7);
    expect(nextActiveStreak("2026-11-15", "2026-11-17", 6)).toBe(1);
    expect(nextActiveStreak("2026-11-17", "2026-11-17", 7)).toBe(7);
  });

  it("uses the supplied timezone when calculating the active date", () => {
    const instant = new Date("2026-11-17T00:30:00.000Z");
    expect(dateInTimezone(instant, "America/Los_Angeles")).toBe("2026-11-16");
  });
});

describe("typing progression", () => {
  it("uses the requested 15-stage learning order", () => {
    expect(typingStages.map((stage) => stage.title)).toEqual([
      "Keyboard introduction",
      "Home row",
      "Finger placement",
      "Left hand",
      "Right hand",
      "Top row",
      "Bottom row",
      "Common letters",
      "Common words",
      "Sentences",
      "Paragraphs",
      "Coding symbols",
      "Developer typing",
      "Speed building",
      "Advanced fluency",
    ]);
  });

  describe("account preference conflict resolution", () => {
    it("keeps the most recently changed value when reconciling device and account settings", () => {
      const accountValue = { value: 5, updatedAt: "2026-11-17T10:00:00.000Z" };
      const newerDeviceValue = { value: 3, updatedAt: "2026-11-17T11:00:00.000Z" };

      expect(resolvePreference(newerDeviceValue, accountValue)).toEqual(newerDeviceValue);
      expect(resolvePreference(accountValue, newerDeviceValue)).toEqual(newerDeviceValue);
      expect(resolvePreference(undefined, accountValue)).toEqual(accountValue);
    });
  });

  it("maps prior completed lessons without unlocking newly added keyboard rows", () => {
    expect(normalizeCompletedStageIds(["basic-words", "speed-drills", "unknown"])).toEqual([
      "common-letters",
      "speed-building",
    ]);
    expect(getNextTypingStage(["keyboard-introduction", "home-row", "finger-positioning", "left-hand-practice", "right-hand-practice", "basic-words"])?.id).toBe("top-row");
    expect(isTypingStageUnlocked(7, ["keyboard-introduction", "home-row", "finger-positioning", "left-hand-practice", "right-hand-practice", "top-row"])).toBe(true);
  });

  it("assigns home-row, outer, symbol, and space keys to the correct finger zones", () => {
    expect(getKeyboardGuidance("f")).toMatchObject({ finger: "Left index finger", hand: "left" });
    expect(getKeyboardGuidance("P")).toMatchObject({ finger: "Right pinky", hand: "right" });
    expect(getKeyboardGuidance("{")).toMatchObject({
      finger: "Right pinky",
      hand: "right",
      key: "[",
    });
    expect(getKeyboardGuidance(" ")).toMatchObject({ finger: "Thumbs", hand: "both" });
  });

  it("uses the requested level and rank milestones", () => {
    expect(getTypingLevelProgress(0)).toMatchObject({ level: 1, rank: "Typing Novice" });
    expect(getTypingLevelProgress(2_500)).toMatchObject({ level: 6, rank: "Keyboard Explorer" });
    expect(getTypingLevelProgress(10_000)).toMatchObject({ level: 21, rank: "Typing Warrior" });
  });

  it("unlocks the next stage only after the previous stage is complete", () => {
    expect(isTypingStageUnlocked(1, [])).toBe(true);
    expect(isTypingStageUnlocked(2, [])).toBe(false);
    expect(isTypingStageUnlocked(2, ["keyboard-introduction"])).toBe(true);
    expect(getNextTypingStage(["keyboard-introduction"])?.id).toBe("home-row");
  });

  it("awards badges only when the exact result threshold is reached", () => {
    expect(getTypingBadgeIds({
      completedLessons: 1,
      completedStageIds: ["keyboard-introduction"],
      streak: 7,
      bestWpm: 50,
      perfectLessons: 1,
      wordsTyped: 100,
    })).toEqual(expect.arrayContaining([
      "first-lesson",
      "100-words",
      "7-day-streak",
      "50-wpm",
      "accuracy-master",
    ]));
  });
});
