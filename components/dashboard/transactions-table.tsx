"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import * as XLSX from 'xlsx-js-style';
import { Transaction } from "../../types/supabase-models";
import { cn } from "../../lib/utils";

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

  const exportToExcel = () => {
    const totalMontant = transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const totalUsd = transactions.reduce((acc, t) => acc + (Number(t.usdValue) || 0), 0);
    const totalRecu = totalMontant * 0.3;
    const restant = totalMontant * 0.7;

    const dataToExport = transactions.map(t => ({
      Montant: t.amount || 0,
      Taux: t.rate || "N/A",
      USDT: t.usdValue || 0,
      Client: t.clientName || "N/A",
      Agent: t.agentName || "N/A",
      Date: t.date || ""
    }));

    dataToExport.push({ Montant: "---", Taux: "---", USDT: "---", Client: "---", Agent: "---", Date: "---" } as any);
    dataToExport.push({ Montant: "Total XOF:", Taux: totalMontant, USDT: "", Client: "", Agent: "", Date: "" } as any);
    dataToExport.push({ Montant: "Total Vendu (USDT):", Taux: totalUsd, USDT: "", Client: "", Agent: "", Date: "" } as any);
    dataToExport.push({ Montant: "Total Reçu:", Taux: totalRecu, USDT: "", Client: "", Agent: "", Date: "" } as any);
    dataToExport.push({ Montant: "Restant:", Taux: restant, USDT: "", Client: "", Agent: "", Date: "" } as any);

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Style pour l'en-tête et les cellules
    const borderStyle = { style: 'thin', color: { rgb: "000000" } };
    const headerStyle = {
      fill: { fgColor: { rgb: "00E5C3" } },
      font: { bold: true, color: { rgb: "0D0F14" } },
      border: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
      alignment: { horizontal: "center" }
    };
    
    const cellStyle = {
      border: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle }
    };

    // Appliquer le style
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({c: C, r: R});
        if (!worksheet[address]) continue;
        
        if (R === 0) {
          worksheet[address].s = headerStyle;
        } else {
          worksheet[address].s = cellStyle;
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "Transactions_Kalyce.xlsx");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
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
        <button onClick={exportToExcel} className="flex items-center gap-2 bg-teal/10 text-teal px-4 py-2 rounded-lg text-sm font-bold hover:bg-teal/20">
          <Download className="w-4 h-4" /> Exporter Excel
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-teal/20 bg-charcoal/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-teal/10 border-b border-teal/20 text-[11px] font-bold uppercase tracking-wider text-teal">
              <th className="px-6 py-4 border-r border-teal/20">Montant</th>
              <th className="px-6 py-4 border-r border-teal/20">Taux</th>
              <th className="px-6 py-4 border-r border-teal/20">USDT</th>
              <th className="px-6 py-4 border-r border-teal/20">Client</th>
              <th className="px-6 py-4 border-r border-teal/20">Agent</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-teal/10">
            {paginated.map((tx) => (
              <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-sm border-r border-teal/10">{tx.amount ? tx.amount.toLocaleString() : "0"}</td>
                <td className="px-6 py-4 font-mono text-sm border-r border-teal/10">{tx.rate || "N/A"}</td>
                <td className="px-6 py-4 font-mono text-sm border-r border-teal/10">{tx.usdValue ? tx.usdValue.toLocaleString() : "0"}</td>
                <td className="px-6 py-4 text-sm border-r border-teal/10">{tx.clientName || "N/A"}</td>
                <td className="px-6 py-4 text-sm border-r border-teal/10">{tx.agentName || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-white/50">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-white/40 px-6">
        <span>Page {currentPage} de {Math.ceil(filtered.length / itemsPerPage) || 1}</span>
        <div className="flex gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="p-2 hover:bg-white/5 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => setCurrentPage(p => p + 1)} className="p-2 hover:bg-white/5 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
