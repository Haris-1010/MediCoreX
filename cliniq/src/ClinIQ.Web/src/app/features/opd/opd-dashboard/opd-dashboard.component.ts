import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { SignalRService } from '../../../core/services/signalr.service';

@Component({
  standalone: false,
  selector: 'app-opd-dashboard',
  template: `
    <app-main-layout>
      <app-page-header title="OPD Dashboard" subtitle="Out-Patient Department"
        [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'OPD' }]">
        <button mat-raised-button color="primary" routerLink="token"><mat-icon>add_circle</mat-icon> New Token</button>
        <button mat-stroked-button routerLink="queue"><mat-icon>queue</mat-icon> Manage Queue</button>
        <button mat-stroked-button (click)="openDisplay()" target="_blank"><mat-icon>tv</mat-icon> Display Board</button>
      </app-page-header>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon patients"><mat-icon>people</mat-icon></div>
          <div><h3>{{ stats.totalPatients }}</h3><p>Today's Tokens</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon waiting"><mat-icon>hourglass_empty</mat-icon></div>
          <div><h3>{{ stats.waitingCount }}</h3><p>Waiting</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon progress"><mat-icon>play_circle</mat-icon></div>
          <div><h3>{{ stats.inProgressCount }}</h3><p>In Consultation</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon done"><mat-icon>check_circle</mat-icon></div>
          <div><h3>{{ stats.completedCount }}</h3><p>Completed</p></div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header">
            <h3>Active Doctors</h3>
            <span class="badge" *ngIf="activeDoctors.length">{{ activeDoctors.length }}</span>
          </div>
          <div class="doctor-list">
            <div class="doctor-item" *ngFor="let d of activeDoctors">
              <div class="avatar">{{ d.initials }}</div>
              <div class="info">
                <h4>Dr. {{ d.fullName }}</h4>
                <p>{{ d.specialization }}</p>
              </div>
              <div class="queue-badge">
                <span class="count">{{ d.queueCount }}</span>
                <span class="label">in queue</span>
              </div>
            </div>
            <div class="empty" *ngIf="activeDoctors.length === 0">
              <mat-icon>person_off</mat-icon>
              <p>No doctors with active queues</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3>Current Queue</h3>
            <span class="badge" *ngIf="currentQueue.length">{{ currentQueue.length }}</span>
          </div>
          <div class="queue-list">
            <div class="queue-item" *ngFor="let q of currentQueue" [class.called]="q.status === 'Called' || q.status === 'Recalled'" [class.in-progress]="q.status === 'InConsultation'">
              <div class="token-circle" [class.active]="q.status === 'Called' || q.status === 'InConsultation'">
                {{ q.tokenNumber }}
              </div>
              <div class="info">
                <h4>{{ q.patientName }}</h4>
                <p>Dr. {{ q.doctorName }}</p>
              </div>
              <div class="status-chip" [ngClass]="getStatusClass(q.status)">
                {{ q.status }}
              </div>
            </div>
            <div class="empty" *ngIf="currentQueue.length === 0">
              <mat-icon>inbox</mat-icon>
              <p>No patients in queue</p>
            </div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--bg-card, #fff);
      padding: 1.25rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .stat-icon {
      width: 50px; height: 50px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .stat-icon mat-icon { font-size: 26px; width: 26px; height: 26px; }
    .stat-icon.patients { background: var(--status-info-bg, #e3f2fd); color: var(--status-info, #1976d2); }
    .stat-icon.waiting { background: var(--status-warning-bg, #fff3e0); color: var(--status-warning, #f57c00); }
    .stat-icon.progress { background: var(--status-success-bg, #e8f5e9); color: var(--status-success, #388e3c); }
    .stat-icon.done { background: var(--status-info-bg, #f3e5f5); color: var(--accent-primary, #7b1fa2); }
    .stat-card h3 { margin: 0; font-size: 1.75rem; line-height: 1; }
    .stat-card p { margin: 0.25rem 0 0; color: var(--text-muted, #888); font-size: 0.85rem; }

    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

    .card {
      background: var(--bg-card, #fff);
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      overflow: hidden;
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border-color, #f0f0f0);
    }
    .card-header h3 { margin: 0; font-size: 1rem; }
    .badge { background: var(--bg-badge, #e8eaf6); color: var(--accent-primary, #3f51b5); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }

    .doctor-list, .queue-list { padding: 0.75rem 1rem; max-height: 400px; overflow-y: auto; }

    .doctor-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border-radius: 8px;
      transition: background 0.15s;
    }
    .doctor-item:hover { background: var(--bg-hover, #f5f5f5); }

    .avatar {
      width: 42px; height: 42px;
      border-radius: 50%;
      background: var(--accent-primary, #3f51b5);
      color: var(--text-inverse, #fff);
      display: flex; align-items: center; justify-content: center;
      font-weight: 600;
      font-size: 0.85rem;
    }
    .info { flex: 1; }
    .info h4 { margin: 0; font-size: 0.9rem; }
    .info p { margin: 0.15rem 0 0; font-size: 0.8rem; color: var(--text-muted, #888); }

    .queue-badge { text-align: center; }
    .queue-badge .count { display: block; font-size: 1.25rem; font-weight: 700; color: var(--accent-primary, #3f51b5); }
    .queue-badge .label { font-size: 0.65rem; color: var(--text-muted, #aaa); }

    .queue-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border-radius: 8px;
      transition: background 0.15s;
    }
    .queue-item:hover { background: var(--bg-hover, #f5f5f5); }
    .queue-item.called { background: var(--status-warning-bg, #fff8e1); border-left: 3px solid var(--status-warning, #ffc107); }
    .queue-item.in-progress { background: var(--status-success-bg, #e8f5e9); border-left: 3px solid var(--status-success, #4caf50); }

    .token-circle {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: var(--bg-badge, #e8eaf6);
      color: var(--accent-primary, #3f51b5);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
    }
    .token-circle.active { background: var(--accent-primary, #3f51b5); color: var(--text-inverse, #fff); }

    .status-chip {
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-chip.waiting { background: var(--status-warning-bg, #fff3e0); color: var(--status-warning, #e65100); }
    .status-chip.called { background: var(--status-warning-bg, #fff8e1); color: var(--status-warning, #f57f17); }
    .status-chip.in-consultation { background: var(--status-success-bg, #e8f5e9); color: var(--status-success, #2e7d32); }
    .status-chip.recalled { background: var(--status-error-bg, #fce4ec); color: var(--status-error, #c62828); }

    .empty {
      text-align: center;
      padding: 2rem;
      color: var(--text-muted, #aaa);
    }
    .empty mat-icon { font-size: 48px; width: 48px; height: 48px; }
    .empty p { margin: 0.5rem 0 0; }
  `]
})
export class OpdDashboardComponent implements OnInit, OnDestroy {
  stats = { totalPatients: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0 };
  activeDoctors: any[] = [];
  currentQueue: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(private api: ApiService, private signalR: SignalRService) {}

  ngOnInit() {
    this.loadData();
    this.signalR.queueUpdate$.pipe(takeUntil(this.destroy$)).subscribe(() => this.loadData());
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  loadData() {
    this.api.get<any>('v1/opd/stats').subscribe({
      next: (r) => {
        const data = (r as any)?.data ?? r;
        if (data) this.stats = data;
      }
    });

    this.api.get<any>('v1/opd/active-doctors').subscribe({
      next: (r) => {
        this.activeDoctors = Array.isArray(r) ? r : ((r as any)?.data ?? []);
      }
    });

    this.api.get<any>('v1/opd/current-queue').subscribe({
      next: (r) => {
        this.currentQueue = Array.isArray(r) ? r : ((r as any)?.data ?? []);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'waiting': return 'waiting';
      case 'called': return 'called';
      case 'inconsultation': return 'in-consultation';
      case 'recalled': return 'recalled';
      default: return 'waiting';
    }
  }

  openDisplay() {
    window.open('/opd/display', '_blank');
  }
}
