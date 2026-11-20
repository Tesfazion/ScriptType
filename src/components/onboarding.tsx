"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { Mascot } from "@/components/mascot";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/app-providers";
import { saveAccountPreference } from "@/lib/account-preferences";
import {
  MAX_WEEKLY_GOAL,
  readLocalProgress,
  setLocalWeeklyGoal,
} from "@/lib/local-progress";

type OnboardingStep =
  | "welcome"
  | "personalize"
  | "privacy"
  | "complete";

const ONBOARDING_SEEN_KEY = "scripttype-onboarding-seen";
const ONBOARDING_AFTER_WIN_KEY = "scripttype-show-onboarding-after-win";

const startLocations = {
  journeys: { href: "/journeys", label: "Scripture journeys" },
  keyboard: { href: "/trainer", label: "Keyboard trainer" },
  memory: { href: "/memory", label: "Memory practice" },
} as const;

type StartPreference = keyof typeof startLocations;

const personalizationOptions = [
  {
    id: "journeys",
    label: "Scripture journeys",
    description: "Choose from available guided passages.",
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
  const { user, firebaseConfigured } = useAuth();
  const [initialGoal] = useState(() => {
    try {
      return { value: readLocalProgress().weeklyGoal, error: "" };
    } catch (error) {
      return {
        value: 5,
        error:
          error instanceof Error
            ? `Saved progress could not be read: ${error.message}`
            : "Saved progress could not be read.",
      };
    }
  });
  const [step, setStep] = useState<OnboardingStep>(() => {
    if (typeof window === "undefined") return "welcome";
    return sessionStorage.getItem(ONBOARDING_AFTER_WIN_KEY) === "1"
      ? "personalize"
      : "welcome";
  });
  const [weeklyGoal, setWeeklyGoal] = useState(initialGoal.value);
  const [journeyPreference, setJourneyPreference] =
    useState<StartPreference>("journeys");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(initialGoal.error);
  const [syncMessage, setSyncMessage] = useState("");

  const hasSeen =
    typeof window !== "undefined" &&
    !!sessionStorage.getItem(ONBOARDING_SEEN_KEY);
  if (hasSeen && step !== "complete") return null;

  const finish = async (sync: boolean) => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError("");
    setSyncMessage("");
    try {
      setLocalWeeklyGoal(weeklyGoal);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? `Your setup could not be saved: ${error.message}`
          : "Your setup could not be saved. Check this browser's storage settings and try again.",
      );
      setIsSaving(false);
      return;
    }

    if (sync && user) {
      try {
        const result = await saveAccountPreference("weeklyGoal", weeklyGoal);
        setSyncMessage(
          result === "synced"
            ? "Your weekly goal is saved to your account."
            : result === "conflict"
              ? "A newer weekly goal from another device was kept."
              : "Your goal is saved on this device and will sync when you’re online.",
        );
      } catch (error) {
        setSyncMessage(
          error instanceof Error
            ? `Your goal is saved on this device, but account sync failed: ${error.message}`
            : "Your goal is saved on this device, but account sync failed.",
        );
      }
    }

    dismissOnboarding();
    if (sync && !user) {
      setStep("welcome");
      router.push("/sign-in");
    } else {
      setStep("complete");
      window.dispatchEvent(
        new CustomEvent("scripttype:onboarding-complete", { bubbles: true }),
      );
    }
    setIsSaving(false);
  };

  const skipOnboarding = () => {
    dismissOnboarding();
    setStep("welcome");
  };

  const goToStartingPoint = () => {
    dismissOnboarding();
    setStep("welcome");
    router.push(startLocations[journeyPreference].href);
  };

  return (
    <Dialog.Root
      open={!hasSeen || step === "complete"}
      onOpenChange={(open) => {
        if (!open) skipOnboarding();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[60] bg-background/90 backdrop-blur-sm" />
        <Dialog.Popup className="fixed inset-0 z-[61] flex min-h-dvh items-center justify-center overflow-y-auto px-4 py-4">
          <div className="mx-auto max-h-[calc(100dvh-2rem)] w-full max-w-[520px] overflow-y-auto rounded-panel border bg-card p-5 shadow-float sm:p-8">
        {step === "welcome" && (
          <>
            <div className="text-center mb-8">
              <div className="mx-auto mb-5 w-fit">
                <Mascot size="hero" animate className="mascot-hero-3d" />
              </div>
              <Dialog.Title className="page-title text-2xl font-semibold tracking-[-0.06em]">
                Welcome to ScriptType
              </Dialog.Title>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Build typing skill one focused verse at a time.
              </p>
            </div>

            <div className="surface-card p-5 text-center">
              <h3 className="text-base font-semibold">Try a verse before you join</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Type today&rsquo;s passage now — no account required. Choose a journey whenever you&rsquo;re ready.
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
                className="button-secondary inline-flex min-h-11 items-center justify-center gap-2 px-6 text-sm"
              >
                <span>Set up without a sample</span>
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
              Progress stays on this device. Sign in with Firebase to sync across phones.
            </p>
          </>
        )}

        {step === "personalize" && (
          <>
            <div className="text-center mb-8">
              <BrandMark size="lg" className="mx-auto mb-3" />
              <Dialog.Title className="page-title mt-5 text-2xl font-semibold tracking-[-0.06em]">
                Make ScriptType yours
              </Dialog.Title>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="onboarding-weekly-goal" className="text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground block mb-3">
                  Weekly practice goal
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="onboarding-weekly-goal"
                    type="range"
                    min={1}
                    max={MAX_WEEKLY_GOAL}
                    value={weeklyGoal}
                    aria-valuetext={`${weeklyGoal} ${weeklyGoal === 1 ? "day" : "days"} per week`}
                    onChange={(event) => setWeeklyGoal(Number(event.target.value))}
                    className="h-2 flex-1 accent-primary focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <output htmlFor="onboarding-weekly-goal" className="grid size-12 place-items-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                    {weeklyGoal}
                  </output>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Days per week — this never measures spiritual worth.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground block mb-3">
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
                      <span className="text-xs leading-4">{option.label}</span>
                      <span className={`text-xs leading-4 ${
                        journeyPreference === option.id
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      }`}>
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
                onClick={() => setStep("privacy")}
                className="button-primary inline-flex min-h-11 items-center gap-2 px-5 text-sm font-semibold"
              >
                Next <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
          </>
        )}

        {step === "privacy" && (
          <>
            <div className="text-center mb-8">
              <BrandMark size="lg" className="mx-auto mb-3" />
              <Dialog.Title className="page-title mt-5 text-2xl font-semibold tracking-[-0.06em]">
                Your privacy choices
              </Dialog.Title>
            </div>

            <div className="surface-muted rounded-card p-4 text-sm leading-6">
              <p className="font-semibold">Your progress stays on this device.</p>
              <p className="mt-2 text-muted-foreground">
                Sign in only if you want to sync practice progress across devices.
                Private reflections stay local unless you separately choose AI help.
              </p>
            </div>

            {saveError && <p role="alert" className="mt-4 text-sm text-destructive">{saveError}</p>}
            {syncMessage && <p role="status" className="mt-4 text-sm text-muted-foreground">{syncMessage}</p>}

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={() => void finish(false)}
                disabled={isSaving}
                className="button-primary inline-flex min-h-11 items-center justify-center gap-2 px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue on this device
              </button>
              {firebaseConfigured && (
                <button
                  type="button"
                  onClick={() => void finish(true)}
                  disabled={isSaving}
                  className="button-secondary inline-flex min-h-11 items-center justify-center gap-2 px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving
                    ? "Saving…"
                    : user
                      ? "Sync goal to my account"
                      : "Sign in to sync"}
                </button>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep("personalize")}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-xs font-semibold hover:bg-muted"
              >
                Back
              </button>
              <button
                type="button"
                onClick={skipOnboarding}
                className="min-h-10 px-2 text-xs font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Skip setup
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
              <Dialog.Title className="page-title text-2xl font-semibold tracking-[-0.06em]">
                You&rsquo;re ready
              </Dialog.Title>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Your goal is saved on this device. You can change it anytime in Settings.
              </p>
            </div>
            {syncMessage && <p role="status" className="mt-4 text-center text-sm text-muted-foreground">{syncMessage}</p>}
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={goToStartingPoint}
                className="button-primary inline-flex min-h-11 items-center justify-center gap-2 px-6 text-sm"
              >
                Start with {startLocations[journeyPreference].label}
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
          </>
        )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}