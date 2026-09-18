import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-lab-dashboard',
  template: `
    <app-main-layout>
      <app-page-header title="Laboratory" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Laboratory' }]"></app-page-header>
      <div class="stats-grid">
        <div class="stat-card"><mat-icon>pending</mat-icon><div><h3>{{ stats.pendingOrders }}</h3><p>Pending Orders</p></div></div>
        <div class="stat-card"><mat-icon>science</mat-icon><div><h3>{{ stats.totalResults }}</h3><p>Total Results</p></div></div>
        <div class="stat-card"><mat-icon>check_circle</mat-icon><div><h3>{{ stats.completedToday }}</h3><p>Completed Today</p></div></div>
      </div>
      <div class="card">
        <h3>Pending Lab Orders</h3>
        <table mat-table [dataSource]="orders">
          <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}</td></ng-container>
          <ng-container matColumnDef="tests"><th mat-header-cell *matHeaderCellDef>Tests</th><td mat-cell *matCellDef="let o">{{ o.testCount }} tests</td></ng-container>
          <ng-container matColumnDef="priority"><th mat-header-cell *matHeaderCellDef>Priority</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.priority"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="orderedBy"><th mat-header-cell *matHeaderCellDef>Ordered By</th><td mat-cell *matCellDef="let o">Dr. {{ o.orderedBy }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let o"><button mat-raised-button color="primary" [routerLink]="['results', o.id]">Enter Results</button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
      </div>
    </app-main-layout>
  `,
  styles: [`.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }
    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; } .stat-card h3 { margin: 0; font-size: 1.75rem; } .stat-card p { margin: 0; color: #666; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; } table { width: 100%; }`]
})
export class LabDashboardComponent implements OnInit {
  stats = { pendingOrders: 0, totalResults: 0, completedToday: 0 };
  orders: any[] = [];
  columns = ['orderNumber', 'patient', 'tests', 'priority', 'orderedBy', 'actions'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<any>('v1/laboratory/stats').subscribe(r => this.stats = r);
    this.api.get<any[]>('v1/laboratory/pending').subscribe(r => this.orders = r);
  }
}
