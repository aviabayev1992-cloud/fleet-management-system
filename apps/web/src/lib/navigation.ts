import { Bell, FileText, LayoutDashboard, Settings, Truck, Users, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "מסך ראשי", icon: LayoutDashboard },
  { href: "/trucks", label: "משאיות", icon: Truck },
  { href: "/drivers", label: "נהגים", icon: Users },
  { href: "/documents", label: "מסמכים", icon: FileText },
  { href: "/alerts", label: "התראות", icon: Bell },
  { href: "/settings", label: "הגדרות", icon: Settings },
];
