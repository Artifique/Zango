"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Clock, Wallet, User, Copy, Image as ImageIcon, ArrowRight } from "lucide-react";
import { Transaction } from "../../types/crypto";
import { cn } from "../../lib/utils";

interface SlideOverProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export function TransactionSlideOver({ transaction, onClose }: SlideOverProps) {
  if (!transaction) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex justify-end overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-[480px] bg-charcoal border-l border-white/5 h-screen overflow-y-auto flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-charcoal/80 backdrop-blur-xl z-10">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-teal bg-teal/10 px-2 py-1 rounded border border-teal/20">
                {transaction.ref}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              <span className="text-[10px] font-mono text-white/40 uppercase font-bold">Détails de l'opération</span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/40" />
            </button>
          </div>

          <div className="p-8 space-y-10 flex-1">
            {/* Amount Section */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono font-bold uppercase text-white/20 tracking-widest">Montant à recevoir</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-mono font-bold text-white tracking-tighter">
                  {transaction.amount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xl font-syne font-bold text-teal">{transaction.cryptoType}</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/40">
                  <User className="w-3 h-3" />
                  <span className="text-[10px] font-mono font-bold uppercase">Opération</span>
                </div>
                <p className="text-xs font-bold">{transaction.operationLabel}</p>
                <p className="text-[10px] text-white/20 font-mono">Upload capture: {transaction.uploadedByAgent}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/40">
                  <Wallet className="w-3 h-3" />
                  <span className="text-[10px] font-mono font-bold uppercase">Numéro Agent</span>
                </div>
                <p className="text-xs font-bold text-teal">{transaction.agentNumber}</p>
              </div>
            </div>

            {/* Wallet Section */}
            <div className="space-y-3 p-4 bg-white/[0.03] rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/40">
                  <ImageIcon className="w-3 h-3" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Wallet Client</span>
                </div>
                <button className="text-[10px] font-mono font-bold text-teal/40 hover:text-teal">
                  Copier
                </button>
              </div>
              <p className="font-mono text-[11px] text-white/80 break-all leading-relaxed">
                {transaction.walletAddress}
              </p>
            </div>

            {/* Capture Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-mono font-bold uppercase text-white/20 tracking-widest">Capture de paiement</h4>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase border border-success/20">
                  Valide
                </div>
              </div>
              <div className="aspect-[4/3] w-full bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group cursor-zoom-in relative overflow-hidden">
                <ImageIcon className="w-12 h-12 text-white/10 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-teal/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Confirmation Timeline */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-mono font-bold uppercase text-white/20 tracking-widest">Timeline de confirmation</h4>
              <div className="space-y-6">
                {transaction.confirmationSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    {idx !== transaction.confirmationSteps.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-[-24px] w-px bg-white/5" />
                    )}
                    <div className={cn(
                      "w-[19px] h-[19px] rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-colors",
                      step.status === "COMPLETED" ? "bg-teal border-teal text-charcoal" : 
                      step.status === "CURRENT" ? "bg-charcoal border-amber animate-pulse" : "bg-charcoal border-white/10"
                    )}>
                      {step.status === "COMPLETED" && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                      {step.status === "CURRENT" && <div className="w-1 h-1 rounded-full bg-amber" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <p className={cn(
                          "text-xs font-bold truncate",
                          step.status === "PENDING" ? "text-white/20" : "text-white"
                        )}>{step.label}</p>
                        {step.timestamp && <span className="text-[10px] font-mono text-white/20 ml-4">{step.timestamp}</span>}
                      </div>
                      {step.agentName && <p className="text-[10px] text-teal/60 font-medium">Validé par {step.agentName}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 border-t border-white/5 bg-charcoal/50 backdrop-blur-xl sticky bottom-0 grid grid-cols-2 gap-4">
            <button className="py-4 rounded-xl border border-white/10 hover:bg-white/5 font-syne font-bold text-sm transition-all text-white/60">
              Annuler
            </button>
            <button className="py-4 rounded-xl bg-teal text-charcoal font-syne font-bold text-sm transition-all hover:bg-teal-hover shadow-[0_0_20px_rgba(0,229,195,0.2)] flex items-center justify-center gap-2 group">
              Valider & Envoyer
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
