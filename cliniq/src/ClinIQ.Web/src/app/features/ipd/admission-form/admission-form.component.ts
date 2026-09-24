import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PatientPickerComponent, PatientPickerValue } from '../../../shared/components/patient-picker/patient-picker.component';

@Component({
  standalone: false,
  selector: 'app-admission-form',
  template: `
    <app-main-layout>
      <app-page-header title="New Admission" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Admit' }]"></app-page-header>
      <div class="card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <h3>Patient Information</h3>
          <app-patient-picker
            #patientPicker
            label="Patient"
            [required]="true"
            (patientChange)="onPatientChange($event)">
          </app-patient-picker>

          <h3>Admission Details</h3>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Admission Type</mat-label>
              <mat-select formControlName="admissionType"><mat-option value="Planned">Planned</mat-option><mat-option value="Emergency">Emergency</mat-option><mat-option value="Transfer">Transfer</mat-option><mat-option value="Referral">Referral</mat-option></mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Attending Doctor</mat-label>
              <input matInput [matAutocomplete]="doctorAuto" formControlName="doctorSearch"
                     placeholder="Search doctor by name..." (focus)="onDoctorFocus()" (input)="onDoctorInput($event)">
              <mat-icon matPrefix>search</mat-icon>
              <mat-autocomplete #doctorAuto="matAutocomplete" [displayWith]="displayDoctor" (optionSelected)="onDoctorSelected($event)">
                <mat-option *ngFor="let d of filteredDoctors" [value]="d">
                  <div class="doctor-option-item">
                    <span class="name">Dr. {{ d.fullName }}<span *ngIf="d.specialization"> - ({{ d.specialization }})</span></span>
                  </div>
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>
          </div>

          <h3>Bed Allocation</h3>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Ward</mat-label>
              <mat-select formControlName="wardId" (selectionChange)="loadBeds()"><mat-option *ngFor="let w of wards" [value]="w.id">{{ w.name }}</mat-option></mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Bed</mat-label>
              <mat-select formControlName="bedId"><mat-option *ngFor="let b of availableBeds" [value]="b.id">{{ b.bedNumber }} - {{ b.bedType }}</mat-option></mat-select>
            </mat-form-field>
          </div>

          <h3>Payment</h3>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Deposit Amount</mat-label>
              <input matInput type="number" formControlName="depositAmount" min="0" placeholder="0">
              <span matPrefix>PKR&nbsp;</span>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width"><mat-label>Reason for Admission</mat-label><textarea matInput formControlName="admissionReason" rows="3"></textarea></mat-form-field>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Provisional Diagnosis</mat-label><input matInput formControlName="provisionalDiagnosis"></mat-form-field>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/ipd">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : 'Admit Patient' }}</button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; } h3 { margin: 1.5rem 0 1rem; } h3:first-child { margin-top: 0; }
    .form-row { display: flex; gap: 1rem; } .form-row mat-form-field { flex: 1; } .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
    :host ::ng-deep .doctor-option-item { display: flex; flex-direction: column; padding: 4px 0; }
    :host ::ng-deep .doctor-option-item .name { font-weight: 500; }
    :host ::ng-deep .doctor-option-item .details { font-size: 0.75rem; color: var(--text-muted, #888); }
    :host ::ng-deep .mat-mdc-autocomplete-panel { max-height: 300px !important; border-radius: 8px !important; border: 1px solid var(--border-color, #c5cae9) !important; box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option { padding: 10px 16px !important; line-height: 1.4 !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option:hover { background-color: var(--bg-hover, #e8eaf6) !important; }`]
})
export class AdmissionFormComponent implements OnInit {
  @ViewChild('patientPicker') patientPicker!: PatientPickerComponent;

  form!: FormGroup; saving = false;
  filteredDoctors: any[] = [];
  allDoctors: any[] = [];
  doctors: any[] = []; wards: any[] = []; availableBeds: any[] = [];

  private doctorsLoaded = false;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private notification: NotificationService) {}

  ngOnInit() {
    this.form = this.fb.group({
      patientId: [''], admissionType: ['Planned', Validators.required],
      doctorId: ['', Validators.required], doctorSearch: [''], wardId: ['', Validators.required], bedId: ['', Validators.required],
      admissionReason: ['', Validators.required], provisionalDiagnosis: [''], depositAmount: [0]
    });
    this.api.get<any>('v1/wards').subscribe(r => {
      this.wards = Array.isArray(r) ? r : [];
    });
  }

  onPatientChange(patient: PatientPickerValue | null) {
    this.form.patchValue({ patientId: patient?.id || '' });
  }

  onDoctorFocus() {
    if (!this.doctorsLoaded) {
      this.api.get<any>('v1/doctors').subscribe(r => {
        this.allDoctors = Array.isArray(r) ? r : (r.items || []);
        this.doctors = [...this.allDoctors];
        this.filteredDoctors = [...this.allDoctors];
        this.doctorsLoaded = true;
      });
    } else {
      this.filteredDoctors = [...this.allDoctors];
    }
  }

  onDoctorInput(event: Event) {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredDoctors = this.allDoctors.filter(d =>
      d.fullName?.toLowerCase().includes(term) || d.specialization?.toLowerCase().includes(term)
    );
  }

  displayDoctor(d: any): string {
    if (!d) return '';
    if (typeof d === 'string') return d;
    const spec = d.specialization ? ` - (${d.specialization})` : '';
    return `Dr. ${d.fullName || ''}${spec}`;
  }

  onDoctorSelected(e: any) {
    const doctor = e.option.value;
    this.form.patchValue({ doctorId: doctor.id, doctorSearch: this.displayDoctor(doctor) });
  }

  loadBeds() { const wardId = this.form.value.wardId; if (wardId) this.api.get<any[]>(`v1/wards/${wardId}/available-beds`).subscribe(r => this.availableBeds = r); }

  async submit() {
    if (this.saving) return;
    const patient = await this.patientPicker?.ensurePatient();
    if (patient) this.form.patchValue({ patientId: patient.id });
    if (this.form.invalid) {
      if (!this.form.value.patientId) this.notification.error('Please select or create a patient');
      return;
    }
    this.saving = true;
    const v = this.form.value;
    const payload = {
      patientId: v.patientId,
      doctorId: v.doctorId,
      admissionType: v.admissionType,
      wardId: v.wardId || null,
      bedId: v.bedId || null,
      admissionReason: v.admissionReason,
      provisionalDiagnosis: v.provisionalDiagnosis || null,
      depositAmount: v.depositAmount || 0
    };
    this.api.post('v1/admissions', payload).subscribe({
      next: () => { this.notification.success('Patient admitted successfully'); this.router.navigate(['/ipd/admissions']); },
      error: () => this.saving = false
    });
  }
}
