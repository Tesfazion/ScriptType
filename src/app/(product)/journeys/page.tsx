"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Check,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { journeys } from "@/data/journeys";
import { getVerse } from "@/data/verses";
import { useProgress } from "@/hooks/use-progress";

const colors = {
  violet: "from-[#47306e] to-[#7759ae]",
  green: "from-[#1e5644] to-[#3f9475]",
  gold: "from-[#61491e] to-[#b58b3b]",
};

export default function JourneysPage() {
  const { progress, errorMessage } = useProgress();

  return (
    <div className="float-in">
      <div className="mb-8 max-w-2xl">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">A path through Scripture</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">Choose a journey.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Take the next small step through a book, a theme, or a reading rhythm. Each path here is a curated preview with three sample passages.
        </p>
      </div>
      {errorMessage && <p role="alert" className="mb-5 text-xs text-destructive">{errorMessage}</p>}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {journeys.map((journey) => {
          const completed = journey.verseIds.filter((verseId) =>
            progress?.completedVerseIds.includes(verseId),
          ).length;
          const percent = Math.round((completed / journey.verseIds.length) * 100);
          const verse = getVerse(journey.verseIds[0]);
          return (
            <article key={journey.id} className="group overflow-hidden rounded-[1.7rem] border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(37,25,57,0.1)]">
              <div className={`relative h-[170px] overflow-hidden bg-gradient-to-br ${colors[journey.color]} p-5 text-white`}>
                <div className="absolute -right-7 -top-10 size-44 rounded-full border border-white/15" />
                <div className="absolute -right-1 top-8 size-28 rounded-full border border-white/10" />
                <div className="absolute bottom-[-43px] left-6 size-36 rotate-12 rounded-[2rem] border border-white/15" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]">
                      {journey.category}
                    </span>
                    <span className="grid size-9 place-items-center rounded-xl border border-white/20 bg-white/10">
                      <BookOpenText size={17} aria-hidden="true" />
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/65">{verse?.reference} · KJV</p>
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
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#fbf0d7] px-2 py-1 text-[9px] font-semibold text-[#80590f] dark:bg-[#3b3020] dark:text-[#f2c46f]">
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
          Journey content is a preview in this build. The full reading plans and verse schedules require editorial review and licensed content configuration before launch.
        </p>
      </div>
    </div>
  );
}
