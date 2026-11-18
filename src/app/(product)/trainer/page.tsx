"use client";

import { Suspense } from "react";
import { ChallengeRoute } from "@/components/challenge-route";
import { useProgress } from "@/hooks/use-progress";
import { getNextTypingStage } from "../../../../shared/typing-progress";

export default function TrainerPage() {
  const { progress, loading, errorMessage } = useProgress();
  const nextStage = getNextTypingStage(progress?.completedKeyboardStageIds ?? []);

  if (loading) {
    return <div className="min-h-72 animate-pulse rounded-panel bg-muted" aria-busy="true" />;
  }

  return (
    <div className="mx-auto max-w-[1080px]">
      <header className="mb-5">
        <p className="eyebrow text-primary">Learn your keyboard</p>
        <h1 className="page-title mt-1.5">Guided keyboard trainer</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          See the target key, the correct finger, and its keyboard zone while you practice. The next lesson unlocks when you reach 90% accuracy.
        </p>
      </header>
      {errorMessage && (
        <p role="alert" className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </p>
      )}
      <Suspense fallback={<div className="min-h-80" aria-busy="true" />}>
        <ChallengeRoute
          initialMode="keyboard"
          defaultStageId={nextStage?.id ?? "keyboard-introduction"}
        />
      </Suspense>
    </div>
  );
}
