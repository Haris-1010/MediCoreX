import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-doctor-form',
  template: `
    <app-main-layout>
      <app-page-header [title]="isEdit ? 'Edit Doctor' : 'Add Doctor'" [breadcrumbs]="[{ label: 'Doctors', route: '/doctors' }, { label: isEdit ? 'Edit' : 'Add' }]"></app-page-header>
      <div class="card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <h3>Personal Information</h3>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>First Name</mat-label><input matInput formControlName="firstName"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Last Name</mat-label><input matInput formControlName="lastName"></mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput type="email" formControlName="email"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Phone</mat-label><input matInput formControlName="phoneNumber"></mat-form-field>
          </div>

          <h3>Professional Information</h3>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Specialization</mat-label><input matInput formControlName="specialization"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Department</mat-label><mat-select formControlName="departmentId"><mat-option *ngFor="let d of departments" [value]="d.id">{{ d.name }}</mat-option></mat-select></mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>License Number</mat-label><input matInput formControlName="licenseNumber"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Consultation Fee</mat-label><input matInput type="number" formControlName="consultationFee"></mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Consultation Start</mat-label><input matInput type="time" formControlName="consultationStartTime"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Consultation End</mat-label><input matInput type="time" formControlName="consultationEndTime"></mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Slot Duration (minutes)</mat-label><input matInput type="number" min="10" max="180" formControlName="slotDuration"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Working Days</mat-label><mat-select formControlName="workingDays" multiple>
              <mat-option value="Monday">Monday</mat-option>
              <mat-option value="Tuesday">Tuesday</mat-option>
              <mat-option value="Wednesday">Wednesday</mat-option>
              <mat-option value="Thursday">Thursday</mat-option>
              <mat-option value="Friday">Friday</mat-option>
              <mat-option value="Saturday">Saturday</mat-option>
              <mat-option value="Sunday">Sunday</mat-option>
            </mat-select></mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Qualifications</mat-label><input matInput formControlName="qualifications" placeholder="e.g., MBBS, MD, MS"></mat-form-field>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Bio</mat-label><textarea matInput formControlName="bio" rows="3"></textarea></mat-form-field>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/doctors">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : 'Save Doctor' }}</button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; max-width: 800px; } h3 { margin: 1.5rem 0 1rem; } h3:first-child { margin-top: 0; }
    .form-row { display: flex; gap: 1rem; } .form-row mat-form-field { flex: 1; } .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; }`]
})
export class DoctorFormComponent implements OnInit {
  form!: FormGroup; isEdit = false; saving = false;
  departments: any[] = [];

  constructor(private fb: FormBuilder, private api: ApiService, private route: ActivatedRoute, private router: Router, private notification: NotificationService) {}

  ngOnInit() {
    this.form = this.fb.group({
      firstName: ['', Validators.required], lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], phoneNumber: ['', Validators.required],
      specialization: ['', Validators.required], departmentId: ['', Validators.required],
      licenseNumber: ['', Validators.required], consultationFee: [0],
      consultationStartTime: ['09:00', Validators.required],
      consultationEndTime: ['17:00', Validators.required],
      slotDuration: [30, [Validators.required, Validators.min(10)]],
      workingDays: [['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']],
      qualifications: [''], bio: ['']
    });
    this.api.get<any[]>('v1/departments').subscribe(r => this.departments = Array.isArray(r) ? r : (Array.isArray((r as any)?.items) ? (r as any).items : []));
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.api.getById<any>('v1/doctors', id).subscribe(d => {
        if (!d) return;
        this.form.patchValue({
          firstName: d.firstName || '',
          lastName: d.lastName || '',
          email: d.email || '',
          phoneNumber: d.phoneNumber || d.phone || '',
          specialization: d.specialization || '',
          departmentId: d.departmentId || '',
          licenseNumber: d.licenseNumber || '',
          qualifications: d.qualifications || d.qualification || '',
          bio: d.bio || '',
          consultationStartTime: d.consultationStartTime || '09:00',
          consultationEndTime: d.consultationEndTime || '17:00',
          slotDuration: d.slotDuration || 30,
          consultationFee: d.consultationFee ?? 0,
          workingDays: Array.isArray(d.workingDays) && d.workingDays.length > 0 ? d.workingDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        });
      });

      // load saved per-day schedules and patch form fields
      this.api.get<any[]>(`v1/doctors/${id}/schedule`).subscribe(schedules => {
        if (!schedules || schedules.length === 0) return;
        const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const workingDays = schedules.map(s => dayNames[s.dayOfWeek]).filter(Boolean);
        const first = schedules[0];
        this.form.patchValue({
          consultationStartTime: first.startTime || '09:00',
          consultationEndTime: first.endTime || '17:00',
          slotDuration: first.slotDuration || 30,
          consultationFee: first.consultationFee ?? 0,
          workingDays: workingDays.length > 0 ? workingDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        });
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;
    const req = this.isEdit ? this.api.put('v1/doctors', this.route.snapshot.paramMap.get('id')!, this.form.value) : this.api.post('v1/doctors', this.form.value);
    req.subscribe({
      next: () => { this.notification.success('Doctor saved'); this.router.navigate(['/doctors']); },
      error: error => { this.saving = false; this.notification.error(error.message || 'Doctor could not be saved.'); }
    });
  }
}
