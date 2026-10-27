"use client";

import { useState } from "react";
import GeoPicker from "@/components/GeoPicker";
import { DESIGNATIONS } from "@/data/seed";
import { useStore } from "@/lib/store";
import { btnPrimary, inputClass, labelClass } from "@/components/ui";

export default function VolunteerRegisterPage() {
  const { state, addVolunteer, t } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("Community Volunteer");
  const [geoPath, setGeoPath] = useState({ lok_sabha: "ls-1", assembly: "ac-1" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!name.trim() || digits.length !== 10) {
      setError(t("volunteers.needNamePhone"));
      return;
    }
    if (!geoPath.assembly || !geoPath.areaType) {
      setError(t("volunteers.needArea"));
      return;
    }
    addVolunteer({
      name: name.trim(),
      phone: digits,
      designation,
      geoPath,
    });
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-teal-200 bg-teal-50 p-6">
        <h1 className="text-xl font-semibold text-teal-950">{t("volunteers.doneTitle")}</h1>
        <p className="mt-2 text-sm text-teal-900">{t("volunteers.doneLead")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{t("volunteers.registerTitle")}</h1>
        <p className="mt-1 text-sm text-slate-600">{t("volunteers.registerLead")}</p>
      </header>
      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
      >
        <label className="block">
          <span className={labelClass}>{t("volunteers.name")}</span>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <span className={labelClass}>{t("volunteers.phone")}</span>
          <input
            className={inputClass}
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <label className="block">
          <span className={labelClass}>{t("volunteers.role")}</span>
          <input
            className={inputClass}
            list="v-desig"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
          <datalist id="v-desig">
            {DESIGNATIONS.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </label>
        <GeoPicker nodes={state.geoNodes} value={geoPath} onChange={setGeoPath} t={t} />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" className={btnPrimary}>
          {t("volunteers.submit")}
        </button>
      </form>
    </div>
  );
}
