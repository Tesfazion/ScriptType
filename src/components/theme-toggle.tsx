"use client";

import { useEffect, useState } from "react";
import { MoonStar, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let preference: string | null = null;
    try {
      preference = window.localStorage.getItem("scripttype.theme");
    } catch {
      queueMicrotask(() =>
        setMessage("Theme preference will last for this visit only."),
      );
    }

    const dark =
      preference === "dark" ||
      (preference === null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    queueMicrotask(() => setIsDark(dark));
    if (preference) {
      document.documentElement.dataset.theme = preference;
    } else if (dark) {
      document.documentElement.dataset.theme = "dark";
    }
  }, []);

  function toggleTheme() {
    const next = !isDark;
    const theme = next ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    setIsDark(next);
    try {
      window.localStorage.setItem("scripttype.theme", theme);
      setMessage("");
    } catch {
      setMessage("Theme preference will last for this visit only.");
    }
  }

  const Icon = isDark ? Sun : MoonStar;

  return (
    <div>
      <button
        type="button"
        onClick={toggleTheme}
        className="grid size-10 place-items-center rounded-full border bg-card text-muted-foreground transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        title={`Switch to ${isDark ? "light" : "dark"} theme`}
      >
        <Icon size={17} aria-hidden="true" />
      </button>
      <span className="sr-only" aria-live="polite">
        {message}
      </span>
    </div>
  );
}
