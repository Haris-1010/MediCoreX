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
  selector: 'app-nursing-print-page',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, PrintBrandHeaderComponent],
  template: `
    <div class="print-container" *ngIf="patient">
      <app-print-brand-header
        [logoUrl]="branding?.logoUrl || null"
        [orgName]="branding?.name || null"
        [phone]="branding?.phone || null"
        [address]="branding?.address || null">
      </app-print-brand-header>

      <div class="doc-header">
        <div class="doc-title">
          <h1>Nursing Station Report</h1>
        </div>
        <div class="doc-meta">
          <p><strong>Date:</strong> {{ today | date:'mediumDate' }}</p>
          <p><strong>Time:</strong> {{ today | date:'shortTime' }}</p>
          <p><strong>Nurse:</strong> Nursing Station</p>
        </div>
      </div>

      <div class="patient-banner">
        <div>
          <h2>{{ patient.patientName || 'Unknown Patient' }}</h2>
          <div class="info-row">
            <span><strong>Ward:</strong> {{ patient.ward || '-' }}</span>
            <span><strong>Bed:</strong> {{ patient.bed || '-' }}</span>
            <span><strong>Doctor:</strong> Dr. {{ patient.doctorName || '-' }}</span>
            <span><strong>Admitted:</strong> {{ patient.admissionDate ? (patient.admissionDate | date:'dd MMM yyyy') : '-' }}</span>
          </div>
        </div>
      </div>

      <section *ngIf="vitals.length">
        <h3>VITALS HISTORY</h3>
        <table>
          <thead>
            <tr>
              <th>Date/Time</th><th>BP (mmHg)</th><th>Pulse (bpm)</th><th>Temp (°F)</th>
              <th>SpO2 (%)</th><th>RR (/min)</th><th>Weight (kg)</th><th>Sugar (mg/dL)</th><th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let v of vitals">
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

      <section *ngIf="medications.length">
        <h3>MEDICATIONS</h3>
        <table>
          <thead>
            <tr><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Instructions</th><th>Administered</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of medications">
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

      <section *ngIf="notes.length">
        <h3>NURSING NOTES</h3>
        <div class="note-block" *ngFor="let n of notes">
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

      <section *ngIf="ioRecords.length">
        <h3>INTAKE / OUTPUT</h3>
        <div class="io-summary">
          <div class="io-box intake"><strong>Total Intake:</strong> {{ getTotalIntake() }} mL</div>
          <div class="io-box output"><strong>Total Output:</strong> {{ getTotalOutput() }} mL</div>
          <div class="io-box balance"><strong>Balance:</strong> {{ getTotalIntake() - getTotalOutput() }} mL</div>
        </div>
        <table>
          <thead><tr><th>Type</th><th>Description</th><th>Amount (mL)</th><th>Time</th><th>Notes</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of ioRecords">
              <td><span class="type-chip" [class.intake]="r.type === 'Intake'" [class.output]="r.type === 'Output'">{{ r.type }}</span></td>
              <td>{{ r.description || '-' }}</td>
              <td>{{ r.amount || 0 }}</td>
              <td>{{ r.recordedAt ? (r.recordedAt | date:'MMM d, h:mm a') : '-' }}</td>
              <td>{{ r.notes || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <div class="footer">
        <span>Generated by {{ branding?.name || 'ClinIQ' }} Healthcare Management System</span>
        <span>Printed {{ today | date:'dd MMM yyyy, h:mm a' }}</span>
      </div>

      <div class="signature-section no-print">
        <div class="sig-line"></div>
        <p>Nurse Signature</p>
      </div>

      <div class="print-actions no-print">
        <button mat-raised-button color="primary" (click)="print()">
          <mat-icon>print</mat-icon> Print Nursing Report
        </button>
      </div>
    </div>

    <div *ngIf="!patient" class="loading-container">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
  `,
  styles: [`
    .print-container { max-width: 800px; margin: 0 auto; padding: 1rem; background: white; }
    .doc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; border-bottom: 2px solid #1a237e; padding-bottom: 0.5rem; }
    .doc-title h1 { margin: 0; color: #1a237e; font-size: 1.25rem; text-transform: uppercase; letter-spacing: 1px; }
    .doc-meta p { margin: 2px 0; font-size: 0.75rem; text-align: right; }
    .patient-banner { background: linear-gradient(135deg, #e8eaf6, #f5f5ff); border: 1px solid #c5cae9; border-radius: 6px; padding: 0.5rem 1rem; margin-bottom: 0.75rem; }
    .patient-banner h2 { font-size: 1rem; color: #1a237e; margin-bottom: 0.25rem; }
    .patient-banner .info-row { display: flex; gap: 1rem; font-size: 0.75rem; color: #555; flex-wrap: wrap; }
    .patient-banner .info-row span { display: flex; align-items: center; gap: 0.25rem; }
    section { margin-bottom: 0.75rem; page-break-inside: avoid; }
    section h3 { font-size: 0.8rem; font-weight: 700; color: #fff; background: #3f51b5; padding: 4px 8px; border-radius: 3px; margin-bottom: 0.4rem; display: inline-block; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.7rem; margin-bottom: 0.5rem; }
    th { background: #e8eaf6; color: #1a237e; padding: 4px 6px; text-align: left; font-weight: 600; border-bottom: 2px solid #3f51b5; font-size: 0.65rem; text-transform: uppercase; }
    td { padding: 3px 6px; border-bottom: 1px solid #eee; }
    tr:nth-child(even) { background: #fafbff; }
    .note-block { border-left: 3px solid #9c27b0; padding: 6px 10px; margin-bottom: 6px; background: #faf5ff; border-radius: 0 4px 4px 0; }
    .note-header-line { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
    .shift-badge { background: #9c27b0; color: white; padding: 1px 6px; border-radius: 8px; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.5px; }
    .note-date { font-size: 0.65rem; color: #888; }
    .note-field { font-size: 0.7rem; margin-bottom: 2px; color: #333; }
    .note-field strong { color: #555; }
    .note-obs { display: flex; gap: 8px; font-size: 0.6rem; color: #777; margin-top: 3px; }
    .io-summary { display: flex; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
    .io-box { flex: 1; min-width: 120px; text-align: center; padding: 5px; border-radius: 4px; font-size: 0.7rem; }
    .io-box.intake { background: #e3f2fd; color: #1565c0; }
    .io-box.output { background: #fce4ec; color: #c62828; }
    .io-box.balance { background: #e8f5e9; color: #2e7d32; }
    .type-chip { padding: 1px 6px; border-radius: 6px; font-size: 0.6rem; font-weight: 600; }
    .type-chip.intake { background: #e3f2fd; color: #1565c0; }
    .type-chip.output { background: #fce4ec; color: #c62828; }
    .footer { margin-top: 1rem; padding-top: 0.5rem; border-top: 1px solid #e0e0e0; display: flex; justify-content: space-between; font-size: 0.7rem; color: #999; }
    .signature-section { margin-top: 1rem; padding-top: 0.5rem; border-top: 1px solid #e0e0e0; text-align: right; }
    .sig-line { width: 150px; border-top: 1px solid #333; margin-left: auto; margin-bottom: 0.25rem; }
    .signature-section p { margin: 0; font-size: 0.75rem; color: #333; font-weight: 600; }
    .print-actions { text-align: center; margin-top: 1rem; }
    .loading-container { display: flex; justify-content: center; padding: 2rem; }
    @media print {
      .no-print { display: none !important; }
      .print-container { padding: 0; max-width: none; }
      section { page-break-inside: avoid; }
    }
  `]
})
export class NursingPrintPageComponent implements OnInit {
  patient: any = null;
  vitals: any[] = [];
  medications: any[] = [];
  notes: any[] = [];
  ioRecords: any[] = [];
  branding: any = null;
  today = new Date();

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private tenantService: TenantService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // First get the admission to get patientId
      this.api.get<any>(`v1/admissions/${id}`).subscribe({
        next: (admission) => {
          if (admission) {
            this.patient = {
              patientName: admission.patientName,
              ward: admission.wardName,
              bed: admission.bedNumber,
              doctorName: admission.doctorName,
              admissionDate: admission.admissionDate
            };
            const patientId = admission.patientId;
            
            // Get vitals using admission ID
            this.api.get<any>(`v1/nursing/vitals/${id}`).subscribe({
              next: (r) => { this.vitals = Array.isArray(r) ? r : ((r as any)?.data ?? []); }
            });
            
            // Get medications using admission ID
this.api.get<any>(`v1/nursing/medications`, { admissionId: id }).subscribe({
        next: (r) => {
          const data = Array.isArray(r) ? r : ((r as any)?.data ?? []);
          this.medications = [];
          data.forEach((prescription: any) => {
            (prescription.items || []).forEach((item: any) => {
              this.medications.push(item);
            });
          });
        }
      });
            
            // Get notes using admission ID
            this.api.get<any>(`v1/nursing/notes`, { admissionId: id }).subscribe({
              next: (r) => { this.notes = Array.isArray(r) ? r : ((r as any)?.data ?? []); }
            });
            
            // Get I/O using admission ID
            this.api.get<any>(`v1/nursing/intake-output`, { admissionId: id }).subscribe({
              next: (r) => { this.ioRecords = Array.isArray(r) ? r : ((r as any)?.data ?? []); }
            });
          }
        },
        error: () => {}
      });
    }
    this.tenantService.loadTenant().subscribe(tenant => this.branding = tenant);
  }

  getTotalIntake(): number {
    return this.ioRecords.filter(r => r.type === 'Intake').reduce((sum, r) => sum + (r.amount || 0), 0);
  }

  getTotalOutput(): number {
    return this.ioRecords.filter(r => r.type === 'Output').reduce((sum, r) => sum + (r.amount || 0), 0);
  }

  print() { window.print(); }
}