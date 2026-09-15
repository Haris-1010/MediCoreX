import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { InsuranceDashboardComponent } from './insurance-dashboard/insurance-dashboard.component';

const routes: Routes = [
  { path: '', component: InsuranceDashboardComponent },
];

@NgModule({
  declarations: [InsuranceDashboardComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
})
export class InsuranceModule { }
