import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';
import { ApiService } from '../../../../../core/services/api.service';

interface InvoiceDetailDialogData {
  invoice: any;
}

@Component({
  standalone: true,
  selector: 'app-invoice-detail-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTabsModule,
    SharedModule,
    DatePipe,
    CurrencyPipe
  ],
  template: `
    <div class="invoice-detail-dialog">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <ng-container *ngIf="!loading">
        <div class="dialog-header">
          <div>
            <h2 mat-dialog-title>{{ invoice.invoiceNumber }}</h2>
            <div class="header-subtitle">
              <span class="status-chip" [class]="'status-' + getStatusClass(invoice.status)">{{ invoice.status }}</span>
              <span class="header-date">{{ invoice.invoiceDate | date:'dd MMM yyyy, h:mm a' }}</span>
            </div>
          </div>
          <button mat-icon-button mat-dialog-close>
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <mat-dialog-content>
          <div class="info-grid">
            <div class="info-card" *ngIf="invoice.patientName">
              <mat-icon>person</mat-icon>
              <div>
                <label>Patient</label>
                <span>{{ invoice.patientName }}</span>
              </div>
            </div>
            <div class="info-card" *ngIf="invoice.doctorName">
              <mat-icon>medical_services</mat-icon>
              <div>
                <label>Doctor</label>
                <span>Dr. {{ invoice.doctorName }}</span>
              </div>
            </div>
            <div class="info-card" *ngIf="invoice.dueDate">
              <mat-icon>event</mat-icon>
              <div>
                <label>Due Date</label>
                <span>{{ invoice.dueDate | date:'dd MMM yyyy' }}</span>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <mat-tab-group animationDuration="200ms">
            <mat-tab label="Items">
              <div class="tab-content">
                <table class="items-table" *ngIf="invoice.items?.length">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Description</th>
                      <th class="text-center">Qty</th>
                      <th class="text-right">Unit Price</th>
                      <th class="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of invoice.items; let i = index">
                      <td class="row-num">{{ i + 1 }}</td>
                      <td>{{ item.description }}</td>
                      <td class="text-center">{{ item.quantity }}</td>
                      <td class="text-right">{{ item.unitPrice | currencyFormat }}</td>
                      <td class="text-right fw-600">{{ item.totalAmount | currencyFormat }}</td>
                    </tr>
                  </tbody>
                </table>
                <div *ngIf="!invoice.items?.length" class="no-data">
                  <mat-icon>inventory_2</mat-icon>
                  <p>No items found</p>
                </div>
              </div>
            </mat-tab>

            <mat-tab label="Summary">
              <div class="tab-content">
                <div class="summary-card">
                  <div class="summary-row">
                    <span>Subtotal</span>
                    <span>{{ invoice.subTotal | currencyFormat }}</span>
                  </div>
                  <div class="summary-row" *ngIf="invoice.discountAmount > 0">
                    <span>Discount{{ invoice.discountName ? ' (' + invoice.discountName + ')' : '' }}</span>
                    <span class="discount">-{{ invoice.discountAmount | currencyFormat }}</span>
                  </div>
                  <div class="summary-row" *ngIf="invoice.taxAmount > 0">
                    <span>Tax</span>
                    <span>{{ invoice.taxAmount | currencyFormat }}</span>
                  </div>
                  <div class="summary-divider"></div>
                  <div class="summary-row total">
                    <span>Total</span>
                    <span>{{ invoice.totalAmount | currencyFormat }}</span>
                  </div>
                  <div class="summary-row paid" *ngIf="invoice.paidAmount > 0">
                    <span>Paid</span>
                    <span>-{{ invoice.paidAmount | currencyFormat }}</span>
                  </div>
                  <div class="summary-row balance" *ngIf="invoice.outstandingAmount > 0">
                    <span>Balance Due</span>
                    <span>{{ invoice.outstandingAmount | currencyFormat }}</span>
                  </div>
                </div>
              </div>
            </mat-tab>

            <mat-tab label="Notes" *ngIf="invoice.notes || invoice.internalNotes">
              <div class="tab-content">
                <div class="notes-section" *ngIf="invoice.notes">
                  <h4>Notes</h4>
                  <p>{{ invoice.notes }}</p>
                </div>
                <div class="notes-section" *ngIf="invoice.internalNotes">
                  <h4>Internal Notes</h4>
                  <p>{{ invoice.internalNotes }}</p>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button mat-dialog-close>Close</button>
          <button mat-raised-button color="primary" (click)="openInNewTab()" [disabled]="!invoice?.id">
            <mat-icon>open_in_new</mat-icon>
            Open Full Invoice
          </button>
        </mat-dialog-actions>
      </ng-container>
    </div>
  `,
  styles: [`
    .invoice-detail-dialog { min-width: 600px; }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 0.5rem;
    }
    .dialog-header h2 { margin: 0; font-size: 1.3rem; font-weight: 700; }
    .header-subtitle { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.35rem; }
    .header-date { font-size: 0.8rem; color: #888; }

    .status-chip {
      display: inline-block;
      padding: 0.15rem 0.6rem;
      border-radius: 10px;
      font-size: 0.68rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .status-chip.status-paid { background: #e8f5e9; color: #2e7d32; }
    .status-chip.status-pending { background: #fff3e0; color: #e65100; }
    .status-chip.status-partiallypaid { background: #e3f2fd; color: #1565c0; }
    .status-chip.status-overdue { background: #fce4ec; color: #c62828; }
    .status-chip.status-draft { background: #f5f5f5; color: #616161; }
    .status-chip.status-finalized { background: #e8eaf6; color: #283593; }
    .status-chip.status-cancelled { background: #f5f5f5; color: #9e9e9e; }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .info-card {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .info-card mat-icon { font-size: 20px; width: 20px; height: 20px; color: #7c4dff; }
    .info-card label { display: block; font-size: 0.68rem; color: #888; text-transform: uppercase; font-weight: 500; }
    .info-card span { font-size: 0.85rem; color: #333; font-weight: 500; }

    mat-divider { margin: 0.5rem 0 1rem; }

    .tab-content { padding: 1rem 0 0.5rem; }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: #bbb;
    }
    .no-data mat-icon { font-size: 40px; width: 40px; height: 40px; margin-bottom: 0.5rem; }

    .items-table { width: 100%; border-collapse: collapse; }
    .items-table th, .items-table td { padding: 0.65rem 0.75rem; text-align: left; border-bottom: 1px solid #eee; font-size: 0.85rem; }
    .items-table th { font-weight: 600; color: #888; background: #fafafa; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.3px; }
    .items-table tbody tr:hover { background: #f8f9fa; }
    .row-num { color: #bbb; font-size: 0.8rem; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .fw-600 { font-weight: 600; }

    .summary-card {
      max-width: 360px;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 10px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.4rem 0;
      font-size: 0.875rem;
    }
    .summary-row span:first-child { color: #666; }
    .summary-row span:last-child { font-weight: 500; }
    .summary-row.discount span:last-child { color: #2e7d32; }
    .summary-divider { border-top: 1px solid #ddd; margin: 0.35rem 0; }
    .summary-row.total { font-size: 1rem; font-weight: 700; color: #333; }
    .summary-row.total span:last-child { color: #3f51b5; font-size: 1.1rem; }
    .summary-row.paid span:last-child { color: #2e7d32; }
    .summary-row.balance span { font-weight: 700; }
    .summary-row.balance span:last-child { color: #d32f2f; }

    .notes-section { margin-bottom: 1rem; }
    .notes-section h4 { margin: 0 0 0.35rem; font-size: 0.8rem; color: #888; text-transform: uppercase; }
    .notes-section p { margin: 0; font-size: 0.875rem; color: #444; line-height: 1.5; }

    mat-dialog-actions { padding-top: 1rem; border-top: 1px solid #eee; margin-top: 0.5rem; }
    mat-dialog-actions button { margin-left: 0.5rem; }
  `]
})
export class InvoiceDetailDialogComponent implements OnInit {
  invoice: any;
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<InvoiceDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InvoiceDetailDialogData,
    private api: ApiService
  ) {
    this.invoice = data.invoice;
  }

  ngOnInit(): void {
    if (this.data.invoice?.id) {
      this.api.getById<any>('v1/invoices', this.data.invoice.id).subscribe({
        next: (detail) => {
          this.invoice = detail;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  getStatusClass(status: string): string {
    return (status || '').toLowerCase().replace(/\s+/g, '');
  }

  openInNewTab(): void {
    if (this.invoice?.id) {
      window.open(`/billing/invoices/${this.invoice.id}`, '_blank');
      this.dialogRef.close();
    }
  }
}
