export interface NavigationItem {
  label: string;
  href: string;
  badge?: number;
}

export const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard Overview",
  "/transactions": "Transactions",
  "/captures": "Captures",
  "/confirmations": "Confirmations",
  "/notifications": "Notifications",
  "/agents": "Agents",
  "/balance": "Mon Solde",
  "/settings": "Paramètres",
};
