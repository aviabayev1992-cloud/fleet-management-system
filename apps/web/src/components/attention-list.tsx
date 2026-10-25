import { FileText, Truck, User } from "lucide-react";
import { describeDaysUntil } from "@fleet/shared";
import type { AttentionItem } from "@/lib/dashboard";
import { StatusBadge } from "./ui";

const dateFormatter = new Intl.DateTimeFormat("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" });

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return dateFormatter.format(new Date(y!, m! - 1, d!));
}

function OwnerIcon({ type }: { type: AttentionItem["ownerType"] }) {
  const Icon = type === "truck" ? Truck : User;
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
      <Icon className="size-4" aria-hidden />
    </span>
  );
}

export function AttentionList({ items }: { items: AttentionItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-5 py-10 text-center text-slate-500">
        <FileText className="size-8 text-slate-300" aria-hidden />
        <p>כל המסמכים בתוקף. אין מה לטפל כרגע.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop / tablet: table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-start text-xs font-medium text-slate-500">
              <th scope="col" className="px-5 py-3 text-start font-medium">שייך ל</th>
              <th scope="col" className="px-5 py-3 text-start font-medium">מסמך</th>
              <th scope="col" className="px-5 py-3 text-start font-medium">תאריך תפוגה</th>
              <th scope="col" className="px-5 py-3 text-start font-medium">זמן שנותר</th>
              <th scope="col" className="px-5 py-3 text-start font-medium">סטטוס</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <OwnerIcon type={item.ownerType} />
                    <div>
                      <div className="font-medium text-slate-900">{item.ownerLabel}</div>
                      <div className="text-xs text-slate-500">
                        {item.ownerType === "truck" ? <span className="ltr-nums">{item.ownerDetail}</span> : item.ownerDetail}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-700">{item.documentLabel}</td>
                <td className="px-5 py-3 text-slate-700">
                  <span className="ltr-nums">{formatDate(item.expiresOn)}</span>
                </td>
                <td className={`px-5 py-3 ${item.days < 0 ? "font-medium text-red-700" : "text-slate-700"}`}>
                  {describeDaysUntil(item.days)}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 px-4 py-3">
            <OwnerIcon type={item.ownerType} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium text-slate-900">{item.documentLabel}</span>
                <StatusBadge status={item.status} />
              </div>
              <div className="mt-0.5 text-sm text-slate-600">{item.ownerLabel}</div>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <span className="ltr-nums">{formatDate(item.expiresOn)}</span>
                <span aria-hidden>·</span>
                <span className={item.days < 0 ? "font-medium text-red-700" : undefined}>{describeDaysUntil(item.days)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
