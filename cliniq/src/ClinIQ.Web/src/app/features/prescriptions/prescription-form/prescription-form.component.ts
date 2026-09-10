import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-prescription-form',
  template: `
    <app-main-layout>
      <app-page-header
        [title]="isEditMode ? 'Edit Prescription' : 'New Prescription'"
        [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Prescriptions', route: '/prescriptions' }, { label: isEditMode ? 'Edit' : 'New' }]">
      </app-page-header>

      <div class="form-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="col-6">
              <mat-form-field appearance="outline">
                <mat-label>Patient *</mat-label>
                <input matInput [matAutocomplete]="patientAuto" formControlName="patientSearch" placeholder="Search patient by name or MRN...">
                <mat-autocomplete #patientAuto="matAutocomplete" [displayWith]="displayPatient" (optionSelected)="onPatientSelected($event)">
                  <mat-option *ngFor="let p of filteredPatients" [value]="p">
                    {{ p.fullName }} ({{ p.mrn }})
                  </mat-option>
                </mat-autocomplete>
                <mat-error *ngIf="form.get('patientId')?.hasError('required')">Patient is required</mat-error>
              </mat-form-field>
            </div>

            <div class="col-6">
              <mat-form-field appearance="outline">
                <mat-label>Doctor *</mat-label>
                <input matInput [matAutocomplete]="doctorAuto" formControlName="doctorSearch" placeholder="Search doctor by name or specialty...">
                <mat-autocomplete #doctorAuto="matAutocomplete" [displayWith]="displayDoctor" (optionSelected)="onDoctorSelected($event)">
                  <mat-option *ngFor="let d of filteredDoctors" [value]="d">
                    Dr. {{ d.fullName }} <span *ngIf="d.specialization"> - {{ d.specialization }}</span>
                  </mat-option>
                </mat-autocomplete>
                <mat-error *ngIf="form.get('doctorId')?.hasError('required')">Doctor is required</mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Diagnosis</mat-label>
              <textarea matInput formControlName="diagnosis" rows="2" placeholder="Primary diagnosis"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>General Instructions</mat-label>
              <textarea matInput formControlName="generalInstructions" rows="2" placeholder="General notes for the patient"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Valid Until</mat-label>
              <input matInput [matDatepicker]="validUntilPicker" formControlName="validUntil">
              <mat-datepicker-toggle matSuffix [for]="validUntilPicker"></mat-datepicker-toggle>
              <mat-datepicker #validUntilPicker></mat-datepicker>
            </mat-form-field>
          </div>

          <!-- Medicines Section -->
          <div class="medicines-section">
            <div class="section-header">
              <h3>Medicines</h3>
              <button mat-stroked-button type="button" color="primary" (click)="addMedicine()">
                <mat-icon>add</mat-icon> Add Medicine
              </button>
            </div>

            <div formArrayName="items">
              <div *ngFor="let item of itemsArray.controls; let i = index" [formGroupName]="i" class="medicine-card">
                <div class="medicine-header">
                  <strong>Medicine {{ i + 1 }}</strong>
                  <button mat-icon-button type="button" color="warn" (click)="removeMedicine(i)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
                <div class="medicine-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Medicine Name *</mat-label>
                    <input matInput formControlName="medicineName" placeholder="e.g. Amoxicillin">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Strength</mat-label>
                    <input matInput formControlName="strength" placeholder="e.g. 500mg">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Form</mat-label>
                    <mat-select formControlName="form">
                      <mat-option value="Tablet">Tablet</mat-option>
                      <mat-option value="Capsule">Capsule</mat-option>
                      <mat-option value="Syrup">Syrup</mat-option>
                      <mat-option value="Injection">Injection</mat-option>
                      <mat-option value="Cream">Cream</mat-option>
                      <mat-option value="Drops">Drops</mat-option>
                      <mat-option value="Inhaler">Inhaler</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Dosage</mat-label>
                    <input matInput formControlName="dosage" placeholder="e.g. 1 tablet">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Frequency *</mat-label>
                    <mat-select formControlName="frequency">
                      <mat-option value="OnceDaily">Once Daily</mat-option>
                      <mat-option value="TwiceDaily">Twice Daily</mat-option>
                      <mat-option value="ThriceDaily">Thrice Daily</mat-option>
                      <mat-option value="FourTimesDaily">4 Times Daily</mat-option>
                      <mat-option value="EveryFourHours">Every 4 Hours</mat-option>
                      <mat-option value="EverySixHours">Every 6 Hours</mat-option>
                      <mat-option value="EveryEightHours">Every 8 Hours</mat-option>
                      <mat-option value="EveryTwelveHours">Every 12 Hours</mat-option>
                      <mat-option value="BeforeMeals">Before Meals</mat-option>
                      <mat-option value="AfterMeals">After Meals</mat-option>
                      <mat-option value="AtBedtime">At Bedtime</mat-option>
                      <mat-option value="AsNeeded">As Needed</mat-option>
                      <mat-option value="Weekly">Weekly</mat-option>
                      <mat-option value="Custom">Custom</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Duration (days)</mat-label>
                    <input matInput type="number" formControlName="durationDays">
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Instructions</mat-label>
                    <input matInput formControlName="instructions" placeholder="e.g. Take after food">
                  </mat-form-field>

                  <div class="timing-checkboxes">
                    <mat-label>Timing:</mat-label>
                    <mat-checkbox formControlName="morning">Morning</mat-checkbox>
                    <mat-checkbox formControlName="afternoon">Afternoon</mat-checkbox>
                    <mat-checkbox formControlName="evening">Evening</mat-checkbox>
                    <mat-checkbox formControlName="night">Night</mat-checkbox>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="itemsArray.length === 0" class="empty-medicines">
              <p>No medicines added. Click "Add Medicine" to start.</p>
            </div>
          </div>

          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="cancel()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving"
              *appHasPermission="isEditMode ? 'Prescriptions.Edit' : 'Prescriptions.Create'">
              <mat-icon *ngIf="!saving">{{ isEditMode ? 'save' : 'add' }}</mat-icon>
              <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
              {{ isEditMode ? 'Update Prescription' : 'Create Prescription' }}
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `,
 styles: [`
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .col-6 {
    grid-column: span 1;
  }

  .form-grid mat-form-field,
  .col-6 mat-form-field {
    width: 100%;
  }

  .full-width {
    width: 100%;
    grid-column: 1 / -1;
  }

  .medicines-section {
    margin-bottom: 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .section-header h3 {
    margin: 0;
    color: #1a237e;
  }

  .medicine-card {
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    background: #fafafa;
  }

  .medicine-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .medicine-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
  }

  .medicine-grid mat-form-field {
    width: 100%;
  }

  .timing-checkboxes {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    grid-column: 1 / -1;
  }

  .timing-checkboxes mat-label {
    font-size: 0.85rem;
    color: #666;
  }

  .empty-medicines {
    text-align: center;
    padding: 2rem;
    color: #999;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
  }

  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
`]
})
export class PrescriptionFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  saving = false;
  prescriptionId: string | null = null;
  filteredPatients: any[] = [];
  filteredDoctors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService
  ) {}

  get itemsArray(): FormArray { return this.form.get('items') as FormArray; }

  ngOnInit() {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      patientSearch: [''],
      doctorId: ['', Validators.required],
      doctorSearch: [''],
      diagnosis: [''],
      generalInstructions: [''],
      dietaryAdvice: [''],
      lifestyleAdvice: [''],
      validUntil: [null],
      items: this.fb.array([])
    });

    this.setupPatientSearch();
    this.setupDoctorSearch();

    this.prescriptionId = this.route.snapshot.paramMap.get('id');
    if (this.prescriptionId) {
      this.isEditMode = true;
      this.loadPrescription();
    }
  }

  private normalizeList<T>(value: any): T[] {
    if (Array.isArray(value)) return value as T[];
    if (!value || typeof value !== 'object') return [];
    if (Array.isArray(value.items)) return value.items as T[];
    if (Array.isArray(value.data)) return value.data as T[];
    if (Array.isArray(value.results)) return value.results as T[];
    return [];
  }

  private setupPatientSearch() {
    this.form.get('patientSearch')?.valueChanges.subscribe(val => {
      if (typeof val === 'string' && val.length >= 2) {
        this.api.get<any[]>('v1/patients/search', { term: val }).subscribe(r => {
          this.filteredPatients = this.normalizeList(r);
        });
      } else {
        this.filteredPatients = [];
      }
    });
  }

  private setupDoctorSearch() {
    this.form.get('doctorSearch')?.valueChanges.subscribe(val => {
      if (typeof val === 'string' && val.length >= 2) {
        this.api.get<any[]>('v1/doctors/search', { term: val }).subscribe(r => {
          this.filteredDoctors = this.normalizeList(r);
        });
      } else {
        this.filteredDoctors = [];
      }
    });
  }

  displayPatient(p: any): string {
    return p ? `${p.fullName || ''} (${p.mrn || ''})` : '';
  }

  displayDoctor(d: any): string {
    return d ? `Dr. ${d.fullName || ''}${d.specialization ? ' - ' + d.specialization : ''}` : '';
  }

  onPatientSelected(e: any) {
    this.form.patchValue({ patientId: e.option.value.id });
  }

  onDoctorSelected(e: any) {
    this.form.patchValue({ doctorId: e.option.value.id });
  }

  loadPrescription() {
    this.api.get<any>(`v1/prescriptions/${this.prescriptionId}`).subscribe({
      next: (rx) => {
        this.form.patchValue({
          patientId: rx.patientId,
          patientSearch: { id: rx.patientId, fullName: rx.patientName, mrn: rx.patientNumber },
          doctorId: rx.doctorId,
          doctorSearch: { id: rx.doctorId, fullName: rx.doctorName },
          diagnosis: rx.diagnosis,
          generalInstructions: rx.generalInstructions,
          dietaryAdvice: rx.dietaryAdvice,
          lifestyleAdvice: rx.lifestyleAdvice,
          validUntil: rx.validUntil
        });
        if (rx.items?.length) {
          rx.items.forEach((item: any) => this.addMedicine(item));
        }
      },
      error: () => { this.notification.error('Failed to load prescription'); this.router.navigate(['/prescriptions']); }
    });
  }

  addMedicine(data?: any) {
    this.itemsArray.push(this.fb.group({
      medicineName: [data?.medicineName || '', Validators.required],
      genericName: [data?.genericName || ''],
      strength: [data?.strength || ''],
      form: [data?.form || 'Tablet'],
      dosage: [data?.dosage || ''],
      frequency: [data?.frequency || 'OnceDaily', Validators.required],
      frequencyText: [data?.frequencyText || ''],
      route: [data?.route || 'Oral'],
      durationDays: [data?.durationDays || null],
      durationText: [data?.durationText || ''],
      quantity: [data?.quantity || null],
      instructions: [data?.instructions || ''],
      specialInstructions: [data?.specialInstructions || ''],
      warnings: [data?.warnings || ''],
      morning: [data?.morning ?? false],
      afternoon: [data?.afternoon ?? false],
      evening: [data?.evening ?? false],
      night: [data?.night ?? false],
      allowSubstitution: [data?.allowSubstitution ?? true]
    }));
  }

  removeMedicine(index: number) { this.itemsArray.removeAt(index); }

  onSubmit() {
    if (this.saving) return;

  if (!this.form.get('patientId')?.value) {
    this.notification.error('Please select a patient');
    return;
  }

  if (!this.form.get('doctorId')?.value) {
    this.notification.error('Please select a doctor');
    return;
  }

  // Medicine required check
  if (!this.itemsArray.length) {
    this.notification.error('Please add at least one medicine');
    return;
  }

  // Agar medicine hai lekin name empty hai
  const hasInvalidMedicine = this.itemsArray.controls.some(
    ctrl => !ctrl.get('medicineName')?.value?.trim()
  );
  if (hasInvalidMedicine) {
    this.notification.error('Please enter medicine name for all items');
    return;
  }
    this.saving = true;
    const formValue = this.form.getRawValue();
    const payload = {
      patientId: formValue.patientId,
      doctorId: formValue.doctorId,
      diagnosis: formValue.diagnosis,
      generalInstructions: formValue.generalInstructions,
      dietaryAdvice: formValue.dietaryAdvice,
      lifestyleAdvice: formValue.lifestyleAdvice,
      validUntil: formValue.validUntil,
      items: formValue.items
    };
    const request = this.isEditMode
      ? this.api.put('v1/prescriptions', this.prescriptionId!, payload)
      : this.api.post('v1/prescriptions', payload);
    request.subscribe({
      next: () => {
        this.notification.success(this.isEditMode ? 'Prescription updated successfully' : 'Prescription created successfully');
        this.router.navigate(['/prescriptions']);
      },
      error: () => { this.saving = false; this.notification.error('Failed to save prescription'); }
    });
  }

  cancel() { this.router.navigate(['/prescriptions']); }
}
