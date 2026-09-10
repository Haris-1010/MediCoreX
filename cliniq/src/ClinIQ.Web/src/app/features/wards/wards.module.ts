import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { WardListComponent } from './ward-list/ward-list.component';
import { WardFormComponent } from './ward-form/ward-form.component';
import { WardBedsComponent } from './ward-beds/ward-beds.component';

const routes: Routes = [
  { path: '', component: WardListComponent },
  { path: 'new', component: WardFormComponent },
  { path: ':id/beds', component: WardBedsComponent }
];

@NgModule({
  declarations: [WardListComponent, WardFormComponent, WardBedsComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, SharedModule, LayoutModule,
    RouterModule.forChild(routes)
  ]
})
export class WardsModule { }
