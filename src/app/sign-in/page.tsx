"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpenText, Check, CircleUserRound, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { createAccount, signInWithEmail, signInWithGoogle } from "@/lib/auth";
import { useAuth } from "@/components/app-providers";

export default function SignInPage() {
  const router = useRouter();
  const { firebaseConfigured, user } = useAuth();
  const [mode, setMode] = useState<"sign-in" | "create">("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      if (mode === "create") {
        await createAccount(name, email, password);
      } else {
        await signInWithEmail(email, password);
      }
      router.push("/today");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We couldn’t complete that request.");
    } finally {
      setSubmitting(false);
    }
  }

  async function googleSignIn() {
    setSubmitting(true);
    setMessage("");
    try {
      await signInWithGoogle();
      router.push("/today");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Google sign-in could not be completed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-dvh bg-[#f7f5fa] text-[#221c2d] lg:grid-cols-[1.08fr_0.92fr]">
      <section className="mission-glow relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -right-24 top-20 size-80 rounded-full border border-white/10" />
        <Link href="/" className="relative flex items-center gap-3">
          <span className="brand-mark"><BookOpenText size={17} aria-hidden="true" /></span>
          <span className="text-sm font-semibold">ScriptType</span>
        </Link>
        <div className="relative my-auto max-w-[520px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c8b7ed]">Make a little room</p>
          <blockquote className="reading-type mt-5 text-4xl leading-[1.35] tracking-[-0.03em]">
            “Thy word is a lamp unto my feet, and a light unto my path.”
          </blockquote>
          <p className="mt-4 text-xs text-white/50">Psalm 119:105 · KJV</p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[["Daily", "mission"], ["Quiet", "progress"], ["Private", "reflection"]].map(([lead, tail]) => (
              <div key={lead} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <div className="text-sm font-semibold">{lead}</div>
                <div className="mt-1 text-[10px] text-white/45">{tail}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-[10px] text-white/35">Scripture text: KJV · Rights review required before public audio/content launch.</p>
      </section>

      <section className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[420px]">
          <Link href="/" className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="brand-mark"><BookOpenText size={17} aria-hidden="true" /></span>
            <span className="text-sm font-semibold">ScriptType</span>
          </Link>
          {user ? (
            <div className="rounded-[1.7rem] border bg-white p-6 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#e7f2eb] text-[#207256]"><Check size={20} aria-hidden="true" /></span>
              <h1 className="mt-5 text-2xl font-semibold tracking-[-0.05em]">You&apos;re signed in.</h1>
              <p className="mt-2 text-sm text-[#716a7c]">Your next verse is waiting.</p>
              <Link href="/today" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#6041b8] px-5 text-sm font-semibold text-white">
                Continue to today
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7055b2]">
                    {mode === "sign-in" ? "Welcome back" : "Begin your account"}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em]">
                    {mode === "sign-in" ? "Sign in." : "Create account."}
                  </h1>
                </div>
                <button type="button" onClick={() => setMode(mode === "sign-in" ? "create" : "sign-in")} className="mb-1 text-xs font-semibold text-[#6041b8]">
                  {mode === "sign-in" ? "Create account" : "Sign in"}
                </button>
              </div>

              {!firebaseConfigured && (
                <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-[#e7d8b8] bg-[#fff9eb] p-3 text-xs leading-5 text-[#694c1c]">
                  <LockKeyhole size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                  Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* values to enable account sign-in.
                </div>
              )}

              <button type="button" onClick={googleSignIn} disabled={!firebaseConfigured || submitting} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl border bg-white text-sm font-semibold transition hover:bg-[#f7f5fa] disabled:cursor-not-allowed disabled:opacity-50">
                <CircleUserRound size={17} aria-hidden="true" /> Continue with Google
              </button>

              <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.12em] text-[#91899d]">
                <span className="h-px flex-1 bg-[#e5e0ec]" /> or use email <span className="h-px flex-1 bg-[#e5e0ec]" />
              </div>

              <form onSubmit={submit} className="space-y-4">
                {mode === "create" && (
                  <label className="block text-xs font-semibold">
                    Name
                    <input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} autoComplete="name" className="mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm font-normal outline-none focus:border-[#6041b8] focus:ring-4 focus:ring-[#6041b8]/10" />
                  </label>
                )}
                <label className="block text-xs font-semibold">
                  Email
                  <span className="relative block">
                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#91899d]" aria-hidden="true" />
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" className="mt-2 h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm font-normal outline-none focus:border-[#6041b8] focus:ring-4 focus:ring-[#6041b8]/10" />
                  </span>
                </label>
                <label className="block text-xs font-semibold">
                  Password
                  <span className="relative block">
                    <LockKeyhole size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#91899d]" aria-hidden="true" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete={mode === "create" ? "new-password" : "current-password"} className="mt-2 h-12 w-full rounded-xl border bg-white pl-11 pr-12 text-sm font-normal outline-none focus:border-[#6041b8] focus:ring-4 focus:ring-[#6041b8]/10" />
                    <button type="button" onClick={() => setShowPassword((shown) => !shown)} className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center text-[#91899d]" aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </span>
                </label>
                {message && <p role="alert" className="rounded-xl border border-[#b63d4a]/20 bg-[#fbecee] px-4 py-3 text-xs text-[#9a303b]">{message}</p>}
                <button type="submit" disabled={!firebaseConfigured || submitting} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#6041b8] text-sm font-semibold text-white transition hover:bg-[#52369f] disabled:cursor-not-allowed disabled:opacity-50">
                  {submitting ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}
                </button>
              </form>
              <p className="mt-5 text-center text-[10px] leading-4 text-[#91899d]">
                By continuing, you agree to ScriptType&apos;s terms and privacy choices.
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
