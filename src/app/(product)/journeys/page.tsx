"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Check,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { Keyboard } from "lucide-react";
import { journeys } from "@/data/journeys";
import { getVerse } from "@/data/verses";
import { useProgress } from "@/hooks/use-progress";
import { typingStages } from "../../../../shared/typing-curriculum";
import { getNextTypingStage, isTypingStageUnlocked } from "../../../../shared/typing-progress";

export default function JourneysPage() {
  const { progress, errorMessage } = useProgress();
  const completedStageIds = progress?.completedKeyboardStageIds ?? [];
  const nextStage = getNextTypingStage(completedStageIds);
  const typingProgress = Math.round(
    (completedStageIds.length / typingStages.length) * 100,
  );

  return (
    <div className="float-in">
      <div className="mb-8 max-w-2xl">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">A path through Scripture</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">Choose a journey.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Take the next small step through a book, a theme, or a reading rhythm. Each path includes three sample passages.
        </p>
      </div>
      {errorMessage && <p role="alert" className="mb-5 text-xs text-destructive">{errorMessage}</p>}

      <section className="surface-card mb-5 overflow-hidden" aria-labelledby="beginner-journey">
        <div className="mission-glow p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="eyebrow flex items-center gap-2 text-white/70">
                <Keyboard size={14} aria-hidden="true" />
                Beginner journey
              </div>
              <h2 id="beginner-journey" className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                From first key to confident typing
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
                {nextStage
                  ? `Next up: Stage ${nextStage.number} — ${nextStage.title}`
                  : `All ${typingStages.length} stages complete. Keep practicing to stay sharp.`}
              </p>
            </div>
            <div className="rounded-card border border-white/15 bg-white/10 px-4 py-3 text-right">
              <p className="text-2xl font-semibold">{completedStageIds.length}/{typingStages.length}</p>
              <p className="mt-1 text-xs text-white/60">stages complete</p>
            </div>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-white transition-[width]" style={{ width: `${typingProgress}%` }} />
          </div>
        </div>

        <ol className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-4">
          {typingStages.map((stage) => {
            const isComplete = completedStageIds.includes(stage.id);
            const isUnlocked = isTypingStageUnlocked(stage.number, completedStageIds);
            return (
              <li key={stage.id}>
                <Link
                  href={isUnlocked ? `/practice?stage=${stage.id}` : "/journeys"}
                  aria-disabled={!isUnlocked}
                  className={`flex min-h-24 items-start gap-3 rounded-card border p-4 transition ${
                    isComplete
                      ? "border-primary/25 bg-accent"
                      : isUnlocked
                        ? "bg-card hover:border-primary/40 hover:-translate-y-0.5"
                        : "bg-muted/50 opacity-65"
                  }`}
                >
                  <span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                    isComplete ? "bg-primary text-primary-foreground" : isUnlocked ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {isComplete ? <Check size={14} aria-hidden="true" /> : isUnlocked ? stage.number : <LockKeyhole size={13} aria-hidden="true" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Stage {stage.number}</span>
                    <span className="mt-1 block text-sm font-semibold">{stage.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">{stage.lesson.estimatedMinutes} min</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {journeys.map((journey) => {
          const completed = journey.verseIds.filter((verseId) =>
            progress?.completedVerseIds.includes(verseId),
          ).length;
          const percent = Math.round((completed / journey.verseIds.length) * 100);
          const verse = getVerse(journey.verseIds[0]);
          return (
            <article key={journey.id} className="surface-card group overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-panel">
              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary to-primary/75 p-5 text-primary-foreground">
                <div className="absolute -right-7 -top-10 size-44 rounded-full border border-white/15" />
                <div className="absolute -right-1 top-8 size-28 rounded-full border border-white/10" />
                <div className="absolute bottom-[-43px] left-6 size-36 rotate-12 rounded-panel border border-mission-divider" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]">
                      {journey.category}
                    </span>
                    <span className="grid size-9 place-items-center rounded-control border border-white/20 bg-white/10">
                      <BookOpenText size={17} aria-hidden="true" />
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-white/80">{verse?.reference} · KJV</p>
                    <p className="reading-type mt-1 max-w-[330px] text-xl leading-7">
                      {verse?.text.slice(0, 68)}{(verse?.text.length ?? 0) > 68 ? "…" : ""}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold tracking-[-0.025em]">{journey.title}</h2>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{journey.subtitle}</p>
                  </div>
                  {journey.premium && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                      <LockKeyhole size={10} aria-hidden="true" /> Planned
                    </span>
                  )}
                </div>
                <div className="mt-5 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{journey.lengthLabel}</span>
                  <span>{completed} / {journey.verseIds.length} sample steps</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="progress-fill h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                </div>
                <Link
                  href={`/journeys/${journey.id}`}
                  className="mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border text-xs font-semibold transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  {completed > 0 ? "Continue journey" : "Explore this journey"}
                  {completed === journey.verseIds.length ? <Check size={14} aria-hidden="true" /> : <ArrowRight size={14} aria-hidden="true" />}
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-7 flex items-start gap-3 rounded-2xl border bg-card p-4 text-xs leading-5 text-muted-foreground">
        <Sparkles size={15} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
        <p>
          Journey content is available in this build. Full reading plans and verse schedules will be available after editorial review and licensed content configuration.
        </p>
      </div>
    </div>
  );
}
