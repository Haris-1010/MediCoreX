import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-radiology-reporting-list',
  template: `
    <app-main-layout>
      <app-page-header title="Radiology Reporting" [breadcrumbs]="[{ label: 'Radiology', route: '/radiology' }, { label: 'Reporting' }]"></app-page-header>
      <div class="card">
        <table mat-table [dataSource]="orders">
          <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}<br><small>{{ o.mrn }}</small></td></ng-container>
          <ng-container matColumnDef="investigation"><th mat-header-cell *matHeaderCellDef>Investigation</th><td mat-cell *matCellDef="let o">
            <div *ngFor="let item of o.items">{{ item.serviceName }} - {{ item.modality }}</div>
          </td></ng-container>
          <ng-container matColumnDef="clinicalIndication"><th mat-header-cell *matHeaderCellDef>Clinical Indication</th><td mat-cell *matCellDef="let o">{{ o.clinicalIndication }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th><td mat-cell *matCellDef="let o">
            <button mat-raised-button color="primary" [routerLink]="['/radiology/reports', o.id]">
              <mat-icon>edit_note</mat-icon> Enter Report
            </button>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <div *ngIf="orders.length === 0" class="empty-state">
          <mat-icon>edit_note</mat-icon>
          <p>No studies pending report</p>
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
export class RadiologyReportingListComponent implements OnInit {
  orders: any[] = [];
  columns = ['orderNumber', 'patient', 'investigation', 'clinicalIndication', 'status', 'actions'];

  constructor(private api: ApiService, private notification: NotificationService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.get<any[]>('v1/radiology/reporting').subscribe({
      next: r => this.orders = r,
      error: (err) => { this.notification.error(err?.message || 'Failed to load reporting orders'); }
    });
  }
}
