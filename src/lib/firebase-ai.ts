import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  type Content,
} from "firebase/ai";
import {
  firebaseApp,
  firebaseAppCheck,
  firebaseConfigured,
} from "@/lib/firebase";

export type ReflectionPrompt = {
  reference: string;
  verse: string;
  response: string;
};

export type AssistantChatTurn = {
  role: "user" | "assistant";
  text: string;
};

const ASSISTANT_SYSTEM_INSTRUCTION =
  "You are ScriptType's Scripture study companion and typing coach. Answer Scripture questions respectfully, distinguish the text from interpretations, note uncertainty, and never claim divine authority or present one denomination's interpretation as universal. Do not invent quotations or references; summarize briefly and encourage checking the passage in context. For typing questions, give practical, encouraging advice without claiming access to typing statistics unless the user included them. Keep replies under 150 words. Do not provide medical, mental-health, or crisis counseling; respond supportively and encourage appropriate human help when needed.";
const MAX_ASSISTANT_MESSAGE_LENGTH = 1000;

function createFirebaseTextModel(
  systemInstruction: string,
  maxOutputTokens: number,
  featureName: string,
) {
  if (!firebaseConfigured || !firebaseApp) {
    throw new Error(
      `${featureName} is unavailable until Firebase is configured. Your text has not been sent.`,
    );
  }
  if (!firebaseAppCheck) {
    throw new Error(
      process.env.NODE_ENV === "development"
        ? "App Check is not initialized. For local AI, disable emulator mode and register the debug token printed in the browser console."
        : "The AI requires App Check. Configure a reCAPTCHA Enterprise provider for this Web App.",
    );
  }

  const ai = getAI(firebaseApp, {
    backend: new GoogleAIBackend(),
  });
  return getGenerativeModel(ai, {
    model: "gemini-2.5-flash",
    systemInstruction: {
      role: "system",
      parts: [{ type: "text", text: systemInstruction }],
    },
    generationConfig: {
      temperature: 0.55,
      maxOutputTokens,
    },
  });
}

export async function generateFirebaseAssistantReply({
  context,
  history,
  message,
}: {
  context: string;
  history: AssistantChatTurn[];
  message: string;
}): Promise<string> {
  const question = message.trim();
  if (!question || question.length > MAX_ASSISTANT_MESSAGE_LENGTH) {
    throw new Error("Enter a question of 1,000 characters or fewer.");
  }

  const model = createFirebaseTextModel(
    ASSISTANT_SYSTEM_INSTRUCTION,
    500,
    "The AI assistant",
  );
  const contents: Content[] = history.slice(-6).map((turn) => ({
    role: turn.role === "assistant" ? "model" : "user",
    parts: [{ type: "text", text: turn.text.slice(0, MAX_ASSISTANT_MESSAGE_LENGTH) }],
  }));
  contents.push({
    role: "user",
    parts: [
      {
        type: "text",
        text: `Current ScriptType section: ${context}\nQuestion: ${question}`,
      },
    ],
  });

  const result = await model.generateContent({ contents });
  const text = result.response.text().trim();
  if (!text) {
    throw new Error("The AI did not return a reply. Please try again.");
  }
  return text;
}

export async function generateFirebaseReflection({
  reference,
  verse,
  response,
}: ReflectionPrompt): Promise<string> {
  const model = createFirebaseTextModel(
    "You are a gentle Scripture reflection assistant in a Christian Bible memorization app. Give warm, practical, non-authoritative reflection. Do not claim to speak for God, predict the future, diagnose emotions, prescribe spiritual duties, or make doctrinal claims beyond the supplied verse. Use 1 short opening observation, 1 thoughtful question, and 1 small optional application. Keep the total response under 150 words.",
    500,
    "AI reflection",
  );

  const result = await model.generateContent(
    [
      {
        type: "text",
        text: `Verse reference: ${reference}\nVerse text: ${verse}\nUser's private reflection: ${response.trim() || "The user has not written a response yet."}\nReturn a gentle reflection in this exact structure:\nObservation: ...\nQuestion: ...\nSmall step: ...`,
      },
    ],
  );

  const text = result.response.text().trim();
  if (!text) {
    throw new Error("The AI did not return a reflection. Please try again.");
  }
  return text;
}
