"use client";

import { useState, useEffect, useMemo } from "react";
import { AppShell } from "../../views/layout/app-shell";
import { useRoleController } from "../../controllers/role-controller";
import { RateService } from "../../controllers/data-services";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SuccessToast } from "../../components/feedback/success-toast";

interface Rate {
  id: string;
  type: string;
  valeur: number;
}

export default function TauxPage() {
  const { role } = useRoleController();
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [type, setType] = useState("");
  const [valeur, setValeur] = useState("");
  
  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
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
    if (!type.trim() || !valeur.trim()) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    const valNum = Number(valeur);
    if (isNaN(valNum) || valNum <= 0) {
      alert("Veuillez saisir une valeur numérique valide supérieure à 0.");
      return;
    }
    try {
      await RateService.create(type, valNum);
      setToastMessage(`Le taux "${type}" (${valNum}) a été enregistré.`);
      setShowToast(true);
      setType("");
      setValeur("");
      fetchRates();
    } catch (err: any) {
      alert("Erreur lors de l'enregistrement : " + (err.message || "Veuillez réessayer."));
    }
  };

  const handleCancel = () => {
    setType("");
    setValeur("");
  };

  const paginatedRates = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return rates.slice(start, start + itemsPerPage);
  }, [rates, page]);

  const showForm = role === "DIRECTEUR";

  return (
    <AppShell>
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)] overflow-hidden" suppressHydrationWarning={true}>
        
        {/* Colonne de Gauche : Liste des Taux */}
        <div className={`w-full ${showForm ? "lg:w-1/2" : "w-full"} flex flex-col glass-card rounded-2xl p-6 overflow-hidden h-full min-h-[400px] lg:min-h-0`}>
          <div className="flex flex-col mb-4">
            <h2 className="text-lg font-syne font-bold dark:text-white text-gray-900">
              Gestion des Taux
            </h2>
            <p className="text-xs text-white/40 font-mono">Registre des taux de change applicables</p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1">
            {loading ? (
              <p className="text-white/40">Chargement...</p>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto w-full border border-teal/20 rounded-xl bg-charcoal/30">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-teal/10 border-b border-teal/20 text-[10px] font-bold uppercase tracking-wider text-teal">
                        <th className="px-6 py-3 border-r border-teal/20">Type</th>
                        <th className="px-6 py-3">Valeur (XOF)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRates.map((r) => (
                        <tr key={r.id} className="border-b border-teal/10 hover:bg-white/5 transition-colors divide-x divide-teal/10">
                          <td className="px-6 py-3 text-white font-medium">{r.type}</td>
                          <td className="px-6 py-3 text-white font-mono text-xs">{r.valeur} F</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between text-xs text-white/40 px-6">
                  <span>Page {page} de {Math.ceil(rates.length / itemsPerPage) || 1}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))} 
                      disabled={page === 1}
                      className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setPage(p => Math.min(Math.ceil(rates.length / itemsPerPage), p + 1))} 
                      disabled={page >= Math.ceil(rates.length / itemsPerPage)}
                      className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Colonne de Droite : Saisie Excel-like (uniquement pour DIRECTEUR) */}
        {showForm && (
          <div className="flex-1 flex flex-col justify-center items-center glass-card rounded-2xl p-8 relative overflow-y-auto">
            <div className="w-full max-w-xl space-y-8">
              <div className="text-center">
                <h3 className="text-xl font-syne font-bold text-white mb-2">Ajouter un Taux</h3>
                <p className="text-sm text-white/40 font-mono">Saisissez le nouveau taux dans le tableau ci-dessous</p>
              </div>

              <form onSubmit={handleAdd} className="space-y-8">
                <div className="overflow-x-auto w-full border border-teal/20 rounded-xl bg-charcoal/50">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-teal/10 border-b border-teal/20 text-[11px] font-bold uppercase tracking-wider text-teal">
                        <th className="px-4 py-3 border-r border-teal/20 w-1/2">Type (ex: USDT, BTC)</th>
                        <th className="px-4 py-3 w-1/2">Valeur (XOF)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="divide-x divide-teal/10">
                        {/* Cellule Type */}
                        <td className="p-3">
                          <input
                            type="text"
                            value={type}
                            onChange={e => setType(e.target.value)}
                            placeholder="Ex: USDT"
                            className="w-full bg-transparent border-none text-center text-white focus:outline-none focus:ring-0 focus:text-teal font-bold placeholder:text-white/10"
                            required
                          />
                        </td>
                        {/* Cellule Valeur */}
                        <td className="p-3">
                          <input
                            type="number"
                            value={valeur}
                            onChange={e => setValeur(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-transparent border-none text-center text-white focus:outline-none focus:ring-0 focus:text-teal font-bold placeholder:text-white/10 font-mono"
                            required
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col items-center justify-center gap-3 w-64 mx-auto">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-teal text-charcoal font-bold font-syne hover:bg-teal-hover transition-all shadow-lg shadow-teal/10 hover:shadow-teal/20 text-center uppercase tracking-wider"
                  >
                    Valider
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full py-3 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all text-center uppercase tracking-wider border border-white/10"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Toast de succès */}
      <SuccessToast 
        show={showToast} 
        message={toastMessage} 
        onClose={() => setShowToast(false)} 
      />
    </AppShell>
  );
}
