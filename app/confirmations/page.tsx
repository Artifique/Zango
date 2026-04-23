"use client";

import { AppShell } from "../../views/layout/app-shell";
import { MOCK_TRANSACTIONS } from "../../data/mock-data";
import { useWorkflowController } from "../../controllers/workflow-controller";

export default function ConfirmationsPage() {
  const waiting = MOCK_TRANSACTIONS.filter((tx) => tx.status === "EN_CONFIRMATION" || tx.status === "CAPTURE_RECUE");
  const { uploadedByTx, requestedByTx, decisionsByTx, setDecision } = useWorkflowController();

  return (
    <AppShell>
      <section className="glass-card rounded-2xl p-6">
        <h2 className="text-2xl font-syne font-extrabold mb-5">File de confirmations</h2>
        <div className="space-y-5">
          {waiting.map((tx) => (
            <div key={tx.id} className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold">{tx.ref} - {tx.operationLabel}</p>
                <span className="text-[10px] uppercase font-mono text-amber">{tx.status.replace("_", " ")}</span>
              </div>
              <p className="text-[11px] text-white/50 mb-2">Capture uploadée par {tx.uploadedByAgent} (validation croisée requise)</p>
              {uploadedByTx[tx.id]?.previewUrl ? (
                <img
                  src={uploadedByTx[tx.id].previewUrl}
                  alt={`Capture à confirmer ${tx.ref}`}
                  className="aspect-video w-full max-w-md object-cover rounded-xl border border-white/10 mb-3"
                />
              ) : (
                <div className="mb-3 w-full max-w-md aspect-video rounded-xl border border-dashed border-white/20 flex items-center justify-center text-[11px] font-mono text-white/40">
                  Aucune image uploadée pour cette transaction
                </div>
              )}
              {requestedByTx[tx.id] ? (
                <p className="text-[11px] font-mono text-amber mb-2">Demande de confirmation reçue.</p>
              ) : null}
              <ul className="space-y-1 text-xs text-white/60">
                {tx.confirmationSteps.map((step, index) => (
                  <li key={`${tx.id}-${index}`}>
                    - {step.label} ({step.status})
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDecision(tx.id, "APPROUVÉE")}
                  className="px-3 py-1.5 rounded-lg bg-success text-charcoal text-xs font-bold"
                >
                  Confirmer
                </button>
                <button
                  type="button"
                  onClick={() => setDecision(tx.id, "REJETÉE")}
                  className="px-3 py-1.5 rounded-lg bg-danger text-white text-xs font-bold"
                >
                  Rejeter
                </button>
                <button
                  type="button"
                  onClick={() => setDecision(tx.id, "ENVOYÉE")}
                  className="px-3 py-1.5 rounded-lg border border-teal text-teal text-xs font-bold"
                >
                  Valider & Envoyer
                </button>
              </div>
              {decisionsByTx[tx.id] ? (
                <p className="mt-2 text-[11px] font-mono text-teal">Statut action: {decisionsByTx[tx.id]}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
