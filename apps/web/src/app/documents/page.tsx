import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "מסמכים" };

export default function Page() {
  return <ComingSoon title="מסמכים" description="כאן יוצגו כל המסמכים של המשאיות והנהגים, עם אפשרות להעלות ולצלם מסמכים מהטלפון." />;
}
