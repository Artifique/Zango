export type Role = "AGENT_PRINCIPAL" | "DIRECTEUR" | "AGENT";

export type TransactionStatus = 
  | "EN_ATTENTE" 
  | "CAPTURE_RECUE" 
  | "EN_CONFIRMATION" 
  | "VALIDÉ" 
  | "ENVOYÉ" 
  | "ANNULÉ";

export interface Transaction {
  id: string;
  ref: string;
  operationLabel: string;
  uploadedByAgent: string;
  cryptoType: "USDT" | "BTC" | "ETH" | "BNB";
  amount: number;
  agentNumber: string;
  walletAddress: string;
  status: TransactionStatus;
  date: string;
  captureUrl?: string;
  confirmationSteps: ConfirmationStep[];
}

export interface ConfirmationStep {
  label: string;
  status: "COMPLETED" | "CURRENT" | "PENDING";
  agentName?: string;
  timestamp?: string;
}

export interface ActivityEvent {
  id: string;
  type: "CONFIRMATION" | "CAPTURE" | "SEND" | "NEW_TX";
  message: string;
  timestamp: string;
}

export interface AgentPerformance {
  id: string;
  name: string;
  initials: string;
  transactionsToday: number;
  status: "online" | "offline";
}
