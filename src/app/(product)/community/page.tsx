"use client";

import Link from "next/link";
import { CalendarDays, Crown, LockKeyhole, ShieldCheck, Trophy, UsersRound } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { getRaceLeaderboard, type RaceEntry } from "@/lib/race-service";
import { useAuth } from "@/components/app-providers";

export default function CommunityPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<RaceEntry[]>([]);
  const [scope, setScope] = useState<"global" | "group">("global");
  const [groupId, setGroupId] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.localStorage.getItem("scripttype.race.group-id") ?? "",
  );
  const [submittedGroupId, setSubmittedGroupId] = useState(groupId);
  const [loadedKey, setLoadedKey] = useState("");
  const [raceError, setRaceError] = useState("");
  const requestKey = `${user?.uid ?? "guest"}:${scope}:${submittedGroupId}`;
  const loading = loadedKey !== requestKey;

  useEffect(() => {
    let active = true;
    if (!user) {
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
  }, [user, scope, submittedGroupId, requestKey]);

  function saveGroupId(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanGroupId = groupId.trim();
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(cleanGroupId)) {
      setRaceError("Enter the group ID shared by an existing invited group.");
      return;
    }
    window.localStorage.setItem("scripttype.race.group-id", cleanGroupId);
    setGroupId(cleanGroupId);
    setSubmittedGroupId(cleanGroupId);
    setRaceError("");
    setScope("group");
  }
  return (
    <div className="mx-auto max-w-[980px] float-in">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Practice together</div>
          <h1 className="page-title mt-2">Race with intention.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Compare server-checked typing metrics with a private alias. Race timing is client-measured.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-[10px] text-muted-foreground">
          <LockKeyhole size={12} aria-hidden="true" /> Opt-in rankings
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="mission-glow relative overflow-hidden rounded-panel p-6 text-white shadow-panel sm:p-8">
          <div className="absolute -right-16 -top-20 size-64 rounded-full border border-white/10" />
          <div className="relative">
            <div className="eyebrow flex items-center gap-2 text-white/70">
              <Trophy size={13} aria-hidden="true" /> Daily typing race
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.05em]">A shared passage. Your best pace.</h2>
            <p className="mt-2 max-w-[480px] text-sm leading-6 text-white/60">
              Type the same daily passage as other learners. Your personal best and opt-in leaderboard results appear alongside your live pace.
            </p>
            <Link href="/practice?mode=race" className="button-mission mt-7">
              Start today&apos;s race
            </Link>
          </div>
        </section>

        <aside className="surface-card p-card sm:p-6">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <ShieldCheck size={15} className="text-growth" aria-hidden="true" /> Community guardrails
          </div>
          <ul className="mt-5 space-y-4 text-xs leading-5 text-muted-foreground">
            {[
              "Global rankings use an alias you explicitly opt into.",
              "Private groups require an invite.",
              "Individual progress visibility is explicit.",
              "Account names and email addresses stay private.",
            ].map((item) => (
              <li key={item} className="flex gap-2.5">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <section className="surface-card mt-5 p-5 sm:p-6" aria-labelledby="weekly-race">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow text-primary">Daily typing race</p>
            <h2 id="weekly-race" className="mt-1 text-lg font-semibold">Typing race leaderboard</h2>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-muted p-1" role="group" aria-label="Leaderboard scope">
            <button type="button" onClick={() => { setRaceError(""); setScope("global"); }} aria-pressed={scope === "global"} className={`min-h-9 rounded-full px-3 text-[10px] font-semibold ${scope === "global" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>Global</button>
            <button type="button" onClick={() => { setRaceError(""); setScope("group"); }} aria-pressed={scope === "group"} className={`min-h-9 rounded-full px-3 text-[10px] font-semibold ${scope === "group" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>Friend group</button>
          </div>
        </div>
        {scope === "group" && (
          <form onSubmit={saveGroupId} className="mt-4 flex flex-wrap items-end gap-3">
            <label htmlFor="race-group-id" className="min-w-52 flex-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Invited group ID</span>
              <input
                id="race-group-id"
                value={groupId}
                onChange={(event) => setGroupId(event.target.value)}
                maxLength={64}
                className="field-control mt-1 w-full px-3"
                placeholder="Paste an existing group ID"
              />
            </label>
            <button type="submit" className="button-secondary">Load group race</button>
          </form>
        )}
        {raceError && <p role="alert" className="mt-3 text-xs text-destructive">{raceError}</p>}
        <ol className="mt-5 grid gap-2 sm:grid-cols-3">
          {loading && <li className="col-span-full py-4 text-center text-xs text-muted-foreground">Loading verified results…</li>}
          {!loading && entries.length === 0 && (
            <li className="col-span-full rounded-lg border border-dashed px-4 py-5 text-center text-xs text-muted-foreground">
              {scope === "group"
                ? submittedGroupId
                  ? "No results yet, or you do not have access to this invited group."
                  : "Paste the ID of an existing invited group to view its results."
                : "No learners have opted into today’s global race yet."}
            </li>
          )}
          {!loading && entries.slice(0, 3).map((runner, index) => (
            <li key={`${runner.alias}-${index}`} className="flex items-center gap-3 rounded-card border p-4">
              <span className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold ${index === 0 ? "bg-primary text-primary-foreground" : index === 1 ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"}`}>{index + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{runner.alias}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{runner.accuracy}% accuracy</span>
              </span>
              <span className="text-sm font-semibold tabular-nums">{runner.wpm} WPM</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Race results use a server-managed daily passage and server-computed text metrics; elapsed time is client-measured. Friend groups are invite-only; group results are visible only to members.
        </p>
      </section>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
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
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-dashed p-4 text-xs leading-5 text-muted-foreground">
        <Crown size={15} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
        <p>
          This product preview is intentionally not open to unmoderated interaction. Production group features remain gated behind moderation, reporting, age/privacy, and account controls.
        </p>
      </div>

      <Link href="/sign-in" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-xs font-semibold hover:bg-muted">
        Sign in to prepare for groups
      </Link>
    </div>
  );
}
