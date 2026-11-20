"use client";

import { Check, LockKeyhole, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { generateFirebaseReflection } from "@/lib/firebase-ai";

type ReflectionEntry = {
  id: string;
  verse: string;
  response: string;
  createdAt: string;
  aiReflection?: string;
};

const STORAGE_KEY = "scripttype.private-reflections.v1";

export default function ReflectionPage() {
  const [entries, setEntries] = useState<ReflectionEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as ReflectionEntry[]) : [];
    } catch {
      return [];
    }
  });
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState("");
  const [aiConsent, setAiConsent] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReflection, setAiReflection] = useState("");

  async function generateReflection() {
    if (!aiConsent) {
      setMessage("Confirm that you want to send this verse context to the AI.");
      return;
    }

    setAiLoading(true);
    setMessage("");
    try {
      const text = await generateFirebaseReflection({
        reference: "Psalm 119:105",
        verse:
          "Thy word is a lamp unto my feet, and a light unto my path.",
        response,
      });
      setAiReflection(text);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The AI could not create a reflection.",
      );
    } finally {
      setAiLoading(false);
    }
  }

  function saveEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!response.trim()) return;
    const entry: ReflectionEntry = {
      id: crypto.randomUUID(),
      verse: "Psalm 119:105",
      response: response.trim(),
      createdAt: new Date().toISOString(),
      ...(aiReflection ? { aiReflection } : {}),
    };
    const next = [entry, ...entries];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setEntries(next);
      setResponse("");
      setAiReflection("");
      setAiConsent(false);
      setMessage("Reflection saved privately on this device.");
    } catch {
      setMessage("This browser could not save the reflection. Check storage permissions and try again.");
    }
  }

  function removeEntry(id: string) {
    const next = entries.filter((entry) => entry.id !== id);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setEntries(next);
      setMessage("Reflection deleted from this device.");
    } catch {
      setMessage("This browser could not delete the reflection.");
    }
  }

  return (
    <div className="mx-auto max-w-[880px] float-in">
      <div className="mb-7">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Private reflection</div>
        <h1 className="page-title mt-2">Take one honest moment.</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          A journal is for notice and application, not a spiritual performance. These notes stay in this browser.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-card border border-primary/20 bg-accent p-4 text-accent-foreground">
        <LockKeyhole size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p className="text-sm leading-6">
          Private by default. Your journal text stays on this device and is not
          sent to analytics or AI unless you explicitly request an AI reflection.
          That request sends this verse and your reflection text to the AI.
        </p>
      </div>

      <form onSubmit={saveEntry} className="surface-card mt-5 p-card sm:p-7">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
          <Sparkles size={13} aria-hidden="true" /> Psalm 119:105
        </div>
        <p className="reading-type mt-4 text-xl leading-8">Thy word is a lamp unto my feet, and a light unto my path.</p>
        <div className="mt-6 grid gap-3">
          {["What stands out in this verse?", "What might this look like in my life today?", "What is one small step I can take?"].map((prompt) => (
            <button key={prompt} type="button" onClick={() => setResponse((value) => value ? `${value}\n\n${prompt}\n` : `${prompt}\n`)} className="min-h-10 rounded-xl border px-4 text-left text-xs text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-foreground">
              {prompt}
            </button>
          ))}
        </div>
        <label htmlFor="reflection-response" className="mt-5 block text-xs font-semibold">Your reflection</label>
        <textarea id="reflection-response" value={response} onChange={(event) => setResponse(event.target.value)} rows={7} maxLength={5000} className="mt-2 w-full resize-y rounded-2xl border bg-background px-4 py-4 text-sm leading-6 outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10" placeholder="Write for yourself…" />
        <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 p-4">
          <label className="flex min-h-11 items-start gap-3 text-sm leading-6">
            <input
              type="checkbox"
              checked={aiConsent}
              onChange={(event) => setAiConsent(event.target.checked)}
              className="mt-0.5 size-4 accent-primary focus-visible:ring-2 focus-visible:ring-ring"
            />
            <span>
              Ask the AI for a gentle reflection. This sends the verse and my
              reflection text to the AI for one response; ScriptType does not
              save it to analytics. If you save the entry, the AI response is
              stored with it on this device.
            </span>
          </label>
          <button
            type="button"
            onClick={generateReflection}
            disabled={!aiConsent || aiLoading}
            className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Sparkles size={14} aria-hidden="true" />
            {aiLoading ? "Reflecting…" : "Generate with the AI"}
          </button>
          {aiReflection && (
            <div className="mt-4 rounded-xl border bg-card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                AI reflection
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                {aiReflection}
              </p>
              <p className="mt-3 text-[10px] leading-4 text-muted-foreground">
                Machine-generated guidance. Read it prayerfully and use your own
                judgment.
              </p>
            </div>
          )}
        </div>
        {message && <p role="status" className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Check size={13} aria-hidden="true" /> {message}</p>}
        <button type="submit" disabled={!response.trim()} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground disabled:opacity-40">
          Save privately <LockKeyhole size={13} aria-hidden="true" />
        </button>
      </form>

      {entries.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-3 text-sm font-semibold">Recent reflections</h2>
          <div className="space-y-3">
            {entries.map((entry) => (
              <article key={entry.id} className="rounded-2xl border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold text-primary">{entry.verse}</span>
                  <button type="button" onClick={() => removeEntry(entry.id)} className="text-[10px] font-semibold text-muted-foreground hover:text-destructive">Delete</button>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{entry.response}</p>
                {entry.aiReflection && (
                  <div className="mt-4 rounded-xl border border-primary/10 bg-primary/5 p-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-primary">
                      AI reflection
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-xs leading-5">
                      {entry.aiReflection}
                    </p>
                  </div>
                )}
                <time className="mt-3 block text-[9px] text-muted-foreground">{new Date(entry.createdAt).toLocaleString()}</time>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
