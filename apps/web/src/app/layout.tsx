import type { Metadata, Viewport } from "next";
import "@fontsource-variable/heebo";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: {
    default: "צי פלוס – ניהול צי רכב",
    template: "%s | צי פלוס",
  },
  description: "מערכת לניהול משאיות, נהגים ומסמכים לחברות הובלה",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-dvh font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
