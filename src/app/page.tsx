import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  Check,
  Flame,
  Keyboard,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { LandingPreview } from "@/components/landing-preview";
import { BrandMark } from "@/components/brand-mark";
import { Mascot } from "@/components/mascot";
import { ThemeToggle } from "@/components/theme-toggle";

const practiceSteps = [
  {
    icon: Keyboard,
    title: "Type with intention",
    description:
      "A quiet practice canvas gives every word your attention and helps accuracy grow.",
  },
  {
    icon: BookOpenText,
    title: "Keep the words close",
    description:
      "Return to passages through guided memory levels, one manageable step at a time.",
  },
  {
    icon: Flame,
    title: "Build a rhythm that fits",
    description:
      "Choose a goal, follow a Scripture journey, and notice how your practice grows.",
  },
];

const journeys = [
  {
    label: "GOSPELS",
    title: "The Gospel of John",
    description: "Begin with the Word.",
    verses: "A guided path · 3 sample passages",
  },
  {
    label: "WISDOM",
    title: "Psalms for the Soul",
    description: "Find words for every season.",
    verses: "A guided path · 3 sample passages",
  },
  {
    label: "WISDOM",
    title: "31 Days in Proverbs",
    description: "Practice wisdom, one day at a time.",
    verses: "A guided path · 3 sample passages",
  },
];

const proofPoints = [
  {
    icon: Sparkles,
    label: "Try before you join",
    detail: "Type a full verse without creating an account.",
  },
  {
    icon: Check,
    label: "No streak guilt",
    detail: "Progress recognizes practice, not spiritual worth.",
  },
  {
    icon: UsersRound,
    label: "Private by default",
    detail: "Reflections stay on your device unless you choose to sync.",
  },
];

export default function Home() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-control bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-5 px-4 sm:px-7 lg:px-10">
          <Link
            href="/"
            className="brand-wordmark"
            aria-label="ScriptType home"
          >
            <BrandMark size="sm" priority />
            <span className="brand-name">ScriptType</span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 md:flex"
          >
            <a href="#practice" className="nav-link">
              How it works
            </a>
            <a href="#journeys" className="nav-link">
              Journeys
            </a>
            <a href="#approach" className="nav-link">
              Our approach
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link href="/sign-in" className="button-quiet hidden sm:inline-flex">
              Sign in
            </Link>
            <Link href="/practice" className="button-primary min-h-10 px-4 text-xs">
              Try a verse
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="relative isolate overflow-hidden">
          <div
            className="pointer-events-none absolute -left-48 top-24 -z-10 size-[34rem] rounded-full bg-primary/5 blur-3xl"
            aria-hidden="true"
          />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-14 sm:px-7 sm:pb-24 sm:pt-20 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14 lg:px-10 lg:py-24">
            <div className="max-w-2xl">
              <div className="eyebrow flex items-center gap-2 text-primary">
                <span className="size-2 rounded-full bg-primary" />
                A little practice for a deeper rhythm
              </div>
              <div className="mt-6 flex items-center gap-4">
                <Mascot size="md" className="shrink-0" />
                <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                  Meet your practice companion — the ScriptType ribbon that
                  remembers what you type.
                </p>
              </div>
              <h1 className="mt-5 max-w-[11ch] text-display font-semibold tracking-[-0.065em]">
                Let the Word
                <span className="mt-1 block text-primary">take root.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Improve your typing while making Scripture your own. One verse,
                one focused moment, one day at a time.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/practice" className="button-primary min-h-12 px-6">
                  Type today&rsquo;s verse
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <a href="#journeys" className="button-secondary min-h-12 px-5">
                  Explore journeys
                  <ArrowDown size={15} aria-hidden="true" />
                </a>
              </div>
              <p className="mt-5 text-xs text-muted-foreground">
                No account needed. Your first practice is saved on this device.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
              <div
                className="pointer-events-none absolute -bottom-5 -left-5 -z-10 size-28 rounded-full border border-primary/15"
                aria-hidden="true"
              />
              <LandingPreview />
            </div>
          </div>
        </section>

        <section className="border-y bg-card py-10" aria-label="What makes ScriptType different">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-7 md:grid-cols-3 lg:px-10">
            {proofPoints.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-control bg-accent text-primary">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="practice"
          className="border-b bg-card py-16 sm:py-20"
          aria-labelledby="practice-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-7 lg:px-10">
            <div className="max-w-2xl">
              <p className="eyebrow text-primary">A simpler way to return</p>
              <h2
                id="practice-heading"
                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Practice with purpose.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                ScriptType makes space for typing practice, Scripture memory,
                and a daily habit in one thoughtful experience.
              </p>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {practiceSteps.map(({ icon: Icon, title, description }) => (
                <article key={title} className="surface-card p-card">
                  <span className="grid size-11 place-items-center rounded-control bg-accent text-primary">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="journeys"
          className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-7 sm:py-20 lg:grid-cols-[0.75fr_1.25fr] lg:items-start lg:px-10"
          aria-labelledby="journeys-heading"
        >
          <div className="lg:sticky lg:top-24">
            <p className="eyebrow text-primary">Follow a path</p>
            <h2
              id="journeys-heading"
              className="mt-3 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Find a journey that meets you where you are.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
              Walk through John. Find your footing in the Psalms. Start with one
              passage and let a path unfold one day at a time.
            </p>
            <Link
              href="/journeys"
              className="button-secondary mt-6 w-fit"
            >
              Explore all journeys
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="space-y-3">
            {journeys.map((journey, index) => (
              <Link
                key={journey.title}
                href="/journeys"
                className="surface-card group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-panel sm:gap-5 sm:p-5"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-card bg-accent text-sm font-semibold text-accent-foreground">
                  0{index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="eyebrow block">{journey.label}</span>
                  <span className="mt-1 block text-base font-semibold">
                    {journey.title}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {journey.description}
                  </span>
                  <span className="mt-2 block text-xs text-muted-foreground">
                    {journey.verses}
                  </span>
                </span>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="approach"
          className="mx-4 mb-16 rounded-panel bg-primary px-6 py-10 text-primary-foreground shadow-panel sm:mx-7 sm:px-10 sm:py-12 lg:mx-auto lg:mb-20 lg:max-w-7xl lg:px-14"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="eyebrow text-primary-foreground/80">
                A gentler kind of progress
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Practice that feels good to come back to.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-primary-foreground/85 sm:text-base">
                No pressure to be perfect. No streaks that measure your faith.
                Just a thoughtful way to build skill, remember Scripture, and
                keep showing up.
              </p>
            </div>
            <Link
              href="/practice"
              className="inline-flex min-h-12 w-fit items-center gap-2 rounded-control bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Type today&rsquo;s verse
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-10">
          <Link href="/" className="brand-wordmark">
            <BrandMark size="xs" />
            <span>ScriptType · A little practice for a deeper rhythm.</span>
          </Link>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/privacy" className="nav-link">
              Privacy
            </Link>
            <Link href="/terms" className="nav-link">
              Terms
            </Link>
            <Link href="/sign-in" className="nav-link">
              Your account
            </Link>
            <span className="inline-flex items-center gap-2 text-xs">
              <Check size={14} aria-hidden="true" />
              KJV text · rights review before launch
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
