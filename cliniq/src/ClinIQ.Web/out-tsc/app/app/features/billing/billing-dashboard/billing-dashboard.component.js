import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/router";
import * as i4 from "@angular/material/button";
import * as i5 from "@angular/material/icon";
import * as i6 from "../../../shared/components/page-header/page-header.component";
import * as i7 from "../../../shared/components/status-badge/status-badge.component";
import * as i8 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Billing" });
const _c2 = (a0, a1) => [a0, a1];
const _c3 = a0 => ["invoices", a0];
function BillingDashboardComponent_div_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 12)(1, "div", 13)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 14);
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "currency");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(9, "app-status-badge", 15);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const inv_r1 = ctx.$implicit;
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(7, _c3, inv_r1.id));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(inv_r1.invoiceNumber);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(inv_r1.patientName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(8, 5, inv_r1.totalAmount));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("status", inv_r1.status);
} }
function BillingDashboardComponent_div_54_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 16)(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "currency");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 17);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const m_r2 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(m_r2.method);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(5, 3, m_r2.amount));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", m_r2.percentage, "%");
} }
export class BillingDashboardComponent {
    constructor(api) {
        this.api = api;
        this.stats = { todayRevenue: 0, pendingAmount: 0, todayInvoices: 0, overdueAmount: 0 };
        this.recentInvoices = [];
        this.paymentMethods = [];
    }
    ngOnInit() {
        this.api.get('v1/billing/stats').subscribe(r => this.stats = r);
        this.api.get('v1/invoices/recent').subscribe(r => this.recentInvoices = r);
        this.api.get('v1/billing/payment-methods').subscribe(r => this.paymentMethods = r);
    }
    static { this.ɵfac = function BillingDashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BillingDashboardComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: BillingDashboardComponent, selectors: [["app-billing-dashboard"]], standalone: false, decls: 55, vars: 18, consts: [["title", "Billing Dashboard", 3, "breadcrumbs"], ["mat-raised-button", "", "color", "primary", "routerLink", "invoices/new"], [1, "stats-grid"], [1, "stat-card"], [1, "stat-card", "warn"], [1, "dashboard-grid"], [1, "card"], [1, "invoice-list"], ["class", "invoice-item", 3, "routerLink", 4, "ngFor", "ngForOf"], ["mat-button", "", "color", "primary", "routerLink", "invoices"], [1, "payment-breakdown"], ["class", "method", 4, "ngFor", "ngForOf"], [1, "invoice-item", 3, "routerLink"], [1, "info"], [1, "amount"], [3, "status"], [1, "method"], [1, "percent"]], template: function BillingDashboardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 0)(2, "button", 1)(3, "mat-icon");
            i0.ɵɵtext(4, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " New Invoice");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 2)(7, "div", 3)(8, "mat-icon");
            i0.ɵɵtext(9, "receipt");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "div")(11, "h3");
            i0.ɵɵtext(12);
            i0.ɵɵpipe(13, "currency");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "p");
            i0.ɵɵtext(15, "Today's Revenue");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(16, "div", 3)(17, "mat-icon");
            i0.ɵɵtext(18, "pending");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "div")(20, "h3");
            i0.ɵɵtext(21);
            i0.ɵɵpipe(22, "currency");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "p");
            i0.ɵɵtext(24, "Pending");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(25, "div", 3)(26, "mat-icon");
            i0.ɵɵtext(27, "assignment");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "div")(29, "h3");
            i0.ɵɵtext(30);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "p");
            i0.ɵɵtext(32, "Today's Invoices");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(33, "div", 4)(34, "mat-icon");
            i0.ɵɵtext(35, "warning");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(36, "div")(37, "h3");
            i0.ɵɵtext(38);
            i0.ɵɵpipe(39, "currency");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(40, "p");
            i0.ɵɵtext(41, "Overdue");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(42, "div", 5)(43, "div", 6)(44, "h3");
            i0.ɵɵtext(45, "Recent Invoices");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(46, "div", 7);
            i0.ɵɵtemplate(47, BillingDashboardComponent_div_47_Template, 10, 9, "div", 8);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "a", 9);
            i0.ɵɵtext(49, "View All");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(50, "div", 6)(51, "h3");
            i0.ɵɵtext(52, "Payment Methods");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(53, "div", 10);
            i0.ɵɵtemplate(54, BillingDashboardComponent_div_54_Template, 8, 5, "div", 11);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(15, _c2, i0.ɵɵpureFunction0(13, _c0), i0.ɵɵpureFunction0(14, _c1)));
            i0.ɵɵadvance(11);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(13, 7, ctx.stats.todayRevenue));
            i0.ɵɵadvance(9);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(22, 9, ctx.stats.pendingAmount));
            i0.ɵɵadvance(9);
            i0.ɵɵtextInterpolate(ctx.stats.todayInvoices);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(39, 11, ctx.stats.overdueAmount));
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("ngForOf", ctx.recentInvoices);
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("ngForOf", ctx.paymentMethods);
        } }, dependencies: [i2.NgForOf, i3.RouterLink, i4.MatAnchor, i4.MatButton, i5.MatIcon, i6.PageHeaderComponent, i7.StatusBadgeComponent, i8.MainLayoutComponent, i2.CurrencyPipe], styles: [".stats-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }\n    .stat-card[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }\n    .stat-card[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; }\n    .stat-card.warn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { color: #f44336; } .stat-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0; font-size: 1.5rem; } .stat-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; color: #666; }\n    .dashboard-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }\n    .card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 1rem; }\n    .invoice-list[_ngcontent-%COMP%] { display: flex; flex-direction: column; gap: 0.5rem; }\n    .invoice-item[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f5f5f5; border-radius: 8px; cursor: pointer; }\n    .invoice-item[_ngcontent-%COMP%]:hover { background: #e8eaf6; }\n    .invoice-item[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%] { flex: 1; } .invoice-item[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] { display: block; } .invoice-item[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] { font-size: 0.875rem; color: #666; }\n    .invoice-item[_ngcontent-%COMP%]   .amount[_ngcontent-%COMP%] { font-weight: 600; }\n    .payment-breakdown[_ngcontent-%COMP%] { display: flex; flex-direction: column; gap: 0.75rem; }\n    .method[_ngcontent-%COMP%] { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: #f5f5f5; border-radius: 4px; }\n    .method[_ngcontent-%COMP%]   .percent[_ngcontent-%COMP%] { color: #666; font-size: 0.875rem; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BillingDashboardComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-billing-dashboard', template: `
    <app-main-layout>
      <app-page-header title="Billing Dashboard" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Billing' }]">
        <button mat-raised-button color="primary" routerLink="invoices/new"><mat-icon>add</mat-icon> New Invoice</button>
      </app-page-header>
      <div class="stats-grid">
        <div class="stat-card"><mat-icon>receipt</mat-icon><div><h3>{{ stats.todayRevenue | currency }}</h3><p>Today's Revenue</p></div></div>
        <div class="stat-card"><mat-icon>pending</mat-icon><div><h3>{{ stats.pendingAmount | currency }}</h3><p>Pending</p></div></div>
        <div class="stat-card"><mat-icon>assignment</mat-icon><div><h3>{{ stats.todayInvoices }}</h3><p>Today's Invoices</p></div></div>
        <div class="stat-card warn"><mat-icon>warning</mat-icon><div><h3>{{ stats.overdueAmount | currency }}</h3><p>Overdue</p></div></div>
      </div>
      <div class="dashboard-grid">
        <div class="card">
          <h3>Recent Invoices</h3>
          <div class="invoice-list">
            <div class="invoice-item" *ngFor="let inv of recentInvoices" [routerLink]="['invoices', inv.id]">
              <div class="info"><strong>{{ inv.invoiceNumber }}</strong><span>{{ inv.patientName }}</span></div>
              <div class="amount">{{ inv.totalAmount | currency }}</div>
              <app-status-badge [status]="inv.status"></app-status-badge>
            </div>
          </div>
          <a mat-button color="primary" routerLink="invoices">View All</a>
        </div>
        <div class="card">
          <h3>Payment Methods</h3>
          <div class="payment-breakdown">
            <div class="method" *ngFor="let m of paymentMethods"><span>{{ m.method }}</span><strong>{{ m.amount | currency }}</strong><span class="percent">{{ m.percentage }}%</span></div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `, styles: [".stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }\n    .stat-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }\n    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; }\n    .stat-card.warn mat-icon { color: #f44336; } .stat-card h3 { margin: 0; font-size: 1.5rem; } .stat-card p { margin: 0; color: #666; }\n    .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }\n    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }\n    .invoice-list { display: flex; flex-direction: column; gap: 0.5rem; }\n    .invoice-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f5f5f5; border-radius: 8px; cursor: pointer; }\n    .invoice-item:hover { background: #e8eaf6; }\n    .invoice-item .info { flex: 1; } .invoice-item .info strong { display: block; } .invoice-item .info span { font-size: 0.875rem; color: #666; }\n    .invoice-item .amount { font-weight: 600; }\n    .payment-breakdown { display: flex; flex-direction: column; gap: 0.75rem; }\n    .method { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: #f5f5f5; border-radius: 4px; }\n    .method .percent { color: #666; font-size: 0.875rem; }"] }]
    }], () => [{ type: i1.ApiService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(BillingDashboardComponent, { className: "BillingDashboardComponent", filePath: "app/features/billing/billing-dashboard/billing-dashboard.component.ts", lineNumber: 54 }); })();
//# sourceMappingURL=billing-dashboard.component.js.map