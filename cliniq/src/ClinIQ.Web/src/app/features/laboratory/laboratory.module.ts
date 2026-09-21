import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { LabDashboardComponent } from './lab-dashboard/lab-dashboard.component';
import { LabOrdersComponent } from './lab-orders/lab-orders.component';
import { LabOrderFormComponent } from './lab-order-form/lab-order-form.component';
import { ResultEntryComponent } from './result-entry/result-entry.component';
import { SampleCollectionComponent } from './sample-collection/sample-collection.component';
import { LabVerificationComponent } from './lab-verification/lab-verification.component';
import { LabReportsComponent } from './lab-reports/lab-reports.component';
import { LabTestParametersComponent } from './lab-test-parameters/lab-test-parameters.component';
import { LabPrintComponent } from './lab-print/lab-print.component';

const routes: Routes = [
  { path: '', component: LabDashboardComponent },
  { path: 'orders', component: LabOrdersComponent },
  { path: 'orders/new', component: LabOrderFormComponent },
  { path: 'sample-collection', component: SampleCollectionComponent },
  { path: 'result-entry', component: ResultEntryComponent },
  { path: 'results/:id', component: ResultEntryComponent },
  { path: 'verification', component: LabVerificationComponent },
  { path: 'reports', component: LabReportsComponent },
  { path: 'test-parameters/:serviceId', component: LabTestParametersComponent },
  { path: 'print/:id', component: LabPrintComponent }
];

@NgModule({
  declarations: [
    LabDashboardComponent,
    LabOrdersComponent,
    LabOrderFormComponent,
    ResultEntryComponent,
    SampleCollectionComponent,
    LabVerificationComponent,
    LabReportsComponent,
    LabTestParametersComponent
  ],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes), LabPrintComponent]
})
export class LaboratoryModule { }
