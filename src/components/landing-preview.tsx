"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { getVerse } from "@/data/verses";

const verse = getVerse("psalm-119-105");

export function LandingPreview() {
  const [typed, setTyped] = useState("");

  if (!verse) return null;

  const progress = Math.min(100, Math.round((typed.length / verse.text.length) * 100));
  const complete = typed === verse.text;

  return (
    <section
      aria-labelledby="try-a-verse"
      className="mission-glow relative overflow-hidden rounded-panel border border-mission-divider text-mission-foreground shadow-float"
    >
      <div className="absolute -right-12 -top-16 size-56 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative grid min-h-[390px] sm:grid-cols-[0.78fr_1.22fr]">
        <div
          className="scripture-photo relative hidden min-h-[390px] overflow-hidden sm:block"
          role="img"
          aria-label="Worshippers gathered at a Christian music event"
        >
          <div className="absolute inset-x-5 bottom-5">
            <p className="reading-type text-xl leading-7 text-mission-foreground">Psalm 119:105</p>
          </div>
        </div>
        <div className="flex flex-col p-6 sm:p-7">
          <h2 id="try-a-verse" className="reading-type max-w-[500px] text-[1.65rem] leading-[1.35] tracking-[-0.025em] sm:text-[1.8rem]">
            Thy word is a lamp unto my feet, and a light unto my path.
          </h2>
          <label htmlFor="landing-verse-input" className="mt-6 text-sm font-medium text-mission-muted">
            Type the verse
          </label>
          <input
            id="landing-verse-input"
            value={typed}
            onChange={(event) => setTyped(event.target.value.slice(0, verse.text.length))}
            className="mission-input mt-2"
            placeholder="Begin here"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="mt-4 flex items-center justify-between text-sm text-mission-muted">
            <span>{complete ? "Verse complete" : "At your own pace"}</span>
            <span aria-live="polite">{progress}%</span>
          </div>
          <div
            className="mt-2 h-1 overflow-hidden rounded-full bg-mission-divider"
            role="progressbar"
            aria-label="Verse preview progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="progress-fill h-full rounded-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
          <Link
            href="/practice"
            className="button-mission mt-auto w-fit"
          >
            {complete ? "Continue" : "Enter a challenge"}
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
