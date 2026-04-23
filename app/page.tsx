"use client";

import { useState } from "react";
import { KPISection } from "../components/dashboard/kpi-section";
import { TransactionsTable } from "../components/dashboard/transactions-table";
import { ActivityFeed } from "../components/dashboard/activity-feed";
import { VolumeChart } from "../components/dashboard/volume-chart";
import { AgentPerformance } from "../components/dashboard/agent-performance";
import { TransactionSlideOver } from "../components/panels/transaction-slide-over";
import { NewTransactionModal } from "../components/modals/new-transaction-modal";
import { MOCK_TRANSACTIONS } from "../data/mock-data";
import { Transaction } from "../types/crypto";
import { Plus } from "lucide-react";
import { AppShell } from "../views/layout/app-shell";
import { useRoleController } from "../controllers/role-controller";

export default function DashboardPage() {
  const { role } = useRoleController();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AppShell>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-syne font-extrabold tracking-tight">Vue d'ensemble</h2>
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest mt-1">
                Bienvenue, Alex. Vos opérations sont synchronisées.
              </p>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-teal text-charcoal px-5 py-2.5 rounded-xl font-syne font-bold text-sm hover:bg-teal-hover transition-all shadow-[0_0_20px_rgba(0,229,195,0.2)] group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Nouvelle Transaction
            </button>
          </div>

          <KPISection role={role} />

          <div className="grid grid-cols-12 gap-8">
            {/* Main Content Area */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              <TransactionsTable 
                transactions={MOCK_TRANSACTIONS} 
                onSelect={(tx) => setSelectedTx(tx)} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7">
                  <VolumeChart />
                </div>
                <div className="lg:col-span-5">
                  <AgentPerformance role={role} />
                </div>
              </div>
            </div>

            {/* Sidebar Activity Area */}
            <div className="col-span-12 lg:col-span-4 h-full">
              <ActivityFeed />
            </div>
          </div>
        

      {/* Overlays */}
      <TransactionSlideOver 
        transaction={selectedTx} 
        onClose={() => setSelectedTx(null)} 
      />
      
      <NewTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </AppShell>
  );
}
