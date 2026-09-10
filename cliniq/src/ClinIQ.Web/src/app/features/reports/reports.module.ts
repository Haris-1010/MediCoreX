import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { ReportsDashboardComponent } from './reports-dashboard/reports-dashboard.component';

const routes: Routes = [{ path: '', component: ReportsDashboardComponent }];

@NgModule({
  declarations: [ReportsDashboardComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
})
export class ReportsModule { }
