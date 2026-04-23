import { AppShell } from "../../views/layout/app-shell";
import { MOCK_TRANSACTIONS } from "../../data/mock-data";
import { formatCurrency } from "../../lib/utils";

export default function BalancePage() {
  const total = MOCK_TRANSACTIONS.reduce((sum, tx) => sum + tx.amount, 0);
  const available = total * 0.32;

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-success/20">
            <p className="text-xs font-mono text-white/40 uppercase mb-2">Solde disponible</p>
            <p className="text-3xl font-mono font-bold text-success">{formatCurrency(available)}</p>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-teal/20">
            <p className="text-xs font-mono text-white/40 uppercase mb-2">Volume traité</p>
            <p className="text-3xl font-mono font-bold text-teal">{formatCurrency(total)}</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-syne text-xl font-bold mb-4">Derniers mouvements</h2>
          <ul className="space-y-2 text-sm">
            {MOCK_TRANSACTIONS.slice(0, 4).map((tx) => (
              <li key={tx.id} className="flex justify-between border-b border-white/5 pb-2">
                <span>{tx.ref} - {tx.operationLabel}</span>
                <span className="font-mono">{formatCurrency(tx.amount, tx.cryptoType)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AppShell>
  );
}
