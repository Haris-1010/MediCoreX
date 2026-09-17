import { Component, OnInit, ViewChild, ElementRef, OnDestroy, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { SignalRService } from '../../../core/services/signalr.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AudioAnnouncementService } from '../token-generation/audio-announcement.service';
import { TenantService } from '../../../core/services/tenant.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-token-generation',
  template: `
    <app-main-layout>
      <app-page-header title="Token Generation" [breadcrumbs]="[{ label: 'OPD', route: '/opd' }, { label: 'Token' }]">
        <button mat-stroked-button (click)="openTokenDisplay()" target="_blank"><mat-icon>tv</mat-icon> Display Board</button>
      </app-page-header>

      <!-- STEP 1: Patient & Doctor Selection -->
      <div class="token-form-container" *ngIf="step === 1">
        <div class="card">
          <div class="card-header">
            <mat-icon>receipt_long</mat-icon>
            <h3>Generate OPD Token</h3>
          </div>

          <form [formGroup]="tokenForm" (ngSubmit)="generateToken()">
            <!-- Patient Search -->
            <div class="section">
              <label class="section-label">Patient</label>
              <div class="patient-search-row">
                <mat-form-field appearance="outline" class="flex-grow">
                  <mat-label>Search Patient</mat-label>
                  <input matInput formControlName="patientSearch"
                    [matAutocomplete]="patientAuto"
                    placeholder="Type name or phone..."
                    (focus)="onPatientFocus()"
                    (input)="onPatientSearchInput($event)">
                  <mat-icon matPrefix>search</mat-icon>
                  <mat-autocomplete #patientAuto="matAutocomplete"
                    [displayWith]="displayPatient"
                    (optionSelected)="onPatientSelected($event)">
                    <mat-option *ngFor="let p of filteredPatients" [value]="p">
                      <div class="patient-option">
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
            </div>

            <!-- Doctor Selection -->
            <div class="section">
              <label class="section-label">Doctor</label>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Select Doctor</mat-label>
                <mat-select formControlName="doctorId" (selectionChange)="onDoctorChange()">
                  <mat-option *ngFor="let d of doctors" [value]="d.id">
                    Dr. {{ d.fullName }} - {{ d.specialization }}
                  </mat-option>
                </mat-select>
                <mat-error>Doctor is required</mat-error>
              </mat-form-field>
            </div>

            <!-- Fee Section -->
            <div class="section fee-section" *ngIf="selectedDoctor">
              <label class="section-label">Consultation Fee</label>
              <div class="fee-display">
                <mat-form-field appearance="outline">
                  <mat-label>Fee Amount</mat-label>
                  <input matInput type="number" formControlName="consultationFee" min="0">
                  <span matPrefix>{{ currencySymbol }}&nbsp;</span>
                </mat-form-field>
                <div class="fee-default" *ngIf="selectedDoctor?.consultationFee">
                  Default: {{ currencySymbol }} {{ selectedDoctor.consultationFee }}
                </div>
              </div>
            </div>

            <!-- Additional Services -->
            <div class="section" *ngIf="selectedDoctor?.services?.length">
              <label class="section-label">Additional Services (Optional)</label>
              <div class="service-chips">
                <mat-chip-listbox multiple (change)="onServicesChange($event)">
                  <mat-chip-option *ngFor="let svc of selectedDoctor.services" [value]="svc.id">
                    {{ svc.name }} - {{ currencySymbol }} {{ svc.price }}
                  </mat-chip-option>
                </mat-chip-listbox>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="section">
              <label class="section-label">Payment Method</label>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Payment Method</mat-label>
                <mat-select formControlName="paymentMethod">
                  <mat-option value="Cash">
                    <mat-icon>money</mat-icon> Cash
                  </mat-option>
                  <mat-option value="Card">
                    <mat-icon>credit_card</mat-icon> Card
                  </mat-option>
                  <mat-option value="BankTransfer">
                    <mat-icon>account_balance</mat-icon> Bank Transfer
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <!-- Total -->
            <div class="total-bar" *ngIf="totalAmount > 0">
              <span>Total Amount</span>
              <strong>{{ currencySymbol }} {{ totalAmount | number:'1.0-0' }}</strong>
            </div>

            <!-- Actions -->
            <div class="form-actions">
              <button mat-button routerLink="/opd" type="button">Cancel</button>
              <button mat-raised-button color="primary" type="submit"
                [disabled]="tokenForm.invalid || generating">
                <mat-spinner *ngIf="generating" diameter="20"></mat-spinner>
                <mat-icon *ngIf="!generating">receipt</mat-icon>
                Generate Token & Pay
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- STEP 2: Receipt -->
      <div class="receipt-container" *ngIf="step === 2">
        <div class="success-animation">
          <mat-icon class="check-icon">check_circle</mat-icon>
          <h2>Token Generated Successfully!</h2>
        </div>

        <div class="receipt-card" #receipt>
          <div class="receipt-header">
            <div class="hospital-info">
              <h2>{{ tenant?.name || 'ClinIQ' }}</h2>
              <p>{{ tenant?.address || 'Healthcare Management System' }}</p>
              <p>{{ tenant?.phone || '' }}</p>
            </div>
            <div class="receipt-title">
              <h2>OPD TOKEN</h2>
              <p>Registration Receipt</p>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="receipt-body">
            <div class="info-row">
              <span>PATIENT</span>
              <strong>{{ generatedToken?.patientName }}</strong>
            </div>
            <div class="info-row">
              <span>MRN</span>
              <strong>{{ generatedToken?.patientMRN }}</strong>
            </div>
            <div class="info-row">
              <span>DOCTOR</span>
              <strong>Dr. {{ generatedToken?.doctorName }}</strong>
            </div>
            <div class="info-row token-row">
              <span>TOKEN NO.</span>
              <strong class="token-badge">#{{ generatedToken?.tokenNumber }}</strong>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="receipt-totals">
            <div class="total-row">
              <span>Consultation Fee</span>
              <span>{{ currencySymbol }} {{ generatedToken?.consultationFee | number:'1.0-0' }}</span>
            </div>
            <div class="total-row" *ngFor="let svc of generatedToken?.additionalServices">
              <span>Additional Service</span>
              <span>{{ currencySymbol }} {{ svc.price | number:'1.0-0' }}</span>
            </div>
            <mat-divider *ngIf="generatedToken?.additionalServices?.length"></mat-divider>
            <div class="grand-total">
              <span>TOTAL PAID</span>
              <span>{{ currencySymbol }} {{ generatedToken?.totalAmount | number:'1.0-0' }}</span>
            </div>
          </div>

          <div class="receipt-footer">
            <div class="payment-info">
              <mat-icon>payment</mat-icon>
              <span>{{ generatedToken?.paymentMethod }} | {{ generatedToken?.paymentNumber }}</span>
            </div>
            <div class="time-info">
              <mat-icon>schedule</mat-icon>
              <span>{{ generatedToken?.createdAt | date:'medium' }}</span>
            </div>
            <p class="proceed-text">Please proceed to consultation</p>
          </div>
        </div>

        <div class="receipt-actions">
          <button mat-stroked-button (click)="printReceipt()">
            <mat-icon>print</mat-icon> Print Receipt
          </button>
          <button mat-raised-button color="primary" (click)="newToken()">
            <mat-icon>add</mat-icon> New Token
          </button>
          <button mat-stroked-button routerLink="/opd/queue">
            <mat-icon>queue</mat-icon> View Queue
          </button>
        </div>
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
              <input matInput [matDatepicker]="dobPicker" formControlName="dateOfBirth" readonly placeholder="Auto-calculated">
              <mat-datepicker-toggle matSuffix [for]="dobPicker"></mat-datepicker-toggle>
              <mat-datepicker #dobPicker></mat-datepicker>
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
    .token-form-container { max-width: 650px; margin: 0 auto; }
    .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
    .card-header mat-icon { font-size: 28px; width: 28px; height: 28px; color: #3f51b5; }
    .card-header h3 { margin: 0; font-size: 1.25rem; }

    .section { margin-bottom: 1.25rem; }
    .section-label { display: block; font-weight: 600; font-size: 0.85rem; color: #555; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .full-width { width: 100%; }
    .flex-grow { flex: 1; }

    .patient-search-row { display: flex; gap: 0.75rem; align-items: flex-start; }
    .quick-add-btn { height: 56px; white-space: nowrap; }

    .selected-patient-card { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; background: #e8eaf6; border-radius: 8px; margin-top: 0.5rem; }
    .selected-patient-card mat-icon { color: #3f51b5; }
    .selected-patient-card .patient-info { flex: 1; }
    .selected-patient-card .patient-info strong { display: block; }
    .selected-patient-card .patient-info span { font-size: 0.8rem; color: #666; }

    .fee-display { display: flex; align-items: flex-start; gap: 1rem; }
    .fee-display mat-form-field { flex: 1; }
    .fee-default { padding: 1rem; background: #f5f5f5; border-radius: 8px; color: #666; font-size: 0.85rem; white-space: nowrap; }

    .service-chips { margin-top: 0.25rem; }

    .total-bar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; background: linear-gradient(135deg, #1a237e, #3f51b5); color: white; border-radius: 8px; margin: 1rem 0; }
    .total-bar strong { font-size: 1.5rem; }

    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #eee; }

    /* Patient option in autocomplete */
    :host ::ng-deep .patient-option { display: flex; flex-direction: column; padding: 4px 0; }
    :host ::ng-deep .patient-option .name { font-weight: 500; }
    :host ::ng-deep .patient-option .details { font-size: 0.75rem; color: #888; }
    :host ::ng-deep .quick-add-option { color: #3f51b5; font-weight: 500; }
    :host ::ng-deep .quick-add-option mat-icon { margin-right: 8px; vertical-align: middle; }

    /* Receipt */
    .receipt-container { display: flex; flex-direction: column; align-items: center; padding: 1.5rem; }
    .success-animation { text-align: center; margin-bottom: 1.5rem; }
    .success-animation .check-icon { font-size: 64px; width: 64px; height: 64px; color: #4caf50; animation: scaleIn 0.3s ease-out; }
    .success-animation h2 { margin: 0.5rem 0 0; color: #4caf50; }
    @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }

    .receipt-card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.12); max-width: 480px; width: 100%; }
    .receipt-header { display: flex; justify-content: space-between; border-bottom: 3px solid #3f51b5; padding-bottom: 1rem; margin-bottom: 1rem; }
    .hospital-info h2 { margin: 0; color: #1a237e; font-size: 1.25rem; }
    .hospital-info p { margin: 0.15rem 0; font-size: 0.8rem; color: #666; }
    .receipt-title h2 { margin: 0; color: #3f51b5; font-size: 1.5rem; }
    .receipt-title p { margin: 0; font-size: 0.8rem; color: #666; }

    .receipt-body .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0; }
    .receipt-body .info-row span { color: #888; font-size: 0.85rem; }
    .receipt-body .token-row { margin-top: 0.5rem; }
    .token-badge { font-size: 1.75rem; color: #3f51b5; font-weight: 700; background: #e8eaf6; padding: 0.25rem 0.75rem; border-radius: 6px; }

    .receipt-totals { margin-top: 1rem; }
    .total-row { display: flex; justify-content: space-between; padding: 0.35rem 0; font-size: 0.9rem; }
    .grand-total { font-size: 1.25rem; font-weight: 700; color: #1a237e; border-top: 2px solid #3f51b5; padding-top: 0.75rem; margin-top: 0.5rem; display: flex; justify-content: space-between; }

    .receipt-footer { margin-top: 1.25rem; text-align: center; }
    .payment-info, .time-info { display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.8rem; color: #666; margin: 0.25rem 0; }
    .payment-info mat-icon, .time-info mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .proceed-text { margin-top: 1rem; font-weight: 600; color: #3f51b5; font-size: 0.9rem; }

    .receipt-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }

    /* Dialog */
    :host ::ng-deep .mat-mdc-dialog-title { display: flex; align-items: center; gap: 0.5rem; }
    .dialog-form-row { display: flex; gap: 1rem; }

    /* Autocomplete dropdown styling */
    :host ::ng-deep .mat-mdc-autocomplete-panel { max-height: 300px !important; border-radius: 8px !important; border: 1px solid #c5cae9 !important; box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option { padding: 10px 16px !important; line-height: 1.4 !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option:hover { background-color: #e8eaf6 !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option.mat-mdc-option-active { background-color: #c5cae9 !important; }
    :host ::ng-deep .patient-option { display: flex; flex-direction: column; padding: 2px 0; }
    :host ::ng-deep .patient-option .name { font-weight: 500; }
    :host ::ng-deep .patient-option .details { font-size: 0.75rem; color: #888; }
  `]
})
export class TokenGenerationComponent implements OnInit, OnDestroy {
  tokenForm: FormGroup;
  quickPatientForm: FormGroup;
  step: 1 | 2 = 1;
  generating = false;
  savingPatient = false;

  doctors: any[] = [];
  filteredPatients: any[] = [];
  searchTerm = '';
  selectedPatient: any = null;
  selectedDoctor: any = null;
  generatedToken: any;
  showQuickAdd = false;
  selectedServiceIds: string[] = [];
  totalAmount = 0;

  @ViewChild('receipt') receiptRef!: ElementRef;
  @ViewChild('quickAddDialog') quickAddDialog!: TemplateRef<any>;

  tenant: any = null;
  currencySymbol = '$';
  private destroy$ = new Subject<void>();

  allPatients: any[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private signalR: SignalRService,
    private notification: NotificationService,
    private tenantService: TenantService,
    private dialog: MatDialog
  ) {
    this.tokenForm = this.fb.group({
      patientSearch: ['', Validators.required],
      doctorId: ['', Validators.required],
      consultationFee: [0, [Validators.required, Validators.min(0)]],
      paymentMethod: ['Cash', Validators.required]
    });

    this.quickPatientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      phone: [''],
      gender: [''],
      age: [null, [Validators.required, Validators.min(0), Validators.max(150)]],
      dateOfBirth: [{ value: null, disabled: true }]
    });
  }

  ngOnInit() {
    this.api.get<any[]>('v1/opd/available-doctors').subscribe(r => {
      this.doctors = Array.isArray(r) ? r : ((r as any)?.data ?? []);
    });

    this.tenantService.currentTenant$.pipe(takeUntil(this.destroy$)).subscribe(t => {
      this.tenant = t;
      this.currencySymbol = this.tenantService.getCurrencySymbol();
    });

    // Patient data loaded on focus
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPatientFocus() {
    if (this.allPatients.length === 0) {
      this.api.get<any[]>('v1/patients/search', { limit: 1000 }).subscribe(r => {
        this.allPatients = Array.isArray(r) ? r : ((r as any)?.data ?? []);
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

  displayPatient(p: any): string {
    if (!p) return '';
    if (typeof p === 'string') return p;
    return `${p.fullName || ''} (${p.phone || 'No phone'})`;
  }

  onPatientSelected(event: any) {
    const val = event.option.value;
    this.selectedPatient = val;
    this.tokenForm.patchValue({ patientSearch: val.fullName || val });
    this.showQuickAdd = false;
  }

  clearPatient() {
    this.selectedPatient = null;
    this.tokenForm.patchValue({ patientSearch: '' });
  }

  onDoctorChange() {
    const doctor = this.doctors.find(d => d.id === this.tokenForm.get('doctorId')?.value);
    this.selectedDoctor = doctor;
    if (doctor) {
      this.tokenForm.patchValue({ consultationFee: doctor.consultationFee || 500 });
      this.calculateTotal();
    }
  }

  onServicesChange(event: any) {
    this.selectedServiceIds = event.value || [];
    this.calculateTotal();
  }

  calculateTotal() {
    let total = this.tokenForm.get('consultationFee')?.value || 0;
    if (this.selectedDoctor?.services) {
      for (const svc of this.selectedDoctor.services) {
        if (this.selectedServiceIds.includes(svc.id)) {
          total += svc.price;
        }
      }
    }
    this.totalAmount = total;
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

    // Calculate DOB from age if not already set
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
        this.tokenForm.patchValue({ patientSearch: patientData.fullName });

        this.notification.success(`Patient ${patientData.fullName} created successfully`);
      },
      error: () => this.savingPatient = false
    });
  }

  generateToken() {
    if (this.tokenForm.invalid || !this.selectedPatient) return;
    this.generating = true;

    const additionalServices = this.selectedServiceIds.map(id => {
      const svc = this.selectedDoctor.services.find((s: any) => s.id === id);
      return { serviceId: id, quantity: 1, price: svc?.price || 0 };
    });

    const payload = {
      patientId: this.selectedPatient.id,
      doctorId: this.tokenForm.value.doctorId,
      consultationFee: this.tokenForm.value.consultationFee,
      paymentMethod: this.tokenForm.value.paymentMethod,
      additionalServices,
      notes: ''
    };

    this.api.post<any>('v1/opd/tokens', payload).subscribe({
      next: (res) => {
        this.generatedToken = res;
        this.step = 2;
        this.generating = false;
        this.notification.success(`Token #${res.tokenNumber} generated for Dr. ${res.doctorName}`);

        // Auto-open display board in new tab
        this.openTokenDisplay();
      },
      error: () => this.generating = false
    });
  }

  printReceipt() {
    const printContents = this.receiptRef.nativeElement.innerHTML;
    const popup = window.open('', '_blank', 'width=500,height=700');
    if (popup) {
      popup.document.write(`
        <html>
          <head>
            <title>Token Receipt - #${this.generatedToken?.tokenNumber}</title>
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body { font-family: 'Courier New', monospace; padding: 20px; max-width: 480px; margin: 0 auto; }
              .receipt-header { display: flex; justify-content: space-between; border-bottom: 3px solid #3f51b5; padding-bottom: 10px; margin-bottom: 10px; }
              .hospital-info h2 { color: #1a237e; font-size: 18px; }
              .hospital-info p { font-size: 11px; color: #666; }
              .receipt-title h2 { color: #3f51b5; font-size: 20px; text-align: right; }
              .receipt-title p { font-size: 11px; color: #666; text-align: right; }
              .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; font-size: 13px; }
              .info-row span { color: #888; }
              .token-badge { font-size: 24px; color: #3f51b5; font-weight: 700; background: #e8eaf6; padding: 4px 12px; border-radius: 4px; }
              .total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
              .grand-total { font-size: 16px; font-weight: 700; color: #1a237e; border-top: 2px solid #3f51b5; padding-top: 8px; margin-top: 8px; display: flex; justify-content: space-between; }
              .footer { text-align: center; margin-top: 15px; font-size: 11px; color: #666; }
              .footer p { margin: 2px 0; }
              .proceed-text { font-weight: bold; color: #3f51b5; margin-top: 10px; font-size: 13px; }
            </style>
          </head>
          <body>${printContents}</body>
        </html>
      `);
      popup.document.close();
      setTimeout(() => { popup.print(); popup.close(); }, 300);
    }
  }

  newToken() {
    this.step = 1;
    this.selectedPatient = null;
    this.selectedDoctor = null;
    this.generatedToken = null;
    this.selectedServiceIds = [];
    this.totalAmount = 0;
    this.tokenForm.reset({ patientSearch: '', doctorId: '', consultationFee: 0, paymentMethod: 'Cash' });
  }

  openTokenDisplay() {
    window.open('/opd/display', '_blank');
  }
}
