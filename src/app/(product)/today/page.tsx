"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpenText,
  Check,
  Flame,
  Gauge,
  Keyboard,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "@/components/app-providers";
import { journeys } from "@/data/journeys";
import { getVerse } from "@/data/verses";
import { useProgress } from "@/hooks/use-progress";
import {
  getNextTypingStage,
  getTypingBadgeIds,
  getTypingLevelProgress,
  typingBadges,
} from "../../../../shared/typing-progress";

function getLocalDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function MiniTrend({
  label,
  values,
  suffix,
}: {
  label: string;
  values: number[];
  suffix: string;
}) {
  const width = 168;
  const height = 48;
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const range = Math.max(max - min, 1);
  const points = values
    .map((value, index) => {
      const x = 4 + (index / Math.max(1, values.length - 1)) * (width - 8);
      const y = height - 4 - ((value - min) / range) * (height - 8);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <figure className="min-w-0">
      <figcaption className="text-xs font-medium text-muted-foreground">{label}</figcaption>
      {values.length > 1 ? (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${label} recent values: ${values.join(", ")} ${suffix}`}
          className="mt-2 h-12 w-full overflow-visible text-primary"
        >
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {values.map((value, index) => {
            const x = 4 + (index / Math.max(1, values.length - 1)) * (width - 8);
            const y = height - 4 - ((value - min) / range) * (height - 8);
            return <circle key={`${index}-${value}`} cx={x} cy={y} r="2.5" fill="currentColor" />;
          })}
        </svg>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">Complete another session to see your trend.</p>
      )}
    </figure>
  );
}

function Goal({
  title,
  value,
  target,
  detail,
}: {
  title: string;
  value: number;
  target: number;
  detail: string;
}) {
  const complete = value >= target;
  const percent = Math.min(100, Math.round((value / target) * 100));

  return (
    <li className="rounded-xl border bg-card px-3 py-3">
      <div className="flex items-start gap-2">
        <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${complete ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          {complete ? <Check size={12} aria-hidden="true" /> : <Target size={11} aria-hidden="true" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold">{title}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{detail}</p>
        </div>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={`${title} progress`}
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={Math.min(target, value)}
      >
        <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${percent}%` }} />
      </div>
    </li>
  );
}

export default function TodayPage() {
  const { user } = useAuth();
  const { progress, errorMessage, loading } = useProgress();
  const nextStage = getNextTypingStage(progress?.completedKeyboardStageIds ?? []);
  const typingLevel = getTypingLevelProgress(progress?.xp ?? 0);
  const scriptureJourney = journeys[0];
  const displayName = user?.displayName?.split(" ")[0] || "friend";
  const todayKey = getLocalDateKey(new Date());
  const todaySessions = useMemo(
    () => progress?.sessions.filter((session) => getLocalDateKey(new Date(session.completedAt)) === todayKey) ?? [],
    [progress?.sessions, todayKey],
  );
  const todayWords = todaySessions.reduce(
    (total, session) => total + Math.floor(session.correctCharacters / 5),
    0,
  );
  const lessonsToday = todaySessions.filter((session) => session.mode === "keyboard").length;
  const hasAccuracyGoal = todaySessions.some((session) => session.accuracy >= 95);
  const recentSessions = [...(progress?.sessions ?? [])].slice(0, 7).reverse();
  const unlockedBadgeIds = Array.from(new Set([
    ...getTypingBadgeIds({
    completedLessons: progress?.sessions.filter((session) => session.mode === "keyboard").length ?? 0,
    completedStageIds: progress?.completedKeyboardStageIds ?? [],
    streak: progress?.activeStreak ?? 0,
    bestWpm: progress?.bestWpm ?? 0,
    perfectLessons: progress?.perfectLessons ?? 0,
    wordsTyped: progress?.wordsTyped ?? 0,
    }),
    ...(progress?.achievementIds ?? []),
  ]));
  const earnedBadges = typingBadges.filter((badge) => unlockedBadgeIds.includes(badge.id)).slice(-3).reverse();
  const weeklyDates = useMemo(() => {
    const monday = new Date();
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  }, []);
  const qualifiedDates = new Set(progress?.qualifiedDates ?? []);
  const completedScriptureSteps = scriptureJourney.verseIds.filter((verseId) =>
    progress?.completedVerseIds.includes(verseId),
  ).length;
  const currentVerse = getVerse(scriptureJourney.verseIds[completedScriptureSteps] ?? scriptureJourney.verseIds[0]);
  const displayWpm = progress?.averageWpm ?? 0;
  const displayAccuracy = progress?.averageAccuracy ?? 0;
  const timeMinutes = Math.round(
    todaySessions.reduce((total, session) => total + session.elapsedSeconds, 0) / 60,
  );

  return (
    <div className="float-in mx-auto max-w-[1160px] space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Your learning home</p>
          <h1 className="page-title mt-1.5">Good to see you, {displayName}.</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build a skill. Keep the words that matter close.
          </p>
        </div>
        <Link href="/profile" className="button-secondary min-h-10 px-3 text-xs">
          <span className="grid size-7 place-items-center rounded-full bg-primary/10 font-semibold text-primary">
            {displayName.slice(0, 1).toLocaleUpperCase()}
          </span>
          Level {typingLevel.level} · {typingLevel.rank}
        </Link>
      </header>

      <section className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)]">
        <article className="mission-glow relative overflow-hidden rounded-panel p-5 text-white shadow-panel sm:p-6">
          <div className="pointer-events-none absolute -right-12 -top-20 size-60 rounded-full border border-white/10" aria-hidden="true" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xl">
              <p className="eyebrow text-white/65">Your typing journey · Lesson {nextStage?.number ?? 15} of 15</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                {nextStage ? nextStage.title : "Keep building your fluency"}
              </h2>
              <p className="mt-2 text-sm text-white/70">
                {nextStage?.description ?? "All 15 lessons complete. Practice any skill to keep it sharp."}
              </p>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/10">
              <Keyboard size={20} aria-hidden="true" />
            </span>
          </div>
          <div className="relative mt-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-white/65">{nextStage?.lesson.focus ?? "Choose a practice mode"}</p>
              <p className="mt-1 text-xs text-white/55">{nextStage?.lesson.estimatedMinutes ?? 5} minutes · {nextStage?.lesson.accuracyToUnlock ?? 90}% accuracy to unlock</p>
            </div>
            <Link href={nextStage ? `/practice?stage=${nextStage.id}` : "/practice"} className="button-mission">
              Continue lesson <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </article>

        <article className="surface-card flex flex-col justify-between p-4 sm:p-5" aria-labelledby="scripture-journey-title">
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="eyebrow">Scripture journey</p>
              <BookOpenText size={16} className="text-primary" aria-hidden="true" />
            </div>
            <h2 id="scripture-journey-title" className="mt-2 text-base font-semibold">{scriptureJourney.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {currentVerse?.reference ?? "Continue your reading"} · {completedScriptureSteps}/{scriptureJourney.verseIds.length} sample steps
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Scripture journey progress" aria-valuemin={0} aria-valuemax={scriptureJourney.verseIds.length} aria-valuenow={completedScriptureSteps}>
              <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${Math.round((completedScriptureSteps / scriptureJourney.verseIds.length) * 100)}%` }} />
            </div>
          </div>
          <Link href={`/practice?verse=${currentVerse?.id ?? "psalm-119-105"}`} className="mt-4 inline-flex min-h-10 items-center justify-between rounded-lg border px-3 text-xs font-semibold transition hover:border-primary/40 hover:bg-accent">
            Continue Scripture practice <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </article>
      </section>

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Your current skill summary">
        {[
          { label: "Experience", value: `${(progress?.xp ?? 0).toLocaleString()} XP`, detail: `${typingLevel.xpNeeded - typingLevel.xpInLevel} XP to next level`, icon: Trophy },
          { label: "Typing speed", value: `${displayWpm} WPM`, detail: "recent average", icon: Gauge },
          { label: "Accuracy", value: `${displayAccuracy}%`, detail: "recent average", icon: Target },
          { label: "Daily streak", value: `${progress?.activeStreak ?? 0} days`, detail: "practice at your pace", icon: Flame },
        ].map(({ label, value, detail, icon: Icon }) => (
          <article key={label} className="surface-card flex min-h-24 items-center gap-3 p-3 sm:p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-primary">
              <Icon size={16} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">{label}</p>
              <p className="mt-0.5 truncate text-lg font-semibold tabular-nums">{loading ? "—" : value}</p>
              <p className="truncate text-[10px] text-muted-foreground">{detail}</p>
            </div>
          </article>
        ))}
      </section>

      {errorMessage && (
        <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.85fr)]">
        <article className="surface-card p-4 sm:p-5" aria-labelledby="daily-goals-title">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Small, meaningful wins</p>
              <h2 id="daily-goals-title" className="mt-1 text-base font-semibold">Daily goals</h2>
            </div>
            <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground">Today</span>
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            <Goal title="Type 500 words" value={todayWords} target={500} detail={`${todayWords} / 500 words`} />
            <Goal title="Finish 1 lesson" value={lessonsToday} target={1} detail={`${lessonsToday} / 1 lesson`} />
            <Goal title="Reach 95% accuracy" value={hasAccuracyGoal ? 1 : 0} target={1} detail={hasAccuracyGoal ? "Goal reached" : "In any practice today"} />
          </ul>
        </article>

        <article className="surface-card p-4 sm:p-5" aria-labelledby="weekly-progress-title">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Your week</p>
              <h2 id="weekly-progress-title" className="mt-1 text-base font-semibold">Practice rhythm</h2>
            </div>
            <span className="text-xs font-semibold tabular-nums">
              {progress?.weeklySessions ?? 0}<span className="text-muted-foreground"> / {progress?.weeklyGoal ?? 5} days</span>
            </span>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {weeklyDates.map((date) => {
              const dateKey = getLocalDateKey(date);
              const isComplete = qualifiedDates.has(dateKey);
              return (
                <div key={dateKey} className="text-center">
                  <span className={`mx-auto grid aspect-square max-w-9 place-items-center rounded-lg text-xs ${isComplete ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {isComplete ? <Check size={14} aria-hidden="true" /> : date.getDate()}
                  </span>
                  <span className="mt-1 block text-[9px] text-muted-foreground">{date.toLocaleDateString(undefined, { weekday: "narrow" })}</span>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.78fr)]">
        <article className="surface-card p-4 sm:p-5" aria-labelledby="typing-analytics-title">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Skill over time</p>
              <h2 id="typing-analytics-title" className="mt-1 text-base font-semibold">Typing analytics</h2>
            </div>
            <span className="text-[10px] text-muted-foreground">{timeMinutes} min today</span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <MiniTrend label="Speed" values={recentSessions.map((session) => session.wpm)} suffix="WPM" />
            <MiniTrend label="Accuracy" values={recentSessions.map((session) => session.accuracy)} suffix="percent" />
            <MiniTrend label="Time" values={recentSessions.map((session) => session.elapsedSeconds / 60)} suffix="minutes" />
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground">
            {progress?.sessions.length ?? 0} recent sessions · progress improves with regular, comfortable practice.
          </p>
        </article>

        <article className="surface-card p-4 sm:p-5" aria-labelledby="recent-achievements-title">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Milestones earned</p>
              <h2 id="recent-achievements-title" className="mt-1 text-base font-semibold">Recent achievements</h2>
            </div>
            <Link href="/progress" className="inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-primary">
              All <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
          {earnedBadges.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {earnedBadges.map((badge) => (
                <li key={badge.id} className="flex items-center gap-3 rounded-lg bg-accent/70 px-3 py-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Award size={15} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold">{badge.name}</span>
                    <span className="block truncate text-[10px] text-muted-foreground">{badge.description}</span>
                  </span>
                  <Check size={14} className="shrink-0 text-primary" aria-hidden="true" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed px-3 py-4 text-xs text-muted-foreground">
              <Sparkles size={16} className="mb-2 text-primary" aria-hidden="true" />
              Complete your first lesson to earn a milestone badge.
            </div>
          )}
        </article>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-xs text-muted-foreground">
        <span>Practice progress celebrates learning and consistency—not spiritual worth.</span>
        <Link href="/community" className="inline-flex min-h-10 items-center gap-1.5 font-semibold text-primary">
          Explore races <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
