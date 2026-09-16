import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService } from '../../../core/services/tenant.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-nursing-station',
  template: `
    <app-main-layout>
      <app-page-header title="Nursing Station" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Nursing' }]">
        <button mat-stroked-button (click)="print()" *ngIf="selectedPatient"><mat-icon>print</mat-icon> Print</button>
      </app-page-header>

      <!-- Ward + Patient Selector -->
      <div class="selector-bar">
        <mat-form-field appearance="outline">
          <mat-label>Select Ward</mat-label>
          <mat-select [(value)]="selectedWard" (selectionChange)="onWardChange()">
            <mat-option value="">All Wards</mat-option>
            <mat-option *ngFor="let w of wards" [value]="w.id">{{ w.name }} ({{ w.totalBeds }} beds)</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Select Patient</mat-label>
          <mat-select [(value)]="selectedPatient" (selectionChange)="onPatientChange()">
            <mat-option *ngFor="let p of filteredPatients" [value]="p">
              {{ p.patientName }} — {{ p.bed }} ({{ p.ward }})
            </mat-option>
          </mat-select>
        </mat-form-field>
        <div class="patient-chip" *ngIf="selectedPatient">
          <mat-icon>person</mat-icon>
          <span><strong>{{ selectedPatient.patientName }}</strong> &middot; {{ selectedPatient.ward }} &middot; Bed {{ selectedPatient.bed }}</span>
        </div>
        <button mat-stroked-button *ngIf="selectedPatient" (click)="selectedPatient=null;selectedWard=''"><mat-icon>close</mat-icon> Clear</button>
      </div>

      <!-- Patient Cards -->
      <div class="ward-grid" *ngIf="!selectedPatient && filteredPatients.length > 0">
        <div class="patient-card" *ngFor="let p of filteredPatients" (click)="selectPatient(p)">
          <div class="pc-header">
            <div class="pc-avatar">{{ getInitials(p.patientName) }}</div>
            <div class="pc-info">
              <strong>{{ p.patientName }}</strong>
              <span>{{ p.ward }} &middot; Bed {{ p.bed }}</span>
            </div>
          </div>
          <div class="pc-meta">
            <span><mat-icon>medical_services</mat-icon> Dr. {{ p.doctorName }}</span>
            <span><mat-icon>event</mat-icon> {{ p.admissionDate | date:'dd MMM' }}</span>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!selectedPatient && filteredPatients.length === 0 && loaded">
        <mat-icon>local_hospital</mat-icon>
        <h3>No Patients Found</h3>
        <p>Select a ward or admit patients to get started.</p>
      </div>

      <!-- Tabs -->
      <div class="nursing-tabs" *ngIf="selectedPatient">
        <mat-tab-group>
          <!-- Vitals Tab -->
          <mat-tab>
            <ng-template mat-tab-label><mat-icon>monitor_heart</mat-icon> Vitals</ng-template>
            <div class="tab-content">
              <div class="tab-header">
                <h3>Vitals History</h3>
                <button mat-raised-button color="primary" (click)="openVitalsDialog()"><mat-icon>add</mat-icon> Record Vitals</button>
              </div>
              <div class="vitals-cards" *ngIf="vitalsHistory.length > 0">
                <div class="vital-card" *ngFor="let v of vitalsHistory">
                  <div class="vc-top">
                    <span class="vc-time">{{ v.recordedAt | date:'dd MMM, h:mm a' }}</span>
                    <button mat-icon-button [matMenuTriggerFor]="vitalMenu"><mat-icon>more_vert</mat-icon></button>
                    <mat-menu #vitalMenu="matMenu">
                      <button mat-menu-item (click)="editVitals(v)"><mat-icon>edit</mat-icon> Edit</button>
                      <button mat-menu-item (click)="deleteVitals(v)" class="delete-item"><mat-icon>delete</mat-icon> Delete</button>
                    </mat-menu>
                  </div>
                  <div class="vc-grid">
                    <div class="vc-item" [class abnormal]="isBpHigh(v)"><span class="vc-label">BP</span><span class="vc-value">{{ v.bloodPressure || '-' }} <small>mmHg</small></span></div>
                    <div class="vc-item" [class abnormal]="v.pulse > 100 || v.pulse < 60"><span class="vc-label">Pulse</span><span class="vc-value">{{ v.pulse || '-' }} <small>bpm</small></span></div>
                    <div class="vc-item" [class abnormal]="v.temperature > 99.5"><span class="vc-label">Temp</span><span class="vc-value">{{ v.temperature || '-' }} <small>\u00b0F</small></span></div>
                    <div class="vc-item" [class abnormal]="v.spO2 < 94"><span class="vc-label">SpO2</span><span class="vc-value">{{ v.spO2 || '-' }} <small>%</small></span></div>
                    <div class="vc-item"><span class="vc-label">RR</span><span class="vc-value">{{ v.respiratoryRate || '-' }} <small>/min</small></span></div>
                    <div class="vc-item" *ngIf="v.weight"><span class="vc-label">Weight</span><span class="vc-value">{{ v.weight }} <small>kg</small></span></div>
                    <div class="vc-item" *ngIf="v.height"><span class="vc-label">Height</span><span class="vc-value">{{ v.height }} <small>cm</small></span></div>
                    <div class="vc-item" *ngIf="v.bmi"><span class="vc-label">BMI</span><span class="vc-value">{{ v.bmi }}</span></div>
                    <div class="vc-item" *ngIf="v.bloodSugar"><span class="vc-label">Sugar</span><span class="vc-value">{{ v.bloodSugar }} <small>mg/dL</small></span></div>
                  </div>
                  <div class="vc-notes" *ngIf="v.notes"><mat-icon>sticky_note_2</mat-icon> {{ v.notes }}</div>
                </div>
              </div>
              <p class="empty" *ngIf="vitalsHistory.length === 0">No vitals recorded yet.</p>
            </div>
          </mat-tab>

          <!-- Medications Tab -->
          <mat-tab>
            <ng-template mat-tab-label><mat-icon>medication</mat-icon> Medications</ng-template>
            <div class="tab-content">
              <div class="tab-header"><h3>Prescribed Medications</h3></div>
              <div class="med-list" *ngIf="medications.length > 0">
                <div class="med-card" *ngFor="let med of medications" [class.dispensed]="med.isDispensed">
                  <div class="med-header">
                    <div class="med-name">{{ med.medicineName }}</div>
                    <mat-checkbox [checked]="med.isDispensed" (change)="markDispensed(med)" [disabled]="med.isDispensed">
                      {{ med.isDispensed ? 'Administered' : 'Mark Administered' }}
                    </mat-checkbox>
                  </div>
                  <div class="med-details">
                    <span *ngIf="med.dosage"><mat-icon>science</mat-icon> {{ med.dosage }}</span>
                    <span *ngIf="med.frequency"><mat-icon>schedule</mat-icon> {{ formatFrequency(med.frequency) }}</span>
                    <span *ngIf="med.durationDays"><mat-icon>timer</mat-icon> {{ med.durationDays }} days</span>
                    <span *ngIf="med.quantity"><mat-icon>inventory_2</mat-icon> Qty: {{ med.quantity }}</span>
                  </div>
                  <div class="med-timing" *ngIf="med.timing">
                    <span *ngIf="med.timing.morning" class="timing-chip">Morning</span>
                    <span *ngIf="med.timing.afternoon" class="timing-chip">Afternoon</span>
                    <span *ngIf="med.timing.evening" class="timing-chip">Evening</span>
                    <span *ngIf="med.timing.night" class="timing-chip">Night</span>
                  </div>
                  <div class="med-instructions" *ngIf="med.instructions"><mat-icon>info</mat-icon> {{ med.instructions }}</div>
                </div>
              </div>
              <div class="empty-state small" *ngIf="medications.length === 0">
                <mat-icon>medication</mat-icon>
                <h3>No Medications</h3>
                <p>No prescriptions found for this admission.</p>
              </div>
            </div>
          </mat-tab>

          <!-- Nursing Notes Tab -->
          <mat-tab>
            <ng-template mat-tab-label><mat-icon>description</mat-icon> Notes</ng-template>
            <div class="tab-content">
              <div class="tab-header">
                <h3>Nursing Notes</h3>
                <button mat-raised-button color="primary" (click)="openNoteDialog()"><mat-icon>add</mat-icon> Add Note</button>
              </div>
              <div class="notes-list" *ngIf="nursingNotes.length > 0">
                <div class="note-card" *ngFor="let n of nursingNotes">
                  <div class="note-header">
                    <span class="note-shift">{{ n.shift }}</span>
                    <span class="note-date">{{ n.noteDate | date:'dd MMM yyyy, h:mm a' }}</span>
                    <button mat-icon-button [matMenuTriggerFor]="noteMenu"><mat-icon>more_vert</mat-icon></button>
                    <mat-menu #noteMenu="matMenu">
                      <button mat-menu-item (click)="editNote(n)"><mat-icon>edit</mat-icon> Edit</button>
                      <button mat-menu-item (click)="deleteNote(n)" class="delete-item"><mat-icon>delete</mat-icon> Delete</button>
                    </mat-menu>
                  </div>
                  <div class="note-body">
                    <div class="note-row" *ngIf="n.assessment"><label>Assessment</label><span>{{ n.assessment }}</span></div>
                    <div class="note-row" *ngIf="n.interventions"><label>Interventions</label><span>{{ n.interventions }}</span></div>
                    <div class="note-row" *ngIf="n.patientResponse"><label>Patient Response</label><span>{{ n.patientResponse }}</span></div>
                    <div class="note-row" *ngIf="n.carePlan"><label>Care Plan</label><span>{{ n.carePlan }}</span></div>
                    <div class="note-row" *ngIf="n.notes"><label>Notes</label><span>{{ n.notes }}</span></div>
                  </div>
                  <div class="note-obs">
                    <span *ngIf="n.painScore"><mat-icon>emoji_people</mat-icon> Pain: {{ n.painScore }}</span>
                    <span *ngIf="n.fallRisk"><mat-icon>warning</mat-icon> Fall Risk: {{ n.fallRisk }}</span>
                    <span *ngIf="n.mobility"><mat-icon>directions_walk</mat-icon> Mobility: {{ n.mobility }}</span>
                    <span *ngIf="n.diet"><mat-icon>restaurant</mat-icon> Diet: {{ n.diet }}</span>
                  </div>
                </div>
              </div>
              <p class="empty" *ngIf="nursingNotes.length === 0">No nursing notes yet.</p>
            </div>
          </mat-tab>

          <!-- Intake/Output Tab -->
          <mat-tab>
            <ng-template mat-tab-label><mat-icon>water_drop</mat-icon> Intake/Output</ng-template>
            <div class="tab-content">
              <div class="tab-header">
                <h3>Intake / Output Record</h3>
                <button mat-raised-button color="primary" (click)="openIODialog()"><mat-icon>add</mat-icon> Record I/O</button>
              </div>
              <div class="io-summary" *ngIf="ioRecords.length > 0">
                <div class="io-totals">
                  <div class="io-box intake"><span class="io-label">Total Intake</span><span class="io-value">{{ getTotalIntake() }} mL</span></div>
                  <div class="io-box output"><span class="io-label">Total Output</span><span class="io-value">{{ getTotalOutput() }} mL</span></div>
                  <div class="io-box balance"><span class="io-label">Balance</span><span class="io-value">{{ getTotalIntake() - getTotalOutput() }} mL</span></div>
                </div>
                <div class="io-list">
                  <div class="io-item" *ngFor="let r of ioRecords">
                    <div class="io-item-left">
                      <span class="io-type-chip" [class.intake]="r.type==='Intake'" [class.output]="r.type==='Output'">{{ r.type }}</span>
                      <div class="io-item-info">
                        <strong>{{ r.description }}</strong>
                        <span>{{ r.amount }} mL &middot; {{ r.recordedAt | date:'dd MMM, h:mm a' }}</span>
                        <span *ngIf="r.notes">{{ r.notes }}</span>
                      </div>
                    </div>
                    <button mat-icon-button (click)="deleteIO(r)"><mat-icon>delete</mat-icon></button>
                  </div>
                </div>
              </div>
              <p class="empty" *ngIf="ioRecords.length === 0">No intake/output records yet.</p>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </app-main-layout>

    <!-- Vitals Dialog -->
    <ng-template #vitalsDialogRef>
      <h2 mat-dialog-title>{{ editingVitals ? 'Edit' : 'Record' }} Vitals</h2>
      <mat-dialog-content>
        <p class="dialog-patient"><strong>{{ selectedPatient?.patientName }}</strong> &middot; {{ selectedPatient?.ward }} &middot; Bed {{ selectedPatient?.bed }}</p>
        <form [formGroup]="vitalsForm">
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Systolic BP</mat-label><input matInput type="number" formControlName="systolicBP" placeholder="120"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Diastolic BP</mat-label><input matInput type="number" formControlName="diastolicBP" placeholder="80"></mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Pulse (bpm)</mat-label><input matInput type="number" formControlName="pulse" placeholder="72"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Temperature (\u00b0F)</mat-label><input matInput type="number" formControlName="temperature" placeholder="98.6" step="0.1"></mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>SpO2 (%)</mat-label><input matInput type="number" formControlName="spO2" placeholder="98"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Resp. Rate (/min)</mat-label><input matInput type="number" formControlName="respiratoryRate" placeholder="16"></mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Weight (kg)</mat-label><input matInput type="number" formControlName="weight" placeholder="70" step="0.1"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Height (cm)</mat-label><input matInput type="number" formControlName="height" placeholder="170"></mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Blood Sugar (mg/dL)</mat-label><input matInput type="number" formControlName="bloodSugar" placeholder="100"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Sugar Type</mat-label>
              <mat-select formControlName="bloodSugarType">
                <mat-option value="">N/A</mat-option>
                <mat-option value="Fasting">Fasting</mat-option>
                <mat-option value="Random">Random</mat-option>
                <mat-option value="PP">PP</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-w">
            <mat-label>Notes</mat-label>
            <textarea matInput formControlName="notes" rows="2"></textarea>
          </mat-form-field>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" (click)="saveVitals()" [disabled]="vitalsForm.invalid || saving">{{ saving ? 'Saving...' : 'Save' }}</button>
      </mat-dialog-actions>
    </ng-template>

    <!-- Nursing Note Dialog -->
    <ng-template #noteDialogRef>
      <h2 mat-dialog-title>{{ editingNote ? 'Edit' : 'Add' }} Nursing Note</h2>
      <mat-dialog-content>
        <form [formGroup]="noteForm">
          <mat-form-field appearance="outline" class="full-w">
            <mat-label>Shift *</mat-label>
            <mat-select formControlName="shift">
              <mat-option value="Morning">Morning (6AM - 2PM)</mat-option>
              <mat-option value="Afternoon">Afternoon (2PM - 10PM)</mat-option>
              <mat-option value="Night">Night (10PM - 6AM)</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-w">
            <mat-label>Assessment *</mat-label>
            <textarea matInput formControlName="assessment" rows="2"></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-w">
            <mat-label>Interventions</mat-label>
            <textarea matInput formControlName="interventions" rows="2"></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-w">
            <mat-label>Patient Response</mat-label>
            <textarea matInput formControlName="patientResponse" rows="2"></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-w">
            <mat-label>Care Plan</mat-label>
            <textarea matInput formControlName="carePlan" rows="2"></textarea>
          </mat-form-field>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Pain Score</mat-label>
              <mat-select formControlName="painScore">
                <mat-option value="">N/A</mat-option>
                <mat-option *ngFor="let i of [0,1,2,3,4,5,6,7,8,9,10]" [value]="i.toString()">
  {{ i }}
</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Fall Risk</mat-label>
              <mat-select formControlName="fallRisk">
                <mat-option value="">N/A</mat-option>
                <mat-option value="Low">Low</mat-option>
                <mat-option value="Moderate">Moderate</mat-option>
                <mat-option value="High">High</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Mobility</mat-label>
              <mat-select formControlName="mobility">
                <mat-option value="">N/A</mat-option>
                <mat-option value="Independent">Independent</mat-option>
                <mat-option value="Assisted">Assisted</mat-option>
                <mat-option value="Wheelchair">Wheelchair</mat-option>
                <mat-option value="Bedridden">Bedridden</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Diet</mat-label>
              <mat-select formControlName="diet">
                <mat-option value="">N/A</mat-option>
                <mat-option value="Normal">Normal</mat-option>
                <mat-option value="Soft">Soft</mat-option>
                <mat-option value="Liquid">Liquid</mat-option>
                <mat-option value="NPO">NPO</mat-option>
                <mat-option value="Diabetic">Diabetic</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-w">
            <mat-label>General Notes</mat-label>
            <textarea matInput formControlName="notes" rows="2"></textarea>
          </mat-form-field>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" (click)="saveNote()" [disabled]="noteForm.invalid || saving">{{ saving ? 'Saving...' : 'Save' }}</button>
      </mat-dialog-actions>
    </ng-template>

    <!-- IO Dialog -->
    <ng-template #ioDialogRef>
      <h2 mat-dialog-title>Record Intake / Output</h2>
      <mat-dialog-content>
        <form [formGroup]="ioForm">
          <mat-radio-group formControlName="type" class="io-radio">
            <mat-radio-button value="Intake">Intake</mat-radio-button>
            <mat-radio-button value="Output">Output</mat-radio-button>
          </mat-radio-group>
          <mat-form-field appearance="outline" class="full-w">
            <mat-label>Description *</mat-label>
            <mat-select formControlName="description">
              <mat-option *ngFor="let d of getIODescriptions()" [value]="d">{{ d }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-w">
            <mat-label>Amount (mL) *</mat-label>
            <input matInput type="number" formControlName="amount" placeholder="250">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-w">
            <mat-label>Notes</mat-label>
            <textarea matInput formControlName="notes" rows="2"></textarea>
          </mat-form-field>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" (click)="saveIO()" [disabled]="ioForm.invalid || saving">{{ saving ? 'Saving...' : 'Save' }}</button>
      </mat-dialog-actions>
    </ng-template>
  `,
  styles: [`
    .selector-bar { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-bottom: 1.5rem; background: white; padding: 1rem 1.5rem; border-radius: 8px; }
    .selector-bar mat-form-field { flex: 0 0 250px; }
    .patient-chip { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #e8eaf6; border-radius: 999px; font-size: 0.875rem; }
    .patient-chip mat-icon { font-size: 18px; width: 18px; height: 18px; color: #3f51b5; }

    .ward-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }
    .patient-card { background: white; border-radius: 8px; padding: 1.25rem; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
    .patient-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); transform: translateY(-2px); border-color: #3f51b5; }
    .pc-header { display: flex; gap: 1rem; align-items: center; margin-bottom: 0.75rem; }
    .pc-avatar { width: 48px; height: 48px; border-radius: 50%; background: #3f51b5; color: white; display: grid; place-items: center; font-weight: 700; }
    .pc-info strong { display: block; } .pc-info span { font-size: 0.8rem; color: #666; }
    .pc-meta { display: flex; gap: 1rem; font-size: 0.8rem; color: #888; }
    .pc-meta span { display: flex; align-items: center; gap: 0.25rem; }
    .pc-meta mat-icon { font-size: 14px; width: 14px; height: 14px; }

    .empty-state { text-align: center; padding: 4rem 2rem; color: #aaa; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 1rem; }
    .empty-state h3 { margin: 0 0 0.5rem; color: #666; }
    .empty-state.small { padding: 2rem; }
    .empty-state.small mat-icon { font-size: 48px; width: 48px; height: 48px; }

    .nursing-tabs { background: white; border-radius: 8px; }
    .nursing-tabs ::ng-deep .mat-mdc-tab mat-icon { margin-right: 0.5rem; }
    .tab-content { padding: 1.5rem; }
    .tab-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .tab-header h3 { margin: 0; }

    .vitals-cards { display: flex; flex-direction: column; gap: 1rem; }
    .vital-card { background: #f8f9fa; border-radius: 8px; padding: 1rem 1.25rem; border-left: 4px solid #3f51b5; }
    .vc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .vc-time { font-size: 0.8rem; color: #666; font-weight: 500; }
    .vc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.5rem; }
    .vc-item { display: flex; flex-direction: column; }
    .vc-label { font-size: 0.7rem; text-transform: uppercase; color: #888; letter-spacing: 0.05em; }
    .vc-value { font-size: 1.1rem; font-weight: 700; color: #333; }
    .vc-value small { font-size: 0.75rem; font-weight: 400; color: #888; }
    .vc-item.abnormal .vc-value { color: #e53935; }
    .vc-notes { margin-top: 0.5rem; font-size: 0.85rem; color: #666; display: flex; align-items: center; gap: 0.25rem; }
    .vc-notes mat-icon { font-size: 14px; width: 14px; height: 14px; }

    .med-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .med-card { background: #f8f9fa; border-radius: 8px; padding: 1rem 1.25rem; border-left: 4px solid #ff9800; }
    .med-card.dispensed { border-left-color: #4caf50; opacity: 0.7; }
    .med-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .med-name { font-size: 1rem; font-weight: 600; }
    .med-details { display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.85rem; color: #666; }
    .med-details span { display: flex; align-items: center; gap: 0.25rem; }
    .med-details mat-icon, .med-instructions mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .med-instructions { margin-top: 0.5rem; font-size: 0.85rem; color: #888; display: flex; align-items: center; gap: 0.25rem; }
    .med-timing { display: flex; gap: 0.4rem; margin-top: 0.4rem; }
    .timing-chip { background: #e3f2fd; color: #1565c0; padding: 2px 8px; border-radius: 8px; font-size: 0.7rem; font-weight: 500; }

    .notes-list { display: flex; flex-direction: column; gap: 1rem; }
    .note-card { background: #f8f9fa; border-radius: 8px; padding: 1rem 1.25rem; border-left: 4px solid #9c27b0; }
    .note-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; }
    .note-shift { background: #9c27b0; color: white; padding: 2px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    .note-date { font-size: 0.8rem; color: #888; flex: 1; }
    .note-body { margin-bottom: 0.5rem; }
    .note-row { margin-bottom: 0.5rem; }
    .note-row label { font-size: 0.75rem; text-transform: uppercase; color: #888; display: block; margin-bottom: 0.15rem; }
    .note-row span { font-size: 0.9rem; color: #333; }
    .note-obs { display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.8rem; color: #666; }
    .note-obs span { display: flex; align-items: center; gap: 0.25rem; }
    .note-obs mat-icon { font-size: 14px; width: 14px; height: 14px; }

    .io-summary { display: flex; flex-direction: column; gap: 1.5rem; }
    .io-totals { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .io-box { text-align: center; padding: 1rem; border-radius: 8px; }
    .io-box.intake { background: #e3f2fd; } .io-box.output { background: #fce4ec; } .io-box.balance { background: #e8f5e9; }
    .io-label { display: block; font-size: 0.75rem; text-transform: uppercase; color: #666; margin-bottom: 0.25rem; }
    .io-value { font-size: 1.5rem; font-weight: 700; }
    .io-box.intake .io-value { color: #1565c0; } .io-box.output .io-value { color: #c62828; } .io-box.balance .io-value { color: #2e7d32; }
    .io-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .io-item { display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 0.75rem 1rem; border-radius: 8px; }
    .io-item-left { display: flex; align-items: center; gap: 1rem; }
    .io-item-info { display: flex; flex-direction: column; }
    .io-item-info strong { font-size: 0.9rem; }
    .io-item-info span { font-size: 0.8rem; color: #666; }
    .io-type-chip { padding: 2px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    .io-type-chip.intake { background: #e3f2fd; color: #1565c0; }
    .io-type-chip.output { background: #fce4ec; color: #c62828; }

    .dialog-patient { margin: 0 0 1rem; padding: 0.75rem; background: #f5f5f5; border-radius: 4px; }
    .form-row { display: flex; gap: 1rem; }
    .form-row mat-form-field { flex: 1; }
    .full-w { width: 100%; }
    .io-radio { display: flex; gap: 1.5rem; margin-bottom: 1rem; }
    .empty { text-align: center; color: #aaa; padding: 2rem; }
    .delete-item { color: #e53935 !important; }
  `]
})
export class NursingStationComponent implements OnInit {
  @ViewChild('vitalsDialogRef') vitalsDialogRef!: TemplateRef<any>;
  @ViewChild('noteDialogRef') noteDialogRef!: TemplateRef<any>;
  @ViewChild('ioDialogRef') ioDialogRef!: TemplateRef<any>;

  wards: any[] = [];
  allPatients: any[] = [];
  filteredPatients: any[] = [];
  selectedWard = '';
  selectedPatient: any = null;
  loaded = false;

  vitalsHistory: any[] = [];
  medications: any[] = [];
  nursingNotes: any[] = [];
  ioRecords: any[] = [];

  vitalsForm!: FormGroup;
  noteForm!: FormGroup;
  ioForm!: FormGroup;
  saving = false;
  editingVitals: any = null;
  editingNote: any = null;
  branding: any = null;

  private ioIntakeDesc = ['IV Fluid', 'Oral Fluid', 'Blood Transfusion', 'TPS', 'Ringer Lactate', 'Other'];
  private ioOutputDesc = ['Urine', 'Emesis', 'Drain', 'Stool', 'Insensible Loss', 'Other'];

  constructor(private fb: FormBuilder, private api: ApiService, private dialog: MatDialog, private notification: NotificationService, private tenantService: TenantService) {}

  ngOnInit() {
    this.tenantService.loadTenant().subscribe(t => this.branding = t);
    this.vitalsForm = this.fb.group({
      systolicBP: ['', Validators.required], diastolicBP: ['', Validators.required],
      pulse: ['', Validators.required], temperature: ['', Validators.required], spO2: ['', Validators.required],
      respiratoryRate: [''], weight: [''], height: [''], bloodSugar: [''], bloodSugarType: [''], notes: ['']
    });
    this.noteForm = this.fb.group({
      shift: ['Morning', Validators.required], assessment: ['', Validators.required],
      interventions: [''], patientResponse: [''], carePlan: [''],
      painScore: [''], fallRisk: [''], mobility: [''], diet: [''], notes: ['']
    });
    this.ioForm = this.fb.group({
      type: ['Intake', Validators.required], description: ['', Validators.required],
      amount: ['', Validators.required], notes: ['']
    });
    this.loadWards();
    this.loadPatients();
  }

  loadWards() { this.api.get<any>('v1/wards').subscribe(r => this.wards = Array.isArray(r) ? r : []); }

  loadPatients() {
    this.api.get<any>('v1/ipd/admitted-patients').subscribe({
      next: (r) => { this.allPatients = Array.isArray(r) ? r : ((r as any)?.items ?? []); this.filteredPatients = [...this.allPatients]; this.loaded = true; }
    });
  }

  onWardChange() {
    this.filteredPatients = this.selectedWard ? this.allPatients.filter(p => p.wardId === this.selectedWard) : [...this.allPatients];
    this.selectedPatient = null;
  }

  selectPatient(p: any) { this.selectedPatient = p; this.loadPatientData(); }
  onPatientChange() { if (this.selectedPatient) this.loadPatientData(); }

  loadPatientData() {
    if (!this.selectedPatient) return;
    const id = this.selectedPatient.id;
    this.api.get<any>(`v1/nursing/vitals/${id}`).subscribe({
      next: (r) => { this.vitalsHistory = Array.isArray(r) ? r : ((r as any)?.data ?? []); },
      error: (err) => { this.vitalsHistory = []; this.notification.error('Failed to load vitals: ' + (err?.message || 'Unknown error')); }
    });
    this.api.get<any>('v1/nursing/medications', { admissionId: id }).subscribe({
      next: (r) => {
        const data = Array.isArray(r) ? r : ((r as any)?.data ?? []);
        this.medications = [];
        data.forEach((prescription: any) => {
          (prescription.items || []).forEach((item: any) => {
            this.medications.push(item);
          });
        });
      },
      error: (err) => { this.medications = []; this.notification.error('Failed to load medications: ' + (err?.message || 'Unknown error')); }
    });
    this.api.get<any>('v1/nursing/notes', { admissionId: id }).subscribe({
      next: (r) => { this.nursingNotes = Array.isArray(r) ? r : ((r as any)?.data ?? []); },
      error: (err) => { this.nursingNotes = []; this.notification.error('Failed to load notes: ' + (err?.message || 'Unknown error')); }
    });
    this.loadIO();
  }

  loadIO() {
    if (!this.selectedPatient) return;
    this.api.get<any>('v1/nursing/intake-output', { admissionId: this.selectedPatient.id }).subscribe({
      next: (r) => { this.ioRecords = Array.isArray(r) ? r : ((r as any)?.data ?? []); },
      error: (err) => { this.ioRecords = []; this.notification.error('Failed to load intake/output: ' + (err?.message || 'Unknown error')); }
    });
  }

  getInitials(name: string): string { return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'; }

  formatFrequency(freq: string): string {
    const map: Record<string, string> = {
      'OnceDaily': 'Once Daily', 'TwiceDaily': 'Twice Daily', 'ThriceDaily': 'Thrice Daily',
      'FourTimesDaily': '4 Times Daily', 'EveryFourHours': 'Every 4 Hours', 'EverySixHours': 'Every 6 Hours',
      'EveryEightHours': 'Every 8 Hours', 'EveryTwelveHours': 'Every 12 Hours', 'BeforeMeals': 'Before Meals',
      'AfterMeals': 'After Meals', 'AtBedtime': 'At Bedtime', 'AsNeeded': 'As Needed', 'Weekly': 'Weekly', 'Custom': 'Custom'
    };
    return map[freq] || freq;
  }

  isBpHigh(v: any): boolean { return v.systolicBP > 140 || v.diastolicBP > 90; }

  // ── Vitals ──
  openVitalsDialog() {
    this.editingVitals = null;
    this.vitalsForm.reset({ systolicBP: '', diastolicBP: '', pulse: '', temperature: '', spO2: '', respiratoryRate: '', weight: '', height: '', bloodSugar: '', bloodSugarType: '', notes: '' });
    this.dialog.open(this.vitalsDialogRef, { width: '550px', disableClose: true });
  }

  editVitals(v: any) {
    this.editingVitals = v;
    this.vitalsForm.reset({
      systolicBP: v.systolicBP ?? '', diastolicBP: v.diastolicBP ?? '', pulse: v.pulse ?? '',
      temperature: v.temperature ?? '', spO2: v.spO2 ?? '', respiratoryRate: v.respiratoryRate ?? '',
      weight: v.weight ?? '', height: v.height ?? '', bloodSugar: v.bloodSugar ?? '',
      bloodSugarType: v.bloodSugarType ?? '', notes: v.notes ?? ''
    });
    this.dialog.open(this.vitalsDialogRef, { width: '550px', disableClose: true });
  }

  saveVitals() {
    if (this.vitalsForm.invalid || !this.selectedPatient) return;
    this.saving = true;
    const v = this.vitalsForm.value;
    const payload: any = {
      patientId: this.selectedPatient.patientId, admissionId: this.selectedPatient.id,
      systolicBP: v.systolicBP ? +v.systolicBP : null, diastolicBP: v.diastolicBP ? +v.diastolicBP : null,
      pulse: v.pulse ? +v.pulse : null, temperature: v.temperature ? +v.temperature : null,
      spO2: v.spO2 ? +v.spO2 : null, respiratoryRate: v.respiratoryRate ? +v.respiratoryRate : null,
      weight: v.weight ? +v.weight : null, height: v.height ? +v.height : null,
      bloodSugar: v.bloodSugar ? +v.bloodSugar : null, bloodSugarType: v.bloodSugarType || null, notes: v.notes || null
    };
    const isEdit = !!this.editingVitals;
    const req = isEdit
      ? this.api.put('v1/nursing/vitals', this.editingVitals.id, payload)
      : this.api.post('v1/nursing/vitals', payload);
    req.subscribe({
      next: () => { this.saving = false; this.dialog.closeAll(); this.loadPatientData(); this.notification.success(isEdit ? 'Vitals updated' : 'Vitals recorded'); },
      error: (err) => { this.saving = false; this.notification.error('Failed to save vitals: ' + (err?.message || 'Unknown error')); }
    });
  }

  deleteVitals(v: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Vitals Record', message: 'Are you sure you want to delete this vitals record? This action cannot be undone.', confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete('v1/nursing/vitals', v.id).subscribe({
          next: () => { this.loadPatientData(); this.notification.success('Vitals deleted'); },
          error: (err) => { this.notification.error('Failed to delete vitals: ' + (err?.message || 'Unknown error')); }
        });
      }
    });
  }

  // ── Medications ──
  markDispensed(med: any) {
    this.api.patch('v1/nursing/medications', med.id, { isDispensed: true }).subscribe({
      next: () => { med.isDispensed = true; this.notification.success('Marked as administered'); },
      error: (err) => { this.notification.error('Failed to mark medication: ' + (err?.message || 'Unknown error')); }
    });
  }

  // ── Notes ──
  openNoteDialog() {
    this.editingNote = null;
    this.noteForm.reset({ shift: 'Morning', assessment: '', interventions: '', patientResponse: '', carePlan: '', painScore: '', fallRisk: '', mobility: '', diet: '', notes: '' });
    this.dialog.open(this.noteDialogRef, { width: '550px', disableClose: true });
  }

  editNote(n: any) {
    this.editingNote = n;
    this.noteForm.reset({
      shift: n.shift ?? 'Morning', assessment: n.assessment ?? '', interventions: n.interventions ?? '',
      patientResponse: n.patientResponse ?? '', carePlan: n.carePlan ?? '', painScore: n.painScore ?? '',
      fallRisk: n.fallRisk ?? '', mobility: n.mobility ?? '', diet: n.diet ?? '', notes: n.notes ?? ''
    });
    this.dialog.open(this.noteDialogRef, { width: '550px', disableClose: true });
  }

  saveNote() {

  if (this.noteForm.invalid || !this.selectedPatient) return;

  this.saving = true;

  const v = this.noteForm.value;

  const payload: any = {

    patientId: this.selectedPatient.patientId,
    admissionId: this.selectedPatient.id,

    shift: v.shift || null,
    assessment: v.assessment || null,
    interventions: v.interventions || null,
    patientResponse: v.patientResponse || null,
    carePlan: v.carePlan || null,
    painScore: v.painScore || null,
    fallRisk: v.fallRisk || null,
    mobility: v.mobility || null,
    diet: v.diet || null,
    notes: v.notes || null

  };

  const isEdit = !!this.editingNote;

  const req = isEdit
    ? this.api.put('v1/nursing/notes', this.editingNote.id, payload)
    : this.api.post('v1/nursing/notes', payload);

  req.subscribe({

    next: () => {

      this.saving = false;

      this.dialog.closeAll();

      this.loadPatientData();

      this.notification.success(
        isEdit ? 'Note updated' : 'Note added'
      );

    },

    error: (err) => {

      this.saving = false;

      console.error('Save Note Error:', err);

      this.notification.error(
        'Failed to save note: ' +
        (err?.error?.message || err?.message || 'Unknown error')
      );

    }

  });

}

  deleteNote(n: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Nursing Note', message: 'Are you sure you want to delete this nursing note? This action cannot be undone.', confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete('v1/nursing/notes', n.id).subscribe({
          next: () => { this.loadPatientData(); this.notification.success('Note deleted'); },
          error: (err) => { this.notification.error('Failed to delete note: ' + (err?.message || 'Unknown error')); }
        });
      }
    });
  }

  // ── Intake/Output ──
  getIODescriptions(): string[] { return this.ioForm.value.type === 'Intake' ? this.ioIntakeDesc : this.ioOutputDesc; }

  openIODialog() {
    this.ioForm.reset({ type: 'Intake', description: '', amount: '', notes: '' });
    this.dialog.open(this.ioDialogRef, { width: '450px', disableClose: true });
  }

  saveIO() {
    if (this.ioForm.invalid || !this.selectedPatient) return;
    this.saving = true;
    const v = this.ioForm.value;
    const payload = {
      patientId: this.selectedPatient.patientId, admissionId: this.selectedPatient.id,
      type: v.type, description: v.description, amount: +v.amount, notes: v.notes || null
    };
    this.api.post('v1/nursing/intake-output', payload).subscribe({
      next: () => { this.saving = false; this.dialog.closeAll(); this.loadIO(); this.notification.success('Intake/Output recorded'); },
      error: (err) => { this.saving = false; this.notification.error('Failed to save intake/output: ' + (err?.message || 'Unknown error')); }
    });
  }

  deleteIO(r: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Record', message: 'Are you sure you want to delete this intake/output record? This action cannot be undone.', confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete('v1/nursing/intake-output', r.id, { admissionId: this.selectedPatient.id }).subscribe({
          next: () => { this.loadIO(); this.notification.success('Record deleted'); },
          error: (err) => { this.notification.error('Failed to delete record: ' + (err?.message || 'Unknown error')); }
        });
      }
    });
  }

  getTotalIntake(): number { return this.ioRecords.filter(r => r.type === 'Intake').reduce((sum, r) => sum + (r.amount || 0), 0); }
  getTotalOutput(): number { return this.ioRecords.filter(r => r.type === 'Output').reduce((sum, r) => sum + (r.amount || 0), 0); }

  print() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const p = this.selectedPatient;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    let vitalsHtml = '';
    this.vitalsHistory.forEach(v => {
      vitalsHtml += `
        <tr>
          <td>${v.recordedAt ? new Date(v.recordedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
          <td>${v.bloodPressure || '-'}</td>
          <td>${v.pulse || '-'}</td>
          <td>${v.temperature || '-'}</td>
          <td>${v.spO2 || '-'}</td>
          <td>${v.respiratoryRate || '-'}</td>
          <td>${v.weight || '-'}</td>
          <td>${v.bloodSugar || '-'}</td>
          <td>${v.notes || '-'}</td>
        </tr>`;
    });

    let medsHtml = '';
    this.medications.forEach(m => {
      medsHtml += `
        <tr>
          <td>${m.medicineName || '-'}</td>
          <td>${m.dosage || '-'}</td>
          <td>${m.frequency || '-'}</td>
          <td>${m.durationDays ? m.durationDays + ' days' : '-'}</td>
          <td>${m.instructions || '-'}</td>
          <td>${m.isDispensed ? 'Yes' : 'No'}</td>
        </tr>`;
    });

    let notesHtml = '';
    this.nursingNotes.forEach(n => {
      notesHtml += `
        <div class="note-block">
          <div class="note-header-line">
            <span class="shift-badge">${n.shift || '-'}</span>
            <span class="note-date">${n.noteDate ? new Date(n.noteDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</span>
          </div>
          ${n.assessment ? `<div class="note-field"><strong>Assessment:</strong> ${n.assessment}</div>` : ''}
          ${n.interventions ? `<div class="note-field"><strong>Interventions:</strong> ${n.interventions}</div>` : ''}
          ${n.patientResponse ? `<div class="note-field"><strong>Patient Response:</strong> ${n.patientResponse}</div>` : ''}
          ${n.carePlan ? `<div class="note-field"><strong>Care Plan:</strong> ${n.carePlan}</div>` : ''}
          ${n.notes ? `<div class="note-field"><strong>Notes:</strong> ${n.notes}</div>` : ''}
          <div class="note-obs">
            ${n.painScore ? `<span>Pain: ${n.painScore}</span>` : ''}
            ${n.fallRisk ? `<span>Fall Risk: ${n.fallRisk}</span>` : ''}
            ${n.mobility ? `<span>Mobility: ${n.mobility}</span>` : ''}
            ${n.diet ? `<span>Diet: ${n.diet}</span>` : ''}
          </div>
        </div>`;
    });

    let ioHtml = '';
    if (this.ioRecords.length > 0) {
      ioHtml = `
        <div class="io-summary-print">
          <div class="io-box"><strong>Total Intake:</strong> ${this.getTotalIntake()} mL</div>
          <div class="io-box"><strong>Total Output:</strong> ${this.getTotalOutput()} mL</div>
          <div class="io-box"><strong>Balance:</strong> ${this.getTotalIntake() - this.getTotalOutput()} mL</div>
        </div>
        <table class="data-table">
          <thead><tr><th>Type</th><th>Description</th><th>Amount (mL)</th><th>Time</th><th>Notes</th></tr></thead>
          <tbody>
            ${this.ioRecords.map(r => `
              <tr>
                <td><span class="type-chip ${r.type === 'Intake' ? 'intake' : 'output'}">${r.type}</span></td>
                <td>${r.description || '-'}</td>
                <td>${r.amount || 0}</td>
                <td>${r.recordedAt ? new Date(r.recordedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                <td>${r.notes || '-'}</td>
              </tr>`).join('')}
          </tbody>
        </table>`;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Nursing Station - ${p.patientName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a2e; padding: 30px; background: #fff; }
          
          .print-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #3f51b5; padding-bottom: 15px; margin-bottom: 20px; }
          .brand { display: flex; align-items: center; gap: 12px; }
          .brand-icon { width: 48px; height: 48px; background: linear-gradient(135deg, #3f51b5, #5c6bc0); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 700; }
          .brand-text h1 { font-size: 22px; color: #3f51b5; letter-spacing: 1px; }
          .brand-text p { font-size: 11px; color: #666; letter-spacing: 0.5px; }
          .print-meta { text-align: right; font-size: 11px; color: #666; }
          .print-meta strong { color: #333; }

          .patient-banner { background: linear-gradient(135deg, #e8eaf6, #f5f5ff); border: 1px solid #c5cae9; border-radius: 8px; padding: 15px 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .patient-banner h2 { font-size: 18px; color: #1a237e; margin-bottom: 4px; }
          .patient-banner .info-row { display: flex; gap: 20px; font-size: 12px; color: #555; }
          .patient-banner .info-row span { display: flex; align-items: center; gap: 4px; }
          .patient-banner .info-row strong { color: #333; }

          .section { margin-bottom: 20px; page-break-inside: avoid; }
          .section-title { font-size: 14px; font-weight: 700; color: #fff; background: #3f51b5; padding: 6px 14px; border-radius: 4px; margin-bottom: 10px; display: inline-block; letter-spacing: 0.5px; }
          
          .data-table { width: 100%; border-collapse: collapse; font-size: 11px; }
          .data-table th { background: #e8eaf6; color: #1a237e; padding: 8px 10px; text-align: left; font-weight: 600; border-bottom: 2px solid #3f51b5; }
          .data-table td { padding: 6px 10px; border-bottom: 1px solid #eee; }
          .data-table tr:nth-child(even) { background: #fafbff; }
          .data-table tr:hover { background: #f0f0ff; }

          .note-block { border-left: 3px solid #9c27b0; padding: 10px 14px; margin-bottom: 10px; background: #faf5ff; border-radius: 0 6px 6px 0; }
          .note-header-line { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
          .shift-badge { background: #9c27b0; color: white; padding: 2px 10px; border-radius: 10px; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; }
          .note-date { font-size: 10px; color: #888; }
          .note-field { font-size: 11px; margin-bottom: 4px; color: #333; }
          .note-field strong { color: #555; }
          .note-obs { display: flex; gap: 12px; font-size: 10px; color: #777; margin-top: 6px; }

          .io-summary-print { display: flex; gap: 15px; margin-bottom: 12px; }
          .io-box { flex: 1; text-align: center; padding: 8px; border-radius: 6px; font-size: 11px; }
          .io-box:nth-child(1) { background: #e3f2fd; color: #1565c0; }
          .io-box:nth-child(2) { background: #fce4ec; color: #c62828; }
          .io-box:nth-child(3) { background: #e8f5e9; color: #2e7d32; }

          .type-chip { padding: 1px 8px; border-radius: 8px; font-size: 9px; font-weight: 600; }
          .type-chip.intake { background: #e3f2fd; color: #1565c0; }
          .type-chip.output { background: #fce4ec; color: #c62828; }

          .print-footer { margin-top: 30px; border-top: 2px solid #e0e0e0; padding-top: 12px; display: flex; justify-content: space-between; font-size: 10px; color: #999; }
          .print-footer .signature-line { border-top: 1px solid #333; width: 200px; text-align: center; padding-top: 4px; margin-top: 30px; font-size: 11px; color: #333; }

          .empty-section { text-align: center; color: #aaa; font-style: italic; padding: 10px; font-size: 11px; }

          @media print {
            body { padding: 15px; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div class="brand">
            ${this.branding?.logoUrl ? `<img src="${this.branding.logoUrl}" alt="logo" style="max-width: 48px; max-height: 48px; border-radius: 8px;">` : `<div class="brand-icon">${this.branding?.name ? this.branding.name.charAt(0) : 'C'}</div>`}
            <div class="brand-text">
              <h1>${this.branding?.name || 'ClinIQ'}</h1>
              <p>${this.branding?.phone ? this.branding.phone + (this.branding.address ? ' • ' + this.branding.address : '') : 'Healthcare Management System'}</p>
            </div>
          </div>
          <div class="print-meta">
            <div><strong>Date:</strong> ${dateStr}</div>
            <div><strong>Time:</strong> ${timeStr}</div>
            <div><strong>Nurse:</strong> Nursing Station</div>
          </div>
        </div>

        <div class="patient-banner">
          <div>
            <h2>${p.patientName || 'Unknown Patient'}</h2>
            <div class="info-row">
              <span><strong>Ward:</strong> ${p.ward || '-'}</span>
              <span><strong>Bed:</strong> ${p.bed || '-'}</span>
              <span><strong>Doctor:</strong> Dr. ${p.doctorName || '-'}</span>
              <span><strong>Admitted:</strong> ${p.admissionDate ? new Date(p.admissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</span>
            </div>
          </div>
        </div>

        ${this.vitalsHistory.length > 0 ? `
        <div class="section">
          <div class="section-title">VITALS HISTORY</div>
          <table class="data-table">
            <thead><tr><th>Date/Time</th><th>BP (mmHg)</th><th>Pulse (bpm)</th><th>Temp (&deg;F)</th><th>SpO2 (%)</th><th>RR (/min)</th><th>Weight (kg)</th><th>Sugar (mg/dL)</th><th>Notes</th></tr></thead>
            <tbody>${vitalsHtml}</tbody>
          </table>
        </div>` : ''}

        ${this.medications.length > 0 ? `
        <div class="section">
          <div class="section-title">MEDICATIONS</div>
          <table class="data-table">
            <thead><tr><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Instructions</th><th>Administered</th></tr></thead>
            <tbody>${medsHtml}</tbody>
          </table>
        </div>` : ''}

        ${this.nursingNotes.length > 0 ? `
        <div class="section">
          <div class="section-title">NURSING NOTES</div>
          ${notesHtml}
        </div>` : ''}

        ${this.ioRecords.length > 0 ? `
        <div class="section">
          <div class="section-title">INTAKE / OUTPUT</div>
          ${ioHtml}
        </div>` : ''}

        <div class="print-footer">
          <div>Generated by ${this.branding?.name || 'ClinIQ'} Healthcare Management System</div>
          <div class="signature-line">Nurse Signature</div>
        </div>

        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
}
