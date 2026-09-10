import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PlatformLoginComponent } from './platform-login/platform-login.component';
import { PlatformLayoutComponent } from './platform-layout/platform-layout.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { OrganizationFormComponent } from './organization-form/organization-form.component';
import { PlatformAdminsComponent } from './platform-admins/platform-admins.component';
import { PlatformGuard } from '../../core/guards/platform.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: PlatformLoginComponent },
  {
    path: '',
    component: PlatformLayoutComponent,
    canActivate: [PlatformGuard],
    children: [
      { path: 'organizations', component: OrganizationListComponent },
      { path: 'organizations/new', component: OrganizationFormComponent },
      { path: 'organizations/:id', component: OrganizationFormComponent },
      { path: 'admins', component: PlatformAdminsComponent }
    ]
  }
];

@NgModule({
  declarations: [
    PlatformLoginComponent,
    PlatformLayoutComponent,
    OrganizationListComponent,
    OrganizationFormComponent,
    PlatformAdminsComponent
  ],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)]
})
export class PlatformModule {}