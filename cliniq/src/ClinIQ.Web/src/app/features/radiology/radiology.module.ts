import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { RadiologyDashboardComponent } from './radiology-dashboard/radiology-dashboard.component';
import { RadiologyOrdersComponent } from './radiology-orders/radiology-orders.component';
import { RadiologyOrderFormComponent } from './radiology-order-form/radiology-order-form.component';
import { RadiologyReportEntryComponent } from './radiology-report-entry/radiology-report-entry.component';
import { RadiologyPrintComponent } from './radiology-print/radiology-print.component';

const routes: Routes = [
  { path: '', component: RadiologyDashboardComponent },
  { path: 'orders', component: RadiologyOrdersComponent },
  { path: 'orders/new', component: RadiologyOrderFormComponent },
  { path: 'reports/:id', component: RadiologyReportEntryComponent },
  { path: 'print/:id', component: RadiologyPrintComponent }
];

@NgModule({
  declarations: [RadiologyDashboardComponent, RadiologyOrdersComponent, RadiologyOrderFormComponent, RadiologyReportEntryComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes), RadiologyPrintComponent]
})
export class RadiologyModule { }
