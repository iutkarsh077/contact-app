"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import GeoPicker from "@/components/GeoPicker";
import { useStore } from "@/lib/store";
import { formatPath } from "@/lib/geo";
import {
  btnGhost,
  btnPrimary,
  fileToDocument,
  formatDate,
  inputClass,
  labelClass,
} from "@/components/ui";

function AppointmentsInner() {
  const params = useSearchParams();
  const presetContact = params.get("contactId") || "";
  const { state, upsertAppointment, deleteAppointment, t, locale } = useStore();
  const [title, setTitle] = useState("");
  const [datetime, setDatetime] = useState("");
  const [contactId, setContactId] = useState(presetContact);
  const [geoPath, setGeoPath] = useState({ lok_sabha: "ls-1", assembly: "ac-1" });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !datetime) {
      setError(t("appointments.required"));
      return;
    }
    try {
      const doc = await fileToDocument(file);
      const contact = state.contacts.find((c) => c.id === contactId);
      upsertAppointment({
        title: title.trim(),
        datetime: new Date(datetime).toISOString(),
        contactId,
        geoPath: contact?.geoPath || geoPath,
        ...doc,
      });
      setTitle("");
      setDatetime("");
      setFile(null);
      setError("");
    } catch (err) {
      if (err.message === "POC limit: attach a file smaller than 400 KB") {
        setError(t("appointments.fileTooLarge"));
      } else if (err.message === "Could not read file") {
        setError(t("appointments.fileReadError"));
      } else {
        setError(err.message);
      }
    }
  }

  const sorted = [...state.appointments].sort(
    (a, b) => new Date(a.datetime) - new Date(b.datetime),
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{t("appointments.title")}</h1>
        <p className="mt-1 text-sm text-slate-600">{t("appointments.lead")}</p>
      </header>

      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
      >
        <label className="block">
          <span className={labelClass}>{t("appointments.fieldTitle")}</span>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="block">
          <span className={labelClass}>{t("appointments.datetime")}</span>
          <input
            type="datetime-local"
            className={inputClass}
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
          />
        </label>
        <label className="block">
          <span className={labelClass}>{t("appointments.linked")}</span>
          <select
            className={inputClass}
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
          >
            <option value="">{t("appointments.noContact")}</option>
            {state.contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.phone}
              </option>
            ))}
          </select>
        </label>
        {!contactId ? (
          <div>
            <p className="mb-2 text-xs font-medium text-slate-600">
              {t("appointments.meetingArea")}
            </p>
            <GeoPicker nodes={state.geoNodes} value={geoPath} onChange={setGeoPath} t={t} />
          </div>
        ) : null}
        <label className="block">
          <span className={labelClass}>{t("appointments.attach")}</span>
          <input
            type="file"
            className="text-sm"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" className={btnPrimary}>
          {t("appointments.schedule")}
        </button>
      </form>

      <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {sorted.length === 0 ? (
          <li className="p-6 text-sm text-slate-500">{t("appointments.empty")}</li>
        ) : (
          sorted.map((a) => {
            const contact = state.contacts.find((c) => c.id === a.contactId);
            return (
              <li key={a.id} className="px-4 py-3">
                <p className="font-medium">{a.title}</p>
                <p className="text-sm text-slate-600">{formatDate(a.datetime, locale)}</p>
                <p className="text-xs text-slate-500">
                  {contact
                    ? t("appointments.with", { name: contact.name })
                    : formatPath(state.geoNodes, a.geoPath)}
                </p>
                {a.documentName ? (
                  a.documentDataUrl ? (
                    <a
                      href={a.documentDataUrl}
                      download={a.documentName}
                      className="text-xs text-teal-800 underline"
                    >
                      {a.documentName}
                    </a>
                  ) : (
                    <p className="text-xs text-slate-500">
                      {t("contacts.document", { name: a.documentName })}
                    </p>
                  )
                ) : null}
                <button
                  type="button"
                  className={`${btnGhost} mt-2`}
                  onClick={() => deleteAppointment(a.id)}
                >
                  {t("appointments.cancel")}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <AppointmentsInner />
    </Suspense>
  );
}

function PageLoading() {
  const { t } = useStore();
  return <p className="text-sm text-slate-500">{t("shell.loading")}</p>;
}
