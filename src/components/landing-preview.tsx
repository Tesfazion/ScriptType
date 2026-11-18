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
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#211a34] text-white shadow-[0_32px_100px_rgba(47,29,85,0.28)]"
    >
      <div className="absolute -right-12 -top-16 size-56 rounded-full bg-[#8767d7]/20 blur-3xl" />
      <div className="relative grid min-h-[390px] sm:grid-cols-[0.78fr_1.22fr]">
        <div
          className="relative hidden min-h-[390px] overflow-hidden sm:block"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(32,25,52,0.08), rgba(32,25,52,0.72)), url('https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=900&q=86')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          role="img"
          aria-label="Open Bible in quiet morning light"
        >
          <div className="absolute inset-x-5 bottom-5">
            <p className="reading-type text-xl leading-7 text-white">Psalm 119:105</p>
          </div>
        </div>
        <div className="flex flex-col p-6 sm:p-7">
          <h2 id="try-a-verse" className="reading-type max-w-[500px] text-[1.65rem] leading-[1.35] tracking-[-0.025em] sm:text-[1.8rem]">
            Thy word is a lamp unto my feet, and a light unto my path.
          </h2>
          <label htmlFor="landing-verse-input" className="mt-6 text-xs font-medium text-white/55">
            Type the verse
          </label>
          <input
            id="landing-verse-input"
            value={typed}
            onChange={(event) => setTyped(event.target.value.slice(0, verse.text.length))}
            className="mt-2 h-12 w-full border-b border-white/20 bg-transparent px-0 font-mono text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#b69aff]"
            placeholder="Begin here"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="mt-4 flex items-center justify-between text-xs text-white/55">
            <span>{complete ? "Verse complete" : "At your own pace"}</span>
            <span aria-live="polite">{progress}%</span>
          </div>
          <div
            className="mt-2 h-1 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label="Verse preview progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="progress-fill h-full rounded-full bg-gradient-to-r from-[#9d7be8] to-[#d7c6ff]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <Link
            href="/practice"
            className="mt-auto inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#f7f3ff] px-5 text-xs font-semibold text-[#302047] transition hover:-translate-y-0.5 hover:bg-white"
          >
            {complete ? "Continue" : "Enter a challenge"}
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
