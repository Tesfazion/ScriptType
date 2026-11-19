"use client";

import Link from "next/link";
import { BookOpenText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[720px] px-5 py-12 sm:py-16">
      <Link href="/" className="mb-8 inline-flex items-center gap-3">
        <span className="brand-mark"><BookOpenText size={17} aria-hidden="true" /></span>
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
            We do not read the text you type for analytics or AI training. Reflections are private notes stored locally or with your account. We do not sell personal data.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">3. Your choices</h2>
          <p className="mt-2">
            You can use ScriptType entirely without signing in. You can delete local progress and reflections from Settings. You can sign out to stop syncing.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">4. Account data</h2>
          <p className="mt-2">
            Firebase sign-in stores your email and optional display name. Account-linked progress is stored in Firestore. You can request deletion of your account data through Firebase or by contacting us.
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