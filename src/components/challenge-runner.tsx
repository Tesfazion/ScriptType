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
import { submitPractice } from "@/lib/progress-service";
import {
  calculateMemoryMetrics,
  calculateTypingMetrics,
} from "../../shared/domain";

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
};

function isMajorWord(word: string, wordIndex: number): boolean {
  return !STOP_WORDS.has(word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "")) && wordIndex % 2 === 0;
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
      className="reading-type text-[1.4rem] leading-[1.75] tracking-[0.005em] sm:text-[1.7rem]"
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
                  ? "text-[#26775d] dark:text-[#76dab6]"
                  : "bg-[#fbe6e7] text-[#b63d4a] dark:bg-[#522a33] dark:text-[#ff9da4]"
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
}: {
  initialMode: PracticeMode;
  initialVerseId?: string;
}) {
  const [verseId, setVerseId] = useState(
    initialVerseId && verses.some((item) => item.id === initialVerseId)
      ? initialVerseId
      : (verses[0]?.id ?? ""),
  );
  const [mode, setMode] = useState<PracticeMode>(initialMode);
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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const verse = useMemo(
    () => verses.find((item) => item.id === verseId) ?? verses[0],
    [verseId],
  );
  const metrics = calculateTypingMetrics(verse.text, typed, elapsedMs);
  const memoryMetrics = calculateMemoryMetrics(verse.text, typed);
  const progress = Math.min(100, Math.round((typed.length / verse.text.length) * 100));
  const remaining = Math.max(0, verse.text.length - typed.length);
  const isComplete = typed.length === verse.text.length;
  const visibleVerse = getVisibleVerse(verse, memoryLevel);

  useEffect(() => {
    if (startTime === null || completion) return;
    const timer = window.setInterval(
      () => setElapsedMs(performance.now() - startTime),
      250,
    );
    return () => window.clearInterval(timer);
  }, [startTime, completion]);

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
      setAnnouncement("Practice started. Your progress is saved on this device in demo mode.");
    }

    if (nextValue.length > typed.length) {
      for (let index = typed.length; index < nextValue.length; index += 1) {
        if (nextValue[index] !== verse.text[index]) {
          setMistakeEvents((count) => count + 1);
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
      const saved = await submitPractice({
        verseId: verse.id,
        typedText: typed,
        elapsedMs: finalElapsedMs,
        startedAtMs: Date.now() - finalElapsedMs,
        mode,
      });
      const synced = "sessionId" in saved;
      const savedMetrics = synced ? saved.metrics : saved;
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
      });
      setAnnouncement("Practice complete. Your result and next step are ready.");
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
        <div className="mission-glow relative overflow-hidden rounded-[2rem] p-6 text-white shadow-[0_24px_70px_rgba(32,23,52,0.2)] sm:p-10">
          <div className="absolute -right-14 -top-20 size-64 rounded-full bg-[#9a78e5]/20 blur-3xl" />
          <div className="relative">
            <Link href="/today" className="inline-flex items-center gap-2 text-xs text-white/65 hover:text-white">
              <ArrowLeft size={14} aria-hidden="true" /> Back to today
            </Link>
            <div className="mt-10 flex size-14 items-center justify-center rounded-[1.2rem] bg-[#f2c46f]/15 text-[#f2c46f]">
              <Sparkles size={25} aria-hidden="true" />
            </div>
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.19em] text-[#c8b7ed]">
              A moment well spent
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
              Verse complete.
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
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f2c46f]/15 px-4 py-2 text-xs font-semibold text-[#f2c46f]">
                <Sparkles size={14} aria-hidden="true" /> +{completion.xpEarned} XP
              </span>
              {completion.memoryScore !== undefined && (
                <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/80">
                  Recall score · {completion.memoryScore}%
                </span>
              )}
              {completion.activeStreak > 0 && (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/80">
                  <Flame size={14} className="text-[#f2c46f]" aria-hidden="true" />
                  {completion.activeStreak}-day rhythm
                </span>
              )}
            </div>
            <p className="mt-4 text-[11px] text-white/45">
              {completion.synced
                ? "Saved to your account."
                : "Device demo · this progress is saved only in this browser."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/reflection" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-xs font-semibold text-[#2c2141] hover:bg-[#f4efff]">
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
            {mode === "typing" ? "A moment in the Word" : mode === "memory" ? "Keep it close" : "Listen, then remember"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "typing"
              ? "Read slowly. Type at your own pace."
              : mode === "memory"
                ? "Move from reading to recall, one level at a time."
                : "Hear the verse in your browser, then type what you hear."}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-[10px] font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-growth" />
          Saved on this device in demo mode
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

      <section className="overflow-hidden rounded-[1.8rem] border bg-card shadow-[0_18px_50px_rgba(43,32,63,0.055)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4 sm:px-7">
          <div>
            <label htmlFor="verse-select" className="text-[9px] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
              Today&apos;s passage
            </label>
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
          {mode === "typing" ? (
            <CharacterGuide verse={verse} typed={typed} />
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
              <span>{mode === "typing" ? "Your typing" : mode === "memory" ? "Your recall" : "Type what you hear"}</span>
              {mode === "typing" && typed.length < verse.text.length && (
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
                mode === "typing"
                  ? "Click here, then type the verse…"
                  : "Type the words you remember…"
              }
              spellCheck={false}
              autoCapitalize="off"
              className="w-full resize-none rounded-2xl border bg-background px-4 py-4 font-mono text-sm leading-7 text-foreground outline-none transition placeholder:text-muted-foreground/65 focus:border-primary/60 focus:ring-4 focus:ring-primary/10 sm:px-5 sm:py-5 sm:text-base"
            />
            <div id="practice-help" className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground">
              <span>
                {mode === "typing"
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
              <div className="progress-fill h-full rounded-full bg-gradient-to-r from-[#7050c8] to-[#a98ce8]" style={{ width: `${progress}%` }} />
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
              <Flame size={14} className="text-[#ba8b38]" aria-hidden="true" />
              {mistakeEvents} {mistakeEvents === 1 ? "mistake" : "mistakes"} · {metrics.mistakeCount} in final text
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => resetChallenge()}
                className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <RotateCcw size={14} aria-hidden="true" /> Start over
              </button>
              <button
                type="button"
                onClick={finishPractice}
                disabled={!isComplete || submitting || startTime === null}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {submitting ? "Saving…" : "Complete verse"}
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
