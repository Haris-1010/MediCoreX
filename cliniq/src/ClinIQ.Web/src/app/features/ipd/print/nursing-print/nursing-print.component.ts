import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintBrandHeaderComponent } from '../../../../shared/components/print-brand-header/print-brand-header.component';

export interface VitalPrintData {
  recordedAt?: string | Date;
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;
  spO2?: number;
  respiratoryRate?: number;
  weight?: number;
  bloodSugar?: string;
  notes?: string;
}

export interface MedicationPrintData {
  medicineName: string;
  dosage: string;
  frequency: string;
  durationDays?: number;
  instructions?: string;
  isDispensed: boolean;
}

export interface NursingNotePrintData {
  shift: string;
  noteDate?: string | Date;
  assessment?: string;
  interventions?: string;
  patientResponse?: string;
  carePlan?: string;
  notes?: string;
  painScore?: number;
  fallRisk?: string;
  mobility?: string;
  diet?: string;
}

export interface IOPRintData {
  type: 'Intake' | 'Output';
  description: string;
  amount: number;
  recordedAt?: string | Date;
  notes?: string;
}

export interface NursingPrintData {
  patientName: string;
  ward?: string;
  bed?: string;
  doctorName?: string;
  admissionDate?: string | Date;
  vitalsHistory: VitalPrintData[];
  medications: MedicationPrintData[];
  nursingNotes: NursingNotePrintData[];
  ioRecords: IOPRintData[];
}

@Component({
  standalone: true,
  selector: 'app-nursing-print',
  imports: [CommonModule, PrintBrandHeaderComponent],
  template: `
    <div class="print-container">
      <app-print-brand-header
        [logoUrl]="branding?.logoUrl || null"
        [orgName]="branding?.name || null"
        [phone]="branding?.phone || null"
        [address]="branding?.address || null"
      ></app-print-brand-header>

      <div class="print-meta">
        <div><strong>Date:</strong> {{ today | date:'dd MMM yyyy' }}</div>
        <div><strong>Time:</strong> {{ today | date:'h:mm a' }}</div>
        <div><strong>Nurse:</strong> Nursing Station</div>
      </div>

      <div class="patient-banner">
        <div>
          <h2>{{ data.patientName || 'Unknown Patient' }}</h2>
          <div class="info-row">
            <span><strong>Ward:</strong> {{ data.ward || '-' }}</span>
            <span><strong>Bed:</strong> {{ data.bed || '-' }}</span>
            <span><strong>Doctor:</strong> Dr. {{ data.doctorName || '-' }}</span>
            <span><strong>Admitted:</strong> {{ data.admissionDate ? (data.admissionDate | date:'dd MMM yyyy') : '-' }}</span>
          </div>
        </div>
      </div>

      <section *ngIf="data.vitalsHistory.length">
        <h3>VITALS HISTORY</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Date/Time</th><th>BP (mmHg)</th><th>Pulse (bpm)</th><th>Temp (&deg;F)</th>
              <th>SpO2 (%)</th><th>RR (/min)</th><th>Weight (kg)</th><th>Sugar (mg/dL)</th><th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let v of data.vitalsHistory">
              <td>{{ v.recordedAt ? (v.recordedAt | date:'MMM d, h:mm a') : '-' }}</td>
              <td>{{ v.bloodPressure || '-' }}</td>
              <td>{{ v.pulse || '-' }}</td>
              <td>{{ v.temperature || '-' }}</td>
              <td>{{ v.spO2 || '-' }}</td>
              <td>{{ v.respiratoryRate || '-' }}</td>
              <td>{{ v.weight || '-' }}</td>
              <td>{{ v.bloodSugar || '-' }}</td>
              <td>{{ v.notes || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section *ngIf="data.medications.length">
        <h3>MEDICATIONS</h3>
        <table class="data-table">
          <thead>
            <tr><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Instructions</th><th>Administered</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of data.medications">
              <td>{{ m.medicineName || '-' }}</td>
              <td>{{ m.dosage || '-' }}</td>
              <td>{{ m.frequency || '-' }}</td>
              <td>{{ m.durationDays ? m.durationDays + ' days' : '-' }}</td>
              <td>{{ m.instructions || '-' }}</td>
              <td>{{ m.isDispensed ? 'Yes' : 'No' }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section *ngIf="data.nursingNotes.length">
        <h3>NURSING NOTES</h3>
        <div class="note-block" *ngFor="let n of data.nursingNotes">
          <div class="note-header-line">
            <span class="shift-badge">{{ n.shift || '-' }}</span>
            <span class="note-date">{{ n.noteDate ? (n.noteDate | date:'MMM d, yyyy, h:mm a') : '-' }}</span>
          </div>
          <div class="note-field" *ngIf="n.assessment"><strong>Assessment:</strong> {{ n.assessment }}</div>
          <div class="note-field" *ngIf="n.interventions"><strong>Interventions:</strong> {{ n.interventions }}</div>
          <div class="note-field" *ngIf="n.patientResponse"><strong>Patient Response:</strong> {{ n.patientResponse }}</div>
          <div class="note-field" *ngIf="n.carePlan"><strong>Care Plan:</strong> {{ n.carePlan }}</div>
          <div class="note-field" *ngIf="n.notes"><strong>Notes:</strong> {{ n.notes }}</div>
          <div class="note-obs">
            <span *ngIf="n.painScore">Pain: {{ n.painScore }}</span>
            <span *ngIf="n.fallRisk">Fall Risk: {{ n.fallRisk }}</span>
            <span *ngIf="n.mobility">Mobility: {{ n.mobility }}</span>
            <span *ngIf="n.diet">Diet: {{ n.diet }}</span>
          </div>
        </div>
      </section>

      <section *ngIf="data.ioRecords.length">
        <h3>INTAKE / OUTPUT</h3>
        <div class="io-summary-print">
          <div class="io-box intake"><strong>Total Intake:</strong> {{ getTotalIntake() }} mL</div>
          <div class="io-box output"><strong>Total Output:</strong> {{ getTotalOutput() }} mL</div>
          <div class="io-box balance"><strong>Balance:</strong> {{ getTotalIntake() - getTotalOutput() }} mL</div>
        </div>
        <table class="data-table">
          <thead><tr><th>Type</th><th>Description</th><th>Amount (mL)</th><th>Time</th><th>Notes</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of data.ioRecords">
              <td><span class="type-chip" [class.intake]="r.type === 'Intake'" [class.output]="r.type === 'Output'">{{ r.type }}</span></td>
              <td>{{ r.description || '-' }}</td>
              <td>{{ r.amount || 0 }}</td>
              <td>{{ r.recordedAt ? (r.recordedAt | date:'MMM d, h:mm a') : '-' }}</td>
              <td>{{ r.notes || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <div class="print-footer">
        <div>Generated by {{ branding?.name || 'ClinIQ' }} Healthcare Management System</div>
        <div class="signature-line">Nurse Signature</div>
      </div>
    </div>
  `,
  styles: [`
    .print-container { max-width: 820px; margin: 0 auto; padding: 28px 36px; font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; }
    .print-meta { margin-top: 20px; padding-top: 12px; border-top: 1px solid #e0e0e0; display: flex; gap: 24px; font-size: 11px; color: #666; }
    .print-meta strong { color: #333; }
    .patient-banner { background: linear-gradient(135deg, #e8eaf6, #f5f5ff); border: 1px solid #c5cae9; border-radius: 8px; padding: 15px 20px; margin-bottom: 20px; }
    .patient-banner h2 { font-size: 18px; color: #1a237e; margin-bottom: 4px; }
    .patient-banner .info-row { display: flex; gap: 20px; font-size: 12px; color: #555; }
    .patient-banner .info-row span { display: flex; align-items: center; gap: 4px; }
    .patient-banner .info-row strong { color: #333; }
    section { margin-bottom: 20px; page-break-inside: avoid; }
    section h3 { font-size: 14px; font-weight: 700; color: #fff; background: #3f51b5; padding: 6px 14px; border-radius: 4px; margin-bottom: 10px; display: inline-block; letter-spacing: 0.5px; }
    .data-table { width: 100%; border-collapse: collapse; font-size: 11px; }
    .data-table th { background: #e8eaf6; color: #1a237e; padding: 8px 10px; text-align: left; font-weight: 600; border-bottom: 2px solid #3f51b5; }
    .data-table td { padding: 6px 10px; border-bottom: 1px solid #eee; }
    .data-table tr:nth-child(even) { background: #fafbff; }
    .note-block { border-left: 3px solid #9c27b0; padding: 10px 14px; margin-bottom: 10px; background: #faf5ff; border-radius: 0 6px 6px 0; }
    .note-header-line { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .shift-badge { background: #9c27b0; color: white; padding: 2px 10px; border-radius: 10px; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; }
    .note-date { font-size: 10px; color: #888; }
    .note-field { font-size: 11px; margin-bottom: 4px; color: #333; }
    .note-field strong { color: #555; }
    .note-obs { display: flex; gap: 12px; font-size: 10px; color: #777; margin-top: 6px; }
    .io-summary-print { display: flex; gap: 15px; margin-bottom: 12px; }
    .io-box { flex: 1; text-align: center; padding: 8px; border-radius: 6px; font-size: 11px; }
    .io-box.intake { background: #e3f2fd; color: #1565c0; }
    .io-box.output { background: #fce4ec; color: #c62828; }
    .io-box.balance { background: #e8f5e9; color: #2e7d32; }
    .type-chip { padding: 1px 8px; border-radius: 8px; font-size: 9px; font-weight: 600; }
    .type-chip.intake { background: #e3f2fd; color: #1565c0; }
    .type-chip.output { background: #fce4ec; color: #c62828; }
    .print-footer { margin-top: 30px; border-top: 2px solid #e0e0e0; padding-top: 12px; display: flex; justify-content: space-between; font-size: 10px; color: #999; }
    .print-footer .signature-line { border-top: 1px solid #333; width: 200px; text-align: center; padding-top: 4px; margin-top: 30px; font-size: 11px; color: #333; }
  `]
})
export class NursingPrintComponent implements OnInit {
  @Input() data!: NursingPrintData;
  @Input() branding: any = null;
  today = new Date();

  ngOnInit() {}

  getTotalIntake(): number {
    return this.data.ioRecords.filter(r => r.type === 'Intake').reduce((sum, r) => sum + (r.amount || 0), 0);
  }

  getTotalOutput(): number {
    return this.data.ioRecords.filter(r => r.type === 'Output').reduce((sum, r) => sum + (r.amount || 0), 0);
  }
}