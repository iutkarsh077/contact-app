"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    pathname === "/requests/new"
  );
}

function isActivePath(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AppShell({ children }) {
  const pathname = usePathname();
  const chipRowRef = useRef(null);
  const { role, setRole, reset, locale, setLocale, t } = useStore();
  const nav = role === "staff" ? STAFF_NAV : PUBLIC_NAV;
  const blocked = role === "public" && !isPublicAllowed(pathname);
  const activeNav = nav.find((item) => isActivePath(pathname, item.href));
  const pageTitle = activeNav ? t(activeNav.labelKey) : t("shell.desk");

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const chip = chipRowRef.current?.querySelector("[data-active='true']");
    if (!chip) return;
    chip.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [pathname, role]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="hidden w-60 shrink-0 flex-col bg-slate-900 text-slate-100 md:flex">
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
                className={`rounded-lg px-3 py-2 text-sm ${
                  active ? "bg-teal-800 text-white" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
        <p className="px-4 pb-4 text-[11px] leading-4 text-slate-500">
          {t("shell.pocNote")}
        </p>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 bg-white">
          <header className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="font-semibold md:hidden">{pageTitle}</p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="hidden text-xs text-slate-500 sm:inline">
                  {t("shell.language")}
                </span>
                {LOCALES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLocale(item.id)}
                    className={`rounded-full px-3 py-1 text-xs ${
                      locale === item.id
                        ? "bg-teal-800 text-white"
                        : "border border-slate-300 text-slate-600"
                    }`}
                  >
                    {t(`lang.${item.id}`)}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="hidden text-xs text-slate-500 sm:inline">
                  {t("shell.viewAs")}
                </span>
                {["staff", "public"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-full px-3 py-1 text-xs ${
                      role === r
                        ? "bg-teal-800 text-white"
                        : "border border-slate-300 text-slate-600"
                    }`}
                  >
                    {t(`shell.${r}`)}
                  </button>
                ))}
                {role === "staff" ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(t("shell.resetConfirm"))) reset();
                    }}
                    className="text-xs text-slate-500 underline"
                  >
                    {t("shell.reset")}
                  </button>
                ) : null}
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
                  className={`shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm ${
                    active
                      ? "bg-teal-800 text-white"
                      : "border border-slate-200 text-slate-700"
                  }`}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
          <p className="border-b border-slate-200 px-4 py-2 text-[11px] leading-4 text-slate-500 md:hidden">
            {t("shell.pocNote")}
          </p>
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
