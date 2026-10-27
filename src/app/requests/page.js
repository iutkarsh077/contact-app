"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatPath } from "@/lib/geo";
import { btnGhost, emptyClass, formatPhone, listShellClass, textLinkClass } from "@/components/ui";

export default function RequestsPage() {
  const { state, setRequestStatus, t } = useStore();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <header>
          <h1 className="text-2xl font-semibold">{t("requests.title")}</h1>
          <p className="mt-1 text-sm text-slate-600">{t("requests.lead")}</p>
        </header>
        <Link href="/requests/new" className={textLinkClass}>
          {t("requests.publicForm")}
        </Link>
      </div>
      {state.requests.length === 0 ? (
        <p className={emptyClass}>{t("requests.empty")}</p>
      ) : (
        <ul className={listShellClass}>
          {state.requests.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-start justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium">{r.name}</p>
                <p className="text-sm text-slate-600">{formatPhone(r.phone)}</p>
                <p className="text-xs text-slate-500">
                  {formatPath(state.geoNodes, r.geoPath)}
                </p>
                <p className="mt-2 text-sm text-slate-800">{r.issue}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                  {t(`status.${r.status}`)}
                </p>
              </div>
              {r.status === "open" ? (
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => setRequestStatus(r.id, "reviewed")}
                >
                  {t("requests.markReviewed")}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
