"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Wallet, User, Globe, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewTransactionModal({ isOpen, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-charcoal border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center border border-teal/20">
                  <Plus className="w-5 h-5 text-teal" />
                </div>
                <h3 className="font-syne font-bold text-lg">Nouvelle Transaction</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/40" />
              </button>
            </div>

            <form className="p-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-white/40 ml-1">Libellé opération</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="text" placeholder="ex: Recharge desk OTC" className="glass-input w-full pl-10 text-xs" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-white/40 ml-1">Agent uploader</label>
                  <input type="text" placeholder="Agent Sarah" className="glass-input w-full text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-white/40 ml-1">Crypto-monnaie</label>
                  <select className="glass-input w-full text-xs appearance-none">
                    <option>USDT</option>
                    <option>BTC</option>
                    <option>ETH</option>
                    <option>BNB</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-white/40 ml-1">Montant</label>
                  <div className="relative">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] font-bold text-teal">USDT</span>
                    <input type="number" placeholder="0.00" className="glass-input w-full pr-12 text-xs font-mono" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase text-white/40 ml-1">Adresse Wallet Client</label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input type="text" placeholder="0x..." className="glass-input w-full pl-10 text-xs font-mono" />
                </div>
              </div>

              <div className="p-4 bg-amber/5 border border-amber/10 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber shrink-0" />
                <p className="text-[10px] text-amber/80 leading-relaxed font-medium">
                  Les captures doivent être uploadées par un agent et confirmées par un autre agent avant envoi crypto.
                </p>
              </div>

              <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal to-blue-500 text-charcoal font-syne font-extrabold text-sm hover:opacity-90 transition-all shadow-[0_0_30px_rgba(0,229,195,0.3)] mt-4">
                CRÉER LA TRANSACTION
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
