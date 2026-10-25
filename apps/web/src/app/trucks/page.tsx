import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "משאיות" };

export default function Page() {
  return <ComingSoon title="משאיות" description="כאן תוכלו להוסיף, לערוך ולחפש משאיות, ולראות את כל הפרטים והמסמכים של כל משאית." />;
}
