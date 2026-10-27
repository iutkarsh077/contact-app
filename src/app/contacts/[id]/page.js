"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import ContactForm from "@/components/ContactForm";
import { useStore } from "@/lib/store";
import { formatPath } from "@/lib/geo";
import {
  btnGhost,
  btnPrimary,
  cardClass,
  emptyClass,
  formatDate,
  formatPhone,
  inputClass,
  textLinkClass,
} from "@/components/ui";

function ContactDetailInner() {
  const { id } = useParams();
  const router = useRouter();
  const {
    state,
    togglePin,
    deleteContact,
    upsertContact,
    addNote,
    deleteNote,
    deleteAppointment,
    t,
    locale,
  } = useStore();
  const contact = state.contacts.find((c) => c.id === id);
  const notes = state.notes.filter((n) => n.contactId === id);
  const appts = state.appointments.filter((a) => a.contactId === id);
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState("");

  if (!contact) {
    return <p className={emptyClass}>{t("contacts.notFound")}</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">
            <Link href="/contacts" className={textLinkClass}>
              {t("nav.contacts")}
            </Link>
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            {contact.pinned ? (
              <span className="text-[11px] font-medium uppercase tracking-wide text-teal-800">
                {t("contacts.pinned")}
              </span>
            ) : null}
            <h1 className="text-2xl font-semibold">{contact.name}</h1>
          </div>
          <p className="text-sm text-slate-600">
            {formatPhone(contact.phone)} · {contact.designation}
          </p>
          <p className="text-sm text-slate-500">
            {formatPath(state.geoNodes, contact.geoPath)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btnGhost} onClick={() => togglePin(contact.id)}>
            {contact.pinned ? t("contacts.unpin") : t("contacts.pinImportant")}
          </button>
          <button type="button" className={btnGhost} onClick={() => setEditing((v) => !v)}>
            {editing ? t("contacts.closeEdit") : t("contacts.edit")}
          </button>
          <button
            type="button"
            className={btnGhost}
            onClick={() => {
              if (confirm(t("contacts.deleteConfirm"))) {
                deleteContact(contact.id);
                router.push("/contacts");
              }
            }}
          >
            {t("contacts.delete")}
          </button>
        </div>
      </div>

      {editing ? (
        <div className={cardClass}>
          <ContactForm
            nodes={state.geoNodes}
            initial={contact}
            submitLabel={t("contacts.update")}
            t={t}
            onCancel={() => setEditing(false)}
            onSubmit={(data) => {
              upsertContact(data);
              setEditing(false);
            }}
          />
        </div>
      ) : null}

      <section className={cardClass}>
        <h2 className="text-lg font-medium">{t("contacts.notes")}</h2>
        <p className="mb-3 text-sm text-slate-600">{t("contacts.notesLead")}</p>
        <form
          className="mb-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (!note.trim()) return;
            addNote(contact.id, note.trim());
            setNote("");
          }}
        >
          <input
            className={inputClass}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("contacts.notePlaceholder")}
          />
          <button type="submit" className={btnPrimary}>
            {t("contacts.addNote")}
          </button>
        </form>
        {notes.length === 0 ? (
          <p className={emptyClass}>{t("contacts.noNotes")}</p>
        ) : (
          <ul className="divide-y divide-slate-100 border-t border-slate-100">
            {notes.map((n) => (
              <li key={n.id} className="py-3">
                <p className="text-sm">{n.text}</p>
                <div className="mt-1 flex justify-between gap-3 text-xs text-slate-500">
                  <span>{formatDate(n.createdAt, locale)}</span>
                  <button
                    type="button"
                    className="text-red-700 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/40"
                    onClick={() => deleteNote(n.id)}
                  >
                    {t("contacts.remove")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={cardClass}>
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium">{t("contacts.appointments")}</h2>
            <p className="text-sm text-slate-600">{t("contacts.appointmentsLead")}</p>
          </div>
          <Link href={`/appointments?contactId=${contact.id}`} className={textLinkClass}>
            {t("contacts.schedule")}
          </Link>
        </div>
        {appts.length === 0 ? (
          <p className={emptyClass}>{t("contacts.noAppointments")}</p>
        ) : (
          <ul className="divide-y divide-slate-100 border-t border-slate-100">
            {appts.map((a) => (
              <li key={a.id} className="py-3">
                <p className="font-medium">{a.title}</p>
                <p className="text-sm text-slate-600">{formatDate(a.datetime, locale)}</p>
                {a.documentName ? (
                  <p className="text-xs text-slate-500">
                    {t("contacts.document", { name: a.documentName })}
                  </p>
                ) : null}
                <button
                  type="button"
                  className="mt-1 text-xs text-red-700 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/40"
                  onClick={() => deleteAppointment(a.id)}
                >
                  {t("contacts.cancel")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default function ContactDetailPage() {
  return (
    <Suspense fallback={<ContactLoading />}>
      <ContactDetailInner />
    </Suspense>
  );
}

function ContactLoading() {
  const { t } = useStore();
  return <p className="text-sm text-slate-500">{t("shell.loading")}</p>;
}
