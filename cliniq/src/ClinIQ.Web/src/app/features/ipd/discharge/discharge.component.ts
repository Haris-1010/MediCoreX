import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService, Tenant } from '../../../core/services/tenant.service';

@Component({
  standalone: false,
  selector: 'app-discharge',
  template: `
    <app-main-layout>
      <app-page-header title="Discharge Patient" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Admissions', route: '/ipd/admissions' }, { label: 'Discharge' }]">
        <button mat-stroked-button (click)="print()"><mat-icon>print</mat-icon> Print Summary</button>
      </app-page-header>

      <div class="discharge-layout" *ngIf="admission">
        <!-- Summary Card -->
        <div class="card summary-card">
          <h3><mat-icon>info</mat-icon> Admission Summary</h3>
          <div class="info-row"><span>Patient</span><strong>{{ admission.patientName }}</strong></div>
          <div class="info-row"><span>MRN</span><strong>{{ admission.mrn }}</strong></div>
          <div class="info-row"><span>Admission #</span><strong>{{ admission.admissionNumber }}</strong></div>
          <div class="info-row"><span>Doctor</span><strong>Dr. {{ admission.doctorName }}</strong></div>
          <div class="info-row"><span>Ward / Bed</span><strong>{{ admission.wardName }} / {{ admission.bedNumber }}</strong></div>
          <div class="info-row"><span>Admitted</span><strong>{{ admission.admissionDate | date:'medium' }}</strong></div>
          <div class="info-row"><span>Days</span><strong>{{ admission.daysAdmitted }} days</strong></div>
          <div class="info-row"><span>Reason</span><strong>{{ admission.admissionReason || '-' }}</strong></div>
          <div class="info-row"><span>Provisional Dx</span><strong>{{ admission.provisionalDiagnosis || '-' }}</strong></div>
        </div>

        <!-- Discharge Form -->
        <div class="card form-card">
          <h3><mat-icon>logout</mat-icon> Discharge Details</h3>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" class="full-w">
              <mat-label>Discharge Type *</mat-label>
              <mat-select formControlName="dischargeType">
                <mat-option value="Normal">Normal</mat-option>
                <mat-option value="LAMA">LAMA (Left Against Medical Advice)</mat-option>
                <mat-option value="Absconded">Absconded</mat-option>
                <mat-option value="Expired">Expired</mat-option>
                <mat-option value="Transfer">Transfer</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-w">
              <mat-label>Final Diagnosis *</mat-label>
              <textarea matInput formControlName="finalDiagnosis" rows="3" placeholder="Final diagnosis after examination..."></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-w">
              <mat-label>Discharge Summary *</mat-label>
              <textarea matInput formControlName="dischargeSummary" rows="4" placeholder="Summary of treatment, procedures, findings..."></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-w">
              <mat-label>Discharge Medications</mat-label>
              <textarea matInput formControlName="dischargeMedications" rows="3" placeholder="Medications prescribed at discharge..."></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-w">
              <mat-label>Follow-up Instructions</mat-label>
              <textarea matInput formControlName="followUpInstructions" rows="3" placeholder="Follow-up date, activities, diet..."></textarea>
            </mat-form-field>

            <div class="form-actions">
              <button mat-stroked-button type="button" routerLink="/ipd/admissions">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">
                <mat-icon>check</mat-icon> {{ saving ? 'Processing...' : 'Discharge Patient' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </app-main-layout>

    <!-- Print Discharge Summary -->
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
            <h1>Discharge Summary</h1>
            <p>Admission # {{ admission.admissionNumber }}</p>
          </div>
        </div>

        <!-- Patient Info -->
        <section>
          <h3>Patient Information</h3>
          <div class="grid">
            <div class="field"><label>Patient Name</label><span>{{ admission.patientName }}</span></div>
            <div class="field"><label>MRN</label><span>{{ admission.mrn }}</span></div>
          </div>
        </section>

        <!-- Admission Info -->
        <section>
          <h3>Admission Details</h3>
          <div class="grid">
            <div class="field"><label>Admission Number</label><span>{{ admission.admissionNumber }}</span></div>
            <div class="field"><label>Attending Doctor</label><span>Dr. {{ admission.doctorName }}</span></div>
            <div class="field"><label>Ward / Room / Bed</label><span>{{ admission.wardName }} / {{ admission.roomNumber }} / {{ admission.bedNumber }}</span></div>
            <div class="field"><label>Admission Date</label><span>{{ admission.admissionDate | date:'dd MMM yyyy, h:mm a' }}</span></div>
            <div class="field"><label>Discharge Date</label><span>{{ admission.dischargeDate | date:'dd MMM yyyy, h:mm a' }}</span></div>
            <div class="field"><label>Duration</label><span>{{ admission.daysAdmitted }} days</span></div>
          </div>
        </section>

        <!-- Clinical -->
        <section>
          <h3>Clinical Information</h3>
          <div class="grid">
            <div class="field list-field"><label>Admission Reason</label><span>{{ admission.admissionReason || '-' }}</span></div>
            <div class="field list-field"><label>Provisional Diagnosis</label><span>{{ admission.provisionalDiagnosis || '-' }}</span></div>
          </div>
        </section>

        <!-- Discharge Details -->
        <section>
          <h3>Discharge Information</h3>
          <div class="grid">
            <div class="field"><label>Discharge Type</label><span class="chip">{{ form.value.dischargeType }}</span></div>
          </div>
          <div class="grid" style="margin-top: 10px;">
            <div class="field list-field"><label>Final Diagnosis</label><span>{{ form.value.finalDiagnosis || '-' }}</span></div>
            <div class="field list-field"><label>Discharge Summary</label><span>{{ form.value.dischargeSummary || '-' }}</span></div>
            <div class="field list-field" *ngIf="form.value.dischargeMedications"><label>Discharge Medications</label><span>{{ form.value.dischargeMedications }}</span></div>
            <div class="field list-field" *ngIf="form.value.followUpInstructions"><label>Follow-up Instructions</label><span>{{ form.value.followUpInstructions }}</span></div>
          </div>
        </section>

        <!-- Signatures -->
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

        <div class="foot">
          <span>{{ branding?.name || 'Hospital' }} \u2022 Discharge Summary</span>
          <span>Printed {{ today | date:'dd MMM yyyy, h:mm a' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .discharge-layout { display: grid; grid-template-columns: 380px 1fr; gap: 1.5rem; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; }
    .card h3 { margin: 0 0 1rem; display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; color: #333; }
    .card h3 mat-icon { font-size: 20px; width: 20px; height: 20px; color: #3f51b5; }

    .summary-card .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0; }
    .summary-card .info-row span { color: #888; font-size: 0.85rem; }
    .summary-card .info-row strong { color: #333; }
    .mono { font-family: monospace; font-size: 0.8rem; }

    .full-w { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }

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
export class DischargeComponent implements OnInit {
  admission: any;
  form!: FormGroup;
  saving = false;
  branding: Tenant | null = null;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService,
    private tenantService: TenantService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      dischargeType: ['Normal', Validators.required],
      finalDiagnosis: ['', Validators.required],
      dischargeSummary: ['', Validators.required],
      dischargeMedications: [''],
      followUpInstructions: ['']
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.api.getById<any>('v1/admissions', id).subscribe(r => this.admission = r);
    this.tenantService.loadTenant().subscribe(tenant => this.branding = tenant);
  }

  print() { window.print(); }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.value;
    const payload = {
      finalDiagnosis: v.finalDiagnosis,
      dischargeSummary: v.dischargeSummary,
      followUpInstructions: v.followUpInstructions,
      dischargeMedications: v.dischargeMedications
    };
    this.api.post(`v1/admissions/${this.admission.id}/discharge`, payload).subscribe({
      next: () => { this.notification.success('Patient discharged successfully'); this.router.navigate(['/ipd/admissions']); },
      error: () => this.saving = false
    });
  }
}
