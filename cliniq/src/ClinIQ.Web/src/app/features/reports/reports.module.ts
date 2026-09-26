import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { ReportsHubComponent } from './reports-hub/reports-hub.component';
import { ReportViewerComponent } from './report-viewer/report-viewer.component';
import { TrendChartComponent } from './charts/trend-chart.component';
import { BarListComponent } from './charts/bar-list.component';

const routes: Routes = [
  { path: '', component: ReportsHubComponent },
  { path: ':reportId', component: ReportViewerComponent },
];

@NgModule({
  declarations: [ReportsHubComponent, ReportViewerComponent, TrendChartComponent, BarListComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)],
})
export class ReportsModule { }
