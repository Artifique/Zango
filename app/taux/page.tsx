"use client";

import { useState } from "react";
import { AppShell } from "../../views/layout/app-shell";
import { useRoleController } from "../../controllers/role-controller";
import { Modal } from "../../components/modals/modal";
import { Plus } from "lucide-react";

interface Rate {
  id: string;
  type: string;
  value: number;
}

const MOCK_RATES: Rate[] = [
  { id: "1", type: "USDT", value: 600 },
  { id: "2", type: "BTC", value: 620 },
];

export default function TauxPage() {
  const { role } = useRoleController();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rates] = useState<Rate[]>(MOCK_RATES);

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-syne font-bold text-white">Gestion des Taux</h2>
            {role === "DIRECTEUR" && (
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-teal text-charcoal px-4 py-2 rounded-lg font-bold">
                <Plus className="w-4 h-4" /> Ajouter un taux
              </button>
            )}
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase text-white/40">
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Valeur</th>
              </tr>
            </thead>
            <tbody>
              {rates.map(r => (
                <tr key={r.id} className="border-b border-white/5">
                  <td className="px-6 py-4">{r.type}</td>
                  <td className="px-6 py-4 font-mono">{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un Taux">
        <form className="space-y-4">
          <div><label className="block text-sm">Type</label><input className="w-full bg-white/5 p-2 rounded border border-white/10" /></div>
          <div><label className="block text-sm">Valeur</label><input type="number" className="w-full bg-white/5 p-2 rounded border border-white/10" /></div>
          <button className="w-full bg-teal text-charcoal font-bold p-2 rounded">Enregistrer</button>
        </form>
      </Modal>
    </AppShell>
  );
}
