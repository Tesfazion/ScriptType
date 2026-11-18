"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  Check,
  Flame,
  LockKeyhole,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "@/components/app-providers";
import { journeys } from "@/data/journeys";
import { getVerse } from "@/data/verses";
import { useProgress } from "@/hooks/use-progress";
import { getLevelProgress } from "../../../../shared/domain";

export default function TodayPage() {
  const { user, firebaseConfigured } = useAuth();
  const { progress, errorMessage } = useProgress();

  const todayVerse = getVerse("psalm-119-105");
  const journey = journeys[0];
  const completedJourneySteps = useMemo(
    () =>
      progress
        ? journey.verseIds.filter((verseId) =>
            progress.completedVerseIds.includes(verseId),
          ).length
        : 0,
    [journey.verseIds, progress],
  );
  const nextLevel = progress ? getLevelProgress(progress.xp) : null;
  const displayName = user?.displayName?.split(" ")[0] || "friend";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (!todayVerse) return null;

  return (
    <div className="float-in">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-growth" />
            Your quiet corner
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em] sm:text-[2.5rem]">
            {greeting}, {displayName}.
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Today is open. One verse is enough.
          </p>
        </div>
        <Link
          href="/practice"
          className="hidden min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 sm:inline-flex"
        >
          Start today&apos;s mission <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3 border-b pb-3 text-[11px] text-muted-foreground">
        <p className="flex items-center gap-2">
          {user ? <Check size={13} className="shrink-0 text-growth" aria-hidden="true" /> : <LockKeyhole size={12} className="shrink-0" aria-hidden="true" />}
          {user
            ? "Signed in. Practice rewards and progress are verified and stored with Firebase."
            : `Device ${firebaseConfigured ? "preview" : "demo"}: practice progress is saved only in this browser. Sign in with Firebase to sync across devices.`}
        </p>
        {!user && (
          <Link href="/sign-in" className="hidden shrink-0 font-semibold text-primary sm:inline">
            Sign in
          </Link>
        )}
      </div>

      {errorMessage && (
        <p role="alert" className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs text-destructive">
          {errorMessage}
        </p>
      )}

      <section
        className="mission-glow relative isolate overflow-hidden rounded-[2.2rem] text-white shadow-[0_28px_80px_rgba(30,20,49,0.22)]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(38,28,70,0.94), rgba(24,21,37,0.96)), url('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1600&q=88')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute -right-24 -top-28 size-[420px] rounded-full bg-[#9d78df]/15 blur-[90px]" />
        <div className="absolute bottom-[-220px] left-[38%] size-[440px] rounded-full border border-white/[0.055]" />
        <div className="relative grid min-h-[430px] lg:grid-cols-[1.48fr_0.52fr]">
          <div className="flex flex-col px-6 py-7 sm:px-9 sm:py-9 lg:px-12 lg:py-10">
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d2c1f4]">
                <span className="grid size-7 place-items-center rounded-full bg-white/[0.08]">
                  <Sparkles size={13} aria-hidden="true" />
                </span>
                Today&apos;s first move
              </span>
              <span className="hidden text-[10px] text-white/40 sm:inline">4 minute practice</span>
            </div>

            <div className="my-auto max-w-[760px] py-9">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c8b7ed]">
                <BookOpenText size={13} aria-hidden="true" />
                {todayVerse.reference} <span className="text-white/30">·</span> KJV
              </div>
              <blockquote className="reading-type mt-5 text-[clamp(2.1rem,4.8vw,4.2rem)] leading-[1.12] tracking-[-0.045em] text-white">
                “Thy word is a lamp unto my feet,
                <span className="block text-[#d8caef]">and a light unto my path.</span>”
              </blockquote>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs text-white/55">Read it. Type it. Let it stay.</p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-white/45">
                  <Target size={13} className="text-[#dcc16f]" aria-hidden="true" />
                  Week rhythm · {progress?.weeklySessions ?? 0}/{progress?.weeklyGoal ?? 5} days
                </div>
              </div>
              <Link
                href="/practice"
                className="group inline-flex min-h-14 items-center gap-3 rounded-full bg-[#f7f3ff] px-7 text-sm font-semibold text-[#302047] shadow-[0_16px_36px_rgba(8,5,20,0.24)] transition hover:-translate-y-1 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Begin today&apos;s verse
                <span className="grid size-7 place-items-center rounded-full bg-[#6041b8] text-white transition group-hover:translate-x-1">
                  <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>

          <aside className="border-t border-white/[0.08] bg-white/[0.035] px-6 py-7 sm:px-8 lg:border-l lg:border-t-0 lg:px-7 lg:py-9">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">Your journey</p>
              <Link href={`/journeys/${journey.id}`} className="text-[10px] font-semibold text-[#d8caef] hover:text-white">
                View all
              </Link>
            </div>
            <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em]">{journey.title}</h2>
            <p className="mt-2 text-xs leading-5 text-white/45">A gentle path through the Gospel of John.</p>

            <div className="mt-8 space-y-1">
              {journey.verseIds.map((verseId, index) => {
                const verse = getVerse(verseId);
                const isDone = progress?.completedVerseIds.includes(verseId) ?? false;
                const isNext =
                  !isDone &&
                  journey.verseIds.findIndex((id) => !progress?.completedVerseIds.includes(id)) === index;
                return (
                  <div key={verseId} className="relative flex gap-3 pb-5 last:pb-0">
                    {index < journey.verseIds.length - 1 && (
                      <span className={`absolute bottom-0 left-[15px] top-8 w-px ${isDone ? "journey-line" : "bg-white/10"}`} />
                    )}
                    <span
                      className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full border text-[9px] font-bold ${
                        isDone
                          ? "border-[#62b89c] bg-[#62b89c] text-[#10281f]"
                          : isNext
                            ? "border-[#cbb8ef] bg-[#cbb8ef] text-[#342348]"
                            : "border-white/15 bg-white/[0.04] text-white/40"
                      }`}
                    >
                      {isDone ? <Check size={13} aria-hidden="true" /> : String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-xs font-semibold">{verse?.reference}</p>
                      <p className="mt-1 line-clamp-1 text-[10px] text-white/40">
                        {isDone ? "Completed" : isNext ? "Your next verse" : "Coming next"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-2xl border border-white/[0.08] bg-black/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/45">Journey progress</span>
                <span className="text-xs font-semibold">
                  {completedJourneySteps}/{journey.verseIds.length}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="progress-fill h-full rounded-full bg-[#b69aff]"
                  style={{ width: `${(completedJourneySteps / journey.verseIds.length) * 100}%` }}
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_1fr]">
        <section className="flex min-h-[128px] items-center gap-4 rounded-[1.5rem] border bg-card px-5 py-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#fbefda] text-[#a47724] dark:bg-[#3b3020] dark:text-[#f2c46f]">
            <Flame size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Active rhythm</p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.05em]">
              {progress?.activeStreak ?? 0} <span className="text-sm font-medium text-muted-foreground">days</span>
            </p>
            <Link href="/progress" className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
              View progress <ArrowRight size={11} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="flex min-h-[128px] items-center gap-4 rounded-[1.5rem] border bg-card px-5 py-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Trophy size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {nextLevel?.rank ?? "Seeker"} · Level {nextLevel?.level ?? 1}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.05em]">{progress?.xp ?? 0} XP</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="progress-fill h-full rounded-full bg-primary" style={{ width: `${nextLevel?.progressPercent ?? 0}%` }} />
            </div>
          </div>
        </section>

        <Link
          href="/memory"
          className="group flex min-h-[128px] items-center gap-4 rounded-[1.5rem] border border-primary/10 bg-[#f3effa] px-5 py-4 transition hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_16px_40px_rgba(58,39,93,0.08)] dark:bg-[#24202f]"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#6041b8] text-white shadow-[0_10px_24px_rgba(96,65,184,0.22)]">
            <Sparkles size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Strengthen memory</p>
            <p className="mt-1 text-sm font-semibold">Recall yesterday&apos;s verse</p>
            <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              Open practice <ArrowRight size={11} className="transition group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
