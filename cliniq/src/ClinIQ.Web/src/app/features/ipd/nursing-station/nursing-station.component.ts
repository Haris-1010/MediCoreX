import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-nursing-station',
  template: `
    <app-main-layout>
      <app-page-header title="Nursing Station" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Nursing' }]"></app-page-header>
      <mat-tab-group>
        <mat-tab label="Vitals">
          <div class="tab-content">
            <div class="patient-select">
              <mat-form-field appearance="outline"><mat-label>Select Patient</mat-label>
                <mat-select [(value)]="selectedPatient" (selectionChange)="loadVitals()"><mat-option *ngFor="let p of patients" [value]="p">{{ p.patientName }} - Bed {{ p.bedNumber }}</mat-option></mat-select>
              </mat-form-field>
              <button mat-raised-button color="primary" (click)="openVitalsDialog()" [disabled]="!selectedPatient"><mat-icon>add</mat-icon> Record Vitals</button>
            </div>
            <table mat-table [dataSource]="vitalsHistory" *ngIf="selectedPatient">
              <ng-container matColumnDef="time"><th mat-header-cell *matHeaderCellDef>Time</th><td mat-cell *matCellDef="let v">{{ v.recordedAt | date:'short' }}</td></ng-container>
              <ng-container matColumnDef="bp"><th mat-header-cell *matHeaderCellDef>BP</th><td mat-cell *matCellDef="let v">{{ v.bloodPressure }}</td></ng-container>
              <ng-container matColumnDef="pulse"><th mat-header-cell *matHeaderCellDef>Pulse</th><td mat-cell *matCellDef="let v">{{ v.pulse }}</td></ng-container>
              <ng-container matColumnDef="temp"><th mat-header-cell *matHeaderCellDef>Temp</th><td mat-cell *matCellDef="let v">{{ v.temperature }}°F</td></ng-container>
              <ng-container matColumnDef="spo2"><th mat-header-cell *matHeaderCellDef>SpO2</th><td mat-cell *matCellDef="let v">{{ v.spO2 }}%</td></ng-container>
              <ng-container matColumnDef="nurse"><th mat-header-cell *matHeaderCellDef>Recorded By</th><td mat-cell *matCellDef="let v">{{ v.recordedBy }}</td></ng-container>
              <tr mat-header-row *matHeaderRowDef="vitalsColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: vitalsColumns;"></tr>
            </table>
          </div>
        </mat-tab>
        <mat-tab label="Medications">
          <div class="tab-content">
            <div class="med-schedule">
              <div class="time-slot" *ngFor="let slot of medicationSchedule">
                <h4>{{ slot.time }}</h4>
                <div class="med-item" *ngFor="let m of slot.medications" [class.given]="m.given" [class.pending]="!m.given">
                  <mat-checkbox [(ngModel)]="m.given" (change)="updateMedication(m)"></mat-checkbox>
                  <div class="med-info"><strong>{{ m.patientName }}</strong><span>{{ m.medication }} - {{ m.dosage }}</span></div>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Tasks">
          <div class="tab-content">
            <div class="task-list">
              <div class="task-item" *ngFor="let t of tasks" [class.completed]="t.completed">
                <mat-checkbox [(ngModel)]="t.completed" (change)="updateTask(t)"></mat-checkbox>
                <div class="task-info"><strong>{{ t.title }}</strong><span>{{ t.patientName }} | {{ t.dueTime }}</span></div>
                <app-status-badge [status]="t.priority"></app-status-badge>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </app-main-layout>
  `,
  styles: [`.tab-content { padding: 1.5rem; }
    .patient-select { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
    table { width: 100%; background: white; }
    .med-schedule { display: flex; gap: 1.5rem; flex-wrap: wrap; }
    .time-slot { background: white; padding: 1rem; border-radius: 8px; min-width: 250px; }
    .time-slot h4 { margin: 0 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; }
    .med-item, .task-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; border-radius: 4px; margin-bottom: 0.5rem; }
    .med-item.pending { background: #fff3e0; } .med-item.given { background: #e8f5e9; }
    .task-item { background: #f5f5f5; } .task-item.completed { opacity: 0.6; text-decoration: line-through; }
    .med-info, .task-info { flex: 1; } .med-info strong, .task-info strong { display: block; } .med-info span, .task-info span { font-size: 0.875rem; color: #666; }
    .task-list { background: white; padding: 1rem; border-radius: 8px; }`]
})
export class NursingStationComponent implements OnInit {
  patients: any[] = []; selectedPatient: any = null; vitalsHistory: any[] = [];
  vitalsColumns = ['time', 'bp', 'pulse', 'temp', 'spo2', 'nurse'];
  medicationSchedule: any[] = []; tasks: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<any[]>('v1/ipd/admitted-patients').subscribe(r => this.patients = r);
    this.api.get<any[]>('v1/nursing/medications').subscribe(r => this.medicationSchedule = r);
    this.api.get<any[]>('v1/nursing/tasks').subscribe(r => this.tasks = r);
  }

  loadVitals() { if (this.selectedPatient) this.api.get<any[]>(`v1/nursing/vitals/${this.selectedPatient.admissionId}`).subscribe(r => this.vitalsHistory = r); }
  openVitalsDialog() {
    if (!this.selectedPatient) return;
    const bp = prompt('Blood Pressure - Systolic (e.g. 120):');
    if (!bp) return;
    const bpDiastolic = prompt('Blood Pressure - Diastolic (e.g. 80):');
    const pulse = prompt('Pulse (bpm):');
    const temperature = prompt('Temperature (°C):');
    const spO2 = prompt('SpO2 (%):');
    const payload = {
      patientId: this.selectedPatient.patientId,
      admissionId: this.selectedPatient.admissionId || this.selectedPatient.id,
      systolicBP: parseInt(bp) || null,
      diastolicBP: parseInt(bpDiastolic || '0') || null,
      pulse: parseInt(pulse || '0') || null,
      temperature: parseFloat(temperature || '0') || null,
      spO2: parseInt(spO2 || '0') || null
    };
    this.api.post('v1/nursing/vitals', payload).subscribe({
      next: () => { this.loadVitals(); },
      error: () => {}
    });
  }
  updateMedication(m: any) { this.api.patch('v1/nursing/medications', m.id, { given: m.given }).subscribe(); }
  updateTask(t: any) { this.api.patch('v1/nursing/tasks', t.id, { completed: t.completed }).subscribe(); }
}
