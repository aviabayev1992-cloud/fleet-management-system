import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "הגדרות" };

export default function Page() {
  return <ComingSoon title="הגדרות" description="כאן תנהלו את פרטי החברה, המשתמשים וההרשאות." />;
}
