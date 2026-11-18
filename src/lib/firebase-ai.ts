import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
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

export async function generateFirebaseReflection({
  reference,
  verse,
  response,
}: ReflectionPrompt): Promise<string> {
  if (!firebaseConfigured || !firebaseApp) {
    throw new Error(
      "AI reflection is unavailable until Firebase is configured. Your private reflection has not been sent.",
    );
  }
  if (!firebaseAppCheck) {
    throw new Error(
      process.env.NODE_ENV === "development"
        ? "Firebase App Check is not initialized. For local AI reflection, disable emulator mode and register the debug token printed in the browser console."
        : "Firebase AI reflection requires App Check. Configure a reCAPTCHA Enterprise provider for this Web App.",
    );
  }

  const ai = getAI(firebaseApp, {
    backend: new GoogleAIBackend(),
  });
  const model = getGenerativeModel(
    ai,
    {
      model: "gemini-2.5-flash",
      systemInstruction: {
        role: "system",
        parts: [
          {
            type: "text",
            text:
              "You are a gentle Scripture reflection assistant in a Christian Bible memorization app. Give warm, practical, non-authoritative reflection. Do not claim to speak for God, predict the future, diagnose emotions, prescribe spiritual duties, or make doctrinal claims beyond the supplied verse. Use 1 short opening observation, 1 thoughtful question, and 1 small optional application. Keep the total response under 150 words.",
          },
        ],
      },
      generationConfig: {
        temperature: 0.55,
        maxOutputTokens: 500,
      },
    },
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
    throw new Error(
      "Firebase AI did not return a reflection. Please try again.",
    );
  }
  return text;
}
