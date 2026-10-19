"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatPath } from "@/lib/geo";
import { btnGhost, formatPhone } from "@/components/ui";

export default function RequestsPage() {
  const { state, setRequestStatus } = useStore();

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Locals request for MLA</h1>
          <p className="mt-1 text-sm text-slate-600">
            Development and issue requests from people in the constituency.
          </p>
        </div>
        <Link href="/requests/new" className="text-sm text-teal-800 underline">
          Public request form
        </Link>
      </div>
      <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {state.requests.length === 0 ? (
          <li className="p-6 text-sm text-slate-500">No requests yet.</li>
        ) : (
          state.requests.map((r) => (
            <li key={r.id} className="px-4 py-3">
              <p className="font-medium">{r.name}</p>
              <p className="text-sm text-slate-600">{formatPhone(r.phone)}</p>
              <p className="text-xs text-slate-500">
                {formatPath(state.geoNodes, r.geoPath)}
              </p>
              <p className="mt-2 text-sm">{r.issue}</p>
              <p className="mt-1 text-xs uppercase text-slate-500">{r.status}</p>
              {r.status === "open" ? (
                <button
                  type="button"
                  className={`${btnGhost} mt-2`}
                  onClick={() => setRequestStatus(r.id, "reviewed")}
                >
                  Mark reviewed
                </button>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
