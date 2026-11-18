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
  calculateMemoryMetrics,
  calculateTypingMetrics,
  type TypingMetrics,
} from "../../shared/domain";
import { getVerse } from "@/data/verses";

type CompletionResponse = {
  sessionId: string;
  xpEarned: number;
  activeStreak: number;
  metrics: TypingMetrics;
  memoryScore?: number;
};

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

export async function submitPractice({
  verseId,
  typedText,
  elapsedMs,
  startedAtMs,
  mode,
}: {
  verseId: string;
  typedText: string;
  elapsedMs: number;
  startedAtMs: number;
  mode: PracticeMode;
}): Promise<CompletionResponse | PracticeSession> {
  if (firebaseAuth?.currentUser) {
    if (!cloudFunctions) {
      throw new Error(
        "Your account is signed in, but ScriptType practice services are unavailable. Try again in a moment.",
      );
    }
    if (!firebaseAppCheck && !firebaseEmulatorsEnabled) {
      throw new Error(
        "Firebase App Check is required to save account practice. Set NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY to your reCAPTCHA v3 site key.",
      );
    }

    const completePractice = httpsCallable<
      {
        verseId: string;
        typedText: string;
        elapsedMs: number;
        startedAtMs: number;
        mode: PracticeMode;
        idempotencyKey: string;
      },
      CompletionResponse
    >(cloudFunctions, "completePractice");
    const { data } = await completePractice({
      verseId,
      typedText,
      elapsedMs,
      startedAtMs,
      mode,
      idempotencyKey: crypto.randomUUID(),
    });

    if (!isCompletionResponse(data)) {
      throw new Error(
        "ScriptType could not verify this practice result. Your progress was not updated.",
      );
    }

    return data;
  }

  const verse = getVerse(verseId);
  if (!verse) throw new Error("This Scripture practice is no longer available.");

  const metrics = calculateTypingMetrics(verse.text, typedText, elapsedMs);
  const memoryScore =
    mode === "memory"
      ? calculateMemoryMetrics(verse.text, typedText).score
      : undefined;

  return recordLocalSession({
    verseId,
    metrics,
    mode,
    ...(memoryScore === undefined ? {} : { memoryScore }),
  });
}
