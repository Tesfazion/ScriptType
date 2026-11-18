"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AudioLines,
  BookOpen,
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  Compass,
  Flame,
  Heart,
  House,
  Settings2,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { useAuth } from "@/components/app-providers";
import { ThemeToggle } from "@/components/theme-toggle";
import { firebaseAuth } from "@/lib/firebase";

const navigation = [
  { href: "/today", label: "Today", icon: House, mobile: true },
  { href: "/journeys", label: "Journeys", icon: Compass, mobile: true },
  { href: "/practice", label: "Practice", icon: BookOpenText, mobile: false },
  {
    href: "/progress",
    label: "Growth",
    icon: ChartNoAxesColumnIncreasing,
    mobile: true,
  },
  { href: "/community", label: "Community", icon: UsersRound, mobile: true },
  { href: "/memory", label: "Memory", icon: Heart, mobile: false },
  { href: "/audio", label: "Listen", icon: AudioLines, mobile: false },
  { href: "/reflection", label: "Reflection", icon: Sparkles, mobile: false },
];

export function ProductShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, firebaseConfigured } = useAuth();
  const [authMessage, setAuthMessage] = useState("");
  const isActive = (href: string) =>
    pathname === href || (href !== "/today" && pathname.startsWith(`${href}/`));

  async function handleSignOut() {
    if (!firebaseAuth) {
      setAuthMessage("Sign-out is unavailable because Firebase is not configured.");
      return;
    }
    try {
      await signOut(firebaseAuth);
    } catch {
      setAuthMessage("We couldn’t sign you out. Please try again.");
    }
  }

  return (
    <div className="page-shell">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-full bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <div className="mx-auto flex min-h-dvh max-w-[1480px]">
        <aside className="sticky top-0 hidden h-dvh w-[252px] shrink-0 flex-col border-r bg-card/60 px-5 py-7 backdrop-blur-xl lg:flex">
          <Link href="/today" className="flex items-center gap-3 px-2">
            <span className="brand-mark" aria-hidden="true">
              <BookOpen size={17} strokeWidth={2.2} />
            </span>
            <span>
              <span className="block text-[15px] font-semibold tracking-[-0.03em]">
                ScriptType
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Scripture in motion
              </span>
            </span>
          </Link>

          <div className="mt-10 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            YOUR PRACTICE
          </div>
          <nav aria-label="Main navigation" className="mt-3 space-y-1">
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition ${
                  isActive(href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                {label}
                {href === "/today" && (
                  <span className="ml-auto size-1.5 rounded-full bg-growth" />
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-[#d8c9f5] bg-gradient-to-br from-[#f2edfc] to-[#fbf9ff] p-4 dark:border-[#3f3458] dark:from-[#252133] dark:to-[#1b1924]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#503393] dark:text-[#cfbaff]">
              <Flame size={15} aria-hidden="true" />
              A small rhythm, daily
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Five focused minutes is a strong place to begin.
            </p>
            <Link href="/settings" className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
              Choose your weekly goal <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-auto border-t pt-4">
            <Link
              href="/settings"
              className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium ${
                isActive("/settings")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Settings2 size={17} aria-hidden="true" />
              Settings
            </Link>
            <Link
              href="/admin"
              className={`mt-1 flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium ${
                isActive("/admin")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <ShieldCheck size={17} aria-hidden="true" />
              Admin studio
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b bg-background/80 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
            <Link href="/today" className="flex items-center gap-2.5 lg:hidden">
              <span className="brand-mark size-8">
                <BookOpen size={16} aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold tracking-tight">ScriptType</span>
            </Link>
            <div className="hidden text-xs text-muted-foreground lg:block">
              Let the Word take root.
            </div>
            <div className="ml-auto flex items-center gap-2.5">
              <span
                className={`hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-medium sm:inline-flex ${
                  user
                    ? "border-growth/25 bg-growth/5 text-growth"
                    : "border-gold/30 bg-gold/10 text-[#8a5e14] dark:text-[#f2c46f]"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${user ? "bg-growth" : "bg-gold"}`}
                />
                {user
                  ? "Synced account"
                  : firebaseConfigured
                    ? "Device preview"
                    : "Device demo"}
              </span>
              <ThemeToggle />
              {user ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  {user.displayName?.slice(0, 1) ??
                    user.email?.slice(0, 1).toUpperCase() ??
                    "S"}
                </button>
              ) : (
                <Link
                  href="/sign-in"
                  className="hidden rounded-full border bg-card px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-muted sm:inline-flex"
                >
                  Sign in
                </Link>
              )}
            </div>
          </header>

          {authMessage && (
            <p role="status" className="px-6 pt-3 text-sm text-destructive">
              {authMessage}
            </p>
          )}
          <main
            id="main-content"
            className="mx-auto w-full max-w-[1240px] px-4 pb-28 pt-7 sm:px-7 sm:pt-9 lg:px-10 lg:pb-12"
          >
            {children}
          </main>
        </div>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-background/95 px-1 pb-[max(env(safe-area-inset-bottom),0.25rem)] pt-2 shadow-[0_-8px_24px_rgba(27,20,45,0.06)] backdrop-blur-xl lg:hidden"
      >
        {navigation
          .filter((item) => item.mobile)
          .map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 text-[9px] font-medium ${
                isActive(href) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon size={18} strokeWidth={isActive(href) ? 2.2 : 1.7} aria-hidden="true" />
              {label}
            </Link>
          ))}
      </nav>
    </div>
  );
}
