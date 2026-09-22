import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-billing-dashboard',
  template: `
    <app-main-layout>
      <app-page-header title="Billing Dashboard" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Billing' }]">
        <button mat-raised-button color="primary" routerLink="invoices/new"><mat-icon>add</mat-icon> New Invoice</button>
      </app-page-header>
      <div class="stats-grid">
        <div class="stat-card"><mat-icon>receipt</mat-icon><div><h3>{{ stats.todayRevenue | currencyFormat }}</h3><p>Today's Revenue</p></div></div>
        <div class="stat-card"><mat-icon>account_balance_wallet</mat-icon><div><h3>{{ stats.totalReceivables | currencyFormat }}</h3><p>Total Receivables</p></div></div>
        <div class="stat-card"><mat-icon>assignment</mat-icon><div><h3>{{ stats.todayInvoices }}</h3><p>Today's Invoices</p></div></div>
        <div class="stat-card warn"><mat-icon>warning</mat-icon><div><h3>{{ stats.overdueAmount | currencyFormat }}</h3><p>Overdue</p></div></div>
      </div>
      <div class="dashboard-grid">
        <div class="card">
          <h3>Recent Invoices</h3>
          <div class="invoice-list">
            <div class="invoice-item" *ngFor="let inv of recentInvoices" [routerLink]="['invoices', inv.id]">
              <div class="info"><strong>{{ inv.invoiceNumber }}</strong><span>{{ inv.patientName }}</span></div>
              <div class="amount">{{ inv.totalAmount | currencyFormat }}</div>
              <app-status-badge [status]="inv.status"></app-status-badge>
            </div>
          </div>
          <a mat-button color="primary" routerLink="invoices">View All</a>
        </div>
        <div class="card">
          <h3>Payment Methods</h3>
          <div class="payment-breakdown">
            <div class="method" *ngFor="let m of paymentMethods"><span>{{ m.method }}</span><strong>{{ m.amount | currencyFormat }}</strong><span class="percent">{{ m.percentage }}%</span></div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; color: var(--accent-primary, #3f51b5); }
    .stat-card.warn mat-icon { color: var(--status-error, #f44336); } .stat-card h3 { margin: 0; font-size: 1.5rem; } .stat-card p { margin: 0; color: var(--text-secondary, #666); }
    .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }
    .invoice-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .invoice-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: var(--bg-input, #f5f5f5); border-radius: 8px; cursor: pointer; }
    .invoice-item:hover { background: var(--bg-badge, #e8eaf6); }
    .invoice-item .info { flex: 1; } .invoice-item .info strong { display: block; } .invoice-item .info span { font-size: 0.875rem; color: var(--text-secondary, #666); }
    .invoice-item .amount { font-weight: 600; }
    .payment-breakdown { display: flex; flex-direction: column; gap: 0.75rem; }
    .method { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: var(--bg-input, #f5f5f5); border-radius: 4px; }
    .method .percent { color: var(--text-secondary, #666); font-size: 0.875rem; }`]
})
export class BillingDashboardComponent implements OnInit {
  stats = { todayRevenue: 0, pendingAmount: 0, totalReceivables: 0, todayInvoices: 0, overdueAmount: 0, invoiceCount: 0 };
  recentInvoices: any[] = [];
  paymentMethods: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<any>('v1/billing/stats').subscribe(r => this.stats = r);
    this.api.get<any[]>('v1/invoices/recent').subscribe(r => this.recentInvoices = r);
    this.api.get<any[]>('v1/billing/payment-methods').subscribe(r => this.paymentMethods = r);
  }
}
