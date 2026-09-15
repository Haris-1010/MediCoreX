import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-admission-form',
  template: `
    <app-main-layout>
      <app-page-header title="New Admission" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Admit' }]"></app-page-header>
      <div class="card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <h3>Patient Information</h3>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Search Patient</mat-label>
            <input matInput [matAutocomplete]="patientAuto" formControlName="patientSearch">
            <mat-autocomplete #patientAuto="matAutocomplete" [displayWith]="displayPatient" (optionSelected)="onPatientSelected($event)">
              <mat-option *ngFor="let p of filteredPatients" [value]="p">{{ p.fullName }} ({{ p.mrn }})</mat-option>
            </mat-autocomplete>
          </mat-form-field>

          <h3>Admission Details</h3>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Admission Type</mat-label>
              <mat-select formControlName="admissionType"><mat-option value="Planned">Planned</mat-option><mat-option value="Emergency">Emergency</mat-option><mat-option value="Transfer">Transfer</mat-option><mat-option value="Referral">Referral</mat-option></mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Attending Doctor</mat-label>
              <mat-select formControlName="doctorId"><mat-option *ngFor="let d of doctors" [value]="d.id">Dr. {{ d.fullName }}</mat-option></mat-select>
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
  styles: [`.card { background: white; padding: 1.5rem; border-radius: 8px; } h3 { margin: 1.5rem 0 1rem; } h3:first-child { margin-top: 0; }
    .form-row { display: flex; gap: 1rem; } .form-row mat-form-field { flex: 1; } .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }`]
})
export class AdmissionFormComponent implements OnInit {
  form!: FormGroup; saving = false;
  filteredPatients: any[] = []; doctors: any[] = []; wards: any[] = []; availableBeds: any[] = [];

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private notification: NotificationService) {}

  ngOnInit() {
    this.form = this.fb.group({
      patientId: ['', Validators.required], patientSearch: [''], admissionType: ['Planned', Validators.required],
      doctorId: ['', Validators.required], wardId: ['', Validators.required], bedId: ['', Validators.required],
      admissionReason: ['', Validators.required], provisionalDiagnosis: ['']
    });
    this.api.get<any>('v1/doctors').subscribe(r => {
      this.doctors = r.items || r;
    });
    this.api.get<any>('v1/wards').subscribe(r => {
      this.wards = Array.isArray(r) ? r : [];
    });
    this.form.get('patientSearch')?.valueChanges.subscribe(val => {
      if (typeof val === 'string' && val.length >= 2) this.api.get<any>('v1/patients/search', { term: val }).subscribe(r => this.filteredPatients = Array.isArray(r) ? r : []);
    });
  }

  displayPatient(p: any): string { return p ? `${p.fullName} (${p.mrn})` : ''; }
  onPatientSelected(e: any) { this.form.patchValue({ patientId: e.option.value.id }); }
  loadBeds() { const wardId = this.form.value.wardId; if (wardId) this.api.get<any[]>(`v1/wards/${wardId}/available-beds`).subscribe(r => this.availableBeds = r); }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.value;
    const payload = {
      patientId: v.patientId,
      doctorId: v.doctorId,
      admissionType: v.admissionType,
      wardId: v.wardId || null,
      bedId: v.bedId || null,
      admissionReason: v.admissionReason,
      provisionalDiagnosis: v.provisionalDiagnosis || null
    };
    this.api.post('v1/admissions', payload).subscribe({
      next: () => { this.notification.success('Patient admitted successfully'); this.router.navigate(['/ipd/admissions']); },
      error: () => this.saving = false
    });
  }
}
