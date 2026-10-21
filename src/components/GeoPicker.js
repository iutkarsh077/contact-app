"use client";

import { useEffect } from "react";
import { GEO_LEVELS, RURAL_LEVELS, URBAN_LEVELS, childrenOf } from "@/lib/geo";
import { inputClass, labelClass } from "@/components/ui";

export default function GeoPicker({
  nodes,
  value = {},
  onChange,
  showLokSabha = true,
  allowEmpty = false,
  requiredThrough = null,
  t,
}) {
  function labelFor(levelId, fallback) {
    if (!t) return fallback;
    const translated = t(`geo.${levelId}`);
    return translated === `geo.${levelId}` ? fallback : translated;
  }
  const areaType = value.areaType || "";

  function setField(level, id) {
    const next = { ...value, [level]: id || "" };
    const order = GEO_LEVELS.map((l) => l.id);
    const idx = order.indexOf(level);
    for (const later of order.slice(idx + 1)) {
      delete next[later];
    }
    if (level === "lok_sabha") {
      delete next.assembly;
      delete next.areaType;
    }
    if (level === "assembly") {
      delete next.areaType;
      for (const later of [...RURAL_LEVELS, ...URBAN_LEVELS]) {
        delete next[later.id];
      }
    }
    onChange(next);
  }

  function setAreaType(type) {
    onChange({
      lok_sabha: value.lok_sabha,
      assembly: value.assembly,
      areaType: type,
    });
  }

  function selectFor(level) {
    const meta = GEO_LEVELS.find((l) => l.id === level);
    const parentLevel = meta.parent;
    const parentId = parentLevel === null ? null : value[parentLevel] || null;
    if (parentLevel && !parentId) return [];
    return childrenOf(nodes, parentId, level);
  }

  useEffect(() => {
    if (allowEmpty) return;
    const next = { ...value };
    let changed = false;

    const lokOptions = nodes.filter((n) => n.level === "lok_sabha");
    if (!next.lok_sabha && lokOptions.length === 1) {
      next.lok_sabha = lokOptions[0].id;
      changed = true;
    }

    if (next.lok_sabha) {
      const assemblies = childrenOf(nodes, next.lok_sabha, "assembly");
      if (!next.assembly && assemblies.length === 1) {
        next.assembly = assemblies[0].id;
        changed = true;
      }
    }

    if (changed) onChange(next);
  }, [allowEmpty, nodes, value, onChange]);

  const ruralReady = areaType === "rural";
  const urbanReady = areaType === "urban";
  const hasAssembly = Boolean(value.assembly);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {showLokSabha ? (
        <Field
          label={labelFor("lok_sabha", "Lok Sabha Constituency")}
          value={value.lok_sabha || ""}
          options={nodes.filter((n) => n.level === "lok_sabha")}
          onChange={(id) => setField("lok_sabha", id)}
          allowEmpty={allowEmpty}
          required={requiredThrough === "lok_sabha"}
          t={t}
        />
      ) : null}
      <Field
        label={labelFor("assembly", "Assembly Constituency")}
        value={value.assembly || ""}
        options={selectFor("assembly")}
        onChange={(id) => setField("assembly", id)}
        disabled={!value.lok_sabha}
        allowEmpty={allowEmpty}
        t={t}
      />
      <div className="sm:col-span-2">
        <span className={labelClass}>
          {t ? t("geo.areaType") : "Area type"}
        </span>
        <div className="flex flex-wrap gap-2">
          {["rural", "urban"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setAreaType(type)}
              disabled={!hasAssembly}
              className={`rounded-full px-3 py-1 text-sm ${
                areaType === type
                  ? "bg-teal-800 text-white"
                  : "border border-slate-300 text-slate-700"
              } disabled:opacity-40`}
            >
              {t
                ? t(`geo.${type}`)
                : type === "rural"
                  ? "Rural areas"
                  : "Urban areas"}
            </button>
          ))}
        </div>
        {!hasAssembly ? (
          <p className="mt-1 text-xs text-slate-500">
            {t
              ? t("geo.unlock")
              : "Choose an assembly constituency to unlock rural and urban areas."}
          </p>
        ) : null}
      </div>
      {ruralReady
        ? RURAL_LEVELS.map((lvl) => (
            <Field
              key={lvl.id}
              label={labelFor(lvl.id, lvl.label)}
              value={value[lvl.id] || ""}
              options={selectFor(lvl.id)}
              onChange={(id) => setField(lvl.id, id)}
              disabled={!value[lvl.parent]}
              allowEmpty
              required={requiredThrough === lvl.id}
              t={t}
            />
          ))
        : null}
      {urbanReady
        ? URBAN_LEVELS.map((lvl) => (
            <Field
              key={lvl.id}
              label={
                lvl.optional
                  ? t
                    ? t("geo.optional", { label: labelFor(lvl.id, lvl.label) })
                    : `${lvl.label} (optional)`
                  : labelFor(lvl.id, lvl.label)
              }
              value={value[lvl.id] || ""}
              options={selectFor(lvl.id)}
              onChange={(id) => setField(lvl.id, id)}
              disabled={!value[lvl.parent]}
              allowEmpty
              t={t}
            />
          ))
        : null}
    </div>
  );
}

function Field({
  label,
  value,
  options,
  onChange,
  disabled,
  allowEmpty = true,
  required,
  t,
}) {
  return (
    <label className="block">
      <span className={labelClass}>
        {label}
        {required ? " *" : ""}
      </span>
      <select
        className={inputClass}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">
          {allowEmpty
            ? t
              ? t("geo.any")
              : "Any / not set"
            : t
              ? t("geo.select")
              : "Select…"}
        </option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </label>
  );
}
