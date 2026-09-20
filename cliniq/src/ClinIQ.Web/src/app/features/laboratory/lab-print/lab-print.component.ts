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
  selector: 'app-lab-print',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, PrintBrandHeaderComponent],
  template: `
    <div class="print-container" *ngIf="order">
      <app-print-brand-header
        [logoUrl]="branding?.logoUrl || null"
        [orgName]="branding?.name || null"
        [phone]="branding?.phone || null"
        [address]="branding?.address || null">
      </app-print-brand-header>

      <div class="report-header">
        <h1>LABORATORY REPORT</h1>
        <div class="report-meta">
          <p><strong>Order #:</strong> {{ order.orderNumber }}</p>
          <p><strong>Date:</strong> {{ order.orderDate | date:'medium' }}</p>
          <p *ngIf="order.completedAt"><strong>Completed:</strong> {{ order.completedAt | date:'medium' }}</p>
        </div>
      </div>

      <div class="patient-info">
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Patient:</span>
            <span class="value">{{ order.patientName }}</span>
          </div>
          <div class="info-item">
            <span class="label">MRN:</span>
            <span class="value">{{ order.mrn }}</span>
          </div>
          <div class="info-item" *ngIf="order.patientAge">
            <span class="label">DOB:</span>
            <span class="value">{{ order.patientAge | date:'mediumDate' }}</span>
          </div>
          <div class="info-item" *ngIf="order.patientGender">
            <span class="label">Gender:</span>
            <span class="value">{{ order.patientGender }}</span>
          </div>
          <div class="info-item">
            <span class="label">Ordered By:</span>
            <span class="value">Dr. {{ order.orderedBy }}</span>
          </div>
          <div class="info-item" *ngIf="order.doctorSpecialization">
            <span class="label">Specialization:</span>
            <span class="value">{{ order.doctorSpecialization }}</span>
          </div>
        </div>
        <div class="clinical-info" *ngIf="order.clinicalIndication">
          <span class="label">Clinical Indication:</span>
          <span class="value">{{ order.clinicalIndication }}</span>
        </div>
      </div>

      <!-- Test Results Table -->
      <div class="results-section" *ngIf="testResults.length > 0">
        <h2>Test Results</h2>
        <div class="test-block" *ngFor="let test of testResults">
          <h3 class="test-name">{{ test.testName }}</h3>
          <table class="results-table" *ngIf="test.parameters && test.parameters.length > 0">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Result</th>
                <th>Unit</th>
                <th>Reference Range</th>
                <th>Flag</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let param of test.parameters">
                <td>{{ param.name }}</td>
                <td [class.abnormal]="isAbnormal(param)"><strong>{{ param.value || '-' }}</strong></td>
                <td>{{ param.unit }}</td>
                <td>{{ param.normalRange }}</td>
                <td><span *ngIf="isAbnormal(param)" class="flag abnormal">H/L</span></td>
              </tr>
            </tbody>
          </table>
          <div class="simple-result" *ngIf="!test.parameters || test.parameters.length === 0">
            <p><strong>Result:</strong> {{ test.simpleResult || 'Pending' }}</p>
          </div>
        </div>
      </div>

      <!-- No Results Message -->
      <div class="no-results" *ngIf="testResults.length === 0">
        <p>Results are pending or not yet entered.</p>
      </div>

      <div class="notes" *ngIf="order.resultNotes || order.specialInstructions">
        <div *ngIf="order.specialInstructions">
          <h4>Special Instructions</h4>
          <p>{{ order.specialInstructions }}</p>
        </div>
        <div *ngIf="order.resultNotes">
          <h4>Comments</h4>
          <p>{{ order.resultNotes }}</p>
        </div>
      </div>

      <div class="abnormal-summary" *ngIf="order.abnormalFlags">
        <h4>Abnormal Flags</h4>
        <p class="abnormal-text">{{ order.abnormalFlags }}</p>
      </div>

      <div class="signature-section">
        <div class="signature-block">
          <div class="signature-line"></div>
          <p>Lab Technician</p>
        </div>
        <div class="signature-block" *ngIf="order.orderedBy">
          <div class="signature-line"></div>
          <p>Dr. {{ order.orderedBy }}</p>
          <p class="sig-label">Ordering Physician</p>
        </div>
      </div>

      <div class="print-actions no-print">
        <button mat-raised-button color="primary" (click)="print()">
          <mat-icon>print</mat-icon> Print Report
        </button>
      </div>
    </div>

    <div *ngIf="!order" class="loading-container">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
  `,
  styles: [`
    .print-container { max-width: 800px; margin: 0 auto; padding: 2rem; background: var(--bg-card, #fff); }
    .report-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    .report-header h1 { margin: 0; color: #1a237e; font-size: 1.5rem; }
    .report-meta p { margin: 2px 0; font-size: 0.85rem; }
    .patient-info { background: var(--bg-muted, #f5f5f5); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 0.5rem; }
    .info-item .label { font-weight: 600; font-size: 0.8rem; color: var(--text-secondary, #666); display: block; }
    .info-item .value { font-size: 0.9rem; }
    .clinical-info { margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #ddd; }
    .clinical-info .label { font-weight: 600; font-size: 0.8rem; color: var(--text-secondary, #666); }
    .results-section { margin-bottom: 1.5rem; }
    .results-section h2 { color: #1a237e; font-size: 1.1rem; margin: 0 0 1rem; border-bottom: 2px solid #1a237e; padding-bottom: 0.5rem; }
    .test-block { margin-bottom: 1.5rem; }
    .test-name { color: var(--accent-primary, #3f51b5); font-size: 0.95rem; margin: 0 0 0.5rem; }
    .results-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    .results-table th { background: #1a237e; color: white; padding: 6px 10px; text-align: left; font-size: 0.8rem; }
    .results-table td { padding: 6px 10px; border-bottom: 1px solid #eee; }
    .results-table td.abnormal { color: #d32f2f; }
    .flag { padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
    .flag.abnormal { background: #ffebee; color: #d32f2f; }
    .simple-result p { margin: 0; font-size: 0.9rem; }
    .no-results { text-align: center; padding: 2rem; color: var(--text-secondary, #666); }
    .notes { margin-bottom: 1.5rem; }
    .notes h4 { margin: 0 0 0.25rem; color: #1a237e; font-size: 0.9rem; }
    .notes p { margin: 0 0 0.75rem; font-size: 0.85rem; }
    .abnormal-summary { background: #fff3e0; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #ff9800; }
    .abnormal-summary h4 { margin: 0 0 0.25rem; color: #e65100; font-size: 0.9rem; }
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
      .results-table th { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
  `]
})
export class LabPrintComponent implements OnInit {
  order: any = null;
  testResults: any[] = [];
  branding: any = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private tenantService: TenantService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.get<any>(`v1/laboratory/orders/${id}/print`).subscribe({
        next: (data) => {
          this.order = data;
          this.testResults = this.parseTests(data.tests || data.Tests);
        },
        error: () => {}
      });
    }
    this.tenantService.loadTenant().subscribe(tenant => this.branding = tenant);
  }

  private parseTests(raw: any): any[] {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') { try { return JSON.parse(raw); } catch { return []; } }
    return [];
  }

  isAbnormal(param: any): boolean {
    if (!param.value || !param.normalRange) return false;
    const val = parseFloat(param.value);
    if (isNaN(val)) return false;
    const range = param.normalRange.replace(/[<>]/g, '');
    const parts = range.split('-');
    if (parts.length === 2) {
      const min = parseFloat(parts[0]);
      const max = parseFloat(parts[1]);
      if (!isNaN(min) && !isNaN(max)) return val < min || val > max;
    }
    return false;
  }

  print() { window.print(); }
}
