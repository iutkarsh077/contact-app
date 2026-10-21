"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DESIGNATIONS } from "@/data/seed";
import GeoPicker from "@/components/GeoPicker";
import { useStore } from "@/lib/store";
import { formatPath } from "@/lib/geo";
import { btnPrimary, formatPhone, inputClass, labelClass } from "@/components/ui";

export default function ContactsPage() {
  const { state, togglePin, inArea, t } = useStore();
  const [q, setQ] = useState("");
  const [designation, setDesignation] = useState("");
  const [geo, setGeo] = useState({ lok_sabha: "ls-1" });

  const areaId = deepestFilter(geo);

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return state.contacts
      .filter((c) => {
        if (query) {
          const digits = query.replace(/\D/g, "");
          const nameHit = c.name.toLowerCase().includes(query);
          const desigHit = c.designation.toLowerCase().includes(query);
          const phoneHit = digits.length > 0 && c.phone.includes(digits);
          if (!nameHit && !desigHit && !phoneHit) return false;
        }
        if (designation && c.designation !== designation) return false;
        if (geo.areaType && c.geoPath.areaType !== geo.areaType) return false;
        if (areaId && !inArea(c.geoPath, areaId)) return false;
        return true;
      })
      .slice()
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || a.name.localeCompare(b.name));
  }, [state.contacts, q, designation, geo, areaId, inArea]);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t("contacts.title")}</h1>
          <p className="mt-1 text-sm text-slate-600">{t("contacts.lead")}</p>
        </div>
        <Link href="/contacts/new" className={btnPrimary}>
          {t("contacts.add")}
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <label className="block">
          <span className={labelClass}>{t("contacts.searchLabel")}</span>
          <input
            className={inputClass}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("contacts.searchPlaceholder")}
          />
        </label>
        <label className="block max-w-sm">
          <span className={labelClass}>{t("contacts.designation")}</span>
          <select
            className={inputClass}
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          >
            <option value="">{t("contacts.allDesignations")}</option>
            {DESIGNATIONS.map((d) => (
              <option key={d} value={d}>
                {t(`designation.${d}`)}
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {t("contacts.geoFilters")}
        </p>
        <GeoPicker nodes={state.geoNodes} value={geo} onChange={setGeo} allowEmpty t={t} />
      </div>

      <p className="text-sm text-slate-500">{t("contacts.count", { count: rows.length })}</p>
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          {t("contacts.empty")}
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {rows.map((c) => (
            <li key={c.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
              <div>
                <Link
                  href={`/contacts/${c.id}`}
                  className="font-medium text-slate-900 hover:underline"
                >
                  {c.pinned ? "📌 " : ""}
                  {c.name}
                </Link>
                <p className="text-sm text-slate-700">
                  {formatPhone(c.phone)} · {c.designation}
                </p>
                <p className="text-xs text-slate-500">
                  {formatPath(state.geoNodes, c.geoPath)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => togglePin(c.id)}
                className="text-xs text-teal-800 underline"
              >
                {c.pinned ? t("contacts.unpin") : t("contacts.pin")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function deepestFilter(geo) {
  const order = [
    "panchayat_ward",
    "village",
    "gram_panchayat",
    "block_tehsil",
    "locality",
    "municipal_ward",
    "municipality",
    "assembly",
    "lok_sabha",
  ];
  for (const k of order) {
    if (geo[k]) return geo[k];
  }
  return "";
}
