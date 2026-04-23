"use client";

import { AppShell } from "../../views/layout/app-shell";
import { MOCK_TRANSACTIONS } from "../../data/mock-data";
import { formatCurrency } from "../../lib/utils";
import { useState } from "react";

export default function TransactionsPage() {
  const [flags, setFlags] = useState<Record<string, string>>({});

  return (
    <AppShell>
      <section className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-2xl font-syne font-extrabold mb-2">Registre des transactions</h2>
          <p className="text-white/40 font-mono text-xs uppercase tracking-wider">
            Vision complète des ventes, validations et envois crypto.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-white/30 text-[10px] font-mono uppercase tracking-widest">
                <th className="px-6 py-4">Réf</th>
                <th className="px-6 py-4">Opération</th>
                <th className="px-6 py-4">Crypto</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {MOCK_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-teal">{tx.ref}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold">{tx.operationLabel}</p>
                    <p className="text-[11px] text-white/40">Upload capture: {tx.uploadedByAgent}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">{tx.cryptoType}</td>
                  <td className="px-6 py-4 text-xs font-mono font-bold">{formatCurrency(tx.amount, tx.cryptoType)}</td>
                  <td className="px-6 py-4 text-[11px] uppercase tracking-wide text-white/70">{tx.status.replace("_", " ")}</td>
                  <td className="px-6 py-4 text-xs text-white/50">{new Date(tx.date).toLocaleString("fr-FR")}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFlags((prev) => ({ ...prev, [tx.id]: "Capture uploadée" }))}
                        className="px-2.5 py-1 rounded-md text-[11px] bg-white/10 hover:bg-white/20"
                      >
                        Upload capture
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlags((prev) => ({ ...prev, [tx.id]: "Confirmation demandée" }))}
                        className="px-2.5 py-1 rounded-md text-[11px] bg-amber text-charcoal font-semibold"
                      >
                        Demander confirmation
                      </button>
                    </div>
                    {flags[tx.id] ? <p className="text-[10px] mt-1 font-mono text-teal">{flags[tx.id]}</p> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
