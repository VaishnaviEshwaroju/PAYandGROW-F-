export interface Transaction {
  id: string;
  vendor: string;
  amount: number;
  date: string;
  type: 'payment' | 'deposit' | 'withdrawal'; // <-- Add "withdrawal"
  roundedAmount: number;
  multiplier: number;
}

export interface RewardSuggestion {
  vendor: string;
  offer: string;
  details: string;
}

export interface InvestmentSuggestion {
  name: string;
  type: 'Stock' | 'Mutual Fund' | 'ETF' | 'Crypto';
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface Badges {
  bronze: number;
  silver: number;
  gold: number;
}

export interface User {
    name: string;
    accountBalance: number;
    totalSaved: number;
    badges: Badges;
    phone: string;
    bankAccount: string;
}