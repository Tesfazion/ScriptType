import { httpsCallable } from "firebase/functions";
import {
  cloudFunctions,
  firebaseAuth,
  firebaseAppCheck,
  firebaseEmulatorsEnabled,
} from "@/lib/firebase";
import {
  recordLocalSession,
  type PracticeMode,
  type PracticeSession,
} from "@/lib/local-progress";
import {
  blockPendingPractice,
  queuePendingPractice,
  readPendingPractice,
  removePendingPractice,
  type PendingPractice,
} from "@/lib/practice-outbox";
import {
  calculateMemoryMetrics,
  calculateTypingMetrics,
  type TypingMetrics,
} from "../../shared/domain";
import { typingStages } from "../../shared/typing-curriculum";
import { getVerse } from "@/data/verses";

type CompletionResponse = {
  sessionId: string;
  xpEarned: number;
  activeStreak: number;
  metrics: TypingMetrics;
  memoryScore?: number;
};

export type PracticeCompletion = CompletionResponse & {
  syncStatus: "synced" | "pending";
};

export type PracticeSubmission = PracticeCompletion | PracticeSession;

function isCompletionResponse(value: unknown): value is CompletionResponse {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<CompletionResponse>;
  return (
    typeof result.sessionId === "string" &&
    typeof result.xpEarned === "number" &&
    typeof result.activeStreak === "number" &&
    typeof result.metrics === "object" &&
    result.metrics !== null &&
    typeof result.metrics.wpm === "number" &&
    typeof result.metrics.accuracy === "number"
  );
}

function getExpectedText(
  verseId: string,
  mode: PracticeMode,
  stageId?: string,
): string {
  if (mode === "keyboard") {
    const stage = typingStages.find((item) => item.id === stageId);
    if (!stage || stage.lesson.id !== verseId) {
      throw new Error("This keyboard lesson is unavailable. Choose a lesson from your learning path.");
    }
    return stage.lesson.text;
  }
  if (stageId) {
    throw new Error("A keyboard lesson stage cannot be used with this practice mode.");
  }
  const verse = getVerse(verseId);
  if (!verse) throw new Error("This practice passage is no longer available.");
  return verse.text;
}

function getFunctionsErrorCode(error: unknown): string {
  if (!error || typeof error !== "object" || !("code" in error)) return "";
  return typeof error.code === "string" ? error.code : "";
}

function isTemporaryNetworkError(error: unknown): boolean {
  return [
    "functions/unavailable",
    "functions/deadline-exceeded",
    "functions/network-request-failed",
  ].includes(getFunctionsErrorCode(error));
}

function createCompletePracticeCallable() {
  if (!cloudFunctions) {
    throw new Error("Practice sync is unavailable because Firebase Functions is not configured.");
  }
  return httpsCallable<
    Omit<PendingPractice, "ownerUid" | "recordedAt" | "status" | "errorMessage">,
    CompletionResponse
  >(cloudFunctions, "completePractice");
}

async function submitPendingPractice(
  pending: PendingPractice,
): Promise<CompletionResponse> {
  const completePractice = createCompletePracticeCallable();
  const { data } = await completePractice({
    idempotencyKey: pending.idempotencyKey,
    verseId: pending.verseId,
    typedText: pending.typedText,
    elapsedMs: pending.elapsedMs,
    startedAtMs: pending.startedAtMs,
    mode: pending.mode,
    ...(pending.stageId === undefined ? {} : { stageId: pending.stageId }),
  });
  if (!isCompletionResponse(data)) {
    throw new Error(
      "ScriptType could not verify this practice result. The saved session remains queued.",
    );
  }
  return data;
}

function getPendingCompletion(
  pending: PendingPractice,
): PracticeCompletion {
  const expectedText = getExpectedText(
    pending.verseId,
    pending.mode,
    pending.stageId,
  );
  const metrics = calculateTypingMetrics(
    expectedText,
    pending.typedText,
    pending.elapsedMs,
  );
  const memoryScore =
    pending.mode === "memory"
      ? calculateMemoryMetrics(expectedText, pending.typedText).score
      : undefined;

  return {
    sessionId: pending.idempotencyKey,
    xpEarned: 0,
    activeStreak: 0,
    metrics,
    ...(memoryScore === undefined ? {} : { memoryScore }),
    syncStatus: "pending",
  };
}

export async function submitPractice({
  verseId,
  typedText,
  elapsedMs,
  startedAtMs,
  mode,
  stageId,
}: {
  verseId: string;
  typedText: string;
  elapsedMs: number;
  startedAtMs: number;
  mode: PracticeMode;
  stageId?: string;
}): Promise<PracticeSubmission> {
  const expectedText = getExpectedText(verseId, mode, stageId);

  if (!firebaseAuth?.currentUser) {
    const metrics = calculateTypingMetrics(expectedText, typedText, elapsedMs);
    const memoryScore =
      mode === "memory"
        ? calculateMemoryMetrics(expectedText, typedText).score
        : undefined;
    return recordLocalSession({
      verseId,
      metrics,
      mode,
      ...(memoryScore === undefined ? {} : { memoryScore }),
      ...(stageId === undefined ? {} : { stageId }),
    });
  }

  const isOnline = typeof navigator === "undefined" || navigator.onLine;
  if (isOnline && !firebaseAppCheck && !firebaseEmulatorsEnabled) {
    throw new Error(
      "Your account requires Firebase App Check before practice can sync. The current lesson remains on screen.",
    );
  }
  if (isOnline && !cloudFunctions) {
    throw new Error(
      "Your account is signed in, but ScriptType practice services are unavailable. The current lesson remains on screen.",
    );
  }

  const pending: PendingPractice = {
    ownerUid: firebaseAuth.currentUser.uid,
    idempotencyKey: crypto.randomUUID(),
    verseId,
    typedText,
    elapsedMs,
    startedAtMs,
    mode,
    ...(stageId === undefined ? {} : { stageId }),
    recordedAt: new Date().toISOString(),
    status: "pending",
  };
  queuePendingPractice(pending);

  if (!isOnline) return getPendingCompletion(pending);

  try {
    const result = await submitPendingPractice(pending);
    removePendingPractice(pending.idempotencyKey);
    window.dispatchEvent(new Event("scripttype:progress-updated"));
    return { ...result, syncStatus: "synced" };
  } catch (error) {
    if (isTemporaryNetworkError(error) || !navigator.onLine) {
      return getPendingCompletion(pending);
    }
    throw error;
  }
}

export async function syncPendingPractice(): Promise<void> {
  if (!navigator.onLine || !firebaseAuth?.currentUser) return;
  if (!cloudFunctions) {
    throw new Error("Saved lessons are waiting, but the practice sync service is unavailable.");
  }
  if (!firebaseAppCheck && !firebaseEmulatorsEnabled) {
    throw new Error("Saved lessons are waiting for Firebase App Check configuration.");
  }

  const ownerUid = firebaseAuth.currentUser.uid;
  const ownerSessions = readPendingPractice().filter(
    (pending) => pending.ownerUid === ownerUid,
  );
  const pendingSessions = ownerSessions.filter((pending) => pending.status === "pending");
  for (const pending of pendingSessions) {
    try {
      await submitPendingPractice(pending);
      removePendingPractice(pending.idempotencyKey);
    } catch (error) {
      if (isTemporaryNetworkError(error) || !navigator.onLine) return;
      const message =
        error instanceof Error
          ? error.message
          : "The saved lesson could not be verified.";
      blockPendingPractice(pending.idempotencyKey, message);
      throw new Error(`One saved lesson needs attention: ${message}`);
    }
  }
  const blocked = ownerSessions.find((pending) => pending.status === "blocked");
  if (blocked) {
    throw new Error(
      `A saved lesson needs attention: ${blocked.errorMessage ?? "It could not be verified."}`,
    );
  }
  window.dispatchEvent(new Event("scripttype:progress-updated"));
}

export function getPendingPracticeCount(ownerUid?: string): number {
  const pending = readPendingPractice();
  return ownerUid
    ? pending.filter((session) => session.ownerUid === ownerUid).length
    : pending.length;
}

export function getPendingPracticeSessions(ownerUid: string): PracticeSession[] {
  return readPendingPractice()
    .filter((pending) => pending.ownerUid === ownerUid)
    .map((pending) => {
      const completion = getPendingCompletion(pending);
      return {
        ...completion.metrics,
        id: pending.idempotencyKey,
        verseId: pending.verseId,
        completedAt: pending.recordedAt,
        xpEarned: 0,
        activeStreak: 0,
        mode: pending.mode,
        ...(pending.stageId === undefined ? {} : { stageId: pending.stageId }),
        ...(completion.memoryScore === undefined
          ? {}
          : { memoryScore: completion.memoryScore }),
        syncStatus: pending.status,
      };
    });
}
