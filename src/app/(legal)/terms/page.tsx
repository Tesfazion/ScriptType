"use client";

import Link from "next/link";
import { BookOpenText } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-[720px] px-5 py-12 sm:py-16">
      <Link href="/" className="mb-8 inline-flex items-center gap-3">
        <span className="brand-mark"><BookOpenText size={17} aria-hidden="true" /></span>
        <span className="text-sm font-semibold">ScriptType</span>
      </Link>
      <h1 className="page-title mt-4">Terms of use</h1>
      <p className="mt-2 text-xs text-muted-foreground">Last updated: 19 November 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-foreground/90">
        <section>
          <h2 className="text-base font-semibold">1. What ScriptType is</h2>
          <p className="mt-2">
            ScriptType is a Scripture-based typing practice app. You use it to build typing skill around passages from the King James Version of the Bible. Progress, streaks, and badges reflect consistency and accuracy, not spiritual worth.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">2. Your account</h2>
          <p className="mt-2">
            You can use ScriptType without an account. Progress stays on the device. When you sign in with Firebase, your progress can sync across devices. You are responsible for keeping your credentials secure.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">3. Content rights</h2>
          <p className="mt-2">
            Scripture text is drawn from the King James Version (1769 edition), which is public-domain text in the United States. Rights may differ in other countries. Audio and licensed content require separate rights review before production distribution.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">4. Acceptable use</h2>
          <p className="mt-2">
            Use ScriptType for lawful personal practice. Do not misuse the service, attempt to access other users&rsquo; data, or interfere with the platform.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">5. No warranty</h2>
          <p className="mt-2">
            ScriptType is provided as-is. We do not guarantee uninterrupted service, data preservation, or that any specific content will remain available.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">6. Changes</h2>
          <p className="mt-2">
            We may update these terms. Continued use after changes means you accept the updated terms.
          </p>
        </section>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        Questions? See our <Link href="/privacy" className="underline hover:text-foreground">privacy choices</Link>.
      </p>
    </main>
  );
}