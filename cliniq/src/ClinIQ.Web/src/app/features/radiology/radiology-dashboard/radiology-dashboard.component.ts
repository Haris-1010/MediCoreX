import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-radiology-dashboard',
  template: `
    <app-main-layout>
      <app-page-header title="Radiology" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Radiology' }]"></app-page-header>
      <div class="stats-grid">
        <div class="stat-card"><mat-icon>pending</mat-icon><div><h3>{{ stats.pending }}</h3><p>Pending</p></div></div>
        <div class="stat-card"><mat-icon>check_circle</mat-icon><div><h3>{{ stats.completedToday }}</h3><p>Completed Today</p></div></div>
      </div>
      <div class="card">
        <h3>Imaging Orders</h3>
        <table mat-table [dataSource]="orders">
          <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}</td></ng-container>
          <ng-container matColumnDef="modality"><th mat-header-cell *matHeaderCellDef>Modality</th><td mat-cell *matCellDef="let o">{{ o.modality }}</td></ng-container>
          <ng-container matColumnDef="bodyPart"><th mat-header-cell *matHeaderCellDef>Body Part</th><td mat-cell *matCellDef="let o">{{ o.bodyPart }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let o"><button mat-icon-button><mat-icon>visibility</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
      </div>
    </app-main-layout>
  `,
  styles: [`.stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; max-width: 500px; }
    .stat-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }
    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; } .stat-card h3 { margin: 0; font-size: 1.75rem; } .stat-card p { margin: 0; color: #666; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; } table { width: 100%; }`]
})
export class RadiologyDashboardComponent implements OnInit {
  stats = { pending: 0, completedToday: 0 };
  orders: any[] = [];
  columns = ['orderNumber', 'patient', 'modality', 'bodyPart', 'status', 'actions'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<any>('v1/radiology/stats').subscribe(r => this.stats = r);
    this.api.get<any[]>('v1/radiology/orders').subscribe(r => this.orders = r);
  }
}
