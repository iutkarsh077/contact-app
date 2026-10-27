"use client";

import { useState } from "react";
import GeoPicker from "@/components/GeoPicker";
import { useStore } from "@/lib/store";
import { areaName } from "@/lib/geo";
import { btnGhost, btnPrimary, cardClass, emptyClass, inputClass, labelClass } from "@/components/ui";

export default function VisitsPage() {
  const { state, addVisit, deleteVisit, inArea, t } = useStore();
  const [geoPath, setGeoPath] = useState({ lok_sabha: "ls-1", assembly: "ac-1" });
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function deepest(geo) {
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
    for (const k of order) if (geo[k]) return geo[k];
    return "";
  }

  function onSubmit(e) {
    e.preventDefault();
    const areaId = deepest(geoPath);
    if (!areaId || !date || !message.trim()) {
      setError(t("visits.required"));
      return;
    }
    addVisit({ geoPath, areaId, date, message: message.trim() });
    setMessage("");
    setError("");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{t("visits.title")}</h1>
        <p className="mt-1 text-sm text-slate-600">{t("visits.lead")}</p>
      </header>
      <form
        onSubmit={onSubmit}
        className={`${cardClass} space-y-3`}
      >
        <GeoPicker nodes={state.geoNodes} value={geoPath} onChange={setGeoPath} t={t} />
        <label className="block">
          <span className={labelClass}>{t("visits.date")}</span>
          <input
            type="date"
            className={inputClass}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="block">
          <span className={labelClass}>{t("visits.message")}</span>
          <textarea
            className={inputClass}
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" className={btnPrimary}>
          {t("visits.publish")}
        </button>
      </form>
      {state.visits.length === 0 ? (
        <p className={emptyClass}>{t("visits.empty")}</p>
      ) : (
      <ul className="space-y-3">
        {state.visits.map((v) => {
          const n = state.contacts.filter((c) => inArea(c.geoPath, v.areaId)).length;
          const vol = state.volunteers.filter((c) => inArea(c.geoPath, v.areaId)).length;
          return (
            <li key={v.id} className={cardClass}>
              <p className="font-medium">
                {v.date} · {areaName(state.geoNodes, v.areaId)}
              </p>
              <p className="mt-1 text-sm text-slate-700">{v.message}</p>
              <p className="mt-2 text-xs text-slate-500">
                {t("visits.reaches", { contacts: n, volunteers: vol })}
              </p>
              <button
                type="button"
                className={`${btnGhost} mt-3`}
                onClick={() => deleteVisit(v.id)}
              >
                {t("visits.remove")}
              </button>
            </li>
          );
        })}
      </ul>
      )}
    </div>
  );
}
