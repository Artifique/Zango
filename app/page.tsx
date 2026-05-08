"use client";

import { useMemo, useEffect, useState } from "react";
import { TransactionsTable } from "../components/dashboard/transactions-table";
import { AppShell } from "../views/layout/app-shell";
import { Modal } from "../components/modals/modal";
import { useNotifications } from "../lib/notification-context";
import { useRoleController } from "../controllers/role-controller";
import { useAuthController } from "../controllers/auth-controller";
import { TransactionService } from "../controllers/transaction-controller";
import { ClientService, RateService, AgentService, NotificationService } from "../controllers/data-services";
import { Transaction } from "../types/supabase-models";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [rates, setRates] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [montant, setMontant] = useState("");
  const [taux, setTaux] = useState("");

  const { role } = useRoleController();
  const { user } = useAuthController();

  const usd = useMemo(() => {
    const m = parseFloat(montant);
    const t = parseFloat(taux);
    return (m && t && t !== 0) ? (m / t).toFixed(2) : "0.00";
  }, [montant, taux]);

  useEffect(() => {
    TransactionService.getAll().then(setTransactions);
    ClientService.getAll().then(setClients);
    RateService.getAll().then(setRates);
    AgentService.getAll().then(setAgents);
  }, []);

  if (typeof window !== 'undefined') {
    window.addEventListener('open-client-modal', () => setIsClientModalOpen(true));
    window.addEventListener('open-tx-modal', () => setIsTxModalOpen(true));
  }

  const handleCreateTx = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const montantVal = parseFloat(montant);
    const tauxVal = parseFloat(taux);
    const usdVal = montantVal / tauxVal;
    const clientId = form[3].value;
    const agentId = form[4].value;

    try {
        await TransactionService.create({
            amount: montantVal,
            rate: tauxVal,
            usdValue: usdVal,
            clientId,
            agentId,
            status: 'EN_ATTENTE',
            date: new Date().toISOString()
        } as any);

        await NotificationService.send("TXN-...", agentId, user.id, "Veuillez confirmer cette transaction.");
        setIsTxModalOpen(false);
        TransactionService.getAll().then(setTransactions);
    } catch (err: any) {
        console.error("Erreur complète:", err);
        const errorMessage = err?.message || err?.error?.message || "Une erreur inconnue est survenue.";
        alert("Erreur transaction: " + errorMessage);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      clientName: { value: string };
    };
    await ClientService.create(target.clientName.value);
    setIsClientModalOpen(false);
    ClientService.getAll().then(setClients);
  };

  const userTransactions = useMemo(() => {
    return role === "DIRECTEUR" 
      ? transactions 
      : transactions.filter(t => t.agentId === user?.id);
  }, [role, user, transactions]);

  const metrics = useMemo(() => {
    const totalXof = userTransactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const totalUsd = userTransactions.reduce((acc, t) => acc + (Number(t.usdValue) || 0), 0);
    return { 
      totalXof, 
      totalUsd,
      totalRecu: totalXof * 0.3,
      restant: totalXof * 0.7 
    };
  }, [userTransactions]);

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-syne font-bold mb-4 dark:text-white text-gray-900">
            {role === "DIRECTEUR" ? "Historique Global" : "Mon Travail Journalier"}
          </h2>
          <TransactionsTable transactions={userTransactions} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-4 rounded-xl">
             <h3 className="text-sm text-white/60">Total XOF</h3>
             <p className="text-2xl font-mono mt-1">{metrics.totalXof.toLocaleString()}</p>
          </div>
          <div className="glass-card p-4 rounded-xl">
             <h3 className="text-sm text-white/60">Total Vendu (USD)</h3>
             <p className="text-2xl font-mono mt-1">{metrics.totalUsd.toLocaleString()}</p>
          </div>
          <div className="glass-card p-4 rounded-xl">
             <h3 className="text-sm text-white/60">Total Reçu</h3>
             <p className="text-2xl font-mono mt-1">{(metrics.totalXof * 0.3).toLocaleString()}</p>
          </div>
          <div className="glass-card p-4 rounded-xl">
             <h3 className="text-sm text-white/60">Restant</h3>
             <p className="text-2xl font-mono mt-1">{(metrics.totalXof * 0.7).toLocaleString()}</p>
          </div>
        </div>
      </div>
      <Modal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} title="Nouveau Client">
        <form onSubmit={handleCreateClient} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60">Nom complet</label>
              <input name="clientName" className="w-full bg-white/5 p-2 rounded border border-white/10" placeholder="Entrez le nom..." required />
            </div>
            <button type="submit" className="w-full bg-teal text-charcoal font-bold p-2 rounded">Ajouter</button>
        </form>
      </Modal>

      <Modal isOpen={isTxModalOpen} onClose={() => setIsTxModalOpen(false)} title="Nouvelle Transaction">
        <form onSubmit={handleCreateTx} className="space-y-3">
          <div>
            <label className="block text-sm text-white/60">Montant</label>
            <input type="number" value={montant} onChange={e => setMontant(e.target.value)} className="w-full bg-white/5 p-2 rounded border border-white/10" required />
          </div>
          <div>
            <label className="block text-sm text-white/60">Taux</label>
            <select value={taux} onChange={e => setTaux(e.target.value)} className="w-full bg-white/5 p-2 rounded border border-white/10 text-black dark:text-white" required>
              <option value="" className="text-black">Sélectionner un taux</option>
              {rates.map(r => <option key={r.id} value={r.valeur} className="text-black">{r.type} ({r.valeur})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60">USD (Calculé)</label>
            <input type="number" value={usd} className="w-full bg-white/5 p-2 rounded border border-white/10 opacity-70" readOnly />
          </div>
          <div><label className="block text-sm text-white/60">Client</label><select className="w-full bg-white/5 p-2 rounded border border-white/10 text-black dark:text-white" required>{clients.map(c => <option key={c.id} value={c.id} className="text-black">{c.nom_complet}</option>)}</select></div>
          <div><label className="block text-sm text-white/60">Agent</label><select className="w-full bg-white/5 p-2 rounded border border-white/10 text-black dark:text-white" required>{agents.map(a => <option key={a.id} value={a.id} className="text-black">{a.nom}</option>)}</select></div>
          <button type="submit" className="w-full bg-teal text-charcoal font-bold p-2 rounded">Valider</button>
        </form>
      </Modal>
    </AppShell>
  );
}
