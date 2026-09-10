import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-payment',
  template: `
    <app-main-layout>
      <app-page-header title="Receive Payment" [breadcrumbs]="[{ label: 'Billing', route: '/billing' }, { label: 'Payment' }]"></app-page-header>
      <div class="payment-grid" *ngIf="invoice">
        <div class="card invoice-summary">
          <h3>Invoice Summary</h3>
          <div class="info-row"><span>Invoice #:</span><strong>{{ invoice.invoiceNumber }}</strong></div>
          <div class="info-row"><span>Patient:</span><strong>{{ invoice.patientName }}</strong></div>
          <div class="info-row"><span>Date:</span><strong>{{ invoice.invoiceDate | date:'mediumDate' }}</strong></div>
          <mat-divider></mat-divider>
          <div class="info-row"><span>Total Amount:</span><strong>{{ invoice.totalAmount | currency }}</strong></div>
          <div class="info-row"><span>Paid:</span><strong class="paid">{{ invoice.paidAmount | currency }}</strong></div>
          <div class="info-row"><span>Balance Due:</span><strong class="balance">{{ invoice.balanceAmount | currency }}</strong></div>
        </div>
        <div class="card payment-form">
          <h3>Payment Details</h3>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" class="full-width"><mat-label>Amount</mat-label><input matInput type="number" formControlName="amount"><mat-hint>Balance: {{ invoice.balanceAmount | currency }}</mat-hint></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Payment Method</mat-label>
              <mat-select formControlName="paymentMethod">
                <mat-option value="Cash">Cash</mat-option><mat-option value="Card">Card</mat-option><mat-option value="BankTransfer">Bank Transfer</mat-option><mat-option value="Check">Check</mat-option><mat-option value="Insurance">Insurance</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width" *ngIf="form.value.paymentMethod !== 'Cash'"><mat-label>Reference Number</mat-label><input matInput formControlName="referenceNumber"></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Notes</mat-label><textarea matInput formControlName="notes" rows="2"></textarea></mat-form-field>
            <div class="form-actions">
              <button mat-stroked-button type="button" routerLink="/billing/invoices">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">{{ saving ? 'Processing...' : 'Record Payment' }}</button>
            </div>
          </form>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`.payment-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }
    .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; } .info-row span { color: #666; }
    .paid { color: #4caf50; } .balance { color: #f44336; }
    .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }`]
})
export class PaymentComponent implements OnInit {
  invoice: any; form!: FormGroup; saving = false;

  constructor(private fb: FormBuilder, private api: ApiService, private route: ActivatedRoute, private router: Router, private notification: NotificationService) {}

  ngOnInit() {
    this.form = this.fb.group({ amount: ['', [Validators.required, Validators.min(0.01)]], paymentMethod: ['Cash', Validators.required], referenceNumber: [''], notes: [''] });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.api.getById<any>('v1/invoices', id).subscribe(inv => { this.invoice = inv; this.form.patchValue({ amount: inv.balanceAmount }); });
  }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;
    this.api.post(`v1/invoices/${this.invoice.id}/payments`, this.form.value).subscribe({
      next: () => { this.notification.success('Payment recorded'); this.router.navigate(['/billing/invoices']); },
      error: () => this.saving = false
    });
  }
}
