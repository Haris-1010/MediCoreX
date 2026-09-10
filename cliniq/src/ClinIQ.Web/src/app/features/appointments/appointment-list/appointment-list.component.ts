import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, PagedResult } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-appointment-list',
  template: `
    <app-main-layout>
      <app-page-header title="Appointments" subtitle="Manage appointments"
        [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Appointments' }]">
        <button mat-stroked-button routerLink="calendar"><mat-icon>calendar_today</mat-icon> Calendar View</button>
        <button mat-raised-button color="primary" routerLink="new"><mat-icon>add</mat-icon> New Appointment</button>
      </app-page-header>

      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search..." (search)="onSearch($event)"></app-search-input>
          <app-date-range-picker label="Date Range" (rangeChange)="onDateRangeChange($event)"></app-date-range-picker>
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select [(value)]="filterStatus" (selectionChange)="loadAppointments()">
              <mat-option value="">All</mat-option>
              <mat-option value="Scheduled">Scheduled</mat-option>
              <mat-option value="Confirmed">Confirmed</mat-option>
              <mat-option value="CheckedIn">Checked In</mat-option>
              <mat-option value="Completed">Completed</mat-option>
              <mat-option value="Cancelled">Cancelled</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear Filters
          </button>
        </div>

        <table mat-table [dataSource]="appointments" matSort>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th><td mat-cell *matCellDef="let a">{{ a.appointmentDate | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="time"><th mat-header-cell *matHeaderCellDef>Time</th><td mat-cell *matCellDef="let a">{{ a.startTime }} - {{ a.endTime }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef mat-sort-header>Patient</th><td mat-cell *matCellDef="let a">{{ a.patientName }}</td></ng-container>
          <ng-container matColumnDef="doctor"><th mat-header-cell *matHeaderCellDef mat-sort-header>Doctor</th><td mat-cell *matCellDef="let a">Dr. {{ a.doctorName }}</td></ng-container>
          <ng-container matColumnDef="type"><th mat-header-cell *matHeaderCellDef>Type</th><td mat-cell *matCellDef="let a">{{ a.appointmentType || a.type }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let a"><app-status-badge [status]="a.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let a">
              <button mat-icon-button [matMenuTriggerFor]="menu" [matMenuTriggerData]="{appointment: a}"><mat-icon>more_vert</mat-icon></button>
              <mat-menu #menu="matMenu">
                <ng-template matMenuContent let-appointment="appointment">
                  <button mat-menu-item (click)="printAppointment(appointment)">
                    <mat-icon>print</mat-icon>
                    <span>Print</span>
                  </button>
                  <button mat-menu-item [routerLink]="[appointment.id, 'edit']" *appHasPermission="'Appointments.Edit'">
                    <mat-icon>edit</mat-icon>
                    <span>Edit</span>
                  </button>
                  <button mat-menu-item (click)="checkIn(appointment)" *ngIf="appointment.status === 'Confirmed'">
                    <mat-icon>how_to_reg</mat-icon>
                    <span>Check In</span>
                  </button>
                  <button mat-menu-item (click)="cancel(appointment)" *ngIf="appointment.status !== 'Cancelled' && appointment.status !== 'Completed'">
                    <mat-icon color="warn">cancel</mat-icon>
                    <span>Cancel</span>
                  </button>
                  <button mat-menu-item (click)="restore(appointment)" *ngIf="appointment.status === 'Cancelled'" class="restore-action">
                    <mat-icon>restore</mat-icon>
                    <span>Restore</span>
                  </button>
                  <mat-divider></mat-divider>
                  <button mat-menu-item (click)="deleteAppointment(appointment)" class="delete-action" *appHasPermission="'Appointments.Delete'">
                    <mat-icon color="warn">delete</mat-icon>
                    <span>Delete</span>
                  </button>
                </ng-template>
              </mat-menu>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPageChange($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `,
  styles: [`.filters { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; } table { width: 100%; } .delete-action { color: #f44336; } .restore-action { color: #4caf50; }`]
})
export class AppointmentListComponent implements OnInit {
  appointments: any[] = [];
  displayedColumns = ['date', 'time', 'patient', 'doctor', 'type', 'status', 'actions'];
  totalCount = 0; pageSize = 10; pageIndex = 0;
  searchTerm = ''; filterStatus = ''; startDate: Date | null = null; endDate: Date | null = null;

  constructor(private api: ApiService, private router: Router, private notification: NotificationService, private dialog: MatDialog) {}

  ngOnInit() { this.loadAppointments(); }

  loadAppointments() {
    const params: any = {
      pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm,
      status: this.filterStatus
    };
    if (this.startDate) params.date = this.startDate.toISOString().split('T')[0];
    this.api.get<PagedResult<any>>('v1/appointments', params).subscribe(r => { this.appointments = r.items; this.totalCount = r.totalCount; });
  }

  onSearch(term: string) { this.searchTerm = term; this.pageIndex = 0; this.loadAppointments(); }
  onDateRangeChange(range: any) { this.startDate = range.start; this.endDate = range.end; this.loadAppointments(); }
  onPageChange(e: any) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.loadAppointments(); }
  
  checkIn(a: any) { this.api.post(`v1/appointments/${a.id}/check-in`, {}).subscribe(() => this.loadAppointments()); }
  cancel(a: any) { this.api.post(`v1/appointments/${a.id}/cancel`, {}).subscribe(() => this.loadAppointments()); }
  restore(a: any) { this.api.post(`v1/appointments/${a.id}/restore`, {}).subscribe(() => this.loadAppointments()); }

  printAppointment(a: any) {
    window.open(`/appointments/${a.id}/print`, '_blank');
  }

  deleteAppointment(a: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Appointment',
        message: `Are you sure you want to delete this appointment for ${a.patientName}? This action cannot be undone.`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.api.delete('v1/appointments', a.id).subscribe({
          next: () => {
            this.notification.success('Appointment deleted successfully');
            this.loadAppointments();
          },
          error: () => this.notification.error('Failed to delete appointment')
        });
      }
    });
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.filterStatus || this.startDate || this.endDate);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterStatus = '';
    this.startDate = null;
    this.endDate = null;
    this.pageIndex = 0;
    this.loadAppointments();
  }
}