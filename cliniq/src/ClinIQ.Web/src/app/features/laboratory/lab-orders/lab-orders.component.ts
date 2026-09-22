import { Component, OnInit } from '@angular/core';
import { ApiService, PagedResult } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-lab-orders',
  template: `
    <app-main-layout>
      <app-page-header title="Lab Orders" [breadcrumbs]="[{ label: 'Laboratory', route: '/laboratory' }, { label: 'Orders' }]">
        <button mat-raised-button color="primary" routerLink="new">
          <mat-icon>add</mat-icon> New Order
        </button>
      </app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search orders..." (search)="onSearch($event)"></app-search-input>
          <mat-form-field appearance="outline"><mat-label>Status</mat-label><mat-select [(value)]="filterStatus" (selectionChange)="load()"><mat-option value="">All</mat-option><mat-option value="Ordered">Ordered</mat-option><mat-option value="SamplePending">Sample Pending</mat-option><mat-option value="SampleCollected">Sample Collected</mat-option><mat-option value="Processing">Processing</mat-option><mat-option value="ResultEntered">Result Entered</mat-option><mat-option value="Verified">Verified</mat-option><mat-option value="Completed">Completed</mat-option><mat-option value="Cancelled">Cancelled</mat-option></mat-select></mat-form-field>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear
          </button>
        </div>
        <table mat-table [dataSource]="orders">
          <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}<br><small>MRN: {{ o.mrn }}</small></td></ng-container>
          <ng-container matColumnDef="tests"><th mat-header-cell *matHeaderCellDef>Tests</th><td mat-cell *matCellDef="let o">
            <span *ngIf="o.items?.length > 0"><span *ngFor="let item of o.items; let last = last">{{ item.serviceName }}<span *ngIf="!last">, </span></span></span>
            <span *ngIf="!o.items?.length && o.clinicalIndication">{{ o.clinicalIndication }}</span>
            <span *ngIf="!o.items?.length && !o.clinicalIndication">{{ o.testCount }} test(s)</span>
          </td></ng-container>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let o">{{ o.orderDate | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="priority"><th mat-header-cell *matHeaderCellDef>Priority</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.priority"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let o">
            <button mat-icon-button color="primary" [routerLink]="['/laboratory/results', o.id]" matTooltip="Enter Results" *ngIf="o.status === 'SampleCollected' || o.status === 'Processing'"><mat-icon>edit_note</mat-icon></button>
            <button mat-icon-button color="primary" [routerLink]="['/laboratory/results', o.id]" matTooltip="View Results" *ngIf="o.status === 'Verified' || o.status === 'Completed'"><mat-icon>visibility</mat-icon></button>
            <button mat-icon-button color="primary" (click)="printOrder(o.id)" matTooltip="Print"><mat-icon>print</mat-icon></button>
            <button mat-icon-button color="warn" (click)="cancelOrder(o)" matTooltip="Cancel Order" *ngIf="o.status !== 'Verified' && o.status !== 'Completed' && o.status !== 'Cancelled'"><mat-icon>cancel</mat-icon></button>
            <button mat-icon-button color="warn" (click)="deleteOrder(o)" matTooltip="Delete Order" *ngIf="o.status === 'Cancelled' || o.status === 'Ordered'"><mat-icon>delete</mat-icon></button>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <div *ngIf="orders.length === 0" class="empty-state">
          <mat-icon>science</mat-icon>
          <p>No lab orders found</p>
        </div>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; } .filters { display: flex; gap: 1rem; margin-bottom: 1rem; } table { width: 100%; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 2rem; color: var(--text-muted, #999); }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 0.5rem; }`]
})
export class LabOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = false;
  columns = ['orderNumber', 'patient', 'tests', 'date', 'priority', 'status', 'actions'];
  totalCount = 0; pageSize = 10; pageIndex = 0; searchTerm = ''; filterStatus = '';

  constructor(private api: ApiService, private notification: NotificationService, private dialog: MatDialog) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.get<PagedResult<any>>('v1/laboratory/orders', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, status: this.filterStatus })
      .subscribe({
        next: r => { this.orders = r.items; this.totalCount = r.totalCount; this.loading = false; },
        error: (err) => { this.loading = false; this.notification.error(err?.message || 'Failed to load orders'); }
      });
  }

  cancelOrder(order: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Cancel Order', message: `Are you sure you want to cancel order ${order.orderNumber}?`, confirmText: 'Cancel Order', cancelText: 'No' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.post(`v1/laboratory/orders/${order.id}/cancel`, {}).subscribe({
          next: () => { this.notification.success('Order cancelled'); this.load(); },
          error: (err) => this.notification.error(err?.message || 'Failed to cancel order')
        });
      }
    });
  }

  deleteOrder(order: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Order', message: `Are you sure you want to permanently delete order ${order.orderNumber}? This action cannot be undone.`, confirmText: 'Delete', cancelText: 'No' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete(`v1/laboratory/orders`, order.id).subscribe({
          next: () => { this.notification.success('Order deleted'); this.load(); },
          error: (err) => this.notification.error(err?.message || 'Failed to delete order')
        });
      }
    });
  }

  printOrder(id: string) { window.open(`/laboratory/print/${id}`, '_blank'); }
  onSearch(term: string) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
  onPage(e: any) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
  hasActiveFilters(): boolean { return !!(this.searchTerm || this.filterStatus); }
  clearFilters(): void { this.searchTerm = ''; this.filterStatus = ''; this.pageIndex = 0; this.load(); }
}
