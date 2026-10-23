"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  btnGhost,
  btnPrimary,
  formatPhone,
  inputClass,
  labelClass,
} from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const { session, login, findAccountByPhone, t } = useStore();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [targetAccount, setTargetAccount] = useState(null);
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

  function handlePhoneSubmit(e) {
    e.preventDefault();
    setError("");

    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError(t("login.needPhone"));
      return;
    }

    const account = findAccountByPhone(digits);
    if (!account) {
      setError(t("login.noAccount"));
      return;
    }

    setTargetAccount(account);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpInput("");
    setStep(2);
  }

  function handleOtpSubmit(e) {
    e.preventDefault();
    setError("");

    if (otpInput.trim() !== generatedOtp) {
      setError(t("login.otpError"));
      return;
    }

    if (!targetAccount) return;
    login(targetAccount.phone);
    router.replace("/");
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">{t("login.title")}</h1>
        <p className="text-sm text-slate-600">{t("login.lead")}</p>
      </header>

      {step === 1 ? (
        <form
          onSubmit={handlePhoneSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
        >
          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <label className="block">
            <span className={labelClass}>{t("login.phone")} *</span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              className={inputClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="9876543210"
              autoFocus
              required
            />
          </label>

          <button type="submit" className={`w-full ${btnPrimary}`}>
            {t("login.continue")}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleOtpSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{t("login.otpTitle")}</h2>
            <p className="mt-1 text-sm text-slate-600">{t("login.otpLead")}</p>
          </div>

          {targetAccount ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
              <span className="font-medium text-slate-800">
                {t("login.loggingInAs", {
                  name: targetAccount.name,
                  role: targetAccount.role === "staff" ? t("shell.staff") : t("shell.public"),
                })}
              </span>
              <span className="block text-slate-500 mt-0.5">
                {formatPhone(targetAccount.phone)}
              </span>
            </div>
          ) : null}

          {/* POC Mock OTP Box */}
          <div className="rounded-xl border border-teal-200 bg-teal-50/80 p-4 text-teal-950">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              {t("login.pocOtpBox")}
            </p>
            <div className="my-2 font-mono text-3xl font-bold tracking-widest text-teal-900">
              {generatedOtp}
            </div>
            <p className="text-xs text-teal-800/90 leading-relaxed">
              {t("login.pocOtpNote")}
            </p>
          </div>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <label className="block">
            <span className={labelClass}>{t("login.otpLabel")} *</span>
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
              {t("login.resend")}
            </button>
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
              {t("login.back")}
            </button>
            <button type="submit" className={`flex-1 ${btnPrimary}`}>
              {t("login.submit")}
            </button>
          </div>
        </form>
      )}

      {/* Signup and Admin Links */}
      <div className="flex flex-col items-center gap-2 pt-2 text-center text-xs text-slate-500">
        <p>
          {t("login.noAccountPrompt")}{" "}
          <Link href="/signup" className="font-medium text-teal-800 hover:underline">
            {t("login.signupLink")}
          </Link>
        </p>
        <Link
          href="/admin"
          className="text-xs text-slate-500 hover:text-teal-800 underline"
        >
          {t("login.adminLink")} →
        </Link>
      </div>
    </div>
  );
}
