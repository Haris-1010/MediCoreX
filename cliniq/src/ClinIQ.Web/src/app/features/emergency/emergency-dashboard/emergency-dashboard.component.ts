import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-emergency-dashboard',
  template: `
    <app-main-layout>
      <app-page-header title="Emergency Department" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Emergency' }]">
        <button mat-raised-button color="warn" routerLink="triage"><mat-icon>add</mat-icon> New Emergency</button>
      </app-page-header>
      <div class="stats-grid">
        <div class="stat-card critical"><mat-icon>warning</mat-icon><div><h3>{{ stats.critical }}</h3><p>Critical</p></div></div>
        <div class="stat-card urgent"><mat-icon>priority_high</mat-icon><div><h3>{{ stats.urgent }}</h3><p>Urgent</p></div></div>
        <div class="stat-card moderate"><mat-icon>schedule</mat-icon><div><h3>{{ stats.moderate }}</h3><p>Moderate</p></div></div>
        <div class="stat-card stable"><mat-icon>check</mat-icon><div><h3>{{ stats.stable }}</h3><p>Stable</p></div></div>
      </div>
      <div class="card">
        <h3>Active Emergency Cases</h3>
        <table mat-table [dataSource]="cases">
          <ng-container matColumnDef="priority"><th mat-header-cell *matHeaderCellDef>Priority</th><td mat-cell *matCellDef="let c"><span class="priority-badge" [ngClass]="c.priority.toLowerCase()">{{ c.priority }}</span></td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let c">{{ c.patientName }}</td></ng-container>
          <ng-container matColumnDef="complaint"><th mat-header-cell *matHeaderCellDef>Chief Complaint</th><td mat-cell *matCellDef="let c">{{ c.chiefComplaint }}</td></ng-container>
          <ng-container matColumnDef="arrival"><th mat-header-cell *matHeaderCellDef>Arrival</th><td mat-cell *matCellDef="let c">{{ c.arrivalTime | date:'shortTime' }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let c"><app-status-badge [status]="c.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let c"><button mat-icon-button><mat-icon>more_vert</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
      </div>
    </app-main-layout>
  `,
  styles: [`.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; border-radius: 8px; color: white; }
    .stat-card.critical { background: var(--status-error, #d32f2f); } .stat-card.urgent { background: var(--status-warning, #f57c00); }
    .stat-card.moderate { background: var(--status-info-bg, #fbc02d); color: var(--text-primary, #333); } .stat-card.stable { background: var(--status-success, #388e3c); }
    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; } .stat-card h3 { margin: 0; font-size: 2rem; } .stat-card p { margin: 0; }
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; } table { width: 100%; }
    .priority-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
    .priority-badge.critical { background: var(--status-error-bg, #ffebee); color: var(--status-error, #c62828); } .priority-badge.urgent { background: var(--status-warning-bg, #fff3e0); color: var(--status-warning, #e65100); }
    .priority-badge.moderate { background: var(--status-info-bg, #fffde7); color: var(--status-info, #f9a825); } .priority-badge.stable { background: var(--status-success-bg, #e8f5e9); color: var(--status-success, #2e7d32); }`]
})
export class EmergencyDashboardComponent implements OnInit {
  stats = { critical: 0, urgent: 0, moderate: 0, stable: 0 };
  cases: any[] = [];
  columns = ['priority', 'patient', 'complaint', 'arrival', 'status', 'actions'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<any>('v1/emergency/stats').subscribe(r => this.stats = r);
    this.api.get<any[]>('v1/emergency/active').subscribe(r => this.cases = r);
  }
}
