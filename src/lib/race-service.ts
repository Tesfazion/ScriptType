import { httpsCallable } from "firebase/functions";
import {
  cloudFunctions,
  firebaseAppCheck,
  firebaseAuth,
  firebaseEmulatorsEnabled,
  firestore,
} from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const RACE_TEXTS = [
  "Build a steady rhythm, keep your hands relaxed, and let every accurate word move you forward.",
  "Small, focused practice builds confidence. Stay comfortable and choose accuracy before speed.",
  "Clear thoughts deserve clear words. Keep your eyes ahead and your fingers light on every key.",
];

export function getDailyRaceText(date = new Date()): string {
  return RACE_TEXTS[date.getUTCDate() % RACE_TEXTS.length];
}

export type RaceEntry = {
  alias: string;
  wpm: number;
  accuracy: number;
};

function validateResponse(value: unknown): { entries: RaceEntry[] } {
  if (!value || typeof value !== "object") return { entries: [] };
  const entries = (value as { entries?: unknown }).entries;
  if (!Array.isArray(entries)) return { entries: [] };
  return {
    entries: entries
      .filter((entry): entry is Record<string, unknown> =>
        Boolean(entry) && typeof entry === "object",
      )
      .map((entry) => ({
        alias:
          typeof entry.alias === "string" ? entry.alias : "ScriptType Learner",
        wpm: typeof entry.wpm === "number" ? entry.wpm : 0,
        accuracy: typeof entry.accuracy === "number" ? entry.accuracy : 0,
      })),
  };
}

export async function getRaceLeaderboard(
  raceId?: string,
): Promise<RaceEntry[]> {
  if (!firebaseAuth?.currentUser) {
    throw new Error("Sign in to view typing race results.");
  }
  if (!cloudFunctions) {
    throw new Error("Race services are unavailable.");
  }
  if (!firebaseAppCheck && !firebaseEmulatorsEnabled) {
    throw new Error("Race results require Firebase App Check.");
  }
  const callable = httpsCallable<
    { raceId?: string },
    unknown
  >(cloudFunctions, "getRaceLeaderboard");
  const { data } = await callable(raceId ? { raceId } : {});
  return validateResponse(data).entries;
}

export async function submitRaceResult({
  raceId,
  typedText,
  elapsedMs,
  alias,
}: {
  raceId: string;
  typedText: string;
  elapsedMs: number;
  alias: string;
}): Promise<{ wpm: number; accuracy: number; elapsedSeconds: number }> {
  if (!cloudFunctions) {
    throw new Error("Race services are unavailable.");
  }
  if (!firebaseAppCheck && !firebaseEmulatorsEnabled) {
    throw new Error("Race results require Firebase App Check.");
  }
  const callable = httpsCallable<
    {
      raceId: string;
      typedText: string;
      elapsedMs: number;
      alias: string;
    },
    { wpm: number; accuracy: number; elapsedSeconds: number }
  >(cloudFunctions, "submitRaceResult");
  const { data } = await callable({
    raceId,
    typedText,
    elapsedMs,
    alias,
  });
  return data;
}

export async function updateRaceSettings({
  alias,
  globalOptIn,
}: {
  alias: string;
  globalOptIn: boolean;
}): Promise<void> {
  if (!firebaseAuth?.currentUser || !cloudFunctions) {
    throw new Error("Sign in to save opt-in race settings.");
  }
  if (!firebaseAppCheck && !firebaseEmulatorsEnabled) {
    throw new Error("Race settings require Firebase App Check.");
  }
  const callable = httpsCallable<
    { alias: string; globalOptIn: boolean },
    { alias: string; globalOptIn: boolean }
  >(cloudFunctions, "updateRaceSettings");
  await callable({ alias, globalOptIn });
}

export async function readRaceSettings(): Promise<{
  alias: string;
  globalOptIn: boolean;
}> {
  const user = firebaseAuth?.currentUser;
  if (!user || !firestore) {
    return {
      alias:
        typeof window === "undefined"
          ? ""
          : window.localStorage.getItem("scripttype.race.alias") ?? "",
      globalOptIn:
        typeof window !== "undefined" &&
        window.localStorage.getItem("scripttype.race.global-opt-in") === "on",
    };
  }
  const snapshot = await getDoc(doc(firestore, "users", user.uid));
  const settings = snapshot.data()?.raceSettings;
  if (!settings || typeof settings !== "object") {
    // Fall back to localStorage if Firestore has no saved settings
    return {
      alias:
        typeof window !== "undefined"
          ? (window.localStorage.getItem("scripttype.race.alias") ?? "") : "",
      globalOptIn:
        typeof window !== "undefined"
          ? window.localStorage.getItem("scripttype.race.global-opt-in") === "on"
          : false,
    };
  }
  const value = settings as Record<string, unknown>;
  return {
    alias: typeof value.alias === "string" ? value.alias : "",
    globalOptIn: value.globalOptIn === true,
  };
}
