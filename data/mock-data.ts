import { Transaction, AgentPerformance, ActivityEvent } from "../types/crypto";

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    ref: "TXN-0042",
    operationLabel: "Achat desk OTC matin",
    uploadedByAgent: "Agent Sarah",
    cryptoType: "USDT",
    amount: 1240.50,
    agentNumber: "AG-7822",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    status: "VALIDÉ",
    date: "2024-03-15T10:30:00Z",
    confirmationSteps: [
      { label: "Transaction créée", status: "COMPLETED", timestamp: "10:30" },
      { label: "Capture reçue", status: "COMPLETED", timestamp: "10:35" },
      { label: "Confirmation reçue", status: "COMPLETED", agentName: "Agent Sarah", timestamp: "10:45" },
      { label: "Crypto envoyées", status: "PENDING" },
    ],
  },
  {
    id: "2",
    ref: "TXN-0041",
    operationLabel: "Recharge pool liquidité",
    uploadedByAgent: "Agent Marc",
    cryptoType: "USDT",
    amount: 500.00,
    agentNumber: "AG-7822",
    walletAddress: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    status: "CAPTURE_RECUE",
    date: "2024-03-15T11:15:00Z",
    confirmationSteps: [
      { label: "Transaction créée", status: "COMPLETED", timestamp: "11:15" },
      { label: "Capture reçue", status: "COMPLETED", timestamp: "11:20" },
      { label: "Confirmation reçue", status: "CURRENT" },
      { label: "Crypto envoyées", status: "PENDING" },
    ],
  },
  {
    id: "3",
    ref: "TXN-0040",
    operationLabel: "Exécution bloc BTC",
    uploadedByAgent: "Agent Julie",
    cryptoType: "BTC",
    amount: 0.045,
    agentNumber: "AG-7822",
    walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    status: "ENVOYÉ",
    date: "2024-03-15T09:45:00Z",
    confirmationSteps: [
      { label: "Transaction créée", status: "COMPLETED", timestamp: "09:45" },
      { label: "Capture reçue", status: "COMPLETED", timestamp: "09:50" },
      { label: "Confirmation reçue", status: "COMPLETED", agentName: "Agent Marc", timestamp: "10:00" },
      { label: "Crypto envoyées", status: "COMPLETED", timestamp: "10:10" },
    ],
  },
  {
    id: "4",
    ref: "TXN-0039",
    operationLabel: "Approvisionnement wallet opérationnel",
    uploadedByAgent: "Agent Thomas",
    cryptoType: "USDT",
    amount: 2100.00,
    agentNumber: "AG-7822",
    walletAddress: "0x1234567890123456789012345678901234567890",
    status: "EN_CONFIRMATION",
    date: "2024-03-15T12:00:00Z",
    confirmationSteps: [
      { label: "Transaction créée", status: "COMPLETED", timestamp: "12:00" },
      { label: "Capture reçue", status: "COMPLETED", timestamp: "12:05" },
      { label: "Confirmation reçue", status: "CURRENT" },
      { label: "Crypto envoyées", status: "PENDING" },
    ],
  },
];

export const MOCK_AGENTS: AgentPerformance[] = [
  { id: "a1", name: "Sarah K.", initials: "SK", transactionsToday: 14, status: "online" },
  { id: "a2", name: "Marc L.", initials: "ML", transactionsToday: 9, status: "online" },
  { id: "a3", name: "Julie B.", initials: "JB", transactionsToday: 11, status: "offline" },
  { id: "a4", name: "Thomas R.", initials: "TR", transactionsToday: 5, status: "online" },
];

export const MOCK_EVENTS: ActivityEvent[] = [
  { id: "e1", type: "CONFIRMATION", message: "Agent Sarah a confirmé la transaction #TXN-0042", timestamp: "Il y a 2 min" },
  { id: "e2", type: "CAPTURE", message: "Nouvelle capture reçue pour #TXN-0039", timestamp: "Il y a 10 min" },
  { id: "e3", type: "SEND", message: "Transaction #TXN-0041 envoyée au portefeuille", timestamp: "Il y a 25 min" },
];
