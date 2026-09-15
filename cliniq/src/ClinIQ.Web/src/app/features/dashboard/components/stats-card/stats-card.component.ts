import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-stats-card',
  template: `
    <div class="stats-card" [ngClass]="'stats-' + color">
      <div class="stats-icon">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      <div class="stats-content">
        <div class="stats-header">
          <span class="stats-accent-bar" [ngClass]="'stats-' + color"></span>
          <h4>{{ title }}</h4>
        </div>
        <div class="stats-value">
          {{ isCurrency ? (value | number:'1.0-0') : (value | number) }}
        </div>
        <div class="stats-subtitle" *ngIf="subtitle">{{ subtitle }}</div>
      </div>
    </div>
  `,
  styles: [`
     .stats-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: white;
      border-radius: 12px;
      padding: 1.5rem 1.75rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      border: 1px solid #e8e8e8;
      border-left: 5px solid #1a237e;
      min-height: 120px;
      height: 100%;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stats-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    }

    .stats-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e8eaf6;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .stats-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #1a237e;
    }

     .stats-primary .stats-icon { background: #e8eaf6; }
    .stats-primary .stats-icon mat-icon { color: #1a237e; }
    .stats-primary { border-left-color: #1a237e; }

    .stats-accent .stats-icon { background: #e0f2f1; }
    .stats-accent .stats-icon mat-icon { color: #00695c; }
    .stats-accent { border-left-color: #00695c; }

    .stats-warn .stats-icon { background: #fce4ec; }
    .stats-warn .stats-icon mat-icon { color: #c62828; }
    .stats-warn { border-left-color: #c62828; }

    .stats-success .stats-icon { background: #e8f5e9; }
    .stats-success .stats-icon mat-icon { color: #2e7d32; }
    .stats-success { border-left-color: #2e7d32; }

     .stats-content {
      flex: 1;
    }

    .stats-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }

    .stats-accent-bar {
      width: 4px;
      height: 18px;
      border-radius: 2px;
      background: currentColor;
    }

    .stats-value {
      font-size: 2.25rem;
      font-weight: 700;
      color: #1a237e;
      line-height: 1.2;
    }

    .stats-content h4 {
      margin: 0.35rem 0 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: #1a237e;
    }

    .stats-subtitle {
      font-size: 0.8rem;
      color: #475569;
      margin-top: 0.3rem;
      font-weight: 500;
    }
  `]
})
export class StatsCardComponent {
  @Input() title!: string;
  @Input() value!: number;
  @Input() icon!: string;
  @Input() color: 'primary' | 'accent' | 'warn' | 'success' = 'primary';
  @Input() subtitle?: string;
  @Input() isCurrency: boolean = false;
}
