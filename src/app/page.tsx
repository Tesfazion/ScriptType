import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  AudioLines,
  BookOpenText,
  Flame,
  Keyboard,
  MoveUpRight,
  Sparkles,
} from "lucide-react";
import { LandingPreview } from "@/components/landing-preview";

export default function Home() {
  return (
    <div className="overflow-hidden bg-[#faf9fc] text-[#221c2d] dark:bg-[#111019] dark:text-[#f7f4fb]">
      <header className="relative z-10 mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="ScriptType home">
          <span className="brand-mark" aria-hidden="true">
            <BookOpenText size={17} strokeWidth={2.2} />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.04em]">
            ScriptType
          </span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          <a href="#how-it-works" className="text-xs font-medium text-[#716a7c] transition hover:text-[#332544] dark:text-[#b8b1c2] dark:hover:text-white">
            The practice
          </a>
          <a href="#journeys" className="text-xs font-medium text-[#716a7c] transition hover:text-[#332544] dark:text-[#b8b1c2] dark:hover:text-white">
            Journeys
          </a>
          <a href="#why-scripture" className="text-xs font-medium text-[#716a7c] transition hover:text-[#332544] dark:text-[#b8b1c2] dark:hover:text-white">
            Our approach
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden rounded-full px-4 py-2.5 text-xs font-semibold text-[#645b70] transition hover:bg-black/5 dark:text-[#c5bece] dark:hover:bg-white/5 sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/today"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#6041b8] px-4 text-xs font-semibold text-white shadow-[0_8px_22px_rgba(96,65,184,0.2)] transition hover:-translate-y-0.5 hover:bg-[#52369f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6041b8]"
          >
            Start today
            <MoveUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main>
        <section className="relative mx-auto grid max-w-[1320px] gap-12 px-5 pb-20 pt-9 sm:px-8 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-14">
          <div className="pointer-events-none absolute -left-40 top-32 size-[520px] rounded-full bg-[#b69aff]/10 blur-[120px]" />
          <div className="relative z-10 max-w-[650px]">
            <h1 className="max-w-[660px] text-[clamp(3.2rem,7vw,6.1rem)] font-semibold leading-[0.98] tracking-[-0.075em]">
              Let the Word
              <span className="relative mt-1 block text-[#6041b8] dark:text-[#b69aff]">
                take root.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 310 18"
                  className="absolute -bottom-2 left-0 h-3 w-[230px] text-[#e4c078] sm:w-[290px]"
                  fill="none"
                >
                  <path d="M4 13C80 4 216 2 306 10" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-7 max-w-[490px] text-base leading-7 text-[#716a7c] sm:text-lg sm:leading-8 dark:text-[#c0b9ca]">
              Improve your typing while making Scripture your own. One verse,
              one focused moment, one day at a time.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/practice"
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#6041b8] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(96,65,184,0.24)] transition hover:-translate-y-0.5 hover:bg-[#52369f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6041b8]"
              >
                Try a verse
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#5f566d] transition hover:bg-black/5 dark:text-[#d1cadb] dark:hover:bg-white/5"
              >
                See how it works
                <ArrowDownRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
            <div className="absolute -right-8 -top-10 hidden size-24 rounded-[2rem] border border-[#ddd2ef] bg-[#f0eafa]/80 rotate-12 lg:block" />
            <div className="absolute -bottom-9 -left-9 hidden size-28 rounded-full border border-[#d6e8df] bg-[#edf6f1]/80 lg:block" />
            <div className="relative z-10">
              <LandingPreview />
              <div className="absolute -bottom-6 -left-2 hidden items-center gap-3 rounded-2xl border border-[#ece7f1] bg-white/95 px-4 py-3 shadow-[0_14px_40px_rgba(38,28,54,0.12)] sm:flex dark:border-white/10 dark:bg-[#211e2b]">
                <span className="grid size-9 place-items-center rounded-xl bg-[#edf6f1] text-[#16775a] dark:bg-[#1c382f] dark:text-[#75d7b4]">
                  <Sparkles size={17} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs font-semibold">Progress, not pressure.</span>
                  <span className="mt-0.5 block text-[10px] text-[#81798a] dark:text-[#b8b1c2]">Your next step is always small.</span>
                </span>
              </div>
              <div className="absolute -right-5 top-20 hidden -rotate-3 items-center gap-2 rounded-full border border-[#efe5ca] bg-[#fff9eb] px-3 py-2 text-[10px] font-semibold text-[#80590f] shadow-sm sm:flex dark:border-[#56472b] dark:bg-[#332b1f] dark:text-[#f2c46f]">
                <AudioLines size={13} aria-hidden="true" />
                Listen · type · remember
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-[#ece8f0] bg-white/70 py-16 dark:border-white/10 dark:bg-[#181620] sm:py-20">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
            <div className="max-w-[660px]">
              <h2 className="text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
                A little practice. A deeper rhythm.
              </h2>
              <p className="mt-4 max-w-[540px] text-sm leading-6 text-[#716a7c] dark:text-[#b8b1c2]">
                Start with a verse, focus on the words, and keep returning to what matters.
                ScriptType makes room for skill and meaning in the same moment.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                {
                  number: "01",
                  icon: Keyboard,
                  title: "Type with intention",
                  text: "See every character take shape. Gentle feedback helps your accuracy grow without interrupting your focus.",
                  tone: "violet",
                },
                {
                  number: "02",
                  icon: BookOpenText,
                  title: "Remember what stays",
                  text: "Move from reading to recall through progressive memory levels and small, repeatable reviews.",
                  tone: "green",
                },
                {
                  number: "03",
                  icon: Flame,
                  title: "Build your own rhythm",
                  text: "Track the days you show up, follow a Scripture journey, and celebrate progress on your terms.",
                  tone: "gold",
                },
              ].map(({ number, icon: Icon, title, text, tone }) => (
                <article
                  key={number}
                  className="group rounded-[1.6rem] border border-[#ebe6f0] bg-[#fbfaff] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d6c9eb] hover:shadow-[0_18px_50px_rgba(48,34,72,0.08)] dark:border-white/10 dark:bg-[#1e1b28] dark:hover:border-[#4a3c62] sm:p-7"
                >
                  <div>
                    <span
                      className={`grid size-11 place-items-center rounded-2xl ${
                        tone === "violet"
                          ? "bg-[#eee8fa] text-[#6140ad] dark:bg-[#322646] dark:text-[#c6abff]"
                          : tone === "green"
                            ? "bg-[#e7f2eb] text-[#23765a] dark:bg-[#1d382f] dark:text-[#7bdab8]"
                            : "bg-[#fbf0d7] text-[#946718] dark:bg-[#3b3020] dark:text-[#f2c46f]"
                      }`}
                    >
                      <Icon size={20} aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-7 text-lg font-semibold tracking-[-0.03em]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#716a7c] dark:text-[#b8b1c2]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="journeys" className="mx-auto grid max-w-[1320px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <h2 className="max-w-[460px] text-3xl font-semibold leading-tight tracking-[-0.055em] sm:text-4xl">
              Find a journey that meets you where you are.
            </h2>
            <p className="mt-4 max-w-[430px] text-sm leading-6 text-[#716a7c] dark:text-[#b8b1c2]">
              Walk through John. Find your footing in the Psalms. Start with one
              passage and let a path unfold one day at a time.
            </p>
            <Link href="/journeys" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6041b8] dark:text-[#c2a8ff]">
              Explore the journeys <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div
            className="relative overflow-hidden rounded-[2rem] bg-[#eae5f3] p-5 sm:p-8"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(232,225,242,0.94), rgba(245,241,249,0.9)), url('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=86')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute -right-14 -top-16 size-56 rounded-full bg-[#bda8e6]/30 blur-3xl" />
            <div className="relative space-y-3">
              {[
                ["A", "The Gospel of John", "Begin with the Word", "violet"],
                ["B", "Psalms for the Soul", "Find language for every season", "green"],
                ["C", "31 Days in Proverbs", "Practice wisdom, one day at a time", "gold"],
              ].map(([letter, title, sub, tone], index) => (
                <Link
                  key={title}
                  href="/journeys"
                  className="flex items-center gap-4 rounded-2xl border border-white/70 bg-white/80 p-4 transition hover:-translate-x-1 hover:bg-white dark:border-white/10 dark:bg-[#292633]/90 dark:hover:bg-[#302d3b]"
                >
                  <span className={`grid size-11 shrink-0 place-items-center rounded-[1rem] text-xs font-bold ${
                    tone === "violet"
                      ? "bg-[#eee8fa] text-[#6041b8]"
                      : tone === "green"
                        ? "bg-[#e7f2eb] text-[#23765a]"
                        : "bg-[#fbf0d7] text-[#946718]"
                  }`}>
                    {letter}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{title}</span>
                    <span className="mt-1 block truncate text-xs text-[#81798a] dark:text-[#b8b1c2]">{sub}</span>
                  </span>
                  <span className="grid size-8 place-items-center rounded-full bg-[#f4f1f8] text-[#6c6379] dark:bg-[#383544] dark:text-[#d4cde0]">
                    {index === 0 ? <Sparkles size={14} aria-hidden="true" /> : <ArrowRight size={14} aria-hidden="true" />}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="why-scripture" className="mx-5 mb-16 overflow-hidden rounded-[2rem] bg-[#211a34] px-6 py-12 text-white sm:mx-8 sm:px-10 lg:mx-auto lg:mb-24 lg:max-w-[1260px] lg:px-14 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="max-w-[650px] text-3xl font-semibold leading-tight tracking-[-0.055em] sm:text-4xl">
                Practice that feels good to come back to.
              </h2>
              <p className="mt-4 max-w-[600px] text-sm leading-6 text-white/65">
                No pressure to be perfect. No streaks that measure your faith.
                Just a thoughtful way to build skill, remember Scripture, and keep showing up.
              </p>
            </div>
            <Link href="/today" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f5efff] px-6 text-sm font-semibold text-[#312147] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Find today&apos;s mission <MoveUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1320px] flex-col gap-5 border-t border-[#ece8f0] px-5 py-7 text-xs text-[#81798a] dark:border-white/10 dark:text-[#a9a2b3] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="brand-mark size-7"><BookOpenText size={14} aria-hidden="true" /></span>
          <span>ScriptType · A little practice for a deeper rhythm.</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/settings" className="hover:text-foreground">Privacy</Link>
          <Link href="/sign-in" className="hover:text-foreground">Your account</Link>
          <span>KJV text · verify local rights before launch</span>
        </div>
      </footer>
    </div>
  );
}
