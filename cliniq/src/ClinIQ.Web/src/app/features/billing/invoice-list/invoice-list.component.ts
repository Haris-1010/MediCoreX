import { Component, OnInit } from '@angular/core';
import { ApiService, PagedResult } from '../../../core/services/api.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-invoice-list',
  template: `
    <app-main-layout>
      <app-page-header title="Invoices" [breadcrumbs]="[{ label: 'Billing', route: '/billing' }, { label: 'Invoices' }]">
        <button mat-raised-button color="primary" routerLink="new"><mat-icon>add</mat-icon> New Invoice</button>
      </app-page-header>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <mat-icon class="icon">receipt_long</mat-icon>
          <div class="card-content">
            <h3>{{ stats.totalSale | currencyFormat }}</h3>
            <p>Total Sale</p>
          </div>
        </div>
        <div class="summary-card">
          <mat-icon class="icon">description</mat-icon>
          <div class="card-content">
            <h3>{{ stats.totalCount }}</h3>
            <p>Total Invoices</p>
            <small>{{ stats.paidCount }} Paid • {{ stats.pendingCount }} Pending • {{ stats.refundCount }} Refunded</small>
          </div>
        </div>
        <div class="summary-card warning">
          <mat-icon class="icon">account_balance_wallet</mat-icon>
          <div class="card-content">
            <h3>{{ stats.totalReceivable | currencyFormat }}</h3>
            <p>Amount Receivable</p>
            <small>{{ stats.totalPaid | currencyFormat }} Paid • {{ stats.totalRefunded | currencyFormat }} Refunded</small>
          </div>
        </div>
        <div class="summary-card refund">
          <mat-icon class="icon">assignment_return</mat-icon>
          <div class="card-content">
            <h3>{{ stats.refundCount }}</h3>
            <p>Refunded Invoices</p>
            <small>{{ stats.totalRefunded | currencyFormat }} Refunded</small>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search..." (search)="onSearch($event)"></app-search-input>
          <app-date-range-picker (rangeChange)="onDateRange($event)"></app-date-range-picker>
          <mat-form-field appearance="outline"><mat-label>Status</mat-label>
            <mat-select [(value)]="filterStatus" (selectionChange)="load()">
              <mat-option value="">All</mat-option>
              <mat-option value="Draft">Draft</mat-option>
              <mat-option value="Finalized">Finalized</mat-option>
              <mat-option value="PartiallyPaid">Partially Paid</mat-option>
              <mat-option value="Paid">Paid</mat-option>
              <mat-option value="Overdue">Overdue</mat-option>
              <mat-option value="Cancelled">Cancelled</mat-option>
              <mat-option value="Refunded">Refunded</mat-option>
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
          <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>Amount</th><td mat-cell *matCellDef="let i">{{ i.totalAmount | currencyFormat }}</td></ng-container>
          <ng-container matColumnDef="paid"><th mat-header-cell *matHeaderCellDef>Paid</th><td mat-cell *matCellDef="let i">{{ i.paidAmount | currencyFormat }}</td></ng-container>
          <ng-container matColumnDef="balance"><th mat-header-cell *matHeaderCellDef>Balance</th><td mat-cell *matCellDef="let i" [class.overdue]="i.status === 'Overdue'">{{ i.outstandingAmount | currencyFormat }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let i"><app-status-badge [status]="i.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let i">
              <button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item [routerLink]="[i.id]"><mat-icon>visibility</mat-icon> View</button>
                <button mat-menu-item [routerLink]="[i.id, 'edit']" *ngIf="!['Cancelled', 'Refunded', 'WrittenOff'].includes(i.status)"><mat-icon>edit</mat-icon> Edit</button>
                <button mat-menu-item [routerLink]="['/billing/payment', i.id]" *ngIf="i.outstandingAmount > 0 && i.status !== 'Cancelled' && i.status !== 'Refunded'"><mat-icon>payment</mat-icon> Receive Payment</button>
                <button mat-menu-item [routerLink]="[i.id, 'print']"><mat-icon>print</mat-icon> Print</button>
                <button mat-menu-item color="warn" (click)="returnInvoice(i)"
                        *ngIf="canReturn(i)"><mat-icon>assignment_return</mat-icon> Return</button>
                <button mat-menu-item color="warn" (click)="deleteInvoice(i, $event)"
                        *ngIf="!['Cancelled', 'WrittenOff'].includes(i.status)"><mat-icon>delete</mat-icon> Delete</button>
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
  styles: [`
    .summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .summary-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.25rem; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border: 1px solid #f0f0f0; }
    .summary-card .icon { font-size: 32px; width: 32px; height: 32px; color: #3f51b5; }
    .summary-card.warning .icon { color: #f57c00; }
    .summary-card.refund .icon { color: #e91e63; }
    .summary-card .card-content h3 { margin: 0; font-size: 1.5rem; font-weight: 700; color: #1a1a1a; }
    .summary-card .card-content p { margin: 0.25rem 0 0; font-size: 0.85rem; color: #666; }
    .summary-card .card-content small { display: block; margin-top: 0.25rem; font-size: 0.75rem; color: #888; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; }
    .filters { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
    table { width: 100%; }
    .overdue { color: #f44336; font-weight: 600; }
  `]
})
export class InvoiceListComponent implements OnInit {
  invoices: any[] = [];
  columns = ['invoiceNumber', 'patient', 'date', 'amount', 'paid', 'balance', 'status', 'actions'];
  totalCount = 0; pageSize = 10; pageIndex = 0; searchTerm = ''; filterStatus = ''; startDate: Date | null = null; endDate: Date | null = null;
  stats = { totalSale: 0, totalPaid: 0, totalRefunded: 0, totalReceivable: 0, totalCount: 0, paidCount: 0, pendingCount: 0, refundCount: 0 };

  constructor(private api: ApiService, private router: Router, private notification: NotificationService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.get<PagedResult<any>>('v1/invoices', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, status: this.filterStatus, startDate: this.startDate?.toISOString(), endDate: this.endDate?.toISOString() })
      .subscribe(r => { this.invoices = r.items; this.totalCount = r.totalCount; });
    this.loadStats();
  }

  loadStats() {
    this.api.get<any>('v1/invoices/stats', { searchTerm: this.searchTerm, status: this.filterStatus, startDate: this.startDate?.toISOString(), endDate: this.endDate?.toISOString() })
      .subscribe(r => this.stats = r);
  }

  onSearch(term: string) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
  onDateRange(range: any) { this.startDate = range.start; this.endDate = range.end; this.load(); }
  onPage(e: any) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }

  canReturn(invoice: any): boolean {
    return invoice.paidAmount > 0 && !['Cancelled', 'Refunded', 'WrittenOff'].includes(invoice.status);
  }

  returnInvoice(invoice: any) {
    if (!confirm(`Return invoice ${invoice.invoiceNumber}? This will refund the invoice and set its status to Refunded.`)) return;

    this.api.post<any>(`v1/invoices/${invoice.id}/return`, { notes: 'Invoice returned' }).subscribe({
      next: () => { this.notification.success('Invoice returned successfully'); this.load(); },
      error: () => { this.notification.error('Failed to return invoice'); }
    });
  }

  deleteInvoice(invoice: any, event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (!confirm(`Delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`)) return;

    this.api.delete<any>(`v1/invoices`, invoice.id).subscribe({
      next: () => { this.notification.success('Invoice deleted successfully'); this.load(); },
      error: () => { this.notification.error('Failed to delete invoice'); }
    });
  }

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
