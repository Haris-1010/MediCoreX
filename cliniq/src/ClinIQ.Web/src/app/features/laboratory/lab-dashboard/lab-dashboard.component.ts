import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-lab-dashboard',
  template: `
    <app-main-layout>
      <app-page-header title="Laboratory Dashboard" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Laboratory' }]">
        <button mat-raised-button color="primary" routerLink="orders/new">
          <mat-icon>add</mat-icon> New Order
        </button>
      </app-page-header>

      <div class="stats-grid">
        <div class="stat-card accent"><mat-icon>today</mat-icon><div><h3>{{ stats.todaysOrders }}</h3><p>Today's Orders</p></div></div>
        <div class="stat-card warning"><mat-icon>pending</mat-icon><div><h3>{{ stats.pendingSamples }}</h3><p>Pending Samples</p></div></div>
        <div class="stat-card info"><mat-icon>science</mat-icon><div><h3>{{ stats.collectedSamples }}</h3><p>Collected Samples</p></div></div>
        <div class="stat-card"><mat-icon>hourglass_empty</mat-icon><div><h3>{{ stats.processing }}</h3><p>Processing</p></div></div>
        <div class="stat-card warning"><mat-icon>edit_note</mat-icon><div><h3>{{ stats.pendingResults }}</h3><p>Pending Results</p></div></div>
        <div class="stat-card accent"><mat-icon>verified</mat-icon><div><h3>{{ stats.pendingVerification }}</h3><p>Pending Verification</p></div></div>
        <div class="stat-card success"><mat-icon>check_circle</mat-icon><div><h3>{{ stats.completedToday }}</h3><p>Completed Today</p></div></div>
        <div class="stat-card danger"><mat-icon>cancel</mat-icon><div><h3>{{ stats.cancelledToday }}</h3><p>Cancelled</p></div></div>
      </div>

      <div class="action-bar">
        <button mat-stroked-button routerLink="sample-collection"><mat-icon>science</mat-icon> Sample Collection</button>
        <button mat-stroked-button routerLink="result-entry"><mat-icon>edit_note</mat-icon> Result Entry</button>
        <button mat-stroked-button routerLink="verification"><mat-icon>verified</mat-icon> Verification</button>
        <button mat-stroked-button routerLink="reports"><mat-icon>description</mat-icon> Reports</button>
        <button mat-raised-button color="primary" routerLink="orders/new"><mat-icon>add</mat-icon> New Order</button>
      </div>

      <div class="grid-2">
        <div class="card">
          <h3>Pending Orders</h3>
          <table mat-table [dataSource]="pendingOrders">
            <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
            <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}</td></ng-container>
            <ng-container matColumnDef="tests"><th mat-header-cell *matHeaderCellDef>Tests</th><td mat-cell *matCellDef="let o">{{ o.testCount }} tests</td></ng-container>
            <ng-container matColumnDef="priority"><th mat-header-cell *matHeaderCellDef>Priority</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.priority"></app-status-badge></td></ng-container>
            <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let o">
              <button mat-icon-button color="primary" [routerLink]="['sample-collection']"><mat-icon>science</mat-icon></button>
            </td></ng-container>
            <tr mat-header-row *matHeaderRowDef="pendingColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: pendingColumns;"></tr>
          </table>
          <div *ngIf="pendingOrders.length === 0" class="empty-state">
            <mat-icon>check_circle_outline</mat-icon>
            <p>No pending orders</p>
          </div>
        </div>

        <div class="card">
          <h3>Recent Orders</h3>
          <table mat-table [dataSource]="recentOrders">
            <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
            <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}</td></ng-container>
            <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.status"></app-status-badge></td></ng-container>
            <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let o">{{ o.orderDate | date:'short' }}</td></ng-container>
            <tr mat-header-row *matHeaderRowDef="recentColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: recentColumns;"></tr>
          </table>
          <div *ngIf="recentOrders.length === 0" class="empty-state">
            <mat-icon>history</mat-icon>
            <p>No recent orders</p>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; background: var(--bg-card, #fff); padding: 1.25rem; border-radius: 8px; border-left: 4px solid var(--accent-primary, #3f51b5); }
    .stat-card.success { border-left-color: #4caf50; }
    .stat-card.warning { border-left-color: #ff9800; }
    .stat-card.danger { border-left-color: #f44336; }
    .stat-card.info { border-left-color: #2196f3; }
    .stat-card.accent { border-left-color: #3f51b5; }
    .stat-card mat-icon { font-size: 36px; width: 36px; height: 36px; color: var(--accent-primary, #3f51b5); }
    .stat-card h3 { margin: 0; font-size: 1.5rem; } .stat-card p { margin: 0; color: var(--text-secondary, #666); font-size: 0.85rem; }
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    .card h3 { margin: 0 0 1rem; } table { width: 100%; }
    .action-bar { display: flex; justify-content: flex-end; margin-bottom: 1rem; gap: 0.5rem; flex-wrap: wrap; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 2rem; color: var(--text-muted, #999); }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 0.5rem; }
  `]
})
export class LabDashboardComponent implements OnInit {
  stats = { todaysOrders: 0, pendingSamples: 0, collectedSamples: 0, processing: 0, pendingResults: 0, pendingVerification: 0, completedToday: 0, cancelledToday: 0 };
  pendingOrders: any[] = [];
  recentOrders: any[] = [];
  pendingColumns = ['orderNumber', 'patient', 'tests', 'priority', 'actions'];
  recentColumns = ['orderNumber', 'patient', 'status', 'date'];

  constructor(private api: ApiService, private notification: NotificationService) {}

  ngOnInit() {
    this.api.get<any>('v1/laboratory/stats').subscribe({
      next: r => this.stats = r,
      error: () => {}
    });
    this.api.get<any>('v1/laboratory/sample-collection').subscribe({
      next: r => this.pendingOrders = Array.isArray(r) ? r.slice(0, 5) : [],
      error: () => {}
    });
    this.api.get<any>('v1/laboratory/recent-orders').subscribe({
      next: r => this.recentOrders = Array.isArray(r) ? r : [],
      error: () => {}
    });
  }
}
