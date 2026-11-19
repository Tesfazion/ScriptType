"use client";

import { Check, Download, ShieldCheck, Trash2, Volume2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/components/app-providers";
import { setLocalWeeklyGoal, readLocalProgress } from "@/lib/local-progress";
import { readRaceSettings, updateRaceSettings } from "@/lib/race-service";
import { saveAccountPreference, syncAccountPreferences } from "@/lib/account-preferences";

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
  const [raceAlias, setRaceAlias] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("scripttype.race.alias") ?? "";
  });
  const [globalRaceOptIn, setGlobalRaceOptIn] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("scripttype.race.global-opt-in") === "on";
  });
  const [raceSettingsSaving, setRaceSettingsSaving] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem("scripttype.sound-enabled") !== "off";
  });

  useEffect(() => {
    if (!user) return;
    let active = true;
    void syncAccountPreferences()
      .then(() => {
        if (!active) return;
        setGoal(readLocalProgress().weeklyGoal);
        setSoundEnabled(
          window.localStorage.getItem("scripttype.sound-enabled") !== "off",
        );
      })
      .catch((error: unknown) => {
        if (active) {
          setMessage(
            error instanceof Error
              ? `Account preferences could not be synced: ${error.message}`
              : "Account preferences could not be synced.",
          );
        }
      });
    void readRaceSettings()
      .then((settings) => {
        if (!active) return;
        setRaceAlias(settings.alias);
        setGlobalRaceOptIn(settings.globalOptIn);
      })
      .catch((error: unknown) => {
        if (active) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Race settings could not be loaded.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [user]);

  async function updateSound(enabled: boolean) {
    try {
      window.localStorage.setItem("scripttype.sound-enabled", enabled ? "on" : "off");
      setSoundEnabled(enabled);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "The sound preference could not be saved.",
      );
      return;
    }
    try {
      const synced = user
        ? await saveAccountPreference("soundEnabled", enabled)
        : "pending";
      setMessage(
        !user
          ? "Sound preference saved on this device."
          : synced === "synced"
            ? "Sound preference saved to your account."
            : synced === "conflict"
              ? "A newer sound preference from another device was kept."
              : "Sound preference saved locally and will sync when online.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Sound preference is saved locally, but account sync failed: ${error.message}`
          : "Sound preference is saved locally, but account sync failed.",
      );
    }
  }

  async function saveGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setLocalWeeklyGoal(goal);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "The weekly goal could not be saved.",
      );
      return;
    }
    try {
      const synced = user
        ? await saveAccountPreference("weeklyGoal", goal)
        : "pending";
      setMessage(
        !user
          ? "Weekly goal saved on this device."
          : synced === "synced"
            ? "Weekly goal saved to your account."
            : synced === "conflict"
              ? "A newer weekly goal from another device was kept."
              : "Weekly goal saved locally and will sync when online.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Weekly goal is saved locally, but account sync failed: ${error.message}`
          : "Weekly goal is saved locally, but account sync failed.",
      );
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
    setMessage("Local progress and reflections deleted.");
  }

  async function saveRaceAlias() {
    const cleanAlias =
      raceAlias.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24);
    if (cleanAlias.length < 3) {
      setMessage("Use at least 3 letters or numbers for your race alias.");
      return;
    }
    setRaceSettingsSaving(true);
    try {
      if (user) {
        await updateRaceSettings({
          alias: cleanAlias,
          globalOptIn: globalRaceOptIn,
        });
      }
      window.localStorage.setItem("scripttype.race.alias", cleanAlias);
      window.localStorage.setItem(
        "scripttype.race.global-opt-in",
        globalRaceOptIn ? "on" : "off",
      );
      setRaceAlias(cleanAlias);
      setMessage(
        user
          ? "Race settings saved to your account."
          : "Race settings saved on this device. Sign in to enter global races.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Race settings could not be saved.",
      );
    } finally {
      setRaceSettingsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[760px] float-in">
      <div className="mb-7">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Account & privacy</div>
        <h1 className="page-title mt-2">Make ScriptType yours.</h1>
      </div>

      <section className="surface-card p-card sm:p-7">
        <h2 className="text-sm font-semibold">Weekly practice goal</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Choose a rhythm that feels sustainable. This never measures spiritual worth.</p>
        <form onSubmit={saveGoal} className="mt-5">
          <label htmlFor="weekly-goal" className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
            Practice days per week
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input id="weekly-goal" type="range" min={1} max={14} value={goal} onChange={(event) => setGoal(Number(event.target.value))} className="h-2 flex-1 accent-primary focus-visible:ring-2 focus-visible:ring-ring" />
            <output className="grid size-12 place-items-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">{goal}</output>
          </div>
          <button type="submit" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground">
            <Check size={13} aria-hidden="true" /> Save goal
          </button>
        </form>
      </section>

      <section className="surface-card mt-5 p-card sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent text-primary">
              <Volume2 size={18} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-semibold">Premium sound feedback</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Play gentle sounds for key milestones, mission rewards, level-ups, and completed lessons.
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={soundEnabled}
            onClick={() => updateSound(!soundEnabled)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition ${soundEnabled ? "bg-primary" : "bg-muted"}`}
          >
            <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${soundEnabled ? "left-6" : "left-1"}`} />
            <span className="sr-only">{soundEnabled ? "Disable sound" : "Enable sound"}</span>
          </button>
        </div>
      </section>

      <section className="surface-card mt-5 p-card sm:p-7">
        <h2 className="text-sm font-semibold">Race identity</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Choose a privacy-safe alias for opt-in global and friend races. Never use your full name or email.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label htmlFor="race-alias" className="flex-1 min-w-48">
            <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
              Public race alias
            </span>
            <input
              id="race-alias"
              value={raceAlias}
              maxLength={24}
              onChange={(event) => setRaceAlias(event.target.value)}
              className="field-control mt-2 w-full px-3"
              placeholder="SwiftMaple"
            />
          </label>
        </div>
        <label className="mt-4 flex min-h-11 items-start gap-3 text-xs leading-5">
          <input
            type="checkbox"
            checked={globalRaceOptIn}
            onChange={(event) => setGlobalRaceOptIn(event.target.checked)}
            className="mt-1 size-4 accent-primary"
          />
          <span>
            <span className="block font-semibold">Show my alias on the global race leaderboard</span>
            <span className="mt-0.5 block text-muted-foreground">
              Off by default. Your account name and email are never shown.
            </span>
          </span>
        </label>
        <button
          type="button"
          onClick={saveRaceAlias}
          disabled={raceSettingsSaving}
          className="button-primary mt-4"
        >
          {raceSettingsSaving ? "Saving…" : "Save race settings"}
        </button>
      </section>

      <section className="surface-card mt-5 p-card sm:p-7">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent text-primary"><ShieldCheck size={18} aria-hidden="true" /></span>
          <div>
            <h2 className="text-sm font-semibold">Privacy choices</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Journals and private reflection stay local in this build. Firebase account data, groups, and analytics require separate consent/rights configuration before launch.
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

      <section className="surface-card mt-5 p-card sm:p-7">
        <h2 className="text-sm font-semibold">Account</h2>
        <p className="mt-1 text-xs text-muted-foreground">{user ? `Signed in as ${user.email ?? "your Firebase account"}` : "No account is connected."}</p>
      </section>

      {message && <p role="status" className="mt-5 text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
