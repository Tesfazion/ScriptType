"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, Sparkles, Trash2, X } from "lucide-react";
import Link from "next/link";
import {
  generateFirebaseAssistantReply,
  type AssistantChatTurn,
} from "@/lib/firebase-ai";

const MAX_MESSAGE_LENGTH = 1000;
const SUGGESTED_QUESTIONS = [
  "Help me understand a verse",
  "How can I improve my accuracy?",
  "What should I practice next?",
];

function getSectionContext(pathname: string): string {
  if (pathname.startsWith("/practice") || pathname.includes("/challenge/")) {
    return "typing practice";
  }
  if (pathname.startsWith("/journeys")) return "Scripture journeys";
  if (pathname.startsWith("/trainer")) return "keyboard trainer";
  if (pathname.startsWith("/memory")) return "memory practice";
  if (pathname.startsWith("/audio")) return "listen and type";
  if (pathname.startsWith("/progress")) return "progress";
  if (pathname.startsWith("/today")) return "today's practice";
  if (pathname.startsWith("/community")) return "community";
  return "ScriptType";
}

export function ScriptureAssistant() {
  const pathname = usePathname();
  const sectionContext = getSectionContext(pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [hasAiConsent, setHasAiConsent] = useState(false);
  const [messages, setMessages] = useState<AssistantChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const launcherRef = useRef<HTMLButtonElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const focusTimer = window.setTimeout(() => {
      if (hasAiConsent) inputRef.current?.focus();
      else consentRef.current?.focus();
    }, 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      launcherRef.current?.focus();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasAiConsent, isOpen]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [isLoading, messages]);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = input.trim();
    if (!question || !hasAiConsent || isLoading) return;

    setErrorMessage("");
    setIsLoading(true);
    try {
      const reply = await generateFirebaseAssistantReply({
        context: sectionContext,
        history: messages.slice(-6),
        message: question,
      });
      setMessages((current) =>
        [
          ...current,
          { role: "user", text: question } satisfies AssistantChatTurn,
          { role: "assistant", text: reply } satisfies AssistantChatTurn,
        ].slice(-8),
      );
      setInput("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The assistant could not reply. Your question is still here to retry.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function clearConversation() {
    setMessages([]);
    setInput("");
    setErrorMessage("");
    setHasAiConsent(false);
    consentRef.current?.focus();
  }

  return (
    <>
      <section
          hidden={!isOpen}
          id="scripture-assistant-panel"
          role="region"
          aria-label="Scripture and typing assistant"
          className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-3 z-50 flex max-h-[calc(100dvh-6.5rem)] w-[calc(100vw-1.5rem)] max-w-[25rem] flex-col overflow-hidden rounded-panel border bg-card shadow-float sm:bottom-6 sm:left-auto sm:right-6"
        >
          <header className="flex items-start justify-between gap-3 border-b px-4 py-3">
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles size={16} className="text-primary" aria-hidden="true" />
                Scripture + typing coach
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Current section: {sectionContext}
              </p>
            </div>
            <div className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={clearConversation}
                className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                aria-label="Clear assistant conversation and consent"
                title="Clear conversation"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  launcherRef.current?.focus();
                }}
                className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                aria-label="Close assistant"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          </header>

          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
            aria-label="Assistant conversation"
            className="min-h-24 flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm leading-6 text-muted-foreground">
                  Ask a Scripture question or get a practical typing tip.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => setInput(question)}
                      className="min-h-10 rounded-full border bg-background px-3 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <article
                  key={`${message.role}-${index}`}
                  className={`max-w-[92%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2.5 text-sm leading-6 ${
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "mr-auto border bg-muted text-foreground"
                  }`}
                >
                  {message.text}
                </article>
              ))
            )}
            {isLoading && (
              <p role="status" className="text-sm text-muted-foreground">
                Thinking…
              </p>
            )}
          </div>

          <div className="border-t px-4 py-3">
            <div className="mb-3 rounded-control bg-muted/60 p-3">
              <label className="flex min-h-11 items-start gap-3 text-xs leading-5">
                <input
                  ref={consentRef}
                  type="checkbox"
                  checked={hasAiConsent}
                  onChange={(event) => setHasAiConsent(event.target.checked)}
                  className="mt-1 size-4 shrink-0 accent-primary focus-visible:ring-2 focus-visible:ring-ring"
                />
                <span>
                  Sending a message shares it, recent chat turns, and this section
                  label with the AI. Chat is not saved by ScriptType. AI can
                  be wrong; don’t include journal entries or sensitive details.
                  <Link
                    href="/privacy"
                    className="ml-1 font-semibold text-primary underline underline-offset-2"
                  >
                    Privacy
                  </Link>
                </span>
              </label>
            </div>
            {errorMessage && (
              <p role="alert" className="mb-2 text-xs leading-5 text-destructive">
                {errorMessage}
              </p>
            )}
            <form onSubmit={sendMessage} className="space-y-2">
              <label htmlFor="scripture-assistant-message" className="sr-only">
                Your question
              </label>
              <textarea
                ref={inputRef}
                id="scripture-assistant-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={MAX_MESSAGE_LENGTH}
                rows={2}
                disabled={!hasAiConsent || isLoading}
                placeholder={
                  hasAiConsent ? "Ask a question…" : "Review and accept the AI notice first"
                }
                className="field-control min-h-20 w-full resize-y px-3 py-2.5 text-base leading-6 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  {input.length}/{MAX_MESSAGE_LENGTH}
                </span>
                <button
                  type="submit"
                  disabled={!hasAiConsent || !input.trim() || isLoading}
                  className="button-primary inline-flex min-h-11 items-center gap-2 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Sending…" : "Send"}
                  <Send size={14} aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
      </section>

      <button
        ref={launcherRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="scripture-assistant-panel"
        aria-label={isOpen ? "Close Scripture and typing assistant" : "Open Scripture and typing assistant"}
        onClick={() => setIsOpen((open) => !open)}
        className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-4 z-50 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-float transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:bottom-6 sm:left-auto sm:right-6"
      >
        {isOpen ? (
          <X size={17} aria-hidden="true" />
        ) : (
          <MessageCircle size={17} aria-hidden="true" />
        )}
        <span>Ask</span>
      </button>
    </>
  );
}
