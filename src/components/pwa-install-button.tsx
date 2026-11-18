"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isInstallPromptEvent(event: Event): event is InstallPromptEvent {
  return "prompt" in event && "userChoice" in event;
}

export function PwaInstallButton() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(display-mode: standalone)").matches,
  );
  const isAppleMobile =
    typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const [message, setMessage] = useState("");

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      if (!isInstallPromptEvent(event)) return;
      event.preventDefault();
      setInstallPrompt(event);
    }

    function handleAppInstalled() {
      setIsInstalled(true);
      setInstallPrompt(null);
      setMessage("ScriptType is installed on this device.");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function installApp() {
    if (!installPrompt) {
      setMessage(
        isAppleMobile
          ? "To install, open the Share menu in Safari and choose Add to Home Screen."
          : "Use your browser’s Install ScriptType or Add to Home Screen option when it appears.",
      );
      return;
    }

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setMessage(
        choice.outcome === "accepted"
          ? "ScriptType is being installed."
          : "Installation was canceled. You can install ScriptType later.",
      );
    } catch {
      setMessage("The install prompt could not be opened. Try your browser menu instead.");
    } finally {
      setInstallPrompt(null);
    }
  }

  if (isInstalled) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={installApp}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-control border bg-card px-3 text-xs font-semibold transition hover:border-primary/40 hover:bg-accent"
      >
        <Download size={14} aria-hidden="true" />
        <span className="hidden sm:inline">Install ScriptType</span>
        <span className="sm:hidden">Install</span>
      </button>
      {message && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border bg-card p-3 text-xs leading-5 text-foreground shadow-panel"
          role="status"
        >
          <p>{message}</p>
          <button
            type="button"
            className="mt-2 min-h-9 font-semibold text-primary"
            onClick={() => setMessage("")}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
