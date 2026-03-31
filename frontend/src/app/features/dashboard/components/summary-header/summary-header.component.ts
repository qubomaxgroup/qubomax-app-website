import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-summary-header',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './summary-header.component.html',
  styleUrl: './summary-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryHeaderComponent {
  readonly totalRevenue = input.required<number>();
  readonly orderCount = input.required<number>();
  readonly averageOrderValue = input.required<number>();
}
