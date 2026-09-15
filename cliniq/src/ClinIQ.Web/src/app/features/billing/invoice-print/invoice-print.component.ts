import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { TenantService } from '../../../core/services/tenant.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-invoice-print',
  template: `
    <div class="print-container" *ngIf="invoice">
      <div class="brand" *ngIf="branding?.logoUrl || branding?.name">
        <img *ngIf="branding?.logoUrl" [src]="branding?.logoUrl" alt="logo" class="brand-logo">
        <div class="brand-info">
          <h2>{{ branding?.name || 'Hospital Name' }}</h2>
          <p *ngIf="branding?.phone">{{ branding?.phone }}</p>
          <p *ngIf="branding?.address">{{ branding?.address }}</p>
        </div>
      </div>

      <div class="invoice-header">
        <div class="invoice-title">
          <h1>INVOICE</h1>
          <p class="invoice-number">{{ invoice.invoiceNumber }}</p>
        </div>
        <div class="invoice-meta">
          <p><strong>Date:</strong> {{ invoice.invoiceDate | date:'mediumDate' }}</p>
          <p *ngIf="invoice.dueDate"><strong>Due Date:</strong> {{ invoice.dueDate | date:'mediumDate' }}</p>
          <p><strong>Status:</strong> <app-status-badge [status]="invoice.status"></app-status-badge></p>
        </div>
      </div>

      <div class="patient-info">
        <div class="info-row">
          <span class="label">Patient:</span>
          <span class="value">{{ invoice.patientName || '-' }}</span>
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th class="right">Qty</th>
            <th class="right">Rate</th>
            <th class="right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of invoice.items; let i = index">
            <td>{{ i + 1 }}</td>
            <td>{{ item.description }}</td>
            <td class="right">{{ item.quantity }}</td>
            <td class="right">{{ item.unitPrice | currencyFormat }}</td>
            <td class="right">{{ item.totalAmount | currencyFormat }}</td>
          </tr>
        </tbody>
      </table>

      <div class="totals-section">
        <div class="total-row"><span>Subtotal:</span><span>{{ invoice.subTotal | currencyFormat }}</span></div>
        <div class="total-row" *ngIf="invoice.discountAmount"><span>Discount:</span><span>{{ invoice.discountAmount | currencyFormat }}</span></div>
        <div class="total-row" *ngIf="invoice.taxAmount"><span>Tax:</span><span>{{ invoice.taxAmount | currencyFormat }}</span></div>
        <div class="total-row grand"><span>Total:</span><span>{{ invoice.totalAmount | currencyFormat }}</span></div>
        <div class="total-row"><span>Paid:</span><span>{{ invoice.paidAmount | currencyFormat }}</span></div>
        <div class="total-row"><span>Balance:</span><span [class.overdue]="invoice.status === 'Overdue'">{{ invoice.outstandingAmount | currencyFormat }}</span></div>
      </div>

      <div class="notes-section" *ngIf="invoice.notes">
        <h4>Notes</h4>
        <p>{{ invoice.notes }}</p>
      </div>

      <div class="print-actions no-print">
        <button mat-stroked-button [routerLink]="['/billing/invoices', invoice.id, 'edit']">
          <mat-icon>edit</mat-icon> Edit
        </button>
        <button mat-stroked-button color="warn" (click)="deleteInvoice()" *ngIf="!['Cancelled', 'Refunded', 'Paid', 'WrittenOff'].includes(invoice.status)">
          <mat-icon>delete</mat-icon> Delete
        </button>
        <button mat-raised-button color="primary" (click)="print()">
          <mat-icon>print</mat-icon> Print Invoice
        </button>
      </div>
    </div>

    <div *ngIf="!invoice" class="loading-container">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
  `,
  styles: [`
    .print-container { max-width: 800px; margin: 0 auto; padding: 2rem; background: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; }
    .brand { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #1a237e; }
    .brand-logo { max-width: 80px; max-height: 80px; }
    .brand-info h2 { margin: 0; color: #1a237e; font-size: 1.5rem; }
    .brand-info p { margin: 2px 0; color: #666; font-size: 0.85rem; }
    .invoice-header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
    .invoice-title h1 { margin: 0; color: #1a237e; font-size: 2rem; letter-spacing: 2px; }
    .invoice-number { margin: 4px 0 0; color: #666; font-size: 1.1rem; }
    .invoice-meta p { margin: 4px 0; font-size: 0.9rem; }
    .patient-info { background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; }
    .info-row { display: flex; gap: 0.5rem; margin-bottom: 0.25rem; font-size: 0.9rem; }
    .info-row .label { font-weight: 600; min-width: 80px; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
    .items-table th { background: #1a237e; color: white; padding: 8px 12px; text-align: left; font-size: 0.8rem; }
    .items-table th.right { text-align: right; }
    .items-table td { padding: 8px 12px; border-bottom: 1px solid #e0e0e0; font-size: 0.9rem; }
    .items-table td.right { text-align: right; }
    .totals-section { margin-left: auto; max-width: 300px; padding: 1rem; background: #f5f5f5; border-radius: 8px; margin-bottom: 2rem; }
    .total-row { display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.9rem; }
    .total-row.grand { border-top: 2px solid #333; font-weight: 700; font-size: 1.1rem; }
    .total-row.overdue { color: #f44336; }
    .notes-section { margin-bottom: 2rem; }
    .notes-section h4 { margin: 0 0 0.5rem; color: #1a237e; font-size: 0.9rem; }
    .notes-section p { margin: 0; font-size: 0.85rem; }
    .print-actions { text-align: center; margin-top: 2rem; display: flex; gap: 0.5rem; justify-content: center; }
    .loading-container { display: flex; justify-content: center; padding: 4rem; }
    @media print {
      .no-print { display: none !important; }
      .print-container { padding: 0; box-shadow: none; }
    }
  `]
})
export class InvoicePrintComponent implements OnInit {
  invoice: any = null;
  branding: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private tenantService: TenantService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getById<any>('v1/invoices', id).subscribe({
        next: (data) => this.invoice = data,
        error: () => {}
      });
    }
    this.tenantService.loadTenant().subscribe(tenant => this.branding = tenant);
  }

  print() { window.print(); }

  deleteInvoice() {
    if (!confirm(`Delete invoice ${this.invoice?.invoiceNumber}? This action cannot be undone.`)) return;

    this.api.delete<any>('v1/invoices', this.invoice.id).subscribe({
      next: () => {
        this.notification.success('Invoice deleted successfully');
        this.router.navigate(['/billing/invoices']);
      },
      error: () => { this.notification.error('Failed to delete invoice'); }
    });
  }
}
