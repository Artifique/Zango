"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Image as ImageIcon, 
  CheckCircle2, 
  Users, 
  Wallet, 
  Bell,
  Settings, 
  LogOut 
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuthController } from "../../controllers/auth-controller";
import { useRoleController } from "../../controllers/role-controller";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/", badge: null },
  { label: "Transactions", icon: ArrowRightLeft, href: "/transactions", badge: 4 },
  { label: "Captures", icon: ImageIcon, href: "/captures", badge: 2 },
  { label: "Confirmations", icon: CheckCircle2, href: "/confirmations", badge: null },
  { label: "Notifications", icon: Bell, href: "/notifications", badge: 3 },
  { label: "Agents", icon: Users, href: "/agents", badge: null },
  { label: "Mon Solde", icon: Wallet, href: "/balance", badge: null },
  { label: "Paramètres", icon: Settings, href: "/settings", badge: null },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useRoleController();
  const { username, logout } = useAuthController();

  return (
    <aside className="sticky top-0 h-screen w-[240px] shrink-0 border-r border-border bg-charcoal flex flex-col z-30">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
          <Wallet className="w-5 h-5 text-charcoal" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-syne font-bold text-xl tracking-tight">CryptoAgent</span>
          <div className="w-2 h-2 rounded-full bg-teal animate-blink-dot" />
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group",
              pathname === item.href 
                ? "bg-teal/10 text-teal" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                pathname === item.href ? "text-teal" : "text-white/40 group-hover:text-white/80"
              )} />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-amber text-charcoal font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 mt-auto">
        <button
          type="button"
          onClick={logout}
          className="w-full text-left flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-teal to-blue-500 overflow-hidden border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center font-bold text-charcoal">AK</div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{username || "Alex Kapranos"}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal" />
              <p className="text-[10px] text-teal font-mono uppercase tracking-wider">{role.replace("_", " ")}</p>
            </div>
          </div>
          <LogOut className="w-4 h-4 text-white/40 group-hover:text-danger transition-colors" />
        </button>
      </div>
    </aside>
  );
}
