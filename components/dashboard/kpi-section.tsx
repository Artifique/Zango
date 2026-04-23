"use client";

import { motion } from "framer-motion";
import { Activity, Clock, TrendingUp, Wallet, ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  subValue: string;
  icon: any;
  accent: "teal" | "amber" | "green";
  pulse?: boolean;
  delay?: number;
}

function KPICard({ title, value, subValue, icon: Icon, accent, pulse, delay = 0 }: KPICardProps) {
  const accentClasses = {
    teal: "text-teal border-teal/20 bg-teal/5",
    amber: "text-amber border-amber/20 bg-amber/5",
    green: "text-success border-success/20 bg-success/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-all cursor-default"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "p-2.5 rounded-xl border",
          accentClasses[accent],
          pulse && "animate-pulse-slow"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-white/40 uppercase tracking-tighter">
          En direct <div className="w-1 h-1 rounded-full bg-success animate-pulse" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-white/40 text-xs font-medium uppercase tracking-wider">{title}</h3>
        <p className={cn(
          "text-2xl font-mono font-bold tracking-tight",
          accent === "teal" && "text-teal",
          accent === "amber" && "text-amber",
          accent === "green" && "text-success"
        )}>
          {value}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex items-center gap-0.5 text-success font-mono text-[10px] font-bold">
          <ArrowUpRight className="w-3 h-3" />
          <span>{subValue.split(" ")[0]}</span>
        </div>
        <span className="text-[10px] text-white/20 font-medium uppercase">{subValue.split(" ").slice(1).join(" ")}</span>
      </div>

      {/* Background Glow Effect */}
      <div className={cn(
        "absolute -right-4 -bottom-4 w-24 h-24 blur-[60px] opacity-10 rounded-full transition-opacity group-hover:opacity-20",
        accent === "teal" && "bg-teal",
        accent === "amber" && "bg-amber",
        accent === "green" && "bg-success"
      )} />
    </motion.div>
  );
}

export function KPISection({ role }: { role: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        title="Transactions Aujourd'hui"
        value="12"
        subValue="+3 vs hier"
        icon={Activity}
        accent="teal"
        delay={0.1}
      />
      <KPICard
        title="En attente de confirmation"
        value="04"
        subValue="2 capturées, 2 en cours"
        icon={Clock}
        accent="amber"
        pulse
        delay={0.2}
      />
      <KPICard
        title="Volume total (USDT)"
        value="4,820.50"
        subValue="+12% ce mois"
        icon={TrendingUp}
        accent="teal"
        delay={0.3}
      />
      <KPICard
        title={role === "DIRECTEUR" ? "Agents Actifs" : "Mon Solde Disponible"}
        value={role === "DIRECTEUR" ? "08/10" : "1,240.00"}
        subValue={role === "DIRECTEUR" ? "80% en ligne" : "Dernier appro: 500"}
        icon={role === "DIRECTEUR" ? ArrowUpRight : Wallet}
        accent="green"
        delay={0.4}
      />
    </div>
  );
}
