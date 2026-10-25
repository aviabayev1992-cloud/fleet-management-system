import { Construction } from "lucide-react";
import { Card } from "./ui";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-brand-50 text-brand-600">
          <Construction className="size-6" aria-hidden />
        </span>
        <h2 className="text-lg font-semibold text-slate-900">המסך הזה בבנייה</h2>
        <p className="max-w-md text-sm text-slate-500">{description}</p>
      </Card>
    </div>
  );
}
