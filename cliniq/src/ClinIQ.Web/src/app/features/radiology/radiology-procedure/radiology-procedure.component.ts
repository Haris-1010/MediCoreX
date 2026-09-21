import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-radiology-procedure',
  template: `
    <app-main-layout>
      <app-page-header title="Radiology Procedure" [breadcrumbs]="[{ label: 'Radiology', route: '/radiology' }, { label: 'Procedure' }]"></app-page-header>
      <div class="card">
        <table mat-table [dataSource]="orders">
          <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}<br><small>{{ o.mrn }}</small></td></ng-container>
          <ng-container matColumnDef="investigation"><th mat-header-cell *matHeaderCellDef>Investigation</th><td mat-cell *matCellDef="let o">
            <div *ngFor="let item of o.items">{{ item.serviceName }} ({{ item.modality }})</div>
          </td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th><td mat-cell *matCellDef="let o">
            <button mat-raised-button color="primary" (click)="startProcedure(o)" *ngIf="o.status === 'PatientArrived' || o.status === 'Scheduled'">
              <mat-icon>play_arrow</mat-icon> Start
            </button>
            <button mat-raised-button color="accent" (click)="completeImaging(o)" *ngIf="o.status === 'ProcedureInProgress'">
              <mat-icon>check</mat-icon> Complete
            </button>
            <button mat-icon-button color="primary" [routerLink]="['/radiology/reporting']" *ngIf="o.status === 'ImagingCompleted'">
              <mat-icon>edit_note</mat-icon>
            </button>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <div *ngIf="orders.length === 0" class="empty-state">
          <mat-icon>biotech</mat-icon>
          <p>No procedures in progress</p>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    table { width: 100%; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 2rem; color: var(--text-muted, #999); }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 0.5rem; }
  `]
})
export class RadiologyProcedureComponent implements OnInit {
  orders: any[] = [];
  loading = false;
  columns = ['orderNumber', 'patient', 'investigation', 'status', 'actions'];

  constructor(private api: ApiService, private notification: NotificationService, private auth: AuthService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.get<any[]>('v1/radiology/pending').subscribe({
      next: r => { this.orders = r; this.loading = false; },
      error: (err) => { this.loading = false; this.notification.error(err?.message || 'Failed to load pending orders'); }
    });
  }

  startProcedure(order: any) {
    this.api.post(`v1/radiology/orders/${order.id}/start-procedure`, {
      performedById: this.auth.getCurrentUser()?.id || null
    }).subscribe({
      next: () => { this.notification.success('Procedure started'); this.load(); },
      error: (err) => { this.notification.error(err?.message || 'Failed to start procedure'); }
    });
  }

  completeImaging(order: any) {
    this.api.post(`v1/radiology/orders/${order.id}/complete-imaging`, {}).subscribe({
      next: () => { this.notification.success('Imaging completed'); this.load(); },
      error: (err) => { this.notification.error(err?.message || 'Failed to complete imaging'); }
    });
  }
}
