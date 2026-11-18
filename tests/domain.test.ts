import { describe, expect, it } from "vitest";
import {
  calculateMemoryMetrics,
  calculateSessionXp,
  calculateTypingMetrics,
  dateInTimezone,
  getLevelProgress,
  nextActiveStreak,
} from "../shared/domain";

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
  it("resolves level thresholds and rank milestones", () => {
    expect(getLevelProgress(400)).toMatchObject({ level: 3, rank: "Seeker", progressPercent: 0 });
    expect(getLevelProgress(2_500).rank).toBe("Disciple");
    expect(getLevelProgress(10_000).rank).toBe("Faith Builder");
  });

  it("awards streak XP only at a seven-day milestone", () => {
    expect(calculateSessionXp({ isPerfect: true, isMemory: true, streak: 7 })).toBe(40);
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
