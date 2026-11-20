"use client";

import Link from "next/link";
import { CalendarDays, Crown, LockKeyhole, ShieldCheck, Trophy, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { getRaceLeaderboard, type RaceEntry } from "@/lib/race-service";
import { useAuth } from "@/components/app-providers";

export default function CommunityPage() {
  const { user, firebaseConfigured } = useAuth();
  const [entries, setEntries] = useState<RaceEntry[]>([]);
  const [scope, setScope] = useState<"global" | "group">("global");
  const [groupId] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.localStorage.getItem("scripttype.race.group-id") ?? "",
  );
  const submittedGroupId = groupId;
  const [loadedKey, setLoadedKey] = useState("");
  const [raceError, setRaceError] = useState("");
  const requestKey = `${user?.uid ?? "guest"}:${scope}:${submittedGroupId}`;
  const loading = loadedKey !== requestKey;
  const isDemoMode = !user && !firebaseConfigured;

  useEffect(() => {
    let active = true;
    if (isDemoMode) {
      queueMicrotask(() => {
        if (active) {
          setEntries([]);
          setRaceError("");
          setLoadedKey(requestKey);
        }
      });
      return () => {
        active = false;
      };
    }
    if (scope === "group" && !submittedGroupId) {
      queueMicrotask(() => {
        if (active) {
          setEntries([]);
          setRaceError("");
          setLoadedKey(requestKey);
        }
      });
      return () => {
        active = false;
      };
    }
    const raceId = scope === "group" && submittedGroupId
      ? `group-${submittedGroupId}-${new Date().toISOString().slice(0, 10)}`
      : undefined;
    void getRaceLeaderboard(raceId)
      .then((result) => {
        if (active) {
          setEntries(result);
          setRaceError("");
          setLoadedKey(requestKey);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setRaceError(
            error instanceof Error ? error.message : "Race records could not be loaded.",
          );
          setEntries([]);
          setLoadedKey(requestKey);
        }
      });
    return () => {
      active = false;
    };
  }, [user, scope, submittedGroupId, requestKey, isDemoMode]);


  return (
    <div className="mx-auto max-w-[980px] float-in bg-background">
      {/* ========================================
       HERO — with demo mode banner if needed
       ======================================== */}
      <section className="mb-7">
        <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Practice together</div>
            <h1 className="page-title mt-2">Race with intention.</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Compare server-checked typing metrics with a private alias. Race timing is client-measured.
            </p>
          </div>
          {!isDemoMode && (
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-[10px] text-muted-foreground">
              <LockKeyhole size={12} aria-hidden="true" /> Opt-in rankings
            </span>
          )}
          {isDemoMode && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-primary/10 px-2 py-1">Demo mode</span>
              <span>Leaderboard and groups limited; sign in for full access.</span>
            </div>
          )}
        </div>
      </section>

      {/* ========================================
       MAIN CONTENT — card-based layout
       ======================================== */}
      <section className="space-y-6">
        {/* ========================================
         RACE LEADERBOARD — card-style, demo-limited
         ======================================== */}
        <section className="surface-card p-5 sm:p-6 rounded-panel">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Daily typing race</p>
              <h2 className="mt-1 text-lg font-semibold">Typing race leaderboard</h2>
            </div>
            {!isDemoMode && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <button type="button" onClick={() => { setRaceError(""); setScope("global"); }} aria-pressed={scope === "global"} className={`min-h-9 rounded-full px-3 ${scope === "global" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>Global</button>
                <button type="button" onClick={() => { setRaceError(""); setScope("group"); }} aria-pressed={scope === "group"} className={`min-h-9 rounded-full px-3 ${scope === "group" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>Friend group</button>
              </div>
            )}
            {isDemoMode && (
              <p className="mt-2 text-xs text-muted-foreground">Enable rankings after sign-in.</p>
            )}
          </div>

          {loading && (
            <p className="mt-3 text-center text-xs text-muted-foreground">Loading verified results…</p>
          )}

          {!loading && entries.length === 0 && (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              {scope === "group"
                ? submittedGroupId
                  ? "No results yet, or you do not have access to this invited group."
                  : "Paste the ID of an existing invited group to view its results."
                : "No learners have opted into today's global race yet."}
            </p>
          )}

          {!loading && entries.length > 0 && (
            <ol className="mt-4 grid gap-2 sm:grid-cols-3">
              {entries.slice(0, 10).map((runner, index) => (
                <li key={`${runner.alias}-${index}`} className="flex items-center gap-3 rounded-card border p-3">
                  <span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${index === 0 ? "bg-primary text-primary-foreground" : index === 1 ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"}`}>{index + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{runner.alias}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{runner.accuracy}% accuracy</span>
                  </span>
                  <span className="text-sm font-semibold tabular-nums">{runner.wpm} WPM</span>
                </li>
              ))}
            </ol>
          )}

          {raceError && <p role="alert" className="mt-3 text-xs text-destructive">{raceError}</p>}
        </section>

        {/* ========================================
         GUARDRAILS / PRIVACY CARD
         ======================================== */}
        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck size={15} className="text-growth" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold">Community guardrails</p>
              <ul className="mt-2 space-y-3 text-xs leading-5 text-muted-foreground">
                <li>Global rankings use an alias you explicitly opt into.</li>
                <li>Private groups require an invite.</li>
                <li>Individual progress visibility is explicit.</li>
                <li>Account names and email addresses stay private.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========================================
         FEATURED COMMUNITY ASPECTS — card grid
         ======================================== */}
        <section className="mt-5 grid gap-5 md:grid-cols-3">
          {[
            { icon: UsersRound, title: "Bible study groups", text: "A private place for a church or study circle.", color: "text-primary bg-primary/10" },
            { icon: Trophy, title: "Positive challenges", text: "Shared goals measured with encouragement.", color: "text-primary bg-accent" },
            { icon: CalendarDays, title: "Monthly rhythm", text: "Seasonal journeys and time-bounded practice.", color: "text-primary bg-accent" },
          ].map(({ icon: Icon, title, text, color }) => (
            <article key={title} className="surface-card p-5">
              <span className={`grid size-10 place-items-center rounded-xl ${color}`}><Icon size={17} aria-hidden="true" /></span>
              <h2 className="mt-5 text-sm font-semibold">{title}</h2>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
            </article>
          ))}
        </section>

        {/* ========================================
         STATUS / LIMITATION CARD
         ======================================== */}
        {!user && !firebaseConfigured && (
          <section className="mt-5 rounded-2xl border border-dashed p-4 text-xs leading-5 text-muted-foreground">
            <Crown size={15} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            <p>
              Community groups and full leaderboard features are not yet open in this build. Production group features remain gated behind moderation, reporting, age/privacy, and account controls. Sign in to prepare for groups.
            </p>
          </section>
        )}

        <Link href="/sign-in" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-xs font-semibold hover:bg-muted">
          Sign in to prepare for groups
        </Link>
      </section>
    </div>
  );
}