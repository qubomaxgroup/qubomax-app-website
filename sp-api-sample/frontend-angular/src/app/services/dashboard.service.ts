import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DailySummaryResponse,
  SpApiOrdersResponse,
} from '../models/sp-api-order.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getDailySummary(): Observable<DailySummaryResponse> {
    return this.http.get<DailySummaryResponse>('/api/dashboard/summary');
  }

  getMockOrders(): Observable<SpApiOrdersResponse> {
    return this.http.get<SpApiOrdersResponse>('/assets/mock/sp-api-orders.sample.json');
  }
}
