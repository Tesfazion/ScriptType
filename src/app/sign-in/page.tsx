"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, CircleUserRound, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import {
  createAccount,
  sendPasswordResetEmail,
  signInWithEmail,
  signInWithGoogle,
} from "@/lib/auth";
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
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  function goGuest() {
    localStorage.setItem("scripttype-device-mode", "1");
    router.push("/today");
  }

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

  async function submitReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await sendPasswordResetEmail(resetEmail);
      setResetSent(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Password reset could not be completed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-dvh bg-background text-foreground lg:grid-cols-[1.08fr_0.92fr]">
      <section className="mission-glow relative hidden overflow-hidden p-12 text-mission-foreground lg:flex lg:flex-col">
        <div className="absolute -right-24 top-20 size-80 rounded-full border border-white/10" />
        <Link href="/" className="relative flex items-center gap-3">
          <BrandMark size="sm" priority />
          <span className="text-sm font-semibold">ScriptType</span>
        </Link>
        <div className="relative my-auto max-w-[520px]">
          <p className="eyebrow text-mission-muted">Make a little room</p>
<blockquote className="reading-type mt-5 text-4xl leading-[1.35] tracking-[-0.03em]">
            &ldquo;Thy word is a lamp unto my feet, and a light unto my path.&rdquo;
          </blockquote>
          <p className="mt-4 text-xs text-white/50">Psalm 119:105 · KJV</p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[["Daily", "mission"], ["Quiet", "progress"], ["Private", "reflection"]].map(
              ([lead, tail]) => (
                <div key={lead} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="text-sm font-semibold">{lead}</div>
                  <div className="mt-1 text-[10px] text-white/45">{tail}</div>
                </div>
              ),
            )}
          </div>
        </div>
        <p className="relative text-xs text-mission-muted">Scripture text: KJV · Rights review required before public audio/content launch.</p>
      </section>

      <section className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[420px]">
          <Link href="/" className="mb-10 flex items-center gap-3 lg:hidden">
            <BrandMark size="sm" />
            <span className="text-sm font-semibold">ScriptType</span>
          </Link>
          {user ? (
            <div className="surface-card p-6 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-accent-foreground"><Check size={20} aria-hidden="true" /></span>
              <h1 className="page-title mt-5">You&apos;re signed in.</h1>
              <p className="mt-2 text-sm text-muted-foreground">Your next verse is waiting.</p>
              <Link href="/today" className="button-primary mt-6">
                Continue to today
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow text-primary">
                    {mode === "sign-in" ? "Welcome back" : "Begin your account"}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em]">
                    {mode === "sign-in" ? "Sign in." : "Create account."}
                  </h1>
                </div>
                <button type="button" onClick={() => setMode(mode === "sign-in" ? "create" : "sign-in")} className="button-quiet mb-1 min-h-10 text-xs text-primary">
                  {mode === "sign-in" ? "Create account" : "Sign in"}
                </button>
              </div>

              {!firebaseConfigured && (
                <div className="mt-4 rounded-control bg-muted/30 p-4 text-sm leading-5 text-muted-foreground">
                  <div className="flex items-center gap-2.5">
                    <LockKeyhole size={15} className="shrink-0" aria-hidden="true" />
                    <span className="font-medium">Firebase is not configured.</span>
                  </div>
                  <p className="mt-2 ml-[23px] text-xs">
                    Account sign-in is temporarily unavailable. You can still use ScriptType locally — progress stays on this device.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={goGuest}
                className="button-primary mt-6 w-full min-h-11 text-sm font-semibold"
                disabled={!firebaseConfigured && !user}
              >
                Continue without an account
              </button>

              {firebaseConfigured && (
                <>
                  <button type="button" onClick={googleSignIn} disabled={submitting} className="button-secondary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50">
                    <CircleUserRound size={17} aria-hidden="true" /> Continue with Google
                  </button>

                  <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <span className="h-px flex-1 bg-border" /> or use email <span className="h-px flex-1 bg-border" />
                  </div>
                </>
              )}

              <form onSubmit={submit} className="space-y-4">
                {mode === "create" && (
                  <label className="block text-xs font-semibold">
                    Name
                    <input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} autoComplete="name" className="field-control mt-2 w-full px-4 text-sm font-normal" />
                  </label>
                )}
                <label className="block text-xs font-semibold">
                  Email
                  <span className="relative block">
                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" className="field-control mt-2 w-full pl-11 pr-4 text-sm font-normal" />
                  </span>
                </label>
                <label className="block text-xs font-semibold">
                  Password
                  <span className="relative block">
                    <LockKeyhole size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete={mode === "create" ? "new-password" : "current-password"} className="field-control mt-2 w-full pl-11 pr-12 text-sm font-normal" />
                    <button type="button" onClick={() => setShowPassword((shown) => !shown)} className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring" aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </span>
                </label>
                {message && <p role="alert" className="rounded-control border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{message}</p>}
                <button type="submit" disabled={!firebaseConfigured || submitting} className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-50">
                  {submitting ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}
                </button>
              </form>

              <div className="mt-6 border-t pt-5">
                <p className="text-[10px] text-muted-foreground">
                  Your progress stays on this device. Sign in later to sync across phones.
                </p>
              </div>

              <p className="mt-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                By continuing, you agree to ScriptType&apos;s <Link href="/terms" className="underline hover:text-foreground">terms</Link> and <Link href="/privacy" className="underline hover:text-foreground">privacy choices</Link>.
              </p>

              {mode === "sign-in" && !showReset && (
                <button type="button" onClick={() => setShowReset(true)} className="mt-4 w-full text-xs font-semibold text-primary underline underline-offset-2">
                  Forgot password?
                </button>
              )}

              {mode === "sign-in" && showReset && (
                <form onSubmit={submitReset} className="mt-4 space-y-4 rounded-control border border-primary/20 bg-accent p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold">Reset your password</p>
                    {!resetSent && (
                      <button type="button" onClick={() => setShowReset(false)} className="text-xs font-semibold text-primary">Cancel</button>
                    )}
                  </div>
                  {resetSent ? (
                    <p className="text-xs text-muted-foreground">
                      Check {resetEmail} for a password reset email.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold">
                        Email
                        <span className="relative block">
                          <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                          <input type="email" value={resetEmail} onChange={(event) => setResetEmail(event.target.value)} required autoComplete="email" className="field-control mt-2 w-full pl-11 pr-4 text-sm font-normal" />
                        </span>
                      </label>
                      {message && <p role="alert" className="rounded-control border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs text-destructive">{message}</p>}
                      <button type="submit" disabled={!firebaseConfigured || submitting} className="button-primary w-full text-xs disabled:cursor-not-allowed disabled:opacity-50">
                        {submitting ? "Sending…" : "Send reset link"}
                      </button>
                    </div>
                  )}
                </form>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}