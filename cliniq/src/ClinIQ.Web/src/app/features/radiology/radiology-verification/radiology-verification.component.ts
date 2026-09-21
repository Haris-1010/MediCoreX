import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-radiology-verification',
  template: `
    <app-main-layout>
      <app-page-header title="Radiology Verification" [breadcrumbs]="[{ label: 'Radiology', route: '/radiology' }, { label: 'Verification' }]"></app-page-header>
      <div class="card">
        <table mat-table [dataSource]="orders">
          <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}<br><small>{{ o.mrn }}</small></td></ng-container>
          <ng-container matColumnDef="investigation"><th mat-header-cell *matHeaderCellDef>Investigation</th><td mat-cell *matCellDef="let o">
            <div *ngFor="let item of o.items">{{ item.serviceName }} ({{ item.modality }})</div>
          </td></ng-container>
          <ng-container matColumnDef="reportedBy"><th mat-header-cell *matHeaderCellDef>Reported By</th><td mat-cell *matCellDef="let o">{{ o.reportedBy || '-' }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th><td mat-cell *matCellDef="let o">
            <button mat-icon-button color="primary" [routerLink]="['/radiology/reports', o.id]" matTooltip="View Report"><mat-icon>visibility</mat-icon></button>
            <button mat-raised-button color="primary" (click)="verify(o)" matTooltip="Verify"><mat-icon>verified</mat-icon> Verify</button>
            <button mat-stroked-button color="warn" (click)="openReturnDialog(o)"><mat-icon>replay</mat-icon> Return</button>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <div *ngIf="orders.length === 0" class="empty-state">
          <mat-icon>verified</mat-icon>
          <p>No reports pending verification</p>
        </div>
      </div>

      <div class="dialog-overlay" *ngIf="showReturnDialog" (click)="showReturnDialog = false">
        <div class="dialog" (click)="$event.stopPropagation()">
          <h3>Return for Correction</h3>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Reason</mat-label>
            <textarea matInput [(ngModel)]="returnReason" rows="3"></textarea>
          </mat-form-field>
          <div class="dialog-actions">
            <button mat-stroked-button (click)="showReturnDialog = false">Cancel</button>
            <button mat-raised-button color="warn" (click)="returnForCorrection()" [disabled]="returning">
              {{ returning ? 'Returning...' : 'Return' }}
            </button>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    table { width: 100%; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 2rem; color: var(--text-muted, #999); }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 0.5rem; }
    .dialog-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog { background: var(--bg-card, #fff); border-radius: 12px; padding: 1.5rem; max-width: 400px; width: 90%; }
    .dialog h3 { margin: 0 0 1rem; }
    .full-width { width: 100%; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
  `]
})
export class RadiologyVerificationComponent implements OnInit {
  orders: any[] = [];
  columns = ['orderNumber', 'patient', 'investigation', 'reportedBy', 'actions'];
  showReturnDialog = false;
  selectedOrder: any = null;
  returnReason = '';
  returning = false;
  loading = false;

  constructor(private api: ApiService, private notification: NotificationService, private auth: AuthService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.get<any[]>('v1/radiology/verification').subscribe({
      next: r => { this.orders = r; this.loading = false; },
      error: (err) => { this.loading = false; this.notification.error(err?.message || 'Failed to load orders'); }
    });
  }

  verify(order: any) {
    this.api.post(`v1/radiology/orders/${order.id}/verify`, {
      verified: true,
      verifiedById: this.auth.getCurrentUser()?.id || null
    }).subscribe({
      next: () => { this.notification.success('Report verified'); this.load(); },
      error: (err) => { this.notification.error(err?.message || 'Failed to verify report'); }
    });
  }

  openReturnDialog(order: any) {
    this.selectedOrder = order;
    this.returnReason = '';
    this.showReturnDialog = true;
  }

  returnForCorrection() {
    if (!this.returnReason.trim()) { this.notification.error('Please enter a reason'); return; }
    this.returning = true;
    this.api.post(`v1/radiology/orders/${this.selectedOrder.id}/verify`, {
      verified: false,
      verifiedById: this.auth.getCurrentUser()?.id || null,
      returnReason: this.returnReason
    }).subscribe({
      next: () => { this.notification.success('Report returned'); this.showReturnDialog = false; this.load(); this.returning = false; },
      error: (err) => { this.returning = false; this.notification.error(err?.message || 'Failed to return report'); }
    });
  }
}
