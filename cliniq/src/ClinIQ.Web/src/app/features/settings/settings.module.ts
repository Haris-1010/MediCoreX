import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { SettingsComponent } from './settings.component';
import { UserListComponent } from './users/user-list.component';
import { UserFormComponent } from './users/user-form.component';
import { RoleListComponent } from './roles/role-list.component';
import { RoleFormComponent } from './roles/role-form.component';

const routes: Routes = [
  { path: '', component: SettingsComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/new', component: UserFormComponent },
  { path: 'users/edit/:id', component: UserFormComponent },
  { path: 'roles', component: RoleListComponent },
  { path: 'roles/new', component: RoleFormComponent },
  { path: 'roles/edit/:id', component: RoleFormComponent }
];

@NgModule({
  declarations: [
    SettingsComponent,
    UserListComponent,
    UserFormComponent,
    RoleListComponent,
    RoleFormComponent
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
