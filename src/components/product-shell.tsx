"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AudioLines,
  ChartNoAxesColumnIncreasing,
  Compass,
  Flame,
  Heart,
  House,
  Keyboard,
  Settings2,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useAuth } from "@/components/app-providers";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { PwaInstallButton } from "@/components/pwa-install-button";
import { Onboarding } from "@/components/onboarding";

const navigation = [
  { href: "/today", label: "Today", icon: House, mobile: true },
  { href: "/journeys", label: "Journeys", icon: Compass, mobile: true },
  { href: "/practice", label: "Practice", icon: Keyboard, mobile: true },
  {
    href: "/progress",
    label: "Growth",
    icon: ChartNoAxesColumnIncreasing,
    mobile: true,
  },
  { href: "/profile", label: "You", icon: UserRound, mobile: true },
  { href: "/memory", label: "Memory", icon: Heart, mobile: true },
  { href: "/trainer", label: "Trainer", icon: Keyboard, mobile: true },
  { href: "/audio", label: "Listen", icon: AudioLines, mobile: true },
  { href: "/reflection", label: "Reflection", icon: Sparkles, mobile: true },
  { href: "/community", label: "Community", icon: UsersRound, mobile: true },
];

export function ProductShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const {
    user,
    firebaseConfigured,
    isOnline,
    offlineSupportReady,
    offlineSupportError,
  } = useAuth();

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);
  const isActive = (href: string) =>
    pathname === href || (href !== "/today" && pathname.startsWith(`${href}/`));

  useEffect(() => {
    const shortcutRoutes: Record<string, string> = {
      "1": "/today",
      "2": "/practice",
      "3": "/memory",
      "4": "/audio",
      "5": "/trainer",
      "6": "/progress",
      "7": "/journeys",
      "8": "/reflection",
      "9": "/profile",
      "0": "/community",
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      const href = shortcutRoutes[event.key];
      if (href) {
        event.preventDefault();
        router.push(href);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <div className="page-shell">
      {mounted && <Onboarding />}
      <a
        href="#main-content"
        className="sr-only z-50 rounded-full bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <div className="mx-auto flex min-h-dvh max-w-[1480px]">
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
          <Link href="/today" className="flex items-center gap-3 px-2">
            <BrandMark size="sm" priority />
            <span>
              <span className="block text-base font-semibold tracking-tight">
                ScriptType
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Typing with purpose
              </span>
            </span>
          </Link>

          <div className="eyebrow mt-8 px-2">
            YOUR PRACTICE
          </div>
          <nav aria-label="Main navigation" className="mt-3 space-y-1">
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`group flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-medium transition ${
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

          <div className="surface-muted mt-6 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Flame size={15} aria-hidden="true" />
              Small steps, daily
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              A few focused minutes build a lasting skill.
            </p>
            <Link href="/settings" className="mt-2 inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-primary">
              Set a weekly goal <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-auto border-t pt-4">
            <Link
              href="/profile"
              aria-current={isActive("/profile") ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-medium ${
                isActive("/profile")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <UserRound size={17} aria-hidden="true" />
              Profile
            </Link>
            <Link
              href="/settings"
              className={`flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-medium ${
                isActive("/settings")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Settings2 size={17} aria-hidden="true" />
              Settings
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
            <Link href="/today" className="flex items-center gap-2.5 lg:hidden">
              <BrandMark size="sm" priority />
              <span className="text-sm font-semibold tracking-tight">ScriptType</span>
            </Link>
            <div className="hidden text-xs text-muted-foreground lg:block">
              Practice with purpose.
            </div>
            <div className="ml-auto flex items-center gap-2.5">
              <span
                className={`hidden min-h-9 items-center gap-2 rounded-full border px-3 text-xs font-medium sm:inline-flex ${
                  user
                    ? "border-growth/25 bg-growth/5 text-growth"
                    : "border-primary/20 bg-primary/5 text-primary"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${user ? "bg-growth" : "bg-gold"}`}
                />
                {user
                  ? "Synced account"
                  : firebaseConfigured
                    ? "Signed-in mode"
                    : "Device-only mode"}
              </span>
              <span
                className={`hidden min-h-9 items-center gap-2 rounded-full border px-3 text-xs font-medium sm:inline-flex ${
                  isOnline
                    ? "border-growth/25 bg-growth/5 text-growth"
                    : "border-warning/30 bg-warning/10 text-foreground"
                }`}
                title={offlineSupportError || undefined}
              >
                <span className={`size-1.5 rounded-full ${isOnline ? "bg-growth" : "bg-warning"}`} />
                {!isOnline ? "Working offline" : offlineSupportReady ? "Offline ready" : "Connecting"}
              </span>
              <PwaInstallButton />
              <Link
                href="/settings"
                className="grid size-10 place-items-center rounded-full border bg-card text-muted-foreground hover:text-foreground lg:hidden"
                aria-label="Settings"
              >
                <Settings2 size={16} aria-hidden="true" />
              </Link>
              <ThemeToggle />
              {user ? (
                <Link
                  href="/profile"
                  className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                  aria-label="Open profile"
                  title="Profile"
                >
                  {user.displayName?.slice(0, 1) ??
                    user.email?.slice(0, 1).toUpperCase() ??
                    "S"}
                </Link>
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

          <main
            id="main-content"
            className="mx-auto w-full max-w-[1200px] px-page pb-28 pt-5 sm:px-7 sm:pt-7 lg:px-8 lg:pb-10"
          >
            {children}
          </main>
        </div>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="mobile-navigation fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 px-1 pb-[max(env(safe-area-inset-bottom),0.25rem)] pt-2 lg:hidden"
      >
        {navigation
          .filter((item) => item.mobile)
          .map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 text-xs font-medium ${
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
