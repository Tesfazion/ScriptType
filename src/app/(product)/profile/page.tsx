"use client";

import Link from "next/link";
import { signOut, updateProfile as updateFirebaseProfile } from "firebase/auth";
import { ArrowRight, Flame, Gauge, Target, Trophy } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/app-providers";
import { useProgress } from "@/hooks/use-progress";
import { firebaseAuth } from "@/lib/firebase";
import { getTypingLevelProgress } from "../../../../shared/typing-progress";

export default function ProfilePage() {
  const { user } = useAuth();
  const { progress, loading, errorMessage } = useProgress();
  const [message, setMessage] = useState("");
  const level = getTypingLevelProgress(progress?.xp ?? 0);
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Guest learner";
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [savingName, setSavingName] = useState(false);

  async function handleSignOut() {
    if (!firebaseAuth) {
      setMessage("Sign-out is unavailable because Firebase is not configured.");
      return;
    }

    try {
      await signOut(firebaseAuth);
    } catch {
      setMessage("We couldn’t sign you out. Please try again.");
    }
  }

  async function handleSaveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!firebaseAuth?.currentUser || !user) {
      setMessage("Sign in to update your display name.");
      return;
    }
    const nextName = nameDraft.trim();
    if (nextName.length < 2) {
      setMessage("Display name must be at least 2 characters.");
      return;
    }
    setSavingName(true);
    setMessage("");
    try {
      await updateFirebaseProfile(firebaseAuth.currentUser, { displayName: nextName });
      setEditingName(false);
      setMessage("Display name updated.");
    } catch {
      setMessage("We couldn’t update your display name. Please try again.");
    } finally {
      setSavingName(false);
    }
  }

  const stats = [
    { label: "Typing pace", value: `${progress?.averageWpm ?? 0} WPM`, icon: Gauge },
    { label: "Accuracy", value: `${progress?.averageAccuracy ?? 0}%`, icon: Target },
    { label: "Daily streak", value: `${progress?.activeStreak ?? 0} days`, icon: Flame },
    { label: "Practice sessions", value: `${progress?.sessions.length ?? 0}`, icon: Trophy },
  ];

  return (
    <div className="mx-auto max-w-4xl float-in">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-primary">Your space</p>
          <h1 className="page-title mt-2">{displayName}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A snapshot of your typing practice and Scripture journeys.
          </p>
        </div>
        <Link href="/settings" className="button-secondary">
          Profile settings <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </header>

      {(errorMessage || message) && (
        <p role="alert" className="mb-5 rounded-control border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errorMessage || message}
        </p>
      )}

      <section className="surface-card overflow-hidden p-6 sm:p-8" aria-labelledby="profile-level">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
              {displayName.slice(0, 1).toLocaleUpperCase()}
            </span>
            <div>
              <p className="eyebrow">Current rank</p>
              <h2 id="profile-level" className="mt-1 text-2xl font-semibold tracking-tight">
                {level.rank}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Level {level.level}</p>
            </div>
          </div>
          <p className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
            {(progress?.xp ?? 0).toLocaleString()} XP
          </p>
        </div>
        <div
          className="mt-6 h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label="Progress to next level"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={level.progressPercent}
        >
          <div className="progress-fill h-full rounded-full bg-primary" style={{ width: `${level.progressPercent}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {`${level.xpNeeded - level.xpInLevel} XP to level ${level.level + 1}`}
        </p>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Practice statistics">
        {stats.map(({ label, value, icon: Icon }) => (
          <article key={label} className="surface-card p-5">
            <span className="grid size-10 place-items-center rounded-control bg-accent text-primary">
              <Icon size={18} aria-hidden="true" />
            </span>
            <p className="mt-4 text-xl font-semibold tabular-nums">{loading ? "—" : value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{label}</p>
          </article>
        ))}
      </section>

      <section className="surface-card mt-5 p-6 sm:p-7" aria-labelledby="recent-practice">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Keep your momentum</p>
            <h2 id="recent-practice" className="mt-1 text-lg font-semibold">Recent practice</h2>
          </div>
          <Link href="/progress" className="button-quiet min-h-10 px-2 text-xs">
            View progress <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        {progress?.sessions.length ? (
          <ul className="mt-4 divide-y">
            {progress.sessions.slice(0, 5).map((session) => (
              <li key={session.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span>
                  {session.mode === "keyboard" ? "Keyboard lesson" : session.mode === "memory" ? "Memory practice" : session.mode === "audio" ? "Audio practice" : "Scripture practice"}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {new Date(session.completedAt).toLocaleDateString()}
                  </span>
                </span>
                <span className="font-medium tabular-nums">{session.wpm} WPM · {session.accuracy}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-card bg-muted/60 p-5 text-sm text-muted-foreground">
            Finish your first lesson to start building your practice history.
            <Link href="/journeys" className="ml-1 font-semibold text-primary hover:underline">Choose a lesson</Link>
          </div>
        )}
      </section>

      <section className="surface-card mt-5 flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-semibold">{user ? "Signed-in account" : "Local device"}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {user?.email ?? (user ? "Progress syncs with your account." : "Progress is saved in this browser only.")}
          </p>
        </div>
        {user ? (
          <button type="button" onClick={handleSignOut} className="button-secondary">
            Sign out
          </button>
        ) : (
          <Link href="/sign-in" className="button-primary">Sign in to sync</Link>
        )}
      </section>

      {user && (
        <section className="surface-card mt-5 p-5" aria-labelledby="edit-display-name">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Profile</p>
              <h2 id="edit-display-name" className="mt-1 text-base font-semibold">Your display name</h2>
            </div>
            {editingName ? (
              <button type="button" className="button-quiet min-h-10 px-2 text-xs" onClick={() => setEditingName(false)}>
                Cancel
              </button>
            ) : (
              <button
                type="button"
                className="button-quiet min-h-10 px-2 text-xs"
                onClick={() => {
                  setNameDraft(user.displayName || user.email?.split("@")[0] || "Guest learner");
                  setEditingName(true);
                }}
              >
                Edit name
              </button>
            )}
          </div>
          {editingName ? (
            <form onSubmit={handleSaveName} className="mt-4 flex flex-wrap items-end gap-3">
              <label className="block text-xs font-semibold">
                Display name
                <input
                  value={nameDraft}
                  onChange={(event) => setNameDraft(event.target.value)}
                  minLength={2}
                  autoComplete="name"
                  className="field-control mt-2 w-full max-w-xs px-4 text-sm font-normal"
                />
              </label>
              <button type="submit" disabled={savingName} className="button-primary min-h-11 px-4 text-xs disabled:opacity-50">
                {savingName ? "Saving…" : "Save name"}
              </button>
            </form>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">{displayName}</p>
          )}
        </section>
      )}
    </div>
  );
}
