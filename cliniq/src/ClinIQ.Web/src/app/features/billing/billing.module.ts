import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { BillingDashboardComponent } from './billing-dashboard/billing-dashboard.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { InvoicePrintComponent } from './invoice-print/invoice-print.component';
import { PaymentsListComponent } from './payments/payments-list.component';
import { PaymentComponent } from './payment/payment.component';
import { DiscountListComponent } from './discount-list/discount-list.component';
import { DiscountFormComponent } from './discount-form/discount-form.component';

const routes: Routes = [
  { path: '', component: BillingDashboardComponent },
  { path: 'invoices', component: InvoiceListComponent },
  { path: 'invoices/new', component: InvoiceFormComponent },
  { path: 'invoices/:id/edit', component: InvoiceFormComponent },
  { path: 'invoices/:id', component: InvoiceFormComponent },
  { path: 'invoices/:id/print', component: InvoicePrintComponent },
  { path: 'payments', component: PaymentsListComponent },
  { path: 'payment/:id', component: PaymentComponent },
  { path: 'discounts', component: DiscountListComponent },
  { path: 'discounts/new', component: DiscountFormComponent },
  { path: 'discounts/:id/edit', component: DiscountFormComponent }
];

@NgModule({
  declarations: [BillingDashboardComponent, InvoiceListComponent, InvoiceFormComponent, PaymentsListComponent, PaymentComponent, DiscountListComponent, DiscountFormComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes), InvoicePrintComponent]
})
export class BillingModule { }
