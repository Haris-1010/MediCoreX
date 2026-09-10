import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { FacilityDashboardComponent } from './facility-dashboard/facility-dashboard.component';
import { BuildingListComponent } from './building-list/building-list.component';

const routes: Routes = [
  { path: '', component: FacilityDashboardComponent },
  { path: 'buildings', component: BuildingListComponent }
];

@NgModule({
  declarations: [FacilityDashboardComponent, BuildingListComponent],
  imports: [CommonModule, FormsModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
})
export class FacilityModule { }
