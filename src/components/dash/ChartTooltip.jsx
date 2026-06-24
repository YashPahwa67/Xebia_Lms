// custom tooltip for the recharts charts
export function ChartTooltip({ active, payload, label, format }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line bg-white/95 px-3 py-2 shadow-float backdrop-blur">
      {label != null && <p className="mb-1 text-xs font-medium text-slate/70">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2 text-sm font-semibold text-ink">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color || p.fill }} />
          {p.name}: {format ? format(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}
