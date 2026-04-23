"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Clock, ChevronDown, Sun, Moon } from "lucide-react";
import { useRoleController } from "../../controllers/role-controller";
import { useThemeController } from "../../controllers/theme-controller";
import { Role } from "../../types/crypto";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [time, setTime] = useState("--:--");
  const { role, setRole } = useRoleController();
  const { theme, toggleTheme } = useThemeController();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 h-16 border-b border-border bg-charcoal z-20 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <h1 className="font-syne font-bold text-xl">{title}</h1>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2 py-1 rounded-md ml-4">
          <Clock className="w-3 h-3 text-teal/60" />
          <span className="font-mono text-xs text-white/60">{time}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-teal transition-colors" />
          <input
            type="text" 
            placeholder="Rechercher #TXN, agent..."
            className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-xs w-[240px] focus:outline-none focus:border-teal/30 focus:bg-white/10 transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Basculer mode jour nuit"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber" /> : <Moon className="w-4 h-4 text-teal" />}
          </button>

          <Link href="/notifications" className="relative cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors group">
            <Bell className="w-5 h-5 text-white/60 group-hover:text-white" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger border-2 border-charcoal" />
          </Link>

          <div className="relative group">
            <button className="flex items-center gap-2 bg-teal/10 hover:bg-teal/20 text-teal border border-teal/20 px-3 py-1.5 rounded-lg transition-all">
              <span className="text-xs font-bold uppercase tracking-wider">{role.replace("_", " ")}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-charcoal/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-50">
              <button 
                onClick={() => setRole("AGENT_PRINCIPAL" as Role)}
                className="w-full text-left px-4 py-3 text-xs font-medium hover:bg-white/5 transition-colors border-b border-white/5"
              >
                Agent Principal
              </button>
              <button 
                onClick={() => setRole("DIRECTEUR" as Role)}
                className="w-full text-left px-4 py-3 text-xs font-medium hover:bg-white/5 transition-colors"
              >
                Directeur
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
