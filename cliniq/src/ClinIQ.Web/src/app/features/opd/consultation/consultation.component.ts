import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-consultation',
  template: `
    <app-main-layout>
      <app-page-header title="Consultation" [breadcrumbs]="[{ label: 'OPD', route: '/opd' }, { label: 'Consultation' }]">
        <button mat-stroked-button (click)="viewHistory()"><mat-icon>history</mat-icon> History</button>
      </app-page-header>

      <div class="consultation-grid" *ngIf="patient">
        <div class="card patient-summary">
          <div class="patient-header">
            <div class="avatar">{{ patient.initials }}</div>
            <div><h2>{{ patient.fullName }}</h2><p>{{ patient.age }} yrs, {{ patient.gender }} | Blood: {{ patient.bloodGroup }}</p></div>
          </div>
          <mat-divider></mat-divider>
          <div class="vitals" *ngIf="vitals">
            <div class="vital"><span>BP</span><strong>{{ vitals.bloodPressure }}</strong></div>
            <div class="vital"><span>Pulse</span><strong>{{ vitals.pulse }} bpm</strong></div>
            <div class="vital"><span>Temp</span><strong>{{ vitals.temperature }}°F</strong></div>
            <div class="vital"><span>SpO2</span><strong>{{ vitals.spO2 }}%</strong></div>
            <div class="vital"><span>Weight</span><strong>{{ vitals.weight }} kg</strong></div>
          </div>
          <div class="alerts" *ngIf="patient.allergies?.length">
            <mat-chip-listbox><mat-chip color="warn" *ngFor="let a of patient.allergies">{{ a }}</mat-chip></mat-chip-listbox>
          </div>
        </div>

        <div class="card consultation-form">
          <form [formGroup]="form" (ngSubmit)="saveConsultation()">
            <mat-form-field appearance="outline" class="full-width"><mat-label>Chief Complaint</mat-label><textarea matInput formControlName="chiefComplaint" rows="2"></textarea></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>History of Present Illness</mat-label><textarea matInput formControlName="historyOfPresentIllness" rows="3"></textarea></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Examination Findings</mat-label><textarea matInput formControlName="examinationFindings" rows="3"></textarea></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Diagnosis</mat-label><input matInput formControlName="diagnosis"></mat-form-field>

            <h4>Prescription</h4>
            <div formArrayName="medications" *ngFor="let med of medicationsArray.controls; let i = index">
              <div [formGroupName]="i" class="med-row">
                <mat-form-field appearance="outline"><mat-label>Medicine</mat-label><input matInput formControlName="name"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Dosage</mat-label><input matInput formControlName="dosage"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Frequency</mat-label><input matInput formControlName="frequency"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Duration</mat-label><input matInput formControlName="duration"></mat-form-field>
                <button mat-icon-button color="warn" type="button" (click)="removeMedication(i)"><mat-icon>delete</mat-icon></button>
              </div>
            </div>
            <button mat-stroked-button type="button" (click)="addMedication()"><mat-icon>add</mat-icon> Add Medicine</button>

            <mat-form-field appearance="outline" class="full-width mt-2"><mat-label>Advice</mat-label><textarea matInput formControlName="advice" rows="2"></textarea></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Follow-up Date</mat-label><input matInput [matDatepicker]="picker" formControlName="followUpDate"><mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle><mat-datepicker #picker></mat-datepicker></mat-form-field>

            <div class="form-actions">
              <button mat-stroked-button type="button" (click)="orderLabs()"><mat-icon>science</mat-icon> Order Labs</button>
              <button mat-stroked-button type="button" (click)="orderRadiology()"><mat-icon>radiology</mat-icon> Order Radiology</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="saving">{{ saving ? 'Saving...' : 'Save & Complete' }}</button>
            </div>
          </form>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`.consultation-grid { display: grid; grid-template-columns: 350px 1fr; gap: 1.5rem; }
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    .patient-header { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
    .avatar { width: 60px; height: 60px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 600; }
    .patient-header h2 { margin: 0; }     .patient-header p { margin: 0; color: var(--text-secondary, #666); font-size: 0.875rem; }
    .vitals { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; padding: 1rem 0; }
    .vital { text-align: center; }     .vital span { display: block; font-size: 0.75rem; color: var(--text-secondary, #666); } .vital strong { font-size: 1rem; }
    .alerts { padding-top: 1rem; }
    .full-width { width: 100%; }
    .med-row { display: flex; gap: 0.5rem; align-items: center; } .med-row mat-form-field { flex: 1; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }`]
})
export class ConsultationComponent implements OnInit {
  patient: any; vitals: any; visitId: any; form!: FormGroup; saving = false;

  constructor(private fb: FormBuilder, private api: ApiService, private route: ActivatedRoute, private router: Router, private notification: NotificationService) {}

  ngOnInit() {
    this.form = this.fb.group({
      chiefComplaint: ['', Validators.required], historyOfPresentIllness: [''], examinationFindings: [''],
      diagnosis: ['', Validators.required], medications: this.fb.array([]), advice: [''], followUpDate: ['']
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadData(id);
  }

  get medicationsArray(): FormArray { return this.form.get('medications') as FormArray; }

  loadData(id: string) {
    this.api.get<any>(`v1/opd/consultation/${id}`).subscribe(r => {
      this.patient = r.patient;
      this.vitals = r.vitals;
      this.visitId = r.visitId || r.visit?.id || id;
    });
  }

  addMedication() { this.medicationsArray.push(this.fb.group({ name: [''], dosage: [''], frequency: [''], duration: [''] })); }
  removeMedication(i: number) { this.medicationsArray.removeAt(i); }
  viewHistory() { this.router.navigate(['/patients', this.patient.id]); }

  orderLabs() {
    this.router.navigate(['/laboratory/orders/new'], {
      queryParams: { patientId: this.patient.id, visitId: this.visitId, doctorId: this.patient.doctorId || '' }
    });
  }

  orderRadiology() {
    this.router.navigate(['/radiology/orders/new'], {
      queryParams: { patientId: this.patient.id, visitId: this.visitId, doctorId: this.patient.doctorId || '' }
    });
  }

  saveConsultation() {
    if (this.form.invalid) return;
    this.saving = true;
    this.api.post(`v1/opd/consultation/${this.route.snapshot.paramMap.get('id')}/complete`, this.form.value).subscribe({
      next: () => { this.notification.success('Consultation saved'); this.router.navigate(['/opd/queue']); },
      error: () => this.saving = false
    });
  }
}
