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
  }
};
