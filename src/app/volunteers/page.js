"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatPath } from "@/lib/geo";
import { btnGhost, emptyClass, formatPhone, listShellClass, textLinkClass } from "@/components/ui";

export default function VolunteersPage() {
  const { state, setVolunteerStatus, t } = useStore();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <header>
          <h1 className="text-2xl font-semibold">{t("volunteers.title")}</h1>
          <p className="mt-1 text-sm text-slate-600">{t("volunteers.lead")}</p>
        </header>
        <Link href="/volunteers/register" className={textLinkClass}>
          {t("volunteers.openForm")}
        </Link>
      </div>
      {state.volunteers.length === 0 ? (
        <p className={emptyClass}>{t("volunteers.empty")}</p>
      ) : (
        <ul className={listShellClass}>
          {state.volunteers.map((v) => (
            <li key={v.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="font-medium">{v.name}</p>
                <p className="text-sm text-slate-600">
                  {formatPhone(v.phone)} · {v.designation || t("volunteers.fallbackRole")}
                </p>
                <p className="text-xs text-slate-500">
                  {formatPath(state.geoNodes, v.geoPath)}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                  {t(`status.${v.status}`)}
                </p>
              </div>
              {v.status === "pending" ? (
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => setVolunteerStatus(v.id, "accepted")}
                >
                  {t("volunteers.accept")}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
