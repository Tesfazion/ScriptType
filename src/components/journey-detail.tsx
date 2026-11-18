"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Compass, Sparkles } from "lucide-react";
import type { Journey } from "@/data/journeys";
import { getVerse } from "@/data/verses";
import { useProgress } from "@/hooks/use-progress";

export function JourneyDetail({ journey }: { journey: Journey }) {
  const { progress, errorMessage } = useProgress();

  const doneCount = journey.verseIds.filter((id) =>
    progress?.completedVerseIds.includes(id),
  ).length;

  return (
    <div className="mx-auto max-w-[900px] float-in">
      <Link href="/journeys" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft size={14} aria-hidden="true" /> All journeys
      </Link>
      <section className="mission-glow relative mt-5 overflow-hidden rounded-[2rem] p-6 text-white sm:p-9">
        <div className="absolute -right-16 -top-20 size-64 rounded-full border border-white/10" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#c8b7ed]">
            <Compass size={13} aria-hidden="true" /> {journey.category} · {journey.lengthLabel}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">{journey.title}</h1>
          <p className="mt-3 max-w-[620px] text-sm leading-6 text-white/65">{journey.subtitle}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] text-white/70">
              {doneCount} of {journey.verseIds.length} sample steps complete
            </span>
            <span className="rounded-full border border-[#f2c46f]/20 bg-[#f2c46f]/10 px-3 py-1.5 text-[10px] text-[#f2c46f]">
              Preview content
            </span>
          </div>
        </div>
      </section>

      {errorMessage && <p role="alert" className="mt-5 text-xs text-destructive">{errorMessage}</p>}

      <div className="relative mt-7 space-y-3">
        <div className="absolute bottom-7 left-[21px] top-7 w-px bg-gradient-to-b from-primary/50 via-border to-transparent" />
        {journey.verseIds.map((verseId, index) => {
          const verse = getVerse(verseId);
          if (!verse) return null;
          const done = progress?.completedVerseIds.includes(verseId) ?? false;
          return (
            <article key={verse.id} className="relative flex gap-4 rounded-[1.5rem] border bg-card p-4 sm:gap-5 sm:p-5">
              <div className={`relative z-10 grid size-11 shrink-0 place-items-center rounded-full border-4 border-background ${
                done ? "bg-growth text-white" : "bg-primary/10 text-primary"
              }`}>
                {done ? <Check size={15} aria-hidden="true" /> : <span className="text-[10px] font-bold">{String(index + 1).padStart(2, "0")}</span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Step {index + 1} · {verse.reference}</span>
                  {done && <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-growth"><Check size={11} /> Complete</span>}
                </div>
                <p className="reading-type mt-2 text-lg leading-7">{verse.text}</p>
                <Link href={`/practice?verse=${verse.id}`} className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-full bg-primary/10 px-4 text-[10px] font-semibold text-primary transition hover:bg-primary/15">
                  {done ? "Practice again" : "Practice this verse"} <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-5 flex items-start gap-2 text-[10px] leading-5 text-muted-foreground">
        <Sparkles size={13} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
        This sample journey has three passages in the current preview. Full reading schedules will be published after editorial review.
      </p>
    </div>
  );
}
