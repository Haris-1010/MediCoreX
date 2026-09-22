import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../core/services/api.service';
import { TenantService } from '../../../core/services/tenant.service';

@Component({
  standalone: true,
  selector: 'app-radiology-print',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="print-container" *ngIf="report">
      <!-- Inline brand header - always visible -->
      <div class="brand-header">
        <div class="brand-left">
          <img *ngIf="branding?.logoUrl" [src]="branding.logoUrl" alt="Logo" class="brand-logo" />
          <div>
            <h1 class="org-name">{{ branding?.name || 'Radiology Department' }}</h1>
            <div class="contact-row">
              <span *ngIf="branding?.phone" class="contact-item">{{ branding.phone }}</span>
              <span *ngIf="branding?.address" class="contact-item">{{ branding.address }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="report-header">
        <h2>RADIOLOGY REPORT</h2>
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

      <!-- Investigation Items -->
      <div class="investigation-section" *ngFor="let item of report.items">
        <div class="study-info">
          <h3>{{ item.serviceName }}</h3>
          <div class="study-row" *ngIf="item.modality"><span class="label">Modality:</span><span class="value">{{ item.modality }}</span></div>
          <div class="study-row" *ngIf="item.bodyPart"><span class="label">Body Part:</span><span class="value">{{ item.bodyPart }}</span></div>
        </div>

        <div class="section" *ngIf="report.clinicalIndication">
          <h4>Clinical Indication</h4>
          <p>{{ report.clinicalIndication }}</p>
        </div>

        <div class="section" *ngIf="item.technique">
          <h4>Technique</h4>
          <p>{{ item.technique }}</p>
        </div>

        <div class="section">
          <h4>Findings</h4>
          <p class="findings-text">{{ item.findings || 'No findings recorded.' }}</p>
        </div>

        <div class="section" *ngIf="item.impression">
          <h4>Impression</h4>
          <p>{{ item.impression }}</p>
        </div>

        <div class="section" *ngIf="item.recommendations">
          <h4>Recommendations</h4>
          <p>{{ item.recommendations }}</p>
        </div>

        <div class="abnormal-section" *ngIf="item.isAbnormal">
          <p class="abnormal-text">Abnormal Findings</p>
        </div>
      </div>

      <div class="no-items" *ngIf="!report.items || report.items.length === 0">
        <div class="section" *ngIf="report.clinicalIndication">
          <h4>Clinical Indication</h4>
          <p>{{ report.clinicalIndication }}</p>
        </div>
        <div class="section" *ngIf="report.results">
          <h4>Findings</h4>
          <p>{{ report.results }}</p>
        </div>
        <div class="section" *ngIf="report.resultNotes">
          <h4>Impression / Notes</h4>
          <p>{{ report.resultNotes }}</p>
        </div>
      </div>

      <div class="signature-section">
        <div class="signature-block" *ngIf="report.reportedBy">
          <div class="signature-line"></div>
          <p>{{ report.reportedBy }}</p>
          <p class="sig-label">Reporting Radiologist</p>
        </div>
        <div class="signature-block" *ngIf="report.verifiedBy">
          <div class="signature-line"></div>
          <p>{{ report.verifiedBy }}</p>
          <p class="sig-label">Verified By</p>
        </div>
        <div class="signature-block" *ngIf="report.orderedBy">
          <div class="signature-line"></div>
          <p>Dr. {{ report.orderedBy }}</p>
          <p class="sig-label">Ordering Physician</p>
        </div>
      </div>

      <div class="footer-note">
        <p>This is a computer-generated radiology report.</p>
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
    .print-container { max-width: 700px; margin: 0 auto; padding: 1.25rem; background: var(--bg-card, #fff); font-size: 0.9rem; }
    .brand-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; margin-bottom: 1rem; border-bottom: 2px solid #1a237e; }
    .brand-left { display: flex; align-items: center; gap: 0.75rem; }
    .brand-logo { max-width: 60px; max-height: 60px; object-fit: contain; }
    .org-name { margin: 0; font-size: 1.2rem; font-weight: 800; color: #1a237e; line-height: 1.2; }
    .contact-row { display: flex; gap: 1rem; margin-top: 2px; }
    .contact-item { font-size: 0.7rem; color: #666; }
    .report-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .report-header h2 { margin: 0; color: #1a237e; font-size: 1.1rem; }
    .report-meta p { margin: 1px 0; font-size: 0.75rem; }
    .patient-info { background: var(--bg-muted, #f5f5f5); padding: 0.6rem 0.75rem; border-radius: 6px; margin-bottom: 1rem; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.3rem 0.75rem; }
    .info-item .label { font-weight: 600; font-size: 0.7rem; color: var(--text-secondary, #666); display: block; }
    .info-item .value { font-size: 0.8rem; }
    .investigation-section { margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e8eaf6; }
    .investigation-section:last-of-type { border-bottom: none; }
    .study-info { background: #e8eaf6; padding: 0.5rem 0.75rem; border-radius: 6px; margin-bottom: 0.75rem; }
    .study-info h3 { margin: 0 0 0.25rem; color: #1a237e; font-size: 0.95rem; }
    .study-row { display: flex; gap: 0.5rem; font-size: 0.8rem; }
    .study-row .label { font-weight: 600; min-width: 80px; }
    .section { margin-bottom: 0.75rem; }
    .section h4 { color: #1a237e; font-size: 0.85rem; margin: 0 0 0.25rem; border-bottom: 1px solid #c5cae9; padding-bottom: 0.15rem; }
    .section p { margin: 0; font-size: 0.85rem; line-height: 1.5; }
    .findings-text { white-space: pre-wrap; }
    .abnormal-section { background: #fff3e0; padding: 0.35rem 0.75rem; border-radius: 4px; border-left: 3px solid #ff9800; margin-top: 0.5rem; }
    .abnormal-text { margin: 0; font-size: 0.75rem; color: #e65100; font-weight: 600; }
    .no-items { color: var(--text-secondary, #666); }
    .signature-section { display: flex; justify-content: space-between; margin-top: 2rem; }
    .signature-block { text-align: center; }
    .signature-line { width: 160px; border-top: 1px solid #333; margin-bottom: 0.2rem; }
    .signature-block p { margin: 0; font-size: 0.75rem; font-weight: 500; }
    .sig-label { font-size: 0.65rem; color: var(--text-secondary, #666); font-weight: normal !important; }
    .footer-note { text-align: center; margin-top: 1rem; padding-top: 0.5rem; border-top: 1px solid #eee; }
    .footer-note p { margin: 0; font-size: 0.7rem; color: var(--text-secondary, #666); font-style: italic; }
    .print-actions { text-align: center; margin-top: 1rem; }
    .loading-container { display: flex; justify-content: center; padding: 4rem; }
    @media print {
      .no-print { display: none !important; }
      .print-container { padding: 0; box-shadow: none; max-width: 100%; }
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
