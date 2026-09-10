import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { OpdDashboardComponent } from './opd-dashboard/opd-dashboard.component';
import { QueueManagementComponent } from './queue-management/queue-management.component';
import { ConsultationComponent } from './consultation/consultation.component';
import { TokenDisplayComponent } from './token-display/token-display.component';

const routes: Routes = [
  { path: '', component: OpdDashboardComponent },
  { path: 'queue', component: QueueManagementComponent },
  { path: 'consultation/:id', component: ConsultationComponent },
  { path: 'display', component: TokenDisplayComponent }
];

@NgModule({
  declarations: [OpdDashboardComponent, QueueManagementComponent, ConsultationComponent, TokenDisplayComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
})
export class OpdModule { }
