import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "התראות" };

export default function Page() {
  return <ComingSoon title="התראות" description="כאן תוכלו לראות ולהגדיר התראות לפני שפג תוקף של מסמך." />;
}
