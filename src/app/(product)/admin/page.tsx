"use client";

import { useAuth } from "@/components/app-providers";
import { BookOpenText, CircleCheck, Compass, FileClock, Flag, Plus, ShieldCheck, UsersRound } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const { user, firebaseConfigured } = useAuth();
  const [message, setMessage] = useState("");

  if (!user || !firebaseConfigured) {
    return (
      <div className="mx-auto max-w-[1080px] float-in">
        <div className="mb-7 text-center">
          <h1 className="page-title">Access denied</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Admin studio requires a signed-in Firebase account with staff privileges.
          </p>
        </div>
        <Link href="/sign-in" className="button-primary mt-6">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1080px] float-in">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Content studio</div>
          <h1 className="page-title mt-2">Scripture, thoughtfully published.</h1>
        </div>
        <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-primary/20 bg-accent px-3 text-xs font-semibold text-accent-foreground">
          <ShieldCheck size={12} aria-hidden="true" /> Build support
        </span>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Published verses", value: "20", icon: BookOpenText },
          { label: "Sample journeys", value: "5", icon: Compass },
          { label: "Open safety reports", value: "0", icon: Flag },
          { label: "Admin audit events", value: "0", icon: FileClock },
        ].map(({ label, value, icon: Icon }) => (
          <article key={label} className="surface-card p-card">
            <Icon size={17} className="text-primary" aria-hidden="true" />
            <div className="mt-5 text-2xl font-semibold">{value}</div>
            <p className="mt-1 text-[10px] text-muted-foreground">{label}</p>
          </article>
        ))}
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.65fr]">
        <section className="surface-card p-card sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Publishing queue</h2>
            <button type="button" onClick={() => setMessage("New drafts require a staff-authenticated Firebase admin role.")} className="inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-[10px] font-semibold hover:bg-muted">
              <Plus size={12} aria-hidden="true" /> New draft
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["Psalm 119:105", "Daily verse", "Reviewed"],
              ["Gospel of John", "Journey", "Draft"],
              ["Proverbs 3:5–6", "Daily verse", "Rights review"],
            ].map(([title, type, status]) => (
              <div key={title} className="flex items-center gap-3 rounded-xl border p-3">
                <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary"><BookOpenText size={15} aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold">{title}</span>
                  <span className="mt-0.5 block text-[9px] text-muted-foreground">{type}</span>
                </span>
                <span className="rounded-full bg-muted px-2 py-1 text-[9px] font-semibold text-muted-foreground">{status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-card sm:p-7">
          <h2 className="text-sm font-semibold">Operations</h2>
          <div className="mt-5 space-y-2">
            {[
              [UsersRound, "User support", "Role-gated"],
              [Flag, "Safety reports", "Moderation queue"],
              [CircleCheck, "Audit log", "Immutable server events"],
            ].map(([Icon, title, detail]) => (
              <button key={String(title)} type="button" onClick={() => setMessage(`${title} requires an authorized staff session and audited server workflow.`)} className="flex min-h-14 w-full items-center gap-3 rounded-xl border px-3 text-left hover:bg-muted">
                <Icon size={15} className="text-primary" aria-hidden="true" />
                <span>
                  <span className="block text-xs font-semibold">{String(title)}</span>
                  <span className="mt-0.5 block text-[9px] text-muted-foreground">{String(detail)}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {message && <p role="status" className="mt-5 rounded-xl border bg-card px-4 py-3 text-xs text-muted-foreground">{message}</p>}

      <p className="mt-5 text-[10px] leading-5 text-muted-foreground">
        Admin functionality is limited in this build. Production publishing and user management require role claims, server validation, audit events, and independent authorization.
      </p>
    </div>
  );
}