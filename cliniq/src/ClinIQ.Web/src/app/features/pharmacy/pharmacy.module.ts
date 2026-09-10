import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { PharmacyDashboardComponent } from './pharmacy-dashboard/pharmacy-dashboard.component';
import { DispenseComponent } from './dispense/dispense.component';

const routes: Routes = [
  { path: '', component: PharmacyDashboardComponent },
  { path: 'dispense/:prescriptionId', component: DispenseComponent }
];

@NgModule({
  declarations: [PharmacyDashboardComponent, DispenseComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
})
export class PharmacyModule { }
