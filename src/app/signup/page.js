"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import GeoPicker from "@/components/GeoPicker";
import SelfieCapture from "@/components/SelfieCapture";
import { btnGhost, btnPrimary, inputClass, labelClass } from "@/components/ui";

export default function SignupPage() {
  const router = useRouter();
  const { state, session, signUp, t } = useStore();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState("staff");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [geoPath, setGeoPath] = useState({});
  const [termStart, setTermStart] = useState("");
  const [termEnd, setTermEnd] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [selfie, setSelfie] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  function generateOtp() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpInput("");
    setError("");
  }

  function handleRoleContinue() {
    setError("");
    setStep(2);
  }

  function handleDetailsContinue(e) {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const digits = phone.replace(/\D/g, "");

    if (!trimmedName || digits.length !== 10 || !geoPath?.assembly) {
      setError(t("signup.needDetails"));
      return;
    }

    if (!selfie) {
      setError(t("signup.needSelfie"));
      return;
    }

    if (role === "staff") {
      if (!termStart || !termEnd) {
        setError(t("signup.termError"));
        return;
      }
      if (termEnd < termStart) {
        setError(t("signup.termError"));
        return;
      }
    }

    generateOtp();
    setStep(3);
  }

  function handleOtpSubmit(e) {
    e.preventDefault();
    if (otpInput.trim() !== generatedOtp) {
      setError(t("signup.otpError"));
      return;
    }

    const digits = phone.replace(/\D/g, "");
    signUp({
      role,
      name: name.trim(),
      phone: digits,
      geoPath,
      termStart: role === "staff" ? termStart : undefined,
      termEnd: role === "staff" ? termEnd : undefined,
    });

    router.replace("/");
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Header and Step Indicator */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">{t("signup.title")}</h1>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className={step === 1 ? "text-teal-800 font-semibold" : ""}>
            {t("signup.roleStep")}
          </span>
          <span>→</span>
          <span className={step === 2 ? "text-teal-800 font-semibold" : ""}>
            {t("signup.detailsStep")}
          </span>
          <span>→</span>
          <span className={step === 3 ? "text-teal-800 font-semibold" : ""}>
            {t("signup.otpStep")}
          </span>
        </div>
      </header>

      {/* STEP 1: Role Selection */}
      {step === 1 ? (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{t("signup.roleTitle")}</h2>
            <p className="mt-1 text-sm text-slate-600">{t("signup.roleLead")}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setRole("staff")}
              className={`rounded-xl border p-4 text-left ${
                role === "staff"
                  ? "border-teal-800 bg-teal-50"
                  : "border-slate-200 bg-white hover:border-teal-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{t("signup.staffCard")}</span>
                <span
                  className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                    role === "staff"
                      ? "border-teal-800 bg-teal-800"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {role === "staff" ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  ) : null}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {t("signup.staffDesc")}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole("public")}
              className={`rounded-xl border p-4 text-left ${
                role === "public"
                  ? "border-teal-800 bg-teal-50"
                  : "border-slate-200 bg-white hover:border-teal-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{t("signup.publicCard")}</span>
                <span
                  className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                    role === "public"
                      ? "border-teal-800 bg-teal-800"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {role === "public" ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  ) : null}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {t("signup.publicDesc")}
              </p>
            </button>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleRoleContinue}
              className={`w-full ${btnPrimary}`}
            >
              {t("signup.continue")}
            </button>
          </div>
        </div>
      ) : null}

      {/* STEP 2: Details */}
      {step === 2 ? (
        <form
          onSubmit={handleDetailsContinue}
          className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{t("signup.detailsTitle")}</h2>
            <p className="mt-1 text-sm text-slate-600">{t("signup.detailsLead")}</p>
          </div>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <div className="space-y-3">
            <label className="block">
              <span className={labelClass}>{t("signup.name")} *</span>
              <input
                type="text"
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                required
              />
            </label>

            <label className="block">
              <span className={labelClass}>{t("signup.phone")} *</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                className={inputClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="9876543210"
                required
              />
            </label>

            <div>
              <span className={labelClass}>{t("admin.assembly")} *</span>
              <GeoPicker
                nodes={state.geoNodes}
                value={geoPath}
                onChange={setGeoPath}
                stopAt={role === "staff" ? "assembly" : null}
                requiredThrough="assembly"
                t={t}
              />
            </div>

            {role === "staff" ? (
              <div className="grid gap-3 sm:grid-cols-2 pt-1 border-t border-slate-100">
                <label className="block">
                  <span className={labelClass}>{t("signup.termStart")} *</span>
                  <input
                    type="date"
                    className={inputClass}
                    value={termStart}
                    onChange={(e) => setTermStart(e.target.value)}
                    required
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>{t("signup.termEnd")} *</span>
                  <input
                    type="date"
                    className={inputClass}
                    value={termEnd}
                    onChange={(e) => setTermEnd(e.target.value)}
                    required
                  />
                </label>
              </div>
            ) : null}

            <div className="pt-2 border-t border-slate-100">
              <SelfieCapture t={t} photo={selfie} onPhotoChange={setSelfie} />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep(1);
              }}
              className={btnGhost}
            >
              {t("signup.back")}
            </button>
            <button type="submit" className={`flex-1 ${btnPrimary}`}>
              {t("signup.continue")}
            </button>
          </div>
        </form>
      ) : null}

      {/* STEP 3: OTP Verification */}
      {step === 3 ? (
        <form
          onSubmit={handleOtpSubmit}
          className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{t("signup.otpTitle")}</h2>
            <p className="mt-1 text-sm text-slate-600">{t("signup.otpLead")}</p>
          </div>

          {/* POC OTP Box */}
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-teal-950">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              {t("signup.pocOtpBox")}
            </p>
            <div className="my-2 font-mono text-3xl font-bold tracking-widest text-teal-900">
              {generatedOtp}
            </div>
            <p className="text-xs text-teal-800/90 leading-relaxed">
              {t("signup.pocOtpNote")}
            </p>
          </div>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <label className="block">
            <span className={labelClass}>{t("signup.otpLabel")} *</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              className={`${inputClass} font-mono text-lg tracking-widest text-center`}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              autoFocus
              required
            />
          </label>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={generateOtp}
              className="text-xs text-teal-800 hover:underline"
            >
              {t("signup.resend")}
            </button>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep(2);
              }}
              className={btnGhost}
            >
              {t("signup.back")}
            </button>
            <button type="submit" className={`flex-1 ${btnPrimary}`}>
              {t("signup.submit")}
            </button>
          </div>
        </form>
      ) : null}

      {/* Login and Admin Links */}
      <div className="flex flex-col items-center gap-2 pt-2 text-center text-xs text-slate-500">
        <p>
          {t("signup.hasAccountPrompt")}{" "}
          <Link href="/login" className="font-medium text-teal-800 hover:underline">
            {t("signup.loginLink")}
          </Link>
        </p>
        <Link
          href="/admin"
          className="text-xs text-slate-500 hover:text-teal-800 underline"
        >
          {t("signup.adminLink")} →
        </Link>
      </div>
    </div>
  );
}
