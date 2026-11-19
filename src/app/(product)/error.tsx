"use client";

import Link from "next/link";
import { Mascot } from "@/components/mascot";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("ScriptType error:", error);

  return (
    <main className="mx-auto max-w-[720px] px-5 py-16 sm:py-24 text-center">
      <Mascot size="lg" animate className="mx-auto mb-6" />
      <h1 className="page-title text-3xl sm:text-4xl font-semibold tracking-[-0.06em] mb-4">
        Something went wrong
      </h1>
      <p className="mb-6 text-lg text-muted-foreground">
        We ran into an unexpected problem. The team has been notified.
      </p>
      <div className="max-w-sm mx-auto border rounded-lg bg-card p-6">
        <p className="text-sm text-muted-foreground">
          <button onClick={reset} className="font-semibold underline hover:text-foreground">
            Try again
          </button>
          {" or "}
          <Link href="/" className="font-semibold underline hover:text-foreground">
            go home
          </Link>
        </p>
      </div>
    </main>
  );
}