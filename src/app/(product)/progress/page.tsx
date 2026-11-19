"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  BookOpenText,
  Check,
  Flame,
  Gauge,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "@/components/app-providers";
import { AchievementShare } from "@/components/achievement-share";
import { useProgress } from "@/hooks/use-progress";
import { getTypingBadgeIds, getTypingLevelProgress, typingBadges } from "../../../../shared/typing-progress";

function getLocalDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getWeekStart(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date;
}

function TrendChart({ values }: { values: number[] }) {
  if (values.length < 2) {
    return (
      <div className="grid h-[170px] place-items-center rounded-2xl bg-muted/60 px-6 text-center">
        <div>
          <TrendingUp size={20} className="mx-auto text-muted-foreground/60" aria-hidden="true" />
          <p className="mt-2 text-xs font-medium text-muted-foreground">Your trend starts with your next session.</p>
        </div>
      </div>
    );
  }

  const width = 560;
  const height = 170;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);
  const points = values
    .map((value, index) => {
      const x = 16 + (index / (values.length - 1)) * (width - 32);
      const y = height - 20 - ((value - min) / range) * (height - 45);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <figure>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Typing speed across ${values.length} recent practices: ${values.join(", ")} words per minute`}
        className="h-[170px] w-full overflow-visible"
      >
        {[35, 75, 115, 150].map((y) => (
          <line key={y} x1="0" x2={width} y1={y} y2={y} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 7" />
        ))}
        <polyline
          points={points}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {values.map((value, index) => {
          const x = 16 + (index / (values.length - 1)) * (width - 32);
          const y = height - 20 - ((value - min) / range) * (height - 45);
          return <circle key={`${value}-${index}`} cx={x} cy={y} r="4.5" fill="var(--primary)" stroke="var(--card)" strokeWidth="3" />;
        })}
      </svg>
      <figcaption className="sr-only">
        Recent words per minute: {values.join(", ")}.
      </figcaption>
    </figure>
  );
}

export default function ProgressPage() {
  const { user } = useAuth();
  const { progress, loading, errorMessage } = useProgress();
  const level = getTypingLevelProgress(progress?.xp ?? 0);
  const speedValues = useMemo(
    () => (progress ? [...progress.sessions].reverse().map((session) => session.wpm) : []),
    [progress],
  );
  const typingBadgeIds = getTypingBadgeIds({
    completedLessons: progress?.sessions.filter((session) => session.mode === "keyboard").length ?? 0,
    completedStageIds: progress?.completedKeyboardStageIds ?? [],
    streak: progress?.activeStreak ?? 0,
    bestWpm: progress?.bestWpm ?? progress?.averageWpm ?? 0,
    perfectLessons: progress?.perfectLessons ?? 0,
    wordsTyped: progress?.wordsTyped ?? 0,
  });
  const qualifiedDates = new Set(progress?.qualifiedDates ?? []);

  return (
    <div className="float-in">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Your story in progress</div>
          <h1 className="page-title mt-2">Look how far you&apos;ve come.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Every practice is a beginning worth counting.</p>
        </div>
        <span className="rounded-full border bg-card px-3 py-1.5 text-[10px] text-muted-foreground">
          {user ? "Account progress" : "Device progress"}
        </span>
      </div>

      {errorMessage && <p role="alert" className="mb-5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs text-destructive">{errorMessage}</p>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Verses practiced", value: loading ? "—" : (progress?.versesCompleted ?? 0).toLocaleString(), detail: "unique passages", icon: BookOpenText, color: "text-primary bg-accent" },
          { label: "Typing pace", value: loading ? "—" : `${progress?.averageWpm ?? 0}`, detail: "average WPM", icon: Gauge, color: "text-primary bg-accent" },
          { label: "Accuracy", value: loading ? "—" : `${progress?.averageAccuracy ?? 0}%`, detail: "across practices", icon: Target, color: "text-primary bg-accent" },
          { label: "Active rhythm", value: loading ? "—" : `${progress?.activeStreak ?? 0}`, detail: "consecutive days", icon: Flame, color: "text-primary bg-accent" },
        ].map(({ label, value, detail, icon: Icon, color }) => (
          <article key={label} className="surface-card p-card">
            <div className={`grid size-9 place-items-center rounded-xl ${color}`}><Icon size={16} aria-hidden="true" /></div>
            <div className="mt-5 text-2xl font-semibold tracking-[-0.045em] tabular-nums">{value}</div>
            <div className="mt-1 text-xs font-semibold">{label}</div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">{detail}</div>
          </article>
        ))}
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.75fr]">
        <section className="surface-card p-card sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.17em] text-muted-foreground">Skill, over time</div>
              <h2 className="mt-1 text-lg font-semibold tracking-[-0.04em]">Typing pace</h2>
            </div>
            <span className="rounded-full bg-muted px-3 py-1.5 text-[10px] font-medium text-muted-foreground">
              {speedValues.length} recent sessions
            </span>
          </div>
          <div className="mt-5 text-primary">
            <TrendChart values={speedValues} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[9px] text-muted-foreground">
            <span>Earlier practice</span><span>Latest practice</span>
          </div>
        </section>

        <section className="surface-card p-card sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.17em] text-muted-foreground">Your next milestone</div>
              <h2 className="mt-1 text-lg font-semibold tracking-[-0.04em]">{level.rank}</h2>
            </div>
            <div className="grid size-10 place-items-center rounded-control bg-accent text-primary">
              <Award size={18} aria-hidden="true" />
            </div>
          </div>
          <div className="mt-8 flex items-end justify-between">
            <span className="text-4xl font-semibold tracking-[-0.06em]">Level {level.level}</span>
            <span className="text-xs text-muted-foreground">{progress?.xp ?? 0} XP</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div className="progress-fill h-full rounded-full bg-primary" style={{ width: `${level.progressPercent}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-[9px] text-muted-foreground">
            <span>{level.xpInLevel} XP in level</span>
            <span>{level.xpNeeded - level.xpInLevel} XP to level {level.level + 1}</span>
          </div>
          <div className="mt-6 flex items-start gap-2 rounded-xl bg-muted/60 p-3 text-[10px] leading-5 text-muted-foreground">
            <Sparkles size={13} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            Levels celebrate practice and consistency—they are not a measure of spiritual growth.
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="surface-card p-card sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.17em] text-muted-foreground">This week</div>
              <h2 className="mt-1 text-lg font-semibold tracking-[-0.04em]">Your own rhythm</h2>
            </div>
            <span className="text-xs font-semibold text-primary">{progress?.weeklySessions ?? 0}/{progress?.weeklyGoal ?? 5}</span>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-2">
            {(() => {
              const weekStart = getWeekStart();
              const weekDays = Array.from({ length: 7 }, (_, index) => {
                const date = new Date(weekStart);
                date.setDate(weekStart.getDate() + index);
                return date;
              });
              return weekDays.map((date) => {
                const dateKey = getLocalDateKey(date);
                const isComplete = qualifiedDates.has(dateKey);
                return (
                  <div key={dateKey} className="text-center">
                    <span className={`mx-auto grid aspect-square max-w-10 place-items-center rounded-xl text-[10px] ${
                      isComplete ? "bg-growth text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      {isComplete ? <Check size={13} aria-label="Practice completed" /> : date.getDate()}
                    </span>
                    <span className="mt-2 block text-[9px] text-muted-foreground">{date.toLocaleDateString(undefined, { weekday: "narrow" })}</span>
                  </div>
                );
              });
            })()}
          </div>
          <p className="mt-5 text-[10px] leading-5 text-muted-foreground">
            Your weekly goal is {progress?.weeklyGoal ?? 5} practice days. Progress is personal—there&apos;s no penalty for taking a day off.
          </p>
        </section>

        <section className="surface-card p-card sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.17em] text-muted-foreground">Small wins, remembered</div>
              <h2 className="mt-1 text-lg font-semibold tracking-[-0.04em]">Achievements</h2>
            </div>
            <Link href="/today" className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">Keep going <ArrowUpRight size={12} aria-hidden="true" /></Link>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {typingBadges.map((achievement) => {
              const unlocked = typingBadgeIds.includes(achievement.id);
              return (
                <div key={achievement.id} className={`flex items-center gap-3 rounded-card border p-3 ${unlocked ? "border-primary/20 bg-accent" : "bg-muted/40 opacity-65"}`}>
                  <span className={`relative grid size-12 shrink-0 place-items-center rounded-full border-4 ${unlocked ? "border-primary/30 bg-primary text-primary-foreground shadow-card" : "border-border bg-muted text-muted-foreground"}`}>
                    <Sparkles size={17} aria-hidden="true" />
                    {unlocked && <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full border-2 border-card bg-primary text-primary-foreground"><Check size={8} aria-hidden="true" /></span>}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-semibold">{achievement.name}</span>
                    <span className="mt-0.5 block text-[9px] text-muted-foreground">{unlocked ? "Earned through practice" : achievement.description}</span>
                  </span>
                  {unlocked && (
                    <AchievementShare name={achievement.name} description={achievement.description} />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {progress?.sessions.length === 0 && (
        <div className="mt-5 rounded-card border border-dashed bg-card p-6 text-center">
          <p className="text-sm font-semibold">Your story starts with one verse.</p>
          <p className="mt-1 text-xs text-muted-foreground">Finish a practice and this space will begin to reflect your growth.</p>
          <Link href="/practice" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground">
            Start a practice <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
