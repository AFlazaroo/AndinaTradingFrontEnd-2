export interface Market {
  id: number;
  symbol: string;
  title: string;
  threshold: number;
  expiry: string;
  yesPrice: number;
  noPrice: number;
  resolved: boolean;
  outcome: 'yes' | 'no' | null;
}