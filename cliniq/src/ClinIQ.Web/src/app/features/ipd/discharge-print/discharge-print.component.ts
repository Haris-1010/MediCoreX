import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../core/services/api.service';
import { TenantService, Branding } from '../../../core/services/tenant.service';
import { PrintBrandHeaderComponent } from '../../../shared/components/print-brand-header/print-brand-header.component';

@Component({
  standalone: true,
  selector: 'app-discharge-print-page',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, PrintBrandHeaderComponent],
  template: `
    <div class="print-container" *ngIf="admission">
      <app-print-brand-header
        [logoUrl]="branding?.logoUrl || null"
        [orgName]="branding?.name || null"
        [phone]="branding?.phone || null"
        [address]="branding?.address || null">
      </app-print-brand-header>

      <div class="doc-header">
        <div class="doc-title">
          <h1>Discharge Summary</h1>
          <p class="doc-number">{{ admission.admissionNumber }}</p>
        </div>
        <div class="doc-meta">
          <p><strong>Date:</strong> {{ today | date:'mediumDate' }}</p>
          <p><strong>Time:</strong> {{ today | date:'shortTime' }}</p>
        </div>
      </div>

      <div class="patient-info">
        <div class="info-row">
          <span class="label">Patient:</span>
          <span class="value">{{ admission.patientName }}</span>
        </div>
        <div class="info-row">
          <span class="label">MRN:</span>
          <span class="value">{{ admission.mrn }}</span>
        </div>
      </div>

      <div class="details-grid">
        <div class="detail-section">
          <h3>Admission Details</h3>
          <div class="info-row">
            <span class="label">Admission #:</span>
            <span class="value">{{ admission.admissionNumber }}</span>
          </div>
          <div class="info-row">
            <span class="label">Attending Doctor:</span>
            <span class="value">Dr. {{ admission.doctorName }}</span>
          </div>
          <div class="info-row">
            <span class="label">Ward / Room / Bed:</span>
            <span class="value">{{ admission.wardName }} / {{ admission.roomNumber || '-' }} / {{ admission.bedNumber }}</span>
          </div>
          <div class="info-row">
            <span class="label">Admission Date:</span>
            <span class="value">{{ admission.admissionDate | date:'dd MMM yyyy, h:mm a' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Discharge Date:</span>
            <span class="value">{{ admission.dischargeDate | date:'dd MMM yyyy, h:mm a' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Duration:</span>
            <span class="value">{{ admission.daysAdmitted }} days</span>
          </div>
        </div>

        <div class="detail-section">
          <h3>Clinical Information</h3>
          <div class="info-row full">
            <span class="label">Admission Reason:</span>
            <span class="value">{{ admission.admissionReason || '-' }}</span>
          </div>
          <div class="info-row full">
            <span class="label">Provisional Diagnosis:</span>
            <span class="value">{{ admission.provisionalDiagnosis || '-' }}</span>
          </div>
          <div class="info-row full">
            <span class="label">Final Diagnosis:</span>
            <span class="value">{{ admission.finalDiagnosis || '-' }}</span>
          </div>
        </div>
      </div>

      <div class="discharge-section">
        <h3>Discharge Information</h3>
        <div class="info-row">
          <span class="label">Discharge Type:</span>
          <span class="value chip">{{ admission.dischargeType }}</span>
        </div>
        <div class="info-row full">
          <span class="label">Discharge Summary:</span>
          <span class="value">{{ admission.dischargeSummary || '-' }}</span>
        </div>
        <div class="info-row full" *ngIf="admission.dischargeMedications">
          <span class="label">Discharge Medications:</span>
          <span class="value">{{ admission.dischargeMedications }}</span>
        </div>
        <div class="info-row full" *ngIf="admission.followUpInstructions">
          <span class="label">Follow-up Instructions:</span>
          <span class="value">{{ admission.followUpInstructions }}</span>
        </div>
      </div>

      <div class="signatures">
        <div class="sig-block">
          <div class="sig-line"></div>
          <p>Patient / Guardian Signature</p>
        </div>
        <div class="sig-block">
          <div class="sig-line"></div>
          <p>Treating Doctor Signature</p>
        </div>
        <div class="sig-block">
          <div class="sig-line"></div>
          <p>Authorized Signature</p>
        </div>
      </div>

      <div class="footer">
        <span>{{ branding?.name || 'Hospital' }} \u2022 Discharge Summary</span>
        <span>Printed {{ today | date:'dd MMM yyyy, h:mm a' }}</span>
      </div>

      <div class="print-actions no-print">
        <button mat-raised-button color="primary" (click)="print()">
          <mat-icon>print</mat-icon> Print Discharge Summary
        </button>
      </div>
    </div>

    <div *ngIf="!admission" class="loading-container">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
  `,
  styles: [`
    .print-container { max-width: 800px; margin: 0 auto; padding: 2rem; background: white; min-height: 100vh; }
    .doc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; border-bottom: 2px solid #1a237e; padding-bottom: 1rem; }
    .doc-title h1 { margin: 0; color: #1a237e; font-size: 1.5rem; text-transform: uppercase; letter-spacing: 1px; }
    .doc-number { margin: 4px 0 0; color: #666; font-size: 0.9rem; }
    .doc-meta p { margin: 4px 0; font-size: 0.85rem; text-align: right; }
    .patient-info { background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; }
    .info-row { display: flex; gap: 0.5rem; margin-bottom: 0.25rem; font-size: 0.9rem; }
    .info-row.full { flex-direction: column; gap: 0.25rem; }
    .info-row .label { font-weight: 600; min-width: 150px; color: #555; }
    .chip { display: inline-block; padding: 2px 8px; border-radius: 999px; background: #e8eaf6; color: #1a237e; font-weight: 600; font-size: 0.85rem; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1.5rem; }
    .detail-section h3 { margin: 0 0 0.75rem; color: #1a237e; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #c5cae9; padding-bottom: 0.5rem; }
    .discharge-section { margin-bottom: 2rem; }
    .discharge-section h3 { margin: 0 0 0.75rem; color: #1a237e; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #c5cae9; padding-bottom: 0.5rem; }
    .signatures { display: flex; justify-content: space-between; margin-top: 3rem; padding-top: 2rem; }
    .sig-block { text-align: center; width: 30%; }
    .sig-line { width: 100%; border-top: 1px solid #333; margin-bottom: 0.5rem; }
    .sig-block p { margin: 0; font-size: 0.8rem; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
    .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #c5cae9; display: flex; justify-content: space-between; font-size: 0.8rem; color: #666; }
    .print-actions { text-align: center; margin-top: 2rem; }
    .loading-container { display: flex; justify-content: center; padding: 4rem; }
    @media print {
      .no-print { display: none !important; }
      .print-container { padding: 0; max-width: none; }
    }
  `]
})
export class DischargePrintPageComponent implements OnInit {
  admission: any = null;
  branding: Branding | null = null;
  today = new Date();

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private tenantService: TenantService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.get<any>(`v1/admissions/${id}`).subscribe({
        next: (data) => this.admission = data,
        error: () => {}
      });
    }
    this.tenantService.loadBranding().subscribe(branding => this.branding = branding);
  }

  print() { window.print(); }
}