import { Component, Input } from '@angular/core';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  time: string;
  status: string;
  type: string;
}

@Component({
  standalone: false,
  selector: 'app-appointment-widget',
  template: `
    <div class="appointment-widget">
      <div class="calendar-link">
        <a routerLink="/appointments">Open List <mat-icon>open_in_new</mat-icon></a>
      </div>

      <div *ngIf="loading" class="loading-state">
        <app-loading-spinner></app-loading-spinner>
      </div>

      <div *ngIf="!loading && appointments.length === 0" class="empty-state">
        <span>You don't have any appointment today.</span>
      </div>

      <div class="appointment-table" *ngIf="!loading && appointments.length > 0">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Patient</th>
              <th>Purpose</th>
              <th>Doctor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let appointment of appointments">
              <td>{{ appointment.time }}</td>
              <td>{{ appointment.patientName }}</td>
              <td>{{ appointment.type }}</td>
              <td>{{ appointment.doctorName }}</td>
              <td><app-status-badge [status]="appointment.status"></app-status-badge></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .appointment-widget {
      min-height: 200px;
    }

    .calendar-link {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0.75rem;
    }

    .calendar-link a {
      font-size: 0.8rem;
      color: var(--accent-primary, #1a237e);
      text-decoration: none;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .calendar-link a mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .calendar-link a:hover {
      text-decoration: underline;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: var(--text-secondary, #666);
      font-size: 0.9rem;
    }

    .appointment-table {
      width: 100%;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      padding: 0.75rem 0.5rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--accent-primary, #1a237e);
      border-bottom: 1px solid var(--border-color, #e0e0e0);
    }

    td {
      padding: 0.75rem 0.5rem;
      font-size: 0.85rem;
      color: var(--text-primary, #333);
      border-bottom: 1px solid var(--border-color, #f0f0f0);
    }

    tr:hover td {
      background: var(--table-row-hover, #f8f9fa);
    }
  `]
})
export class AppointmentWidgetComponent {
  @Input() appointments: Appointment[] = [];
  @Input() loading: boolean = false;
}
