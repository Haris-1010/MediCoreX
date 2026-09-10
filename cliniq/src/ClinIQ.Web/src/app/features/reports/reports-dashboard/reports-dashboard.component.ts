import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-reports-dashboard',
  template: `
    <app-main-layout>
      <app-page-header title="Reports" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Reports' }]"></app-page-header>

      <div class="reports-grid">
        <div class="report-category" *ngFor="let cat of reportCategories">
          <h3><mat-icon>{{ cat.icon }}</mat-icon> {{ cat.name }}</h3>
          <div class="report-list">
            <div class="report-item" *ngFor="let r of cat.reports" (click)="generateReport(r)" [class.active]="selectedReport?.id === r.id">
              <div class="report-info">
                <span class="report-name">{{ r.name }}</span>
                <span class="report-desc">{{ r.description }}</span>
              </div>
              <mat-icon>chevron_right</mat-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="report-result card" *ngIf="reportData">
        <h3><mat-icon>assessment</mat-icon> {{ reportData.title | titlecase }} Report</h3>
        <p class="report-meta">Generated: {{ reportData.generatedAt | date:'medium' }}</p>
        <div class="report-content">
          <div class="empty-state">
            <mat-icon>info_outline</mat-icon>
            <p>{{ reportData.message }}</p>
          </div>
        </div>
      </div>

      <div class="report-result card" *ngIf="loading">
        <div class="loading-state">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Generating report...</p>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .report-category {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .report-category h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      padding: 1rem;
      background: linear-gradient(135deg, #1a237e, #0d47a1);
      color: white;
      font-size: 1rem;
    }

    .report-list {
      padding: 0.5rem;
    }

    .report-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .report-item:hover {
      background: #f0f4ff;
    }

    .report-item.active {
      background: #e3f2fd;
      border-left: 3px solid #1a237e;
    }

    .report-info {
      display: flex;
      flex-direction: column;
    }

    .report-name {
      font-weight: 500;
    }

    .report-desc {
      font-size: 0.75rem;
      color: #666;
      margin-top: 2px;
    }

    .report-result {
      margin-top: 1.5rem;
    }

    .report-result h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 0.5rem 0;
      color: #1a237e;
    }

    .report-meta {
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 1rem;
    }

    .empty-state, .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      color: #999;
    }

    .empty-state mat-icon, .loading-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 0.5rem;
    }
  `]
})
export class ReportsDashboardComponent implements OnInit {
  reportCategories: any[] = [];
  selectedReport: any = null;
  reportData: any = null;
  loading = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.api.get<any[]>('v1/reports').subscribe({
      next: (data) => {
        this.reportCategories = data;
      },
      error: () => {
        // Fallback to static data
        this.reportCategories = [
          { name: 'Patient Reports', icon: 'people', reports: [
            { name: 'Patient List', id: 'patient-list', description: 'Complete list of all registered patients' },
            { name: 'New Registrations', id: 'new-registrations', description: 'Recently registered patients' },
            { name: 'Patient Demographics', id: 'patient-demographics', description: 'Age, gender, and blood group distribution' }
          ]},
          { name: 'Financial Reports', icon: 'attach_money', reports: [
            { name: 'Revenue Summary', id: 'revenue-summary', description: 'Total revenue breakdown by department' },
            { name: 'Outstanding Payments', id: 'outstanding-payments', description: 'Pending and overdue invoices' },
            { name: 'Daily Collection', id: 'daily-collection', description: "Today's collection summary" }
          ]},
          { name: 'Clinical Reports', icon: 'medical_services', reports: [
            { name: 'OPD Summary', id: 'opd-summary', description: 'Outpatient department visit statistics' },
            { name: 'IPD Statistics', id: 'ipd-statistics', description: 'Inpatient department admission data' },
            { name: 'Diagnosis Report', id: 'diagnosis-report', description: 'Common diagnoses and treatment outcomes' }
          ]},
          { name: 'Operational Reports', icon: 'analytics', reports: [
            { name: 'Bed Occupancy', id: 'bed-occupancy', description: 'Current bed utilization across departments' },
            { name: 'Staff Attendance', id: 'staff-attendance', description: 'Staff attendance and shift coverage' },
            { name: 'Department Performance', id: 'department-performance', description: 'KPIs by department' }
          ]}
        ];
      }
    });
  }

  generateReport(report: any): void {
    this.selectedReport = report;
    this.loading = true;
    this.reportData = null;

    this.api.get<any>(`v1/reports/${report.id}`).subscribe({
      next: (data) => {
        this.reportData = data;
        this.loading = false;
      },
      error: () => {
        this.reportData = {
          title: report.name,
          generatedAt: new Date(),
          message: 'Report generation not yet implemented'
        };
        this.loading = false;
      }
    });
  }
}
