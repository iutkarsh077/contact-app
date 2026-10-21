"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatPath } from "@/lib/geo";
import { btnGhost, formatPhone } from "@/components/ui";

export default function VolunteersPage() {
  const { state, setVolunteerStatus, t } = useStore();

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t("volunteers.title")}</h1>
          <p className="mt-1 text-sm text-slate-600">{t("volunteers.lead")}</p>
        </div>
        <Link href="/volunteers/register" className="text-sm text-teal-800 underline">
          {t("volunteers.openForm")}
        </Link>
      </div>
      <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {state.volunteers.map((v) => (
          <li key={v.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
            <div>
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
    </div>
  );
}
