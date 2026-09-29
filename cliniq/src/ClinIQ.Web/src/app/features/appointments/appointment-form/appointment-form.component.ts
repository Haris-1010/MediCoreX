import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService } from '../../../core/services/tenant.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PatientPickerComponent, PatientPickerValue } from '../../../shared/components/patient-picker/patient-picker.component';

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
          <div class="form-row patient-row">
            <app-patient-picker
              #patientPicker
              label="Patient"
              [required]="true"
              (patientChange)="onPatientChange($event)">
            </app-patient-picker>
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
                    <span class="name">Dr. {{ d.fullName }}<span *ngIf="d.specialization"> - ({{ d.specialization }})</span></span>
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
              <input matInput [matDatepicker]="picker" formControlName="appointmentDate"
                     [min]="minDate" [max]="maxDate" [matDatepickerFilter]="dateFilter"
                     (dateChange)="loadAvailableSlots()">
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
    .patient-row { align-items: stretch; }

    :host ::ng-deep .patient-option-item { display: flex; flex-direction: column; padding: 4px 0; }
    :host ::ng-deep .patient-option-item .name { font-weight: 500; }
    :host ::ng-deep .patient-option-item .details { font-size: 0.75rem; color: var(--text-muted, #888); }

    :host ::ng-deep .doctor-option-item { display: flex; flex-direction: column; padding: 4px 0; }
    :host ::ng-deep .doctor-option-item .name { font-weight: 500; }
    :host ::ng-deep .doctor-option-item .details { font-size: 0.75rem; color: var(--text-muted, #888); }

    :host ::ng-deep .mat-mdc-autocomplete-panel { max-height: 300px !important; border-radius: 8px !important; border: 1px solid var(--border-color, #c5cae9) !important; box-shadow: var(--shadow-lg, 0 4px 16px rgba(0,0,0,0.12)) !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option { padding: 10px 16px !important; line-height: 1.4 !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option:hover { background-color: var(--bg-secondary, #e8eaf6) !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option.mat-mdc-option-active { background-color: var(--bg-badge, #c5cae9) !important; }
  `]
})
export class AppointmentFormComponent implements OnInit, OnDestroy {
  @ViewChild('patientPicker') patientPicker!: PatientPickerComponent;

  form!: FormGroup;
  isEditMode = false;
  saving = false;
  minDate = new Date();
  maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  availableDates: Set<string> | null = null;
  doctors: any[] = [];
  availableSlots: any[] = [];
  appointmentId: string | null = null;
  currencySymbol = '';
  selectedPatient: any = null;
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
      patientId: [''],
      doctorId: ['', Validators.required],
      doctorSearch: [''],
      appointmentType: ['Consultation', Validators.required],
      appointmentDate: ['', Validators.required],
      timeSlot: ['', Validators.required],
      reason: [''],
      notes: [''],
      consultationFee: ['']
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
  }

  onPatientChange(patient: PatientPickerValue | null) {
    this.selectedPatient = patient;
    this.form.patchValue({ patientId: patient?.id || '' });
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
    const spec = d.specialization ? ` - (${d.specialization})` : '';
    return `Dr. ${d.fullName || ''}${spec}`;
  }

  onDoctorSelected(e: any) {
    const doctor = e.option.value;
    this.form.patchValue({ doctorId: doctor.id, doctorSearch: this.displayDoctor(doctor) });
    this.loadAvailableDates();
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
      this.form.patchValue({ patientId: p.id });
      this.patientPicker?.setPatient({
        id: p.id,
        mrn: p.mrn,
        fullName: p.fullName || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
        phone: p.phone
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
        doctorId: a.doctorId,
        doctorSearch: a.doctorName || '',
        appointmentType: mappedType,
        appointmentDate: new Date(a.appointmentDate),
        reason: a.reason || a.chiefComplaint,
        notes: a.notes,
        consultationFee: a.consultationFee
      });

      if (a.patientId) {
        this.api.getById<any>('v1/patients', a.patientId).subscribe(p => {
          this.patientPicker?.setPatient({
            id: p.id,
            mrn: p.mrn,
            fullName: p.fullName || a.patientName || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
            phone: p.phone || a.patient?.phone
          });
        });
      }

      // Now load available slots, then set timeSlot
      if (a.doctorId && a.appointmentDate) {
        this.loadAvailableDates();
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

  dateFilter = (d: Date | null): boolean => {
    if (!d || !this.availableDates) return true;
    return this.availableDates.has(this.toDateParam(d));
  };

  loadAvailableDates() {
    const doctorId = this.form.value.doctorId;
    if (!doctorId) {
      this.availableDates = null;
      return;
    }
    const start = this.toDateParam(new Date());
    const end = this.toDateParam(this.maxDate);
    this.api.get<any>('v1/doctors/available-dates', { doctorId, start, end }).subscribe({
      next: (r) => {
        if (this.form.value.doctorId !== doctorId) return;
        const dates = Array.isArray(r) ? r : (r?.dates ?? []);
        this.availableDates = new Set<string>(dates);
      },
      error: () => {
        if (this.form.value.doctorId === doctorId) this.availableDates = null;
      }
    });
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

  async onSubmit() {
    if (this.saving) return;
    const patient = await this.patientPicker?.ensurePatient();
    if (!patient && !this.form.value.patientId) {
      this.form.get('patientId')?.markAsTouched();
      this.form.get('patientId')?.setErrors({ required: true });
      this.notification.error('Please select or create a patient');
      return;
    }
    if (patient) this.form.patchValue({ patientId: patient.id });
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