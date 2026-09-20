import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

interface NewPatient {
  id: string;
  name: string;
  phone: string;
  date: Date | string;
}

@Component({
  standalone: false,
  selector: 'app-new-patient-list',
  template: `
    <div class="new-patient-list">
      <div class="list-header">
        <a class="full-report" routerLink="/patients">Full Report <mat-icon>open_in_new</mat-icon></a>
      </div>

      <div class="patient-table" *ngIf="!loading && patients.length > 0">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let patient of patients">
              <td>{{ patient.name }}</td>
              <td>{{ patient.phone | phone }}</td>
              <td>{{ patient.date | date:'M/d/yyyy' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!loading && patients.length === 0" class="empty-state">
        <span>No New Patient Added.</span>
      </div>
    </div>
  `,
  styles: [`
    .new-patient-list {
      min-height: 150px;
    }

    .list-header {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0.75rem;
    }

    .full-report {
      font-size: 0.8rem;
      color: var(--accent-primary, #1a237e);
      text-decoration: none;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .full-report mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .full-report:hover {
      text-decoration: underline;
    }

    .patient-table {
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

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: var(--text-secondary, #666);
      font-size: 0.9rem;
    }
  `]
})
export class NewPatientListComponent implements OnInit {
  @Input() loading: boolean = false;

  patients: NewPatient[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadNewPatients();
  }

  loadNewPatients(): void {
    this.loading = true;
    this.api.get<NewPatient[]>('v1/dashboard/new-patients').subscribe({
      next: (data) => {
        this.patients = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: () => this.loadPatientsFallback()
    });
  }

  private loadPatientsFallback(): void {
    this.api.get<any>('v1/patients', { pageNumber: 1, pageSize: 5 }).subscribe({
      next: (data) => {
        const items = Array.isArray(data) ? data : (data?.items || []);
        this.patients = items.map((patient: any) => ({
          id: patient.id,
          name: patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim(),
          phone: patient.phone || 'N/A',
          date: patient.lastVisit || new Date()
        }));
        this.loading = false;
      },
      error: () => { this.patients = []; this.loading = false; }
    });
  }
}
