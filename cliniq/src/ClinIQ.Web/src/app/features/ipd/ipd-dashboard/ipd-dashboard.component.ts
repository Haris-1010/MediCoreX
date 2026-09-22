import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-ipd-dashboard',
  template: `
    <app-main-layout>
      <app-page-header title="IPD Dashboard" subtitle="In-Patient Department" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'IPD' }]">
        <button mat-raised-button color="primary" routerLink="admit"><mat-icon>add</mat-icon> New Admission</button>
        <button mat-stroked-button routerLink="wards"><mat-icon>hotel</mat-icon> Ward Management</button>
        <button mat-stroked-button routerLink="rooms"><mat-icon>meeting_room</mat-icon> Room Management</button>
        <button mat-stroked-button routerLink="beds"><mat-icon>bed</mat-icon> Bed Board</button>
      </app-page-header>

      <div class="stats-grid">
        <div class="stat-card"><mat-icon>hotel</mat-icon><div><h3>{{ stats.totalAdmissions }}</h3><p>Active Admissions</p></div></div>
        <div class="stat-card"><mat-icon>bed</mat-icon><div><h3>{{ stats.totalBeds }}</h3><p>Total Beds</p></div></div>
        <div class="stat-card"><mat-icon>bed</mat-icon><div><h3>{{ stats.availableBeds }}</h3><p>Available Beds</p></div></div>
        <div class="stat-card"><mat-icon>login</mat-icon><div><h3>{{ stats.todayAdmissions }}</h3><p>Today's Admissions</p></div></div>
        <div class="stat-card"><mat-icon>logout</mat-icon><div><h3>{{ stats.todayDischarges }}</h3><p>Today's Discharges</p></div></div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <h3>Ward Overview</h3>
          <div class="ward-list">
            <div class="ward-item" *ngFor="let w of wards">
              <div class="ward-info"><h4>{{ w.name }}</h4><p>{{ w.type }}</p></div>
              <div class="occupancy"><div class="bar"><div class="fill" [style.width.%]="(w.occupied / w.total) * 100"></div></div><span>{{ w.occupied }}/{{ w.total }}</span></div>
            </div>
          </div>
        </div>
        <div class="card">
          <h3>Recent Admissions</h3>
          <div class="admission-list">
            <div class="admission-item" *ngFor="let a of recentAdmissions">
              <div class="info"><h4>{{ a.patientName }}</h4><p>{{ a.ward }} - Bed {{ a.bedNumber }}</p></div>
              <div class="meta"><span>{{ a.admissionDate | date:'shortDate' }}</span><app-status-badge [status]="a.status"></app-status-badge></div>
            </div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`.stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; color: var(--accent-primary, #3f51b5); }
    .stat-card h3 { margin: 0; font-size: 1.75rem; } .stat-card p { margin: 0; color: var(--text-secondary, #666); }
    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }
    .ward-list, .admission-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .ward-item, .admission-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-hover, #f5f5f5); border-radius: 8px; }
    .ward-info h4, .info h4 { margin: 0; } .ward-info p, .info p { margin: 0; font-size: 0.875rem; color: var(--text-secondary, #666); }
    .occupancy { display: flex; align-items: center; gap: 0.5rem; } .bar { width: 100px; height: 8px; background: var(--border-color, #e0e0e0); border-radius: 4px; } .fill { height: 100%; background: var(--accent-primary, #3f51b5); border-radius: 4px; }
    .meta { display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem; } .meta span { font-size: 0.75rem; color: var(--text-secondary, #666); }`]
})
export class IpdDashboardComponent implements OnInit {
  stats = { totalAdmissions: 0, totalBeds: 0, availableBeds: 0, todayAdmissions: 0, todayDischarges: 0 };
  wards: any[] = [];
  recentAdmissions: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.get<any>('v1/ipd/stats').subscribe({
      next: (r) => {
        const data = (r as any)?.data ?? r;
        if (data) this.stats = data;
      }
    });

    this.api.get<any>('v1/ipd/wards/overview').subscribe({
      next: (r) => {
        const wards = Array.isArray(r) ? r : ((r as any)?.data ?? []);
        this.wards = wards;
        // Calculate totals from ward overview (excludes deleted beds)
        this.stats.totalBeds = wards.reduce((sum: number, w: any) => sum + (w.total || 0), 0);
        this.stats.availableBeds = wards.reduce((sum: number, w: any) => sum + ((w.total || 0) - (w.occupied || 0)), 0);
      }
    });

    this.api.get<any>('v1/ipd/admissions/recent').subscribe({
      next: (r) => {
        this.recentAdmissions = Array.isArray(r) ? r : ((r as any)?.data ?? []);
      }
    });
  }
}
