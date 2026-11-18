"use client";

import Link from "next/link";
import { CalendarDays, Crown, LockKeyhole, ShieldCheck, Trophy, UsersRound } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-[980px] float-in">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Practice together</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em]">A circle of encouragement.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Invite-only groups, positive challenges, and private progress controls.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-[10px] text-muted-foreground">
          <LockKeyhole size={12} aria-hidden="true" /> Preview mode
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="mission-glow relative overflow-hidden rounded-[2rem] p-6 text-white sm:p-8">
          <div className="absolute -right-16 -top-20 size-64 rounded-full border border-white/10" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c8b7ed]">
              <UsersRound size={13} aria-hidden="true" /> Weekly group challenge
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.05em]">Five quiet mornings</h2>
            <p className="mt-2 max-w-[480px] text-sm leading-6 text-white/60">
              Practice for five days this week and encourage one another toward a consistent, grace-filled rhythm.
            </p>
            <div className="mt-7 grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div key={day} className="text-center">
                  <span className={`mx-auto grid aspect-square max-w-10 place-items-center rounded-xl border text-[10px] ${day <= 3 ? "border-[#78b9a1] bg-[#78b9a1]/20 text-[#9bd8c1]" : "border-white/10 bg-white/[0.04] text-white/35"}`}>
                    {day <= 3 ? "✓" : day}
                  </span>
                </div>
              ))}
            </div>
            <button type="button" disabled className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-xs font-semibold text-[#302047] opacity-80">
              Invite-only groups launching soon
            </button>
          </div>
        </section>

        <aside className="rounded-[1.7rem] border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <ShieldCheck size={15} className="text-growth" aria-hidden="true" /> Community guardrails
          </div>
          <ul className="mt-5 space-y-4 text-xs leading-5 text-muted-foreground">
            {[
              "No public rankings in the MVP.",
              "Private groups require an invite.",
              "Individual progress visibility is explicit.",
              "Reporting and blocking controls are required.",
            ].map((item) => (
              <li key={item} className="flex gap-2.5">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {[
          { icon: UsersRound, title: "Bible study groups", text: "A private place for a church or study circle.", color: "text-primary bg-primary/10" },
          { icon: Trophy, title: "Positive challenges", text: "Shared goals measured with encouragement.", color: "text-[#916b24] bg-[#fbf0d7] dark:bg-[#3b3020] dark:text-[#f2c46f]" },
          { icon: CalendarDays, title: "Monthly rhythm", text: "Seasonal journeys and time-bounded practice.", color: "text-[#207256] bg-[#e6f3ed] dark:bg-[#1d382f] dark:text-[#7bdab8]" },
        ].map(({ icon: Icon, title, text, color }) => (
          <article key={title} className="rounded-[1.5rem] border bg-card p-5">
            <span className={`grid size-10 place-items-center rounded-xl ${color}`}><Icon size={17} aria-hidden="true" /></span>
            <h2 className="mt-5 text-sm font-semibold">{title}</h2>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-dashed p-4 text-xs leading-5 text-muted-foreground">
        <Crown size={15} className="mt-0.5 shrink-0 text-[#916b24]" aria-hidden="true" />
        <p>
          This product preview is intentionally not open to unmoderated interaction. Production group features remain gated behind moderation, reporting, age/privacy, and account controls.
        </p>
      </div>

      <Link href="/sign-in" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-xs font-semibold hover:bg-muted">
        Sign in to prepare for groups
      </Link>
    </div>
  );
}
