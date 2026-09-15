import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-revenue-chart',
  template: `
    <div class="revenue-chart">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div *ngIf="!loading" class="chart-placeholder">
        <div class="chart-bars">
          <div class="chart-bar" *ngFor="let item of data; let i = index"
               [style.height.%]="getBarHeight(item.value)"
               [matTooltip]="item.label + ': ' + (item.value | currencyFormat)">
            <span class="bar-label">{{ item.label }}</span>
          </div>
        </div>
        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-color revenue"></span>
            <span>Revenue</span>
          </div>
          <div class="legend-item">
            <span class="legend-color expenses"></span>
            <span>Expenses</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .revenue-chart {
      min-height: 300px;
    }

    .chart-placeholder {
      padding: 1rem 0;
    }

    .chart-bars {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 250px;
      padding: 0 1rem;
    }

    .chart-bar {
      width: 40px;
      background: linear-gradient(to top, #3f51b5, #7986cb);
      border-radius: 4px 4px 0 0;
      position: relative;
      min-height: 10px;
      transition: all 0.3s;
      cursor: pointer;
    }

    .chart-bar:hover {
      opacity: 0.8;
    }

    .bar-label {
      position: absolute;
      bottom: -24px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.625rem;
      color: #666;
      white-space: nowrap;
    }

    .chart-legend {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 2rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #666;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .legend-color.revenue {
      background: #3f51b5;
    }

    .legend-color.expenses {
      background: #f44336;
    }
  `]
})
export class RevenueChartComponent {
  @Input() data: { label: string; value: number }[] = [];
  @Input() loading: boolean = false;

  getBarHeight(value: number): number {
    if (!this.data.length) return 0;
    const maxValue = Math.max(...this.data.map(d => d.value));
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  }
}
