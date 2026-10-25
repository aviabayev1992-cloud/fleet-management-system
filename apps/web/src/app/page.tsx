import Link from "next/link";
import { AlertTriangle, Clock, FilePlus2, Info, Truck, UserPlus, Users } from "lucide-react";
import { AttentionList } from "@/components/attention-list";
import { FleetStatus } from "@/components/fleet-status";
import { StatCard } from "@/components/stat-card";
import { Card, CardHeader } from "@/components/ui";
import { getDashboardData } from "@/lib/dashboard";
import { recentActivity } from "@/lib/mock-data";

// Sample data is relative to today's date, so render on every request.
export const dynamic = "force-dynamic";

const QUICK_ACTIONS = [
  { label: "הוספת משאית", icon: Truck },
  { label: "הוספת נהג", icon: UserPlus },
  { label: "העלאת מסמך", icon: FilePlus2 },
];

export default function DashboardPage() {
  const { totals, truckCounts, attention, warningDays } = getDashboardData();
  const today = new Intl.DateTimeFormat("he-IL", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(
    new Date(),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">מסך ראשי</h1>
          <p className="mt-1 text-sm text-slate-500">{today}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p>גרסה ראשונית: המידע במסך הוא נתוני דוגמה בלבד, ויוחלף בנתונים אמיתיים בשלב הבא.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="משאיות" value={totals.trucks} hint={`${totals.activeTrucks} פעילות כעת`} icon={Truck} tone="blue" />
        <StatCard label="נהגים" value={totals.drivers} hint={`${totals.activeDrivers} פעילים`} icon={Users} tone="green" />
        <StatCard label="מסמכים שפג תוקפם" value={totals.expired} hint="דורשים טיפול מיידי" icon={AlertTriangle} tone="red" />
        <StatCard label="יפוגו בקרוב" value={totals.expiringSoon} hint={`ב-${warningDays} הימים הקרובים`} icon={Clock} tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="מסמכים שדורשים טיפול"
            subtitle={`מסמכים שפג תוקפם או שיפוג ב-${warningDays} הימים הקרובים`}
            action={
              <Link href="/documents" className="whitespace-nowrap text-sm font-medium text-brand-600 hover:text-brand-700">
                לכל המסמכים
              </Link>
            }
          />
          <AttentionList items={attention} />
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="מצב הצי" subtitle={`${totals.trucks} משאיות במערכת`} />
            <FleetStatus counts={truckCounts} />
          </Card>

          <Card>
            <CardHeader title="פעולות מהירות" />
            <div className="grid gap-2 p-4">
              {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  disabled
                  title="יתווסף בשלב הבא"
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="size-4 text-slate-500" aria-hidden />
                    {label}
                  </span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">בקרוב</span>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="פעילות אחרונה" />
            <ul className="divide-y divide-slate-100">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 px-5 py-3 text-sm">
                  <span className="text-slate-700">{a.text}</span>
                  <span className="shrink-0 text-xs text-slate-400">{a.when}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
