import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ApiService } from '../../../../../core/services/api.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../../core/services/notification.service';

interface AppointmentDetailDialogData {
  appointment: any;
  patientId: string;
}

interface AppointmentDetail {
  id: string;
  appointmentNumber: string;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  appointmentType: string;
  status: string;
  chiefComplaint: string;
  notes: string;
  durationMinutes: number;
  consultationFee: number;
}

@Component({
  standalone: true,
  selector: 'app-appointment-detail-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    SharedModule,
    DatePipe
  ],
  template: `
    <div class="appointment-detail-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title>Appointment Details</h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <app-loading-spinner *ngIf="loading"></app-loading-spinner>

        <div *ngIf="!loading && appointmentDetail" class="detail-content">
          <div class="detail-section">
            <h3>Basic Information</h3>
            <mat-divider></mat-divider>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Appointment #</label>
                <span>{{ appointmentDetail.appointmentNumber }}</span>
              </div>
              <div class="detail-item">
                <label>Type</label>
                <span>{{ appointmentDetail.appointmentType }}</span>
              </div>
              <div class="detail-item">
                <label>Status</label>
                <span><app-status-badge [status]="appointmentDetail.status"></app-status-badge></span>
              </div>
              <div class="detail-item">
                <label>Date</label>
                <span>{{ appointmentDetail.appointmentDate | date:'fullDate' }}</span>
              </div>
              <div class="detail-item">
                <label>Time</label>
                <span>{{ appointmentDetail.startTime }} - {{ appointmentDetail.endTime }}</span>
              </div>
              <div class="detail-item">
                <label>Duration</label>
                <span>{{ appointmentDetail.durationMinutes }} minutes</span>
              </div>
              <div class="detail-item">
                <label>Doctor</label>
                <span>Dr. {{ appointmentDetail.doctorName }}</span>
              </div>
              <div class="detail-item" *ngIf="appointmentDetail.consultationFee">
                <label>Consultation Fee</label>
                <span>{{ appointmentDetail.consultationFee | currencyFormat }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section" *ngIf="appointmentDetail.chiefComplaint">
            <h3>Chief Complaint / Reason</h3>
            <mat-divider></mat-divider>
            <p>{{ appointmentDetail.chiefComplaint }}</p>
          </div>

          <div class="detail-section" *ngIf="appointmentDetail.notes">
            <h3>Notes</h3>
            <mat-divider></mat-divider>
            <p>{{ appointmentDetail.notes }}</p>
          </div>
        </div>

        <div *ngIf="!loading && !appointmentDetail" class="error">
          <mat-icon>error</mat-icon>
          <p>Failed to load appointment details</p>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end" *ngIf="!loading && appointmentDetail">
        <button mat-button mat-dialog-close>Close</button>
        <button mat-stroked-button color="primary" (click)="printAppointment()" matTooltip="Print Appointment">
          <mat-icon>print</mat-icon>
          Print
        </button>
        <button mat-stroked-button color="primary" (click)="editAppointment()" matTooltip="Edit Appointment">
          <mat-icon>edit</mat-icon>
          Edit
        </button>
        <button mat-stroked-button color="warn" (click)="cancelAppointment()" *ngIf="canCancel" matTooltip="Cancel Appointment">
          <mat-icon>event_busy</mat-icon>
          Cancel
        </button>
        <button mat-stroked-button color="warn" (click)="deleteAppointment()" *ngIf="canDelete" matTooltip="Delete Appointment">
          <mat-icon>delete</mat-icon>
          Delete
        </button>
        <button mat-raised-button color="primary" (click)="openInNewTab()" matTooltip="Open in New Tab">
          <mat-icon>open_in_new</mat-icon>
          Open in New Tab
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .appointment-detail-dialog {
      min-width: 500px;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 1.25rem;
    }

    .detail-section {
      margin-bottom: 1.5rem;
    }

    .detail-section h3 {
      margin: 0 0 0.75rem;
      font-size: 1rem;
      color: #333;
      font-weight: 600;
    }

    .detail-section p {
      margin: 0;
      color: #555;
      line-height: 1.5;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-item label {
      font-size: 0.75rem;
      color: #666;
      text-transform: uppercase;
      font-weight: 500;
    }

    .detail-item span {
      font-size: 0.875rem;
      color: #333;
    }

    mat-dialog-actions {
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }

    mat-dialog-actions button {
      margin-left: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .error {
      text-align: center;
      padding: 2rem;
      color: #f44336;
    }

    .error mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
    }
  `]
})
export class AppointmentDetailDialogComponent implements OnInit {
  appointmentDetail: AppointmentDetail | null = null;
  loading = true;

  get canCancel(): boolean {
    if (!this.appointmentDetail) return false;
    const status = this.appointmentDetail.status?.toLowerCase();
    return status !== 'cancelled' && status !== 'completed' && status !== 'checkedin' && status !== 'checkedout';
  }

  get canDelete(): boolean {
    if (!this.appointmentDetail) return false;
    const status = this.appointmentDetail.status?.toLowerCase();
    return status !== 'completed' && status !== 'checkedin' && status !== 'checkedout';
  }

  constructor(
    public dialogRef: MatDialogRef<AppointmentDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppointmentDetailDialogData,
    private api: ApiService,
    private dialog: MatDialog,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    // Start with the basic data from the list
    this.appointmentDetail = {
      id: this.data.appointment.id,
      appointmentNumber: this.data.appointment.appointmentNumber || '',
      patientName: this.data.appointment.patientName || '',
      doctorName: this.data.appointment.doctorName || '',
      appointmentDate: this.data.appointment.appointmentDate,
      startTime: this.data.appointment.startTime,
      endTime: this.data.appointment.endTime,
      appointmentType: this.data.appointment.appointmentType || this.data.appointment.type,
      status: this.data.appointment.status,
      chiefComplaint: this.data.appointment.chiefComplaint || this.data.appointment.reason,
      notes: this.data.appointment.notes,
      durationMinutes: this.data.appointment.durationMinutes || 30,
      consultationFee: this.data.appointment.consultationFee || 0
    };

    // Fetch full details from the API
    if (this.data.appointment.id) {
      this.api.get<any>(`v1/appointments/${this.data.appointment.id}`).subscribe({
        next: (response: any) => {
          const detail = response?.data || response;
          if (detail) {
            this.appointmentDetail = {
              ...this.appointmentDetail!,
              appointmentNumber: detail.appointmentNumber || this.appointmentDetail!.appointmentNumber,
              patientName: detail.patientName || this.appointmentDetail!.patientName,
              doctorName: detail.doctorName || this.appointmentDetail!.doctorName,
              appointmentDate: detail.appointmentDate || this.appointmentDetail!.appointmentDate,
              startTime: detail.startTime || this.appointmentDetail!.startTime,
              endTime: detail.endTime || this.appointmentDetail!.endTime,
              appointmentType: detail.appointmentType || detail.type || this.appointmentDetail!.appointmentType,
              status: detail.status || this.appointmentDetail!.status,
              chiefComplaint: detail.chiefComplaint || detail.reason || this.appointmentDetail!.chiefComplaint,
              notes: detail.notes || this.appointmentDetail!.notes,
              durationMinutes: detail.durationMinutes || this.appointmentDetail!.durationMinutes,
              consultationFee: detail.consultationFee || this.appointmentDetail!.consultationFee
            };
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  printAppointment(): void {
    if (this.appointmentDetail?.id) {
      window.open(`/appointments/${this.appointmentDetail.id}/print`, '_blank');
    }
  }

  editAppointment(): void {
    if (this.appointmentDetail?.id) {
      this.router.navigate(['/appointments', this.appointmentDetail.id, 'edit']);
      this.dialogRef.close();
    }
  }

  cancelAppointment(): void {
    if (!this.appointmentDetail?.id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Cancel Appointment',
        message: `Are you sure you want to cancel appointment ${this.appointmentDetail.appointmentNumber}?`,
        confirmText: 'Cancel Appointment',
        confirmColor: 'warn' as const
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.api.post(`v1/appointments/${this.appointmentDetail!.id}/cancel`, { reason: 'Cancelled from patient detail' }).subscribe({
          next: () => {
            this.notification.success('Appointment cancelled successfully');
            this.appointmentDetail!.status = 'Cancelled';
          },
          error: () => {
            this.notification.error('Failed to cancel appointment');
          }
        });
      }
    });
  }

  deleteAppointment(): void {
    if (!this.appointmentDetail?.id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Appointment',
        message: `Are you sure you want to delete appointment ${this.appointmentDetail.appointmentNumber}? This action cannot be undone.`,
        confirmText: 'Delete',
        confirmColor: 'warn' as const
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.api.delete('v1/appointments', this.appointmentDetail!.id).subscribe({
          next: () => {
            this.notification.success('Appointment deleted successfully');
            this.dialogRef.close({ deleted: true });
          },
          error: () => {
            this.notification.error('Failed to delete appointment');
          }
        });
      }
    });
  }

  openInNewTab(): void {
    if (this.appointmentDetail?.id) {
      window.open(`/appointments/${this.appointmentDetail.id}`, '_blank');
      this.dialogRef.close();
    }
  }
}