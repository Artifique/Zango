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
import { SuccessToast } from "../components/feedback/success-toast";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [rates, setRates] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [montant, setMontant] = useState("");
  const [taux, setTaux] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastTitle, setToastTitle] = useState("");

  const { role } = useRoleController();
  const { user } = useAuthController();

  const usd = useMemo(() => {
    const m = parseFloat(montant);
    const t = parseFloat(taux);
    return (m && t && t !== 0) ? (m / t).toFixed(2) : "0.00";
  }, [montant, taux]);

  useEffect(() => {
    TransactionService.getAll().then(setTransactions);
    ClientService.getAll().then((data) => {
      setClients(data);
      if (data && data.length > 0) setSelectedClientId(data[0].id);
    });
    RateService.getAll().then(setRates);
    AgentService.getAll().then((data) => {
      setAgents(data);
      if (data && data.length > 0) setSelectedAgentId(data[0].id);
    });
  }, []);

  if (typeof window !== 'undefined') {
    // Écouteur pour le bouton client du Header
    window.addEventListener('open-client-modal', () => setIsClientModalOpen(true));
    // Écouteur pour le bouton transaction du Header -> redirige le focus sur la cellule de saisie
    window.addEventListener('open-tx-modal', () => {
      const input = document.getElementById("montant-input");
      if (input) input.focus();
    });
  }

  const handleCreateTx = async (e: React.FormEvent) => {
    e.preventDefault();
    const montantVal = parseFloat(montant);
    const tauxVal = parseFloat(taux);
    if (isNaN(montantVal) || isNaN(tauxVal) || tauxVal === 0) {
      alert("Veuillez saisir un montant et un taux valides.");
      return;
    }
    const usdVal = montantVal / tauxVal;

    try {
        const created = await TransactionService.create({
            amount: montantVal,
            rate: tauxVal,
            usdValue: usdVal,
            clientId: selectedClientId,
            agentId: selectedAgentId,
            status: 'EN_ATTENTE',
            date: new Date().toISOString()
        } as any);

        const txIdForNotif = created?.id || "TXN-0000";

        // Envoyer la notification de manière asynchrone / non bloquante pour éviter que les contraintes de clés ou RLS sur les notifications ne bloquent la création
        try {
            await NotificationService.send(txIdForNotif, selectedAgentId, user?.id, "Veuillez confirmer cette transaction.");
        } catch (notifErr: any) {
            console.warn("La notification n'a pas pu être envoyée (contrainte de clé ou RLS) :", notifErr);
        }
        
        // Réinitialiser les champs
        setMontant("");
        setTaux("");

        // Afficher le toast de succès
        const client = clients.find((c: any) => c.id === selectedClientId);
        const agent = agents.find((a: any) => a.id === selectedAgentId);
        setToastTitle("Transaction créée !");
        setToastMessage(`${montantVal.toLocaleString()} XOF → ${usdVal.toFixed(2)} USDT | Client: ${client?.nom_complet || "—"} | Agent: ${agent?.nom || "—"}`);
        setShowToast(true);

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
    try {
      const clientName = target.clientName.value;
      await ClientService.create(clientName);
      setIsClientModalOpen(false);
      const data = await ClientService.getAll();
      setClients(data);
      if (data && data.length > 0) {
        setSelectedClientId(data[data.length - 1].id); // Sélectionner le nouveau client créé
      }
      setToastTitle("Client ajouté !");
      setToastMessage(`Le client "${clientName}" a été créé avec succès.`);
      setShowToast(true);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création du client.");
    }
  };

  const handleCancel = () => {
    setMontant("");
    setTaux("");
    if (clients.length > 0) setSelectedClientId(clients[0].id);
    if (agents.length > 0) setSelectedAgentId(agents[0].id);
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
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)] overflow-hidden" suppressHydrationWarning={true}>
        
        {/* Colonne de Gauche : Historique */}
        <div className="w-full lg:w-1/3 flex flex-col glass-card rounded-2xl p-6 overflow-hidden h-full min-h-[400px] lg:min-h-0">
          <div className="flex flex-col mb-4">
            <h2 className="text-lg font-syne font-bold dark:text-white text-gray-900">
              {role === "DIRECTEUR" ? "Historique Global" : "Mon Travail Journalier"}
            </h2>
            <p className="text-xs text-white/40 font-mono">Registre des transactions</p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1">
            <TransactionsTable transactions={userTransactions} compact={true} />
          </div>
        </div>

        {/* Colonne de Droite : Saisie de Transaction Style Excel & Totaux */}
        <div className="flex-1 flex flex-col justify-between gap-6 h-full overflow-hidden">
          
          {/* Formulaire Excel-like au centre */}
          <div className="flex-1 flex flex-col justify-center items-center glass-card rounded-2xl p-8 relative overflow-y-auto">
            <div className="w-full max-w-4xl space-y-8">
              <div className="text-center">
                <h3 className="text-xl font-syne font-bold text-white mb-2">Nouvelle Opération</h3>
                <p className="text-sm text-white/40 font-mono">Saisissez les informations directement dans les cellules ci-dessous</p>
              </div>

              <form onSubmit={handleCreateTx} className="space-y-8">
                <div className="overflow-x-auto w-full border border-teal/20 rounded-xl bg-charcoal/50">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-teal/10 border-b border-teal/20 text-[11px] font-bold uppercase tracking-wider text-teal">
                        <th className="px-4 py-3 border-r border-teal/20">Montant (XOF)</th>
                        <th className="px-4 py-3 border-r border-teal/20">Taux</th>
                        <th className="px-4 py-3 border-r border-teal/20">USDT (Calculé)</th>
                        <th className="px-4 py-3 border-r border-teal/20">Client</th>
                        <th className="px-4 py-3">Agent</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="divide-x divide-teal/10">
                        {/* Cellule Montant */}
                        <td className="p-3">
                          <input
                            id="montant-input"
                            type="number"
                            value={montant}
                            onChange={e => setMontant(e.target.value)}
                            placeholder="0"
                            className="w-full bg-transparent border-none font-mono text-center text-white focus:outline-none focus:ring-0 focus:text-teal font-bold placeholder:text-white/10"
                            required
                          />
                        </td>
                        {/* Cellule Taux */}
                        <td className="p-3">
                          <select
                            value={taux}
                            onChange={e => setTaux(e.target.value)}
                            className="w-full bg-transparent border-none font-mono text-center text-white focus:outline-none focus:ring-0 focus:text-teal font-bold [&>option]:bg-charcoal [&>option]:text-white"
                            required
                          >
                            <option value="" className="text-white/30 bg-charcoal">Sélectionner</option>
                            {rates.map(r => (
                              <option key={r.id} value={r.valeur} className="bg-charcoal text-white">
                                {r.type} ({r.valeur})
                              </option>
                            ))}
                          </select>
                        </td>
                        {/* Cellule USDT (Calculé - Lecture seule) */}
                        <td className="p-3">
                          <input
                            type="number"
                            value={usd}
                            readOnly
                            className="w-full bg-transparent border-none font-mono text-center text-white/50 focus:outline-none focus:ring-0 font-bold"
                          />
                        </td>
                        {/* Cellule Client */}
                        <td className="p-3">
                          <select
                            value={selectedClientId}
                            onChange={e => setSelectedClientId(e.target.value)}
                            className="w-full bg-transparent border-none text-center text-white focus:outline-none focus:ring-0 focus:text-teal font-bold [&>option]:bg-charcoal [&>option]:text-white"
                            required
                          >
                            <option value="" className="text-white/30 bg-charcoal">Sélectionner</option>
                            {clients.map(c => (
                              <option key={c.id} value={c.id} className="bg-charcoal text-white">
                                {c.nom_complet}
                              </option>
                            ))}
                          </select>
                        </td>
                        {/* Cellule Agent */}
                        <td className="p-3">
                          <select
                            value={selectedAgentId}
                            onChange={e => setSelectedAgentId(e.target.value)}
                            className="w-full bg-transparent border-none text-center text-white focus:outline-none focus:ring-0 focus:text-teal font-bold [&>option]:bg-charcoal [&>option]:text-white"
                            required
                          >
                            <option value="" className="text-white/30 bg-charcoal">Sélectionner</option>
                            {agents.map(a => (
                              <option key={a.id} value={a.id} className="bg-charcoal text-white">
                                {a.nom}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Boutons d'action centrés verticalement */}
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

          {/* Indicateurs de Totaux tout en bas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 glass-card p-6 rounded-2xl">
            <div className="p-2 border-r border-teal/10 last:border-0">
               <h4 className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Total XOF</h4>
               <p className="text-lg font-mono font-bold mt-1 text-white">{metrics.totalXof.toLocaleString()} F</p>
            </div>
            <div className="p-2 border-r border-teal/10 last:border-0">
               <h4 className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Total Vendu (USD)</h4>
               <p className="text-lg font-mono font-bold mt-1 text-teal">{metrics.totalUsd.toLocaleString()} $</p>
            </div>
            <div className="p-2 border-r border-teal/10 last:border-0">
               <h4 className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Total Reçu</h4>
               <p className="text-lg font-mono font-bold mt-1 text-white">{(metrics.totalRecu).toLocaleString()} F</p>
            </div>
            <div className="p-2 last:border-0">
               <h4 className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Restant</h4>
               <p className="text-lg font-mono font-bold mt-1 text-amber">{(metrics.restant).toLocaleString()} F</p>
            </div>
          </div>

        </div>

      </div>

      {/* Modal d'ajout de Client (conservé comme déclenché depuis le Header) */}
      <Modal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} title="Nouveau Client">
        <form onSubmit={handleCreateClient} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Nom complet</label>
              <input name="clientName" className="w-full bg-white/5 p-2 rounded border border-white/10 text-white focus:outline-none focus:border-teal/50" placeholder="Entrez le nom..." required />
            </div>
            <button type="submit" className="w-full bg-teal text-charcoal font-bold p-2 rounded hover:bg-teal-hover transition-colors">Ajouter</button>
        </form>
      </Modal>

      {/* Toast de succès global */}
      <SuccessToast
        show={showToast}
        title={toastTitle}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
    </AppShell>
  );
}
