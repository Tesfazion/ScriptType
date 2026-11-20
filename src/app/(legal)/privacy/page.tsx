"use client";

import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[720px] px-5 py-12 sm:py-16">
      <Link href="/" className="mb-8 inline-flex items-center gap-3">
        <BrandMark size="sm" priority />
        <span className="text-sm font-semibold">ScriptType</span>
      </Link>
      <h1 className="page-title mt-4">Privacy choices</h1>
      <p className="mt-2 text-xs text-muted-foreground">Last updated: 19 November 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-foreground/90">
        <section>
          <h2 className="text-base font-semibold">1. Data we keep</h2>
          <p className="mt-2">
            ScriptType keeps practice progress, streaks, completed lessons, reflections, and preferences. Without an account, this data stays on your device in browser storage. With a Firebase account, it can sync across devices.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">2. Data we do not collect</h2>
          <p className="mt-2">
            Your typing input is not sent to analytics or AI by default. Journal entries stay on this device in this build. If you explicitly request an AI reflection, the verse and reflection text are sent to AI for that response. If you use the assistant, your question, recent chat turns, and the current section label are sent to AI. ScriptType does not save assistant chat history to your account. Do not include private journal entries or sensitive personal information in AI prompts.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">3. Your choices</h2>
          <p className="mt-2">
            You can use ScriptType entirely without signing in. Account sync begins only after you sign in. AI features require a separate, explicit action before text is sent. You can delete local progress and reflections from Settings. You can sign out to stop syncing.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">4. Account data</h2>
          <p className="mt-2">
            Account sign-in stores your email and optional display name. Account-linked progress is stored securely in the cloud. You can request deletion of your account data by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">5. Children</h2>
          <p className="mt-2">
            ScriptType is intended for general audiences. Group features require moderation and age/privacy controls and are not yet open in this build.
          </p>
        </section>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        Questions? See our <Link href="/terms" className="underline hover:text-foreground">terms of use</Link>.
      </p>
    </main>
  );
}