import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService } from '../../../core/services/tenant.service';

@Component({
  standalone: false,
  selector: 'app-payment',
  template: `
    <app-main-layout>
      <app-page-header title="Receive Payment" [breadcrumbs]="[{ label: 'Billing', route: '/billing' }, { label: 'Invoices', route: '/billing/invoices' }, { label: 'Payment' }]"></app-page-header>
      <div class="payment-container" *ngIf="invoice">
        <div class="payment-grid">
          <div class="card invoice-summary">
            <div class="card-header">
              <mat-icon class="header-icon">receipt</mat-icon>
              <h3>Invoice Summary</h3>
            </div>
            <div class="info-row">
              <span class="label">Invoice #</span>
              <strong class="value">{{ invoice.invoiceNumber }}</strong>
            </div>
            <div class="info-row">
              <span class="label">Patient</span>
              <strong class="value">{{ invoice.patientName }}</strong>
            </div>
            <div class="info-row">
              <span class="label">Date</span>
              <strong class="value">{{ invoice.invoiceDate | date:'mediumDate' }}</strong>
            </div>
            <mat-divider></mat-divider>
            <div class="amount-section">
              <div class="info-row">
                <span class="label">Total Amount</span>
                <strong class="value total">{{ invoice.totalAmount | currencyFormat }}</strong>
              </div>
              <div class="info-row">
                <span class="label">Already Paid</span>
                <strong class="value paid">{{ invoice.paidAmount | currencyFormat }}</strong>
              </div>
              <div class="info-row highlight">
                <span class="label">Balance Due</span>
                <strong class="value balance">{{ invoice.balanceAmount | currencyFormat }}</strong>
              </div>
            </div>
            <div class="progress-section" *ngIf="invoice.totalAmount > 0">
              <mat-progress-bar mode="determinate" [value]="(invoice.paidAmount / invoice.totalAmount) * 100" color="primary"></mat-progress-bar>
              <span class="progress-text">{{ ((invoice.paidAmount / invoice.totalAmount) * 100) | number:'1.0-0' }}% paid</span>
            </div>
          </div>
          <div class="card payment-form">
            <div class="card-header">
              <mat-icon class="header-icon payment-header-icon">payment</mat-icon>
              <h3>Payment Details</h3>
            </div>
            <form [formGroup]="form" (ngSubmit)="submit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Payment Amount</mat-label>
                <input matInput type="number" formControlName="amount" min="0.01" [max]="invoice.balanceAmount">
                <span matPrefix>&nbsp;{{ currencySymbol }}&nbsp;</span>
                <mat-hint>Balance: {{ invoice.balanceAmount | currencyFormat }}</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Payment Method</mat-label>
                <mat-select formControlName="paymentMethod">
                  <mat-option value="Cash">
                    <mat-icon>payments</mat-icon> Cash
                  </mat-option>
                  <mat-option value="Card">
                    <mat-icon>credit_card</mat-icon> Card
                  </mat-option>
                  <mat-option value="BankTransfer">
                    <mat-icon>account_balance</mat-icon> Bank Transfer
                  </mat-option>
                  <mat-option value="Check">
                    <mat-icon>receipt</mat-icon> Check
                  </mat-option>
                  <mat-option value="Insurance">
                    <mat-icon>health_and_safety</mat-icon> Insurance
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width" *ngIf="form.value.paymentMethod !== 'Cash'">
                <mat-label>Reference Number</mat-label>
                <input matInput formControlName="referenceNumber" placeholder="Enter transaction or check number">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Notes</mat-label>
                <textarea matInput formControlName="notes" rows="2" placeholder="Optional payment notes"></textarea>
              </mat-form-field>

              <div class="payment-preview" *ngIf="form.value.amount > 0">
                <div class="preview-row">
                  <span>Payment Amount</span>
                  <strong>{{ form.value.amount | currencyFormat }}</strong>
                </div>
                <div class="preview-row">
                  <span>Remaining After Payment</span>
                  <strong [class.cleared]="invoice.balanceAmount - form.value.amount <= 0">
                    {{ invoice.balanceAmount - form.value.amount | currencyFormat }}
                  </strong>
                </div>
              </div>

              <div class="form-actions">
                <button mat-stroked-button type="button" routerLink="/billing/invoices">
                  <mat-icon>close</mat-icon> Cancel
                </button>
                <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving" class="submit-btn">
                  <mat-icon>{{ saving ? 'hourglass_empty' : 'check_circle' }}</mat-icon>
                  {{ saving ? 'Processing...' : 'Record Payment' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .payment-container { max-width: 960px; margin: 0 auto; }
    .payment-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border: 1px solid var(--border-color, #f0f0f0); }
    .card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
    .header-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #e8eaf6; color: var(--accent-primary, #3f51b5); font-size: 22px; width: 22px; height: 22px; padding: 9px; }
    .payment-header-icon { background: #e8f5e9 !important; color: #2e7d32 !important; }
    .card h3 { margin: 0; font-size: 1rem; font-weight: 600; color: var(--text-primary, #1a1a1a); }

    .info-row { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; }
    .info-row .label { color: var(--text-secondary, #666); font-size: 0.9rem; }
    .info-row .value { font-size: 0.9rem; }
    .info-row .total { font-size: 1.1rem; color: var(--text-primary, #1a1a1a); }
    .info-row .paid { color: #2e7d32; }
    .info-row .balance { color: #d32f2f; font-size: 1.1rem; }
    .info-row.highlight { padding: 0.75rem; background: #fff5f5; border-radius: 8px; margin-top: 0.5rem; border: 1px solid #ffcdd2; }

    .amount-section { margin-top: 0.5rem; }

    .progress-section { margin-top: 1rem; }
    .progress-text { display: block; text-align: right; font-size: 0.8rem; color: var(--text-muted, #888); margin-top: 0.25rem; }

    .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-color, #f0f0f0); }
    .submit-btn { padding: 0 2rem; }

    .payment-preview { padding: 1rem; background: var(--table-header-bg, #fafbfc); border-radius: 8px; border: 1px solid var(--border-color, #f0f0f0); margin-top: 0.5rem; }
    .preview-row { display: flex; justify-content: space-between; padding: 0.35rem 0; font-size: 0.9rem; }
    .preview-row strong { color: var(--text-primary, #1a1a1a); }
    .preview-row strong.cleared { color: #2e7d32; }

    @media (max-width: 768px) {
      .payment-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class PaymentComponent implements OnInit {
  invoice: any; form!: FormGroup; saving = false;   currencySymbol = '';

  constructor(private fb: FormBuilder, private api: ApiService, private route: ActivatedRoute, private router: Router, private notification: NotificationService, private tenantService: TenantService) {
    this.currencySymbol = tenantService.getCurrencySymbol();
  }

  ngOnInit() {
    this.form = this.fb.group({ amount: ['', [Validators.required, Validators.min(0.01)]], paymentMethod: ['Cash', Validators.required], referenceNumber: [''], notes: [''] });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.api.getById<any>('v1/invoices', id).subscribe(inv => {
      this.invoice = { ...inv, balanceAmount: inv.outstandingAmount || inv.balanceAmount || 0 };
      this.form.patchValue({ amount: this.invoice.balanceAmount });
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;
    this.api.post(`v1/invoices/${this.invoice.id}/payments`, this.form.value).subscribe({
      next: () => { this.notification.success('Payment recorded successfully'); this.router.navigate(['/billing/invoices']); },
      error: (err) => {
        this.saving = false;
        const message = err?.error?.message || 'Failed to record payment';
        this.notification.error(message);
      }
    });
  }
}
