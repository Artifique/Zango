"use client";

import { AppShell } from "../../views/layout/app-shell";
import { MOCK_AGENTS } from "../../data/mock-data";
import { useRoleController } from "../../controllers/role-controller";

export default function AgentsPage() {
  const { role } = useRoleController();

  return (
    <AppShell>
      <section className="glass-card rounded-2xl p-6">
        <h2 className="text-2xl font-syne font-extrabold mb-2">Supervision des agents</h2>
        <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-6">
          {role === "DIRECTEUR"
            ? "Vue directeur: contrôle global des performances et de la disponibilité."
            : "Vue agent principal: suivi des collègues et des confirmations en attente."}
        </p>

        <div className="space-y-3">
          {MOCK_AGENTS.map((agent) => (
            <div key={agent.id} className="grid grid-cols-12 gap-4 items-center border border-white/10 rounded-xl p-4">
              <div className="col-span-4">
                <p className="font-bold">{agent.name}</p>
                <p className="text-xs text-white/40">Initiales: {agent.initials}</p>
              </div>
              <div className="col-span-3 text-xs font-mono">{agent.transactionsToday} transactions</div>
              <div className="col-span-2">
                <span className={agent.status === "online" ? "text-success text-xs uppercase" : "text-white/40 text-xs uppercase"}>
                  {agent.status}
                </span>
              </div>
              <div className="col-span-3 text-right">
                {role === "DIRECTEUR" ? (
                  <button className="px-3 py-1.5 rounded-lg bg-teal text-charcoal text-xs font-bold">Approvisionner</button>
                ) : (
                  <button className="px-3 py-1.5 rounded-lg border border-white/20 text-xs">Voir détails</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
