import type { PracticeMode } from "@/lib/local-progress";

export type PendingPractice = {
  ownerUid: string;
  idempotencyKey: string;
  verseId: string;
  typedText: string;
  elapsedMs: number;
  startedAtMs: number;
  mode: PracticeMode;
  stageId?: string;
  recordedAt: string;
  status: "pending" | "blocked";
  errorMessage?: string;
};

const STORAGE_KEY = "scripttype.pending-practice.v1";
const MAX_PENDING_SESSIONS = 100;

function isPendingPractice(value: unknown): value is PendingPractice {
  if (!value || typeof value !== "object") return false;
  const pending = value as Partial<PendingPractice>;
  return (
    typeof pending.idempotencyKey === "string" &&
    typeof pending.ownerUid === "string" &&
    typeof pending.verseId === "string" &&
    typeof pending.typedText === "string" &&
    typeof pending.elapsedMs === "number" &&
    typeof pending.startedAtMs === "number" &&
    ["typing", "memory", "audio", "keyboard", "speed", "accuracy", "challenge"].includes(pending.mode ?? "") &&
    typeof pending.recordedAt === "string" &&
    ["pending", "blocked"].includes(pending.status ?? "")
  );
}

export function readPendingPractice(): PendingPractice[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    throw new Error(
      "A saved practice could not be read. Your pending practice data was kept; export or inspect browser storage before clearing it.",
    );
  }

  if (
    !Array.isArray(parsed) ||
    !parsed.every(isPendingPractice)
  ) {
    throw new Error(
      "Saved pending practice has an unsupported format. Your browser data was not changed.",
    );
  }
  return parsed;
}

function writePendingPractice(items: PendingPractice[]): void {
  if (typeof window === "undefined") {
    throw new Error("Offline practice can only be saved in a browser.");
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function queuePendingPractice(item: PendingPractice): void {
  const pending = readPendingPractice();
  if (pending.some((existing) => existing.idempotencyKey === item.idempotencyKey)) {
    return;
  }
  if (pending.length >= MAX_PENDING_SESSIONS) {
    throw new Error(
      "Your offline practice queue is full. Connect to the internet to sync saved sessions before starting another account lesson.",
    );
  }
  writePendingPractice([...pending, item]);
}

export function removePendingPractice(idempotencyKey: string): void {
  writePendingPractice(
    readPendingPractice().filter((item) => item.idempotencyKey !== idempotencyKey),
  );
}

export function blockPendingPractice(
  idempotencyKey: string,
  errorMessage: string,
): void {
  writePendingPractice(
    readPendingPractice().map((item) =>
      item.idempotencyKey === idempotencyKey
        ? { ...item, status: "blocked", errorMessage }
        : item,
    ),
  );
}
