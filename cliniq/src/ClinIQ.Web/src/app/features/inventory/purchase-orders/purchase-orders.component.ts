import { Component, OnInit } from '@angular/core';
import { ApiService, PagedResult } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-purchase-orders',
  template: `
    <app-main-layout>
      <app-page-header title="Purchase Orders" [breadcrumbs]="[{ label: 'Inventory', route: '/inventory' }, { label: 'Purchase Orders' }]">
        <button mat-raised-button color="primary" (click)="createOrder()"><mat-icon>add</mat-icon> New Order</button>
      </app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search..." (search)="onSearch($event)"></app-search-input>
          <mat-form-field appearance="outline"><mat-label>Status</mat-label><mat-select [(value)]="filterStatus" (selectionChange)="load()"><mat-option value="">All</mat-option><mat-option value="Draft">Draft</mat-option><mat-option value="Submitted">Submitted</mat-option><mat-option value="Approved">Approved</mat-option><mat-option value="Received">Received</mat-option></mat-select></mat-form-field>
        </div>
        <table mat-table [dataSource]="orders">
          <ng-container matColumnDef="poNumber"><th mat-header-cell *matHeaderCellDef>PO Number</th><td mat-cell *matCellDef="let o">{{ o.poNumber }}</td></ng-container>
          <ng-container matColumnDef="supplier"><th mat-header-cell *matHeaderCellDef>Supplier</th><td mat-cell *matCellDef="let o">{{ o.supplierName }}</td></ng-container>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let o">{{ o.orderDate | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="total"><th mat-header-cell *matHeaderCellDef>Total</th><td mat-cell *matCellDef="let o">{{ o.totalAmount | currency }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let o"><button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button><mat-menu #menu="matMenu"><button mat-menu-item><mat-icon>visibility</mat-icon> View</button><button mat-menu-item *ngIf="o.status === 'Approved'"><mat-icon>local_shipping</mat-icon> Receive</button></mat-menu></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: white; padding: 1.5rem; border-radius: 8px; } .filters { display: flex; gap: 1rem; margin-bottom: 1rem; } table { width: 100%; }`]
})
export class PurchaseOrdersComponent implements OnInit {
  orders: any[] = [];
  columns = ['poNumber', 'supplier', 'date', 'total', 'status', 'actions'];
  totalCount = 0; pageSize = 10; pageIndex = 0; searchTerm = ''; filterStatus = '';

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.get<PagedResult<any>>('v1/purchase-orders', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, status: this.filterStatus })
      .subscribe(r => { this.orders = r.items; this.totalCount = r.totalCount; });
  }

  onSearch(term: string) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
  onPage(e: any) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
  createOrder() {
    const supplierName = prompt('Supplier name:');
    if (!supplierName) return;
    const orderDate = new Date().toISOString().split('T')[0];
    this.api.post('v1/purchase-orders', { supplierName, orderDate, status: 'Draft', items: [] }).subscribe({
      next: () => { this.load(); },
      error: () => {}
    });
  }
}
