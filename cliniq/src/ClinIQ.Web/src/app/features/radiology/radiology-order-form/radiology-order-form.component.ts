import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-radiology-order-form',
  template: `
    <app-main-layout>
      <app-page-header title="New Radiology Order" [breadcrumbs]="[{ label: 'Radiology', route: '/radiology' }, { label: 'New Order' }]"></app-page-header>
      <div class="form-card">
        <form [formGroup]="orderForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Patient *</mat-label>
              <input matInput formControlName="patientSearch" [matAutocomplete]="patientAuto" (input)="onPatientSearch($event)" placeholder="Search patient by name or ID">
              <mat-autocomplete #patientAuto="matAutocomplete" [displayWith]="displayPatient" (optionSelected)="onPatientSelected($event)">
                <mat-option *ngFor="let p of filteredPatients$ | async" [value]="p">
                  {{ p.fullName }} ({{ p.mrn || p.id }})
                </mat-option>
              </mat-autocomplete>
              <mat-error>Patient is required</mat-error>
            </mat-form-field>
          </div>
          <div class="form-row" *ngIf="selectedPatient">
            <div class="selected-patient">
              <mat-icon>person</mat-icon>
              <span><strong>{{ selectedPatient.fullName }}</strong> &mdash; {{ selectedPatient.mrn }}</span>
            </div>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Doctor *</mat-label>
              <input matInput [matAutocomplete]="doctorAuto" formControlName="doctorSearch" placeholder="Search doctor by name or specialty..." (focus)="onDoctorFocus()" (input)="onDoctorInput($event)">
              <mat-autocomplete #doctorAuto="matAutocomplete" [displayWith]="displayDoctor" (optionSelected)="onDoctorSelected($event)">
                <mat-option *ngFor="let d of filteredDoctors" [value]="d">
                  <div class="autocomplete-option">
                    <span class="name">Dr. {{ d.fullName }}</span>
                    <span class="detail">{{ d.specialization || '' }}</span>
                  </div>
                </mat-option>
              </mat-autocomplete>
              <mat-error>Doctor is required</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Modality / Study Type *</mat-label>
              <mat-select formControlName="modality">
                <mat-option value="">Select Modality</mat-option>
                <mat-option value="X-Ray">X-Ray</mat-option>
                <mat-option value="CT Scan">CT Scan</mat-option>
                <mat-option value="MRI">MRI</mat-option>
                <mat-option value="Ultrasound">Ultrasound</mat-option>
                <mat-option value="Mammography">Mammography</mat-option>
                <mat-option value="Fluoroscopy">Fluoroscopy</mat-option>
                <mat-option value="DEXA Scan">DEXA Scan</mat-option>
                <mat-option value="Nuclear Medicine">Nuclear Medicine</mat-option>
                <mat-option value="PET Scan">PET Scan</mat-option>
                <mat-option value="Angiography">Angiography</mat-option>
              </mat-select>
              <mat-error>Modality is required</mat-error>
            </mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Body Part *</mat-label>
              <input matInput formControlName="bodyPart" placeholder="e.g. Chest, Abdomen, Knee">
              <mat-error>Body part is required</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Priority</mat-label>
              <mat-select formControlName="priority">
                <mat-option value="Routine">Routine</mat-option>
                <mat-option value="Urgent">Urgent</mat-option>
                <mat-option value="Emergent">Emergent</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Clinical Indication *</mat-label>
              <textarea matInput formControlName="clinicalIndication" rows="3" placeholder="Reason for imaging study"></textarea>
              <mat-error>Clinical indication is required</mat-error>
            </mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Special Instructions</mat-label>
              <textarea matInput formControlName="specialInstructions" rows="2" placeholder="Any special preparation or instructions"></textarea>
            </mat-form-field>
          </div>
          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/radiology">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="orderForm.invalid || saving">
              {{ saving ? 'Submitting...' : 'Submit Order' }}
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `,
  styles: [`    .form-card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; max-width: 800px; }
    .form-row { display: flex; gap: 1rem; margin-bottom: 0.5rem; }
    .form-row mat-form-field { flex: 1; min-width: 0; }
    .full-width { width: 100%; }
    .selected-patient { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: #e8eaf6; border-radius: 6px; margin-bottom: 0.5rem; }
    .selected-patient mat-icon { color: var(--accent-primary, #3f51b5); }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color, #eee); }
    :host ::ng-deep .autocomplete-option { display: flex; flex-direction: column; padding: 4px 0; }
    :host ::ng-deep .autocomplete-option .name { font-weight: 500; }
    :host ::ng-deep .autocomplete-option .detail { font-size: 0.75rem; color: var(--text-muted, #888); }
    :host ::ng-deep .mat-mdc-autocomplete-panel { max-height: 300px !important; border-radius: 8px !important; border: 1px solid #c5cae9 !important; box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option { padding: 10px 16px !important; line-height: 1.4 !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option:hover { background-color: #e8eaf6 !important; }`]
})
export class RadiologyOrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  filteredPatients$!: Observable<any[]>;
  selectedPatient: any = null;
  saving = false;

  filteredDoctors: any[] = [];
  allDoctors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.orderForm = this.fb.group({
      patientSearch: ['', Validators.required],
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      doctorSearch: [''],
      modality: ['', Validators.required],
      bodyPart: ['', Validators.required],
      priority: ['Routine'],
      clinicalIndication: ['', Validators.required],
      specialInstructions: ['']
    });

    this.filteredPatients$ = this.orderForm.get('patientSearch')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => term && term.length >= 2
        ? this.api.get<any[]>('v1/patients/search', { term: term, limit: 20 })
        : of([])
      )
    );
  }

  onPatientSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    if (!term || term.length < 2) {
      this.selectedPatient = null;
      this.orderForm.patchValue({ patientId: '' });
    }
  }

  displayPatient(p: any): string {
    if (!p) return '';
    if (typeof p === 'string') return p;
    return `${p.fullName || ''} (${p.mrn || ''})`;
  }

  onPatientSelected(event: any) {
    const patient = event.option.value;
    this.selectedPatient = patient;
    this.orderForm.patchValue({
      patientId: patient.id,
      patientSearch: patient.fullName || patient
    });
  }

  private normalizeList<T>(value: any): T[] {
    if (Array.isArray(value)) return value as T[];
    if (!value || typeof value !== 'object') return [];
    if (Array.isArray(value.items)) return value.items as T[];
    if (Array.isArray(value.data)) return value.data as T[];
    if (Array.isArray(value.results)) return value.results as T[];
    return [];
  }

  onDoctorFocus() {
    if (this.allDoctors.length === 0) {
      this.api.get<any[]>('v1/doctors').subscribe(r => {
        this.allDoctors = this.normalizeList(r);
        this.filteredDoctors = this.allDoctors;
      });
    }
  }

  onDoctorInput(event: any) {
    const term = (event.target.value || '').toLowerCase();
    if (!term) {
      this.filteredDoctors = this.allDoctors;
      return;
    }
    this.filteredDoctors = this.allDoctors.filter(d =>
      (d.fullName || '').toLowerCase().includes(term) ||
      (d.specialization || '').toLowerCase().includes(term)
    );
  }

  displayDoctor(d: any): string {
    if (!d) return '';
    if (typeof d === 'string') return d;
    return `Dr. ${d.fullName || ''} - ${d.specialization || ''}`;
  }

  onDoctorSelected(e: any) {
    const doctor = e.option.value;
    this.orderForm.patchValue({ doctorId: doctor.id, doctorSearch: doctor.fullName });
  }

  onSubmit() {
    if (this.orderForm.invalid) return;
    this.saving = true;
    const formValue = this.orderForm.value;
    const payload = {
      patientId: formValue.patientId,
      doctorId: formValue.doctorId,
      modality: formValue.modality,
      bodyPart: formValue.bodyPart,
      priority: formValue.priority,
      clinicalIndication: formValue.clinicalIndication,
      specialInstructions: formValue.specialInstructions || null
    };
    this.api.post('v1/radiology/orders', payload).subscribe({
      next: () => {
        this.notification.success('Radiology order created');
        this.router.navigate(['/radiology']);
      },
      error: () => { this.saving = false; }
    });
  }
}
