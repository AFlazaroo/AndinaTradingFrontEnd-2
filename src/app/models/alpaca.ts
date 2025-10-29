export interface AccountBalance {
  equity: number;
  cash: number;
  buyingPower: number;
}

export interface AlpacaAsset {
  symbol: string;
  name: string;
  exchange: string;
  tradable: boolean;
  status?: string;
  class?: string;
}

export interface AlpacaQuote {
  symbol: string;
  askPrice: number;
  bidPrice: number;
  askSize?: number;
  bidSize?: number;
  timestamp?: string;
}

export interface AlpacaPosition {
  symbol: string;
  qty: number;
  avgEntryPrice: number;
  currentPrice: number;
  unrealizedPl?: number;
  marketValue?: number;
}

export interface CandleData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandleData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
}