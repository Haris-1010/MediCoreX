import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';

const routes: Routes = [{ path: '', component: AuditLogsComponent }];

@NgModule({
  declarations: [AuditLogsComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)],
})
export class AuditModule { }
