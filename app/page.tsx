"use client";

import { useMemo, useEffect, useState } from "react";
import { TransactionsTable } from "../components/dashboard/transactions-table";
import { AppShell } from "../views/layout/app-shell";
import { Modal } from "../components/modals/modal";
import { useNotifications } from "../lib/notification-context";
import { useRoleController } from "../controllers/role-controller";
import { useAuthController } from "../controllers/auth-controller";
import { TransactionService } from "../controllers/transaction-controller";
import { Transaction } from "../types/supabase-models";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const { sendNotification } = useNotifications();
  const { role } = useRoleController();
  const { username } = useAuthController();

  useEffect(() => {
    TransactionService.getAll().then(setTransactions).catch(console.error);
  }, []);

  if (typeof window !== 'undefined') {
    window.addEventListener('open-client-modal', () => setIsClientModalOpen(true));
    window.addEventListener('open-tx-modal', () => setIsTxModalOpen(true));
  }

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    sendNotification("TXN-" + Math.floor(Math.random()*1000), "Agent cible");
    setIsTxModalOpen(false);
  };

  const userTransactions = useMemo(() => {
    return role === "DIRECTEUR" 
      ? transactions 
      : transactions.filter(t => t.agentName === (username || "Alex K."));
  }, [role, username, transactions]);

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
        <form className="space-y-4">
            <div><label className="block text-sm text-white/60">ID (Auto-généré)</label><input disabled className="w-full bg-white/5 p-2 rounded border border-white/10" value="CLI-8821" /></div>
            <div><label className="block text-sm text-white/60">Nom complet</label><input className="w-full bg-white/5 p-2 rounded border border-white/10" placeholder="Entrez le nom..." /></div>
            <button className="w-full bg-teal text-charcoal font-bold p-2 rounded">Ajouter</button>
        </form>
      </Modal>

      <Modal isOpen={isTxModalOpen} onClose={() => setIsTxModalOpen(false)} title="Nouvelle Transaction">
        <form onSubmit={handleCreateTx} className="space-y-3">
          <div><label className="block text-sm text-white/60">Montant</label><input type="number" className="w-full bg-white/5 p-2 rounded border border-white/10" required /></div>
          <div><label className="block text-sm text-white/60">USD</label><input type="number" className="w-full bg-white/5 p-2 rounded border border-white/10" required /></div>
          <div><label className="block text-sm text-white/60">Taux</label><select className="w-full bg-white/5 p-2 rounded border border-white/10"><option>600</option><option>610</option></select></div>
          <div><label className="block text-sm text-white/60">Client</label><select className="w-full bg-white/5 p-2 rounded border border-white/10"><option>Jean Dupont</option></select></div>
          <div><label className="block text-sm text-white/60">Agent</label><select className="w-full bg-white/5 p-2 rounded border border-white/10"><option>Alex K.</option></select></div>
          <button type="submit" className="w-full bg-teal text-charcoal font-bold p-2 rounded">Valider</button>
        </form>
      </Modal>
    </AppShell>
  );
}
