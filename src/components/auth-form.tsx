"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Mode = "register" | "login" | "verify" | "reset";
type Props = { mode: Mode };

const titles: Record<Mode, string> = { register: "Create your Ruthie profile", login: "Welcome back", verify: "Verify your email", reset: "Reset your password" };

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState("");
  const [resetStage, setResetStage] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  useEffect(() => {
    const queryEmail = new URLSearchParams(window.location.search).get("email");
    if (queryEmail) setEmail(queryEmail);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(""); setMessage(""); setDevCode("");
    const form = new FormData(event.currentTarget);
    const payload: Record<string, string> = Object.fromEntries([...form.entries()].map(([key, value]) => [key, String(value)]));
    if (mode === "verify" || (mode === "reset" && resetStage)) payload.code = code;
    const endpoint = mode === "register" ? "/api/auth/register"
      : mode === "login" ? "/api/auth/login"
      : mode === "verify" ? "/api/auth/verify-email"
      : resetStage ? "/api/auth/password-reset" : "/api/auth/password-reset/request";
    const method = "POST";
    try {
      const response = await fetch(endpoint, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? "Something went wrong. Please try again.");
      if (mode === "login") { router.push("/"); router.refresh(); return; }
      if (mode === "verify") { setMessage("Email verified. Your sandbox profile was created."); router.push("/"); router.refresh(); return; }
      if (mode === "register") {
        setMessage(result.message);
        if (result.verification?.code) setDevCode(result.verification.code);
      } else if (mode === "reset" && !code) {
        setMessage(result.message);
        setResetStage(true);
        if (result.developmentCode) { setDevCode(result.developmentCode); setCode(result.developmentCode); }
      } else {
        setMessage(result.message);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn’t complete that request.");
    } finally { setBusy(false); }
  }

  return <main className="flex min-h-screen items-center justify-center px-5 py-10">
    <section className="w-full max-w-[440px]">
      <Link href="/" className="mb-8 flex items-center justify-center gap-3"><img src="/ruthie-mark.svg" alt="" className="h-11 w-11"/><span className="text-lg font-semibold tracking-tight">ruthie<span className="text-[#168265]">bank</span></span></Link>
      <div className="rounded-[28px] border border-[#e7ece8] bg-white p-6 shadow-[0_18px_50px_rgba(18,60,56,.08)] sm:p-9">
        <div className="mb-7"><p className="text-center text-xs font-semibold uppercase tracking-[.16em] text-[#a08449]">Your Money. Your World. Your Future.</p><h1 className="mt-3 text-center text-2xl font-semibold tracking-tight">{titles[mode]}</h1><p className="mt-2 text-center text-sm leading-6 text-[#77847e]">{mode === "register" ? "Start with a secure profile. Financial services are not active in this preview." : mode === "login" ? "Sign in to your Ruthie Bank sandbox profile." : mode === "verify" ? "Enter the six-digit code sent to your email address." : "We’ll guide you through a secure password reset."}</p></div>
        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && <div className="grid grid-cols-2 gap-3"><Field name="firstName" label="First name" autoComplete="given-name"/><Field name="lastName" label="Last name" autoComplete="family-name"/></div>}
          <label className="block text-xs font-medium text-[#52625b]">Email address<input required name="email" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#dfe7e1] bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-[#a5b0aa] focus:border-[#43896d] focus:ring-4 focus:ring-[#43896d]/10" placeholder="you@example.com"/></label>
          {mode === "register" && <label className="block text-xs font-medium text-[#52625b]">Nigerian mobile number<input required name="phone" type="tel" autoComplete="tel" className="mt-1.5 w-full rounded-xl border border-[#dfe7e1] bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-[#a5b0aa] focus:border-[#43896d] focus:ring-4 focus:ring-[#43896d]/10" placeholder="08012345678 or +2348012345678"/></label>}
          {(mode === "verify" || (mode === "reset" && resetStage)) && <label className="block text-xs font-medium text-[#52625b]">Six-digit code<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e=>setCode(e.target.value.replace(/\D/g, "").slice(0,6))} className="mt-1.5 w-full rounded-xl border border-[#dfe7e1] bg-white px-3.5 py-3 text-sm tracking-[.35em] outline-none focus:border-[#43896d] focus:ring-4 focus:ring-[#43896d]/10" placeholder="000000"/></label>}
          {(mode === "register" || mode === "login" || (mode === "reset" && resetStage)) && <Field name="password" label={mode === "reset" ? "New password" : "Password"} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "login" ? 1 : 12} placeholder={mode === "login" ? "Your password" : "At least 12 characters"}/>}
          {mode === "register" && <p className="text-[11px] leading-5 text-[#84918b]">Use at least 12 characters, including uppercase, lowercase, and a number.</p>}
          {error && <p role="alert" className="rounded-xl bg-[#fff0ed] px-3.5 py-3 text-xs leading-5 text-[#9e4032]">{error}</p>}
          {message && <p role="status" className="rounded-xl bg-[#edf6f0] px-3.5 py-3 text-xs leading-5 text-[#28684d]">{message}</p>}
          {devCode && <div className="rounded-xl border border-[#eadfbe] bg-[#fffaf0] p-3.5"><p className="text-[11px] font-semibold text-[#725d2c]">Local development code</p><p className="mt-1 font-mono text-xl tracking-[.3em] text-[#544522]">{devCode}</p><p className="mt-1 text-[10px] leading-4 text-[#88764a]">Only shown because EXPOSE_DEV_OTP is enabled. Never enable this on a shared or production environment.</p></div>}
          <button disabled={busy} className="w-full rounded-xl bg-[#123c38] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1b5548] disabled:opacity-60">{busy ? "Please wait…" : mode === "register" ? "Create account" : mode === "login" ? "Sign in" : mode === "verify" ? "Verify email" : resetStage ? "Update password" : "Send reset instructions"}</button>
        </form>
        {mode === "register" && message && <p className="mt-4 text-center text-xs"><Link className="font-semibold text-[#237458]" href={`/verify-email?email=${encodeURIComponent(email)}`}>Continue to email verification →</Link></p>}
        <div className="mt-6 text-center text-xs text-[#77847e]">{mode === "register" ? <>Already have a profile? <Link className="font-semibold text-[#237458]" href="/login">Sign in</Link></> : mode === "login" ? <><Link className="font-semibold text-[#237458]" href="/password-reset">Forgot password?</Link><span className="mx-2">·</span>New to Ruthie? <Link className="font-semibold text-[#237458]" href="/register">Create profile</Link></> : mode === "verify" ? <>Need a profile? <Link className="font-semibold text-[#237458]" href="/register">Register</Link></> : <>Remember your password? <Link className="font-semibold text-[#237458]" href="/login">Sign in</Link></>}</div>
      </div>
      <p className="mt-5 text-center text-[10px] leading-5 text-[#9aa6a1]">Ruthie Bank is a development sandbox, not a licensed bank. No live banking services are provided.</p>
    </section>
  </main>;
}

function Field({ name, label, type = "text", autoComplete, minLength, placeholder }: { name: string; label: string; type?: string; autoComplete?: string; minLength?: number; placeholder?: string }) {
  return <label className="block text-xs font-medium text-[#52625b]">{label}<input required name={name} type={type} autoComplete={autoComplete} minLength={minLength} placeholder={placeholder} className="mt-1.5 w-full rounded-xl border border-[#dfe7e1] bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-[#a5b0aa] focus:border-[#43896d] focus:ring-4 focus:ring-[#43896d]/10"/></label>;
}
