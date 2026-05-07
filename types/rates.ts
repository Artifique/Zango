export interface Rate {
  id: string;
  type: "Taux normal" | "Taux grossiste" | "Taux intermediaire";
  amount: number;
}
