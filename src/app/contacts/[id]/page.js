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
  formatDate,
  formatPhone,
  inputClass,
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
  } = useStore();
  const contact = state.contacts.find((c) => c.id === id);
  const notes = state.notes.filter((n) => n.contactId === id);
  const appts = state.appointments.filter((a) => a.contactId === id);
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState("");

  if (!contact) {
    return <p className="text-sm text-slate-500">Contact not found.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">
            <Link href="/contacts" className="underline">
              Contacts
            </Link>
          </p>
          <h1 className="text-2xl font-semibold">
            {contact.pinned ? "📌 " : ""}
            {contact.name}
          </h1>
          <p className="text-slate-700">
            {formatPhone(contact.phone)} · {contact.designation}
          </p>
          <p className="text-sm text-slate-500">
            {formatPath(state.geoNodes, contact.geoPath)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btnGhost} onClick={() => togglePin(contact.id)}>
            {contact.pinned ? "Unpin" : "Pin important"}
          </button>
          <button type="button" className={btnGhost} onClick={() => setEditing((v) => !v)}>
            {editing ? "Close edit" : "Edit"}
          </button>
          <button
            type="button"
            className={btnGhost}
            onClick={() => {
              if (confirm("Delete this contact?")) {
                deleteContact(contact.id);
                router.push("/contacts");
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {editing ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <ContactForm
            nodes={state.geoNodes}
            initial={contact}
            submitLabel="Update contact"
            onCancel={() => setEditing(false)}
            onSubmit={(data) => {
              upsertContact(data);
              setEditing(false);
            }}
          />
        </div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Notes</h2>
        <p className="mb-3 text-sm text-slate-600">
          Past interactions and commitments for this contact.
        </p>
        <form
          className="mb-4 flex gap-2"
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
            placeholder="Add an interaction or commitment"
          />
          <button type="submit" className={btnPrimary}>
            Add
          </button>
        </form>
        {notes.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
            No notes yet. History for this contact will appear here.
          </p>
        ) : (
          <ul className="space-y-2">
            {notes.map((n) => (
              <li key={n.id} className="rounded-lg border border-slate-100 p-3">
                <p className="text-sm">{n.text}</p>
                <div className="mt-1 flex justify-between text-xs text-slate-500">
                  <span>{formatDate(n.createdAt)}</span>
                  <button type="button" onClick={() => deleteNote(n.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Appointments</h2>
            <p className="text-sm text-slate-600">
              Meetings and scheduled follow-ups for this contact.
            </p>
          </div>
          <Link
            href={`/appointments?contactId=${contact.id}`}
            className="text-sm text-teal-800 underline"
          >
            Schedule
          </Link>
        </div>
        {appts.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
            No appointments yet. Schedule a meeting from Appointments.
          </p>
        ) : (
          <ul className="space-y-2">
            {appts.map((a) => (
              <li key={a.id} className="rounded-lg border border-slate-100 p-3">
                <p className="font-medium">{a.title}</p>
                <p className="text-sm text-slate-600">{formatDate(a.datetime)}</p>
                {a.documentName ? (
                  <p className="text-xs text-slate-500">Document: {a.documentName}</p>
                ) : null}
                <button
                  type="button"
                  className="mt-1 text-xs text-red-700"
                  onClick={() => deleteAppointment(a.id)}
                >
                  Cancel
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
    <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
      <ContactDetailInner />
    </Suspense>
  );
}
