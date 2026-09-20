import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../core/services/api.service';
import { TenantService } from '../../../core/services/tenant.service';
import { PrintBrandHeaderComponent } from '../../../shared/components/print-brand-header/print-brand-header.component';

@Component({
  standalone: true,
  selector: 'app-radiology-print',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, PrintBrandHeaderComponent],
  template: `
    <div class="print-container" *ngIf="report">
      <app-print-brand-header
        [logoUrl]="branding?.logoUrl || null"
        [orgName]="branding?.name || null"
        [phone]="branding?.phone || null"
        [address]="branding?.address || null">
      </app-print-brand-header>

      <div class="report-header">
        <h1>RADIOLOGY REPORT</h1>
        <div class="report-meta">
          <p><strong>Order #:</strong> {{ report.orderNumber }}</p>
          <p><strong>Date:</strong> {{ report.orderDate | date:'medium' }}</p>
          <p *ngIf="report.completedAt"><strong>Completed:</strong> {{ report.completedAt | date:'medium' }}</p>
        </div>
      </div>

      <div class="patient-info">
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Patient:</span>
            <span class="value">{{ report.patientName }}</span>
          </div>
          <div class="info-item">
            <span class="label">MRN:</span>
            <span class="value">{{ report.mrn }}</span>
          </div>
          <div class="info-item" *ngIf="report.patientAge">
            <span class="label">DOB:</span>
            <span class="value">{{ report.patientAge | date:'mediumDate' }}</span>
          </div>
          <div class="info-item" *ngIf="report.patientGender">
            <span class="label">Gender:</span>
            <span class="value">{{ report.patientGender }}</span>
          </div>
          <div class="info-item">
            <span class="label">Ordered By:</span>
            <span class="value">Dr. {{ report.orderedBy }}</span>
          </div>
          <div class="info-item" *ngIf="report.doctorSpecialization">
            <span class="label">Specialization:</span>
            <span class="value">{{ report.doctorSpecialization }}</span>
          </div>
        </div>
      </div>

      <div class="study-info">
        <div class="study-row" *ngIf="report.modality">
          <span class="label">Modality:</span>
          <span class="value">{{ report.modality }}</span>
        </div>
        <div class="study-row" *ngIf="report.bodyPart">
          <span class="label">Body Part:</span>
          <span class="value">{{ report.bodyPart }}</span>
        </div>
        <div class="study-row" *ngIf="report.clinicalIndication">
          <span class="label">Clinical Indication:</span>
          <span class="value">{{ report.clinicalIndication }}</span>
        </div>
        <div class="study-row" *ngIf="report.specialInstructions">
          <span class="label">Special Instructions:</span>
          <span class="value">{{ report.specialInstructions }}</span>
        </div>
      </div>

      <div class="findings-section">
        <h2>Findings</h2>
        <div class="findings-content">
          <p>{{ report.results || 'No findings recorded.' }}</p>
        </div>
      </div>

      <div class="notes-section" *ngIf="report.resultNotes">
        <h2>Impression / Notes</h2>
        <p>{{ report.resultNotes }}</p>
      </div>

      <div class="abnormal-section" *ngIf="report.abnormalFlags">
        <h4>Abnormal Findings</h4>
        <p class="abnormal-text">{{ report.abnormalFlags }}</p>
      </div>

      <div class="signature-section">
        <div class="signature-block">
          <div class="signature-line"></div>
          <p>Reporting Radiologist</p>
        </div>
        <div class="signature-block" *ngIf="report.orderedBy">
          <div class="signature-line"></div>
          <p>Dr. {{ report.orderedBy }}</p>
          <p class="sig-label">Ordering Physician</p>
        </div>
      </div>

      <div class="print-actions no-print">
        <button mat-raised-button color="primary" (click)="print()">
          <mat-icon>print</mat-icon> Print Report
        </button>
      </div>
    </div>

    <div *ngIf="!report" class="loading-container">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
  `,
  styles: [`
    .print-container { max-width: 800px; margin: 0 auto; padding: 2rem; background: var(--bg-card, #fff); }
    .report-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    .report-header h1 { margin: 0; color: #1a237e; font-size: 1.5rem; }
    .report-meta p { margin: 2px 0; font-size: 0.85rem; }
    .patient-info { background: var(--bg-muted, #f5f5f5); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
    .info-item .label { font-weight: 600; font-size: 0.8rem; color: var(--text-secondary, #666); display: block; }
    .info-item .value { font-size: 0.9rem; }
    .study-info { background: #e8eaf6; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; }
    .study-row { display: flex; gap: 0.5rem; margin-bottom: 0.25rem; font-size: 0.9rem; }
    .study-row .label { font-weight: 600; min-width: 140px; }
    .findings-section { margin-bottom: 1.5rem; }
    .findings-section h2, .notes-section h2 { color: #1a237e; font-size: 1.1rem; margin: 0 0 1rem; border-bottom: 2px solid #1a237e; padding-bottom: 0.5rem; }
    .findings-content { font-size: 0.95rem; line-height: 1.6; }
    .findings-content p { margin: 0; white-space: pre-wrap; }
    .notes-section p { margin: 0; font-size: 0.95rem; line-height: 1.6; }
    .abnormal-section { background: #fff3e0; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #ff9800; }
    .abnormal-section h4 { margin: 0 0 0.25rem; color: #e65100; font-size: 0.9rem; }
    .abnormal-text { margin: 0; font-size: 0.85rem; color: #bf360c; }
    .signature-section { display: flex; justify-content: space-between; margin-top: 3rem; }
    .signature-block { text-align: center; }
    .signature-line { width: 200px; border-top: 1px solid #333; margin-bottom: 0.25rem; }
    .signature-block p { margin: 0; font-size: 0.85rem; font-weight: 500; }
    .sig-label { font-size: 0.75rem; color: var(--text-secondary, #666); font-weight: normal !important; }
    .print-actions { text-align: center; margin-top: 2rem; }
    .loading-container { display: flex; justify-content: center; padding: 4rem; }
    @media print {
      .no-print { display: none !important; }
      .print-container { padding: 0; box-shadow: none; }
    }
  `]
})
export class RadiologyPrintComponent implements OnInit {
  report: any = null;
  branding: any = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private tenantService: TenantService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.get<any>(`v1/radiology/orders/${id}/print`).subscribe({
        next: (data) => this.report = data,
        error: () => {}
      });
    }
    this.tenantService.loadTenant().subscribe(tenant => this.branding = tenant);
  }

  print() { window.print(); }
}
