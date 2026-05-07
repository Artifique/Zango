"use client";

import { useState } from "react";
import { AppShell } from "../../views/layout/app-shell";
import { useRoleController } from "../../controllers/role-controller";
import { Modal } from "../../components/modals/modal";
import { Plus } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  transactions: number;
  ca: number;
}

const MOCK_AGENTS: Agent[] = [
  { id: "A001", name: "Alex K.", transactions: 12, ca: 1240000 },
  { id: "A002", name: "Jean D.", transactions: 8, ca: 850000 },
];

export default function AgentsPage() {
  const { role } = useRoleController();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agents] = useState<Agent[]>(MOCK_AGENTS);

  if (role !== "DIRECTEUR") return <AppShell><p className="text-white/40">Accès refusé.</p></AppShell>;

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-syne font-bold text-white">Gestion des Agents</h2>
          <button onClick={() => setIsModalOpen(true)} className="bg-teal text-charcoal px-4 py-2 rounded-lg font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Ajouter Agent
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase text-white/40">
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4">Transactions</th>
                <th className="px-6 py-4">CA Journalier</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(a => (
                <tr key={a.id} className="border-b border-white/5">
                  <td className="px-6 py-4">{a.name}</td>
                  <td className="px-6 py-4 font-mono">{a.transactions}</td>
                  <td className="px-6 py-4 font-mono">{a.ca.toLocaleString()} XOF</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter Agent">
        <form className="space-y-4">
            <input className="w-full bg-white/5 p-2 rounded border border-white/10" placeholder="Nom de l'agent" />
            <button className="w-full bg-teal text-charcoal font-bold p-2 rounded">Créer</button>
        </form>
      </Modal>
    </AppShell>
  );
}
