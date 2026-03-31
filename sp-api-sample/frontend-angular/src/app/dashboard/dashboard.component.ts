import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  AmazonOrder,
  DailySummaryResponse,
} from '../models/sp-api-order.models';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);

  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly orders = signal<AmazonOrder[]>([]);
  readonly summary = signal<DailySummaryResponse | null>(null);

  readonly totalRevenue = computed(
    () => this.summary()?.totalRevenue ?? this.ordersTotalFromTable()
  );

  readonly orderCount = computed(
    () => this.summary()?.orderCount ?? this.orders().length
  );

  readonly pendingReturns = computed(
    () => this.summary()?.pendingReturns ?? this.fallbackPendingReturns()
  );

  readonly businessOrderCount = computed(
    () => this.orders().filter((order) => !!order.IsBusinessOrder).length
  );

  readonly afnCount = computed(
    () => this.orders().filter((order) => order.FulfillmentChannel === 'AFN').length
  );

  readonly mfnCount = computed(
    () => this.orders().filter((order) => order.FulfillmentChannel === 'MFN').length
  );

  constructor() {
    this.loadDashboard();
  }

  isHighValue(order: AmazonOrder): boolean {
    return (order.OrderTotal?.Amount ?? 0) > 500;
  }

  formatCurrency(amount: number, currencyCode = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount ?? 0);
  }

  private loadDashboard(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      ordersResponse: this.dashboardService.getMockOrders(),
      summary: this.dashboardService.getDailySummary(),
    }).subscribe({
      next: ({ ordersResponse, summary }) => {
        this.orders.set(ordersResponse.payload.Orders ?? []);
        this.summary.set(summary);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to load dashboard data.');
        this.loading.set(false);
      },
    });
  }

  private fallbackPendingReturns(): number {
    return this.orders().filter((order) => {
      const pending = (order.OrderStatus ?? '').toLowerCase().includes('pending');
      return !!order.IsReplacementOrder && pending;
    }).length;
  }

  private ordersTotalFromTable(): number {
    return this.orders().reduce(
      (sum, order) => sum + (order.OrderTotal?.Amount ?? 0),
      0
    );
  }
}
