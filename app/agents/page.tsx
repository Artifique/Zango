"use client";

import { useState, useEffect, useMemo } from "react";
import { AppShell } from "../../views/layout/app-shell";
import { useRoleController } from "../../controllers/role-controller";
import { AgentService } from "../../controllers/data-services";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SuccessToast } from "../../components/feedback/success-toast";

interface Agent {
  id: string;
  nom: string;
  email: string;
}

export default function AgentsPage() {
  const { role, loading: roleLoading } = useRoleController();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  
  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const fetchAgents = () => {
    AgentService.getAll().then((data) => {
      setAgents(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchAgents(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !email.trim()) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    try {
      await AgentService.create(nom, email);
      setToastMessage(`L'agent "${nom}" a été créé avec succès.`);
      setShowToast(true);
      setNom("");
      setEmail("");
      fetchAgents();
    } catch (err: any) {
      alert("Erreur lors de la création : " + (err.message || "Veuillez vérifier l'email."));
    }
  };

  const handleCancel = () => {
    setNom("");
    setEmail("");
  };

  const paginatedAgents = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return agents.slice(start, start + itemsPerPage);
  }, [agents, page]);

  if (roleLoading) return <AppShell><p className="text-white/40">Chargement...</p></AppShell>;
  if (role !== "DIRECTEUR") return <AppShell><p className="text-white/40">Accès refusé.</p></AppShell>;

  return (
    <AppShell>
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)] overflow-hidden" suppressHydrationWarning={true}>
        
        {/* Colonne de Gauche : Liste des Agents */}
        <div className="w-full lg:w-1/2 flex flex-col glass-card rounded-2xl p-6 overflow-hidden h-full min-h-[400px] lg:min-h-0">
          <div className="flex flex-col mb-4">
            <h2 className="text-lg font-syne font-bold dark:text-white text-gray-900">
              Liste des Agents
            </h2>
            <p className="text-xs text-white/40 font-mono">Registre des collaborateurs actifs</p>
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
                        <th className="px-4 py-3 border-r border-teal/20">Nom</th>
                        <th className="px-4 py-3">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAgents.map(a => (
                        <tr key={a.id} className="border-b border-teal/10 hover:bg-white/5 transition-colors divide-x divide-teal/10">
                          <td className="px-4 py-3 text-white font-medium">{a.nom}</td>
                          <td className="px-4 py-3 text-white/70 font-mono text-xs">{a.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between text-xs text-white/40 px-4">
                  <span>Page {page} de {Math.ceil(agents.length / itemsPerPage) || 1}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))} 
                      disabled={page === 1}
                      className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setPage(p => Math.min(Math.ceil(agents.length / itemsPerPage), p + 1))} 
                      disabled={page >= Math.ceil(agents.length / itemsPerPage)}
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

        {/* Colonne de Droite : Création Excel-like */}
        <div className="flex-1 flex flex-col justify-center items-center glass-card rounded-2xl p-8 relative overflow-y-auto">
          <div className="w-full max-w-xl space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-syne font-bold text-white mb-2">Ajouter un Agent</h3>
              <p className="text-sm text-white/40 font-mono">Saisissez les informations directement dans le tableau linéaire</p>
            </div>

            <form onSubmit={handleAdd} className="space-y-8">
              <div className="overflow-x-auto w-full border border-teal/20 rounded-xl bg-charcoal/50">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-teal/10 border-b border-teal/20 text-[11px] font-bold uppercase tracking-wider text-teal">
                      <th className="px-4 py-3 border-r border-teal/20 w-1/2">Nom de l'agent</th>
                      <th className="px-4 py-3 w-1/2">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="divide-x divide-teal/10">
                      {/* Cellule Nom */}
                      <td className="p-3">
                        <input
                          id="agent-nom-input"
                          type="text"
                          value={nom}
                          onChange={e => setNom(e.target.value)}
                          placeholder="Ex: Sarah"
                          className="w-full bg-transparent border-none text-center text-white focus:outline-none focus:ring-0 focus:text-teal font-bold placeholder:text-white/10"
                          required
                        />
                      </td>
                      {/* Cellule Email */}
                      <td className="p-3">
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="Ex: sarah@kalyce.com"
                          className="w-full bg-transparent border-none text-center text-white focus:outline-none focus:ring-0 focus:text-teal font-bold placeholder:text-white/10 font-mono text-xs"
                          required
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="text-center text-xs text-white/30 font-mono bg-teal/5 border border-teal/10 rounded-lg py-2">
                Mot de passe par défaut généré : <span className="text-teal font-bold">Agent123!</span>
              </div>

              {/* Boutons d'action centrés */}
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
