"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import { useStore } from "@/lib/store";
import { areaName, formatPath } from "@/lib/geo";
import { formatPhone } from "@/components/ui";

export default function HomePage() {
  const { state, role, inArea } = useStore();
  const { contacts, volunteers, appointments, visits, requests, geoNodes } =
    state;
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(todayISO());
  }, []);
  const pinned = contacts.filter((c) => c.pinned);
  const upcomingVisits = today
    ? visits.filter((v) => v.date >= today)
    : [];

  if (role === "public") {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Constituency desk</h1>
          <p className="mt-1 text-sm text-slate-600">
            Register as a volunteer or send a development request. Travel
            notices for MLA visits appear below.
          </p>
        </header>
        <VisitList visits={upcomingVisits} geoNodes={geoNodes} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/volunteers/register"
            className="rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-700"
          >
            <p className="font-medium">Volunteer registration</p>
            <p className="mt-1 text-sm text-slate-600">
              Sign up directly through this application.
            </p>
          </Link>
          <Link
            href="/requests/new"
            className="rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-700"
          >
            <p className="font-medium">Request for MLA</p>
            <p className="mt-1 text-sm text-slate-600">
              Report an issue or request development in your area.
            </p>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Centralized contact desk</h1>
        <p className="mt-1 text-sm text-slate-600">
          All office contacts live here — searchable by phone, geography, and
          designation.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Contacts" value={contacts.length} hint="One store" />
        <StatCard
          label="Volunteers"
          value={volunteers.length}
          hint={`${volunteers.filter((v) => v.status === "pending").length} pending`}
        />
        <StatCard
          label="Appointments"
          value={appointments.length}
          hint="Meetings & follow-ups"
        />
        <StatCard
          label="Open requests"
          value={requests.filter((r) => r.status === "open").length}
        />
      </div>
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Travel notifications
        </h2>
        {upcomingVisits.length === 0 ? (
          <p className="text-sm text-slate-500">No upcoming MLA visits.</p>
        ) : (
          upcomingVisits.map((v) => {
            const notified = contacts.filter((c) =>
              inArea(c.geoPath, v.areaId),
            ).length;
            const volN = volunteers.filter((c) =>
              inArea(c.geoPath, v.areaId),
            ).length;
            return (
              <div
                key={v.id}
                className="rounded-xl border border-amber-200 bg-amber-50 p-4"
              >
                <p className="font-medium text-amber-950">
                  MLA visit · {v.date} · {areaName(geoNodes, v.areaId)}
                </p>
                <p className="mt-1 text-sm text-amber-900">{v.message}</p>
                <p className="mt-2 text-xs text-amber-800">
                  Notifies {notified} contacts and {volN} volunteers in this
                  area.
                </p>
              </div>
            );
          })
        )}
      </section>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Pinned contacts
          </h2>
          <Link href="/contacts" className="text-sm text-teal-800 underline">
            Open contacts
          </Link>
        </div>
        {pinned.length === 0 ? (
          <p className="text-sm text-slate-500">No pinned contacts yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {pinned.map((c) => (
              <li key={c.id} className="px-4 py-3">
                <Link href={`/contacts/${c.id}`} className="font-medium hover:underline">
                  {c.name}
                </Link>
                <p className="text-sm text-slate-600">
                  {formatPhone(c.phone)} · {c.designation}
                </p>
                <p className="text-xs text-slate-500">
                  {formatPath(geoNodes, c.geoPath)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function VisitList({ visits, geoNodes }) {
  if (visits.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        No MLA travel notices right now.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {visits.map((v) => (
        <div
          key={v.id}
          className="rounded-xl border border-amber-200 bg-amber-50 p-4"
        >
          <p className="font-medium text-amber-950">
            MLA visiting {areaName(geoNodes, v.areaId)} on {v.date}
          </p>
          <p className="mt-1 text-sm text-amber-900">{v.message}</p>
        </div>
      ))}
    </div>
  );
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
