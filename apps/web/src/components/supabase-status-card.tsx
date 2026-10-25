import { CheckCircle2, CircleAlert, CircleDashed, XCircle, type LucideIcon } from "lucide-react";
import type { SupabaseStatus } from "@/lib/supabase/status";
import { Card, CardHeader } from "./ui";

const VIEW: Record<SupabaseStatus["state"], { icon: LucideIcon; tone: string; title: string }> = {
  connected: { icon: CheckCircle2, tone: "text-emerald-600", title: "מחובר" },
  not_configured: { icon: CircleDashed, tone: "text-slate-400", title: "עדיין לא הוגדר" },
  invalid: { icon: CircleAlert, tone: "text-amber-600", title: "ההגדרות שגויות" },
  unreachable: { icon: XCircle, tone: "text-red-600", title: "אין חיבור" },
};

export function SupabaseStatusCard({ status }: { status: SupabaseStatus }) {
  const { icon: Icon, tone, title } = VIEW[status.state];
  return (
    <Card>
      <CardHeader title="חיבור למסד הנתונים" subtitle="Supabase – שמירת הנתונים, המסמכים וההתחברות" />
      <div className="space-y-3 px-5 py-4 text-sm">
        <div className="flex items-center gap-2">
          <Icon className={`size-5 ${tone}`} aria-hidden />
          <span className="font-semibold text-slate-900">{title}</span>
          {"host" in status && <span className="text-slate-500 ltr-nums">{status.host}</span>}
        </div>
        {status.state === "connected" && <p className="text-slate-600">החיבור תקין. עדיין לא נוצרו טבלאות – זה יקרה בשלב הבא.</p>}
        {status.state === "not_configured" && (
          <p className="text-slate-600">
            יש להגדיר את כתובת הפרויקט ואת המפתח הציבורי בקובץ <code className="rounded bg-slate-100 px-1">apps/web/.env.local</code>{" "}
            ולהפעיל מחדש את האתר. המערכת ממשיכה לעבוד עם נתוני דוגמה.
          </p>
        )}
        {status.state === "invalid" && (
          <ul className="list-disc space-y-1 ps-5 text-amber-800">
            {status.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
        {status.state === "unreachable" && <p className="text-red-700">{status.detail}</p>}
      </div>
    </Card>
  );
}
