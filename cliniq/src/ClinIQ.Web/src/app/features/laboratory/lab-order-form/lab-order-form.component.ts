import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-lab-order-form',
  template: `
    <app-main-layout>
      <app-page-header title="New Lab Order" [breadcrumbs]="[{ label: 'Laboratory', route: '/laboratory' }, { label: 'Orders', route: '/laboratory/orders' }, { label: 'New' }]"></app-page-header>

      <div class="card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="flex-grow">
              <mat-label>Patient</mat-label>
              <input matInput [matAutocomplete]="patientAuto" formControlName="patientSearch" placeholder="Search patient by name, phone, or MRN..." (focus)="onPatientFocus()" (input)="onPatientSearchInput($event)">
              <mat-icon matPrefix>search</mat-icon>
              <mat-autocomplete #patientAuto="matAutocomplete" [displayWith]="displayPatient" (optionSelected)="onPatientSelected($event)">
                <mat-option *ngFor="let p of filteredPatients" [value]="p">
                  <div class="autocomplete-option">
                    <span class="name">{{ p.fullName }} ({{ p.phone || 'No phone' }})</span>
                    <span class="detail">MRN: {{ p.mrn }}</span>
                  </div>
                </mat-option>
              </mat-autocomplete>
              <mat-error>Patient is required</mat-error>
            </mat-form-field>
          </div>

          <div class="selected-patient-card" *ngIf="selectedPatient">
            <mat-icon>person</mat-icon>
            <div class="patient-info">
              <strong>{{ selectedPatient.fullName }}</strong>
              <span>MRN: {{ selectedPatient.mrn }} | Phone: {{ selectedPatient.phone || 'N/A' }}</span>
            </div>
            <button mat-icon-button type="button" (click)="clearPatient()"><mat-icon>close</mat-icon></button>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="flex-grow">
              <mat-label>Ordering Doctor</mat-label>
              <input matInput [matAutocomplete]="doctorAuto" formControlName="doctorSearch" placeholder="Search doctor by name or specialty..." (focus)="onDoctorFocus()" (input)="onDoctorInput($event)">
              <mat-icon matPrefix>search</mat-icon>
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

            <mat-slide-toggle formControlName="isUrgent" color="warn" class="urgent-toggle">
              Urgent / STAT
            </mat-slide-toggle>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Clinical Indication</mat-label>
            <textarea matInput formControlName="clinicalIndication" rows="2" placeholder="Reason for ordering these tests..."></textarea>
          </mat-form-field>

          <div class="tests-section">
            <label class="section-label">Order Items (Test Names)</label>
            <div class="test-items">
              <div class="test-item" *ngFor="let item of orderItems; let i = index">
                <mat-form-field appearance="outline" class="test-input">
                  <mat-label>Test {{ i + 1 }}</mat-label>
                  <input matInput [(ngModel)]="orderItems[i]" [ngModelOptions]="{standalone: true}" placeholder="e.g., CBC, Lipid Panel, HbA1c">
                </mat-form-field>
                <button mat-icon-button type="button" color="warn" (click)="removeTest(i)" *ngIf="orderItems.length > 1">
                  <mat-icon>remove_circle</mat-icon>
                </button>
              </div>
            </div>
            <button mat-stroked-button type="button" (click)="addTest()">
              <mat-icon>add</mat-icon> Add Test
            </button>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Special Instructions</mat-label>
            <textarea matInput formControlName="specialInstructions" rows="2" placeholder="Fasting required, specific collection instructions, etc."></textarea>
          </mat-form-field>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/laboratory/orders">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">
              {{ saving ? 'Creating...' : 'Create Lab Order' }}
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card { background: white; padding: 1.5rem; border-radius: 8px; }
    .form-row { display: flex; gap: 1rem; align-items: flex-start; }
    .form-row mat-form-field { flex: 1; }
    .flex-grow { flex: 1; }
    .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }

    .selected-patient-card {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.75rem 1rem; background: #e8eaf6; border-radius: 8px; margin: 0.5rem 0 1rem;
    }
    .selected-patient-card mat-icon { color: #3f51b5; }
    .selected-patient-card .patient-info { flex: 1; }
    .selected-patient-card .patient-info strong { display: block; }
    .selected-patient-card .patient-info span { font-size: 0.8rem; color: #666; }

    .urgent-toggle { margin-top: 8px; }

    .tests-section { margin-bottom: 1rem; }
    .section-label { display: block; font-weight: 500; margin-bottom: 0.5rem; color: #333; }
    .test-items { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.5rem; }
    .test-item { display: flex; align-items: flex-start; gap: 0.5rem; }
    .test-item .test-input { flex: 1; }

    :host ::ng-deep .autocomplete-option { display: flex; flex-direction: column; padding: 4px 0; }
    :host ::ng-deep .autocomplete-option .name { font-weight: 500; }
    :host ::ng-deep .autocomplete-option .detail { font-size: 0.75rem; color: #888; }
    :host ::ng-deep .mat-mdc-autocomplete-panel { max-height: 300px !important; border-radius: 8px !important; border: 1px solid #c5cae9 !important; box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option { padding: 10px 16px !important; line-height: 1.4 !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option:hover { background-color: #e8eaf6 !important; }
  `]
})
export class LabOrderFormComponent implements OnInit {
  form!: FormGroup;
  saving = false;

  selectedPatient: any = null;
  filteredPatients: any[] = [];
  allPatients: any[] = [];
  searchTerm = '';

  filteredDoctors: any[] = [];
  allDoctors: any[] = [];

  orderItems: string[] = [''];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      patientSearch: [''],
      doctorId: ['', Validators.required],
      doctorSearch: [''],
      isUrgent: [false],
      clinicalIndication: [''],
      specialInstructions: ['']
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
      return;
    }
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
    this.form.patchValue({ patientId: patient.id, patientSearch: patient.fullName || patient });
  }

  clearPatient() {
    this.selectedPatient = null;
    this.form.patchValue({ patientId: '', patientSearch: '' });
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
  }

  addTest() {
    this.orderItems.push('');
  }

  removeTest(index: number) {
    this.orderItems.splice(index, 1);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving = true;

    const tests = this.orderItems.filter(t => t.trim() !== '');
    if (tests.length === 0) {
      this.notification.error('Please add at least one test');
      this.saving = false;
      return;
    }

    const data = {
      patientId: this.form.value.patientId,
      doctorId: this.form.value.doctorId,
      isUrgent: this.form.value.isUrgent,
      clinicalIndication: this.form.value.clinicalIndication,
      tests: tests,
      specialInstructions: this.form.value.specialInstructions
    };

    this.api.post<any>('v1/laboratory/orders', data).subscribe({
      next: () => {
        this.notification.success('Lab order created successfully');
        this.router.navigate(['/laboratory/orders']);
      },
      error: () => this.saving = false
    });
  }
}
