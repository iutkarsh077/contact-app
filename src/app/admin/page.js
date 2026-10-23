"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatPath } from "@/lib/geo";
import {
  btnGhost,
  btnPrimary,
  formatDate,
  formatPhone,
  inputClass,
  labelClass,
} from "@/components/ui";

export default function AdminPage() {
  const {
    state,
    adminSession,
    adminLogin,
    adminLogout,
    verifyAccount,
    locale,
    t,
  } = useStore();

  const [email, setEmail] = useState("admin@poc.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    setError("");
    const success = adminLogin(email, password);
    if (!success) {
      setError(t("admin.loginError"));
    }
  }

  // Not signed in as admin: show login form
  if (!adminSession) {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">{t("admin.loginTitle")}</h1>
          <p className="text-sm text-slate-600">{t("admin.lead")}</p>
        </header>

        <form
          onSubmit={handleLogin}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
        >
          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <label className="block">
            <span className={labelClass}>{t("admin.email")} *</span>
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className={labelClass}>{t("admin.password")} *</span>
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          <div className="rounded-lg border border-teal-200 bg-teal-50/70 p-3 text-xs text-teal-900">
            {t("admin.pocNote")}
          </div>

          <div className="flex gap-2 pt-2">
            <Link href="/signup" className={`flex-1 text-center ${btnGhost}`}>
              {t("admin.backToSignup")}
            </Link>
            <button type="submit" className={`flex-1 ${btnPrimary}`}>
              {t("admin.loginBtn")}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Signed in as admin: manage staff verifications
  const pendingStaff = (state?.accounts || []).filter(
    (a) => a.role === "staff" && a.status === "pending"
  );
  const verifiedStaff = (state?.accounts || []).filter(
    (a) => a.role === "staff" && a.status === "verified"
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{t("admin.title")}</h1>
          <p className="text-xs text-slate-500">
            {t("admin.loginTitle")}: <span className="font-mono text-slate-700">{adminSession.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/signup" className={btnGhost}>
            {t("admin.backToSignup")}
          </Link>
          <button type="button" onClick={adminLogout} className={btnGhost}>
            {t("admin.signOut")}
          </button>
        </div>
      </div>

      {/* Pending Staff Section */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {t("admin.pendingTitle")} ({pendingStaff.length})
          </h2>
        </div>

        {pendingStaff.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            {t("admin.noPending")}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {pendingStaff.map((acc) => (
              <div
                key={acc.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{acc.name}</span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                      {t("admin.pendingBadge")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {formatPhone(acc.phone)} · {formatPath(state.geoNodes, acc.geoPath)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t("admin.term")}: {acc.termStart} → {acc.termEnd} · {t("admin.created")}: {formatDate(acc.createdAt, locale)}
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => verifyAccount(acc.id)}
                    className={btnPrimary}
                  >
                    {t("admin.verifyBtn")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Verified Staff Section */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {t("admin.verifiedTitle")} ({verifiedStaff.length})
          </h2>
        </div>

        {verifiedStaff.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            {t("admin.noVerified")}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {verifiedStaff.map((acc) => (
              <div
                key={acc.id}
                className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{acc.name}</span>
                    <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-medium text-teal-800">
                      {t("admin.verifiedBadge")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {formatPhone(acc.phone)} · {formatPath(state.geoNodes, acc.geoPath)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t("admin.term")}: {acc.termStart} → {acc.termEnd}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
