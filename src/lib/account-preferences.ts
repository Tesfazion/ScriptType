import { doc, runTransaction } from "firebase/firestore";
import { firebaseAuth, firestore } from "@/lib/firebase";
import { readLocalProgress, setLocalWeeklyGoal } from "@/lib/local-progress";
import { resolvePreference } from "../../shared/account-preferences";

type PreferenceField = "weeklyGoal" | "soundEnabled";

type PendingPreferences = {
  weeklyGoal?: number;
  weeklyGoalUpdatedAt?: string;
  soundEnabled?: boolean;
  soundEnabledUpdatedAt?: string;
};

const PENDING_STORAGE_PREFIX = "scripttype.pending-preferences.v1";

function getPendingStorageKey(uid: string): string {
  return `${PENDING_STORAGE_PREFIX}.${uid}`;
}

function isPendingPreferences(value: unknown): value is PendingPreferences {
  if (!value || typeof value !== "object") return false;
  const pending = value as PendingPreferences;
  return (
    (pending.weeklyGoal === undefined ||
      (Number.isInteger(pending.weeklyGoal) &&
        pending.weeklyGoal >= 1 &&
        pending.weeklyGoal <= 14 &&
        typeof pending.weeklyGoalUpdatedAt === "string" &&
        Number.isFinite(timestampValue(pending.weeklyGoalUpdatedAt)))) &&
    (pending.weeklyGoalUpdatedAt === undefined ||
      typeof pending.weeklyGoalUpdatedAt === "string") &&
    (pending.soundEnabled === undefined ||
      (typeof pending.soundEnabled === "boolean" &&
        typeof pending.soundEnabledUpdatedAt === "string" &&
        Number.isFinite(timestampValue(pending.soundEnabledUpdatedAt)))) &&
    (pending.soundEnabledUpdatedAt === undefined ||
      typeof pending.soundEnabledUpdatedAt === "string")
  );
}

function readPendingPreferences(uid: string): PendingPreferences {
  const stored = window.localStorage.getItem(getPendingStorageKey(uid));
  if (!stored) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    throw new Error("Saved account settings could not be read; they were not changed.");
  }
  if (!isPendingPreferences(parsed)) {
    throw new Error("Saved account settings have an unsupported format.");
  }
  return parsed;
}

function queuePreference(
  uid: string,
  field: PreferenceField,
  value: number | boolean,
): void {
  const pending = readPendingPreferences(uid);
  const updatedAt = new Date().toISOString();
  let next: PendingPreferences;
  if (field === "weeklyGoal") {
    if (typeof value !== "number") throw new Error("The weekly goal is invalid.");
    next = { ...pending, weeklyGoal: value, weeklyGoalUpdatedAt: updatedAt };
  } else {
    if (typeof value !== "boolean") throw new Error("The sound setting is invalid.");
    next = { ...pending, soundEnabled: value, soundEnabledUpdatedAt: updatedAt };
  }
  window.localStorage.setItem(getPendingStorageKey(uid), JSON.stringify(next));
}

function timestampValue(value: unknown): number {
  return typeof value === "string" ? Date.parse(value) : Number.NaN;
}

export async function saveAccountPreference(
  field: PreferenceField,
  value: number | boolean,
): Promise<"synced" | "pending" | "conflict"> {
  const user = firebaseAuth?.currentUser;
  if (!user || !firestore) return "pending";
  if (
    (field === "weeklyGoal" &&
      (typeof value !== "number" ||
        !Number.isInteger(value) ||
        value < 1 ||
        value > 14)) ||
    (field === "soundEnabled" && typeof value !== "boolean")
  ) {
    throw new Error("The account setting is invalid.");
  }
  queuePreference(user.uid, field, value);
  await syncAccountPreferences();
  if (window.localStorage.getItem(getPendingStorageKey(user.uid)) !== null) {
    return "pending";
  }
  const resolvedValue =
    field === "weeklyGoal"
      ? readLocalProgress().weeklyGoal
      : window.localStorage.getItem("scripttype.sound-enabled") === "on";
  return resolvedValue === value ? "synced" : "conflict";
}

export async function syncAccountPreferences(): Promise<void> {
  const user = firebaseAuth?.currentUser;
  if (!user || !firestore || (typeof navigator !== "undefined" && !navigator.onLine)) return;

  const uid = user.uid;
  const pending = readPendingPreferences(uid);
  const userRef = doc(firestore, "users", uid);
  const resolved = await runTransaction(firestore, async (transaction) => {
    const snapshot = await transaction.get(userRef);
    const remote = snapshot.data()?.preferences;
    const remotePreferences =
      remote && typeof remote === "object"
        ? (remote as Record<string, unknown>)
        : {};
    const pendingWeeklyGoal =
      typeof pending.weeklyGoal === "number" &&
      typeof pending.weeklyGoalUpdatedAt === "string"
        ? { value: pending.weeklyGoal, updatedAt: pending.weeklyGoalUpdatedAt }
        : undefined;
    const remoteWeeklyGoal =
      typeof remotePreferences.weeklyGoal === "number" &&
      Number.isInteger(remotePreferences.weeklyGoal) &&
      remotePreferences.weeklyGoal >= 1 &&
      remotePreferences.weeklyGoal <= 14
        ? {
            value: remotePreferences.weeklyGoal,
            updatedAt:
              typeof remotePreferences.weeklyGoalUpdatedAt === "string"
                ? remotePreferences.weeklyGoalUpdatedAt
                : undefined,
          }
        : undefined;
    const pendingSound =
      typeof pending.soundEnabled === "boolean" &&
      typeof pending.soundEnabledUpdatedAt === "string"
        ? { value: pending.soundEnabled, updatedAt: pending.soundEnabledUpdatedAt }
        : undefined;
    const remoteSound =
      typeof remotePreferences.soundEnabled === "boolean"
        ? {
            value: remotePreferences.soundEnabled,
            updatedAt:
              typeof remotePreferences.soundEnabledUpdatedAt === "string"
                ? remotePreferences.soundEnabledUpdatedAt
                : undefined,
          }
        : undefined;
    const weeklyGoal = resolvePreference(pendingWeeklyGoal, remoteWeeklyGoal);
    const soundEnabled = resolvePreference(pendingSound, remoteSound);
    const updates: Record<string, number | boolean | string> = {};

    if (weeklyGoal) {
      updates.weeklyGoal = weeklyGoal.value;
      if (weeklyGoal.updatedAt) {
        updates.weeklyGoalUpdatedAt = weeklyGoal.updatedAt;
      }
    }
    if (soundEnabled) {
      updates.soundEnabled = soundEnabled.value;
      if (soundEnabled.updatedAt) {
        updates.soundEnabledUpdatedAt = soundEnabled.updatedAt;
      }
    }

    if (Object.keys(updates).length > 0) {
      transaction.set(userRef, { preferences: updates }, { merge: true });
    }
    return {
      weeklyGoal: typeof weeklyGoal?.value === "number" ? weeklyGoal.value : undefined,
      soundEnabled:
        typeof soundEnabled?.value === "boolean" ? soundEnabled.value : undefined,
    };
  });

  window.localStorage.removeItem(getPendingStorageKey(uid));
  if (resolved.weeklyGoal !== undefined) {
    setLocalWeeklyGoal(resolved.weeklyGoal);
  }
  if (resolved.soundEnabled !== undefined) {
    window.localStorage.setItem(
      "scripttype.sound-enabled",
      resolved.soundEnabled ? "on" : "off",
    );
  }
  window.dispatchEvent(new Event("scripttype:progress-updated"));
}
