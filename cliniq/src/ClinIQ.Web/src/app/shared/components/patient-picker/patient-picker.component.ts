import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Subject, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

export interface PatientPickerValue {
  id: string;
  mrn?: string;
  fullName: string;
  phone?: string;
}

const CREATE_OPTION = { __createPatient: true } as const;

@Component({
  standalone: false,
  selector: 'app-patient-picker',
  template: `
    <div class="patient-picker-row">
      <mat-form-field appearance="outline" class="patient-search-field">
        <mat-label>{{ label }}</mat-label>
        <input matInput
               [formControl]="searchControl"
               [matAutocomplete]="auto"
               [placeholder]="placeholder"
               (focus)="onFocus()"
               (input)="onInput()">
        <mat-icon matPrefix>search</mat-icon>
        <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayWith" (optionSelected)="onOptionSelected($event)">
          <mat-option *ngFor="let p of filteredPatients" [value]="p">
            <div class="patient-option">
              <span class="name">{{ p.fullName }} <span *ngIf="p.mrn">({{ p.mrn }})</span></span>
              <span class="phone">{{ p.phone || 'No phone' }}</span>
            </div>
          </mat-option>
          <mat-option *ngIf="canCreate" [value]="createOption" class="create-option">
            <mat-icon>person_add</mat-icon>
            <span>Create new patient: "{{ searchControl.value }}"</span>
          </mat-option>
          <mat-option *ngIf="showNoMatch" disabled>
            No patients found — type phone and create
          </mat-option>
        </mat-autocomplete>
        <mat-error *ngIf="required">Patient is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="patient-phone-field">
        <mat-label>Phone {{ isNewPatient ? '*' : '' }}</mat-label>
        <input matInput
               [formControl]="phoneControl"
               [placeholder]="isNewPatient ? 'Required for new patient' : 'Patient phone'">
        <mat-icon matPrefix>phone</mat-icon>
        <mat-error>Phone is required for new patient</mat-error>
      </mat-form-field>
    </div>

    <div class="new-patient-hint" *ngIf="isNewPatient">
      <mat-icon>info</mat-icon>
      <span>New patient mode — enter phone to create "{{ pendingName }}"</span>
    </div>
  `,
  styles: [`
    .patient-picker-row { display: flex; gap: 1rem; align-items: flex-start; width: 100%; }
    .patient-search-field { flex: 2; min-width: 0; }
    .patient-phone-field { flex: 1; min-width: 160px; }
    .patient-option { display: flex; flex-direction: column; }
    .patient-option .name { font-weight: 500; }
    .patient-option .phone { font-size: 0.78rem; color: #888; }
    .create-option { color: #3f51b5; font-weight: 500; }
    .create-option mat-icon { margin-right: 8px; vertical-align: middle; font-size: 18px; width: 18px; height: 18px; }
    .new-patient-hint {
      display: flex; align-items: center; gap: 6px; margin-top: -4px; margin-bottom: 8px;
      font-size: 0.8rem; color: #b54708;
    }
    .new-patient-hint mat-icon { font-size: 16px; width: 16px; height: 16px; }
    @media (max-width: 700px) {
      .patient-picker-row { flex-direction: column; }
      .patient-search-field, .patient-phone-field { width: 100%; }
    }
  `]
})
export class PatientPickerComponent implements OnInit, OnDestroy {
  @Input() label = 'Patient';
  @Input() placeholder = 'Search by name or phone...';
  @Input() required = true;
  @Output() patientChange = new EventEmitter<PatientPickerValue | null>();

  @ViewChild('auto') autocomplete!: any;

  searchControl = new FormControl<string | PatientPickerValue | typeof CREATE_OPTION | null>('');
  phoneControl = new FormControl('');

  allPatients: PatientPickerValue[] = [];
  filteredPatients: PatientPickerValue[] = [];
  selectedPatient: PatientPickerValue | null = null;
  isNewPatient = false;
  pendingName = '';
  private loaded = false;
  private rawSearchText = '';
  private creating = false;
  private originalPhone = '';
  private destroy$ = new Subject<void>();

  readonly createOption = CREATE_OPTION;

  constructor(
    private api: ApiService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      if (typeof value === 'string') {
        this.rawSearchText = value;
        this.filterPatients(value);
        if (this.isNewPatient) {
          this.pendingName = value.trim();
          if (!this.pendingName) this.exitNewPatientMode();
        } else if (this.selectedPatient && value !== this.displayWith(this.selectedPatient)) {
          this.clearSelection(false);
        }
      }
    });

    this.phoneControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (this.isNewPatient) {
        const phone = (value ?? '').toString().trim();
        if (!phone) {
          this.phoneControl.setErrors({ required: true });
        } else if (this.phoneControl.hasError('required')) {
          this.phoneControl.setErrors(null);
        }
        this.patientChange.emit(null);
      } else if (this.selectedPatient) {
        this.selectedPatient = {
          ...this.selectedPatient,
          phone: (value ?? '').toString().trim()
        };
        this.patientChange.emit(this.selectedPatient);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get showNoMatch(): boolean {
    const v = this.searchControl.value;
    if (v && typeof v === 'object') return false;
    const term = (typeof v === 'string' ? v : this.rawSearchText || '').trim().toLowerCase();
    return term.length >= 2 && this.loaded && this.filteredPatients.length === 0 && !this.canCreate;
  }

  get canCreate(): boolean {
    if (this.isNewPatient) return false;
    const v = this.searchControl.value;
    if (v && typeof v === 'object') return false;
    const term = (typeof v === 'string' ? v : this.rawSearchText || '').trim();
    if (term.length < 2) return false;
    const lower = term.toLowerCase();
    return !this.allPatients.some(p => (p.fullName || '').toLowerCase() === lower);
  }

  onFocus(): void {
    this.loadPatients();
  }

  onInput(): void {
    const v = this.searchControl.value;
    if (typeof v === 'string') {
      this.rawSearchText = v;
      this.filterPatients(v);
    }
    this.loadPatients();
  }

  displayWith = (value: any): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if ((value as any).__createPatient) return this.pendingName || this.rawSearchText;
    return value.fullName || '';
  };

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    if (value && (value as any).__createPatient) {
      this.enterNewPatientMode();
      return;
    }
    if (value && value.id) {
      this.isNewPatient = false;
      this.selectedPatient = value;
      this.pendingName = '';
      this.applyPhoneValidators(false);
      this.originalPhone = (value.phone || '').trim();
      this.phoneControl.setValue(value.phone || '', { emitEvent: false });
      this.patientChange.emit(value);
    }
  }

  clearSelection(emit = true): void {
    this.selectedPatient = null;
    this.isNewPatient = false;
    this.pendingName = '';
    this.originalPhone = '';
    this.searchControl.setValue('', { emitEvent: false });
    this.rawSearchText = '';
    this.filteredPatients = this.allPatients;
    this.applyPhoneValidators(false);
    this.phoneControl.setValue('', { emitEvent: false });
    if (emit) this.patientChange.emit(null);
  }

  setPatient(patient: PatientPickerValue): void {
    this.isNewPatient = false;
    this.selectedPatient = patient;
    this.pendingName = '';
    this.rawSearchText = patient.fullName || '';
    this.originalPhone = (patient.phone || '').trim();
    this.searchControl.setValue(patient, { emitEvent: false });
    this.applyPhoneValidators(false);
    this.phoneControl.setValue(patient.phone || '', { emitEvent: false });
    this.patientChange.emit(patient);
  }

  get isValid(): boolean {
    if (this.required && !this.selectedPatient && !this.isNewPatient) return false;
    if (this.isNewPatient) return !!(this.pendingName && (this.phoneControl.value || '').toString().trim());
    return true;
  }

  validatePhoneRequired(): boolean {
    if (!this.isNewPatient) return true;
    const ok = !!(this.phoneControl.value || '').toString().trim();
    if (!ok) {
      this.applyPhoneValidators(true);
      this.phoneControl.markAsTouched();
      this.phoneControl.updateValueAndValidity({ emitEvent: false });
    }
    return ok;
  }

  /** Creates or updates the pending patient; resolves with patient id or null. */
  async ensurePatient(): Promise<PatientPickerValue | null> {
    if (this.selectedPatient && !this.isNewPatient) {
      const typedPhone = (this.phoneControl.value || '').toString().trim();
      if (typedPhone !== this.originalPhone) {
        if (!typedPhone) {
          this.applyPhoneValidators(true);
          this.phoneControl.markAsTouched();
          this.phoneControl.updateValueAndValidity({ emitEvent: false });
          this.notification.error('Phone is required');
          return null;
        }
        if (this.creating) return null;
        this.creating = true;
        try {
          await firstValueFrom(this.api.patch('v1/patients', `${this.selectedPatient.id}/phone`, { phone: typedPhone }));
          this.selectedPatient = { ...this.selectedPatient, phone: typedPhone };
          this.originalPhone = typedPhone;
          this.patientChange.emit(this.selectedPatient);
        } catch (err: any) {
          this.notification.error(err?.message || 'Failed to update phone');
          return null;
        } finally {
          this.creating = false;
        }
      }
      return this.selectedPatient;
    }

    if (!this.isNewPatient) {
      const typed = (this.rawSearchText || this.searchControl.value || '').toString().trim();
      if (!typed || typeof this.searchControl.value === 'object') return null;
      const lower = typed.toLowerCase();
      const exact = this.allPatients.find(p => (p.fullName || '').toLowerCase() === lower);
      if (exact) {
        this.setPatient(exact);
        return exact;
      }
      this.enterNewPatientMode();
    }

    const name = (this.pendingName || this.rawSearchText || '').trim();
    const phone = (this.phoneControl.value || '').toString().trim();
    if (!name) return null;
    if (!phone) {
      this.applyPhoneValidators(true);
      this.phoneControl.markAsTouched();
      this.phoneControl.updateValueAndValidity({ emitEvent: false });
      this.notification.error('Phone is required to create a new patient');
      return null;
    }
    if (this.creating) return null;

    this.creating = true;
    try {
      const res: any = await firstValueFrom(this.api.post('v1/patients', {
        fullName: name,
        firstName: name.split(/\s+/)[0] || name,
        lastName: name.split(/\s+/).slice(1).join(' ') || null,
        phone,
        dateOfBirth: null,
        age: null,
        gender: null,
        bloodGroup: null,
        maritalStatus: null,
        nationality: null,
        occupation: null,
        email: null,
        alternatePhone: null,
        address: null,
        city: null,
        state: null,
        country: null,
        postalCode: null,
        emergencyContactName: null,
        emergencyContactRelation: null,
        emergencyContactPhone: null,
        allergies: null,
        chronicConditions: null,
        insuranceProvider: null,
        insurancePolicyNumber: null,
        nationalId: null
      }));

      const created: PatientPickerValue = {
        id: res?.id,
        mrn: res?.mrn,
        fullName: name,
        phone
      };
      this.isNewPatient = false;
      this.selectedPatient = created;
      this.pendingName = '';
      this.originalPhone = phone;
      this.applyPhoneValidators(false);
      this.allPatients = [created, ...this.allPatients.filter(p => p.id !== created.id)];
      this.filteredPatients = this.allPatients;
      this.searchControl.setValue(created, { emitEvent: false });
      this.phoneControl.setValue(phone, { emitEvent: false });
      this.patientChange.emit(created);
      this.notification.success(`Patient ${name} created`);
      return created;
    } catch (err: any) {
      this.notification.error(err?.message || 'Failed to create patient');
      return null;
    } finally {
      this.creating = false;
    }
  }

  private applyPhoneValidators(required: boolean): void {
    if (required) {
      this.phoneControl.setValidators([Validators.required]);
      const phone = (this.phoneControl.value || '').toString().trim();
      if (!phone) this.phoneControl.setErrors({ required: true });
      else if (this.phoneControl.hasError('required')) this.phoneControl.setErrors(null);
    } else {
      this.phoneControl.clearValidators();
      this.phoneControl.setErrors(null);
    }
    this.phoneControl.updateValueAndValidity({ emitEvent: false });
  }

  private enterNewPatientMode(): void {
    const name = (this.rawSearchText || this.searchControl.value || '').toString().trim();
    if (!name || typeof this.searchControl.value === 'object') return;
    this.selectedPatient = null;
    this.isNewPatient = true;
    this.pendingName = name;
    this.searchControl.setValue(name, { emitEvent: false });
    this.applyPhoneValidators(true);
    this.patientChange.emit(null);
  }

  private exitNewPatientMode(): void {
    this.isNewPatient = false;
    this.pendingName = '';
    this.applyPhoneValidators(false);
    this.phoneControl.setValue('', { emitEvent: false });
  }

  private loadPatients(): void {
    if (this.loaded) return;
    this.api.get<any>('v1/patients/search', { limit: 1000 }).subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : (res?.items || res?.data || res?.results || []);
        this.allPatients = list.map((p: any) => ({
          id: p.id,
          mrn: p.mrn,
          fullName: p.fullName || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
          phone: p.phone || ''
        }));
        this.loaded = true;
        this.filterPatients(this.rawSearchText);
      },
      error: () => {
        this.loaded = true;
      }
    });
  }

  private filterPatients(term: string): void {
    const t = (term || '').toLowerCase().trim();
    if (!t) {
      this.filteredPatients = this.allPatients;
      return;
    }
    this.filteredPatients = this.allPatients.filter(p =>
      (p.fullName || '').toLowerCase().includes(t) ||
      (p.phone || '').toLowerCase().includes(t) ||
      (p.mrn || '').toLowerCase().includes(t)
    );
  }
}
