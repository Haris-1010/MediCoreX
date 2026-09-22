import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

interface RevenueData {
  month: string;
  revenue: number;
}

@Component({
  standalone: false,
  selector: 'app-patient-growth-chart',
  template: `
    <div class="growth-chart">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div class="chart-body" *ngIf="!loading && revenueData.length > 0">
        <div class="chart-top">
          <div class="chart-total">
            <span class="total-label">Total Collected</span>
            <span class="total-value">Rs. {{ totalRevenue | number:'1.0-0' }}</span>
          </div>
        </div>

        <div class="svg-wrapper">
          <svg [attr.viewBox]="'0 0 ' + svgWidth + ' ' + svgHeight"
               preserveAspectRatio="none"
               class="area-chart">
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#3f51b5" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="#3f51b5" stop-opacity="0.02"/>
              </linearGradient>
            </defs>

            <!-- grid lines + y-axis labels -->
            <ng-container *ngFor="let y of gridY; let i = index">
              <line [attr.x1]="padLeft" [attr.y1]="y"
                    [attr.x2]="svgWidth - padRight" [attr.y2]="y"
                    stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4,3"/>
              <text [attr.x]="padLeft - 6" [attr.y]="y + 4"
                    text-anchor="end" fill="#94a3b8" font-size="10">{{ yLabels[i] }}</text>
            </ng-container>

            <!-- area fill -->
            <path [attr.d]="areaPath" fill="url(#areaFill)"/>

            <!-- line -->
            <path [attr.d]="linePath" fill="none"
                  stroke="#3f51b5" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round"/>

            <!-- dots + values -->
            <ng-container *ngFor="let d of chartPoints; let i = index">
              <circle [attr.cx]="d.x" [attr.cy]="d.y" r="4"
                      fill="#fff" stroke="#3f51b5" stroke-width="2.5"/>
              <text *ngIf="revenueData[i].revenue > 0"
                    [attr.x]="d.x" [attr.y]="d.y - 12"
                    text-anchor="middle"
                    fill="#1a237e" font-size="10" font-weight="600">
                {{ formatCurrency(revenueData[i].revenue) }}
              </text>
            </ng-container>
          </svg>

          <!-- x-axis labels -->
          <div class="x-labels">
            <span *ngFor="let d of revenueData" class="x-label">{{ d.month }}</span>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && revenueData.length === 0">
        <span>No revenue data</span>
      </div>
    </div>
  `,
  styles: [`
    .growth-chart {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }

    .chart-body {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }

    .chart-top {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;
      flex-shrink: 0;
    }

    .chart-total {
      display: flex;
      align-items: baseline;
      gap: 6px;
      padding: 4px 10px;
      background: #f0f4ff;
      border-radius: 6px;
    }

    .total-label {
      font-size: 11px;
      color: #64748b;
    }

    .total-value {
      font-size: 14px;
      font-weight: 700;
      color: #1a237e;
    }

    .svg-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .area-chart {
      width: 100%;
      flex: 1;
      min-height: 0;
      overflow: visible;
    }

    .x-labels {
      display: flex;
      justify-content: space-between;
      padding: 6px 4px 0;
      flex-shrink: 0;
    }

    .x-label {
      flex: 1;
      text-align: center;
      font-size: 10px;
      font-weight: 500;
      color: #94a3b8;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .empty-state {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      font-size: 13px;
    }

    @media (max-width: 768px) {
      .x-label { font-size: 8px; }
      .total-label { font-size: 10px; }
      .total-value { font-size: 12px; }
    }
  `]
})
export class PatientGrowthChartComponent implements OnInit {
  @Input() loading: boolean = false;

  revenueData: RevenueData[] = [];
  totalRevenue = 0;

  svgWidth = 600;
  svgHeight = 200;
  padLeft = 52;
  padRight = 10;
  padTop = 10;
  padBottom = 10;

  chartPoints: { x: number; y: number }[] = [];
  linePath = '';
  areaPath = '';
  gridY: number[] = [];
  yLabels: string[] = [];

  private maxValue = 1;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadRevenueData();
  }

  loadRevenueData(): void {
    this.loading = true;
    this.api.get<RevenueData[]>('v1/dashboard/monthly-revenue').subscribe({
      next: (data) => {
        this.revenueData = data || [];
        this.totalRevenue = this.revenueData.reduce((sum, d) => sum + (d.revenue || 0), 0);
        this.loading = false;
        this.buildChart();
      },
      error: () => {
        this.revenueData = [];
        this.loading = false;
        this.buildChart();
      }
    });
  }

  formatCurrency(value: number): string {
    if (value === 0) return '0';
    if (value >= 100000) return (value / 100000).toFixed(1) + 'L';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toFixed(0);
  }

  private buildChart(): void {
    if (!this.revenueData.length) {
      this.chartPoints = [];
      this.linePath = '';
      this.areaPath = '';
      this.gridY = [];
      this.yLabels = [];
      return;
    }

    const actualMax = Math.max(...this.revenueData.map(d => d.revenue || 0), 0);

    if (actualMax <= 0) {
      this.maxValue = 1;
    } else {
      const steps = 4;
      const rawStep = actualMax / steps;
      const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
      const stepValue = Math.ceil(rawStep / magnitude) * magnitude;
      this.maxValue = stepValue * steps;
    }

    const n = this.revenueData.length;
    const w = this.svgWidth - this.padLeft - this.padRight;
    const h = this.svgHeight - this.padTop - this.padBottom;

    this.chartPoints = this.revenueData.map((d, i) => ({
      x: this.padLeft + (n === 1 ? w / 2 : (i / (n - 1)) * w),
      y: this.padTop + h - (this.maxValue > 0 ? (d.revenue / this.maxValue) * h : 0)
    }));

    const steps = 4;
    this.gridY = [];
    this.yLabels = [];
    for (let i = 0; i <= steps; i++) {
      this.gridY.push(this.padTop + (i / steps) * h);
      const val = this.maxValue - (i * (this.maxValue / steps));
      this.yLabels.push(this.formatCurrency(val));
    }

    if (this.chartPoints.length > 0) {
      const first = this.chartPoints[0];
      const last = this.chartPoints[this.chartPoints.length - 1];
      const bottomY = this.padTop + h;

      this.linePath = this.chartPoints
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

      this.areaPath =
        `M ${first.x} ${bottomY} ` +
        this.chartPoints.map(p => `L ${p.x} ${p.y}`).join(' ') +
        ` L ${last.x} ${bottomY} Z`;
    }
  }
}
