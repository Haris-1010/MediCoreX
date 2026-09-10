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
        <button mat-raised-button color="primary" routerLink="queue"><mat-icon>queue</mat-icon> Manage Queue</button>
      </app-page-header>

      <div class="stats-grid">
        <div class="stat-card"><mat-icon>people</mat-icon><div><h3>{{ stats.totalPatients }}</h3><p>Today's Patients</p></div></div>
        <div class="stat-card"><mat-icon>hourglass_empty</mat-icon><div><h3>{{ stats.waitingCount }}</h3><p>Waiting</p></div></div>
        <div class="stat-card"><mat-icon>play_arrow</mat-icon><div><h3>{{ stats.inProgressCount }}</h3><p>In Progress</p></div></div>
        <div class="stat-card"><mat-icon>check_circle</mat-icon><div><h3>{{ stats.completedCount }}</h3><p>Completed</p></div></div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <h3>Active Doctors</h3>
          <div class="doctor-list">
            <div class="doctor-item" *ngFor="let d of activeDoctors">
              <div class="avatar">{{ d.initials }}</div>
              <div class="info"><h4>Dr. {{ d.fullName }}</h4><p>{{ d.specialization }}</p></div>
              <div class="queue-info"><span class="count">{{ d.queueCount }}</span><span>in queue</span></div>
            </div>
          </div>
        </div>
        <div class="card">
          <h3>Current Queue</h3>
          <div class="queue-list">
            <div class="queue-item" *ngFor="let q of currentQueue" [class.current]="q.status === 'InProgress'">
              <div class="token">{{ q.tokenNumber }}</div>
              <div class="info"><h4>{{ q.patientName }}</h4><p>Dr. {{ q.doctorName }}</p></div>
              <app-status-badge [status]="q.status"></app-status-badge>
            </div>
            <p *ngIf="currentQueue.length === 0" class="empty">No patients in queue</p>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; }
    .stat-card h3 { margin: 0; font-size: 1.75rem; } .stat-card p { margin: 0; color: #666; }
    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }
    .doctor-list, .queue-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .doctor-item, .queue-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f5f5f5; border-radius: 8px; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }
    .info { flex: 1; } .info h4 { margin: 0; } .info p { margin: 0; font-size: 0.875rem; color: #666; }
    .queue-info { text-align: center; } .queue-info .count { display: block; font-size: 1.25rem; font-weight: 700; color: #3f51b5; }
    .token { width: 40px; height: 40px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; }
    .queue-item.current { background: #e3f2fd; border-left: 3px solid #3f51b5; }
    .empty { text-align: center; color: #666; padding: 1rem; }`]
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
    this.api.get<any>('v1/opd/stats').subscribe(r => this.stats = r);
    this.api.get<any[]>('v1/opd/active-doctors').subscribe(r => this.activeDoctors = r);
    this.api.get<any[]>('v1/opd/current-queue').subscribe(r => this.currentQueue = r);
  }
}
