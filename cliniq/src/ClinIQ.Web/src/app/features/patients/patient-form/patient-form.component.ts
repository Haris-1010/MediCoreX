import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

interface FieldVisibility {
  showDobAge: boolean;
  showBloodGroup: boolean;
  showEmail: boolean;
  showAlternatePhone: boolean;
  showAddress: boolean;
  showNationalId: boolean;
  showEmergencyContact: boolean;
  showPersonalInfo: boolean;
  showMedicalInfo: boolean;
}

const DEFAULT_VISIBILITY: FieldVisibility = {
  showDobAge: true,
  showBloodGroup: true,
  showEmail: true,
  showAlternatePhone: false,
  showAddress: true,
  showNationalId: false,
  showEmergencyContact: false,
  showPersonalInfo: false,
  showMedicalInfo: false,
};

const STORAGE_KEY = 'patientFormFieldVisibility';

@Component({
  standalone: false,
  selector: 'app-patient-form',
  template: `
    <app-main-layout>
      <app-page-header
        [title]="isEditMode ? 'Edit Patient' : 'Quick Register Patient'"
        [subtitle]="isEditMode ? 'Update patient information' : 'Register a new patient with minimum required fields'"
        [breadcrumbs]="[
          { label: 'Dashboard', route: '/dashboard' },
          { label: 'Patients', route: '/patients' },
          { label: isEditMode ? 'Edit' : 'New' }
        ]">
      </app-page-header>

      <form [formGroup]="patientForm" (ngSubmit)="onSubmit()">
        <!-- Toolbar with Presets and Customize -->
        <div class="toolbar">
          <div class="preset-buttons">
            <button type="button" mat-stroked-button (click)="applyPreset('minimum')" [class.active]="isPresetActive('minimum')">
              <mat-icon>flash_on</mat-icon> Quick / Minimum
            </button>
            <button type="button" mat-stroked-button (click)="applyPreset('standard')" [class.active]="isPresetActive('standard')">
              <mat-icon>description</mat-icon> Standard
            </button>
            <button type="button" mat-stroked-button (click)="applyPreset('full')" [class.active]="isPresetActive('full')">
              <mat-icon>folder_open</mat-icon> Full
            </button>
          </div>
          <button type="button" mat-stroked-button (click)="showCustomize = !showCustomize" class="customize-toggle">
            <mat-icon>{{ showCustomize ? 'expand_less' : 'tune' }}</mat-icon>
            {{ showCustomize ? 'Hide Field Options' : 'Customize Fields' }}
          </button>
        </div>

        <!-- Customize Fields Panel -->
        <div class="customize-panel" *ngIf="showCustomize">
          <mat-divider></mat-divider>
          <div class="customize-grid">
            <mat-checkbox [(ngModel)]="visibility.showDobAge" (change)="saveVisibility()" [ngModelOptions]="{standalone: true}">Date of Birth / Age</mat-checkbox>
            <mat-checkbox [(ngModel)]="visibility.showBloodGroup" (change)="saveVisibility()" [ngModelOptions]="{standalone: true}">Blood Group</mat-checkbox>
            <mat-checkbox [(ngModel)]="visibility.showEmail" (change)="saveVisibility()" [ngModelOptions]="{standalone: true}">Email</mat-checkbox>
            <mat-checkbox [(ngModel)]="visibility.showAlternatePhone" (change)="saveVisibility()" [ngModelOptions]="{standalone: true}">Alternate Phone</mat-checkbox>
            <mat-checkbox [(ngModel)]="visibility.showAddress" (change)="saveVisibility()" [ngModelOptions]="{standalone: true}">Address</mat-checkbox>
            <mat-checkbox [(ngModel)]="visibility.showNationalId" (change)="saveVisibility()" [ngModelOptions]="{standalone: true}">National ID / CNIC</mat-checkbox>
            <mat-checkbox [(ngModel)]="visibility.showEmergencyContact" (change)="saveVisibility()" [ngModelOptions]="{standalone: true}">Emergency Contact</mat-checkbox>
            <mat-checkbox [(ngModel)]="visibility.showPersonalInfo" (change)="saveVisibility()" [ngModelOptions]="{standalone: true}">Occupation / Marital Status</mat-checkbox>
            <mat-checkbox [(ngModel)]="visibility.showMedicalInfo" (change)="saveVisibility()" [ngModelOptions]="{standalone: true}">Allergies / Chronic Conditions</mat-checkbox>
          </div>
        </div>

        <!-- Required Fields Card -->
        <div class="card required-card">
          <div class="card-header-row">
            <h3><mat-icon>person_add</mat-icon> Patient Information</h3>
            <span class="required-badge">Required Fields</span>
          </div>

          <div class="form-grid">
            <div class="col-4">
              <mat-form-field appearance="outline">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="fullName" placeholder="Enter full name">
                <mat-error>Full name is required</mat-error>
              </mat-form-field>
            </div>

            <div class="col-4">
              <mat-form-field appearance="outline">
                <mat-label>Phone Number</mat-label>
                <input matInput formControlName="phone" placeholder="+92-300-1234567">
                <mat-icon matPrefix>phone</mat-icon>
                <mat-error>Phone number is required</mat-error>
              </mat-form-field>
            </div>

            <div class="col-4">
              <mat-form-field appearance="outline">
                <mat-label>Gender</mat-label>
                <mat-select formControlName="gender">
                  <mat-option value="Male">Male</mat-option>
                  <mat-option value="Female">Female</mat-option>
                  <mat-option value="Other">Other</mat-option>
                </mat-select>
                <mat-icon matPrefix>wc</mat-icon>
              </mat-form-field>
            </div>
          </div>
        </div>

        <!-- Optional Fields - Conditionally Visible -->
        <div class="card optional-card" *ngIf="hasAnyOptionalVisible()">
          <div *ngIf="visibility.showDobAge" class="optional-section">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Date of Birth</mat-label>
                <input matInput [matDatepicker]="dobPicker" formControlName="dateOfBirth" placeholder="Select date of birth">
                <mat-datepicker-toggle matIconSuffix [for]="dobPicker"></mat-datepicker-toggle>
                <mat-datepicker #dobPicker></mat-datepicker>
                <mat-hint>Or enter age if DOB is unknown</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Age (years)</mat-label>
                <input matInput type="number" min="0" max="150" formControlName="age" placeholder="e.g. 35">
                <mat-icon matPrefix>hourglass_empty</mat-icon>
                <mat-hint>Fills approximate date of birth</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" *ngIf="visibility.showBloodGroup">
                <mat-label>Blood Group</mat-label>
                <mat-select formControlName="bloodGroup">
                  <mat-option value="">Select Blood Group</mat-option>
                  <mat-option value="A+">A+</mat-option>
                  <mat-option value="A-">A-</mat-option>
                  <mat-option value="B+">B+</mat-option>
                  <mat-option value="B-">B-</mat-option>
                  <mat-option value="AB+">AB+</mat-option>
                  <mat-option value="AB-">AB-</mat-option>
                  <mat-option value="O+">O+</mat-option>
                  <mat-option value="O-">O-</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>

          <div *ngIf="visibility.showEmail || visibility.showAlternatePhone" class="optional-section">
            <h4>Contact Details</h4>
            <div class="form-row">
              <mat-form-field appearance="outline" *ngIf="visibility.showEmail">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="patient@email.com">
                <mat-icon matPrefix>email</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" *ngIf="visibility.showAlternatePhone">
                <mat-label>Alternate Phone</mat-label>
                <input matInput formControlName="alternatePhone" placeholder="+92-321-1234567">
                <mat-icon matPrefix>phone</mat-icon>
              </mat-form-field>
            </div>
          </div>

          <div *ngIf="visibility.showAddress" class="optional-section">
            <h4>Address</h4>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Address</mat-label>
                <input matInput formControlName="address" placeholder="Street address">
                <mat-icon matPrefix>location_on</mat-icon>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>City</mat-label>
                <input matInput formControlName="city" placeholder="City">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>State</mat-label>
                <input matInput formControlName="state" placeholder="State/Province">
              </mat-form-field>
            </div>
          </div>

          <div *ngIf="visibility.showNationalId" class="optional-section">
            <h4>Identification</h4>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>National ID</mat-label>
                <input matInput formControlName="nationalId" placeholder="CNIC number">
              </mat-form-field>
            </div>
          </div>

          <div *ngIf="visibility.showEmergencyContact" class="optional-section">
            <h4>Emergency Contact</h4>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Contact Name</mat-label>
                <input matInput formControlName="emergencyContactName" placeholder="Emergency contact name">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Contact Phone</mat-label>
                <input matInput formControlName="emergencyContactPhone" placeholder="+92-300-1234567">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Relationship</mat-label>
                <mat-select formControlName="emergencyContactRelation">
                  <mat-option value="Spouse">Spouse</mat-option>
                  <mat-option value="Parent">Parent</mat-option>
                  <mat-option value="Sibling">Sibling</mat-option>
                  <mat-option value="Child">Child</mat-option>
                  <mat-option value="Friend">Friend</mat-option>
                  <mat-option value="Other">Other</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>

          <div *ngIf="visibility.showPersonalInfo" class="optional-section">
            <h4>Personal Information</h4>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Occupation</mat-label>
                <input matInput formControlName="occupation" placeholder="Occupation">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Marital Status</mat-label>
                <mat-select formControlName="maritalStatus">
                  <mat-option value="Single">Single</mat-option>
                  <mat-option value="Married">Married</mat-option>
                  <mat-option value="Divorced">Divorced</mat-option>
                  <mat-option value="Widowed">Widowed</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>

          <div *ngIf="visibility.showMedicalInfo" class="optional-section">
            <h4>Medical Information</h4>
            <div class="chip-section">
              <label>Allergies</label>
              <mat-chip-grid #allergyChipGrid>
                <mat-chip-row *ngFor="let allergy of allergies" (removed)="removeAllergy(allergy)">
                  {{ allergy }}
                  <button matChipRemove><mat-icon>cancel</mat-icon></button>
                </mat-chip-row>
              </mat-chip-grid>
              <input placeholder="Type allergy and press Enter..."
                     [matChipInputFor]="allergyChipGrid"
                     (matChipInputTokenEnd)="addAllergy($event)">
            </div>
            <div class="chip-section">
              <label>Chronic Conditions</label>
              <mat-chip-grid #conditionChipGrid>
                <mat-chip-row *ngFor="let condition of chronicConditions" (removed)="removeCondition(condition)">
                  {{ condition }}
                  <button matChipRemove><mat-icon>cancel</mat-icon></button>
                </mat-chip-row>
              </mat-chip-grid>
              <input placeholder="Type condition and press Enter..."
                     [matChipInputFor]="conditionChipGrid"
                     (matChipInputTokenEnd)="addCondition($event)">
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button mat-stroked-button type="button" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="saving || patientForm.invalid">
            <mat-spinner diameter="20" *ngIf="saving"></mat-spinner>
            <span *ngIf="!saving">
              <mat-icon>{{ isEditMode ? 'save' : 'person_add' }}</mat-icon>
              {{ isEditMode ? 'Update Patient' : 'Register Patient' }}
            </span>
          </button>
        </div>
      </form>
    </app-main-layout>
  `,
  styles: [`
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .preset-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .preset-buttons button {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .preset-buttons button.active {
      background: #3f51b5;
      color: white;
    }

    .customize-toggle {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .customize-panel {
      padding: 1rem 0;
    }

    .customize-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .card {
      background: var(--bg-card, #fff);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      padding: 1.5rem;
      margin-bottom: 1rem;
    }

    .required-card {
      border-left: 4px solid var(--accent-primary, #3f51b5);
    }

    .optional-card {
      border-left: 4px solid var(--border-color, #e0e0e0);
    }

    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .card-header-row h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary, #333);
    }

    .required-badge {
      background: #e8eaf6;
      color: var(--accent-primary, #3f51b5);
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .col-4 {
      grid-column: span 4;
    }

    .form-grid mat-form-field {
      width: 100%;
    }

    .full-width {
      width: 100%;
    }

    .optional-section {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color, #f0f0f0);
    }

    .optional-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .optional-section h4 {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-secondary, #555);
      margin: 0 0 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .chip-section {
      margin-bottom: 1rem;
    }

    .chip-section label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-secondary, #666);
      margin-bottom: 0.5rem;
    }

    .chip-section input {
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 4px;
      padding: 0.5rem;
      width: 100%;
      font-size: 0.9rem;
    }

    .chip-section input:focus {
      outline: none;
      border-color: #3f51b5;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    .action-buttons button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .col-4 {
        grid-column: span 1;
      }

      .toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .preset-buttons {
        justify-content: center;
      }

      .action-buttons {
        flex-direction: column;
      }

      .action-buttons button {
        width: 100%;
        justify-content: center;
      }

      .customize-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PatientFormComponent implements OnInit, OnDestroy {
  patientForm!: FormGroup;
  isEditMode = false;
  patientId: string | null = null;
  saving = false;
  showCustomize = false;
  visibility: FieldVisibility = { ...DEFAULT_VISIBILITY };
  allergies: string[] = [];
  chronicConditions: string[] = [];
  private destroy$ = new Subject<void>();
  private syncingDobAge = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadVisibility();
    this.initForm();
    this.patientId = this.route.snapshot.paramMap.get('id');

    if (this.patientId) {
      this.isEditMode = true;
      this.loadPatient(this.patientId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadVisibility(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.visibility = { ...DEFAULT_VISIBILITY, ...JSON.parse(stored) };
      }
    } catch {
      this.visibility = { ...DEFAULT_VISIBILITY };
    }
  }

  saveVisibility(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.visibility));
    } catch {
      // ignore localStorage errors
    }
  }

  applyPreset(preset: 'minimum' | 'standard' | 'full'): void {
    switch (preset) {
      case 'minimum':
        this.visibility = {
          showDobAge: false,
          showBloodGroup: false,
          showEmail: false,
          showAlternatePhone: false,
          showAddress: false,
          showNationalId: false,
          showEmergencyContact: false,
          showPersonalInfo: false,
          showMedicalInfo: false,
        };
        break;
      case 'standard':
        this.visibility = {
          showDobAge: true,
          showBloodGroup: true,
          showEmail: true,
          showAlternatePhone: false,
          showAddress: true,
          showNationalId: false,
          showEmergencyContact: false,
          showPersonalInfo: false,
          showMedicalInfo: false,
        };
        break;
      case 'full':
        this.visibility = {
          showDobAge: true,
          showBloodGroup: true,
          showEmail: true,
          showAlternatePhone: true,
          showAddress: true,
          showNationalId: true,
          showEmergencyContact: true,
          showPersonalInfo: true,
          showMedicalInfo: true,
        };
        break;
    }
    this.saveVisibility();
  }

  isPresetActive(preset: 'minimum' | 'standard' | 'full'): boolean {
    const presetVis = this.getPresetVisibility(preset);
    return Object.keys(presetVis).every(key => this.visibility[key as keyof FieldVisibility] === presetVis[key as keyof FieldVisibility]);
  }

  private getPresetVisibility(preset: 'minimum' | 'standard' | 'full'): FieldVisibility {
    switch (preset) {
      case 'minimum':
        return {
          showDobAge: false,
          showBloodGroup: false,
          showEmail: false,
          showAlternatePhone: false,
          showAddress: false,
          showNationalId: false,
          showEmergencyContact: false,
          showPersonalInfo: false,
          showMedicalInfo: false,
        };
      case 'standard':
        return {
          showDobAge: true,
          showBloodGroup: true,
          showEmail: true,
          showAlternatePhone: false,
          showAddress: true,
          showNationalId: false,
          showEmergencyContact: false,
          showPersonalInfo: false,
          showMedicalInfo: false,
        };
      case 'full':
        return {
          showDobAge: true,
          showBloodGroup: true,
          showEmail: true,
          showAlternatePhone: true,
          showAddress: true,
          showNationalId: true,
          showEmergencyContact: true,
          showPersonalInfo: true,
          showMedicalInfo: true,
        };
    }
  }

  hasAnyOptionalVisible(): boolean {
    return Object.values(this.visibility).some(v => v);
  }

  private initForm(): void {
    this.patientForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      gender: [''],
      dateOfBirth: [''],
      age: [null],
      bloodGroup: [''],
      email: [''],
      alternatePhone: [''],
      address: [''],
      city: [''],
      state: [''],
      nationalId: [''],
      occupation: [''],
      maritalStatus: [''],
      emergencyContactName: [''],
      emergencyContactPhone: [''],
      emergencyContactRelation: ['']
    });

    this.patientForm.get('dateOfBirth')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(dob => {
        if (this.syncingDobAge) return;
        this.syncingDobAge = true;
        this.patientForm.patchValue({ age: this.calculateAge(dob) }, { emitEvent: false });
        this.syncingDobAge = false;
      });

    this.patientForm.get('age')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(age => {
        if (this.syncingDobAge) return;
        this.syncingDobAge = true;
        const years = age === null || age === '' ? null : Number(age);
        this.patientForm.patchValue({
          dateOfBirth: years !== null && !isNaN(years) && years >= 0 ? this.dateFromAge(years) : null
        }, { emitEvent: false });
        this.syncingDobAge = false;
      });
  }

  loadPatient(id: string): void {
    this.api.getById<any>('v1/patients', id).subscribe({
      next: (patient) => {
        this.patientForm.patchValue({
          fullName: patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim(),
          phone: patient.phone,
          gender: patient.gender,
          dateOfBirth: patient.dateOfBirth,
          age: patient.age ?? this.calculateAge(patient.dateOfBirth),
          bloodGroup: patient.bloodGroup,
          email: patient.email,
          alternatePhone: patient.alternatePhone,
          address: patient.address,
          city: patient.city,
          state: patient.state,
          nationalId: patient.nationalId,
          occupation: patient.occupation,
          maritalStatus: patient.maritalStatus,
          emergencyContactName: patient.emergencyContactName,
          emergencyContactPhone: patient.emergencyContactPhone,
          emergencyContactRelation: patient.emergencyContactRelation
        });
        this.allergies = patient.allergies || [];
        this.chronicConditions = patient.chronicConditions || [];

        // Auto-show fields that have data
        this.autoShowFieldsWithData(patient);
      }
    });
  }

  private autoShowFieldsWithData(patient: any): void {
    let hasChanges = false;
    if (patient.dateOfBirth && !this.visibility.showDobAge) { this.visibility.showDobAge = true; hasChanges = true; }
    if (patient.bloodGroup && !this.visibility.showBloodGroup) { this.visibility.showBloodGroup = true; hasChanges = true; }
    if (patient.email && !this.visibility.showEmail) { this.visibility.showEmail = true; hasChanges = true; }
    if (patient.alternatePhone && !this.visibility.showAlternatePhone) { this.visibility.showAlternatePhone = true; hasChanges = true; }
    if ((patient.address || patient.city || patient.state) && !this.visibility.showAddress) { this.visibility.showAddress = true; hasChanges = true; }
    if (patient.nationalId && !this.visibility.showNationalId) { this.visibility.showNationalId = true; hasChanges = true; }
    if ((patient.emergencyContactName || patient.emergencyContactPhone) && !this.visibility.showEmergencyContact) { this.visibility.showEmergencyContact = true; hasChanges = true; }
    if ((patient.occupation || patient.maritalStatus) && !this.visibility.showPersonalInfo) { this.visibility.showPersonalInfo = true; hasChanges = true; }
    if ((patient.allergies?.length || patient.chronicConditions?.length) && !this.visibility.showMedicalInfo) { this.visibility.showMedicalInfo = true; hasChanges = true; }
    if (hasChanges) this.saveVisibility();
  }

  addAllergy(event: any): void {
    const value = (event.value || '').trim();
    if (value && !this.allergies.includes(value)) {
      this.allergies.push(value);
    }
    event.chipInput?.clear();
  }

  removeAllergy(allergy: string): void {
    const index = this.allergies.indexOf(allergy);
    if (index >= 0) {
      this.allergies.splice(index, 1);
    }
  }

  addCondition(event: any): void {
    const value = (event.value || '').trim();
    if (value && !this.chronicConditions.includes(value)) {
      this.chronicConditions.push(value);
    }
    event.chipInput?.clear();
  }

  removeCondition(condition: string): void {
    const index = this.chronicConditions.indexOf(condition);
    if (index >= 0) {
      this.chronicConditions.splice(index, 1);
    }
  }

  goBack(): void {
    this.router.navigate(['/patients']);
  }

  private calculateAge(dateOfBirth: Date | string | null | undefined): number | null {
    if (!dateOfBirth) return null;
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age < 0 ? null : age;
  }

  private dateFromAge(age: number): Date {
    const today = new Date();
    return new Date(today.getFullYear() - age, today.getMonth(), today.getDate());
  }

  onSubmit(): void {
    if (this.patientForm.invalid || this.saving) return;

    this.saving = true;
    this.patientForm.disable();
    const formValue = this.patientForm.getRawValue();

    const nameParts = (formValue.fullName || '').trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ');

    const payload = {
      fullName: formValue.fullName,
      firstName,
      lastName,
      phone: formValue.phone,
      gender: formValue.gender,
      dateOfBirth: formValue.dateOfBirth || null,
      age: formValue.age === '' || formValue.age === null ? null : Number(formValue.age),
      bloodGroup: formValue.bloodGroup || null,
      email: formValue.email || null,
      alternatePhone: formValue.alternatePhone || null,
      address: formValue.address || null,
      city: formValue.city || null,
      state: formValue.state || null,
      nationalId: formValue.nationalId || null,
      occupation: formValue.occupation || null,
      maritalStatus: formValue.maritalStatus || null,
      emergencyContactName: formValue.emergencyContactName || null,
      emergencyContactPhone: formValue.emergencyContactPhone || null,
      emergencyContactRelation: formValue.emergencyContactRelation || null,
      allergies: this.allergies.length > 0 ? this.allergies : null,
      chronicConditions: this.chronicConditions.length > 0 ? this.chronicConditions : null
    };

    const request = this.isEditMode
      ? this.api.put('v1/patients', this.patientId!, payload)
      : this.api.post('v1/patients', payload);

    request.subscribe({
      next: (result: any) => {
        this.notification.success(
          this.isEditMode ? 'Patient updated successfully' : 'Patient registered successfully'
        );
        this.router.navigate(['/patients']);
      },
      error: () => {
        this.saving = false;
        this.patientForm.enable();
      },
      complete: () => {
        this.saving = false;
      }
    });
  }
}