import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

interface BedStats {
  ward: string;
  total: number;
  occupied: number;
  available: number;
  maintenance: number;
}

@Component({
  standalone: false,
  selector: 'app-bed-occupancy-widget',
  template: `
    <div class="bed-widget">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div *ngIf="!loading" class="bed-stats">
        <div class="overall-stats">
          <div class="stat-ring">
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path class="circle-bg"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="circle"
                    [attr.stroke-dasharray]="occupancyPercentage + ', 100'"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831" />
              <text x="18" y="20.35" class="percentage">{{ occupancyPercentage }}%</text>
            </svg>
          </div>
          <div class="stat-summary">
            <div class="stat-item">
              <span class="stat-value available">{{ totalAvailable }}</span>
              <span class="stat-label">Available</span>
            </div>
            <div class="stat-item">
              <span class="stat-value occupied">{{ totalOccupied }}</span>
              <span class="stat-label">Occupied</span>
            </div>
            <div class="stat-item">
              <span class="stat-value maintenance">{{ totalMaintenance }}</span>
              <span class="stat-label">Maintenance</span>
            </div>
          </div>
        </div>

        <div class="ward-list">
          <div class="ward-item" *ngFor="let ward of wardStats">
            <span class="ward-name">{{ ward.ward }}</span>
            <div class="ward-bar">
              <div class="bar-fill" [style.width.%]="(ward.occupied / ward.total) * 100"></div>
            </div>
            <span class="ward-count">{{ ward.occupied }}/{{ ward.total }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bed-widget {
      min-height: 200px;
    }

    .overall-stats {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 1.5rem;
    }

    .stat-ring {
      width: 120px;
      height: 120px;
    }

    .circular-chart {
      display: block;
      max-width: 100%;
    }

    .circle-bg {
      fill: none;
      stroke: #eee;
      stroke-width: 3.8;
    }

    .circle {
      fill: none;
      stroke-width: 2.8;
      stroke-linecap: round;
      stroke: #3f51b5;
      animation: progress 1s ease-out forwards;
    }

    @keyframes progress {
      0% { stroke-dasharray: 0 100; }
    }

    .percentage {
      fill: #333;
      font-size: 0.5em;
      text-anchor: middle;
      font-weight: 600;
    }

    .stat-summary {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      min-width: 30px;
    }

    .stat-value.available { color: #4caf50; }
    .stat-value.occupied { color: #f44336; }
    .stat-value.maintenance { color: #ff9800; }

    .stat-label {
      font-size: 0.75rem;
      color: #666;
    }

    .ward-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .ward-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .ward-name {
      font-size: 0.875rem;
      min-width: 100px;
    }

    .ward-bar {
      flex: 1;
      height: 8px;
      background: #eee;
      border-radius: 4px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(to right, #4caf50, #f44336);
      border-radius: 4px;
      transition: width 0.3s;
    }

    .ward-count {
      font-size: 0.75rem;
      color: #666;
      min-width: 50px;
      text-align: right;
    }
  `]
})
export class BedOccupancyWidgetComponent implements OnInit {
  @Input() loading: boolean = false;

  wardStats: BedStats[] = [];
  totalAvailable = 0;
  totalOccupied = 0;
  totalMaintenance = 0;
  occupancyPercentage = 0;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadBedStats();
  }

  loadBedStats(): void {
    this.api.get<BedStats[]>('v1/dashboard/bed-stats').subscribe({
      next: (data) => {
        this.wardStats = data;
        this.calculateTotals();
      },
      error: () => {
        // Use mock data if API fails
        this.wardStats = [
          { ward: 'General Ward', total: 50, occupied: 35, available: 12, maintenance: 3 },
          { ward: 'ICU', total: 20, occupied: 18, available: 1, maintenance: 1 },
          { ward: 'Pediatric', total: 30, occupied: 15, available: 14, maintenance: 1 },
          { ward: 'Maternity', total: 25, occupied: 20, available: 4, maintenance: 1 }
        ];
        this.calculateTotals();
      }
    });
  }

  private calculateTotals(): void {
    this.totalAvailable = this.wardStats.reduce((sum, w) => sum + w.available, 0);
    this.totalOccupied = this.wardStats.reduce((sum, w) => sum + w.occupied, 0);
    this.totalMaintenance = this.wardStats.reduce((sum, w) => sum + w.maintenance, 0);

    const totalBeds = this.wardStats.reduce((sum, w) => sum + w.total, 0);
    this.occupancyPercentage = totalBeds > 0 ? Math.round((this.totalOccupied / totalBeds) * 100) : 0;
  }
}
