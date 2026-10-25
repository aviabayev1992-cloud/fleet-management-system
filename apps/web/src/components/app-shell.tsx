"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Truck, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/navigation";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-lg bg-brand-500 text-white">
        <Truck className="size-5" aria-hidden />
      </span>
      <div className="leading-tight">
        <div className="text-base font-bold text-white">צי פלוס</div>
        <div className="text-xs text-slate-400">ניהול צי רכב</div>
      </div>
    </div>
  );
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="ניווט ראשי" className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function UserBadge() {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
      <span className="grid size-9 place-items-center rounded-full bg-slate-700 text-sm font-semibold text-white">מ</span>
      <div className="min-w-0 leading-tight">
        <div className="truncate text-sm font-medium text-white">מנהל המערכת</div>
        <div className="truncate text-xs text-slate-400">הובלות לדוגמה בע״מ</div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-dvh lg:ps-64">
      {/* Desktop sidebar (on the right side, as the page is RTL) */}
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-64 flex-col justify-between bg-sidebar p-4 lg:flex">
        <div className="flex flex-col gap-8">
          <div className="px-2 pt-2">
            <Brand />
          </div>
          <NavLinks pathname={pathname} />
        </div>
        <UserBadge />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between bg-sidebar px-4 lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="פתיחת תפריט"
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="grid size-10 place-items-center rounded-lg text-slate-200 hover:bg-white/10"
        >
          <Menu className="size-6" aria-hidden />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" id="mobile-nav">
          <button
            type="button"
            aria-label="סגירת תפריט"
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 flex w-72 max-w-[85%] flex-col justify-between bg-sidebar p-4 shadow-xl">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <Brand />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="סגירת תפריט"
                  className="grid size-10 place-items-center rounded-lg text-slate-200 hover:bg-white/10"
                >
                  <X className="size-6" aria-hidden />
                </button>
              </div>
              <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
            <UserBadge />
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
