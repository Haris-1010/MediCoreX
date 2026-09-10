import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientPrintComponent } from './patient-print/patient-print.component';
import { PatientSearchComponent } from './components/patient-search/patient-search.component';
import { PatientCardComponent } from './components/patient-card/patient-card.component';
import { MedicalHistoryComponent } from './components/medical-history/medical-history.component';
import { VisitHistoryComponent } from './components/visit-history/visit-history.component';
import { PatientAppointmentHistoryComponent } from './components/patient-appointment-history/patient-appointment-history.component';
import { PatientBillingHistoryComponent } from './components/patient-billing-history/patient-billing-history.component';

const routes: Routes = [
  { path: '', component: PatientListComponent },
  { path: 'new', component: PatientFormComponent },
  { path: ':id', component: PatientDetailComponent },
  { path: ':id/edit', component: PatientFormComponent },
  { path: ':id/print', component: PatientPrintComponent }
];

@NgModule({
  declarations: [
    PatientListComponent,
    PatientDetailComponent,
    PatientFormComponent,
    PatientPrintComponent,
    PatientSearchComponent,
    PatientCardComponent,
    MedicalHistoryComponent,
    VisitHistoryComponent,
    PatientAppointmentHistoryComponent,
    PatientBillingHistoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LayoutModule,
    RouterModule.forChild(routes)
  ]
})
export class PatientsModule { }
