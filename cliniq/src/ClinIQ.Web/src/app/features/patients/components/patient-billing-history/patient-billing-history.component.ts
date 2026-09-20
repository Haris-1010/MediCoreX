import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceDetailDialogComponent } from './invoice-detail-dialog/invoice-detail-dialog.component';

@Component({
  standalone: false,
  selector: 'app-patient-billing-history',
  template: `
    <div class="patient-billing-history">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div *ngIf="!loading && invoices.length === 0" class="empty-state">
        <mat-icon>receipt_long</mat-icon>
        <h4>No Billing Records</h4>
        <p>No invoices found for this patient yet.</p>
      </div>

      <div *ngIf="!loading && invoices.length > 0" class="billing-list">
        <div class="billing-summary-bar">
          <span class="record-count">{{ invoices.length }} invoice{{ invoices.length !== 1 ? 's' : '' }}</span>
          <div class="summary-totals">
            <span class="total-col">Total: <strong>{{ getTotal() | currencyFormat }}</strong></span>
            <span class="paid-col">Paid: <strong>{{ getPaid() | currencyFormat }}</strong></span>
            <span class="due-col" *ngIf="getDue() > 0">Due: <strong>{{ getDue() | currencyFormat }}</strong></span>
          </div>
        </div>

        <div class="invoice-card" *ngFor="let invoice of invoices" (click)="openInvoiceDetail(invoice)">
          <div class="invoice-card-left">
            <div class="invoice-icon">
              <mat-icon [class]="getIconClass(invoice.status)">{{ getIcon(invoice.status) }}</mat-icon>
            </div>
            <div class="invoice-info">
              <div class="invoice-number">{{ invoice.invoiceNumber }}</div>
              <div class="invoice-date">{{ invoice.invoiceDate | date:'dd MMM yyyy, h:mm a' }}</div>
            </div>
          </div>
          <div class="invoice-card-right">
            <div class="invoice-amounts">
              <span class="amount-total">{{ invoice.totalAmount | currencyFormat }}</span>
              <span class="amount-due" *ngIf="getOutstanding(invoice) > 0">
                {{ getOutstanding(invoice) | currencyFormat }} due
              </span>
              <span class="amount-paid" *ngIf="getOutstanding(invoice) <= 0">
                Paid in full
              </span>
            </div>
            <div class="invoice-status">
              <span class="status-chip" [class]="getStatusClass(invoice.status)">
                {{ invoice.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .patient-billing-history { padding: 0.5rem 0; }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--text-muted, #999);
    }
    .empty-state mat-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: var(--text-muted, #d0d0d0);
      margin-bottom: 0.75rem;
    }
    .empty-state h4 { margin: 0 0 0.25rem; color: var(--text-secondary, #666); font-size: 1rem; }
    .empty-state p { margin: 0; font-size: 0.85rem; }

    .billing-summary-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.6rem 1rem;
      background: var(--table-header-bg, #f8f9fa);
      border-radius: 8px;
      margin-bottom: 0.75rem;
      font-size: 0.8rem;
      color: var(--text-secondary, #666);
    }
    .summary-totals { display: flex; gap: 1.25rem; }
    .paid-col { color: #2e7d32; }
    .due-col { color: #d32f2f; }

    .invoice-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.15rem;
      background: var(--bg-card, #fff);
      border: 1px solid var(--border-color, #e8e8e8);
      border-radius: 10px;
      margin-bottom: 0.5rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .invoice-card:hover {
      border-color: #c5cae9;
      box-shadow: 0 2px 8px rgba(63, 81, 181, 0.08);
      transform: translateY(-1px);
    }

    .invoice-card-left { display: flex; align-items: center; gap: 0.85rem; }

    .invoice-icon mat-icon {
      width: 38px;
      height: 38px;
      font-size: 22px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .invoice-icon mat-icon.status-paid { background: #e8f5e9; color: #2e7d32; }
    .invoice-icon mat-icon.status-pending { background: #fff3e0; color: #e65100; }
    .invoice-icon mat-icon.status-partial { background: #e3f2fd; color: #1565c0; }
    .invoice-icon mat-icon.status-overdue { background: #fce4ec; color: #c62828; }
    .invoice-icon mat-icon.status-default { background: #f5f5f5; color: #757575; }

    .invoice-info { display: flex; flex-direction: column; gap: 2px; }
    .invoice-number { font-weight: 600; font-size: 0.9rem; color: var(--text-primary, #333); }
    .invoice-date { font-size: 0.78rem; color: var(--text-muted, #888); }

    .invoice-card-right { display: flex; align-items: center; gap: 1rem; }
    .invoice-amounts { text-align: right; display: flex; flex-direction: column; gap: 1px; }
    .amount-total { font-weight: 700; font-size: 0.95rem; color: var(--text-primary, #333); }
    .amount-due { font-size: 0.75rem; color: #d32f2f; }
    .amount-paid { font-size: 0.75rem; color: #2e7d32; font-style: italic; }

    .status-chip {
      display: inline-block;
      padding: 0.2rem 0.65rem;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .status-chip.paid { background: #e8f5e9; color: #2e7d32; }
    .status-chip.pending { background: #fff3e0; color: #e65100; }
    .status-chip.partiallypaid { background: #e3f2fd; color: #1565c0; }
    .status-chip.overdue { background: #fce4ec; color: #c62828; }
    .status-chip.draft { background: #f5f5f5; color: #616161; }
    .status-chip.finalized { background: #e8eaf6; color: #283593; }
    .status-chip.cancelled { background: #f5f5f5; color: #9e9e9e; }
  `]
})
export class PatientBillingHistoryComponent implements OnInit {
  @Input() patientId!: string;
  invoices: any[] = [];
  loading = true;

  constructor(
    private api: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.api.get<any>('v1/invoices', { patientId: this.patientId, pageSize: 50 }).subscribe({
      next: (response) => {
        this.invoices = response?.items || [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getTotal(): number {
    return this.invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  }

  getPaid(): number {
    return this.invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  }

  getDue(): number {
    return this.invoices.reduce((sum, inv) => sum + (inv.outstandingAmount || 0), 0);
  }

  getOutstanding(invoice: any): number {
    return invoice.outstandingAmount ?? (invoice.totalAmount - (invoice.paidAmount || 0));
  }

  getStatusClass(status: string): string {
    return (status || '').toLowerCase().replace(/\s+/g, '');
  }

  getIcon(status: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'paid') return 'check_circle';
    if (s === 'overdue') return 'error';
    if (s === 'partiallypaid') return 'hourglass_top';
    if (s === 'pending') return 'schedule';
    if (s === 'cancelled') return 'cancel';
    if (s === 'draft') return 'edit_note';
    return 'receipt';
  }

  getIconClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'paid') return 'status-paid';
    if (s === 'overdue') return 'status-overdue';
    if (s === 'partiallypaid') return 'status-partial';
    if (s === 'pending') return 'status-pending';
    return 'status-default';
  }

  openInvoiceDetail(invoice: any): void {
    this.dialog.open(InvoiceDetailDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      data: { invoice }
    });
  }
}
