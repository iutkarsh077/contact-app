"use client";

import { useMemo, useState } from "react";
import GeoPicker from "@/components/GeoPicker";
import StatCard from "@/components/StatCard";
import { useStore } from "@/lib/store";
import { areaName } from "@/lib/geo";

export default function StatsPage() {
  const { state, inArea } = useStore();
  const [geo, setGeo] = useState({ lok_sabha: "ls-1" });
  const areaId = deepest(geo);

  const stats = useMemo(() => {
    const contacts = state.contacts.filter((c) => inArea(c.geoPath, areaId));
    const volunteers = state.volunteers.filter((v) => inArea(v.geoPath, areaId));
    const appointments = state.appointments.filter((a) => {
      if (a.contactId) {
        const c = state.contacts.find((x) => x.id === a.contactId);
        return c ? inArea(c.geoPath, areaId) : inArea(a.geoPath, areaId);
      }
      return inArea(a.geoPath, areaId);
    });
    const requests = state.requests.filter((r) => inArea(r.geoPath, areaId));
    return {
      contacts: contacts.length,
      pinned: contacts.filter((c) => c.pinned).length,
      volunteers: volunteers.length,
      pendingVol: volunteers.filter((v) => v.status === "pending").length,
      appointments: appointments.length,
      openRequests: requests.filter((r) => r.status === "open").length,
    };
  }, [state, areaId, inArea]);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Area-wise statistics</h1>
        <p className="mt-1 text-sm text-slate-600">
          Pick an administrative level. Counts include that area and everything
          under it.
        </p>
      </header>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <GeoPicker nodes={state.geoNodes} value={geo} onChange={setGeo} allowEmpty />
      </div>
      <p className="text-sm text-slate-600">
        Showing: {areaId ? areaName(state.geoNodes, areaId) : "Entire seed geography"}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Contacts" value={stats.contacts} hint={`${stats.pinned} pinned`} />
        <StatCard
          label="Volunteers"
          value={stats.volunteers}
          hint={`${stats.pendingVol} pending`}
        />
        <StatCard label="Appointments" value={stats.appointments} />
        <StatCard label="Open local requests" value={stats.openRequests} />
      </div>
    </div>
  );
}

function deepest(geo) {
  const order = [
    "panchayat_ward",
    "village",
    "gram_panchayat",
    "block_tehsil",
    "locality",
    "municipal_ward",
    "municipality",
    "assembly",
    "lok_sabha",
  ];
  for (const k of order) if (geo[k]) return geo[k];
  return "";
}
