const SEGMENTS = [
  { key: "active", label: "פעילות", color: "bg-emerald-500" },
  { key: "maintenance", label: "בטיפול", color: "bg-amber-500" },
  { key: "inactive", label: "מושבתות", color: "bg-slate-400" },
] as const;

export function FleetStatus({ counts }: { counts: Record<(typeof SEGMENTS)[number]["key"], number> }) {
  const total = SEGMENTS.reduce((sum, s) => sum + counts[s.key], 0) || 1;
  return (
    <div className="px-5 py-4">
      <div className="flex h-3 overflow-hidden rounded-full bg-slate-100" role="img" aria-label="התפלגות סטטוס משאיות">
        {SEGMENTS.map((s) => (
          <div key={s.key} className={s.color} style={{ width: `${(counts[s.key] / total) * 100}%` }} />
        ))}
      </div>
      <ul className="mt-4 space-y-3">
        {SEGMENTS.map((s) => (
          <li key={s.key} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-700">
              <span className={`size-2.5 rounded-full ${s.color}`} aria-hidden />
              {s.label}
            </span>
            <span className="font-semibold text-slate-900 ltr-nums">{counts[s.key]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
