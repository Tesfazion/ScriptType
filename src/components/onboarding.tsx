"use client";

import { BookOpenText, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const onboardingSteps = [
  {
    title: "Practice typing",
    description: "Type Scripture passages to build speed and accuracy. Progress syncs across devices when you sign in.",
  },
  {
    title: "Follow a journey",
    description: "Walk through curated reading plans — Gospels, Psalms, Proverbs — with sample passages to get started.",
  },
  {
    title: "Earn badges",
    description: "Streaks, levels, and accuracy milestones recognize consistency — not spiritual worth.",
  },
];

const storageKey = "scripttype-onboarding-seen";

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [hasSeen, setHasSeen] = useState<boolean>(
    () => typeof window !== "undefined" && !!window.sessionStorage.getItem(storageKey),
  );

  useEffect(() => {
    if (step >= onboardingSteps.length - 1) {
      window.sessionStorage?.setItem?.(storageKey, "1");
    }
  }, [step]);

  if (hasSeen) return null;

  const isLast = step >= onboardingSteps.length - 1;
  const complete = () => {
    window.sessionStorage?.setItem?.(storageKey, "1");
    setHasSeen(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-background/90 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to ScriptType"
    >
      <div className="mx-auto w-full max-w-[520px] rounded-panel border bg-card p-6 shadow-float sm:p-8">
        <div className="text-center">
          <span className="brand-mark mx-auto grid size-12 place-items-center rounded-full">
            <BookOpenText size={20} aria-hidden="true" />
          </span>
          <h2 className="page-title mt-5 text-2xl font-semibold tracking-[-0.06em]">Welcome to ScriptType</h2>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">{onboardingSteps[step].title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">{onboardingSteps[step].description}</p>
        </div>

        <div className="mt-10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="inline-flex min-h-11 items-center gap-2 rounded-control border px-5 text-sm font-semibold disabled:opacity-40"
          >
            <ChevronLeft size={16} aria-hidden="true" /> Prev
          </button>
          {isLast ? (
            <button type="button" onClick={complete} className="button-primary inline-flex min-h-11 items-center gap-2 px-6 text-sm">
              Get started <ChevronRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <button type="button" onClick={() => setStep(step + 1)} className="button-primary inline-flex min-h-11 items-center gap-2 px-6 text-sm">
              Next <ChevronRight size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-[10px] text-muted-foreground">
          Your progress stays on this device. Sign in with Firebase to sync across phones.
        </p>
      </div>
    </div>
  );
}