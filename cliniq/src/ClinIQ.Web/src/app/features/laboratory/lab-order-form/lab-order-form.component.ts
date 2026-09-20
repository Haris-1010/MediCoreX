import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

interface TestCatalogItem {
  name: string;
  code: string;
  price: number;
  sampleType: string;
  parameters: { name: string; unit: string; normalRange: string }[];
}

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
              <mat-label>Patient *</mat-label>
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
              <mat-label>Ordering Doctor *</mat-label>
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

          <!-- Test Selection from Catalog -->
          <div class="tests-section">
            <label class="section-label">Select Tests</label>
            <div class="test-catalog">
              <div class="test-chips">
                <mat-chip-listbox multiple formControlName="selectedTests" (change)="onTestSelectionChange()">
                  <mat-chip-option *ngFor="let test of catalog" [value]="test.code" [class.selected]="isTestSelected(test.code)">
                    {{ test.name }} <span class="test-price">Rs. {{ test.price }}</span>
                  </mat-chip-option>
                </mat-chip-listbox>
              </div>
            </div>

            <!-- Selected Tests Summary -->
            <div class="selected-tests" *ngIf="selectedTestItems.length > 0">
              <h4>Selected Tests</h4>
              <table class="tests-table">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Code</th>
                    <th>Sample</th>
                    <th>Parameters</th>
                    <th>Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let test of selectedTestItems">
                    <td><strong>{{ test.name }}</strong></td>
                    <td>{{ test.code }}</td>
                    <td>{{ test.sampleType }}</td>
                    <td>{{ test.parameters.length }} params</td>
                    <td>Rs. {{ test.price }}</td>
                    <td>
                      <button mat-icon-button color="warn" type="button" (click)="removeTest(test.code)">
                        <mat-icon>remove_circle</mat-icon>
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="4" class="total-label">Total</td>
                    <td class="total-price"><strong>Rs. {{ totalPrice }}</strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <!-- Custom Test Entry -->
            <div class="custom-test">
              <mat-form-field appearance="outline" class="flex-grow">
                <mat-label>Or Add Custom Test</mat-label>
                <input matInput [(ngModel)]="customTestName" [ngModelOptions]="{standalone: true}" placeholder="Enter test name manually">
              </mat-form-field>
              <button mat-stroked-button type="button" (click)="addCustomTest()" [disabled]="!customTestName">
                <mat-icon>add</mat-icon> Add
              </button>
            </div>

            <!-- Custom Tests List -->
            <div class="custom-tests" *ngIf="customTests.length > 0">
              <div class="custom-test-item" *ngFor="let t of customTests; let i = index">
                <span>{{ t }}</span>
                <button mat-icon-button color="warn" type="button" (click)="removeCustomTest(i)">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            </div>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Special Instructions</mat-label>
            <textarea matInput formControlName="specialInstructions" rows="2" placeholder="Fasting required, specific collection instructions, etc."></textarea>
          </mat-form-field>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/laboratory/orders">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving || (selectedTestItems.length === 0 && customTests.length === 0)">
              {{ saving ? 'Creating...' : 'Create Lab Order' }}
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    .form-row { display: flex; gap: 1rem; align-items: flex-start; }
    .form-row mat-form-field { flex: 1; }
    .flex-grow { flex: 1; }
    .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }

    .selected-patient-card {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.75rem 1rem; background: #e8eaf6; border-radius: 8px; margin: 0.5rem 0 1rem;
    }
    .selected-patient-card mat-icon { color: var(--accent-primary, #3f51b5); }
    .selected-patient-card .patient-info { flex: 1; }
    .selected-patient-card .patient-info strong { display: block; }
    .selected-patient-card .patient-info span { font-size: 0.8rem; color: var(--text-secondary, #666); }

    .urgent-toggle { margin-top: 8px; }

    .tests-section { margin-bottom: 1rem; }
    .section-label { display: block; font-weight: 500; margin-bottom: 0.5rem; color: var(--text-primary, #333); }

    .test-catalog { margin-bottom: 1rem; }
    .test-chips mat-chip-listbox { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .test-price { margin-left: 6px; font-size: 0.75rem; opacity: 0.7; }

    .selected-tests { margin-bottom: 1rem; }
    .selected-tests h4 { margin: 0 0 0.5rem; font-size: 0.95rem; }
    .tests-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    .tests-table th { background: #1a237e; color: white; padding: 8px 12px; text-align: left; }
    .tests-table td { padding: 8px 12px; border-bottom: 1px solid #eee; }
    .tests-table tfoot td { font-weight: 600; border-top: 2px solid #1a237e; }
    .total-label { text-align: right; }
    .total-price { color: #1a237e; font-size: 1rem; }

    .custom-test { display: flex; gap: 0.5rem; align-items: flex-start; margin-bottom: 0.5rem; }
    .custom-test mat-form-field { flex: 1; }
    .custom-tests { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
    .custom-test-item { display: flex; align-items: center; gap: 0.25rem; background: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; }

    :host ::ng-deep .autocomplete-option { display: flex; flex-direction: column; padding: 4px 0; }
    :host ::ng-deep .autocomplete-option .name { font-weight: 500; }
    :host ::ng-deep .autocomplete-option .detail { font-size: 0.75rem; color: var(--text-muted, #888); }
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

  catalog: TestCatalogItem[] = [];
  selectedTestItems: TestCatalogItem[] = [];
  customTests: string[] = [];
  customTestName = '';

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
      isUrgent: [false],
      clinicalIndication: [''],
      specialInstructions: [''],
      selectedTests: [[]]
    });

    // Pre-fill patient from query params
    const patientId = this.route.snapshot.queryParamMap.get('patientId');
    if (patientId) {
      this.api.get<any[]>('v1/patients/search', { limit: 1000 }).subscribe(r => {
        const patients = this.normalizeList<any>(r);
        const patient = patients.find((p: any) => p.id === patientId);
        if (patient) {
          this.selectedPatient = patient;
          this.form.patchValue({ patientId: patient.id, patientSearch: patient.fullName });
        }
      });
    }

    // Pre-fill doctor from query params
    const doctorId = this.route.snapshot.queryParamMap.get('doctorId');
    if (doctorId) {
      this.form.patchValue({ doctorId });
    }

    // Load test catalog
    this.api.get<any>('v1/laboratory/test-catalog').subscribe(r => {
      this.catalog = this.normalizeList(r);
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
    if (!term) { this.filteredDoctors = this.allDoctors; return; }
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

  isTestSelected(code: string): boolean {
    return this.selectedTestItems.some(t => t.code === code);
  }

  onTestSelectionChange() {
    const selectedCodes = this.form.value.selectedTests || [];
    this.selectedTestItems = this.catalog.filter(t => selectedCodes.includes(t.code));
  }

  removeTest(code: string) {
    this.selectedTestItems = this.selectedTestItems.filter(t => t.code !== code);
    const current = this.form.value.selectedTests || [];
    this.form.patchValue({ selectedTests: current.filter((c: string) => c !== code) });
  }

  addCustomTest() {
    if (this.customTestName && this.customTestName.trim()) {
      this.customTests.push(this.customTestName.trim());
      this.customTestName = '';
    }
  }

  removeCustomTest(index: number) {
    this.customTests.splice(index, 1);
  }

  get totalPrice(): number {
    return this.selectedTestItems.reduce((sum, t) => sum + t.price, 0);
  }

  onSubmit() {
    if (this.form.invalid) return;
    if (this.selectedTestItems.length === 0 && this.customTests.length === 0) {
      this.notification.error('Please select at least one test');
      return;
    }
    this.saving = true;

    // Build tests array with parameters from catalog
    const tests = [
      ...this.selectedTestItems.map(t => ({
        testName: t.name,
        code: t.code,
        sampleType: t.sampleType,
        price: t.price,
        parameters: t.parameters.map(p => ({
          name: p.name,
          value: '',
          unit: p.unit,
          normalRange: p.normalRange,
          isAbnormal: false
        })),
        simpleResult: ''
      })),
      ...this.customTests.map(name => ({
        testName: name,
        code: '',
        sampleType: '',
        price: 0,
        parameters: [],
        simpleResult: ''
      }))
    ];

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
