"use client";

import Link from "next/link";
import { Mascot } from "@/components/mascot";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[720px] px-5 py-16 sm:py-24 text-center">
      <Mascot size="lg" animate className="mx-auto mb-6" />
      <h1 className="page-title text-4xl sm:text-5xl font-semibold tracking-[-0.06em] mb-4">Page not found</h1>
      <p className="mb-8 text-2xl sm:text-3xl text-muted-foreground">
        The page you&rsquo;re looking for doesn&rsquo;t exist.
      </p>
      <div className="max-w-sm mx-auto border rounded-lg bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Return to <Link href="/" className="font-semibold underline">ScriptType</Link> or go to
          <Link href="/sign-in" className="font-semibold underline ml-2">sign in</Link>.
        </p>
      </div>
    </main>
  );
}