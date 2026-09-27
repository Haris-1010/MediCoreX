import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService, Tenant, Branding } from '../../../core/services/tenant.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

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
  `,
  styles: [`
    .discharge-layout { display: grid; grid-template-columns: 380px 1fr; gap: 1.5rem; }
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    .card h3 { margin: 0 0 1rem; display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; color: var(--text-primary, #333); }
    .card h3 mat-icon { font-size: 20px; width: 20px; height: 20px; color: var(--accent-primary, #3f51b5); }

    .summary-card .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color, #f0f0f0); }
    .summary-card .info-row span { color: var(--text-muted, #888); font-size: 0.85rem; }
    .summary-card .info-row strong { color: var(--text-primary, #333); }
    .mono { font-family: monospace; font-size: 0.8rem; }

    .full-w { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
  `]
})
export class DischargeComponent implements OnInit {
  admission: any;
  form!: FormGroup;
  saving = false;
  branding: Branding | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService,
    private tenantService: TenantService,
    private dialog: MatDialog
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
    this.tenantService.loadBranding().subscribe(branding => this.branding = branding);
  }

  print() {
    if (!this.admission) return;
    const url = `/ipd/admissions/discharge-print/${this.admission.id}`;
    window.open(url, '_blank');
  }

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