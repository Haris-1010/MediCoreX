import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffFormComponent } from './staff-form/staff-form.component';

const routes: Routes = [
  { path: '', component: StaffListComponent },
  { path: 'new', component: StaffFormComponent },
  { path: 'edit/:id', component: StaffFormComponent }
];

@NgModule({
  declarations: [StaffListComponent, StaffFormComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
})
export class StaffModule { }
