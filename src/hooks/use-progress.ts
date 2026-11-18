"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/app-providers";
import {
  readAccountProgress,
  readCachedAccountProgress,
} from "@/lib/account-progress";
import {
  getProgressSummary,
  readLocalProgress,
  type LocalProgress,
} from "@/lib/local-progress";
import type { ProgressView } from "@/lib/progress-types";
import { getPendingPracticeSessions } from "@/lib/progress-service";

type UseProgressResult = {
  progress: ProgressView | null;
  localProgress: LocalProgress | null;
  loading: boolean;
  errorMessage: string;
};

function localProgressView(progress: LocalProgress): ProgressView {
  const summary = getProgressSummary(progress);
  return {
    xp: progress.xp,
    activeStreak: summary.activeStreak,
    weeklyGoal: summary.weeklyGoal,
    weeklySessions: summary.weeklySessions,
    qualifiedDates: progress.qualifiedDates,
    versesCompleted: summary.versesCompleted,
    chaptersCompleted: summary.chaptersCompleted,
    averageWpm: summary.averageWpm,
    averageAccuracy: summary.averageAccuracy,
    averageMemoryScore:
      summary.memorySessions.length === 0
        ? null
        : Math.round(
            summary.memorySessions.reduce(
              (sum, session) => sum + (session.memoryScore ?? 0),
              0,
            ) / summary.memorySessions.length,
          ),
    completedVerseIds: progress.completedVerseIds,
    sessions: progress.sessions,
    completedKeyboardStageIds: progress.completedKeyboardStageIds ?? [],
    bestWpm: progress.bestWpm ?? 0,
    wordsTyped: progress.wordsTyped ?? 0,
    perfectLessons: progress.perfectLessons ?? 0,
    pendingSyncCount: 0,
    achievementIds: [],
  };
}

export function useProgress(): UseProgressResult {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<ProgressView | null>(null);
  const [localProgress, setLocalProgress] = useState<LocalProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (authLoading) return;
    let active = true;

    async function loadProgress() {
      setLoading(true);
      setErrorMessage("");
      try {
        if (user) {
          let accountProgress: ProgressView;
          try {
            accountProgress = await readAccountProgress(user.uid);
          } catch (error) {
            const cached = window.navigator.onLine
              ? null
              : readCachedAccountProgress(user.uid);
            if (!cached) throw error;
            accountProgress = {
              ...cached,
              cacheWarning: "You are offline. Showing the most recently synced account progress.",
            };
          }
          const pendingSessions = getPendingPracticeSessions(user.uid);
          const pendingIds = new Set(pendingSessions.map((session) => session.id));
          if (active) {
            setProgress({
              ...accountProgress,
              pendingSyncCount: pendingSessions.length,
              sessions: [
                ...pendingSessions,
                ...accountProgress.sessions.filter((session) => !pendingIds.has(session.id)),
              ],
            });
            setLocalProgress(null);
            if (accountProgress.cacheWarning) {
              setErrorMessage(accountProgress.cacheWarning);
            }
          }
          return;
        }

        const deviceProgress = readLocalProgress();
        if (active) {
          setLocalProgress(deviceProgress);
          setProgress(localProgressView(deviceProgress));
        }
      } catch (error: unknown) {
        if (active) {
          setErrorMessage(
            error instanceof Error ? error.message : "Progress could not be loaded.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    const refresh = () => void loadProgress();
    refresh();
    window.addEventListener("scripttype:progress-updated", refresh);
    window.addEventListener("online", refresh);

    return () => {
      active = false;
      window.removeEventListener("scripttype:progress-updated", refresh);
      window.removeEventListener("online", refresh);
    };
  }, [authLoading, user]);

  return { progress, localProgress, loading, errorMessage };
}
