"use client";

import { useSearchParams } from "next/navigation";
import { ChallengeRunner } from "@/components/challenge-runner";
import type { PracticeMode } from "@/lib/local-progress";
import { getVerse } from "@/data/verses";

export function ChallengeRoute({
  initialMode,
  defaultStageId,
}: {
  initialMode: PracticeMode;
  defaultStageId?: string;
}) {
  const searchParams = useSearchParams();
  const requestedVerse = searchParams.get("verse");
  const initialVerseId =
    requestedVerse && getVerse(requestedVerse) ? requestedVerse : undefined;
  const requestedStage = searchParams.get("stage");
  const stageId = requestedStage || defaultStageId;
  const requestedMode = searchParams.get("mode");
  const routeMode: PracticeMode =
    requestedMode === "race"
      ? "race"
      : requestedMode === "accuracy"
        ? "accuracy"
        : requestedMode === "speed"
          ? "speed"
          : requestedMode === "challenge"
            ? "challenge"
            : initialMode;

  return (
    <ChallengeRunner
      key={`${routeMode}:${initialVerseId ?? ""}:${stageId ?? ""}`}
      initialMode={routeMode}
      initialVerseId={initialVerseId}
      initialStageId={stageId}
    />
  );
}
