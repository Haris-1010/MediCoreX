import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

interface GrowthData {
  month: string;
  patients: number;
}

@Component({
  standalone: false,
  selector: 'app-patient-growth-chart',
  template: `
    <div class="growth-chart">
      <div class="chart-header">
        <a class="full-report" routerLink="/reports">Full Report <mat-icon>open_in_new</mat-icon></a>
      </div>
      <div class="chart-container" #chartContainer>
        <svg [attr.viewBox]="'0 0 ' + svgWidth + ' ' + svgHeight" class="line-chart">
          <!-- Grid lines -->
          <line *ngFor="let y of gridLines" [attr.x1]="padding" [attr.y1]="y" [attr.x2]="svgWidth - padding" [attr.y2]="y" stroke="#e0e0e0" stroke-width="1" stroke-dasharray="4"/>

          <!-- Y-axis labels -->
          <text *ngFor="let label of yLabels; let i = index" [attr.x]="padding - 10" [attr.y]="yPositions[i] + 4" text-anchor="end" fill="#999" font-size="11">{{ label }}</text>

          <!-- Area fill -->
          <path [attr.d]="areaPath" fill="url(#areaGradient)" opacity="0.3"/>

          <!-- Line -->
          <path [attr.d]="linePath" fill="none" stroke="#1a237e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

          <!-- Data points -->
          <circle *ngFor="let point of dataPoints; let i = index"
                  [attr.cx]="point.x" [attr.cy]="point.y" r="4"
                  fill="#1a237e" stroke="white" stroke-width="2"
                  class="data-point"/>

          <!-- X-axis labels -->
          <text *ngFor="let point of dataPoints; let i = index"
                [attr.x]="point.x" [attr.y]="svgHeight - 10"
                text-anchor="middle" fill="#999" font-size="11">
            {{ growthData[i].month }}
          </text>

          <!-- Gradient definition -->
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#1a237e;stop-opacity:0.4"/>
              <stop offset="100%" style="stop-color:#1a237e;stop-opacity:0.05"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  `,
  styles: [`
    .growth-chart {
      min-height: 250px;
    }

    .chart-header {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0.5rem;
    }

    .full-report {
      font-size: 0.8rem;
      color: #1a237e;
      text-decoration: none;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .full-report mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .full-report:hover {
      text-decoration: underline;
    }

    .chart-container {
      width: 100%;
      height: 220px;
    }

    .line-chart {
      width: 100%;
      height: 100%;
    }

    .data-point {
      cursor: pointer;
      transition: r 0.2s ease;
    }

    .data-point:hover {
      r: 6;
    }
  `]
})
export class PatientGrowthChartComponent implements OnInit, AfterViewInit {
  @Input() loading: boolean = false;
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  growthData: GrowthData[] = [];

  svgWidth = 500;
  svgHeight = 250;
  padding = 50;
  dataPoints: { x: number; y: number }[] = [];
  linePath = '';
  areaPath = '';
  gridLines: number[] = [];
  yLabels: string[] = [];
  yPositions: number[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadGrowthData();
  }

  loadGrowthData(): void {
    this.loading = true;
    this.api.get<GrowthData[]>('v1/dashboard/patient-growth').subscribe({
      next: (data) => {
        this.growthData = data || [];
        this.loading = false;
        this.calculateChart();
      },
      error: () => {
        this.loadGrowthFallback();
      }
    });
  }

  private loadGrowthFallback(): void {
    this.api.get<any>('v1/patients', { pageNumber: 1, pageSize: 1000 }).subscribe({
      next: (data) => {
        const items = Array.isArray(data) ? data : (data?.items || []);
        const firstMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1);
        this.growthData = Array.from({ length: 12 }, (_, index) => {
          const month = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + index, 1);
          const patients = items.filter((patient: any) => {
            const createdAt = new Date(patient.createdAt);
            return createdAt.getFullYear() === month.getFullYear() && createdAt.getMonth() === month.getMonth();
          }).length;
          return { month: month.toLocaleString('en-US', { month: 'short' }), patients };
        });
        this.loading = false;
        this.calculateChart();
      },
      error: () => { this.growthData = []; this.loading = false; this.calculateChart(); }
    });
  }

  ngAfterViewInit(): void {
    if (this.chartContainer) {
      const width = this.chartContainer.nativeElement.offsetWidth;
      if (width > 0) {
        this.svgWidth = width;
        this.calculateChart();
      }
    }
  }

  private calculateChart(): void {
    if (!this.growthData.length) return;

    const maxValue = Math.max(...this.growthData.map(d => d.patients), 1);
    const chartHeight = this.svgHeight - 40;
    const chartWidth = this.svgWidth - this.padding * 2;

    // Calculate Y-axis labels and grid lines
    const steps = 5;
    const stepValue = Math.ceil(maxValue / steps / 1000) * 1000;
    this.gridLines = [];
    this.yLabels = [];
    this.yPositions = [];

    for (let i = 0; i <= steps; i++) {
      const value = i * stepValue;
      const y = this.svgHeight - 30 - (value / maxValue) * chartHeight;
      this.gridLines.push(y);
      this.yLabels.push(this.formatNumber(value));
      this.yPositions.push(y);
    }

    // Calculate data points
    this.dataPoints = this.growthData.map((d, i) => ({
      x: this.padding + (this.growthData.length === 1 ? chartWidth / 2 : (i / (this.growthData.length - 1)) * chartWidth),
      y: this.svgHeight - 30 - (d.patients / maxValue) * chartHeight
    }));

    // Generate line path
    this.linePath = this.dataPoints.map((p, i) =>
      (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`
    ).join(' ');

    // Generate area path
    const bottomY = this.svgHeight - 30;
    this.areaPath = `M ${this.dataPoints[0].x} ${bottomY} ` +
      this.dataPoints.map(p => `L ${p.x} ${p.y}`).join(' ') +
      ` L ${this.dataPoints[this.dataPoints.length - 1].x} ${bottomY} Z`;
  }

  private formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + ',000';
    }
    return num.toString();
  }
}
