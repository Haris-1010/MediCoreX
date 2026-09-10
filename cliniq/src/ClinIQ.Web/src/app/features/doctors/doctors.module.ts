import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';

const routes: Routes = [
  { path: '', component: DoctorListComponent },
  { path: 'new', component: DoctorFormComponent },
  { path: ':id/edit', component: DoctorFormComponent }
];

@NgModule({
  declarations: [DoctorListComponent, DoctorFormComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
})
export class DoctorsModule { }
