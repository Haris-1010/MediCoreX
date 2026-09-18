import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-radiology-dashboard',
  template: `
    <app-main-layout>
      <app-page-header title="Radiology" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Radiology' }]"></app-page-header>
      <div class="stats-grid">
        <div class="stat-card"><mat-icon>pending</mat-icon><div><h3>{{ stats.pendingOrders }}</h3><p>Pending Orders</p></div></div>
        <div class="stat-card"><mat-icon>check_circle</mat-icon><div><h3>{{ stats.completedToday }}</h3><p>Completed Today</p></div></div>
        <div class="stat-card"><mat-icon>description</mat-icon><div><h3>{{ stats.totalReports }}</h3><p>Total Reports</p></div></div>
      </div>
      <div class="action-bar">
        <button mat-raised-button color="primary" routerLink="orders/new">
          <mat-icon>add</mat-icon> New Order
        </button>
      </div>
      <mat-tab-group>
        <mat-tab label="Pending Orders">
          <div class="card">
            <table mat-table [dataSource]="pendingOrders">
              <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
              <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}</td></ng-container>
              <ng-container matColumnDef="priority"><th mat-header-cell *matHeaderCellDef>Priority</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.priority"></app-status-badge></td></ng-container>
              <ng-container matColumnDef="clinicalIndication"><th mat-header-cell *matHeaderCellDef>Clinical Indication</th><td mat-cell *matCellDef="let o">{{ o.clinicalIndication }}</td></ng-container>
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
              <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let r">{{ r.completedDate | date:'mediumDate' }}</td></ng-container>
              <ng-container matColumnDef="results"><th mat-header-cell *matHeaderCellDef>Results</th><td mat-cell *matCellDef="let r">{{ r.results | truncate:80 }}</td></ng-container>
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
  styles: [`.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }
    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; }
    .stat-card h3 { margin: 0; font-size: 1.75rem; } .stat-card p { margin: 0; color: #666; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; margin-top: 0.5rem; }
    .card h3 { margin: 0 0 1rem; } table { width: 100%; }
    .action-bar { display: flex; justify-content: flex-end; margin-bottom: 1rem; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 2rem; color: #999; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 0.5rem; }`]
})
export class RadiologyDashboardComponent implements OnInit {
  stats = { pendingOrders: 0, completedToday: 0, totalReports: 0 };
  pendingOrders: any[] = [];
  completedReports: any[] = [];
  pendingColumns = ['orderNumber', 'patient', 'priority', 'clinicalIndication', 'status', 'actions'];
  reportColumns = ['orderNumber', 'patient', 'date', 'results', 'actions'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<any>('v1/radiology/stats').subscribe(r => this.stats = r);
    this.api.get<any[]>('v1/radiology/pending').subscribe(r => this.pendingOrders = r);
    this.api.get<any[]>('v1/radiology/reports').subscribe(r => this.completedReports = r);
  }
}
