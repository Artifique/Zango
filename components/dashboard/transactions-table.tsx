"use client";

import { motion } from "framer-motion";
import { ExternalLink, MoreVertical, CheckCircle2, Clock, AlertCircle, XCircle, Send } from "lucide-react";
import { Transaction, TransactionStatus } from "../../types/crypto";
import { cn, formatCurrency } from "../../lib/utils";

const STATUS_CONFIG: Record<TransactionStatus, { label: string, color: string, icon: any, pulse?: boolean }> = {
  EN_ATTENTE: { label: "En attente", color: "text-white/40 bg-white/5", icon: Clock },
  CAPTURE_RECUE: { label: "Capture reçue", color: "text-amber bg-amber/10", icon: AlertCircle, pulse: true },
  EN_CONFIRMATION: { label: "Confirmation", color: "text-blue-400 bg-blue-400/10", icon: MoreVertical },
  VALIDÉ: { label: "Validé", color: "text-teal bg-teal/10", icon: CheckCircle2 },
  ENVOYÉ: { label: "Envoyé", color: "text-success bg-success/10", icon: Send },
  ANNULÉ: { label: "Annulé", color: "text-danger bg-danger/10", icon: XCircle },
};

export function TransactionsTable({ 
  transactions, 
  onSelect 
}: { 
  transactions: Transaction[], 
  onSelect: (tx: Transaction) => void 
}) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-syne font-bold text-lg">Transactions récentes</h3>
        <button className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal hover:text-teal/70 transition-colors">
          Voir tout
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-white/30">#REF</th>
              <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-white/30">Opération</th>
              <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-white/30">Crypto</th>
              <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-white/30">Montant</th>
              <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-white/30">Statut</th>
              <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-white/30 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {transactions.map((tx, idx) => {
              const status = STATUS_CONFIG[tx.status];
              return (
                <motion.tr 
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  onClick={() => onSelect(tx)}
                  className="group hover:bg-white/[0.03] cursor-pointer transition-colors relative"
                >
                  <td className="px-6 py-5">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="font-mono text-xs font-bold text-white/80">{tx.ref}</span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-white/90">{tx.operationLabel}</p>
                    <p className="text-[10px] text-white/30 font-mono">Upload: {tx.uploadedByAgent}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-mono font-bold text-teal/80 bg-teal/5 px-2 py-1 rounded border border-teal/10">
                      {tx.cryptoType}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-mono text-xs font-bold">{tx.amount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit",
                      status.color,
                      status.pulse && "animate-pulse-slow"
                    )}>
                      <status.icon className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{status.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 group-hover:text-teal group-hover:border-teal/30 group-hover:bg-teal/5 transition-all">
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
