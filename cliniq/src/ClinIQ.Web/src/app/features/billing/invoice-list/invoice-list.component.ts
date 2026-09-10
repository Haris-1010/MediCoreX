import { Component, OnInit } from '@angular/core';
import { ApiService, PagedResult } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-invoice-list',
  template: `
    <app-main-layout>
      <app-page-header title="Invoices" [breadcrumbs]="[{ label: 'Billing', route: '/billing' }, { label: 'Invoices' }]">
        <button mat-raised-button color="primary" routerLink="new"><mat-icon>add</mat-icon> New Invoice</button>
      </app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search..." (search)="onSearch($event)"></app-search-input>
          <app-date-range-picker (rangeChange)="onDateRange($event)"></app-date-range-picker>
          <mat-form-field appearance="outline"><mat-label>Status</mat-label>
            <mat-select [(value)]="filterStatus" (selectionChange)="load()">
              <mat-option value="">All</mat-option><mat-option value="Paid">Paid</mat-option><mat-option value="Unpaid">Unpaid</mat-option><mat-option value="PartiallyPaid">Partially Paid</mat-option><mat-option value="Overdue">Overdue</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear Filters
          </button>
        </div>
        <table mat-table [dataSource]="invoices">
          <ng-container matColumnDef="invoiceNumber"><th mat-header-cell *matHeaderCellDef>Invoice #</th><td mat-cell *matCellDef="let i">{{ i.invoiceNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let i">{{ i.patientName }}</td></ng-container>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let i">{{ i.invoiceDate | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>Amount</th><td mat-cell *matCellDef="let i">{{ i.totalAmount | currency }}</td></ng-container>
          <ng-container matColumnDef="paid"><th mat-header-cell *matHeaderCellDef>Paid</th><td mat-cell *matCellDef="let i">{{ i.paidAmount | currency }}</td></ng-container>
          <ng-container matColumnDef="balance"><th mat-header-cell *matHeaderCellDef>Balance</th><td mat-cell *matCellDef="let i" [class.overdue]="i.status === 'Overdue'">{{ i.balanceAmount | currency }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let i"><app-status-badge [status]="i.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let i">
              <button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item [routerLink]="[i.id]"><mat-icon>visibility</mat-icon> View</button>
                <button mat-menu-item [routerLink]="['/billing/payment', i.id]" *ngIf="i.balanceAmount > 0"><mat-icon>payment</mat-icon> Receive Payment</button>
                <button mat-menu-item (click)="print(i)"><mat-icon>print</mat-icon> Print</button>
              </mat-menu>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: white; padding: 1.5rem; border-radius: 8px; } .filters { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; } table { width: 100%; } .overdue { color: #f44336; font-weight: 600; }`]
})
export class InvoiceListComponent implements OnInit {
  invoices: any[] = [];
  columns = ['invoiceNumber', 'patient', 'date', 'amount', 'paid', 'balance', 'status', 'actions'];
  totalCount = 0; pageSize = 10; pageIndex = 0; searchTerm = ''; filterStatus = ''; startDate: Date | null = null; endDate: Date | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.get<PagedResult<any>>('v1/invoices', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, status: this.filterStatus, startDate: this.startDate?.toISOString(), endDate: this.endDate?.toISOString() })
      .subscribe(r => { this.invoices = r.items; this.totalCount = r.totalCount; });
  }

  onSearch(term: string) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
  onDateRange(range: any) { this.startDate = range.start; this.endDate = range.end; this.load(); }
  onPage(e: any) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
  print(i: any) { window.open(`/api/v1/invoices/${i.id}/print`, '_blank'); }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.filterStatus || this.startDate || this.endDate);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterStatus = '';
    this.startDate = null;
    this.endDate = null;
    this.pageIndex = 0;
    this.load();
  }
}
