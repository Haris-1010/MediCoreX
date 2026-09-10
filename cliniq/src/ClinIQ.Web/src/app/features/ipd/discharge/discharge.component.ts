import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-discharge',
  template: `
    <app-main-layout>
      <app-page-header title="Discharge Patient" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Discharge' }]"></app-page-header>
      <div class="discharge-grid" *ngIf="admission">
        <div class="card summary">
          <h3>Admission Summary</h3>
          <div class="info-row"><span>Patient:</span><strong>{{ admission.patientName }}</strong></div>
          <div class="info-row"><span>MRN:</span><strong>{{ admission.mrn }}</strong></div>
          <div class="info-row"><span>Admission #:</span><strong>{{ admission.admissionNumber }}</strong></div>
          <div class="info-row"><span>Admitted:</span><strong>{{ admission.admissionDate | date:'mediumDate' }}</strong></div>
          <div class="info-row"><span>Ward/Bed:</span><strong>{{ admission.wardName }} - {{ admission.bedNumber }}</strong></div>
          <div class="info-row"><span>Doctor:</span><strong>Dr. {{ admission.doctorName }}</strong></div>
          <div class="info-row"><span>Duration:</span><strong>{{ admission.daysAdmitted }} days</strong></div>
        </div>
        <div class="card form">
          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" class="full-width"><mat-label>Discharge Type</mat-label>
              <mat-select formControlName="dischargeType"><mat-option value="Normal">Normal</mat-option><mat-option value="LAMA">LAMA</mat-option><mat-option value="Absconded">Absconded</mat-option><mat-option value="Expired">Expired</mat-option><mat-option value="Transfer">Transfer</mat-option></mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Final Diagnosis</mat-label><textarea matInput formControlName="finalDiagnosis" rows="3"></textarea></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Discharge Summary</mat-label><textarea matInput formControlName="dischargeSummary" rows="4"></textarea></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Follow-up Instructions</mat-label><textarea matInput formControlName="followUpInstructions" rows="3"></textarea></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Medications at Discharge</mat-label><textarea matInput formControlName="dischargeMedications" rows="3"></textarea></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Follow-up Date</mat-label><input matInput [matDatepicker]="picker" formControlName="followUpDate"><mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle><mat-datepicker #picker></mat-datepicker></mat-form-field>

            <div class="billing-summary">
              <h4>Billing Summary</h4>
              <div class="billing-row"><span>Room Charges:</span><span>{{ admission.roomCharges | currency }}</span></div>
              <div class="billing-row"><span>Doctor Fees:</span><span>{{ admission.doctorFees | currency }}</span></div>
              <div class="billing-row"><span>Lab Charges:</span><span>{{ admission.labCharges | currency }}</span></div>
              <div class="billing-row"><span>Pharmacy:</span><span>{{ admission.pharmacyCharges | currency }}</span></div>
              <div class="billing-row total"><span>Total:</span><span>{{ admission.totalAmount | currency }}</span></div>
              <div class="billing-row"><span>Paid:</span><span>{{ admission.paidAmount | currency }}</span></div>
              <div class="billing-row balance"><span>Balance:</span><span>{{ admission.balanceAmount | currency }}</span></div>
            </div>

            <div class="form-actions">
              <button mat-stroked-button type="button" routerLink="/ipd/admissions">Cancel</button>
              <button mat-stroked-button type="button" (click)="printSummary()"><mat-icon>print</mat-icon> Print Summary</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">{{ saving ? 'Processing...' : 'Discharge Patient' }}</button>
            </div>
          </form>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`.discharge-grid { display: grid; grid-template-columns: 350px 1fr; gap: 1.5rem; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }
    .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee; } .info-row span { color: #666; }
    .full-width { width: 100%; }
    .billing-summary { background: #f5f5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
    .billing-summary h4 { margin: 0 0 0.5rem; }
    .billing-row { display: flex; justify-content: space-between; padding: 0.25rem 0; }
    .billing-row.total { border-top: 1px solid #ccc; padding-top: 0.5rem; margin-top: 0.5rem; font-weight: 600; }
    .billing-row.balance { color: #f44336; font-weight: 600; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }`]
})
export class DischargeComponent implements OnInit {
  admission: any; form!: FormGroup; saving = false;

  constructor(private fb: FormBuilder, private api: ApiService, private route: ActivatedRoute, private router: Router, private notification: NotificationService) {}

  ngOnInit() {
    this.form = this.fb.group({
      dischargeType: ['Normal', Validators.required], finalDiagnosis: ['', Validators.required],
      dischargeSummary: ['', Validators.required], followUpInstructions: [''], dischargeMedications: [''], followUpDate: ['']
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.api.getById<any>('v1/admissions', id).subscribe(r => this.admission = r);
  }

  printSummary() { window.print(); }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;
    this.api.post(`v1/admissions/${this.admission.id}/discharge`, this.form.value).subscribe({
      next: () => { this.notification.success('Patient discharged successfully'); this.router.navigate(['/ipd/admissions']); },
      error: () => this.saving = false
    });
  }
}
