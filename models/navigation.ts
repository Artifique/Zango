export interface NavigationItem {
  label: string;
  href: string;
  icon: any;
  badge?: any;
}

// Importing icons for navigation
import { LayoutDashboard, ArrowRightLeft, Users, History, DollarSign, Bell } from "lucide-react";

export const NAV_ITEMS: NavigationItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Transactions", icon: ArrowRightLeft, href: "/transactions" },
  { label: "Clients", icon: Users, href: "/client" },
  { label: "Taux", icon: DollarSign, href: "/taux" },
  { label: "Historique", icon: History, href: "/historique" },
  { label: "Notifications", icon: Bell, href: "/notifications" },
  { label: "Agents", icon: Users, href: "/agents" },
];

export const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard Overview",
  "/transactions": "Transactions",
  "/client": "Clients",
  "/taux": "Taux de Change",
  "/historique": "Historique des Opérations",
  "/notifications": "Notifications",
  "/agents": "Agents",
};
