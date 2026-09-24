import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { SettingsComponent } from './settings.component';
import { UserListComponent } from './users/user-list.component';
import { UserFormComponent } from './users/user-form.component';
import { UserPermissionsComponent } from './users/user-permissions.component';

const routes: Routes = [
  { path: '', component: SettingsComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/new', component: UserFormComponent },
  { path: 'users/edit/:id', component: UserFormComponent },
  { path: 'users/:id/permissions', component: UserPermissionsComponent },
  { path: 'roles', redirectTo: 'users', pathMatch: 'full' },
  { path: 'roles/new', redirectTo: 'users', pathMatch: 'full' },
  { path: 'roles/edit/:id', redirectTo: 'users', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    SettingsComponent,
    UserListComponent,
    UserFormComponent,
    UserPermissionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    LayoutModule,
    RouterModule.forChild(routes)
  ]
})
export class SettingsModule { }
