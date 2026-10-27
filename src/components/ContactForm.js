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
  submitLabel,
  t,
}) {
  const [name, setName] = useState(initial?.name || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [designation, setDesignation] = useState(initial?.designation || "");
  const [geoPath, setGeoPath] = useState(
    initial?.geoPath || { lok_sabha: "ls-1", assembly: "ac-1" },
  );
  const [error, setError] = useState("");

  function label(key, fallback) {
    if (!t) return fallback;
    return t(key);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!name.trim()) return setError(label("contactForm.nameRequired", "Name is required"));
    if (digits.length !== 10)
      return setError(label("contactForm.phoneRequired", "Enter a 10-digit phone number"));
    if (!designation)
      return setError(label("contactForm.designationRequired", "Designation is required"));
    if (!geoPath.assembly)
      return setError(label("contactForm.assemblyRequired", "Select an assembly constituency"));
    if (!geoPath.areaType)
      return setError(label("contactForm.areaTypeRequired", "Choose rural or urban"));
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
        <span className={labelClass}>{label("contactForm.name", "Name")}</span>
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="block">
        <span className={labelClass}>{label("contactForm.phone", "Phone number")}</span>
        <input
          className={inputClass}
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={label("contactForm.phonePlaceholder", "10-digit mobile")}
        />
      </label>
      <label className="block">
        <span className={labelClass}>{label("contactForm.designation", "Designation")}</span>
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
        <p className={labelClass}>
          {label("contactForm.geo", "Geographical area")}
        </p>
        <GeoPicker nodes={nodes} value={geoPath} onChange={setGeoPath} t={t} />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="submit" className={btnPrimary}>
          {submitLabel || label("contactForm.save", "Save contact")}
        </button>
        {onCancel ? (
          <button type="button" className={btnGhost} onClick={onCancel}>
            {label("contactForm.cancel", "Cancel")}
          </button>
        ) : null}
      </div>
    </form>
  );
}
