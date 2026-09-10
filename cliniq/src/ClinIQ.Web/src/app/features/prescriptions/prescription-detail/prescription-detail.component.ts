import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

interface PrescriptionDetail {
  id: string;
  prescriptionNumber: string;
  prescriptionDate: Date;
  validUntil: Date | null;
  diagnosis: string | null;
  generalInstructions: string | null;
  dietaryAdvice: string | null;
  lifestyleAdvice: string | null;
  isDispensed: boolean;
  dispensedAt: Date | null;
  patientId: string;
  patientName: string;
  patientNumber: string;
  doctorId: string;
  doctorName: string;
  visitId: string | null;
  items: PrescriptionItem[];
  createdAt: Date;
}

interface PrescriptionItem {
  id: string;
  medicineName: string;
  genericName: string | null;
  strength: string | null;
  form: string | null;
  dosage: string | null;
  frequency: string;
  frequencyText: string | null;
  route: string;
  durationDays: number | null;
  durationText: string | null;
  quantity: number | null;
  instructions: string | null;
  specialInstructions: string | null;
  warnings: string | null;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  night: boolean;
  allowSubstitution: boolean;
  displayOrder: number;
}

@Component({
  standalone: false,
  selector: 'app-prescription-detail',
  template: `
    <app-main-layout>
      <app-page-header
        [title]="prescription?.prescriptionNumber || 'Prescription Details'"
        [subtitle]="prescription ? 'Date: ' + (prescription.prescriptionDate | date:'mediumDate') : ''"
        [breadcrumbs]="[
          { label: 'Dashboard', route: '/dashboard' },
          { label: 'Prescriptions', route: '/prescriptions' },
          { label: prescription?.prescriptionNumber || 'Details' }
        ]">
        <button mat-icon-button [matMenuTriggerFor]="actionMenu" aria-label="More actions">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #actionMenu="matMenu">
          <button mat-menu-item (click)="editPrescription()" *appHasPermission="'Prescriptions.Edit'">
            <mat-icon>edit</mat-icon>
            <span>Edit</span>
          </button>
          <button mat-menu-item (click)="printPrescription()" *appHasPermission="'Prescriptions.Print'">
            <mat-icon>print</mat-icon>
            <span>Print</span>
          </button>
          <ng-container *appHasPermission="'Prescriptions.Dispense'">
            <button mat-menu-item (click)="dispensePrescription()" *ngIf="!prescription?.isDispensed">
              <mat-icon>check_circle</mat-icon>
              <span>Dispense</span>
            </button>
          </ng-container>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="deletePrescription()" class="delete-action" *appHasPermission="'Prescriptions.Delete'">
            <mat-icon color="warn">delete</mat-icon>
            <span>Delete</span>
          </button>
        </mat-menu>
      </app-page-header>

      <div class="prescription-detail" *ngIf="prescription">
        <div class="detail-grid">
          <!-- Prescription Info Card -->
          <div class="card info-card">
            <div class="prescription-header">
              <div class="rx-icon">
                <mat-icon>receipt_long</mat-icon>
              </div>
              <div class="header-info">
                <h2>{{ prescription.prescriptionNumber }}</h2>
                <div class="meta">
                  <span><mat-icon>calendar_today</mat-icon> {{ prescription.prescriptionDate | date:'medium' }}</span>
                  <span *ngIf="prescription.validUntil"><mat-icon>event</mat-icon> Valid Until: {{ prescription.validUntil | date:'mediumDate' }}</span>
                </div>
                <span class="status-badge" [class.dispensed]="prescription.isDispensed" [class.pending]="!prescription.isDispensed">
                  {{ prescription.isDispensed ? 'Dispensed' : 'Pending' }}
                </span>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="info-section">
              <h4>Patient Information</h4>
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>person</mat-icon>
                  <div>
                    <label>Patient</label>
                    <span>{{ prescription.patientName }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>badge</mat-icon>
                  <div>
                    <label>Patient Number</label>
                    <span>{{ prescription.patientNumber }}</span>
                  </div>
                </div>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="info-section">
              <h4>Doctor Information</h4>
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>medical_services</mat-icon>
                  <div>
                    <label>Doctor</label>
                    <span>Dr. {{ prescription.doctorName }}</span>
                  </div>
                </div>
              </div>
            </div>

            <mat-divider *ngIf="prescription.diagnosis"></mat-divider>

            <div class="info-section" *ngIf="prescription.diagnosis">
              <h4>Diagnosis</h4>
              <p class="diagnosis-text">{{ prescription.diagnosis }}</p>
            </div>
          </div>

          <!-- Instructions Card -->
          <div class="card instructions-card" *ngIf="prescription.generalInstructions || prescription.dietaryAdvice || prescription.lifestyleAdvice">
            <h3>Instructions</h3>

            <div class="instruction-section" *ngIf="prescription.generalInstructions">
              <h4>General Instructions</h4>
              <p>{{ prescription.generalInstructions }}</p>
            </div>

            <div class="instruction-section" *ngIf="prescription.dietaryAdvice">
              <h4>Dietary Advice</h4>
              <p>{{ prescription.dietaryAdvice }}</p>
            </div>

            <div class="instruction-section" *ngIf="prescription.lifestyleAdvice">
              <h4>Lifestyle Advice</h4>
              <p>{{ prescription.lifestyleAdvice }}</p>
            </div>
          </div>
        </div>

        <!-- Medicines Table -->
        <div class="card medicines-card">
          <h3>Medicines ({{ prescription.items?.length || 0 }})</h3>

          <div *ngIf="prescription.items?.length" class="medicines-table">
            <table mat-table [dataSource]="prescription.items" class="full-width-table">
              <ng-container matColumnDef="order">
                <th mat-header-cell *matHeaderCellDef>#</th>
                <td mat-cell *matCellDef="let item; let i = index"> {{ i + 1 }} </td>
              </ng-container>

              <ng-container matColumnDef="medicine">
                <th mat-header-cell *matHeaderCellDef>Medicine</th>
                <td mat-cell *matCellDef="let item">
                  <div class="medicine-info">
                    <strong>{{ item.medicineName }}</strong>
                    <span *ngIf="item.genericName" class="generic-name">({{ item.genericName }})</span>
                  </div>
                  <div class="medicine-meta">
                    <span *ngIf="item.strength">{{ item.strength }}</span>
                    <span *ngIf="item.form"> | {{ item.form }}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="dosage">
                <th mat-header-cell *matHeaderCellDef>Dosage</th>
                <td mat-cell *matCellDef="let item"> {{ item.dosage || '-' }} </td>
              </ng-container>

              <ng-container matColumnDef="frequency">
                <th mat-header-cell *matHeaderCellDef>Frequency</th>
                <td mat-cell *matCellDef="let item">
                  {{ item.frequency }}
                  <div class="timing-badges" *ngIf="item.morning || item.afternoon || item.evening || item.night">
                    <span class="timing-badge" *ngIf="item.morning">M</span>
                    <span class="timing-badge" *ngIf="item.afternoon">A</span>
                    <span class="timing-badge" *ngIf="item.evening">E</span>
                    <span class="timing-badge" *ngIf="item.night">N</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="duration">
                <th mat-header-cell *matHeaderCellDef>Duration</th>
                <td mat-cell *matCellDef="let item">
                  {{ item.durationText || (item.durationDays ? item.durationDays + ' days' : '-') }}
                </td>
              </ng-container>

              <ng-container matColumnDef="instructions">
                <th mat-header-cell *matHeaderCellDef>Instructions</th>
                <td mat-cell *matCellDef="let item">
                  <span *ngIf="item.instructions">{{ item.instructions }}</span>
                  <span *ngIf="item.specialInstructions" class="special-instructions">{{ item.specialInstructions }}</span>
                  <span *ngIf="!item.instructions && !item.specialInstructions">-</span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="medicineColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: medicineColumns;"></tr>
            </table>
          </div>

          <div *ngIf="!prescription.items?.length" class="empty-medicines">
            <mat-icon>medication</mat-icon>
            <p>No medicines prescribed</p>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="card footer-card">
          <div class="footer-grid">
            <div class="footer-item">
              <label>Created:</label>
              <span>{{ prescription.createdAt | date:'medium' }}</span>
            </div>
            <div class="footer-item" *ngIf="prescription.dispensedAt">
              <label>Dispensed:</label>
              <span>{{ prescription.dispensedAt | date:'medium' }}</span>
            </div>
          </div>
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
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
    }

    .prescription-header {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .rx-icon {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      background: #3f51b5;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rx-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .header-info h2 {
      margin: 0 0 0.5rem;
    }

    .meta {
      display: flex;
      gap: 1rem;
      color: #666;
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

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-badge.dispensed {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status-badge.pending {
      background: #fff3e0;
      color: #e65100;
    }

    .info-section {
      padding: 1rem 0;
    }

    .info-section h4 {
      margin: 0 0 1rem;
      color: #333;
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
      color: #666;
    }

    .info-item label {
      display: block;
      font-size: 0.75rem;
      color: #666;
    }

    .info-item span {
      font-weight: 500;
    }

    .diagnosis-text {
      color: #333;
      line-height: 1.5;
    }

    .instructions-card h3 {
      margin: 0 0 1.5rem;
    }

    .instruction-section {
      margin-bottom: 1.5rem;
    }

    .instruction-section:last-child {
      margin-bottom: 0;
    }

    .instruction-section h4 {
      margin: 0 0 0.5rem;
      color: #3f51b5;
      font-size: 0.875rem;
    }

    .instruction-section p {
      margin: 0;
      color: #333;
      line-height: 1.5;
    }

    .medicines-card h3 {
      margin: 0 0 1.5rem;
    }

    .full-width-table {
      width: 100%;
    }

    .medicine-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .generic-name {
      color: #666;
      font-size: 0.85rem;
    }

    .medicine-meta {
      font-size: 0.8rem;
      color: #888;
    }

    .timing-badges {
      display: flex;
      gap: 4px;
      margin-top: 4px;
    }

    .timing-badge {
      background: #e3f2fd;
      color: #1565c0;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .special-instructions {
      display: block;
      font-size: 0.85rem;
      color: #e65100;
      font-style: italic;
    }

    .empty-medicines {
      text-align: center;
      padding: 3rem;
      color: #999;
    }

    .empty-medicines mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
    }

    .footer-card {
      margin-top: 1.5rem;
    }

    .footer-grid {
      display: flex;
      gap: 2rem;
    }

    .footer-item {
      display: flex;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .footer-item label {
      color: #666;
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
export class PrescriptionDetailComponent implements OnInit {
  prescription: PrescriptionDetail | null = null;
  loading = true;
  medicineColumns = ['order', 'medicine', 'dosage', 'frequency', 'duration', 'instructions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPrescription(id);
    }
  }

  loadPrescription(id: string): void {
    this.loading = true;
    this.api.getById<PrescriptionDetail>('v1/prescriptions', id).subscribe({
      next: (prescription) => {
        this.prescription = prescription;
        this.loading = false;
      },
      error: () => {
        this.notification.error('Failed to load prescription details');
        this.router.navigate(['/prescriptions']);
      }
    });
  }

  editPrescription(): void {
    if (!this.prescription) return;
    this.router.navigate(['/prescriptions/edit', this.prescription.id]);
  }

  printPrescription(): void {
    if (!this.prescription) return;
    window.open(`/prescriptions/print/${this.prescription.id}`, '_blank');
  }

  dispensePrescription(): void {
    if (!this.prescription) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Dispense Prescription',
        message: `Mark prescription ${this.prescription.prescriptionNumber} as dispensed?`,
        confirmText: 'Dispense',
        confirmColor: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && this.prescription) {
        this.api.post(`v1/prescriptions/${this.prescription.id}/dispense`, {}).subscribe({
          next: () => {
            this.notification.success('Prescription dispensed successfully');
            this.loadPrescription(this.prescription!.id);
          },
          error: () => {
            this.notification.error('Failed to dispense prescription');
          }
        });
      }
    });
  }

  deletePrescription(): void {
    if (!this.prescription) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Prescription',
        message: `Are you sure you want to delete prescription ${this.prescription.prescriptionNumber}? This action cannot be undone.`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && this.prescription) {
        this.api.delete('v1/prescriptions', this.prescription.id).subscribe({
          next: () => {
            this.notification.success('Prescription deleted successfully');
            this.router.navigate(['/prescriptions']);
          },
          error: () => {
            this.notification.error('Failed to delete prescription');
          }
        });
      }
    });
  }
}
