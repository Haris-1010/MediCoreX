import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService, Tenant } from '../../../core/services/tenant.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-admission-detail',
  template: `
    <app-main-layout>
      <app-page-header [title]="'Admission ' + (admission?.admissionNumber || '')" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Admissions', route: '/ipd/admissions' }, { label: admission?.admissionNumber || '' }]">
        <button mat-stroked-button (click)="print()"><mat-icon>print</mat-icon> Print</button>
        <button mat-stroked-button color="primary" [routerLink]="['/prescriptions/new']" [queryParams]="{ admissionId: admission?.id, patientId: admission?.patientId }" *ngIf="admission?.status === 'Admitted'"><mat-icon>medication</mat-icon> Prescribe</button>
        <button mat-stroked-button color="warn" (click)="deleteAdmission()" *ngIf="admission?.status === 'Admitted'"><mat-icon>delete</mat-icon> Delete</button>
        <button mat-raised-button color="primary" [routerLink]="['/ipd/discharge', admission?.id]" *ngIf="admission?.status === 'Admitted'"><mat-icon>logout</mat-icon> Discharge</button>
      </app-page-header>

      <div class="profile-grid" *ngIf="admission">
        <!-- Patient Info -->
        <div class="card">
          <h3><mat-icon>person</mat-icon> Patient Information</h3>
          <div class="info-row"><span>Patient Name</span><strong>{{ admission.patientName }}</strong></div>
          <div class="info-row"><span>MRN</span><strong>{{ admission.mrn }}</strong></div>
        </div>

        <!-- Admission Info -->
        <div class="card">
          <h3><mat-icon>assignment_ind</mat-icon> Admission Details</h3>
          <div class="info-row"><span>Admission #</span><strong>{{ admission.admissionNumber }}</strong></div>
          <div class="info-row"><span>Status</span><app-status-badge [status]="admission.status"></app-status-badge></div>
          <div class="info-row"><span>Type</span><strong>{{ admission.type }}</strong></div>
          <div class="info-row"><span>Date</span><strong>{{ admission.admissionDate | date:'medium' }}</strong></div>
          <div class="info-row"><span>Days Admitted</span><strong>{{ admission.daysAdmitted }} days</strong></div>
          <div class="info-row" *ngIf="admission.dischargeDate"><span>Discharge Date</span><strong>{{ admission.dischargeDate | date:'medium' }}</strong></div>
        </div>

        <!-- Location -->
        <div class="card">
          <h3><mat-icon>hotel</mat-icon> Location</h3>
          <div class="info-row"><span>Ward</span><strong>{{ admission.wardName || '-' }}</strong></div>
          <div class="info-row"><span>Room</span><strong>{{ admission.roomNumber || '-' }}</strong></div>
          <div class="info-row"><span>Bed</span><strong>{{ admission.bedNumber || '-' }}</strong></div>
        </div>

        <!-- Doctor -->
        <div class="card">
          <h3><mat-icon>medical_services</mat-icon> Doctor</h3>
          <div class="info-row"><span>Attending Doctor</span><strong>Dr. {{ admission.doctorName }}</strong></div>
        </div>

        <!-- Clinical -->
        <div class="card full-width">
          <h3><mat-icon>description</mat-icon> Clinical Information</h3>
          <div class="info-row"><span>Admission Reason</span><strong>{{ admission.admissionReason || '-' }}</strong></div>
          <div class="info-row"><span>Provisional Diagnosis</span><strong>{{ admission.provisionalDiagnosis || '-' }}</strong></div>
          <div class="info-row" *ngIf="admission.finalDiagnosis"><span>Final Diagnosis</span><strong>{{ admission.finalDiagnosis }}</strong></div>
          <div class="info-row"><span>Notes</span><strong>{{ admission.notes || '-' }}</strong></div>
        </div>

        <!-- Discharge Info -->
        <div class="card full-width" *ngIf="admission.status === 'Discharged'">
          <h3><mat-icon>logout</mat-icon> Discharge Information</h3>
          <div class="info-row"><span>Discharge Summary</span><strong>{{ admission.dischargeSummary || '-' }}</strong></div>
          <div class="info-row"><span>Instructions</span><strong>{{ admission.dischargeInstructions || '-' }}</strong></div>
        </div>

        <!-- Bed Allocation History -->
        <div class="card full-width">
          <h3><mat-icon>history</mat-icon> Bed Allocation History</h3>
          <table mat-table [dataSource]="allocationHistory" class="full-width" *ngIf="allocationHistory.length > 0">
            <ng-container matColumnDef="bed"><th mat-header-cell *matHeaderCellDef>Bed</th><td mat-cell *matCellDef="let h">{{ h.bed }}</td></ng-container>
            <ng-container matColumnDef="ward"><th mat-header-cell *matHeaderCellDef>Ward</th><td mat-cell *matCellDef="let h">{{ h.ward }}</td></ng-container>
            <ng-container matColumnDef="allocatedAt"><th mat-header-cell *matHeaderCellDef>Allocated</th><td mat-cell *matCellDef="let h">{{ h.allocatedAt | date:'medium' }}</td></ng-container>
            <ng-container matColumnDef="releasedAt"><th mat-header-cell *matHeaderCellDef>Released</th><td mat-cell *matCellDef="let h">{{ h.releasedAt ? (h.releasedAt | date:'medium') : 'Current' }}</td></ng-container>
            <ng-container matColumnDef="duration"><th mat-header-cell *matHeaderCellDef>Duration</th><td mat-cell *matCellDef="let h">{{ h.duration }}</td></ng-container>
            <tr mat-header-row *matHeaderRowDef="historyColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: historyColumns;"></tr>
          </table>
          <p *ngIf="allocationHistory.length === 0" class="no-data">No allocation history.</p>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .profile-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; }
    .card h3 { margin: 0 0 1rem; display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; color: #333; }
    .card h3 mat-icon { font-size: 20px; width: 20px; height: 20px; color: #3f51b5; }
    .full-width { grid-column: 1 / -1; }
    .info-row { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid #f0f0f0; }
    .info-row:last-child { border-bottom: none; }
    .info-row span { color: #888; font-size: 0.85rem; }
    .info-row strong { color: #333; text-align: right; max-width: 60%; }
    .mono { font-family: monospace; font-size: 0.8rem; }
    .no-data { text-align: center; color: #aaa; padding: 1rem; }
    .full-width table { width: 100%; }
  `]
})
export class AdmissionDetailComponent implements OnInit {
  admission: any = null;
  allocationHistory: any[] = [];
  historyColumns = ['bed', 'ward', 'allocatedAt', 'releasedAt', 'duration'];
  branding: Tenant | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private notification: NotificationService,
    private tenantService: TenantService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getById<any>('v1/admissions', id).subscribe(r => this.admission = r);
      this.api.get<any>(`v1/admissions/${id}/allocation-history`).subscribe({
        next: (r) => { this.allocationHistory = Array.isArray(r) ? r : []; }
      });
    }
    this.tenantService.loadTenant().subscribe(tenant => this.branding = tenant);
  }

  print() {
    if (!this.admission) return;
    const url = this.admission.status === 'Discharged' 
      ? `/ipd/admissions/discharge-print/${this.admission.id}`
      : `/ipd/admissions/print/${this.admission.id}`;
    window.open(url, '_blank');
  }

  deleteAdmission() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Admission', message: `Are you sure you want to delete admission ${this.admission.admissionNumber}? This action cannot be undone.`, confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete('v1/admissions', this.admission.id).subscribe({
          next: () => { this.notification.success('Admission deleted'); this.router.navigate(['/ipd/admissions']); }
        });
      }
    });
  }
}