import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { LabDashboardComponent } from './lab-dashboard/lab-dashboard.component';
import { LabOrdersComponent } from './lab-orders/lab-orders.component';
import { LabOrderFormComponent } from './lab-order-form/lab-order-form.component';
import { ResultEntryComponent } from './result-entry/result-entry.component';
import { LabPrintComponent } from './lab-print/lab-print.component';

const routes: Routes = [
  { path: '', component: LabDashboardComponent },
  { path: 'orders', component: LabOrdersComponent },
  { path: 'orders/new', component: LabOrderFormComponent },
  { path: 'results/:id', component: ResultEntryComponent },
  { path: 'print/:id', component: LabPrintComponent }
];

@NgModule({
  declarations: [LabDashboardComponent, LabOrdersComponent, LabOrderFormComponent, ResultEntryComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes), LabPrintComponent]
})
export class LaboratoryModule { }
