import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import {
  DailySummaryResponse,
  OrderListResponse,
  SpApiOrder,
} from '../models/order.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly http = inject(HttpClient);
  private readonly defaultMarketplaceId = environment.defaultMarketplaceId;

  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly summary = signal<DailySummaryResponse | null>(null);
  readonly orders = signal<SpApiOrder[]>([]);

  readonly totalRevenue = computed(
    () => this.summary()?.totalRevenue ?? this.fallbackTotalRevenue()
  );
  readonly orderCount = computed(
    () => this.summary()?.orderCount ?? this.orders().length
  );
  readonly averageOrderValue = computed(
    () => this.summary()?.averageOrderValue ?? this.fallbackAverage()
  );
  readonly marketplaceId = computed(
    () => this.summary()?.marketplaceId ?? this.defaultMarketplaceId
  );

  readonly highValueOrders = computed(() =>
    this.orders()
      .filter((order) => (order.OrderTotal?.Amount ?? 0) > 500)
      .sort((a, b) => (b.OrderTotal?.Amount ?? 0) - (a.OrderTotal?.Amount ?? 0))
  );

  constructor() {
    this.refresh();
  }

  refresh(marketplaceId = this.defaultMarketplaceId): void {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<DailySummaryResponse>(
        `${environment.apiBaseUrl}/api/orders/daily-summary?marketplaceId=${marketplaceId}`
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (summary) => {
          this.summary.set(summary);
          this.loadMockOrdersOnly();
        },
        error: () => {
          this.error.set('Backend unavailable. Showing mock dataset.');
          this.summary.set(null);
          this.loadMockOrdersOnly();
        },
      });
  }

  private loadMockOrdersOnly(): void {
    this.http.get<OrderListResponse>('/sp-api-orders.sample.json').subscribe({
      next: (response) => this.orders.set(response.payload.Orders ?? []),
      error: (err) => {
        console.error(err);
        this.error.set('Unable to load mock order data.');
      },
    });
  }

  private fallbackTotalRevenue(): number {
    return this.orders().reduce((acc, curr) => acc + (curr.OrderTotal?.Amount ?? 0), 0);
  }

  private fallbackAverage(): number {
    const count = this.orders().length;
    return count > 0 ? this.fallbackTotalRevenue() / count : 0;
  }
}
