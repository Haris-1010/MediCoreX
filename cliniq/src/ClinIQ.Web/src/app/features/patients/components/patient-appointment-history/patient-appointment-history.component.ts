import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentDetailDialogComponent } from './appointment-detail-dialog/appointment-detail-dialog.component';

@Component({
  standalone: false,
  selector: 'app-patient-appointment-history',
  template: `
    <div class="patient-appointment-history">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      <div *ngIf="!loading && appointments.length === 0" class="empty">
        <mat-icon>event</mat-icon>
        <p>No appointments found</p>
      </div>
      <div class="appointment-list" *ngIf="!loading && appointments.length > 0">
        <div class="appointment-item" *ngFor="let appt of appointments" (click)="openAppointmentDetail(appt)">
          <div class="appointment-date">
            <span class="day">{{ appt.appointmentDate | date:'dd' }}</span>
            <span class="month">{{ appt.appointmentDate | date:'MMM yyyy' }}</span>
          </div>
          <div class="appointment-content">
            <div class="appointment-header">
              <h4>{{ appt.appointmentType }}</h4>
              <app-status-badge [status]="appt.status"></app-status-badge>
            </div>
            <p class="doctor">Dr. {{ appt.doctorName }}</p>
            <p class="time">{{ appt.startTime }} - {{ appt.endTime }}</p>
            <p class="reason" *ngIf="appt.reason">{{ appt.reason }}</p>
          </div>
          <div class="appointment-actions">
            <button mat-icon-button (click)="$event.stopPropagation(); openAppointmentDetail(appt)" matTooltip="View Details">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button (click)="$event.stopPropagation(); navigateToAppointment(appt.id)" matTooltip="Open Appointment">
              <mat-icon>open_in_new</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .patient-appointment-history { padding: 1rem 0; }
    .empty { text-align: center; padding: 2rem; color: var(--text-secondary, #666); }
    .empty mat-icon { font-size: 48px; width: 48px; height: 48px; color: var(--text-muted, #ccc); }
    .appointment-list { display: flex; flex-direction: column; gap: 1rem; }
    .appointment-item { 
      display: flex; 
      align-items: center; 
      gap: 1rem; 
      padding: 1rem; 
      background: var(--bg-input, #f5f5f5); 
      border-radius: 8px; 
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .appointment-item:hover {
      background: #e8eaf6;
    }
    .appointment-date { text-align: center; min-width: 60px; }
    .appointment-date .day { display: block; font-size: 1.5rem; font-weight: 700; color: var(--accent-primary, #3f51b5); }
    .appointment-date .month { display: block; font-size: 0.75rem; color: var(--text-secondary, #666); }
    .appointment-content { flex: 1; min-width: 0; }
    .appointment-header { display: flex; align-items: center; gap: 0.5rem; }
    .appointment-header h4 { margin: 0; }
    .doctor { margin: 0.25rem 0; font-size: 0.875rem; color: var(--text-secondary, #666); }
    .time { margin: 0.25rem 0; font-size: 0.875rem; color: var(--text-secondary, #666); }
    .reason { margin: 0.25rem 0; font-size: 0.875rem; color: var(--text-primary, #333); }
    .appointment-actions {
      display: flex;
      gap: 0.25rem;
      padding-left: 1rem;
      border-left: 1px solid var(--border-color, #ddd);
    }
    .appointment-actions button {
      color: #666;
    }
    .appointment-actions button:hover {
      color: #3f51b5;
    }
  `]
})
export class PatientAppointmentHistoryComponent implements OnInit {
  @Input() patientId!: string;
  appointments: any[] = [];
  loading = true;

  constructor(
    private api: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.api.get<any>('v1/appointments', { patientId: this.patientId, pageSize: 50 }).subscribe({
      next: (data) => {
        this.appointments = Array.isArray(data) ? data : (data?.items ?? []);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openAppointmentDetail(appointment: any): void {
    this.dialog.open(AppointmentDetailDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { appointment, patientId: this.patientId }
    });
  }

  navigateToAppointment(appointmentId: string): void {
    window.open(`/appointments/${appointmentId}`, '_blank');
  }
}