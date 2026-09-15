import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService, Tenant } from '../../../core/services/tenant.service';

@Component({
  standalone: false,
  selector: 'app-admission-detail',
  template: `
    <app-main-layout>
      <app-page-header [title]="'Admission ' + (admission?.admissionNumber || '')" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Admissions', route: '/ipd/admissions' }, { label: admission?.admissionNumber || '' }]">
        <button mat-stroked-button (click)="print()"><mat-icon>print</mat-icon> Print</button>
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

    <!-- Print Admission Slip -->
    <div class="print-only" *ngIf="admission">
      <div class="print-sheet">
        <!-- Header -->
        <div class="sheet-head">
          <div class="brand">
            <div class="brand-line">
              <img *ngIf="branding?.logoUrl" [src]="branding?.logoUrl" alt="logo" class="brand-logo">
              <span>{{ branding?.name || 'Hospital' }}</span>
            </div>
            <small *ngIf="branding?.website || branding?.phone">{{ branding?.website || '' }}{{ (branding?.website && branding?.phone) ? ' \u2022 ' : '' }}{{ branding?.phone || '' }}</small>
            <small *ngIf="branding?.address">{{ branding?.address }}</small>
          </div>
          <div class="doc-title">
            <h1>Admission Slip</h1>
            <p>Admission # {{ admission.admissionNumber }}</p>
          </div>
        </div>

        <!-- Patient & Admission Grid -->
        <section>
          <h3>Patient Information</h3>
          <div class="grid">
            <div class="field"><label>Patient Name</label><span>{{ admission.patientName }}</span></div>
            <div class="field"><label>MRN</label><span>{{ admission.mrn }}</span></div>
          </div>
        </section>

        <section>
          <h3>Admission Details</h3>
          <div class="grid">
            <div class="field"><label>Admission Number</label><span>{{ admission.admissionNumber }}</span></div>
            <div class="field"><label>Status</label><span class="chip">{{ admission.status }}</span></div>
            <div class="field"><label>Type</label><span>{{ admission.type }}</span></div>
            <div class="field"><label>Admission Date</label><span>{{ admission.admissionDate | date:'dd MMM yyyy, h:mm a' }}</span></div>
            <div class="field"><label>Days Admitted</label><span>{{ admission.daysAdmitted }} days</span></div>
            <div class="field"><label>Attending Doctor</label><span>Dr. {{ admission.doctorName }}</span></div>
          </div>
        </section>

        <section>
          <h3>Location</h3>
          <div class="grid">
            <div class="field"><label>Ward</label><span>{{ admission.wardName || '-' }}</span></div>
            <div class="field"><label>Room</label><span>{{ admission.roomNumber || '-' }}</span></div>
            <div class="field"><label>Bed</label><span>{{ admission.bedNumber || '-' }}</span></div>
          </div>
        </section>

        <section>
          <h3>Clinical Information</h3>
          <div class="grid">
            <div class="field list-field"><label>Admission Reason</label><span>{{ admission.admissionReason || '-' }}</span></div>
            <div class="field list-field"><label>Provisional Diagnosis</label><span>{{ admission.provisionalDiagnosis || '-' }}</span></div>
            <div class="field list-field" *ngIf="admission.finalDiagnosis"><label>Final Diagnosis</label><span>{{ admission.finalDiagnosis }}</span></div>
            <div class="field list-field" *ngIf="admission.notes"><label>Notes</label><span>{{ admission.notes }}</span></div>
          </div>
        </section>

        <!-- Bed Allocation History -->
        <section *ngIf="allocationHistory.length > 0">
          <h3>Bed Allocation History</h3>
          <table class="print-table">
            <thead>
              <tr><th>Bed</th><th>Ward</th><th>Allocated</th><th>Released</th><th>Duration</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let h of allocationHistory">
                <td>{{ h.bed }}</td><td>{{ h.ward }}</td>
                <td>{{ h.allocatedAt | date:'dd MMM yyyy, h:mm a' }}</td>
                <td>{{ h.releasedAt ? (h.releasedAt | date:'dd MMM yyyy, h:mm a') : 'Current' }}</td>
                <td>{{ h.duration }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- Signatures -->
        <div class="signatures">
          <div class="sig-block">
            <div class="sig-line"></div>
            <p>Patient / Guardian Signature</p>
          </div>
          <div class="sig-block">
            <div class="sig-line"></div>
            <p>Attending Doctor Signature</p>
          </div>
          <div class="sig-block">
            <div class="sig-line"></div>
            <p>Authorized Signature</p>
          </div>
        </div>

        <div class="foot">
          <span>{{ branding?.name || 'Hospital' }} \u2022 Admission Record</span>
          <span>Printed {{ today | date:'dd MMM yyyy, h:mm a' }}</span>
        </div>
      </div>
    </div>
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

    /* Print Styles */
    .print-only { display: none; }
    .print-sheet { max-width: 820px; margin: 0 auto; padding: 28px 36px; font-family: 'Segoe UI', Arial, sans-serif; color: #111; }
    .sheet-head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #102b35; padding-bottom: 14px; margin-bottom: 18px; }
    .brand .brand-line { display: flex; align-items: center; gap: 8px; }
    .brand .brand-logo { max-width: 40px; max-height: 40px; border-radius: 6px; object-fit: contain; }
    .brand span { font-size: 20px; font-weight: 800; color: #102b35; }
    .brand small { display: block; font-size: 11px; color: #64748b; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; }
    .doc-title { text-align: right; }
    .doc-title h1 { margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: .04em; color: #102b35; }
    .doc-title p { margin: 2px 0 0; font-size: 11px; color: #64748b; }

    section { margin-bottom: 16px; }
    section h3 { font-size: 13px; text-transform: uppercase; letter-spacing: .06em; color: #102b35; border-bottom: 1px solid #dce5e5; padding-bottom: 6px; margin: 0 0 10px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 20px; }
    .field label { display: block; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: .04em; }
    .field span { font-size: 13px; font-weight: 600; }
    .field .mono { font-family: monospace; font-size: 12px; }
    .list-field { grid-column: 1 / -1; }
    .chip { display: inline-block; padding: 2px 10px; border-radius: 999px; background: #eef5f5; color: #164b4f; font-weight: 600; font-size: 12px; }

    .print-table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .print-table th { background: #f1f5f9; padding: 6px 10px; text-align: left; font-size: 10px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #dce5e5; }
    .print-table td { padding: 6px 10px; border-bottom: 1px solid #eef2f2; }

    .signatures { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; }
    .sig-block { text-align: center; width: 28%; }
    .sig-line { border-top: 1px solid #333; margin-bottom: 6px; }
    .sig-block p { font-size: 10px; color: #64748b; margin: 0; text-transform: uppercase; letter-spacing: .04em; }

    .foot { margin-top: 20px; border-top: 1px solid #dce5e5; padding-top: 10px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }

    @media print {
      .print-only { display: block !important; position: fixed; top: 0; left: 0; width: 100%; background: white; z-index: 9999; }
      app-main-layout { display: none !important; }
      .print-sheet { max-width: none; padding: 0; }
      :host { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  `]
})
export class AdmissionDetailComponent implements OnInit {
  admission: any = null;
  allocationHistory: any[] = [];
  historyColumns = ['bed', 'ward', 'allocatedAt', 'releasedAt', 'duration'];
  branding: Tenant | null = null;
  today = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private notification: NotificationService,
    private tenantService: TenantService
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

  print() { window.print(); }

  deleteAdmission() {
    if (!confirm(`Delete admission ${this.admission.admissionNumber}?`)) return;
    this.api.delete('v1/admissions', this.admission.id).subscribe({
      next: () => { this.notification.success('Admission deleted'); this.router.navigate(['/ipd/admissions']); }
    });
  }
}
