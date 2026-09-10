import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { BillingDashboardComponent } from './billing-dashboard/billing-dashboard.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { PaymentComponent } from './payment/payment.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    { path: '', component: BillingDashboardComponent },
    { path: 'invoices', component: InvoiceListComponent },
    { path: 'invoices/new', component: InvoiceFormComponent },
    { path: 'invoices/:id', component: InvoiceFormComponent },
    { path: 'payment/:id', component: PaymentComponent }
];
export class BillingModule {
    static { this.ɵfac = function BillingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BillingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: BillingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BillingModule, [{
        type: NgModule,
        args: [{
                declarations: [BillingDashboardComponent, InvoiceListComponent, InvoiceFormComponent, PaymentComponent],
                imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(BillingModule, { declarations: [BillingDashboardComponent, InvoiceListComponent, InvoiceFormComponent, PaymentComponent], imports: [CommonModule, SharedModule, LayoutModule, i1.RouterModule] }); })();
//# sourceMappingURL=billing.module.js.map