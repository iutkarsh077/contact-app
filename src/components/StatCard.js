export default function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-xl hover:shadow-md hover:cursor-pointer border border-slate-200 h-full bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <span className="mt-2 text-3xl font-semibold text-slate-900 hover:underline transition-all ease-in-out duration-300">{value}</span>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
