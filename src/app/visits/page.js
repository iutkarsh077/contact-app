"use client";

import { useState } from "react";
import GeoPicker from "@/components/GeoPicker";
import { useStore } from "@/lib/store";
import { areaName } from "@/lib/geo";
import { btnGhost, btnPrimary, inputClass, labelClass } from "@/components/ui";

export default function VisitsPage() {
  const { state, addVisit, deleteVisit, inArea } = useStore();
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
      setError("Choose an area, date, and message");
      return;
    }
    addVisit({ geoPath, areaId, date, message: message.trim() });
    setMessage("");
    setError("");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Travel notifications</h1>
        <p className="mt-1 text-sm text-slate-600">
          Notify contacts and volunteers in an area when the MLA plans to visit.
          In this POC, notices appear in the app (not SMS).
        </p>
      </header>
      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
      >
        <GeoPicker nodes={state.geoNodes} value={geoPath} onChange={setGeoPath} />
        <label className="block">
          <span className={labelClass}>Visit date</span>
          <input
            type="date"
            className={inputClass}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Message</span>
          <textarea
            className={inputClass}
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" className={btnPrimary}>
          Publish notice
        </button>
      </form>
      <ul className="space-y-3">
        {state.visits.map((v) => {
          const n = state.contacts.filter((c) => inArea(c.geoPath, v.areaId)).length;
          const vol = state.volunteers.filter((c) => inArea(c.geoPath, v.areaId)).length;
          return (
            <li key={v.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="font-medium">
                {v.date} · {areaName(state.geoNodes, v.areaId)}
              </p>
              <p className="mt-1 text-sm text-slate-700">{v.message}</p>
              <p className="mt-2 text-xs text-slate-500">
                Reaches {n} contacts and {vol} volunteers in this area.
              </p>
              <button
                type="button"
                className={`${btnGhost} mt-3`}
                onClick={() => deleteVisit(v.id)}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
