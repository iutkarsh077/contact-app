"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import { useStore } from "@/lib/store";
import { areaName, formatPath } from "@/lib/geo";
import { formatPhone } from "@/components/ui";

export default function HomePage() {
  const { state, role, inArea, t } = useStore();
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
  const pendingVol = volunteers.filter((v) => v.status === "pending").length;

  if (role === "public") {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">{t("home.publicTitle")}</h1>
          <p className="mt-1 text-sm text-slate-600">{t("home.publicLead")}</p>
        </header>
        <VisitList visits={upcomingVisits} geoNodes={geoNodes} t={t} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/volunteers/register"
            className="rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-700"
          >
            <p className="font-medium">{t("home.volunteerCard")}</p>
            <p className="mt-1 text-sm text-slate-600">
              {t("home.volunteerCardHint")}
            </p>
          </Link>
          <Link
            href="/requests/new"
            className="rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-700"
          >
            <p className="font-medium">{t("home.requestCard")}</p>
            <p className="mt-1 text-sm text-slate-600">
              {t("home.requestCardHint")}
            </p>
          </Link>
        </div>
      </div>
    );
  }

  return (
      <div className="w-full space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{t("home.staffTitle")}</h1>
        <p className="mt-1 text-sm text-slate-600">{t("home.staffLead")}</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href={"/contacts"}>
          <StatCard
            label={t("home.contacts")}
            value={contacts.length}
            hint={t("home.oneStore")}
          /></Link>
        <Link href={"/volunteers"}>
          <StatCard
            label={t("home.volunteers")}
            value={volunteers.length}
            hint={t("home.pendingCount", { count: pendingVol })}
          /></Link>
        <Link href={"/appointments"}>
          <StatCard
            label={t("home.appointments")}
            value={appointments.length}
            hint={t("home.meetingsHint")}
          /></Link>
        <Link href={"/requests"} className="h-full">
          <StatCard
            label={t("home.openRequests")}
            value={requests.filter((r) => r.status === "open").length}
          />
        </Link>
      </div>
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {t("home.travel")}
        </h2>
        {upcomingVisits.length === 0 ? (
          <p className="text-sm text-slate-500">{t("home.noVisits")}</p>
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
                  {t("home.visitLine", {
                    date: v.date,
                    area: areaName(geoNodes, v.areaId),
                  })}
                </p>
                <p className="mt-1 text-sm text-amber-900">{v.message}</p>
                <p className="mt-2 text-xs text-amber-800">
                  {t("home.notifies", { contacts: notified, volunteers: volN })}
                </p>
              </div>
            );
          })
        )}
      </section>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {t("home.pinned")}
          </h2>
          <Link href="/contacts" className="text-sm text-teal-800 underline">
            {t("home.openContacts")}
          </Link>
        </div>
        {pinned.length === 0 ? (
          <p className="text-sm text-slate-500">{t("home.noPinned")}</p>
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

function VisitList({ visits, geoNodes, t }) {
  if (visits.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        {t("home.noNotices")}
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
            {t("home.visiting", {
              area: areaName(geoNodes, v.areaId),
              date: v.date,
            })}
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
