"use client";

import { useState } from "react";
import GeoPicker from "@/components/GeoPicker";
import { useStore } from "@/lib/store";
import { btnPrimary, inputClass, labelClass } from "@/components/ui";

export default function NewRequestPage() {
  const { state, addRequest } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [issue, setIssue] = useState("");
  const [geoPath, setGeoPath] = useState({ lok_sabha: "ls-1", assembly: "ac-1" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!name.trim() || digits.length !== 10 || !issue.trim()) {
      setError("Name, phone, and issue details are required");
      return;
    }
    if (!geoPath.assembly || !geoPath.areaType) {
      setError("Select your area");
      return;
    }
    addRequest({
      name: name.trim(),
      phone: digits,
      issue: issue.trim(),
      geoPath,
    });
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-teal-200 bg-teal-50 p-6">
        <h1 className="text-xl font-semibold text-teal-950">Request submitted</h1>
        <p className="mt-2 text-sm text-teal-900">
          The office can review this development / issue request in the app.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Request for MLA</h1>
        <p className="mt-1 text-sm text-slate-600">
          Ask for development work or report an issue in your area.
        </p>
      </header>
      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
      >
        <label className="block">
          <span className={labelClass}>Your name</span>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <span className={labelClass}>Phone</span>
          <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <GeoPicker nodes={state.geoNodes} value={geoPath} onChange={setGeoPath} />
        <label className="block">
          <span className={labelClass}>Issue or development request</span>
          <textarea
            className={inputClass}
            rows={4}
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" className={btnPrimary}>
          Submit request
        </button>
      </form>
    </div>
  );
}
