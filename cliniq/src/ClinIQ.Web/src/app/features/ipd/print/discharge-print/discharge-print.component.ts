import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintBrandHeaderComponent } from '../../../../shared/components/print-brand-header/print-brand-header.component';

export interface DischargePrintData {
  admissionNumber: string;
  patientName: string;
  mrn: string;
  doctorName: string;
  wardName: string;
  roomNumber?: string;
  bedNumber: string;
  admissionDate: string | Date;
  dischargeDate: string | Date;
  daysAdmitted: number;
  dischargeType: string;
  admissionReason?: string;
  provisionalDiagnosis?: string;
  finalDiagnosis?: string;
  dischargeSummary?: string;
  dischargeMedications?: string;
  followUpInstructions?: string;
}

@Component({
  standalone: true,
  selector: 'app-discharge-print',
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
        <h1>Discharge Summary</h1>
        <p>Admission # {{ data.admissionNumber }}</p>
      </div>

      <section>
        <h3>Patient Information</h3>
        <div class="grid">
          <div class="field"><label>Patient Name</label><span>{{ data.patientName }}</span></div>
          <div class="field"><label>MRN</label><span>{{ data.mrn }}</span></div>
        </div>
      </section>

      <section>
        <h3>Admission Details</h3>
        <div class="grid">
          <div class="field"><label>Admission Number</label><span>{{ data.admissionNumber }}</span></div>
          <div class="field"><label>Attending Doctor</label><span>Dr. {{ data.doctorName }}</span></div>
          <div class="field"><label>Ward / Room / Bed</label><span>{{ data.wardName }} / {{ data.roomNumber || '-' }} / {{ data.bedNumber }}</span></div>
          <div class="field"><label>Admission Date</label><span>{{ data.admissionDate | date:'dd MMM yyyy, h:mm a' }}</span></div>
          <div class="field"><label>Discharge Date</label><span>{{ data.dischargeDate | date:'dd MMM yyyy, h:mm a' }}</span></div>
          <div class="field"><label>Duration</label><span>{{ data.daysAdmitted }} days</span></div>
        </div>
      </section>

      <section>
        <h3>Clinical Information</h3>
        <div class="grid">
          <div class="field list-field"><label>Admission Reason</label><span>{{ data.admissionReason || '-' }}</span></div>
          <div class="field list-field"><label>Provisional Diagnosis</label><span>{{ data.provisionalDiagnosis || '-' }}</span></div>
        </div>
      </section>

      <section>
        <h3>Discharge Information</h3>
        <div class="grid">
          <div class="field"><label>Discharge Type</label><span class="chip">{{ data.dischargeType }}</span></div>
        </div>
        <div class="grid" style="margin-top: 10px;">
          <div class="field list-field"><label>Final Diagnosis</label><span>{{ data.finalDiagnosis || '-' }}</span></div>
          <div class="field list-field"><label>Discharge Summary</label><span>{{ data.dischargeSummary || '-' }}</span></div>
          <div class="field list-field" *ngIf="data.dischargeMedications"><label>Discharge Medications</label><span>{{ data.dischargeMedications }}</span></div>
          <div class="field list-field" *ngIf="data.followUpInstructions"><label>Follow-up Instructions</label><span>{{ data.followUpInstructions }}</span></div>
        </div>
      </section>

      <div class="signatures">
        <div class="sig-block"><div class="sig-line"></div><p>Patient / Guardian Signature</p></div>
        <div class="sig-block"><div class="sig-line"></div><p>Treating Doctor Signature</p></div>
        <div class="sig-block"><div class="sig-line"></div><p>Authorized Signature</p></div>
      </div>

      <div class="foot">
        <span>{{ branding?.name || 'Hospital' }} \u2022 Discharge Summary</span>
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
    .chip { display: inline-block; padding: 2px 10px; border-radius: 999px; background: #e8eaf6; color: #1a237e; font-weight: 600; font-size: 12px; }
    .signatures { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; }
    .sig-block { text-align: center; width: 28%; }
    .sig-line { border-top: 1px solid #333; margin-bottom: 6px; }
    .sig-block p { font-size: 10px; color: #64748b; margin: 0; text-transform: uppercase; letter-spacing: .04em; }
    .foot { margin-top: 20px; border-top: 1px solid #c5cae9; padding-top: 10px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
  `]
})
export class DischargePrintComponent implements OnInit {
  @Input() data!: DischargePrintData;
  @Input() branding: any = null;
  today = new Date();

  ngOnInit() {}
}