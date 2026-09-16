import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { PrescriptionListComponent } from './prescription-list/prescription-list.component';
import { PrescriptionDetailComponent } from './prescription-detail/prescription-detail.component';
import { PrescriptionFormComponent } from './prescription-form/prescription-form.component';
import { PrescriptionPrintComponent } from './prescription-print/prescription-print.component';
import { PrescriptionItemDialogComponent } from './item-dialog/prescription-item-dialog.component';

const routes: Routes = [
  { path: '', component: PrescriptionListComponent },
  { path: 'new', component: PrescriptionFormComponent },
  { path: ':id', component: PrescriptionDetailComponent },
  { path: 'edit/:id', component: PrescriptionFormComponent },
  { path: 'print/:id', component: PrescriptionPrintComponent }
];

@NgModule({
  declarations: [
    PrescriptionListComponent,
    PrescriptionDetailComponent,
    PrescriptionFormComponent,
    PrescriptionItemDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LayoutModule,
    RouterModule.forChild(routes),
    PrescriptionPrintComponent
  ]
})
export class PrescriptionsModule { }
