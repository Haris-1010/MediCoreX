import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { DashboardComponent } from './dashboard.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { AppointmentWidgetComponent } from './components/appointment-widget/appointment-widget.component';
import { PatientGrowthChartComponent } from './components/patient-growth-chart/patient-growth-chart.component';
import { ReminderNotesComponent } from './components/reminder-notes/reminder-notes.component';
import { NewPatientListComponent } from './components/new-patient-list/new-patient-list.component';
import { InventoryOverviewComponent } from './components/inventory-overview/inventory-overview.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    StatsCardComponent,
    AppointmentWidgetComponent,
    PatientGrowthChartComponent,
    ReminderNotesComponent,
    NewPatientListComponent,
    InventoryOverviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    LayoutModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
