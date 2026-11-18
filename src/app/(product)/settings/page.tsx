"use client";

import { Check, Download, ShieldCheck, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/app-providers";
import { setLocalWeeklyGoal, readLocalProgress } from "@/lib/local-progress";

export default function SettingsPage() {
  const { user } = useAuth();
  const [goal, setGoal] = useState(() => {
    if (typeof window === "undefined") return 5;
    try {
      return readLocalProgress().weeklyGoal;
    } catch {
      return 5;
    }
  });
  const [message, setMessage] = useState("");

  function saveGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setLocalWeeklyGoal(goal);
      setMessage("Weekly goal updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The weekly goal could not be saved.");
    }
  }

  function exportData() {
    try {
      const progress = readLocalProgress();
      const blob = new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "scripttype-progress.json";
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage("Device progress export started.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Progress could not be exported.");
    }
  }

  function deleteDeviceData() {
    if (!window.confirm("Delete local ScriptType progress and reflections? This cannot be undone.")) return;
    window.localStorage.removeItem("scripttype.device-progress.v1");
    window.localStorage.removeItem("scripttype.private-reflections.v1");
    setGoal(5);
    setMessage("Local demo progress and reflections deleted.");
  }

  return (
    <div className="mx-auto max-w-[760px] float-in">
      <div className="mb-7">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Account & privacy</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em]">Make ScriptType yours.</h1>
      </div>

      <section className="rounded-[1.7rem] border bg-card p-5 sm:p-7">
        <h2 className="text-sm font-semibold">Weekly practice goal</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Choose a rhythm that feels sustainable. This never measures spiritual worth.</p>
        <form onSubmit={saveGoal} className="mt-5">
          <label htmlFor="weekly-goal" className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
            Practice days per week
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input id="weekly-goal" type="range" min={1} max={14} value={goal} onChange={(event) => setGoal(Number(event.target.value))} className="h-2 flex-1 accent-[#6041b8]" />
            <output className="grid size-12 place-items-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">{goal}</output>
          </div>
          <button type="submit" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground">
            <Check size={13} aria-hidden="true" /> Save goal
          </button>
        </form>
      </section>

      <section className="mt-5 rounded-[1.7rem] border bg-card p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e6f3ed] text-[#207256] dark:bg-[#1d382f] dark:text-[#7bdab8]"><ShieldCheck size={18} aria-hidden="true" /></span>
          <div>
            <h2 className="text-sm font-semibold">Privacy choices</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Journals and private reflection stay local in the demo. Firebase account data, groups, and analytics require separate consent/rights configuration before production.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={exportData} className="inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-xs font-semibold hover:bg-muted">
            <Download size={14} aria-hidden="true" /> Export device data
          </button>
          <button type="button" onClick={deleteDeviceData} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-destructive/20 px-4 text-xs font-semibold text-destructive hover:bg-destructive/5">
            <Trash2 size={14} aria-hidden="true" /> Delete device data
          </button>
        </div>
      </section>

      <section className="mt-5 rounded-[1.7rem] border bg-card p-5 sm:p-7">
        <h2 className="text-sm font-semibold">Account</h2>
        <p className="mt-1 text-xs text-muted-foreground">{user ? `Signed in as ${user.email ?? "your Firebase account"}` : "Device-only preview. No account is connected."}</p>
      </section>

      {message && <p role="status" className="mt-5 text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
