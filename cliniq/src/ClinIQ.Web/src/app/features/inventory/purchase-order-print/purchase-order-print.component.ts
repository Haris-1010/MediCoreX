import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../core/services/api.service';
import { TenantService, Branding } from '../../../core/services/tenant.service';
import { SharedModule } from '../../../shared/shared.module';
import { PrintBrandHeaderComponent } from '../../../shared/components/print-brand-header/print-brand-header.component';

@Component({
  standalone: true,
  selector: 'app-purchase-order-print',
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, SharedModule, PrintBrandHeaderComponent],
  template: `
    <div class="print-container" *ngIf="order">
      <app-print-brand-header
        [logoUrl]="branding?.logoUrl || null"
        [orgName]="branding?.name || null"
        [phone]="branding?.phone || null"
        [address]="branding?.address || null">
      </app-print-brand-header>

      <div class="po-header">
        <div class="po-title">
          <h1>PURCHASE ORDER</h1>
          <p class="po-number">{{ order.poNumber }}</p>
        </div>
        <div class="po-meta">
          <p><strong>Date:</strong> {{ order.orderDate | date:'mediumDate' }}</p>
          <p><strong>Status:</strong> <span class="status-badge" [ngClass]="getStatusClass(order.status)">{{ order.status }}</span></p>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <span class="label">Supplier</span>
          <span class="value">{{ order.supplierName || 'N/A' }}</span>
        </div>
        <div class="info-item">
          <span class="label">Expected Delivery</span>
          <span class="value">{{ order.expectedDeliveryDate ? (order.expectedDeliveryDate | date:'mediumDate') : 'N/A' }}</span>
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th class="right">Qty</th>
            <th>Batch</th>
            <th>Expiry</th>
            <th class="right">Unit Price</th>
            <th class="right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of order.items; let i = index">
            <td>{{ i + 1 }}</td>
            <td>{{ item.itemName || 'N/A' }}</td>
            <td class="right">{{ item.orderedQuantity }}</td>
            <td>{{ item.stockBatch?.batchNumber || item.batchNumber || '-' }}</td>
            <td>{{ (item.stockBatch?.expiryDate || item.expiryDate) ? ((item.stockBatch?.expiryDate || item.expiryDate) | date:'mediumDate') : '-' }}</td>
            <td class="right">{{ item.unitPrice | currencyFormat }}</td>
            <td class="right">{{ item.totalAmount | currencyFormat }}</td>
          </tr>
        </tbody>
      </table>

      <div class="totals-section">
        <div class="total-row grand">
          <span>Total</span>
          <span>{{ order.totalAmount | currencyFormat }}</span>
        </div>
      </div>

      <div class="notes-section" *ngIf="order.notes">
        <h4>Notes</h4>
        <p>{{ order.notes }}</p>
      </div>

      <div class="print-actions no-print">
        <button mat-raised-button color="primary" (click)="print()">
          <mat-icon>print</mat-icon> Print Order
        </button>
      </div>
    </div>

    <div *ngIf="!order" class="loading-container">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
  `,
  styles: [`
    .print-container { max-width: 800px; margin: 0 auto; padding: 2rem; background: var(--bg-card, #fff); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: var(--text-primary, #333); }
    .po-header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
    .po-title h1 { margin: 0; color: #1a237e; font-size: 2rem; letter-spacing: 2px; }
    .po-number { margin: 4px 0 0; color: var(--text-muted, #666); font-size: 1.1rem; }
    .po-meta p { margin: 4px 0; font-size: 0.9rem; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; }
    .status-badge.draft { background: var(--bg-hover, #f5f5f5); color: #757575; }
    .status-badge.approved { background: #e8f5e9; color: #2e7d32; }
    .status-badge.ordered { background: #e3f2fd; color: #1565c0; }
    .status-badge.partial { background: var(--status-warning-bg, #fff3e0); color: #f9a825; }
    .status-badge.received { background: #e8f5e9; color: #2e7d32; }
    .status-badge.cancelled { background: var(--bg-hover, #f5f5f5); color: #616161; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; }
    .info-item .label { display: block; font-size: 0.75rem; font-weight: 600; color: var(--text-muted, #666); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 2px; }
    .info-item .value { font-size: 0.95rem; font-weight: 500; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
    .items-table th { background: #1a237e; color: white; padding: 8px 12px; text-align: left; font-size: 0.8rem; }
    .items-table th.right { text-align: right; }
    .items-table td { padding: 8px 12px; border-bottom: 1px solid var(--border-color, #e0e0e0); font-size: 0.9rem; }
    .items-table td.right { text-align: right; }
    .totals-section { margin-left: auto; max-width: 300px; padding: 1rem; background: var(--bg-hover, #f5f5f5); border-radius: 8px; margin-bottom: 2rem; }
    .total-row { display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.9rem; }
    .total-row.grand { border-top: 2px solid var(--text-primary, #333); font-weight: 700; font-size: 1.1rem; }
    .notes-section { margin-bottom: 2rem; }
    .notes-section h4 { margin: 0 0 0.5rem; color: #1a237e; font-size: 0.9rem; }
    .notes-section p { margin: 0; font-size: 0.85rem; }
    .print-actions { text-align: center; margin-top: 2rem; }
    .loading-container { display: flex; justify-content: center; padding: 4rem; }
    @media print {
      .no-print { display: none !important; }
      .print-container { padding: 0; box-shadow: none; }
    }
  `]
})
export class PurchaseOrderPrintComponent implements OnInit {
  order: any = null;
  branding: Branding | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private tenantService: TenantService
  ) {}

  getStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'draft') return 'draft';
    if (s === 'approved') return 'approved';
    if (s === 'ordered') return 'ordered';
    if (s === 'partiallyreceived') return 'partial';
    if (s === 'received') return 'received';
    if (s === 'cancelled') return 'cancelled';
    return 'draft';
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getById<any>('v1/purchase-orders', id).subscribe({
        next: (data) => this.order = data,
        error: () => this.router.navigate(['/inventory/purchase-orders'])
      });
    }
    this.tenantService.loadBranding().subscribe(branding => this.branding = branding);
  }

  print() { window.print(); }
}
