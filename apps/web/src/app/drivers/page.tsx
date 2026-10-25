import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "נהגים" };

export default function Page() {
  return <ComingSoon title="נהגים" description="כאן תנהלו את רשימת הנהגים, פרטי קשר, שיבוץ למשאיות ומסמכים אישיים." />;
}
