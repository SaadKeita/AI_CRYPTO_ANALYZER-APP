export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
}

export interface InvestmentAnalysis {
  potentialReturn: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  description: string;
}