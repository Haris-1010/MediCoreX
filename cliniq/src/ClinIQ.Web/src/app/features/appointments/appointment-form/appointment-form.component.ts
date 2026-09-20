import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService } from '../../../core/services/tenant.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-appointment-form',
  template: `
    <app-main-layout>
      <app-page-header [title]="isEditMode ? 'Edit Appointment' : 'New Appointment'"
        [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Appointments', route: '/appointments' }, { label: isEditMode ? 'Edit' : 'New' }]">
        <button mat-icon-button *ngIf="isEditMode" (click)="printAppointment()" matTooltip="Print Appointment">
          <mat-icon>print</mat-icon>
        </button>
        <button mat-icon-button color="warn" *ngIf="isEditMode" (click)="deleteAppointment()" matTooltip="Delete Appointment">
          <mat-icon>delete</mat-icon>
        </button>
      </app-page-header>

      <div class="card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="flex-grow">
              <mat-label>Patient</mat-label>
              <input matInput [matAutocomplete]="patientAuto" formControlName="patientSearch" placeholder="Search patient by name or phone..." (focus)="onPatientFocus()" (input)="onPatientSearchInput($event)">
              <mat-icon matPrefix>search</mat-icon>
              <mat-autocomplete #patientAuto="matAutocomplete" [displayWith]="displayPatient" (optionSelected)="onPatientSelected($event)">
                <mat-option *ngFor="let p of filteredPatients" [value]="p">
                  <div class="patient-option-item">
                    <span class="name">{{ p.fullName }} ({{ p.phone || 'No phone' }})</span>
                  </div>
                </mat-option>
                <mat-option *ngIf="showQuickAdd" (click)="openQuickAddDialog()" class="quick-add-option">
                  <mat-icon>person_add</mat-icon>
                  <span>Quick Add New Patient: "{{ searchTerm }}"</span>
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>
            <button mat-stroked-button type="button" class="quick-add-btn" (click)="openQuickAddDialog()">
              <mat-icon>person_add</mat-icon> Quick Add
            </button>
          </div>

          <!-- Selected Patient Card -->
          <div class="selected-patient-card" *ngIf="selectedPatient">
            <mat-icon>person</mat-icon>
            <div class="patient-info">
              <strong>{{ selectedPatient.fullName }}</strong>
              <span>{{ selectedPatient.phone || 'No phone' }}</span>
            </div>
            <button mat-icon-button type="button" (click)="clearPatient()"><mat-icon>close</mat-icon></button>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Doctor</mat-label>
              <input matInput [matAutocomplete]="doctorAuto" formControlName="doctorSearch"
                     placeholder="Search doctor by name or specialty..."
                     (focus)="onDoctorFocus()" (input)="onDoctorInput($event)">
              <mat-icon matPrefix>search</mat-icon>
              <mat-autocomplete #doctorAuto="matAutocomplete" [displayWith]="displayDoctor"
                               (optionSelected)="onDoctorSelected($event)">
                <mat-option *ngFor="let d of filteredDoctors" [value]="d">
                  <div class="doctor-option-item">
                    <span class="name">Dr. {{ d.fullName }}</span>
                    <span class="details">{{ d.specialization || '' }}</span>
                  </div>
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Appointment Type</mat-label>
              <mat-select formControlName="appointmentType">
                <mat-option value="Consultation">Consultation</mat-option>
                <mat-option value="FollowUp">Follow Up</mat-option>
                <mat-option value="Procedure">Procedure</mat-option>
                <mat-option value="Emergency">Emergency</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="appointmentDate" [min]="minDate" (dateChange)="loadAvailableSlots()">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Time Slot</mat-label>
              <mat-select formControlName="timeSlot" [disabled]="noSlots" [compareWith]="compareSlot">
                <mat-option *ngFor="let slot of availableSlots" [value]="slot" [disabled]="slot.reserved">
                  <span *ngIf="slot.reserved; else availableSlot">{{ slot.displayTime }} - Reserved ({{ slot.patientName }})</span>
                  <ng-template #availableSlot>{{ slot.displayTime }}</ng-template>
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="no-slots" *ngIf="noSlots">
            <mat-icon>event_busy</mat-icon>
            <span>Slot not available — the selected doctor is not scheduled on this day.</span>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Consultation Fee ({{ currencySymbol }})</mat-label>
              <input matInput type="number" min="0" step="0.01" formControlName="consultationFee">
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Reason for Visit</mat-label>
            <textarea matInput formControlName="reason" rows="3"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Notes</mat-label>
            <textarea matInput formControlName="notes" rows="2"></textarea>
          </mat-form-field>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/appointments">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving || noSlots">
              {{ saving ? 'Saving...' : (isEditMode ? 'Update' : 'Book') }} Appointment
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>

    <!-- Quick Add Patient Dialog -->
    <ng-template #quickAddDialog>
      <h2 mat-dialog-title>
        <mat-icon>person_add</mat-icon> Quick Add Patient
      </h2>
      <mat-dialog-content>
        <form [formGroup]="quickPatientForm">
          <div class="dialog-form-row">
            <mat-form-field appearance="outline" class="flex-grow">
              <mat-label>First Name *</mat-label>
              <input matInput formControlName="firstName" placeholder="First name">
              <mat-error>Required</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="flex-grow">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" placeholder="Last name">
            </mat-form-field>
          </div>
          <div class="dialog-form-row">
            <mat-form-field appearance="outline" class="flex-grow">
              <mat-label>Phone</mat-label>
              <input matInput formControlName="phone" placeholder="Phone number">
            </mat-form-field>
            <mat-form-field appearance="outline" class="flex-grow">
              <mat-label>Gender</mat-label>
              <mat-select formControlName="gender">
                <mat-option value="Male">Male</mat-option>
                <mat-option value="Female">Female</mat-option>
                <mat-option value="Other">Other</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <div class="dialog-form-row">
            <mat-form-field appearance="outline" class="flex-grow">
              <mat-label>Age *</mat-label>
              <input matInput type="number" formControlName="age" placeholder="Years" min="0" max="150" (input)="onAgeChange()">
              <span matSuffix>years</span>
              <mat-error>Required</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="flex-grow">
              <mat-label>Date of Birth (auto)</mat-label>
              <input matInput [matDatepicker]="dobPicker2" formControlName="dateOfBirth" readonly placeholder="Auto-calculated">
              <mat-datepicker-toggle matSuffix [for]="dobPicker2"></mat-datepicker-toggle>
              <mat-datepicker #dobPicker2></mat-datepicker>
            </mat-form-field>
          </div>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" (click)="saveQuickPatient()" [disabled]="quickPatientForm.invalid || savingPatient">
          <mat-spinner *ngIf="savingPatient" diameter="20"></mat-spinner>
          Save & Select
        </button>
      </mat-dialog-actions>
    </ng-template>
  `,
  styles: [`
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; box-shadow: var(--shadow-sm, 0 2px 4px rgba(0,0,0,0.1)); }
    .form-row { display: flex; gap: 1rem; align-items: flex-start; }
    .form-row mat-form-field { flex: 1; }
    .flex-grow { flex: 1; }
    .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
    .no-slots { display: flex; align-items: center; gap: 8px; padding: 10px 14px; margin: 0 0 1rem; border-radius: 8px; background: var(--status-warning-bg, #fff3e0); color: var(--text-warning, #b54708); font-size: 13px; }
    .no-slots mat-icon { font-size: 18px; height: 18px; width: 18px; }

    .quick-add-btn { height: 56px; white-space: nowrap; }

    .selected-patient-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: #e8eaf6;
      border-radius: 8px;
      margin: 0.5rem 0 1rem;
    }
    .selected-patient-card mat-icon { color: #3f51b5; }
    .selected-patient-card .patient-info { flex: 1; }
    .selected-patient-card .patient-info strong { display: block; }
    .selected-patient-card .patient-info span { font-size: 0.8rem; color: var(--text-muted, #666); }

    :host ::ng-deep .patient-option-item { display: flex; flex-direction: column; padding: 4px 0; }
    :host ::ng-deep .patient-option-item .name { font-weight: 500; }
    :host ::ng-deep .patient-option-item .details { font-size: 0.75rem; color: #888; }
    :host ::ng-deep .quick-add-option { color: #3f51b5; font-weight: 500; }
    :host ::ng-deep .quick-add-option mat-icon { margin-right: 8px; vertical-align: middle; }

    :host ::ng-deep .mat-mdc-dialog-title { display: flex; align-items: center; gap: 0.5rem; }
    .dialog-form-row { display: flex; gap: 1rem; }

    :host ::ng-deep .doctor-option-item { display: flex; flex-direction: column; padding: 4px 0; }
    :host ::ng-deep .doctor-option-item .name { font-weight: 500; }
    :host ::ng-deep .doctor-option-item .details { font-size: 0.75rem; color: #888; }

    :host ::ng-deep .mat-mdc-autocomplete-panel { max-height: 300px !important; border-radius: 8px !important; border: 1px solid var(--border-color, #c5cae9) !important; box-shadow: var(--shadow-lg, 0 4px 16px rgba(0,0,0,0.12)) !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option { padding: 10px 16px !important; line-height: 1.4 !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option:hover { background-color: #e8eaf6 !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option.mat-mdc-option-active { background-color: #c5cae9 !important; }
  `]
})
export class AppointmentFormComponent implements OnInit, OnDestroy {
  @ViewChild('quickAddDialog') quickAddDialog!: TemplateRef<any>;

  form!: FormGroup;
  quickPatientForm!: FormGroup;
  isEditMode = false;
  saving = false;
  savingPatient = false;
  minDate = new Date();
  doctors: any[] = [];
  filteredPatients: any[] = [];
  availableSlots: any[] = [];
  appointmentId: string | null = null;
  currencySymbol = '';
  selectedPatient: any = null;
  searchTerm = '';
  showQuickAdd = false;
  allPatients: any[] = [];
  filteredDoctors: any[] = [];
  allDoctors: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService,
    private tenantService: TenantService,
    private dialog: MatDialog
  ) {
    this.currencySymbol = tenantService.getCurrencySymbol();
  }

  private normalizeList<T>(value: any): T[] {
    if (Array.isArray(value)) return value as T[];
    if (!value || typeof value !== 'object') return [];
    if (Array.isArray(value.items)) return value.items as T[];
    if (Array.isArray(value.data)) return value.data as T[];
    if (Array.isArray(value.results)) return value.results as T[];
    if (Array.isArray(value.patients)) return value.patients as T[];
    if (Array.isArray(value.slots)) return value.slots as T[];
    return [];
  }

  ngOnInit() {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      patientSearch: [''],
      doctorId: ['', Validators.required],
      doctorSearch: [''],
      appointmentType: ['Consultation', Validators.required],
      appointmentDate: ['', Validators.required],
      timeSlot: ['', Validators.required],
      reason: [''],
      notes: [''],
      consultationFee: ['']
    });

    this.quickPatientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      phone: [''],
      gender: [''],
      age: [null, [Validators.required, Validators.min(0), Validators.max(150)]],
      dateOfBirth: [{ value: null, disabled: true }]
    });

    const id = this.route.snapshot.paramMap.get('id');
    const patientIdQueryParam = this.route.snapshot.queryParamMap.get('patientId');

    // Load doctors first, then load appointment so doctorId can be matched
    this.loadDoctors(() => {
      if (id) {
        this.isEditMode = true;
        this.appointmentId = id;
        this.loadAppointment(id);
      }
      if (patientIdQueryParam) this.loadPatient(patientIdQueryParam);
    });

    // Patient and doctor data loaded on focus
  }

  onPatientFocus() {
    if (this.allPatients.length === 0) {
      this.api.get<any[]>('v1/patients/search', { limit: 1000 }).subscribe(r => {
        this.allPatients = this.normalizeList(r);
        this.filteredPatients = this.allPatients;
      });
    }
  }

  onPatientSearchInput(event: any) {
    this.searchTerm = event.target.value || '';
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.filteredPatients = this.allPatients;
      this.showQuickAdd = false;
      return;
    }
    this.filteredPatients = this.allPatients.filter(p =>
      (p.fullName || '').toLowerCase().includes(term) ||
      (p.phone || '').toLowerCase().includes(term) ||
      (p.mrn || '').toLowerCase().includes(term)
    );
    this.showQuickAdd = this.searchTerm.length >= 2 && this.filteredPatients.length === 0;
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
    this.form.patchValue({ doctorId: doctor.id, doctorSearch: doctor.fullName });
    this.loadAvailableSlots();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDoctors(callback?: () => void) {
    this.api.get<any[]>('v1/doctors').subscribe(r => {
      this.doctors = this.normalizeList(r);
      callback?.();
    });
  }

  loadPatient(id: string) {
    this.api.getById<any>('v1/patients', id).subscribe(p => {
      this.form.patchValue({
        patientId: p.id,
        patientSearch: { id: p.id, fullName: p.fullName, mrn: p.mrn, phone: p.phone }
      });
    });
  }

  loadAppointment(id: string) {
    this.api.getById<any>('v1/appointments', id).subscribe(a => {
      // Map API appointment type to form value
      const apiType = (a.appointmentType || a.type || '').toLowerCase();
      let mappedType = 'Consultation';
      if (apiType.includes('newconsultation') || apiType === '1') {
        mappedType = 'Consultation';
      } else if (apiType.includes('followup') || apiType.includes('follow_up') || apiType === '2') {
        mappedType = 'FollowUp';
      } else if (apiType.includes('procedure')) {
        mappedType = 'Procedure';
      } else if (apiType.includes('emergency')) {
        mappedType = 'Emergency';
      }

      // Normalize startTime
      const normalizeTime = (t: string) => {
        if (!t) return '';
        const parts = t.split(':');
        if (parts.length === 2) {
          return parts[0].padStart(2, '0') + ':' + parts[1].padStart(2, '0');
        }
        return t;
      };
      const normalizedStartTime = normalizeTime(a.startTime);

      // Patch form WITHOUT timeSlot first (slots not loaded yet)
      this.form.patchValue({
        patientId: a.patientId,
        patientSearch: a.patient ? { id: a.patientId, fullName: a.patientName, mrn: a.patient?.mrn, phone: a.patient?.phone } : a.patientId,
        doctorId: a.doctorId,
        doctorSearch: a.doctorName || '',
        appointmentType: mappedType,
        appointmentDate: new Date(a.appointmentDate),
        reason: a.reason || a.chiefComplaint,
        notes: a.notes,
        consultationFee: a.consultationFee
      });

      // Now load available slots, then set timeSlot
      if (a.doctorId && a.appointmentDate) {
        this.api.get<any[]>('v1/doctors/available-slots', { doctorId: a.doctorId, date: this.toDateParam(a.appointmentDate) }).subscribe(r => {
          const slots = this.normalizeList<any>(r);

          // Check if current slot exists in available slots
          const hasCurrentSlot = slots.some((s: any) => normalizeTime(s.startTime) === normalizedStartTime);
          if (!hasCurrentSlot && normalizedStartTime) {
            slots.unshift({
              startTime: normalizedStartTime,
              endTime: a.endTime ? normalizeTime(a.endTime) : '',
              displayTime: a.startTime && a.endTime
                ? `${this.formatTime(a.startTime)} - ${this.formatTime(a.endTime)}`
                : this.formatTime(a.startTime),
              reserved: false
            });
          }
          this.availableSlots = slots;

          // Wait for Angular to render options, then set timeSlot
          requestAnimationFrame(() => {
            const matchingSlot = this.availableSlots.find((s: any) => normalizeTime(s.startTime) === normalizedStartTime);
            if (matchingSlot) {
              this.form.get('timeSlot')!.setValue(matchingSlot);
            }
          });
        });
      }
    });
  }

  private toDateParam(date: Date | string): string {
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return String(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  loadAvailableSlots() {
    const { doctorId, appointmentDate } = this.form.value;
    if (doctorId && appointmentDate) {
      this.api.get<any[]>('v1/doctors/available-slots', { doctorId: doctorId, date: this.toDateParam(appointmentDate) }).subscribe(r => {
        const slots = this.normalizeList<any>(r);
        this.availableSlots = slots;
        if (slots.length > 0 && !this.form.value.consultationFee) {
          this.form.patchValue({ consultationFee: slots[0].consultationFee ?? '' });
        }
      });
    } else {
      this.availableSlots = [];
    }
  }

  get noSlots(): boolean {
    return !!this.form?.value.doctorId && !!this.form?.value.appointmentDate && this.availableSlots.length === 0;
  }

  compareSlot(a: any, b: any): boolean {
    if (!a || !b) return false;
    const normalizeTime = (t: string) => {
      if (!t) return '';
      const parts = t.split(':');
      return parts.length === 2 ? parts[0].padStart(2, '0') + ':' + parts[1].padStart(2, '0') : t;
    };
    return normalizeTime(a.startTime) === normalizeTime(b.startTime);
  }

  private formatTime(time: string): string {
    if (!time) return '';
    // Handle "HH:mm" format (e.g., "09:00")
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':');
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayHours = h % 12 || 12;
      return `${displayHours}:${minutes} ${ampm}`;
    }
    return time;
  }

  displayPatient(p: any): string {
    if (!p) return '';
    if (typeof p === 'string') return p;
    return `${p.fullName || p.firstName + ' ' + p.lastName || 'Patient'} (${p.phone || 'No phone'})`;
  }

  onPatientSelected(e: any) {
    const patient = e.option.value;
    this.selectedPatient = patient;
    this.form.patchValue({ patientId: patient.id, patientSearch: patient.fullName || patient });
    this.showQuickAdd = false;
  }

  clearPatient() {
    this.selectedPatient = null;
    this.form.patchValue({ patientId: '', patientSearch: '' });
  }

  openQuickAddDialog() {
    this.quickPatientForm.reset({ firstName: this.searchTerm, lastName: '', phone: '', gender: '', age: null, dateOfBirth: null });
    this.dialog.open(this.quickAddDialog, { width: '550px', disableClose: true });
  }

  onAgeChange() {
    const age = this.quickPatientForm.get('age')?.value;
    if (age !== null && age !== undefined && age >= 0 && age <= 150) {
      const today = new Date();
      const dob = new Date(today.getFullYear() - age, today.getMonth(), today.getDate());
      this.quickPatientForm.get('dateOfBirth')?.setValue(dob);
    } else {
      this.quickPatientForm.get('dateOfBirth')?.setValue(null);
    }
  }

  saveQuickPatient() {
    if (this.quickPatientForm.invalid) return;
    this.savingPatient = true;

    const formVal = this.quickPatientForm.getRawValue();

    let dob = formVal.dateOfBirth;
    if (!dob && formVal.age >= 0) {
      const today = new Date();
      dob = new Date(today.getFullYear() - formVal.age, today.getMonth(), today.getDate());
    }

    const payload = {
      firstName: formVal.firstName,
      lastName: formVal.lastName || '',
      phone: formVal.phone || '',
      gender: formVal.gender || '',
      dateOfBirth: dob ? dob.toISOString() : null
    };

    this.api.post<any>('v1/opd/quick-patient', payload).subscribe({
      next: (res) => {
        this.savingPatient = false;
        this.dialog.closeAll();

        const patientData = {
          id: res.id,
          mrn: res.mrn,
          fullName: res.fullName,
          phone: res.phone
        };
        this.selectedPatient = patientData;
        this.form.patchValue({ patientId: patientData.id, patientSearch: patientData.fullName });

        this.notification.success(`Patient ${patientData.fullName} created successfully`);
      },
      error: () => this.savingPatient = false
    });
  }

  printAppointment(): void {
    if (this.appointmentId) {
      window.open(`/appointments/${this.appointmentId}/print`, '_blank');
    }
  }

  deleteAppointment(): void {
    if (!this.appointmentId) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Appointment',
        message: 'Are you sure you want to delete this appointment? This action cannot be undone.',
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.api.delete('v1/appointments', this.appointmentId!).subscribe({
          next: () => {
            this.notification.success('Appointment deleted successfully');
            this.router.navigate(['/appointments']);
          },
          error: () => this.notification.error('Failed to delete appointment')
        });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving = true;
    const timeSlot = this.form.value.timeSlot;
    const startTime = timeSlot?.startTime || timeSlot;
    const data = {
      ...this.form.value,
      appointmentDate: this.toDateParam(this.form.value.appointmentDate),
      startTime: startTime,
      endTime: timeSlot?.endTime,
      chiefComplaint: this.form.value.reason,
      reason: this.form.value.reason
    };
    const req = this.isEditMode
      ? this.api.put('v1/appointments', this.route.snapshot.paramMap.get('id')!, data)
      : this.api.post('v1/appointments', data);
    req.subscribe({
      next: () => {
        this.notification.success('Appointment saved');
        this.router.navigate(['/appointments']);
      },
      error: () => this.saving = false
    });
  }
}