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
              <mat-autocomplete #patientAuto="matAutocomplete" (optionSelected)="onPatientSelected($event)">
                <mat-option *ngFor="let p of filteredPatients$ | async" [value]="p.id">
                  {{ p.name }} ({{ p.patientId }})
                </mat-option>
              </mat-autocomplete>
              <mat-error>Patient is required</mat-error>
            </mat-form-field>
          </div>
          <div class="form-row" *ngIf="selectedPatient">
            <div class="selected-patient">
              <mat-icon>person</mat-icon>
              <span><strong>{{ selectedPatient.name }}</strong> &mdash; {{ selectedPatient.patientId }}</span>
            </div>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Doctor *</mat-label>
              <mat-select formControlName="doctorId">
                <mat-option value="">Select Doctor</mat-option>
                <mat-option *ngFor="let d of doctors" [value]="d.id">Dr. {{ d.name }}</mat-option>
              </mat-select>
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
  styles: [`.form-card { background: white; padding: 1.5rem; border-radius: 8px; max-width: 800px; }
    .form-row { display: flex; gap: 1rem; margin-bottom: 0.5rem; }
    .form-row mat-form-field { flex: 1; min-width: 0; }
    .full-width { width: 100%; }
    .selected-patient { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: #e8eaf6; border-radius: 6px; margin-bottom: 0.5rem; }
    .selected-patient mat-icon { color: #3f51b5; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; }`]
})
export class RadiologyOrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  doctors: any[] = [];
  filteredPatients$!: Observable<any[]>;
  selectedPatient: any = null;
  saving = false;

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
      modality: ['', Validators.required],
      bodyPart: ['', Validators.required],
      priority: ['Routine'],
      clinicalIndication: ['', Validators.required],
      specialInstructions: ['']
    });

    this.api.get<any[]>('v1/doctors').subscribe(r => this.doctors = r);

    this.filteredPatients$ = this.orderForm.get('patientSearch')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => term && term.length >= 2
        ? this.api.get<any[]>('v1/patients/search', { searchTerm: term })
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

  onPatientSelected(event: any) {
    const patientId = event.option.value;
    this.api.getById<any>('v1/patients', patientId).subscribe(p => {
      this.selectedPatient = p;
      this.orderForm.patchValue({
        patientId: p.id,
        patientSearch: p.name
      });
    });
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
