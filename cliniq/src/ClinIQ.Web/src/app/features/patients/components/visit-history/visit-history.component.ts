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
            <span class="day">{{ visit.date | date:'dd' }}</span>
            <span class="month">{{ visit.date | date:'MMM yyyy' }}</span>
          </div>
          <div class="visit-content">
            <div class="visit-header">
              <h4>{{ visit.type }}</h4>
              <app-status-badge [status]="visit.status"></app-status-badge>
            </div>
            <p class="doctor">Dr. {{ visit.doctorName }} - {{ visit.department }}</p>
            <p class="diagnosis" *ngIf="visit.diagnosis">{{ visit.diagnosis }}</p>
          </div>
          <button mat-icon-button [routerLink]="['/visits', visit.id]"><mat-icon>chevron_right</mat-icon></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .visit-history { padding: 1rem 0; }
    .empty { text-align: center; padding: 2rem; color: #666; }
    .empty mat-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; }
    .visit-list { display: flex; flex-direction: column; gap: 1rem; }
    .visit-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 8px; }
    .visit-date { text-align: center; min-width: 60px; }
    .visit-date .day { display: block; font-size: 1.5rem; font-weight: 700; color: #3f51b5; }
    .visit-date .month { display: block; font-size: 0.75rem; color: #666; }
    .visit-content { flex: 1; }
    .visit-header { display: flex; align-items: center; gap: 0.5rem; }
    .visit-header h4 { margin: 0; }
    .doctor { margin: 0.25rem 0; font-size: 0.875rem; color: #666; }
    .diagnosis { margin: 0; font-size: 0.875rem; }
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
