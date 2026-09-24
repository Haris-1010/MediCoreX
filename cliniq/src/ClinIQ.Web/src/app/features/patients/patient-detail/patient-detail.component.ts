import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { VisitHistoryComponent } from '../components/visit-history/visit-history.component';
import { MedicalHistoryComponent } from '../components/medical-history/medical-history.component';
import { PatientAppointmentHistoryComponent } from '../components/patient-appointment-history/patient-appointment-history.component';
import { PatientBillingHistoryComponent } from '../components/patient-billing-history/patient-billing-history.component';

interface PatientDetail {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: Date;
  age: number;
  gender: string;
  maritalStatus: string;
  occupation: string;
  nationality: string;
  nationalId: string;
  phone: string;
  alternatePhone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  status: string;
  createdAt: Date;
  lastVisit: Date;
}

@Component({
  standalone: false,
  selector: 'app-patient-detail',
  template: `
    <app-main-layout>
      <app-page-header
        [title]="patient?.fullName || 'Patient Details'"
        [subtitle]="'MRN: ' + (patient?.mrn || '')"
        [breadcrumbs]="[
          { label: 'Dashboard', route: '/dashboard' },
          { label: 'Patients', route: '/patients' },
          { label: patient?.fullName || 'Details' }
        ]">
        <button mat-icon-button [matMenuTriggerFor]="actionMenu" aria-label="More actions">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #actionMenu="matMenu">
          <button mat-menu-item (click)="printPatient()">
            <mat-icon>print</mat-icon>
            <span>Print</span>
          </button>
          <button mat-menu-item [routerLink]="['edit']" *appHasPermission="'Patients.Edit'">
            <mat-icon>edit</mat-icon>
            <span>Edit</span>
          </button>
          <button mat-menu-item (click)="bookAppointment()" *appHasPermission="'Appointments.Create'">
            <mat-icon>event</mat-icon>
            <span>Book Appointment</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="deletePatient()" class="delete-action" *appHasPermission="'Patients.Delete'">
            <mat-icon color="warn">delete</mat-icon>
            <span>Delete</span>
          </button>
        </mat-menu>
      </app-page-header>

      <div class="patient-detail" *ngIf="patient">
        <div class="detail-grid">
          <!-- Patient Info Card -->
          <div class="card info-card">
            <div class="patient-header">
              <div class="avatar">
                {{ getInitials() }}
              </div>
              <div class="header-info">
                <h2>{{ patient.fullName }}</h2>
                <div class="meta">
                  <span><mat-icon>cake</mat-icon> {{ patient.age }} years old</span>
                  <span><mat-icon>wc</mat-icon> {{ patient.gender }}</span>
                  <span class="blood-group"><mat-icon>bloodtype</mat-icon> {{ patient.bloodGroup }}</span>
                </div>
                <app-status-badge [status]="patient.status"></app-status-badge>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="info-section">
              <h4>Contact Information</h4>
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>phone</mat-icon>
                  <div>
                    <label>Phone</label>
                    <span>{{ patient.phone | phone }}</span>
                  </div>
                </div>
                <div class="info-item" *ngIf="patient.alternatePhone">
                  <mat-icon>phone</mat-icon>
                  <div>
                    <label>Alternate Phone</label>
                    <span>{{ patient.alternatePhone | phone }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>email</mat-icon>
                  <div>
                    <label>Email</label>
                    <span>{{ patient.email }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>location_on</mat-icon>
                  <div>
                    <label>Address</label>
                    <span>{{ patient.address }}, {{ patient.city }}, {{ patient.state }} {{ patient.postalCode }}</span>
                  </div>
                </div>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="info-section">
              <h4>Personal Information</h4>
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>badge</mat-icon>
                  <div>
                    <label>National ID</label>
                    <span>{{ patient.nationalId }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>favorite</mat-icon>
                  <div>
                    <label>Marital Status</label>
                    <span>{{ patient.maritalStatus }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>work</mat-icon>
                  <div>
                    <label>Occupation</label>
                    <span>{{ patient.occupation || 'Not specified' }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>public</mat-icon>
                  <div>
                    <label>Nationality</label>
                    <span>{{ patient.nationality }}</span>
                  </div>
                </div>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="info-section">
              <h4>Emergency Contact</h4>
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>person</mat-icon>
                  <div>
                    <label>Name</label>
                    <span>{{ patient.emergencyContactName }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>phone</mat-icon>
                  <div>
                    <label>Phone</label>
                    <span>{{ patient.emergencyContactPhone | phone }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>family_restroom</mat-icon>
                  <div>
                    <label>Relationship</label>
                    <span>{{ patient.emergencyContactRelation }}</span>
                  </div>
                </div>
              </div>
            </div>

            <mat-divider *ngIf="patient.insuranceProvider"></mat-divider>

            <div class="info-section" *ngIf="patient.insuranceProvider">
              <h4>Insurance Information</h4>
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>business</mat-icon>
                  <div>
                    <label>Provider</label>
                    <span>{{ patient.insuranceProvider }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>credit_card</mat-icon>
                  <div>
                    <label>Policy Number</label>
                    <span>{{ patient.insurancePolicyNumber }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Medical Info Card -->
          <div class="card medical-card">
            <h3>Medical Information</h3>

            <div class="medical-section">
              <h4>Allergies</h4>
              <div class="chips" *ngIf="patient.allergies?.length">
                <mat-chip-listbox>
                  <mat-chip *ngFor="let allergy of patient.allergies" color="warn">
                    {{ allergy }}
                  </mat-chip>
                </mat-chip-listbox>
              </div>
              <p *ngIf="!patient.allergies?.length" class="no-data">No known allergies</p>
            </div>

            <div class="medical-section">
              <h4>Chronic Conditions</h4>
              <div class="chips" *ngIf="patient.chronicConditions?.length">
                <mat-chip-listbox>
                  <mat-chip *ngFor="let condition of patient.chronicConditions">
                    {{ condition }}
                  </mat-chip>
                </mat-chip-listbox>
              </div>
              <p *ngIf="!patient.chronicConditions?.length" class="no-data">No chronic conditions</p>
            </div>
          </div>
        </div>

        <!-- Tabs for History -->
        <div class="card history-card">
          <mat-tab-group>
            <mat-tab label="Visit History">
              <app-visit-history [patientId]="patient.id"></app-visit-history>
            </mat-tab>
            <mat-tab label="Medical History">
              <app-medical-history [patientId]="patient.id"></app-medical-history>
            </mat-tab>
            <mat-tab label="Appointments">
              <app-patient-appointment-history [patientId]="patient.id"></app-patient-appointment-history>
            </mat-tab>
            <mat-tab label="Billing">
              <app-patient-billing-history [patientId]="patient.id"></app-patient-billing-history>
            </mat-tab>
          </mat-tab-group>
        </div>
      </div>

      <app-loading-spinner *ngIf="loading" [overlay]="true"></app-loading-spinner>
    </app-main-layout>
  `,
  styles: [`
    .detail-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .card {
      background: var(--bg-card, #fff);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
    }

    .patient-header {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #3f51b5;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 600;
    }

    .header-info h2 {
      margin: 0 0 0.5rem;
    }

    .meta {
      display: flex;
      gap: 1rem;
      color: var(--text-secondary, #666);
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .meta span {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .meta mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .blood-group {
      color: #c62828;
      font-weight: 500;
    }

    .info-section {
      padding: 1rem 0;
    }

    .info-section h4 {
      margin: 0 0 1rem;
      color: var(--text-primary, #333);
      font-weight: 600;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .info-item {
      display: flex;
      gap: 0.75rem;
    }

    .info-item mat-icon {
      color: var(--text-secondary, #666);
    }

    .info-item label {
      display: block;
      font-size: 0.75rem;
      color: var(--text-secondary, #666);
    }

    .info-item span {
      font-weight: 500;
    }

    .medical-card h3 {
      margin: 0 0 1.5rem;
    }

    .medical-section {
      margin-bottom: 1.5rem;
    }

    .medical-section h4 {
      margin: 0 0 0.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary, #666);
    }

    .no-data {
      color: var(--text-muted, #999);
      font-style: italic;
    }

    .history-card {
      margin-top: 1.5rem;
    }

    .delete-action {
      color: #f44336;
    }

    @media (max-width: 992px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PatientDetailComponent implements OnInit {
  patient: PatientDetail | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      this.loadPatient(patientId);
    }
  }

  loadPatient(id: string): void {
    this.loading = true;
    this.api.getById<PatientDetail>('v1/patients', id).subscribe({
      next: (patient) => {
        this.patient = {
          ...patient,
          age: patient.age ?? this.calculateAge(patient.dateOfBirth)
        };
        this.loading = false;
      },
      error: () => {
        this.notification.error('Failed to load patient details');
        this.router.navigate(['/patients']);
      }
    });
  }

  getInitials(): string {
    if (!this.patient) return '';
    const name = (this.patient.fullName
      || `${this.patient.firstName || ''} ${this.patient.lastName || ''}`.trim()).trim();
    if (!name) return '';
    const parts = name.split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  printPatient(): void {
    if (!this.patient) return;
    window.open(`/patients/${this.patient.id}/print`, '_blank');
  }

  bookAppointment(): void {
    this.router.navigate(['/appointments/new'], {
      queryParams: { patientId: this.patient?.id }
    });
  }

  private calculateAge(dateOfBirth: Date | string | null | undefined): number {
    if (!dateOfBirth) return 0;
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) return 0;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return Math.max(age, 0);
  }

  deletePatient(): void {
    if (!this.patient) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Patient',
        message: `Are you sure you want to delete ${this.patient.fullName}? This action cannot be undone.`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && this.patient) {
        this.api.delete('v1/patients', this.patient.id).subscribe({
          next: () => {
            this.notification.success('Patient deleted successfully');
            this.router.navigate(['/patients']);
          }
        });
      }
    });
  }
}