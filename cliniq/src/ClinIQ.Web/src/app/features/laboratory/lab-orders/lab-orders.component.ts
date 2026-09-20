import { Component, OnInit } from '@angular/core';
import { ApiService, PagedResult } from '../../../core/services/api.service';

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
          <app-search-input placeholder="Search..." (search)="onSearch($event)"></app-search-input>
          <mat-form-field appearance="outline"><mat-label>Status</mat-label><mat-select [(value)]="filterStatus" (selectionChange)="load()"><mat-option value="">All</mat-option><mat-option value="Pending">Pending</mat-option><mat-option value="InProgress">In Progress</mat-option><mat-option value="Completed">Completed</mat-option></mat-select></mat-form-field>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear Filters
          </button>
        </div>
        <table mat-table [dataSource]="orders">
          <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}</td></ng-container>
          <ng-container matColumnDef="tests"><th mat-header-cell *matHeaderCellDef>Tests</th><td mat-cell *matCellDef="let o">
            <span *ngFor="let t of getTests(o); let last = last">{{ t }}<span *ngIf="!last">, </span></span>
          </td></ng-container>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let o">{{ o.orderDate | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let o">
            <button mat-icon-button color="primary" [routerLink]="['results', o.id]" matTooltip="Enter Results" *ngIf="o.status !== 'Completed'"><mat-icon>edit_note</mat-icon></button>
            <button mat-icon-button color="primary" (click)="printOrder(o.id)" matTooltip="Print Report"><mat-icon>print</mat-icon></button>
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
  columns = ['orderNumber', 'patient', 'tests', 'date', 'status', 'actions'];
  totalCount = 0; pageSize = 10; pageIndex = 0; searchTerm = ''; filterStatus = '';

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.get<PagedResult<any>>('v1/laboratory/orders', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, status: this.filterStatus })
      .subscribe(r => { this.orders = r.items; this.totalCount = r.totalCount; });
  }

  getTests(order: any): string[] {
    const raw = order.tests || order.Tests;
    if (Array.isArray(raw)) {
      return raw.map((t: any) => typeof t === 'string' ? t : (t.testName || t.name || ''));
    }
    return [];
  }

  printOrder(id: string) {
    window.open(`/laboratory/print/${id}`, '_blank');
  }

  onSearch(term: string) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
  onPage(e: any) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
  hasActiveFilters(): boolean { return !!(this.searchTerm || this.filterStatus); }
  clearFilters(): void { this.searchTerm = ''; this.filterStatus = ''; this.pageIndex = 0; this.load(); }
}
