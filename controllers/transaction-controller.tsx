import { supabase } from "../lib/supabase";
import { Transaction } from "../types/supabase-models";

export const TransactionService = {
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *, 
        clients(nom_complet), 
        agent_info:agents!transactions_agent_id_fkey(nom)
      `);
      
    if (error) throw error;
    
    return data.map((d: any) => ({
      id: d.id,
      ref: d.ref,
      amount: d.montant,
      rate: d.taux,
      usdValue: d.usd_value,
      clientId: d.client_id,
      agentId: d.agent_id,
      status: d.statut,
      date: new Date(d.date_transaction).toLocaleDateString(),
      clientName: d.clients?.nom_complet,
      agentName: d.agent_info?.nom
    }));
  },
  
  async updateStatus(txId: string, status: string) {
    const { data, error } = await supabase
      .from("transactions")
      .update({ statut: status })
      .eq("id", txId);
    if (error) throw error;
    return data;
  },
  
  async create(tx: any) {
    const { data, error } = await supabase.from("transactions").insert([{
        montant: tx.amount,
        taux: tx.rate,
        usd_value: tx.usdValue,
        client_id: tx.clientId,
        agent_id: tx.agentId,
        statut: tx.status,
        date_transaction: tx.date
    }]).select('id').single();
    if (error) throw error;
    return data;
  }
};
