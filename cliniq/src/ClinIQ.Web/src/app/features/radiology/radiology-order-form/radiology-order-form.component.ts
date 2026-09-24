import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PatientPickerComponent, PatientPickerValue } from '../../../shared/components/patient-picker/patient-picker.component';

@Component({
  standalone: false,
  selector: 'app-radiology-order-form',
  template: `
    <app-main-layout>
      <app-page-header title="New Radiology Order" [breadcrumbs]="[{ label: 'Radiology', route: '/radiology' }, { label: 'New Order' }]"></app-page-header>
      <div class="order-form-card">
        <form [formGroup]="orderForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <!-- Patient -->
            <div class="patient-field">
              <app-patient-picker
                #patientPicker
                label="Patient"
                [required]="true"
                (patientChange)="onPatientChange($event)">
              </app-patient-picker>
            </div>

            <!-- Doctor -->
            <mat-form-field appearance="outline">
              <mat-label>Ordering Doctor *</mat-label>
              <input matInput [matAutocomplete]="doctorAuto" formControlName="doctorSearch" placeholder="Search doctor by name or specialty..." (focus)="onDoctorFocus()" (input)="onDoctorInput($event)">
              <mat-icon matPrefix>search</mat-icon>
              <mat-autocomplete #doctorAuto="matAutocomplete" [displayWith]="displayDoctor" (optionSelected)="onDoctorSelected($event)">
                <mat-option *ngFor="let d of filteredDoctors" [value]="d">
                  <div class="autocomplete-option">
                    <span class="name">Dr. {{ d.fullName }}<span *ngIf="d.specialization"> - ({{ d.specialization }})</span></span>
                  </div>
                </mat-option>
              </mat-autocomplete>
              <mat-error>Doctor is required</mat-error>
            </mat-form-field>

            <!-- Priority -->
            <mat-form-field appearance="outline">
              <mat-label>Priority</mat-label>
              <mat-select formControlName="priority">
                <mat-option value="Routine">Routine</mat-option>
                <mat-option value="Urgent">Urgent</mat-option>
                <mat-option value="STAT">STAT</mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Clinical Indication -->
            <mat-form-field appearance="outline">
              <mat-label>Clinical Indication *</mat-label>
              <textarea matInput formControlName="clinicalIndication" rows="2" placeholder="Reason for imaging study..."></textarea>
              <mat-error>Clinical indication is required</mat-error>
            </mat-form-field>
          </div>

          <!-- Service Selection -->
          <div class="services-section">
            <label class="section-label">Select Radiology Investigations</label>
            <p class="help-text" *ngIf="radiologyServices.length === 0">No radiology services configured. Please add from Administration &rarr; Services.</p>
            <div class="service-chips" *ngIf="radiologyServices.length > 0">
              <mat-chip-listbox multiple formControlName="selectedServices" (change)="onServiceSelectionChange()">
                <mat-chip-option *ngFor="let service of radiologyServices" [value]="service.id">
                  {{ service.name }} <span class="service-price">Rs. {{ service.price }}</span>
                </mat-chip-option>
              </mat-chip-listbox>
            </div>

            <div class="selected-services" *ngIf="selectedServiceItems.length > 0">
              <h4>Selected Investigations</h4>
              <table class="services-table">
                <thead><tr><th>Investigation</th><th>Code</th><th>Modality</th><th>Body Part</th><th>Price</th><th></th></tr></thead>
                <tbody>
                  <tr *ngFor="let s of selectedServiceItems; let i = index">
                    <td><strong>{{ s.name }}</strong></td>
                    <td>{{ s.code }}</td>
                   <td>
  <mat-form-field appearance="outline" class="compact-field">
    <input matInput [(ngModel)]="s._modality" [ngModelOptions]="{standalone: true}" placeholder="CT / MRI">
  </mat-form-field>
</td>
<td>
  <mat-form-field appearance="outline" class="compact-field">
    <input matInput [(ngModel)]="s._bodyPart" [ngModelOptions]="{standalone: true}" placeholder="Chest / Brain">
  </mat-form-field>
</td>
                    <td>
  <mat-form-field appearance="outline" class="compact-field price-field">
    <input matInput type="number" [(ngModel)]="s._price" [ngModelOptions]="{standalone: true}" min="0" placeholder="0">
  </mat-form-field>
</td>
                    <td><button mat-icon-button color="warn" type="button" (click)="removeService(s.id)"><mat-icon>remove_circle</mat-icon></button></td>
                  </tr>
                </tbody>
                <tfoot><tr><td colspan="4" class="total-label">Total</td><td class="total-price"><strong>Rs. {{ totalPrice }}</strong></td><td></td></tr></tfoot>
              </table>
            </div>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Special Instructions</mat-label>
            <textarea matInput formControlName="specialInstructions" rows="2" placeholder="Any special preparation or instructions..."></textarea>
          </mat-form-field>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/radiology">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="orderForm.invalid || saving || selectedServiceItems.length === 0">
              {{ saving ? 'Submitting...' : 'Submit Order' }}
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .order-form-card {
      background: var(--bg-card, #fff);
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid var(--border-color, #e2e8f0);
      box-shadow: var(--shadow-sm);
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .form-grid mat-form-field { width: 100%; }
    .full-width { grid-column: 1 / -1; }
    .selected-patient-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: var(--badge-info-bg, #e3f2fd);
      border-radius: 8px;
      margin: 0 0 1rem;
      grid-column: 1 / -1;
    }
    .selected-patient-card mat-icon { color: var(--accent-primary, #3f51b5); }
    .selected-patient-card .patient-info { flex: 1; }
    .selected-patient-card .patient-info strong { display: block; }
    .selected-patient-card .patient-info span { font-size: 0.8rem; color: var(--text-muted, #666); }
    .services-section { margin-bottom: 1rem; }
    .section-label { display: block; font-weight: 500; margin-bottom: 0.5rem; color: var(--text-primary, #333); }
    .help-text { color: var(--text-secondary, #666); font-size: 0.85rem; font-style: italic; }
    .service-chips mat-chip-listbox { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .service-price { margin-left: 6px; font-size: 0.75rem; opacity: 0.7; }
    .selected-services { margin-top: 1rem; }
    .selected-services h4 { margin: 0 0 0.5rem; font-size: 0.95rem; }
    .services-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    .services-table th {
  padding: 8px 10px; background: var(--accent-primary, #1a237e); color: white; padding: 8px 12px; text-align: left; }
   
    .services-table td {
  padding: 6px 10px;
  vertical-align: middle;  border-bottom: 1px solid var(--border-color, #eee); }
    .services-table tfoot td { font-weight: 600; border-top: 2px solid var(--accent-primary, #1a237e); }
    .total-label { text-align: right; }
    .total-price { color: var(--accent-primary, #1a237e); font-size: 1rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color, #eee); }
  .compact-field {
  width: 110px;
  margin: 0 !important;
}

.compact-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {
  display: none;
}

.compact-field ::ng-deep .mat-mdc-text-field-wrapper {
  padding: 0 6px !important;
  height: 32px !important;
}

.compact-field ::ng-deep .mat-mdc-form-field-flex {
  align-items: center;
  min-height: 32px !important;
  height: 32px !important;
}

.compact-field ::ng-deep .mat-mdc-form-field-infix {
  padding: 0 !important;
  min-height: 32px !important;
  border-top: none !important;
}

.compact-field ::ng-deep .mat-mdc-input-element {
  padding: 0 !important;
  font-size: 0.8rem !important;
  line-height: 32px !important;
  height: 32px !important;
}
.price-field {
  width: 90px;
  margin: 0 !important;
}
 


  `]
})
export class RadiologyOrderFormComponent implements OnInit {
  @ViewChild('patientPicker') patientPicker!: PatientPickerComponent;

  orderForm!: FormGroup;
  selectedPatient: any = null;
  saving = false;
  filteredDoctors: any[] = [];
  allDoctors: any[] = [];
  radiologyServices: any[] = [];
  selectedServiceItems: any[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.orderForm = this.fb.group({
      patientId: [''],
      doctorId: ['', Validators.required],
      doctorSearch: [''],
      priority: ['Routine'],
      clinicalIndication: ['', Validators.required],
      specialInstructions: [''],
      selectedServices: [[]]
    });

    this.api.get<any>('v1/radiology/services').subscribe({
      next: r => this.radiologyServices = this.normalizeList(r),
      error: () => this.notification.error('Failed to load radiology services')
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

  onPatientChange(patient: PatientPickerValue | null) {
    this.selectedPatient = patient;
    this.orderForm.patchValue({ patientId: patient?.id || '' });
  }

  onDoctorFocus() {
    if (this.allDoctors.length === 0) {
      this.api.get<any>('v1/doctors').subscribe({
        next: r => {
          this.allDoctors = this.normalizeList(r);
          this.filteredDoctors = this.allDoctors;
        },
        error: () => this.notification.error('Failed to load doctors')
      });
    }
  }

  onDoctorInput(event: any) {
    const term = (event.target.value || '').toLowerCase();
    if (!term) { this.filteredDoctors = this.allDoctors; return; }
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
    this.orderForm.patchValue({ doctorId: doctor.id, doctorSearch: doctor });
  }

  onServiceSelectionChange() {
    const selectedIds = this.orderForm.value.selectedServices || [];
    this.selectedServiceItems = this.radiologyServices
      .filter(s => selectedIds.includes(s.id))
      .map(s => ({ ...s, _price: s.price }));
  }

  removeService(id: string) {
    this.selectedServiceItems = this.selectedServiceItems.filter(s => s.id !== id);
    const current = this.orderForm.value.selectedServices || [];
    this.orderForm.patchValue({ selectedServices: current.filter((c: string) => c !== id) });
  }

  get totalPrice(): number {
    return this.selectedServiceItems.reduce((sum, s) => sum + (s._price || 0), 0);
  }

  async onSubmit() {
    if (this.saving) return;
    const patient = await this.patientPicker?.ensurePatient();
    if (patient) this.orderForm.patchValue({ patientId: patient.id });
    if (!this.orderForm.value.patientId) {
      this.notification.error('Please select or create a patient');
      return;
    }
    if (this.orderForm.invalid || this.selectedServiceItems.length === 0) {
      if (this.selectedServiceItems.length === 0) this.notification.error('Please select at least one service');
      return;
    }
    this.saving = true;
    const fv = this.orderForm.value;
    const items = this.selectedServiceItems.map(s => ({
      serviceId: s.id,
      modality: s._modality || null,
      bodyPart: s._bodyPart || null,
      discount: Math.max(0, s.price - (s._price || s.price))
    }));
    this.api.post('v1/radiology/orders', {
      patientId: fv.patientId,
      doctorId: fv.doctorId,
      priority: fv.priority,
      clinicalIndication: fv.clinicalIndication,
      specialInstructions: fv.specialInstructions,
      items: items
    }).subscribe({
      next: () => {
        this.notification.success('Radiology order created successfully');
        this.router.navigate(['/radiology/orders']);
      },
      error: (err) => {
        this.saving = false;
        this.notification.error(err?.message || 'Failed to create radiology order');
      }
    });
  }
}
