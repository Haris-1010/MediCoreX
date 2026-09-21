import { Component, OnInit } from '@angular/core';
import { ApiService, PagedResult } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-lab-reports',
  template: `
    <app-main-layout>
      <app-page-header title="Lab Reports" [breadcrumbs]="[{ label: 'Laboratory', route: '/laboratory' }, { label: 'Reports' }]"></app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search reports..." (search)="onSearch($event)"></app-search-input>
        </div>
        <table mat-table [dataSource]="reports">
          <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let r">{{ r.orderNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let r">{{ r.patientName }}<br><small>MRN: {{ r.mrn }}</small></td></ng-container>
          <ng-container matColumnDef="tests"><th mat-header-cell *matHeaderCellDef>Tests</th><td mat-cell *matCellDef="let r">
            <span *ngFor="let item of r.items; let last = last">{{ item.serviceName }}<span *ngIf="!last">, </span></span>
          </td></ng-container>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let r">{{ (r.completedAt || r.orderDate) | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r"><app-status-badge [status]="r.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th><td mat-cell *matCellDef="let r">
            <button mat-icon-button color="primary" (click)="printReport(r.id)" matTooltip="Print Report"><mat-icon>print</mat-icon></button>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <div *ngIf="reports.length === 0" class="empty-state">
          <mat-icon>description</mat-icon>
          <p>No lab reports available</p>
        </div>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    .filters { display: flex; gap: 1rem; margin-bottom: 1rem; }
    table { width: 100%; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 2rem; color: var(--text-muted, #999); }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 0.5rem; }
  `]
})
export class LabReportsComponent implements OnInit {
  reports: any[] = [];
  columns = ['orderNumber', 'patient', 'tests', 'date', 'status', 'actions'];
  totalCount = 0;
  pageSize = 25;
  pageIndex = 0;
  searchTerm = '';

  constructor(private api: ApiService, private notification: NotificationService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.get<PagedResult<any>>('v1/laboratory/reports', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm })
      .subscribe({
        next: r => { this.reports = r.items; this.totalCount = r.totalCount; },
        error: (err) => { this.notification.error(err?.message || 'Failed to load reports'); }
      });
  }

  onSearch(term: string) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
  onPage(e: any) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
  printReport(id: string) { window.open(`/laboratory/print/${id}`, '_blank'); }
}
