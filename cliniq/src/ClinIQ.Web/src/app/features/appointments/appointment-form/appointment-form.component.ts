import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

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
      </app-page-header>

      <div class="card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Patient</mat-label>
              <input matInput [matAutocomplete]="patientAuto" formControlName="patientSearch" placeholder="Search patient...">
              <mat-autocomplete #patientAuto="matAutocomplete" [displayWith]="displayPatient" (optionSelected)="onPatientSelected($event)">
                <mat-option *ngFor="let p of filteredPatients" [value]="p">{{ p.fullName }} ({{ p.mrn }})</mat-option>
              </mat-autocomplete>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Doctor</mat-label>
              <mat-select formControlName="doctorId" (selectionChange)="loadAvailableSlots()">
                <mat-option *ngFor="let d of doctors" [value]="d.id">Dr. {{ d.fullName }} - {{ d.specialization }}</mat-option>
              </mat-select>
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
              <mat-select formControlName="timeSlot" [disabled]="noSlots">
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
              <mat-label>Consultation Fee (Rs.)</mat-label>
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
  styles: [`.card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .form-row { display: flex; gap: 1rem; } .form-row mat-form-field { flex: 1; } .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
    .no-slots { display: flex; align-items: center; gap: 8px; padding: 10px 14px; margin: 0 0 1rem; border-radius: 8px; background: #fff7e6; color: #b54708; font-size: 13px; }
    .no-slots mat-icon { font-size: 18px; height: 18px; width: 18px; }`]
})
export class AppointmentFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  saving = false;
  minDate = new Date();
  doctors: any[] = [];
  filteredPatients: any[] = [];
  availableSlots: any[] = [];
  appointmentId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService
  ) {}

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
      appointmentType: ['Consultation', Validators.required],
      appointmentDate: ['', Validators.required],
      timeSlot: ['', Validators.required],
      reason: [''],
      notes: [''],
      consultationFee: ['']
    });
    this.loadDoctors();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.appointmentId = id;
      this.loadAppointment(id);
    }
    const patientId = this.route.snapshot.queryParamMap.get('patientId');
    if (patientId) this.loadPatient(patientId);

    this.form.get('patientSearch')?.valueChanges.subscribe(val => {
      if (typeof val === 'string' && val.length >= 2) {
        this.api.get<any[]>('v1/patients/search', { term: val }).subscribe(r => this.filteredPatients = this.normalizeList(r));
      } else {
        this.filteredPatients = [];
      }
    });
  }

  loadDoctors() {
    this.api.get<any[]>('v1/doctors').subscribe(r => this.doctors = this.normalizeList(r));
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
      // Build the current slot object from appointment data
      const currentSlot = {
        startTime: a.startTime,
        endTime: a.endTime,
        displayTime: a.startTime && a.endTime
          ? `${this.formatTime(a.startTime)} - ${this.formatTime(a.endTime)}`
          : a.startTime
      };

      // Patch form values
      this.form.patchValue({
        patientId: a.patientId,
        patientSearch: a.patient ? { id: a.patientId, fullName: a.patientName, mrn: a.patient?.mrn, phone: a.patient?.phone } : a.patientId,
        doctorId: a.doctorId,
        appointmentType: a.appointmentType || a.type || 'Consultation',
        appointmentDate: a.appointmentDate,
        timeSlot: currentSlot,
        reason: a.reason || a.chiefComplaint,
        notes: a.notes,
        consultationFee: a.consultationFee
      });

      // Load available slots and inject current slot if not already present
      if (a.doctorId && a.appointmentDate) {
        this.api.get<any[]>('v1/doctors/available-slots', { doctorId: a.doctorId, date: this.toDateParam(a.appointmentDate) }).subscribe(r => {
          const slots = this.normalizeList<any>(r);
          // Check if current slot exists in available slots (by startTime)
          const hasCurrentSlot = slots.some((s: any) => s.startTime === a.startTime);
          if (!hasCurrentSlot && a.startTime) {
            // Inject current slot at the beginning
            slots.unshift(currentSlot);
          }
          this.availableSlots = slots;
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

  private formatTime(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHours = h % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  }

  displayPatient(p: any): string {
    return p ? `${p.fullName || p.firstName + ' ' + p.lastName || 'Patient'} (${p.mrn || p.id || ''})` : '';
  }

  onPatientSelected(e: any) {
    this.form.patchValue({ patientId: e.option.value.id });
  }

  printAppointment(): void {
    if (this.appointmentId) {
      window.open(`/appointments/${this.appointmentId}/print`, '_blank');
    }
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