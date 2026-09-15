import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';
import { AppointmentPrintComponent } from './appointment-print/appointment-print.component';
import { DoctorScheduleComponent } from './doctor-schedule/doctor-schedule.component';

const routes: Routes = [
  { path: '', component: AppointmentListComponent },
  { path: 'calendar', component: AppointmentCalendarComponent },
  { path: 'new', component: AppointmentFormComponent },
  { path: ':id', component: AppointmentFormComponent },
  { path: ':id/edit', component: AppointmentFormComponent },
  { path: 'schedule', component: DoctorScheduleComponent },
  { path: ':id/print', component: AppointmentPrintComponent }
];

@NgModule({
  declarations: [AppointmentListComponent, AppointmentFormComponent, AppointmentCalendarComponent, AppointmentPrintComponent, DoctorScheduleComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
})
export class AppointmentsModule { }
