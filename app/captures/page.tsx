"use client";

import { AppShell } from "../../views/layout/app-shell";
import { MOCK_TRANSACTIONS } from "../../data/mock-data";
import { useMemo } from "react";
import { useWorkflowController } from "../../controllers/workflow-controller";

export default function CapturesPage() {
  const pendingCaptures = MOCK_TRANSACTIONS.filter(
    (tx) => tx.status === "CAPTURE_RECUE" || tx.status === "EN_CONFIRMATION",
  );
  const { uploadedByTx, requestedByTx, uploadCapture, requestConfirmation } = useWorkflowController();
  const uploadedCount = useMemo(() => Object.keys(uploadedByTx).length, [uploadedByTx]);

  return (
    <AppShell>
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-syne font-extrabold">Captures à vérifier</h2>
          <p className="text-xs font-mono text-white/50 mt-1 uppercase tracking-wider">
            {uploadedCount} capture(s) uploadée(s) en session
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingCaptures.map((tx) => (
            <article key={tx.id} className="glass-card rounded-2xl p-5 border border-amber/20">
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs font-bold text-amber">{tx.ref}</span>
                <span className="text-[10px] uppercase font-mono text-white/40">{tx.status.replace("_", " ")}</span>
              </div>
              <p className="font-bold mb-1">{tx.operationLabel}</p>
              <p className="text-sm text-white/50 mb-1">Upload par: {tx.uploadedByAgent}</p>
              <p className="text-sm text-white/50 mb-4">Wallet destination: {tx.walletAddress}</p>
              {uploadedByTx[tx.id]?.previewUrl ? (
                <img
                  src={uploadedByTx[tx.id].previewUrl}
                  alt={`Capture ${tx.ref}`}
                  className="aspect-video w-full object-cover rounded-xl border border-white/10"
                />
              ) : (
                <div className="aspect-video rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 text-xs font-mono">
                  Aperçu capture paiement
                </div>
              )}
              {uploadedByTx[tx.id]?.fileName ? (
                <p className="text-[11px] font-mono text-teal mt-2">Fichier: {uploadedByTx[tx.id].fileName}</p>
              ) : null}
              <p className="text-[11px] text-amber/80 font-mono mt-3">
                Cette capture doit être confirmée par un autre agent avant envoi.
              </p>
              <div className="mt-4 space-y-3">
                <label className="block text-[11px] text-white/60 font-mono">Uploader la capture</label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-xs text-white/60 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-white/10 file:text-white"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    uploadCapture(tx.id, file);
                  }}
                />
                <button
                  type="button"
                  disabled={!uploadedByTx[tx.id]}
                  onClick={() => requestConfirmation(tx.id)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold bg-amber text-charcoal disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Demander confirmation croisée
                </button>
                {requestedByTx[tx.id] ? (
                  <p className="text-[11px] font-mono text-success">Demande envoyée à un autre agent.</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
