import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintBrandHeaderComponent } from '../../../../shared/components/print-brand-header/print-brand-header.component';

export interface AdmissionPrintData {
  admissionNumber: string;
  patientName: string;
  mrn: string;
  doctorName: string;
  wardName: string;
  roomNumber?: string;
  bedNumber: string;
  admissionDate: string | Date;
  daysAdmitted: number;
  type: string;
  admissionReason?: string;
  provisionalDiagnosis?: string;
  finalDiagnosis?: string;
  notes?: string;
  allocationHistory?: Array<{
    bed: string;
    ward: string;
    allocatedAt: string | Date;
    releasedAt?: string | Date;
    duration: string;
  }>;
}

@Component({
  standalone: true,
  selector: 'app-admission-print',
  imports: [CommonModule, PrintBrandHeaderComponent],
  template: `
    <div class="print-container">
      <app-print-brand-header
        [logoUrl]="branding?.logoUrl || null"
        [orgName]="branding?.name || null"
        [phone]="branding?.phone || null"
        [address]="branding?.address || null"
      ></app-print-brand-header>

      <div class="doc-title">
        <h1>Admission Slip</h1>
        <p>Admission # {{ data.admissionNumber }}</p>
      </div>

      <section>
        <h3>Patient Information</h3>
        <div class="grid">
          <div class="field"><label>Patient Name</label><span>{{ data.patientName }}</span></div>
          <div class="field"><label>MRN</label><span>{{ data.mrn }}</span></div>
          <div class="field"><label>Admission #</label><span>{{ data.admissionNumber }}</span></div>
        </div>
      </section>

      <section>
        <h3>Admission Details</h3>
        <div class="grid">
          <div class="field"><label>Doctor</label><span>Dr. {{ data.doctorName }}</span></div>
          <div class="field"><label>Ward / Bed</label><span>{{ data.wardName }} / {{ data.bedNumber }}</span></div>
          <div class="field"><label>Admission Date</label><span>{{ data.admissionDate | date:'dd MMM yyyy, h:mm a' }}</span></div>
          <div class="field"><label>Type</label><span>{{ data.type }}</span></div>
          <div class="field"><label>Days Admitted</label><span>{{ data.daysAdmitted }} days</span></div>
          <div class="field list-field"><label>Reason</label><span>{{ data.admissionReason || '-' }}</span></div>
          <div class="field list-field"><label>Provisional Diagnosis</label><span>{{ data.provisionalDiagnosis || '-' }}</span></div>
          <div class="field list-field" *ngIf="data.finalDiagnosis"><label>Final Diagnosis</label><span>{{ data.finalDiagnosis }}</span></div>
          <div class="field list-field" *ngIf="data.notes"><label>Notes</label><span>{{ data.notes }}</span></div>
        </div>
      </section>

      <section *ngIf="data.allocationHistory?.length">
        <h3>Bed Allocation History</h3>
        <table class="print-table">
          <thead>
            <tr><th>Bed</th><th>Ward</th><th>Allocated</th><th>Released</th><th>Duration</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let h of data.allocationHistory">
              <td>{{ h.bed }}</td>
              <td>{{ h.ward }}</td>
              <td>{{ h.allocatedAt | date:'dd MMM yyyy, h:mm a' }}</td>
              <td>{{ h.releasedAt ? (h.releasedAt | date:'dd MMM yyyy, h:mm a') : 'Current' }}</td>
              <td>{{ h.duration }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <div class="signatures">
        <div class="sig-block"><div class="sig-line"></div><p>Patient / Guardian Signature</p></div>
        <div class="sig-block"><div class="sig-line"></div><p>Attending Doctor Signature</p></div>
        <div class="sig-block"><div class="sig-line"></div><p>Authorized Signature</p></div>
      </div>

      <div class="foot">
        <span>{{ branding?.name || 'Hospital' }} \u2022 Admission Record</span>
        <span>Printed {{ today | date:'dd MMM yyyy, h:mm a' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .print-container { max-width: 820px; margin: 0 auto; padding: 28px 36px; font-family: 'Segoe UI', Arial, sans-serif; color: #111; }
    .doc-title { text-align: right; margin-bottom: 18px; }
    .doc-title h1 { margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: .04em; color: #1a237e; }
    .doc-title p { margin: 2px 0 0; font-size: 11px; color: #64748b; }
    section { margin-bottom: 16px; }
    section h3 { font-size: 13px; text-transform: uppercase; letter-spacing: .06em; color: #1a237e; border-bottom: 1px solid #c5cae9; padding-bottom: 6px; margin: 0 0 10px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 20px; }
    .field label { display: block; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: .04em; }
    .field span { font-size: 13px; font-weight: 600; }
    .list-field { grid-column: 1 / -1; }
    .print-table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .print-table th { background: #e8eaf6; padding: 6px 10px; text-align: left; font-size: 10px; text-transform: uppercase; color: #1a237e; border-bottom: 1px solid #c5cae9; }
    .print-table td { padding: 6px 10px; border-bottom: 1px solid #eef2f2; }
    .signatures { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; }
    .sig-block { text-align: center; width: 28%; }
    .sig-line { border-top: 1px solid #333; margin-bottom: 6px; }
    .sig-block p { font-size: 10px; color: #64748b; margin: 0; text-transform: uppercase; letter-spacing: .04em; }
    .foot { margin-top: 20px; border-top: 1px solid #c5cae9; padding-top: 10px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
  `]
})
export class AdmissionPrintComponent implements OnInit {
  @Input() data!: AdmissionPrintData;
  @Input() branding: any = null;
  today = new Date();

  ngOnInit() {}
}