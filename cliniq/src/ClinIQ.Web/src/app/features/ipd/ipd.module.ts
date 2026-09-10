import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { IpdDashboardComponent } from './ipd-dashboard/ipd-dashboard.component';
import { AdmissionListComponent } from './admission-list/admission-list.component';
import { AdmissionFormComponent } from './admission-form/admission-form.component';
import { BedManagementComponent } from './bed-management/bed-management.component';
import { DischargeComponent } from './discharge/discharge.component';
import { NursingStationComponent } from './nursing-station/nursing-station.component';

const routes: Routes = [
  { path: '', component: IpdDashboardComponent },
  { path: 'admissions', component: AdmissionListComponent },
  { path: 'admit', component: AdmissionFormComponent },
  { path: 'beds', component: BedManagementComponent },
  { path: 'discharge/:id', component: DischargeComponent },
  { path: 'nursing', component: NursingStationComponent }
];

@NgModule({
  declarations: [IpdDashboardComponent, AdmissionListComponent, AdmissionFormComponent, BedManagementComponent, DischargeComponent, NursingStationComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
})
export class IpdModule { }
