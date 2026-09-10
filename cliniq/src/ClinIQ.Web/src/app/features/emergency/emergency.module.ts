import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { EmergencyDashboardComponent } from './emergency-dashboard/emergency-dashboard.component';
import { TriageComponent } from './triage/triage.component';

const routes: Routes = [
  { path: '', component: EmergencyDashboardComponent },
  { path: 'triage', component: TriageComponent }
];

@NgModule({
  declarations: [EmergencyDashboardComponent, TriageComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
})
export class EmergencyModule { }
