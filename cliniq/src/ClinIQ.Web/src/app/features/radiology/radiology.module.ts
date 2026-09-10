import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { RadiologyDashboardComponent } from './radiology-dashboard/radiology-dashboard.component';

const routes: Routes = [{ path: '', component: RadiologyDashboardComponent }];

@NgModule({
  declarations: [RadiologyDashboardComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
})
export class RadiologyModule { }
