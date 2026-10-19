"use client";

import { useState } from "react";
import { DESIGNATIONS } from "@/data/seed";
import GeoPicker from "@/components/GeoPicker";
import { btnGhost, btnPrimary, inputClass, labelClass } from "@/components/ui";

export default function ContactForm({
  nodes,
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save contact",
}) {
  const [name, setName] = useState(initial?.name || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [designation, setDesignation] = useState(initial?.designation || "");
  const [geoPath, setGeoPath] = useState(
    initial?.geoPath || { lok_sabha: "ls-1", assembly: "ac-1" },
  );
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!name.trim()) return setError("Name is required");
    if (digits.length !== 10) return setError("Enter a 10-digit phone number");
    if (!designation) return setError("Designation is required");
    if (!geoPath.assembly) return setError("Select an assembly constituency");
    if (!geoPath.areaType) return setError("Choose rural or urban");
    setError("");
    onSubmit({
      ...initial,
      name: name.trim(),
      phone: digits,
      designation,
      geoPath,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className={labelClass}>Name</span>
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="block">
        <span className={labelClass}>Phone number</span>
        <input
          className={inputClass}
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="10-digit mobile"
        />
      </label>
      <label className="block">
        <span className={labelClass}>Designation</span>
        <input
          className={inputClass}
          list="designations"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />
        <datalist id="designations">
          {DESIGNATIONS.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
      </label>
      <div>
        <p className="mb-2 text-sm font-medium text-slate-800">Geographical area</p>
        <GeoPicker nodes={nodes} value={geoPath} onChange={setGeoPath} />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="flex gap-2">
        <button type="submit" className={btnPrimary}>
          {submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className={btnGhost} onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
