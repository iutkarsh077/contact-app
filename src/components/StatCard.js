export default function StatCard({ label, value, hint }) {
  return (
    <div className="flex h-full min-h-30 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm group-hover:border-teal-700">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900">
        {value}
      </p>
      {hint ? <p className="mt-auto pt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
