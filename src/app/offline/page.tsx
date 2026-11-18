import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <section className="surface-card w-full max-w-md p-6 text-center sm:p-8">
        <p className="eyebrow text-primary">Offline mode</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">You can keep practicing.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Your saved lessons and device progress are available. Account results will sync when your connection returns.
        </p>
        <Link href="/today" className="button-primary mt-6">
          Open ScriptType
        </Link>
      </section>
    </main>
  );
}
