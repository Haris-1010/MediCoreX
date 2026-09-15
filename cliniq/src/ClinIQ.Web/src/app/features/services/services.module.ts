import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { ServiceListComponent } from './service-list/service-list.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { CategoryListComponent } from './category-list/category-list.component';

const routes: Routes = [
  { path: '', component: ServiceListComponent },
  { path: 'add', component: ServiceFormComponent },
  { path: 'edit/:id', component: ServiceFormComponent },
  { path: 'categories', component: CategoryListComponent },
];

@NgModule({
  declarations: [ServiceListComponent, ServiceFormComponent, CategoryListComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
})
export class ServicesModule { }
