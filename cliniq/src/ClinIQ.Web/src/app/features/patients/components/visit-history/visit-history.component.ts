import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-visit-history',
  template: `
    <div class="visit-history">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      <div *ngIf="!loading && visits.length === 0" class="empty">
        <mat-icon>event_note</mat-icon>
        <p>No visits recorded</p>
      </div>
      <div class="visit-list" *ngIf="!loading && visits.length > 0">
        <div class="visit-item" *ngFor="let visit of visits">
          <div class="visit-date">
            <span class="day">{{ (visit.visitDate || visit.createdAt) | date:'dd' }}</span>
            <span class="month">{{ (visit.visitDate || visit.createdAt) | date:'MMM yyyy' }}</span>
          </div>
          <div class="visit-content">
            <div class="visit-header">
              <span class="visit-type">{{ visit.type }}</span>
              <app-status-badge [status]="visit.status"></app-status-badge>
            </div>
            <p class="doctor">Dr. {{ visit.doctorName }} - {{ visit.department }}</p>
            <p class="complaint" *ngIf="visit.chiefComplaint">{{ visit.chiefComplaint }}</p>
            <p class="diagnosis" *ngIf="visit.diagnosis"><strong>Diagnosis:</strong> {{ visit.diagnosis }}</p>
          </div>
          <button mat-icon-button [routerLink]="['/visits', visit.id]"><mat-icon>chevron_right</mat-icon></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .visit-history { padding: 1rem 0; }
    .empty { text-align: center; padding: 2rem; color: var(--text-secondary, #666); }
    .empty mat-icon { font-size: 48px; width: 48px; height: 48px; color: var(--text-muted, #ccc); }
    .visit-list { display: flex; flex-direction: column; gap: 1rem; }
    .visit-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-input, #f5f5f5); border-radius: 8px; }
    .visit-date { text-align: center; min-width: 60px; }
    .visit-date .day { display: block; font-size: 1.5rem; font-weight: 700; color: var(--accent-primary, #3f51b5); }
    .visit-date .month { display: block; font-size: 0.75rem; color: var(--text-secondary, #666); }
    .visit-content { flex: 1; }
    .visit-header { display: flex; align-items: center; gap: 0.5rem; }
    .visit-type { background: #e8eaf6; color: #3f51b5; padding: 2px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .doctor { margin: 0.25rem 0; font-size: 0.875rem; color: var(--text-secondary, #666); }
    .complaint { margin: 0.25rem 0; font-size: 0.875rem; color: var(--text-secondary, #555); }
    .diagnosis { margin: 0.25rem 0; font-size: 0.875rem; color: var(--text-primary, #333); }
  `]
})
export class VisitHistoryComponent implements OnInit {
  @Input() patientId!: string;
  visits: any[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<any[]>(`v1/patients/${this.patientId}/visits`).subscribe({
      next: (data) => { this.visits = data; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
