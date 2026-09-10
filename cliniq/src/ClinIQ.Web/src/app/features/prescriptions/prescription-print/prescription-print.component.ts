import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { TenantService } from '../../../core/services/tenant.service';

@Component({
  standalone: false,
  selector: 'app-prescription-print',
  template: `
    <div class="print-container" *ngIf="prescription">
      <div class="brand" *ngIf="branding?.logoUrl || branding?.name">
        <img *ngIf="branding?.logoUrl" [src]="branding?.logoUrl" alt="logo" class="brand-logo">
        <div class="brand-info">
          <h2>{{ branding?.name || 'Hospital Name' }}</h2>
          <p *ngIf="branding?.phone">{{ branding?.phone }}</p>
          <p *ngIf="branding?.address">{{ branding?.address }}</p>
        </div>
      </div>

      <div class="rx-header">
        <div class="rx-title">
          <h1>PRESCRIPTION</h1>
          <p class="rx-number">{{ prescription.prescriptionNumber }}</p>
        </div>
        <div class="rx-meta">
          <p><strong>Date:</strong> {{ prescription.prescriptionDate | date:'mediumDate' }}</p>
          <p *ngIf="prescription.validUntil"><strong>Valid Until:</strong> {{ prescription.validUntil | date:'mediumDate' }}</p>
        </div>
      </div>

      <div class="patient-info">
        <div class="info-row">
          <span class="label">Patient:</span>
          <span class="value">{{ prescription.patientName }} ({{ prescription.patientNumber }})</span>
        </div>
        <div class="info-row">
          <span class="label">Doctor:</span>
          <span class="value">Dr. {{ prescription.doctorName }}</span>
        </div>
        <div class="info-row" *ngIf="prescription.diagnosis">
          <span class="label">Diagnosis:</span>
          <span class="value">{{ prescription.diagnosis }}</span>
        </div>
      </div>

      <div class="medicines-table" *ngIf="prescription.items?.length">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Duration</th>
              <th>Instructions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of prescription.items; let i = index">
              <td>{{ i + 1 }}</td>
              <td>
                <strong>{{ item.medicineName }}</strong>
                <span *ngIf="item.strength"> {{ item.strength }}</span>
                <span *ngIf="item.form"> ({{ item.form }})</span>
              </td>
              <td>{{ item.dosage || '-' }}</td>
              <td>
                {{ item.frequency }}
                <span *ngIf="item.morning || item.afternoon || item.evening || item.night" class="timing">
                  <span *ngIf="item.morning">M</span>
                  <span *ngIf="item.afternoon">A</span>
                  <span *ngIf="item.evening">E</span>
                  <span *ngIf="item.night">N</span>
                </span>
              </td>
              <td>{{ item.durationText || (item.durationDays ? item.durationDays + ' days' : '-') }}</td>
              <td>{{ item.instructions || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="instructions" *ngIf="prescription.generalInstructions || prescription.dietaryAdvice || prescription.lifestyleAdvice">
        <div *ngIf="prescription.generalInstructions">
          <h4>General Instructions</h4>
          <p>{{ prescription.generalInstructions }}</p>
        </div>
        <div *ngIf="prescription.dietaryAdvice">
          <h4>Dietary Advice</h4>
          <p>{{ prescription.dietaryAdvice }}</p>
        </div>
        <div *ngIf="prescription.lifestyleAdvice">
          <h4>Lifestyle Advice</h4>
          <p>{{ prescription.lifestyleAdvice }}</p>
        </div>
      </div>

      <div class="doctor-signature">
        <div class="signature-line"></div>
        <p>Dr. {{ prescription.doctorName }}</p>
      </div>

      <div class="print-actions no-print" *appHasPermission="'Prescriptions.Print'">
        <button mat-raised-button color="primary" (click)="print()">
          <mat-icon>print</mat-icon> Print Prescription
        </button>
      </div>
    </div>

    <div *ngIf="!prescription" class="loading-container">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
  `,
  styles: [`
    .print-container { max-width: 800px; margin: 0 auto; padding: 2rem; background: white; }
    .brand { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #1a237e; }
    .brand-logo { max-width: 60px; max-height: 60px; }
    .brand-info h2 { margin: 0; color: #1a237e; font-size: 1.25rem; }
    .brand-info p { margin: 2px 0; color: #666; font-size: 0.8rem; }
    .rx-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    .rx-title h1 { margin: 0; color: #1a237e; font-size: 1.5rem; }
    .rx-number { margin: 4px 0 0; color: #666; font-size: 0.9rem; }
    .rx-meta p { margin: 4px 0; font-size: 0.9rem; }
    .patient-info { background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; }
    .info-row { display: flex; gap: 0.5rem; margin-bottom: 0.25rem; font-size: 0.9rem; }
    .info-row .label { font-weight: 600; min-width: 80px; }
    .medicines-table table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
    .medicines-table th { background: #1a237e; color: white; padding: 8px 12px; text-align: left; font-size: 0.8rem; }
    .medicines-table td { padding: 8px 12px; border-bottom: 1px solid #e0e0e0; font-size: 0.85rem; }
    .timing { margin-left: 4px; font-size: 0.75rem; color: #1a237e; font-weight: 600; }
    .instructions { margin-bottom: 2rem; }
    .instructions h4 { margin: 0 0 0.25rem; color: #1a237e; font-size: 0.9rem; }
    .instructions p { margin: 0 0 0.75rem; font-size: 0.85rem; }
    .doctor-signature { text-align: right; margin-top: 3rem; }
    .signature-line { width: 200px; border-top: 1px solid #333; margin-left: auto; margin-bottom: 0.25rem; }
    .doctor-signature p { margin: 0; font-weight: 600; font-size: 0.9rem; }
    .print-actions { text-align: center; margin-top: 2rem; }
    .loading-container { display: flex; justify-content: center; padding: 4rem; }
    @media print {
      .no-print { display: none !important; }
      .print-container { padding: 0; box-shadow: none; }
    }
  `]
})
export class PrescriptionPrintComponent implements OnInit {
  prescription: any = null;
  branding: any = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private tenantService: TenantService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.get<any>(`v1/prescriptions/print/${id}`).subscribe({
        next: (data) => this.prescription = data,
        error: () => {}
      });
    }
    this.tenantService.loadTenant().subscribe(tenant => this.branding = tenant);
  }

  print() { window.print(); }
}
