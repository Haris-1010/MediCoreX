import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { BillingDashboardComponent } from './billing-dashboard/billing-dashboard.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  { path: '', component: BillingDashboardComponent },
  { path: 'invoices', component: InvoiceListComponent },
  { path: 'invoices/new', component: InvoiceFormComponent },
  { path: 'invoices/:id', component: InvoiceFormComponent },
  { path: 'payment/:id', component: PaymentComponent }
];

@NgModule({
  declarations: [BillingDashboardComponent, InvoiceListComponent, InvoiceFormComponent, PaymentComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
})
export class BillingModule { }
