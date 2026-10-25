import type { Metadata } from "next";
import { Construction } from "lucide-react";
import { SupabaseStatusCard } from "@/components/supabase-status-card";
import { Card } from "@/components/ui";
import { getSupabaseStatus } from "@/lib/supabase/status";

export const metadata: Metadata = { title: "הגדרות" };

// The connection status must be checked on every visit.
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const status = await getSupabaseStatus();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">הגדרות</h1>
      <SupabaseStatusCard status={status} />
      <Card className="flex items-center gap-3 px-5 py-4 text-sm text-slate-500">
        <Construction className="size-5 shrink-0 text-brand-600" aria-hidden />
        בהמשך יתווספו כאן פרטי החברה, ניהול משתמשים והרשאות.
      </Card>
    </div>
  );
}
