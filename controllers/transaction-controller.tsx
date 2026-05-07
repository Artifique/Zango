import { supabase } from "../lib/supabase";
import { Transaction } from "../types/supabase-models";

export const TransactionService = {
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase.from("transactions").select("*, clients(nom_complet), agents(nom)");
    if (error) throw error;
    return data.map((d: any) => ({
      ...d,
      clientName: d.clients?.nom_complet,
      agentName: d.agents?.nom
    }));
  },
  
  async create(tx: Omit<Transaction, 'id'>) {
    const { data, error } = await supabase.from("transactions").insert([tx]);
    if (error) throw error;
    return data;
  }
};
