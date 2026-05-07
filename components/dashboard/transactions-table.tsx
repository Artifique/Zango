"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Transaction } from "../../types/supabase-models";

export function TransactionsTable({ 
  transactions 
}: { 
  transactions: Transaction[]
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = useMemo(() => {
    return transactions.filter(t => 
      t.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.agentName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  return (
    <div className="space-y-4">
      <div className="relative group w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-teal/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">
              <th className="px-6 py-4">Montant</th>
              <th className="px-6 py-4">Taux</th>
              <th className="px-6 py-4">USD</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Agent</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginated.map((tx) => (
              <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-sm">{tx.amount.toLocaleString()}</td>
                <td className="px-6 py-4 font-mono text-sm">{tx.rate || "N/A"}</td>
                <td className="px-6 py-4 font-mono text-sm">{tx.usdValue?.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">{tx.clientName || "N/A"}</td>
                <td className="px-6 py-4 text-sm">{tx.agentName || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-white/50">{tx.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-white/10 rounded-lg text-teal">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-white/40">
        <span>Page {currentPage} de {Math.ceil(filtered.length / itemsPerPage) || 1}</span>
        <div className="flex gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="p-2 hover:bg-white/5 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => setCurrentPage(p => p + 1)} className="p-2 hover:bg-white/5 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
