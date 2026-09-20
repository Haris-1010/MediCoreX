import { Component, OnInit } from '@angular/core';
import { ApiService, PagedResult } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-radiology-orders',
  template: `
    <app-main-layout>
      <app-page-header title="Radiology Orders" [breadcrumbs]="[{ label: 'Radiology', route: '/radiology' }, { label: 'Orders' }]">
        <button mat-raised-button color="primary" routerLink="new">
          <mat-icon>add</mat-icon> New Order
        </button>
      </app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search orders..." (search)="onSearch($event)"></app-search-input>
          <mat-form-field appearance="outline"><mat-label>Status</mat-label><mat-select [(value)]="filterStatus" (selectionChange)="load()"><mat-option value="">All</mat-option><mat-option value="Ordered">Ordered</mat-option><mat-option value="InProgress">In Progress</mat-option><mat-option value="Completed">Completed</mat-option></mat-select></mat-form-field>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear Filters
          </button>
        </div>
        <table mat-table [dataSource]="orders">
          <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}</td></ng-container>
          <ng-container matColumnDef="clinicalIndication"><th mat-header-cell *matHeaderCellDef>Clinical Indication</th><td mat-cell *matCellDef="let o">{{ o.clinicalIndication }}</td></ng-container>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let o">{{ o.orderDate | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let o">
            <button mat-icon-button color="primary" [routerLink]="['../reports', o.id]" matTooltip="View / Enter Report" *ngIf="o.status !== 'Completed'"><mat-icon>edit_note</mat-icon></button>
            <button mat-icon-button color="primary" [routerLink]="['../reports', o.id]" matTooltip="View Report" *ngIf="o.status === 'Completed'"><mat-icon>visibility</mat-icon></button>
            <button mat-icon-button color="primary" (click)="printOrder(o.id)" matTooltip="Print Report"><mat-icon>print</mat-icon></button>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <div *ngIf="orders.length === 0" class="empty-state">
          <mat-icon>radiology</mat-icon>
          <p>No radiology orders found</p>
        </div>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: white; padding: 1.5rem; border-radius: 8px; } .filters { display: flex; gap: 1rem; margin-bottom: 1rem; } table { width: 100%; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 2rem; color: #999; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 0.5rem; }`]
})
export class RadiologyOrdersComponent implements OnInit {
  orders: any[] = [];
  columns = ['orderNumber', 'patient', 'clinicalIndication', 'date', 'status', 'actions'];
  totalCount = 0; pageSize = 10; pageIndex = 0; searchTerm = ''; filterStatus = '';

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.get<PagedResult<any>>('v1/radiology/orders', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, status: this.filterStatus })
      .subscribe(r => { this.orders = r.items; this.totalCount = r.totalCount; });
  }

  onSearch(term: string) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
  onPage(e: any) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }

  printOrder(id: string) {
    window.open(`/radiology/print/${id}`, '_blank');
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.filterStatus);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterStatus = '';
    this.pageIndex = 0;
    this.load();
  }
}
