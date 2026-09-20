import { Component, OnInit } from '@angular/core';
import { ApiService, PagedResult } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-payments-list',
  template: `
    <app-main-layout>
      <app-page-header title="Payments" [breadcrumbs]="[{ label: 'Billing', route: '/billing' }, { label: 'Payments' }]">
          </app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search payments..." (search)="onSearch($event)"></app-search-input>
          <app-date-range-picker (rangeChange)="onDateRange($event)"></app-date-range-picker>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()"><mat-icon>filter_list_off</mat-icon> Clear</button>
        </div>
        <table mat-table [dataSource]="payments" class="mat-elevation-z1">
          <ng-container matColumnDef="paymentNumber">
            <th mat-header-cell *matHeaderCellDef>Payment #</th>
            <td mat-cell *matCellDef="let p">{{ p.paymentNumber }}</td>
          </ng-container>
          <ng-container matColumnDef="invoice">
            <th mat-header-cell *matHeaderCellDef>Invoice</th>
            <td mat-cell *matCellDef="let p">{{ p.invoiceNumber || '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="patient">
            <th mat-header-cell *matHeaderCellDef>Patient</th>
            <td mat-cell *matCellDef="let p">{{ p.patientName }}</td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let p">{{ p.paymentDate | date:'mediumDate' }}</td>
          </ng-container>
          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef class="right">Amount</th>
            <td mat-cell *matCellDef="let p" class="right">{{ p.amount | currencyFormat }}</td>
          </ng-container>
          <ng-container matColumnDef="method">
            <th mat-header-cell *matHeaderCellDef>Method</th>
            <td mat-cell *matCellDef="let p">{{ p.method }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let p">{{ p.isRefund ? 'Refunded' : p.status }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; } .filters { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; } table { width: 100%; } th.right, td.right { text-align: right; }`]
})
export class PaymentsListComponent implements OnInit {
  payments: any[] = [];
  columns = ['paymentNumber', 'invoice', 'patient', 'date', 'amount', 'method', 'status'];
  totalCount = 0; pageSize = 10; pageIndex = 0; searchTerm = ''; startDate: Date | null = null; endDate: Date | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.get<PagedResult<any>>('v1/invoices/payments', {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm,
      startDate: this.startDate?.toISOString(),
      endDate: this.endDate?.toISOString()
    }).subscribe(r => { this.payments = r.items; this.totalCount = r.totalCount; });
  }

  onSearch(term: string) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
  onDateRange(range: any) { this.startDate = range.start; this.endDate = range.end; this.load(); }
  onPage(e: any) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }

  hasActiveFilters(): boolean { return !!(this.searchTerm || this.startDate || this.endDate); }

  clearFilters(): void {
    this.searchTerm = '';
    this.startDate = null;
    this.endDate = null;
    this.pageIndex = 0;
    this.load();
  }
}
