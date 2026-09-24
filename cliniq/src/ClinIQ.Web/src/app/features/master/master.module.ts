import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MasterLoginComponent } from './master-login/master-login.component';
import { MasterDashboardComponent } from './master-dashboard/master-dashboard.component';
import { MasterGuard } from '../../core/guards/master.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: MasterLoginComponent },
  {
    path: 'dashboard',
    component: MasterDashboardComponent,
    canActivate: [MasterGuard]
  }
];

@NgModule({
  declarations: [
    MasterLoginComponent,
    MasterDashboardComponent
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, RouterModule.forChild(routes)]
})
export class MasterModule {}
