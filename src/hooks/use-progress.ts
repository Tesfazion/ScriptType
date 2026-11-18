"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/app-providers";
import { readAccountProgress } from "@/lib/account-progress";
import {
  getProgressSummary,
  readLocalProgress,
  type LocalProgress,
} from "@/lib/local-progress";
import type { ProgressView } from "@/lib/progress-types";

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

    const request = user
      ? readAccountProgress(user.uid).then((accountProgress) => {
          if (active) {
            setProgress(accountProgress);
            setLocalProgress(null);
          }
        })
      : Promise.resolve().then(() => {
          const deviceProgress = readLocalProgress();
          if (active) {
            setLocalProgress(deviceProgress);
            setProgress(localProgressView(deviceProgress));
          }
        });

    request
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof Error ? error.message : "Progress could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, user]);

  return { progress, localProgress, loading, errorMessage };
}
