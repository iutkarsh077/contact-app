"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LOCALES } from "@/i18n";
import { useStore } from "@/lib/store";

const STAFF_NAV = [
  { href: "/", labelKey: "nav.dashboard" },
  { href: "/contacts", labelKey: "nav.contacts" },
  { href: "/appointments", labelKey: "nav.appointments" },
  { href: "/volunteers", labelKey: "nav.volunteers" },
  { href: "/stats", labelKey: "nav.stats" },
  { href: "/visits", labelKey: "nav.visits" },
  { href: "/requests", labelKey: "nav.requests" },
];

const PUBLIC_NAV = [
  { href: "/", labelKey: "nav.home" },
  { href: "/volunteers/register", labelKey: "nav.volunteerRegister" },
  { href: "/requests/new", labelKey: "nav.requestNew" },
];

function isPublicAllowed(pathname) {
  return (
    pathname === "/" ||
    pathname === "/volunteers/register" ||
    pathname === "/requests/new" ||
    pathname === "/signup" ||
    pathname === "/login"
  );
}

function isActivePath(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function localeClass(active) {
  return `rounded-full px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/40 ${
    active
      ? "bg-teal-800 text-white"
      : "border border-slate-300 text-slate-600 hover:border-teal-700"
  }`;
}

function sidebarLinkClass(active) {
  return `rounded-lg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/50 ${
    active ? "bg-teal-800 text-white" : "text-slate-300 hover:bg-slate-800"
  }`;
}

function chipClass(active) {
  return `shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/40 ${
    active
      ? "bg-teal-800 text-white"
      : "border border-slate-200 text-slate-700"
  }`;
}

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const chipRowRef = useRef(null);

  const {
    ready,
    session,
    adminSession,
    adminLogout,
    signOut,
    reset,
    locale,
    setLocale,
    t,
  } = useStore();

  const role = session?.role || null;
  const isPendingStaff = role === "staff" && session?.status === "pending";
  const isVerifiedStaff = role === "staff" && session?.status === "verified";
  const isPublic = role === "public";

  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isSignupPath = pathname === "/signup" || pathname.startsWith("/signup/");
  const isLoginPath = pathname === "/login" || pathname.startsWith("/login/");
  const isAuthPath = isSignupPath || isLoginPath;

  const nav = isVerifiedStaff ? STAFF_NAV : isPublic ? PUBLIC_NAV : [];
  const blocked = isPublic && !isPublicAllowed(pathname);
  const activeNav = nav.find((item) => isActivePath(pathname, item.href));
  const pageTitle = activeNav
    ? t(activeNav.labelKey)
    : isAdminPath
    ? t("admin.title")
    : isSignupPath
    ? t("signup.title")
    : isLoginPath
    ? t("login.title")
    : t("shell.desk");

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (!ready) return;
    if (!session && !isAdminPath && !isAuthPath) {
      router.replace("/signup");
    }
  }, [ready, session, isAdminPath, isAuthPath, router]);

  useEffect(() => {
    const chip = chipRowRef.current?.querySelector("[data-active='true']");
    if (!chip) return;
    chip.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [pathname, role]);

  // Loading state while hydrating store from localStorage
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        <p className="text-sm font-medium">{t("shell.loading")}</p>
      </div>
    );
  }

  // Admin Route Door
  if (isAdminPath) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-teal-800 font-semibold">
              {t("shell.office")}
            </p>
            <p className="text-base font-semibold">{t("admin.title")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="hidden text-xs text-slate-500 sm:inline">
                {t("shell.language")}
              </span>
              {LOCALES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={locale === item.id}
                  onClick={() => setLocale(item.id)}
                  className={localeClass(locale === item.id)}
                >
                  {t(`lang.${item.id}`)}
                </button>
              ))}
            </div>
            {adminSession ? (
              <button
                type="button"
                onClick={adminLogout}
                className="text-xs text-slate-600 hover:text-slate-900 underline"
              >
                {t("shell.signOut")}
              </button>
            ) : (
              <Link
                href="/signup"
                className="text-xs text-slate-600 hover:text-teal-800 underline"
              >
                {t("admin.backToSignup")}
              </Link>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 pb-8 md:p-6">{children}</main>
      </div>
    );
  }

  // Unauthenticated on Signup or Login Page
  if (!session && isAuthPath) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-teal-800 font-semibold">
              {t("shell.office")}
            </p>
            <p className="text-base font-semibold">{t("shell.desk")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="hidden text-xs text-slate-500 sm:inline">
                {t("shell.language")}
              </span>
              {LOCALES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={locale === item.id}
                  onClick={() => setLocale(item.id)}
                  className={localeClass(locale === item.id)}
                >
                  {t(`lang.${item.id}`)}
                </button>
              ))}
            </div>
            {isSignupPath ? (
              <Link
                href="/login"
                className="text-xs text-slate-600 hover:text-teal-800 underline"
              >
                {t("login.title")}
              </Link>
            ) : (
              <Link
                href="/signup"
                className="text-xs text-slate-600 hover:text-teal-800 underline"
              >
                {t("signup.title")}
              </Link>
            )}
            <Link
              href="/admin"
              className="text-xs text-slate-600 hover:text-teal-800 underline"
            >
              {t("shell.admin")}
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 pb-8 md:p-6">{children}</main>
      </div>
    );
  }

  // Unauthenticated on protected route (redirecting)
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        <p className="text-sm font-medium">{t("shell.loading")}</p>
      </div>
    );
  }

  // Pending Staff Waiting Gate
  if (isPendingStaff) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-teal-800 font-semibold">
              {t("shell.office")}
            </p>
            <p className="text-base font-semibold">{t("shell.desk")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-slate-800">
              {session.name}
            </span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
              {t("status.pending")}
            </span>
            <div className="flex items-center gap-1.5">
              {LOCALES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={locale === item.id}
                  onClick={() => setLocale(item.id)}
                  className={localeClass(locale === item.id)}
                >
                  {t(`lang.${item.id}`)}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={signOut}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              {t("shell.signOut")}
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 pb-8 md:p-6">
          <div className="mx-auto max-w-lg space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
            <span className="inline-block rounded-full bg-amber-200/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900">
              {t("shell.waitingTitle")}
            </span>
            <h1 className="text-xl font-semibold text-amber-950">
              {t("shell.waitingTitle")}
            </h1>
            <p className="text-sm text-amber-900">{t("shell.waitingLead")}</p>
            <div className="space-y-1.5 rounded-lg border border-amber-200 bg-white/80 p-4 text-xs text-amber-950">
              <p>
                <span className="font-semibold text-slate-600">
                  {t("signup.name")}:
                </span>{" "}
                {session.name}
              </p>
              <p>
                <span className="font-semibold text-slate-600">
                  {t("signup.phone")}:
                </span>{" "}
                {session.phone}
              </p>
              <p>
                <span className="font-semibold text-slate-600">
                  {t("shell.termDates", {
                    start: session.termStart,
                    end: session.termEnd,
                  })}
                </span>
              </p>
            </div>
            <p className="text-xs leading-relaxed text-amber-900/90">
              {t("shell.waitingNote")}
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Verified Staff and Public Session Views
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="hidden sticky top-0 h-screen w-60 shrink-0 flex-col overflow-y-auto bg-slate-900 text-slate-100 md:flex">
        <div className="border-b border-slate-800 px-4 py-5">
          <p className="text-xs uppercase tracking-wider text-teal-300">
            {t("shell.office")}
          </p>
          <p className="text-lg font-semibold">{t("shell.desk")}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={sidebarLinkClass(active)}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-800 p-3">
          <button
            type="button"
            onClick={signOut}
            className="w-full rounded-lg px-3 py-2 hover:cursor-pointer text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/50"
          >
            {t("shell.signOut")}
          </button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 bg-white">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <p className="font-semibold md:hidden">{pageTitle}</p>
            <div className="flex min-w-0 flex-wrap items-center gap-3 md:ml-auto md:mr-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="hidden text-xs text-slate-500 sm:inline">
                  {t("shell.language")}
                </span>
                {LOCALES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={locale === item.id}
                    onClick={() => setLocale(item.id)}
                    className={localeClass(locale === item.id)}
                  >
                    {t(`lang.${item.id}`)}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-800">
                  {session.name}
                </span>
                {isVerifiedStaff ? (
                  <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-medium text-teal-800">
                    {t("shell.staff")}
                  </span>
                ) : null}
                {/* {isVerifiedStaff ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(t("shell.resetConfirm"))) reset();
                    }}
                    className="text-xs text-slate-500 underline"
                  >
                    {t("shell.reset")}
                  </button>
                ) : null} */}
                {/* <button
                  type="button"
                  onClick={signOut}
                  className="text-xs text-slate-600 hover:text-slate-900 underline"
                >
                  {t("shell.signOut")}
                </button> */}
              </div>
            </div>
          </header>
          <nav
            ref={chipRowRef}
            className="flex gap-2 overflow-x-auto border-b border-slate-200 px-3 py-2 md:hidden"
          >
            {nav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={active ? "true" : undefined}
                  aria-current={active ? "page" : undefined}
                  className={chipClass(active)}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
          {/* <p className="border-b border-slate-200 px-4 py-2 text-[11px] leading-4 text-slate-500 md:hidden">
            {t("shell.pocNote")}
          </p> */}
        </div>
        <main className="flex-1 p-4 pb-8 md:p-6">
          {blocked ? (
            <div className="mx-auto max-w-lg rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
              {t("shell.blocked")}
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
