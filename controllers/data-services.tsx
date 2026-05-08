import { supabase } from "../lib/supabase";

export const ClientService = {
  async getAll() {
    const { data, error } = await supabase.from("clients").select("*");
    if (error) throw error;
    return data;
  },
  async create(name: string) {
    const { data, error } = await supabase.from("clients").insert([{ nom_complet: name }]);
    if (error) throw error;
    return data;
  }
};

export const RateService = {
  async getAll() {
    const { data, error } = await supabase.from("rates").select("*");
    if (error) throw error;
    return data;
  },
  async create(type: string, value: number) {
    const { data, error } = await supabase.from("rates").insert([{ type, valeur: value }]);
    if (error) throw error;
    return data;
  }
};

export const AgentService = {
  async getAll() {
    const { data, error } = await supabase.from("agents").select("*");
    if (error) throw error;
    return data;
  },
  async create(nom: string, email: string) {
    const { error: profileError } = await supabase.from("agents").insert([{
      nom,
      email,
      role: 'AGENT'
    }]);

    if (profileError) {
      console.error("Erreur insertion profil:", profileError);
      throw profileError;
    }
  }
};

export const NotificationService = {
  async getAllForUser(userId: string) {
    const { data, error } = await supabase
      .from("notifications")
      .select("*, transactions(montant, date_transaction)")
      .or(`recipient_id.eq.${userId},sender_id.eq.${userId}`);
    if (error) throw error;
    return data;
  },

  async send(txId: string, recipientId: string, senderId: string, message: string) {
    const { data, error } = await supabase
      .from("notifications")
      .insert([{ tx_id: txId, recipient_id: recipientId, sender_id: senderId, message, status: 'pending' }]);
    if (error) throw error;
    return data;
  },

  async confirm(notifId: string) {
    const { data, error } = await supabase
      .from("notifications")
      .update({ status: 'confirmed' })
      .eq('id', notifId);
    if (error) throw error;
    return data;
  }
};
