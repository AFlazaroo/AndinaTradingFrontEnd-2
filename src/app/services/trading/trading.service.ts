// src/app/services/trading.service.ts
import { Injectable } from '@angular/core';

export interface TradeHistory {
  currency: string;
  date: string;
  balance: string;
  adjustment: string;
}

export interface TradeDuration {
  hour: number;
  minute: number;
  second: number;
}

@Injectable({ providedIn: 'root' })
export class TradingService {
  private localStorageKey = 'TheTradingGame';

  public balance: number = 1000;
  public wager: number = 100;
  public duration: TradeDuration = { hour: 0, minute: 0, second: 5 };
  public history: TradeHistory[] = [];
  public activeTrade: boolean = false;

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    const saved = localStorage.getItem(this.localStorageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      this.balance = parsed.balance || 1000;
      this.wager = parsed.wager || 100;
      this.duration = parsed.duration || { hour: 0, minute: 0, second: 5 };
      this.history = parsed.history || [];
      this.activeTrade = parsed.activeTrade || false;
    }
  }

  public saveState(): void {
    const state = {
      balance: this.balance,
      wager: this.wager,
      duration: this.duration,
      history: this.history,
      activeTrade: this.activeTrade
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(state));
  }

  public updateBalance(newBalance: number): void {
    this.balance = newBalance;
    this.history = []; // Reset history on balance reset
    this.saveState();
  }

  public updateWager(newWager: number): void {
    this.wager = newWager;
    this.saveState();
  }

  public updateDuration(newDuration: TradeDuration): void {
    this.duration = newDuration;
    this.saveState();
  }

  public recordTrade(adjustment: number): void {
    this.balance += adjustment;
    this.history.unshift({
      currency: 'BTC/USDT',
      date: new Date().toLocaleString(),
      balance: `$${this.balance.toLocaleString()}`,
      adjustment: `${adjustment > 0 ? '+' : ''}${adjustment}`
    });
    this.saveState();
  }
}
