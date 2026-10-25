import type { LucideIcon } from "lucide-react";

const TONES = {
  blue: "bg-brand-50 text-brand-600",
  green: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  tone: keyof typeof TONES;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 ltr-nums">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      </div>
      <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${TONES[tone]}`}>
        <Icon className="size-5" aria-hidden />
      </span>
    </div>
  );
}
