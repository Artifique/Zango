"use client";

import { useState, useEffect, useMemo } from "react";
import { AppShell } from "../../views/layout/app-shell";
import { useRoleController } from "../../controllers/role-controller";
import { AgentService } from "../../controllers/data-services";
import { Modal } from "../../components/modals/modal";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface Agent {
  id: string;
  nom: string;
  email: string;
}

export default function AgentsPage() {
  const { role, loading: roleLoading } = useRoleController();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  
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
    try {
      await AgentService.create(nom, email);
      setIsModalOpen(false);
      setNom("");
      setEmail("");
      fetchAgents();
    } catch (err: any) {
      alert("Erreur lors de la création : " + (err.message || "Veuillez vérifier l'email."));
    }
  };

  const paginatedAgents = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return agents.slice(start, start + itemsPerPage);
  }, [agents, page]);

  if (roleLoading) return <AppShell><p className="text-white/40">Chargement...</p></AppShell>;
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
          {loading ? (
            <p className="text-white/40">Chargement...</p>
          ) : (
            <div className="space-y-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase text-white/40">
                    <th className="px-6 py-4">Nom</th>
                    <th className="px-6 py-4">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAgents.map(a => (
                    <tr key={a.id} className="border-b border-white/5">
                      <td className="px-6 py-4">{a.nom}</td>
                      <td className="px-6 py-4">{a.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between text-xs text-white/40 px-6">
                <span>Page {page} de {Math.ceil(agents.length / itemsPerPage) || 1}</span>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} className="p-2 hover:bg-white/5 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => setPage(p => p + 1)} className="p-2 hover:bg-white/5 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter Agent">
        <form onSubmit={handleAdd} className="space-y-4">
            <input value={nom} onChange={e => setNom(e.target.value)} className="w-full bg-white/5 p-2 rounded border border-white/10" placeholder="Nom de l'agent" required />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 p-2 rounded border border-white/10" placeholder="Email" required />
            <p className="text-xs text-white/40">Mot de passe par défaut : Agent123!</p>
            <button className="w-full bg-teal text-charcoal font-bold p-2 rounded">Créer</button>
        </form>
      </Modal>
    </AppShell>
  );
}
