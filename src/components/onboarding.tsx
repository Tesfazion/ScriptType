"use client";

import { ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { Mascot } from "@/components/mascot";
import { useRouter } from "next/navigation";

type OnboardingStep =
  | "welcome"
  | "personalize"
  | "consent"
  | "complete";

const ONBOARDING_SEEN_KEY = "scripttype-onboarding-seen";
const ONBOARDING_AFTER_WIN_KEY = "scripttype-show-onboarding-after-win";

const personalizationOptions = [
  {
    id: "journeys",
    label: "Scripture journeys",
    description: "Curated reading plans with guided typing.",
  },
  {
    id: "keyboard",
    label: "Keyboard trainer",
    description: "Guided key, finger, and home-row placement.",
  },
  {
    id: "memory",
    label: "Memory & audio",
    description: "Recall verses and listen-and-type practice.",
  },
] as const;

function dismissOnboarding() {
  sessionStorage.setItem(ONBOARDING_SEEN_KEY, "1");
  sessionStorage.removeItem(ONBOARDING_AFTER_WIN_KEY);
}

export function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>(() => {
    if (typeof window === "undefined") return "welcome";
    return sessionStorage.getItem(ONBOARDING_AFTER_WIN_KEY) === "1"
      ? "personalize"
      : "welcome";
  });
  const [isSkippable, setIsSkippable] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [journeyPreference, setJourneyPreference] = useState("journeys");
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsSkippable(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const hasSeen =
    typeof window !== "undefined" &&
    !!sessionStorage.getItem(ONBOARDING_SEEN_KEY);
  if (hasSeen && step !== "complete") return null;

  const finish = () => {
    dismissOnboarding();
    setStep("complete");
    window.dispatchEvent(
      new CustomEvent("scripttype:onboarding-complete", { bubbles: true }),
    );
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex min-h-dvh items-center justify-center bg-background/90 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to ScriptType"
    >
      <div className="mx-auto w-full max-w-[520px] rounded-panel border bg-card p-6 shadow-float sm:p-8">
        {step === "welcome" && (
          <>
            <div className="text-center mb-8">
              <div className="mx-auto mb-5 w-fit">
                <Mascot size="hero" animate className="mascot-hero-3d" />
              </div>
              <h2 className="page-title text-2xl font-semibold tracking-[-0.06em]">
                Welcome to ScriptType
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Build typing skill one focused verse at a time.
              </p>
            </div>

            <div className="surface-card p-5 text-center">
              <h3 className="text-base font-semibold">Try a verse before you join</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Type today&rsquo;s passage now — no account required. Your first session unlocks your personalized path.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  dismissOnboarding();
                  router.push("/practice");
                }}
                className="button-primary inline-flex min-h-11 items-center justify-center gap-2 px-6 text-sm"
              >
                Type today&rsquo;s verse <ChevronRight size={14} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setStep("personalize")}
                disabled={!isSkippable}
                className={`inline-flex min-h-11 items-center justify-center gap-2 px-6 text-xs font-semibold border rounded-full transition ${
                  !isSkippable
                    ? "border-white/20 bg-white/10 text-white/40 pointer-events-none"
                    : "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                <span>Join without trying</span>
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>

            <p className="mt-6 text-center text-[10px] text-muted-foreground">
              Progress stays on this device. Sign in with Firebase to sync across phones.
            </p>
          </>
        )}

        {step === "personalize" && (
          <>
            <div className="text-center mb-8">
              <BrandMark size="lg" className="mx-auto mb-3" />
              <h2 className="page-title mt-5 text-2xl font-semibold tracking-[-0.06em]">
                Make ScriptType yours
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground block mb-3">
                  Weekly practice goal
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={14}
                    value={weeklyGoal}
                    onChange={(event) => setWeeklyGoal(Number(event.target.value))}
                    className="h-2 flex-1 accent-primary focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <output className="grid size-10 place-items-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                    {weeklyGoal}
                  </output>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Days per week — this never measures spiritual worth.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground block mb-3">
                  Start with
                </label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {personalizationOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setJourneyPreference(option.id)}
                      className={`flex flex-col items-center gap-2 rounded-control border px-3 py-4 text-sm font-medium transition ${
                        journeyPreference === option.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted"
                      }`}
                    >
                      <div className="grid size-9 place-items-center rounded-full bg-white/10">
                        <Sparkles size={14} aria-hidden="true" />
                      </div>
                      <span className="text-[11px] leading-4">{option.label}</span>
                      <span className="text-[9px] leading-3 text-muted-foreground">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep("welcome")}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-xs font-semibold hover:bg-muted"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep("consent")}
                className="button-primary inline-flex min-h-10 items-center gap-2 px-5 text-xs font-semibold"
              >
                Next <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
          </>
        )}

        {step === "consent" && (
          <>
            <div className="text-center mb-8">
              <BrandMark size="lg" className="mx-auto mb-3" />
              <h2 className="page-title mt-5 text-2xl font-semibold tracking-[-0.06em]">
                Your privacy choices
              </h2>
            </div>

            <label className="mt-4 flex min-h-10 items-center gap-3 text-xs leading-5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-1 size-4 accent-primary focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span>
                <span className="block font-semibold">Save progress to a Firebase account</span>
                <span className="mt-0.5 block text-muted-foreground">
                  Optional. Your verses and reflections stay local unless you sign in.
                </span>
              </span>
            </label>

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep("personalize")}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-xs font-semibold hover:bg-muted"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!consent}
                onClick={finish}
                className={`button-primary inline-flex min-h-10 items-center gap-2 px-5 text-xs font-semibold transition ${
                  !consent
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary/90"
                }`}
              >
                Finish setup
              </button>
            </div>
          </>
        )}

        {step === "complete" && (
          <>
            <div className="text-center">
              <div className="mx-auto mb-5 w-fit">
                <Mascot size="hero" animate className="mascot-hero-3d" />
              </div>
              <h2 className="page-title text-2xl font-semibold tracking-[-0.06em]">
                You&rsquo;re ready
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Your first practice session is saved. You can sign in anytime from Settings.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  dismissOnboarding();
                  router.push("/today");
                }}
                className="button-primary inline-flex min-h-11 items-center justify-center gap-2 px-6 text-sm"
              >
                Go to today <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}