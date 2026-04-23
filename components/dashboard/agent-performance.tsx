"use client";

import { motion } from "framer-motion";
import { MOCK_AGENTS } from "../../data/mock-data";
import { cn } from "../../lib/utils";

export function AgentPerformance({ role }: { role: string }) {
  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-syne font-bold text-lg">
          {role === "DIRECTEUR" ? "Opérations Globales" : "Performance Agents"}
        </h3>
        <span className="text-[10px] font-mono font-bold uppercase text-white/20 tracking-widest">
          {MOCK_AGENTS.filter(a => a.status === "online").length}/{MOCK_AGENTS.length} en ligne
        </span>
      </div>
      
      <div className="space-y-4">
        {MOCK_AGENTS.map((agent, idx) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white/60 group-hover:border-teal/30 group-hover:text-teal transition-all">
                  {agent.initials}
                </div>
                <div className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-charcoal",
                  agent.status === "online" ? "bg-success" : "bg-white/10"
                )} />
              </div>
              <div>
                <p className="text-xs font-bold text-white/90">{agent.name}</p>
                <p className="text-[10px] font-mono text-white/20 uppercase tracking-tight">
                  {agent.transactionsToday} transactions
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-teal/50" 
                  style={{ width: `${(agent.transactionsToday / 20) * 100}%` }}
                />
              </div>
              {role === "DIRECTEUR" && (
                <button className="text-[9px] font-mono font-bold uppercase text-teal/40 hover:text-teal transition-colors">
                  Approvisionner
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-6 py-2.5 border border-white/5 hover:border-teal/30 hover:bg-teal/5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest text-white/20 hover:text-teal transition-all">
        Gérer les accès
      </button>
    </div>
  );
}
