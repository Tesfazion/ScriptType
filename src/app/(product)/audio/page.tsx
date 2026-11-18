import { Suspense } from "react";
import { ChallengeRoute } from "@/components/challenge-route";

export default function AudioPage() {
  return (
    <Suspense fallback={<div className="min-h-[28rem]" aria-busy="true" />}>
      <ChallengeRoute initialMode="audio" />
    </Suspense>
  );
}
