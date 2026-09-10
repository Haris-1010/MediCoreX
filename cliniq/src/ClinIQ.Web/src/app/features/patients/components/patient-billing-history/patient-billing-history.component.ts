import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-patient-billing-history',
  template: `
    <div class="patient-billing-history">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      <div *ngIf="!loading && invoices.length === 0" class="empty">
        <mat-icon>receipt_long</mat-icon>
        <p>No billing records found</p>
      </div>
      <mat-accordion *ngIf="!loading && invoices.length > 0">
        <mat-expansion-panel *ngFor="let invoice of invoices">
          <mat-expansion-panel-header>
            <mat-panel-title>{{ invoice.invoiceNumber }}</mat-panel-title>
            <mat-panel-description>{{ invoice.date | date:'mediumDate' }} - {{ invoice.status }}</mat-panel-description>
          </mat-expansion-panel-header>
          <div class="invoice-content">
            <div class="section">
              <h5>Amount</h5>
              <p>{{ invoice.totalAmount | currency:'PKR':'symbol':'1.2-2' }}</p>
            </div>
            <div class="section">
              <h5>Status</h5>
              <p><app-status-badge [status]="invoice.status"></app-status-badge></p>
            </div>
            <div class="section">
              <h5>Items</h5>
              <div *ngFor="let item of invoice.items">
                <p>{{ item.description }} - {{ item.quantity }} x {{ item.unitPrice | currency:'PKR':'symbol':'1.2-2' }} = {{ item.totalAmount | currency:'PKR':'symbol':'1.2-2' }}</p>
              </div>
            </div>
            <div class="section" *ngIf="invoice.notes">
              <h5>Notes</h5>
              <p>{{ invoice.notes }}</p>
            </div>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: [`
    .patient-billing-history { padding: 1rem 0; }
    .empty { text-align: center; padding: 2rem; color: #666; }
    .empty mat-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; }
    .invoice-content { padding: 1rem 0; }
    .section { margin-bottom: 1rem; }
    .section h5 { margin: 0 0 0.25rem; color: #666; font-size: 0.75rem; text-transform: uppercase; }
    .section p { margin: 0; }
  `]
})
export class PatientBillingHistoryComponent implements OnInit {
  @Input() patientId!: string;
  invoices: any[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<any[]>(`v1/invoices`, { patientId: this.patientId }).subscribe({
      next: (data) => { this.invoices = data || []; this.loading = false; },
      error: () => this.loading = false
    });
  }
}