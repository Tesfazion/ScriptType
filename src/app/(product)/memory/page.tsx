import { Suspense } from "react";
import { ChallengeRoute } from "@/components/challenge-route";

export default function MemoryPage() {
  return (
    <Suspense fallback={<div className="min-h-[28rem]" aria-busy="true" />}>
      <ChallengeRoute initialMode="memory" />
    </Suspense>
  );
}
