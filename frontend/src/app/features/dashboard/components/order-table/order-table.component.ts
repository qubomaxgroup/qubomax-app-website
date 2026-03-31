import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { SpApiOrder } from '../../../../core/models/order.models';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatChipsModule, DatePipe],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTableComponent {
  readonly orders = input.required<SpApiOrder[]>();
  readonly displayedColumns = ['orderId', 'status', 'channel', 'purchaseDate', 'total'];

  isHighValue(order: SpApiOrder): boolean {
    return (order.OrderTotal?.Amount ?? 0) > 500;
  }

  toMcLean(utcIso: string): Date {
    return new Date(
      new Date(utcIso).toLocaleString('en-US', { timeZone: 'America/New_York' })
    );
  }
}
