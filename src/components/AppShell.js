"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const STAFF_NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/contacts", label: "Contacts" },
  { href: "/appointments", label: "Appointments" },
  { href: "/volunteers", label: "Volunteers" },
  { href: "/stats", label: "Area statistics" },
  { href: "/visits", label: "Travel notices" },
  { href: "/requests", label: "Local requests" },
];

const PUBLIC_NAV = [
  { href: "/", label: "Home" },
  { href: "/volunteers/register", label: "Volunteer registration" },
  { href: "/requests/new", label: "Request for MLA" },
];

function isPublicAllowed(pathname) {
  return (
    pathname === "/" ||
    pathname === "/volunteers/register" ||
    pathname === "/requests/new"
  );
}

export default function AppShell({ children }) {
  const pathname = usePathname();
  const { role, setRole, reset } = useStore();
  const nav = role === "staff" ? STAFF_NAV : PUBLIC_NAV;
  const blocked = role === "public" && !isPublicAllowed(pathname);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="hidden w-60 shrink-0 flex-col bg-slate-900 text-slate-100 md:flex">
        <div className="border-b border-slate-800 px-4 py-5">
          <p className="text-xs uppercase tracking-wider text-teal-300">
            MLA office
          </p>
          <p className="text-lg font-semibold">Contact desk</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm ${
                  active ? "bg-teal-800 text-white" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="px-4 pb-4 text-[11px] leading-4 text-slate-500">
          POC: data stays in this browser only.
        </p>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <div className="md:hidden">
            <p className="font-semibold">Contact desk</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">View as</span>
            {["staff", "public"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-full px-3 py-1 text-xs capitalize ${
                  role === r
                    ? "bg-teal-800 text-white"
                    : "border border-slate-300 text-slate-600"
                }`}
              >
                {r}
              </button>
            ))}
            {role === "staff" ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Reset all POC data to the sample seed?")) reset();
                }}
                className="text-xs text-slate-500 underline"
              >
                Reset sample data
              </button>
            ) : null}
          </div>
        </header>
        <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1 text-xs"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <main className="flex-1 p-4 md:p-6">
          {blocked ? (
            <div className="mx-auto max-w-lg rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
              This screen is for office staff. Switch to Staff in the header, or
              go to volunteer registration / local request.
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
