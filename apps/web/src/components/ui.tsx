import type { ExpiryStatus } from "@fleet/shared";
import { EXPIRY_STATUS_LABELS } from "@fleet/shared";

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>
  );
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const STATUS_STYLES: Record<ExpiryStatus, string> = {
  expired: "bg-red-50 text-red-700 ring-red-600/20",
  critical: "bg-orange-50 text-orange-700 ring-orange-600/20",
  warning: "bg-amber-50 text-amber-800 ring-amber-600/20",
  valid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

export function StatusBadge({ status }: { status: ExpiryStatus }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {EXPIRY_STATUS_LABELS[status]}
    </span>
  );
}
