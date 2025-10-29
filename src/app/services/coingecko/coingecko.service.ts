import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class CoingeckoService {
  constructor(private http: HttpClient) {}

  getPrices(ids: string[]): Observable<any> {
    const joinedIds = ids.join(',');
    return this.http.get(`https://api.coingecko.com/api/v3/simple/price?ids=${joinedIds}&vs_currencies=usd`);
  }
}