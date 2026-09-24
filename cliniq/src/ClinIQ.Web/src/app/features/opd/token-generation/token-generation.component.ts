import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { SignalRService } from '../../../core/services/signalr.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AudioAnnouncementService } from '../token-generation/audio-announcement.service';
import { TenantService } from '../../../core/services/tenant.service';
import { PatientPickerComponent, PatientPickerValue } from '../../../shared/components/patient-picker/patient-picker.component';

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
              <app-patient-picker
                #patientPicker
                label="Patient"
                [required]="true"
                (patientChange)="onPatientChange($event)">
              </app-patient-picker>

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
                    Dr. {{ d.fullName }}<span *ngIf="d.specialization"> - ({{ d.specialization }})</span>
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
  `,
  styles: [`
    .token-form-container { max-width: 650px; margin: 0 auto; }
    .card { background: var(--bg-card, #fff); padding: 2rem; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
    .card-header mat-icon { font-size: 28px; width: 28px; height: 28px; color: var(--accent-primary, #3f51b5); }
    .card-header h3 { margin: 0; font-size: 1.25rem; }

    .section { margin-bottom: 1.25rem; }
    .section-label { display: block; font-weight: 600; font-size: 0.85rem; color: var(--text-secondary, #555); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .full-width { width: 100%; }
    .flex-grow { flex: 1; }

    .selected-patient-card { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; background: var(--bg-badge, #e8eaf6); border-radius: 8px; margin-top: 0.5rem; }
    .selected-patient-card mat-icon { color: var(--accent-primary, #3f51b5); }
    .selected-patient-card .patient-info { flex: 1; }
    .selected-patient-card .patient-info strong { display: block; }
    .selected-patient-card .patient-info span { font-size: 0.8rem; color: var(--text-secondary, #666); }

    .fee-display { display: flex; align-items: flex-start; gap: 1rem; }
    .fee-display mat-form-field { flex: 1; }
    .fee-default { padding: 1rem; background: var(--bg-input, #f5f5f5); border-radius: 8px; color: var(--text-secondary, #666); font-size: 0.85rem; white-space: nowrap; }

    .service-chips { margin-top: 0.25rem; }

    .total-bar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; background: linear-gradient(135deg, var(--accent-primary, #1a237e), var(--accent-primary, #3f51b5)); color: var(--text-inverse, #fff); border-radius: 8px; margin: 1rem 0; }
    .total-bar strong { font-size: 1.5rem; }

    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color, #eee); }

    /* Patient option in autocomplete */
    :host ::ng-deep .patient-option { display: flex; flex-direction: column; padding: 4px 0; }
    :host ::ng-deep .patient-option .name { font-weight: 500; }
    :host ::ng-deep .patient-option .details { font-size: 0.75rem; color: var(--text-muted, #888); }

    /* Receipt */
    .receipt-container { display: flex; flex-direction: column; align-items: center; padding: 1.5rem; }
    .success-animation { text-align: center; margin-bottom: 1.5rem; }
    .success-animation .check-icon { font-size: 64px; width: 64px; height: 64px; color: var(--status-success, #4caf50); animation: scaleIn 0.3s ease-out; }
    .success-animation h2 { margin: 0.5rem 0 0; color: var(--status-success, #4caf50); }
    @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }

    .receipt-card { background: var(--bg-card, #fff); padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.12); max-width: 480px; width: 100%; }
    .receipt-header { display: flex; justify-content: space-between; border-bottom: 3px solid var(--accent-primary, #3f51b5); padding-bottom: 1rem; margin-bottom: 1rem; }
    .hospital-info h2 { margin: 0; color: var(--accent-primary, #1a237e); font-size: 1.25rem; }
    .hospital-info p { margin: 0.15rem 0; font-size: 0.8rem; color: var(--text-secondary, #666); }
    .receipt-title h2 { margin: 0; color: var(--accent-primary, #3f51b5); font-size: 1.5rem; }
    .receipt-title p { margin: 0; font-size: 0.8rem; color: var(--text-secondary, #666); }

    .receipt-body .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color, #f0f0f0); }
    .receipt-body .info-row span { color: var(--text-muted, #888); font-size: 0.85rem; }
    .receipt-body .token-row { margin-top: 0.5rem; }
    .token-badge { font-size: 1.75rem; color: var(--accent-primary, #3f51b5); font-weight: 700; background: var(--bg-badge, #e8eaf6); padding: 0.25rem 0.75rem; border-radius: 6px; }

    .receipt-totals { margin-top: 1rem; }
    .total-row { display: flex; justify-content: space-between; padding: 0.35rem 0; font-size: 0.9rem; }
    .grand-total { font-size: 1.25rem; font-weight: 700; color: var(--accent-primary, #1a237e); border-top: 2px solid var(--accent-primary, #3f51b5); padding-top: 0.75rem; margin-top: 0.5rem; display: flex; justify-content: space-between; }

    .receipt-footer { margin-top: 1.25rem; text-align: center; }
    .payment-info, .time-info { display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.8rem; color: var(--text-secondary, #666); margin: 0.25rem 0; }
    .payment-info mat-icon, .time-info mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .proceed-text { margin-top: 1rem; font-weight: 600; color: var(--accent-primary, #3f51b5); font-size: 0.9rem; }

    .receipt-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }

    /* Autocomplete dropdown styling */
    :host ::ng-deep .mat-mdc-autocomplete-panel { max-height: 300px !important; border-radius: 8px !important; border: 1px solid var(--border-color, #c5cae9) !important; box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option { padding: 10px 16px !important; line-height: 1.4 !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option:hover { background-color: var(--bg-hover, #e8eaf6) !important; }
    :host ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option.mat-mdc-option-active { background-color: var(--border-color, #c5cae9) !important; }
    :host ::ng-deep .patient-option { display: flex; flex-direction: column; padding: 2px 0; }
    :host ::ng-deep .patient-option .name { font-weight: 500; }
    :host ::ng-deep .patient-option .details { font-size: 0.75rem; color: var(--text-muted, #888); }
  `]
})
export class TokenGenerationComponent implements OnInit, OnDestroy {
  tokenForm: FormGroup;
  step: 1 | 2 = 1;
  generating = false;

  doctors: any[] = [];
  selectedPatient: any = null;
  selectedDoctor: any = null;
  generatedToken: any;
  selectedServiceIds: string[] = [];
  totalAmount = 0;

  @ViewChild('receipt') receiptRef!: ElementRef;
  @ViewChild('patientPicker') patientPicker!: PatientPickerComponent;

  tenant: any = null;
  currencySymbol = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private signalR: SignalRService,
    private notification: NotificationService,
    private tenantService: TenantService
  ) {
    this.tokenForm = this.fb.group({
      patientId: [''],
      doctorId: ['', Validators.required],
      consultationFee: [0, [Validators.required, Validators.min(0)]],
      paymentMethod: ['Cash', Validators.required]
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
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPatientChange(patient: PatientPickerValue | null) {
    this.selectedPatient = patient;
    this.tokenForm.patchValue({ patientId: patient?.id || '' });
  }

  clearPatient() {
    this.selectedPatient = null;
    this.tokenForm.patchValue({ patientId: '' });
    this.patientPicker?.clearSelection();
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

  async generateToken() {
    if (this.generating) return;
    const patient = await this.patientPicker?.ensurePatient();
    if (!patient && !this.tokenForm.value.patientId) {
      this.notification.error('Please select or create a patient');
      return;
    }
    if (patient) {
      this.tokenForm.patchValue({ patientId: patient.id });
      this.selectedPatient = patient;
    }
    if (this.tokenForm.invalid || (!this.selectedPatient && !patient)) return;
    this.generating = true;

    const additionalServices = this.selectedServiceIds.map(id => {
      const svc = this.selectedDoctor.services.find((s: any) => s.id === id);
      return { serviceId: id, quantity: 1, price: svc?.price || 0 };
    });

    const payload = {
      patientId: this.tokenForm.value.patientId || this.selectedPatient?.id,
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
    this.tokenForm.reset({ patientId: '', doctorId: '', consultationFee: 0, paymentMethod: 'Cash' });
    this.patientPicker?.clearSelection();
  }

  openTokenDisplay() {
    window.open('/opd/display', '_blank');
  }
}
