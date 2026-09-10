import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-triage',
  template: `
    <app-main-layout>
      <app-page-header title="Emergency Triage" [breadcrumbs]="[{ label: 'Emergency', route: '/emergency' }, { label: 'Triage' }]"></app-page-header>
      <div class="card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <h3>Patient Information</h3>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Patient Name</mat-label><input matInput formControlName="patientName"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Age</mat-label><input matInput type="number" formControlName="age"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Gender</mat-label><mat-select formControlName="gender"><mat-option value="Male">Male</mat-option><mat-option value="Female">Female</mat-option></mat-select></mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Contact Phone</mat-label><input matInput formControlName="contactPhone"></mat-form-field>

          <h3>Triage Assessment</h3>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Chief Complaint</mat-label><textarea matInput formControlName="chiefComplaint" rows="3"></textarea></mat-form-field>

          <div class="priority-selection">
            <label>Priority Level:</label>
            <mat-radio-group formControlName="priority">
              <mat-radio-button value="Critical" color="warn"><span class="priority critical">Critical</span> - Immediate life threat</mat-radio-button>
              <mat-radio-button value="Urgent"><span class="priority urgent">Urgent</span> - Requires prompt attention</mat-radio-button>
              <mat-radio-button value="Moderate"><span class="priority moderate">Moderate</span> - Can wait up to 1 hour</mat-radio-button>
              <mat-radio-button value="Stable"><span class="priority stable">Stable</span> - Non-urgent</mat-radio-button>
            </mat-radio-group>
          </div>

          <h3>Vitals</h3>
          <div class="form-row" formGroupName="vitals">
            <mat-form-field appearance="outline"><mat-label>Blood Pressure</mat-label><input matInput formControlName="bloodPressure" placeholder="120/80"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Pulse</mat-label><input matInput type="number" formControlName="pulse"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Temperature (°F)</mat-label><input matInput type="number" formControlName="temperature"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>SpO2 (%)</mat-label><input matInput type="number" formControlName="spO2"></mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width"><mat-label>Initial Assessment Notes</mat-label><textarea matInput formControlName="assessmentNotes" rows="3"></textarea></mat-form-field>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/emergency">Cancel</button>
            <button mat-raised-button color="warn" type="submit" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : 'Register Emergency' }}</button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: white; padding: 1.5rem; border-radius: 8px; } h3 { margin: 1.5rem 0 1rem; } h3:first-child { margin-top: 0; }
    .form-row { display: flex; gap: 1rem; } .form-row mat-form-field { flex: 1; } .full-width { width: 100%; }
    .priority-selection { margin: 1rem 0; } .priority-selection label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .priority-selection mat-radio-button { display: block; margin: 0.5rem 0; }
    .priority { padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600; }
    .priority.critical { background: #ffebee; color: #c62828; } .priority.urgent { background: #fff3e0; color: #e65100; }
    .priority.moderate { background: #fffde7; color: #f9a825; } .priority.stable { background: #e8f5e9; color: #2e7d32; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }`]
})
export class TriageComponent implements OnInit {
  form!: FormGroup; saving = false;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private notification: NotificationService) {}

  ngOnInit() {
    this.form = this.fb.group({
      patientName: ['', Validators.required], age: ['', Validators.required], gender: ['', Validators.required],
      contactPhone: [''], chiefComplaint: ['', Validators.required], priority: ['Urgent', Validators.required],
      vitals: this.fb.group({ bloodPressure: [''], pulse: [''], temperature: [''], spO2: [''] }), assessmentNotes: ['']
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;
    this.api.post('v1/emergency', this.form.value).subscribe({
      next: () => { this.notification.success('Emergency case registered'); this.router.navigate(['/emergency']); },
      error: () => this.saving = false
    });
  }
}
