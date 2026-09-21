import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-radiology-dashboard',
  template: `
    <app-main-layout>
      <app-page-header title="Radiology Dashboard" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Radiology' }]">
        <button mat-raised-button color="primary" routerLink="orders/new">
          <mat-icon>add</mat-icon> New Order
        </button>
      </app-page-header>

      <div class="stats-grid">
        <div class="stat-card accent"><mat-icon>today</mat-icon><div><h3>{{ stats.todaysOrders }}</h3><p>Today's Orders</p></div></div>
        <div class="stat-card warning"><mat-icon>schedule</mat-icon><div><h3>{{ stats.pendingSchedule }}</h3><p>Pending Schedule</p></div></div>
        <div class="stat-card info"><mat-icon>calendar_month</mat-icon><div><h3>{{ stats.scheduledToday }}</h3><p>Scheduled / In Progress</p></div></div>
        <div class="stat-card success"><mat-icon>check_circle</mat-icon><div><h3>{{ stats.completedToday }}</h3><p>Completed Today</p></div></div>
        <div class="stat-card warning"><mat-icon>edit_note</mat-icon><div><h3>{{ stats.pendingReports }}</h3><p>Pending Reports</p></div></div>
        <div class="stat-card"><mat-icon>description</mat-icon><div><h3>{{ stats.totalReports }}</h3><p>Total Reports</p></div></div>
      </div>

      <div class="action-bar">
        <button mat-stroked-button routerLink="schedule"><mat-icon>calendar_month</mat-icon> Schedule</button>
        <button mat-stroked-button routerLink="procedure"><mat-icon>biotech</mat-icon> Procedure</button>
        <button mat-stroked-button routerLink="reporting"><mat-icon>edit_note</mat-icon> Reporting</button>
        <button mat-stroked-button routerLink="verification"><mat-icon>verified</mat-icon> Verification</button>
        <button mat-stroked-button routerLink="reports"><mat-icon>description</mat-icon> Reports</button>
        <button mat-raised-button color="primary" routerLink="orders/new"><mat-icon>add</mat-icon> New Order</button>
      </div>

      <mat-tab-group>
        <mat-tab label="Pending Orders">
          <div class="card">
            <table mat-table [dataSource]="pendingOrders">
              <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
              <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}</td></ng-container>
              <ng-container matColumnDef="investigation"><th mat-header-cell *matHeaderCellDef>Investigation</th><td mat-cell *matCellDef="let o">
                <span *ngFor="let item of o.items; let last = last">{{ item.serviceName }}<span *ngIf="!last">, </span></span>
              </td></ng-container>
              <ng-container matColumnDef="priority"><th mat-header-cell *matHeaderCellDef>Priority</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.priority"></app-status-badge></td></ng-container>
              <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.status"></app-status-badge></td></ng-container>
              <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th><td mat-cell *matCellDef="let o">
                <button mat-icon-button color="primary" [routerLink]="['../reports', o.id]" matTooltip="Enter Report"><mat-icon>edit_note</mat-icon></button>
              </td></ng-container>
              <tr mat-header-row *matHeaderRowDef="pendingColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: pendingColumns;"></tr>
            </table>
            <div *ngIf="pendingOrders.length === 0" class="empty-state">
              <mat-icon>check_circle_outline</mat-icon>
              <p>No pending orders</p>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Completed Reports">
          <div class="card">
            <table mat-table [dataSource]="completedReports">
              <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let r">{{ r.orderNumber }}</td></ng-container>
              <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let r">{{ r.patientName }}</td></ng-container>
              <ng-container matColumnDef="investigation"><th mat-header-cell *matHeaderCellDef>Investigation</th><td mat-cell *matCellDef="let r">
                <span *ngFor="let item of r.items; let last = last">{{ item.serviceName }}<span *ngIf="!last">, </span></span>
              </td></ng-container>
              <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let r">{{ (r.completedAt || r.orderDate) | date:'mediumDate' }}</td></ng-container>
              <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th><td mat-cell *matCellDef="let r">
                <button mat-icon-button color="primary" [routerLink]="['../reports', r.id]" matTooltip="View Report"><mat-icon>visibility</mat-icon></button>
              </td></ng-container>
              <tr mat-header-row *matHeaderRowDef="reportColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: reportColumns;"></tr>
            </table>
            <div *ngIf="completedReports.length === 0" class="empty-state">
              <mat-icon>description</mat-icon>
              <p>No completed reports</p>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </app-main-layout>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; background: var(--bg-card, #fff); padding: 1.25rem; border-radius: 8px; border-left: 4px solid var(--accent-primary, #3f51b5); }
    .stat-card.success { border-left-color: #4caf50; }
    .stat-card.warning { border-left-color: #ff9800; }
    .stat-card.info { border-left-color: #2196f3; }
    .stat-card.accent { border-left-color: #3f51b5; }
    .stat-card mat-icon { font-size: 36px; width: 36px; height: 36px; color: var(--accent-primary, #3f51b5); }
    .stat-card h3 { margin: 0; font-size: 1.5rem; } .stat-card p { margin: 0; color: var(--text-secondary, #666); font-size: 0.85rem; }
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; margin-top: 0.5rem; }
    table { width: 100%; }
    .action-bar { display: flex; justify-content: flex-end; margin-bottom: 1rem; gap: 0.5rem; flex-wrap: wrap; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 2rem; color: var(--text-muted, #999); }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 0.5rem; }
  `]
})
export class RadiologyDashboardComponent implements OnInit {
  stats = { todaysOrders: 0, pendingSchedule: 0, scheduledToday: 0, completedToday: 0, pendingReports: 0, totalReports: 0 };
  pendingOrders: any[] = [];
  completedReports: any[] = [];
  pendingColumns = ['orderNumber', 'patient', 'investigation', 'priority', 'status', 'actions'];
  reportColumns = ['orderNumber', 'patient', 'investigation', 'date', 'actions'];

  constructor(private api: ApiService, private notification: NotificationService) {}

  ngOnInit() {
    this.api.get<any>('v1/radiology/stats').subscribe({
      next: r => this.stats = r,
      error: (err) => { this.notification.error(err?.message || 'Failed to load stats'); }
    });
    this.api.get<any[]>('v1/radiology/pending').subscribe({
      next: r => this.pendingOrders = r,
      error: (err) => { this.notification.error(err?.message || 'Failed to load pending orders'); }
    });
    this.api.get<any>('v1/radiology/reports').subscribe({
      next: r => {
        const reports = Array.isArray(r) ? r : (r?.items || r?.data || r?.results || []);
        this.completedReports = reports;
      },
      error: (err) => { this.notification.error(err?.message || 'Failed to load completed reports'); }
    });
  }
}
