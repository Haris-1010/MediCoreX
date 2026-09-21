import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-lab-order-form',
  template: `
    <app-main-layout>
      <app-page-header title="New Lab Order" [breadcrumbs]="[{ label: 'Laboratory', route: '/laboratory' }, { label: 'Orders', route: '/laboratory/orders' }, { label: 'New' }]"></app-page-header>

      <div class="order-form-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <!-- Patient -->
            <mat-form-field appearance="outline">
              <mat-label>Patient *</mat-label>
              <input matInput [matAutocomplete]="patientAuto" formControlName="patientSearch" placeholder="Search by name, phone, or MRN..." (focus)="onPatientFocus()" (input)="onPatientSearchInput($event)">
              <mat-icon matPrefix>search</mat-icon>
              <mat-autocomplete #patientAuto="matAutocomplete" [displayWith]="displayPatient" (optionSelected)="onPatientSelected($event)">
                <mat-option *ngFor="let p of filteredPatients" [value]="p">
                  <div class="autocomplete-option">
                    <span class="name">{{ p.fullName }}</span>
                    <span class="detail">{{ p.phone || 'No phone' }} | MRN: {{ p.mrn }}</span>
                  </div>
                </mat-option>
              </mat-autocomplete>
              <mat-error>Patient is required</mat-error>
            </mat-form-field>

            <!-- Doctor -->
            <mat-form-field appearance="outline">
              <mat-label>Ordering Doctor *</mat-label>
              <input matInput [matAutocomplete]="doctorAuto" formControlName="doctorSearch" placeholder="Search doctor by name or specialty..." (focus)="onDoctorFocus()" (input)="onDoctorInput($event)">
              <mat-icon matPrefix>search</mat-icon>
              <mat-autocomplete #doctorAuto="matAutocomplete" [displayWith]="displayDoctor" (optionSelected)="onDoctorSelected($event)">
                <mat-option *ngFor="let d of filteredDoctors" [value]="d">
                  <div class="autocomplete-option">
                    <span class="name">Dr. {{ d.fullName }} - {{ d.specialization || 'General' }}</span>
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
              <mat-label>Clinical Indication</mat-label>
              <textarea matInput formControlName="clinicalIndication" rows="2" placeholder="Reason for ordering these tests..."></textarea>
            </mat-form-field>
          </div>

          <!-- Selected Patient Card -->
          <div class="selected-patient-card" *ngIf="selectedPatient">
            <mat-icon>person</mat-icon>
            <div class="patient-info">
              <strong>{{ selectedPatient.fullName }}</strong>
              <span>MRN: {{ selectedPatient.mrn }} | Phone: {{ selectedPatient.phone || 'N/A' }}</span>
            </div>
            <button mat-icon-button type="button" (click)="clearPatient()"><mat-icon>close</mat-icon></button>
          </div>

          <!-- Service Selection -->
          <div class="services-section">
            <label class="section-label">Select Laboratory Tests</label>
            <p class="help-text" *ngIf="labServices.length === 0">No laboratory services configured. Please add from Administration &rarr; Services.</p>
            <div class="test-chips" *ngIf="labServices.length > 0">
              <mat-chip-listbox multiple formControlName="selectedServices" (change)="onServiceSelectionChange()">
                <mat-chip-option *ngFor="let service of labServices" [value]="service.id">
                  {{ service.name }} <span class="test-price">Rs. {{ service.price }}</span>
                </mat-chip-option>
              </mat-chip-listbox>
            </div>

            <div class="selected-tests" *ngIf="selectedServiceItems.length > 0">
              <h4>Selected Tests</h4>
              <table class="tests-table">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Code</th>
                    <th>Parameters</th>
                    <th>Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let service of selectedServiceItems">
                    <td><strong>{{ service.name }}</strong></td>
                    <td>{{ service.code }}</td>
                    <td>{{ service.hasParameters ? 'Configured' : 'No params' }}</td>
                    <td>Rs. {{ service.price }}</td>
                    <td>
                      <button mat-icon-button color="warn" type="button" (click)="removeService(service.id)">
                        <mat-icon>remove_circle</mat-icon>
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" class="total-label">Total</td>
                    <td class="total-price"><strong>Rs. {{ totalPrice }}</strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Special Instructions</mat-label>
            <textarea matInput formControlName="specialInstructions" rows="2" placeholder="Fasting required, specific collection instructions, etc."></textarea>
          </mat-form-field>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/laboratory/orders">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving || selectedServiceItems.length === 0">
              {{ saving ? 'Creating...' : 'Create Lab Order' }}
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
    .test-chips mat-chip-listbox { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .test-price { margin-left: 6px; font-size: 0.75rem; opacity: 0.7; }
    .selected-tests { margin-bottom: 1rem; }
    .selected-tests h4 { margin: 0 0 0.5rem; font-size: 0.95rem; }
    .tests-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    .tests-table th { background: var(--accent-primary, #1a237e); color: white; padding: 8px 12px; text-align: left; }
    .tests-table td { padding: 8px 12px; border-bottom: 1px solid var(--border-color, #eee); }
    .tests-table tfoot td { font-weight: 600; border-top: 2px solid var(--accent-primary, #1a237e); }
    .total-label { text-align: right; }
    .total-price { color: var(--accent-primary, #1a237e); font-size: 1rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color, #eee); }
    :host ::ng-deep .autocomplete-option { display: flex; flex-direction: column; padding: 4px 0; }
    :host ::ng-deep .autocomplete-option .name { font-weight: 500; }
    :host ::ng-deep .autocomplete-option .detail { font-size: 0.75rem; color: var(--text-muted, #888); }
  `]
})
export class LabOrderFormComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  selectedPatient: any = null;
  filteredPatients: any[] = [];
  allPatients: any[] = [];
  filteredDoctors: any[] = [];
  allDoctors: any[] = [];
  labServices: any[] = [];
  selectedServiceItems: any[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      patientSearch: [''],
      doctorId: ['', Validators.required],
      doctorSearch: [''],
      priority: ['Routine'],
      clinicalIndication: [''],
      specialInstructions: [''],
      selectedServices: [[]]
    });

    const patientId = this.route.snapshot.queryParamMap.get('patientId');
    if (patientId) {
      this.api.get<any[]>('v1/patients/search', { limit: 1000 }).subscribe({
        next: r => {
          const patients = this.normalizeList<any>(r);
          const patient = patients.find((p: any) => p.id === patientId);
          if (patient) {
            this.selectedPatient = patient;
            this.form.patchValue({ patientId: patient.id, patientSearch: patient });
          }
        },
        error: () => this.notification.error('Failed to load patient')
      });
    }

    this.api.get<any>('v1/laboratory/services').subscribe({
      next: r => this.labServices = this.normalizeList(r),
      error: (err) => this.notification.error(err?.message || 'Failed to load laboratory services')
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

  onPatientFocus() {
    if (this.allPatients.length === 0) {
      this.api.get<any[]>('v1/patients/search', { limit: 1000 }).subscribe({
        next: r => {
          this.allPatients = this.normalizeList(r);
          this.filteredPatients = this.allPatients;
        },
        error: () => this.notification.error('Failed to load patients')
      });
    }
  }

  onPatientSearchInput(event: any) {
    const term = (event.target.value || '').toLowerCase();
    if (!term) { this.filteredPatients = this.allPatients; return; }
    this.filteredPatients = this.allPatients.filter(p =>
      (p.fullName || '').toLowerCase().includes(term) ||
      (p.phone || '').toLowerCase().includes(term) ||
      (p.mrn || '').toLowerCase().includes(term)
    );
  }

  displayPatient(p: any): string {
    if (!p) return '';
    if (typeof p === 'string') return p;
    return `${p.fullName || ''} (${p.phone || 'No phone'})`;
  }

  onPatientSelected(e: any) {
    const patient = e.option.value;
    this.selectedPatient = patient;
    this.form.patchValue({ patientId: patient.id, patientSearch: patient });
  }

  clearPatient() {
    this.selectedPatient = null;
    this.form.patchValue({ patientId: '', patientSearch: '' });
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
    return `Dr. ${d.fullName || ''} - ${d.specialization || 'General'}`;
  }

  onDoctorSelected(e: any) {
    const doctor = e.option.value;
    this.form.patchValue({ doctorId: doctor.id, doctorSearch: doctor });
  }

  onServiceSelectionChange() {
    const selectedIds = this.form.value.selectedServices || [];
    this.selectedServiceItems = this.labServices.filter(s => selectedIds.includes(s.id));
  }

  removeService(id: string) {
    this.selectedServiceItems = this.selectedServiceItems.filter(s => s.id !== id);
    const current = this.form.value.selectedServices || [];
    this.form.patchValue({ selectedServices: current.filter((c: string) => c !== id) });
  }

  get totalPrice(): number {
    return this.selectedServiceItems.reduce((sum, s) => sum + (s.price || 0), 0);
  }

  onSubmit() {
    if (this.form.invalid || this.selectedServiceItems.length === 0) return;
    this.saving = true;

    const items = this.selectedServiceItems.map(s => ({
      serviceId: s.id,
      quantity: 1,
      discount: 0
    }));

    const data = {
      patientId: this.form.value.patientId,
      doctorId: this.form.value.doctorId,
      priority: this.form.value.priority,
      clinicalIndication: this.form.value.clinicalIndication,
      specialInstructions: this.form.value.specialInstructions,
      items: items
    };

    this.api.post<any>('v1/laboratory/orders', data).subscribe({
      next: () => {
        this.notification.success('Lab order created successfully');
        this.router.navigate(['/laboratory/orders']);
      },
      error: (err) => {
        this.saving = false;
        this.notification.error(err?.message || 'Failed to create lab order');
      }
    });
  }
}
