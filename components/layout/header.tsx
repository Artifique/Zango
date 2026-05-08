"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, Clock, ChevronDown, Sun, Moon, Menu, X, Home, Users, Percent, Mail, PlusCircle, ShieldUser } from "lucide-react";
import { useRoleController } from "../../controllers/role-controller";
import { useThemeController } from "../../controllers/theme-controller";
import { useAuthController } from "../../controllers/auth-controller";
// ...
export function Header() {
  const [time, setTime] = useState("--:--");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { role, loading: roleLoading } = useRoleController();
  const { theme, toggleTheme } = useThemeController();
  const { username, logout } = useAuthController();
  
  const openClientModal = () => window.dispatchEvent(new CustomEvent('open-client-modal'));
  const openTxModal = () => window.dispatchEvent(new CustomEvent('open-tx-modal'));

  // ... (useEffect time)

  const NavButtons = () => (
    <>
      <Link href="/" className="flex items-center gap-2 bg-teal/10 text-teal text-sm font-bold px-3 py-2 rounded-lg hover:bg-teal-hover hover:text-white transition-colors">
        <Home className="w-4 h-4" /> Accueil
      </Link>
      <button onClick={openClientModal} className="flex items-center gap-2 bg-teal/10 text-teal text-sm font-bold px-3 py-2 rounded-lg hover:bg-teal-hover hover:text-white transition-colors">
        <Users className="w-4 h-4" /> Clients
      </button>
      {!roleLoading && role === "DIRECTEUR" && (
        <>
            <Link href="/taux" className="flex items-center gap-2 bg-teal/10 text-teal text-sm font-bold px-3 py-2 rounded-lg hover:bg-teal-hover hover:text-white transition-colors">
              <Percent className="w-4 h-4" /> Taux
            </Link>
            <Link href="/agents" className="flex items-center gap-2 bg-teal/10 text-teal text-sm font-bold px-3 py-2 rounded-lg hover:bg-teal-hover hover:text-white transition-colors">
              <ShieldUser className="w-4 h-4" /> Agents
            </Link>
        </>
      )}
      <Link href="/notifications" className="flex items-center gap-2 bg-teal/10 text-teal text-sm font-bold px-3 py-2 rounded-lg hover:bg-teal-hover hover:text-white transition-colors">
        <Mail className="w-4 h-4" /> Notif
      </Link>
      <button onClick={openTxModal} className="flex items-center gap-2 bg-teal text-charcoal text-sm font-bold px-3 py-2 rounded-lg hover:bg-teal-hover transition-colors">
        <PlusCircle className="w-4 h-4" /> Transaction
      </button>
    </>
  );

  // ... (reste du Header)

  return (
    <header className="sticky top-0 h-16 border-b border-border bg-charcoal z-20 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="Logo" width={32} height={32} />
        <span className="font-syne font-bold text-lg tracking-tight ml-1">alyce</span>
      </div>

      <div className="md:hidden">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2">{NavButtons()}</div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-charcoal p-4 flex flex-col gap-2 md:hidden border-b border-border">
          {NavButtons()}
        </div>
      )}

      {/* Right Side Tools */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber" /> : <Moon className="w-4 h-4 text-teal" />}
        </button>

        <Link href="/notifications" className="relative cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors group">
          <Bell className="w-5 h-5 text-white/60 group-hover:text-white" />
        </Link>

        <div className="relative group">
          <button className="flex items-center gap-2 bg-teal/10 hover:bg-teal/20 text-teal border border-teal/20 px-3 py-1.5 rounded-lg transition-all">
            <span className="text-xs font-bold uppercase tracking-wider">{username || "Utilisateur"}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-48 bg-charcoal/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-50">
            <div className="px-4 py-2 border-b border-white/5">
              <p className="text-[10px] uppercase text-white/40">Rôle : {role ? role.replace("_", " ") : "Chargement..."}</p>
            </div>
            <Link href="/profile/password" className="block px-4 py-3 text-xs font-medium hover:bg-white/5 transition-colors border-b border-white/5">
              Modifier Mot de Passe
            </Link>
            <button 
              onClick={logout}
              className="w-full text-left px-4 py-3 text-xs font-medium text-danger hover:bg-white/5 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
