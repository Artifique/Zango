"use client";

import { useState, useEffect, useMemo } from "react";
import { AppShell } from "../../views/layout/app-shell";
import { useRoleController } from "../../controllers/role-controller";
import { RateService } from "../../controllers/data-services";
import { Modal } from "../../components/modals/modal";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface Rate {
  id: string;
  type: string;
  valeur: number;
}

export default function TauxPage() {
  const { role } = useRoleController();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [type, setType] = useState("");
  const [valeur, setValeur] = useState("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const fetchRates = () => {
    RateService.getAll().then((data) => {
      setRates(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchRates(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await RateService.create(type, Number(valeur));
    setIsModalOpen(false);
    setType("");
    setValeur("");
    fetchRates();
  };

  const paginatedRates = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return rates.slice(start, start + itemsPerPage);
  }, [rates, page]);

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

          {loading ? (
            <p className="text-white/40">Chargement...</p>
          ) : (
            <div className="space-y-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase text-white/40">
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRates.map((r) => (
                    <tr key={r.id} className="border-b border-white/5">
                      <td className="px-6 py-4">{r.type}</td>
                      <td className="px-6 py-4 font-mono">{r.valeur}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between text-xs text-white/40 px-6">
                <span>Page {page} de {Math.ceil(rates.length / itemsPerPage) || 1}</span>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} className="p-2 hover:bg-white/5 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => setPage(p => p + 1)} className="p-2 hover:bg-white/5 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un Taux">
        <form onSubmit={handleAdd} className="space-y-4">
          <div><label className="block text-sm">Type</label><input value={type} onChange={e => setType(e.target.value)} className="w-full bg-white/5 p-2 rounded border border-white/10" /></div>
          <div><label className="block text-sm">Valeur</label><input type="number" value={valeur} onChange={e => setValeur(e.target.value)} className="w-full bg-white/5 p-2 rounded border border-white/10" /></div>
          <button className="w-full bg-teal text-charcoal font-bold p-2 rounded">Enregistrer</button>
        </form>
      </Modal>
    </AppShell>
  );
}
