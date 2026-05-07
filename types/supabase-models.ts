export interface Transaction {
  id: string;
  ref: string;
  amount: number;
  rate: number;
  usdValue: number;
  clientId: string;
  clientName?: string;
  agentId: string;
  agentName?: string;
  status: 'EN_ATTENTE' | 'EN_CONFIRMATION' | 'VALIDÉ' | 'ENVOYÉ' | 'ANNULÉ';
  date: string;
}

export interface Client {
  id: string;
  name: string;
}

export interface Rate {
  id: string;
  type: string;
  value: number;
}

export interface Agent {
  id: string;
  name: string;
  transactions: number;
  ca: number;
  role: 'DIRECTEUR' | 'AGENT_PRINCIPAL' | 'AGENT';
}
