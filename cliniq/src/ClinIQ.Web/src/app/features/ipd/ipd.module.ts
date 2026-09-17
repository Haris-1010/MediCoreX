import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { IpdDashboardComponent } from './ipd-dashboard/ipd-dashboard.component';
import { AdmissionListComponent } from './admission-list/admission-list.component';
import { AdmissionDetailComponent } from './admission-detail/admission-detail.component';
import { AdmissionFormComponent } from './admission-form/admission-form.component';
import { BedManagementComponent } from './bed-management/bed-management.component';
import { DischargeComponent } from './discharge/discharge.component';
import { NursingStationComponent } from './nursing-station/nursing-station.component';
import { WardManagementComponent } from './ward-management/ward-management.component';
import { RoomManagementComponent } from './room-management/room-management.component';
import { AdmissionPrintPageComponent } from './admission-print/admission-print.component';
import { DischargePrintPageComponent } from './discharge-print/discharge-print.component';
import { NursingPrintPageComponent } from './nursing-print/nursing-print.component';

const routes: Routes = [
  { path: '', component: IpdDashboardComponent },
  { path: 'admissions', component: AdmissionListComponent },
  { path: 'admissions/:id', component: AdmissionDetailComponent },
  { path: 'admissions/print/:id', component: AdmissionPrintPageComponent },
  { path: 'admissions/discharge-print/:id', component: DischargePrintPageComponent },
  { path: 'admit', component: AdmissionFormComponent },
  { path: 'beds', component: BedManagementComponent },
  { path: 'wards', component: WardManagementComponent },
  { path: 'rooms', component: RoomManagementComponent },
  { path: 'discharge/:id', component: DischargeComponent },
  { path: 'nursing', component: NursingStationComponent },
  { path: 'nursing/print/:id', component: NursingPrintPageComponent }
];

@NgModule({
  declarations: [IpdDashboardComponent, AdmissionListComponent, AdmissionDetailComponent, AdmissionFormComponent, BedManagementComponent, DischargeComponent, NursingStationComponent, WardManagementComponent, RoomManagementComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes), AdmissionPrintPageComponent, DischargePrintPageComponent, NursingPrintPageComponent]
})
export class IpdModule { }
