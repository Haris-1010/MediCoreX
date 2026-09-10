import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { LabDashboardComponent } from './lab-dashboard/lab-dashboard.component';
import { LabOrdersComponent } from './lab-orders/lab-orders.component';
import { ResultEntryComponent } from './result-entry/result-entry.component';

const routes: Routes = [
  { path: '', component: LabDashboardComponent },
  { path: 'orders', component: LabOrdersComponent },
  { path: 'results/:id', component: ResultEntryComponent }
];

@NgModule({
  declarations: [LabDashboardComponent, LabOrdersComponent, ResultEntryComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
})
export class LaboratoryModule { }
