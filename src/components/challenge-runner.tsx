"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  Check,
  Flame,
  Headphones,
  Keyboard,
  Pause,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { verses, type Verse } from "@/data/verses";
import type { PracticeMode } from "@/lib/local-progress";
import { KeyboardCoach } from "@/components/keyboard-coach";
import { submitPractice } from "@/lib/progress-service";
import { getDailyRaceText, submitRaceResult } from "@/lib/race-service";
import { getRaceLeaderboard, type RaceEntry } from "@/lib/race-service";
import { RaceTrack } from "@/components/race-track";
import { useProgress } from "@/hooks/use-progress";
import { useAuth } from "@/components/app-providers";
import { Mascot } from "@/components/mascot";
import {
  calculateMemoryMetrics,
  calculateTypingMetrics,
} from "../../shared/domain";
import { typingStages } from "../../shared/typing-curriculum";

const STOP_WORDS = new Set([
  "a",
  "and",
  "as",
  "be",
  "but",
  "for",
  "from",
  "he",
  "his",
  "i",
  "in",
  "is",
  "it",
  "my",
  "not",
  "of",
  "on",
  "or",
  "shall",
  "the",
  "their",
  "them",
  "they",
  "thou",
  "thy",
  "to",
  "unto",
  "was",
  "we",
  "with",
  "and",
]);
const MINIMUM_TIMED_PRACTICE_MS = 5_000;
const ACCURACY_GOAL_PERCENT = 95;

type Completion = {
  metrics: {
    wpm: number;
    accuracy: number;
    elapsedSeconds: number;
    mistakeCount: number;
  };
  xpEarned: number;
  activeStreak: number;
  memoryScore?: number;
  synced: boolean;
  pending: boolean;
  nextStageId?: string;
};

function isMajorWord(word: string, wordIndex: number): boolean {
  return !STOP_WORDS.has(word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "")) && wordIndex % 2 === 0;
}

function playSuccessTone(kind: "key" | "complete") {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem("scripttype.sound-enabled") === "off") return;
  if (!window.AudioContext) return;

  const context = new window.AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = kind === "complete" ? 660 : 440;
  gain.gain.setValueAtTime(0.025, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.08);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.08);
  oscillator.onended = () => void context.close();
}

function getVisibleVerse(verse: Verse, level: number): string {
  if (level === 1) return verse.text;
  let wordIndex = 0;
  return verse.text.replace(/\S+/g, (word) => {
    const currentWord = wordIndex;
    wordIndex += 1;
    const hide =
      level === 4 ||
      (level === 2 && isMajorWord(word, currentWord)) ||
      (level === 3 && !STOP_WORDS.has(word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "")));
    return hide ? "▰".repeat(Math.min(7, word.length)) : word;
  });
}

function CharacterGuide({
  verse,
  typed,
}: {
  verse: Verse;
  typed: string;
}) {
  return (
    <p
      className="reading-type text-[1.2rem] leading-[1.8] tracking-[0.005em] text-foreground sm:text-[1.7rem] sm:leading-[1.75] break-words overflow-wrap-anywhere whitespace-normal"
      aria-label={verse.text}
    >
      {Array.from(verse.text).map((character, index) => {
        const isCurrent = index === typed.length;
        const hasTyped = index < typed.length;
        const isCorrect = typed[index] === character;
        return (
          <span
            key={`${index}-${character}`}
            className={`relative rounded-[0.16em] px-[0.015em] ${
              hasTyped
                ? isCorrect
                  ? "text-primary underline decoration-primary/40 underline-offset-4"
                  : "bg-destructive/10 text-destructive underline decoration-destructive underline-offset-4"
                : "text-foreground"
            } ${isCurrent ? "after:absolute after:inset-y-[0.15em] after:-right-[1px] after:w-[2px] after:animate-pulse after:bg-primary" : ""}`}
          >
            {character === " " ? "\u00a0" : character}
          </span>
        );
      })}
    </p>
  );
}

export function ChallengeRunner({
  initialMode,
  initialVerseId,
  initialStageId,
}: {
  initialMode: PracticeMode;
  initialVerseId?: string;
  initialStageId?: string | null;
}) {
  const initialStage =
    initialStageId
      ? typingStages.find((stage) => stage.id === initialStageId)
      : undefined;
  const [verseId, setVerseId] = useState(
    initialStage
      ? initialStage.lesson.id
      : initialVerseId && verses.some((item) => item.id === initialVerseId)
      ? initialVerseId
      : (verses[0]?.id ?? ""),
  );
  const [mode, setMode] = useState<PracticeMode>(initialStage ? "keyboard" : initialMode);
  const [memoryLevel, setMemoryLevel] = useState(1);
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [mistakeEvents, setMistakeEvents] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [completion, setCompletion] = useState<Completion | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [raceEntries, setRaceEntries] = useState<RaceEntry[]>([]);
  const [raceLoadError, setRaceLoadError] = useState("");
  const { progress: learnerProgress } = useProgress();
  const { user, firebaseConfigured, isOnline } = useAuth();
  const stageId = initialStage?.id;
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [firstCompletion, setFirstCompletion] = useState(false);

  const stage = stageId
    ? typingStages.find((item) => item.id === stageId)
    : undefined;
  const verse = useMemo<Verse>(
    () =>
      stage
        ? {
            id: stage.lesson.id,
            reference: `Stage ${stage.number} · ${stage.title}`,
            text: stage.lesson.text,
            theme: stage.lesson.focus,
            provenance: "ScriptType typing curriculum",
            reviewStatus: "approved-demo",
          }
        : mode === "race"
          ? {
              id: `daily-race-${new Date().toISOString().slice(0, 10)}`,
              reference: "Daily ScriptType race",
              text: getDailyRaceText(),
              theme: "Typing race",
              provenance: "ScriptType race challenge",
              reviewStatus: "approved-demo",
            }
        : verses.find((item) => item.id === verseId) ?? verses[0],
    [stage, verseId, mode],
  );
  const metrics = calculateTypingMetrics(verse.text, typed, elapsedMs);
  const memoryMetrics = calculateMemoryMetrics(verse.text, typed);
  const progress = Math.min(100, Math.round((typed.length / verse.text.length) * 100));
  const remaining = Math.max(0, verse.text.length - typed.length);
  const isComplete = typed.length === verse.text.length;
  const speedGoalWpm = Math.max(1, learnerProgress?.bestWpm ?? 0);
  const isPracticeGoalMet =
    (mode !== "accuracy" && mode !== "challenge" ||
      metrics.accuracy >= ACCURACY_GOAL_PERCENT) &&
    (mode !== "speed" || metrics.wpm >= speedGoalWpm) &&
    (mode !== "challenge" || elapsedMs >= MINIMUM_TIMED_PRACTICE_MS);
  const canFinish =
    isComplete && isPracticeGoalMet && !submitting && startTime !== null;
  const visibleVerse = getVisibleVerse(verse, memoryLevel);

  useEffect(() => {
    if (startTime === null || completion) return;
    const timer = window.setInterval(
      () => setElapsedMs(performance.now() - startTime),
      250,
    );
    return () => window.clearInterval(timer);
  }, [startTime, completion]);

  useEffect(() => {
    if (mode !== "race" || !user) return;
    let active = true;
    const groupId = window.localStorage.getItem("scripttype.race.group-id")?.trim();
    const raceId = groupId
      ? `group-${groupId}-${new Date().toISOString().slice(0, 10)}`
      : `global-${new Date().toISOString().slice(0, 10)}`;
    void getRaceLeaderboard(raceId)
      .then((entries) => {
        if (active) setRaceEntries(entries);
      })
      .catch((error: unknown) => {
        if (active) {
          setRaceLoadError(
            error instanceof Error
              ? error.message
              : "Race records could not be loaded.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [mode, user]);

  useEffect(
    () => () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    },
    [],
  );

  function resetChallenge(nextMode = mode, nextVerseId = verseId) {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setMode(nextMode);
    setVerseId(nextVerseId);
    setTyped("");
    setStartTime(null);
    setElapsedMs(0);
    setMistakeEvents(0);
    setSubmitting(false);
    setErrorMessage("");
    setAnnouncement("");
    setCompletion(null);
    setIsSpeaking(false);
  }

  function handleTyping(value: string) {
    if (completion) return;
    const nextValue = value.slice(0, verse.text.length);
    if (startTime === null && nextValue.length > 0) {
      setStartTime(performance.now());
      setAnnouncement("Practice started. Your progress is saved on this device.");
    }

    if (nextValue.length > typed.length) {
      for (let index = typed.length; index < nextValue.length; index += 1) {
        if (nextValue[index] !== verse.text[index]) {
          setMistakeEvents((count) => count + 1);
        } else {
          playSuccessTone("key");
        }
      }
    }
    setTyped(nextValue);
    setErrorMessage("");
  }

  function playVerse() {
    if (!window.speechSynthesis) {
      setErrorMessage("Audio playback is not available in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(verse.text);
    utterance.lang = "en-US";
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setErrorMessage("The verse could not be played. Try again or continue typing.");
    };
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  async function finishPractice() {
    if (!isComplete || submitting || startTime === null) return;
    setSubmitting(true);
    setErrorMessage("");
    const finalElapsedMs = Math.max(elapsedMs, performance.now() - startTime);

    try {
      if (mode === "race") {
        const groupId = window.localStorage.getItem("scripttype.race.group-id")?.trim();
        const raceId = groupId
          ? `group-${groupId}-${new Date().toISOString().slice(0, 10)}`
          : `global-${new Date().toISOString().slice(0, 10)}`;
        const raceResult = await submitRaceResult({
          raceId,
          typedText: typed,
          elapsedMs: finalElapsedMs,
          alias:
            typeof window !== "undefined"
              ? window.localStorage.getItem("scripttype.race.alias")?.trim() ||
                "ScriptType Learner"
              : "ScriptType Learner",
        });
        setCompletion({
          metrics: {
            wpm: raceResult.wpm,
            accuracy: raceResult.accuracy,
            elapsedSeconds: raceResult.elapsedSeconds,
            mistakeCount: Array.from(verse.text).reduce(
              (count, character, index) =>
                count + (typed[index] === character ? 0 : 1),
              0,
            ),
          },
          xpEarned: 0,
          activeStreak: 0,
          synced: true,
          pending: false,
        });
        playSuccessTone("complete");
        setAnnouncement("Race complete. Your result was submitted.");
        void getRaceLeaderboard(raceId)
          .then(setRaceEntries)
          .catch((error: unknown) => {
            setRaceLoadError(
              error instanceof Error
                ? error.message
                : "Race records could not be refreshed.",
            );
          });
        setSubmitting(false);
        return;
      }
      const saved = await submitPractice({
        verseId: verse.id,
        typedText: typed,
        elapsedMs: finalElapsedMs,
        startedAtMs: Date.now() - finalElapsedMs,
        mode,
        ...(stageId ? { stageId } : {}),
      });
      const pending =
        "sessionId" in saved &&
        "syncStatus" in saved &&
        saved.syncStatus === "pending";
      const synced =
        "sessionId" in saved &&
        (!("syncStatus" in saved) || saved.syncStatus === "synced");
      const savedMetrics =
        "metrics" in saved ? saved.metrics : saved;
      const isFirstSession = (learnerProgress?.sessions.length ?? 0) === 0;
      if (isFirstSession && !sessionStorage.getItem("scripttype-onboarding-seen")) {
        sessionStorage.setItem("scripttype-show-onboarding-after-win", "1");
      }
      setFirstCompletion(isFirstSession);
      setCompletion({
        metrics: {
          wpm: savedMetrics.wpm,
          accuracy: savedMetrics.accuracy,
          elapsedSeconds: savedMetrics.elapsedSeconds,
          mistakeCount: savedMetrics.mistakeCount,
        },
        xpEarned: saved.xpEarned,
        activeStreak: saved.activeStreak,
        ...(synced && saved.memoryScore !== undefined
          ? { memoryScore: saved.memoryScore }
          : mode === "memory"
            ? { memoryScore: memoryMetrics.score }
            : {}),
        synced,
        pending,
        ...(mode === "keyboard" &&
        stage &&
        savedMetrics.accuracy >= stage.lesson.accuracyToUnlock
          ? {
              nextStageId: typingStages.find(
                (item) => item.number === stage.number + 1,
              )?.id,
            }
          : {}),
      });
      playSuccessTone("complete");
      setAnnouncement(
        pending
          ? "Practice saved offline. Your result will sync and update rewards when the connection returns."
          : "Practice complete. Your result and next step are ready.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn’t save this practice. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function setSelectedVerse(nextVerseId: string) {
    if (typed.length > 0 && !window.confirm("Start over with a different verse? Your current practice will not be saved.")) {
      return;
    }
    resetChallenge(mode, nextVerseId);
  }

  if (completion) {
    return (
      <section className="mx-auto max-w-[760px] float-in">
        <div className="mission-glow relative overflow-hidden rounded-panel p-6 text-white shadow-panel sm:p-10">
          <div className="absolute -right-14 -top-20 size-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <Link href="/today" className="inline-flex items-center gap-2 text-xs text-white/65 hover:text-white">
              <ArrowLeft size={14} aria-hidden="true" /> Back to today
            </Link>
            <div className="mt-10 flex size-14 items-center justify-center rounded-card bg-accent text-primary">
              <Sparkles size={25} aria-hidden="true" />
            </div>
            {firstCompletion && (
              <div className="mt-4">
                <Mascot size="hero" animate className="mx-auto mascot-pop" />
              </div>
            )}
            <p className="mt-6 eyebrow text-white/70">
              {firstCompletion ? "Your first verse complete" : "A moment well spent"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
              {mode === "keyboard"
                ? "Lesson complete."
                : mode === "race"
                  ? "Race complete."
                  : "Practice complete."}
            </h1>
            <p className="reading-type mt-4 max-w-[620px] text-xl leading-8 text-white/80">
              {verse.reference} · “{verse.text}”
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["WPM", completion.metrics.wpm.toString()],
                ["Accuracy", `${completion.metrics.accuracy}%`],
                ["Time", `${Math.floor(completion.metrics.elapsedSeconds / 60)}:${String(completion.metrics.elapsedSeconds % 60).padStart(2, "0")}`],
                ["Mistakes", completion.metrics.mistakeCount.toString()],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-white/50">{label}</div>
                  <div className="mt-1 text-xl font-semibold tabular-nums">{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {completion.xpEarned > 0 && (
                <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground">
                  <Sparkles size={14} aria-hidden="true" /> +{completion.xpEarned} XP
                </span>
              )}
              {completion.memoryScore !== undefined && (
                <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/80">
                  Recall score · {completion.memoryScore}%
                </span>
              )}
              {completion.activeStreak > 0 && (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/80">
                  <Flame size={14} className="text-primary" aria-hidden="true" />
                  {completion.activeStreak}-day rhythm
                </span>
              )}
            </div>
            <p className="mt-4 text-[11px] text-white/45">
              {completion.pending
                ? "Saved offline · waiting for verified account sync."
                : completion.synced
                  ? "Saved and verified with your account."
                  : "This progress is saved only in this browser."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {completion.nextStageId && (
                <Link
                  href={`/practice?stage=${completion.nextStageId}`}
                  className="button-mission"
                >
                  Continue to next lesson <ArrowRight size={14} aria-hidden="true" />
                </Link>
              )}
              <Link href="/reflection" className="button-mission">
                Reflect on this verse <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => resetChallenge(mode, verse.id)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-xs font-semibold text-white/85 hover:bg-white/10"
              >
                <RotateCcw size={14} aria-hidden="true" /> Practice again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-[980px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/today" className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft size={13} aria-hidden="true" /> Back to today
          </Link>
          <h1 className="text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
            {mode === "race"
              ? "Daily typing race"
              : mode === "keyboard"
                ? stage?.title ?? "Typing lesson"
                : mode === "speed"
                  ? "Speed practice"
                  : mode === "accuracy"
                    ? "Accuracy practice"
                    : mode === "challenge"
                      ? "Daily challenge"
                      : mode === "typing"
                        ? "A moment in the Word"
                        : mode === "memory"
                          ? "Keep it close"
                          : "Listen, then remember"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "keyboard"
              ? "Follow the finger guide. Accuracy unlocks the next lesson."
              : mode === "race"
                ? "Race the clock, your personal best, and today's server-checked community results."
                : mode === "speed"
                  ? "Build a slightly faster pace while keeping your hands relaxed."
                  : mode === "accuracy"
                    ? "Slow down and aim for at least 95% accuracy."
                    : mode === "challenge"
                      ? "Finish today's passage with steady accuracy and focus."
                      : mode === "typing"
                        ? "Read slowly. Type at your own pace."
                        : mode === "memory"
                          ? "Move from reading to recall, one level at a time."
                          : "Hear the verse in your browser, then type what you hear."}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-[10px] font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-growth" />
          {user
            ? isOnline
              ? "Account progress · online"
              : "Account progress · offline"
            : firebaseConfigured
              ? "Sign in to sync your progress"
              : "Saved on this device"}
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {[
          { key: "typing" as const, label: "Type", icon: Keyboard, href: "/practice" },
          { key: "memory" as const, label: "Remember", icon: Sparkles, href: "/memory" },
          { key: "audio" as const, label: "Listen", icon: Headphones, href: "/audio" },
        ].map(({ key, label, icon: Icon, href }) => (
          <Link
            key={key}
            href={href}
            aria-current={mode === key ? "page" : undefined}
            className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition ${
              mode === key
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            <Icon size={14} aria-hidden="true" /> {label}
          </Link>
        ))}
      </div>

      {mode === "race" && (
        <RaceTrack
          entries={raceEntries}
          userProgress={progress}
          elapsedSeconds={elapsedMs / 1000}
          personalBestWpm={learnerProgress?.bestWpm ?? 0}
          userWpm={metrics.wpm}
          totalCharacters={verse.text.length}
        />
      )}
      {mode === "race" && !user && (
        <p className="mb-4 text-xs text-muted-foreground">
          Sign in to submit a leaderboard result. You can still practice the passage locally.{" "}
          <Link href="/sign-in" className="font-semibold text-primary underline underline-offset-2">
            Sign in
          </Link>
        </p>
      )}
      {raceLoadError && mode === "race" && (
        <p role="status" className="mb-4 text-xs text-muted-foreground">
          {raceLoadError}
        </p>
      )}

      <section className="surface-card overflow-hidden rounded-panel shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4 sm:px-7">
          <div>
            <label htmlFor="verse-select" className="text-[9px] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
              {mode === "keyboard" ? "Curriculum stage" : "Today's passage"}
            </label>
            {mode === "keyboard" || mode === "race" ? (
              <p className="mt-1 text-sm font-semibold text-foreground">
                Stage {stage?.number} · {stage?.lesson.focus}
              </p>
            ) : (
            <select
              id="verse-select"
              value={verse.id}
              onChange={(event) => setSelectedVerse(event.target.value)}
              className="mt-1 block max-w-[270px] appearance-none bg-transparent pr-5 text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {verses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.reference} · {item.theme}
                </option>
              ))}
            </select>
            )}
          </div>
          {mode === "memory" ? (
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              Recall level
              <select
                value={memoryLevel}
                onChange={(event) => {
                  if (typed.length > 0 && !window.confirm("Changing recall level restarts this practice. Continue?")) return;
                  resetChallenge(mode);
                  setMemoryLevel(Number(event.target.value));
                }}
                className="h-9 rounded-lg border bg-background px-2.5 text-xs font-semibold text-foreground"
              >
                <option value={1}>1 · Visible</option>
                <option value={2}>2 · Some words hidden</option>
                <option value={3}>3 · Key words hidden</option>
                <option value={4}>4 · From memory</option>
              </select>
            </label>
          ) : mode === "audio" ? (
            <button
              type="button"
              onClick={playVerse}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary/10 px-4 text-xs font-semibold text-primary hover:bg-primary/15"
            >
              {isSpeaking ? <Pause size={14} aria-hidden="true" /> : <AudioLines size={14} aria-hidden="true" />}
              {isSpeaking ? "Playing…" : "Play verse"}
            </button>
          ) : (
            <span className="rounded-full bg-muted px-3 py-1.5 text-[10px] font-medium text-muted-foreground">
              {verse.reference} · KJV
            </span>
          )}
        </div>

        <div className="px-5 py-6 sm:px-8 sm:py-8">
          {mode !== "memory" && mode !== "audio" && mode !== "keyboard" ? (
            <CharacterGuide verse={verse} typed={typed} />
          ) : mode === "keyboard" ? (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(19rem,0.7fr)]">
              <CharacterGuide verse={verse} typed={typed} />
              {stage && (
                <KeyboardCoach
                  targetCharacter={verse.text[typed.length] ?? stage.lesson.coachKey}
                  coachingTip={stage.lesson.coachingTip}
                />
              )}
            </div>
          ) : (
            <div className="reading-type rounded-2xl bg-muted/75 px-5 py-6 text-[1.4rem] leading-[1.8] tracking-[0.005em] sm:px-7 sm:py-8 sm:text-[1.7rem]">
              {mode === "audio"
                ? "Listen to the verse, then type what you hear."
                : memoryLevel === 4
                  ? "The verse is hidden. Take a breath and recall it from memory."
                  : visibleVerse}
            </div>
          )}

          <div className="mt-6">
            <label htmlFor="practice-input" className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              <span>{mode !== "memory" && mode !== "audio" ? "Your typing" : mode === "memory" ? "Your recall" : "Type what you hear"}</span>
              {mode !== "memory" && mode !== "audio" && mode !== "keyboard" && typed.length < verse.text.length && (
                <span className="font-mono normal-case tracking-normal">
                  Next: <kbd className="rounded border bg-background px-1.5 py-0.5 text-foreground">{verse.text[typed.length] === " " ? "space" : verse.text[typed.length]}</kbd>
                </span>
              )}
            </label>
            <textarea
              ref={inputRef}
              id="practice-input"
              value={typed}
              onChange={(event) => handleTyping(event.target.value)}
              onPaste={(event) => event.preventDefault()}
              onDrop={(event) => event.preventDefault()}
              rows={4}
              maxLength={verse.text.length}
              aria-describedby="practice-help"
              placeholder={
                mode !== "memory" && mode !== "audio"
                  ? "Click here, then type the verse…"
                  : "Type the words you remember…"
              }
              spellCheck={false}
              autoCapitalize="off"
              className="field-control w-full resize-none px-4 py-4 font-mono text-sm leading-7 outline-none placeholder:text-muted-foreground/65 focus:ring-4 focus:ring-primary/10 sm:px-5 sm:py-5 sm:text-base"
            />
            <div id="practice-help" className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground">
              <span>
                {mode !== "memory" && mode !== "audio"
                  ? "Your text stays on screen and is checked as you type."
                  : "Recall score is separate from typing accuracy."}
              </span>
              <span>{remaining} characters to go</span>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3">
            {[
              ["WPM", metrics.wpm.toString()],
              ["Accuracy", `${metrics.accuracy}%`],
              ["Time", `${Math.floor(elapsedMs / 60_000)}:${String(Math.floor(elapsedMs / 1_000) % 60).padStart(2, "0")}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-muted/70 px-3 py-3 text-center">
                <div className="text-[9px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">{label}</div>
                <div className="mt-1 text-base font-semibold tabular-nums sm:text-lg">{value}</div>
              </div>
            ))}
          </div>
          {(mode === "accuracy" || mode === "challenge" || mode === "speed") && (
            <p className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">
              {mode === "speed"
                ? `Practice for at least 5 seconds and match or beat your ${speedGoalWpm} WPM baseline.`
                : mode === "challenge"
                  ? `Finish in at least 5 seconds with ${ACCURACY_GOAL_PERCENT}% accuracy.`
                  : `Reach ${ACCURACY_GOAL_PERCENT}% accuracy to complete this drill.`}
            </p>
          )}

          {mode === "memory" && typed.length > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-xs">
              <span className="text-muted-foreground">Recall so far</span>
              <span className="font-semibold text-primary">{memoryMetrics.score}% · {memoryMetrics.recalledWords}/{memoryMetrics.totalWords} words</span>
            </div>
          )}

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-[10px] font-medium text-muted-foreground">
              <span>Practice progress</span>
              <span>{progress}%</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label="Practice progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div className="progress-fill h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {errorMessage && (
            <p role="alert" className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs text-destructive">
              {errorMessage}
            </p>
          )}
          <p role="status" aria-live="polite" className="sr-only">{announcement}</p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Flame size={14} className="text-primary" aria-hidden="true" />
              {mistakeEvents} {mistakeEvents === 1 ? "mistake" : "mistakes"} · {metrics.mistakeCount} in final text
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => resetChallenge()}
                className="button-quiet min-h-10 px-4 text-xs"
              >
                <RotateCcw size={14} aria-hidden="true" /> Start over
              </button>
              <button
                type="button"
                onClick={finishPractice}
                disabled={!canFinish}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {submitting
                  ? "Saving…"
                  : mode === "race"
                    ? "Submit race"
                    : mode === "keyboard"
                      ? "Complete lesson"
                      : "Complete practice"}
                {submitting ? <span className="size-3 animate-spin rounded-full border-2 border-current border-r-transparent" /> : <Check size={14} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[10px] text-muted-foreground">
        <span>Translation: King James Version · US public-domain text; verify local content rights before launch.</span>
        <span className="inline-flex items-center gap-1.5"><Sparkles size={12} aria-hidden="true" /> {mode === "memory" ? `Level ${memoryLevel} of 4` : "A daily practice, at your pace"}</span>
      </div>
    </div>
  );
}
