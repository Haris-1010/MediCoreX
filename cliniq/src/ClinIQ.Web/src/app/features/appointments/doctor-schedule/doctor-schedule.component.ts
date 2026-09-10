import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-doctor-schedule',
  template: `
    <app-main-layout>
      <app-page-header title="Doctor Schedule" subtitle="Manage doctor availability"
        [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Appointments', route: '/appointments' }, { label: 'Schedule' }]">
      </app-page-header>

      <div class="card">
        <mat-form-field appearance="outline">
          <mat-label>Select Doctor</mat-label>
          <mat-select [(value)]="selectedDoctorId" (selectionChange)="loadSchedule()">
            <mat-option *ngFor="let d of doctors" [value]="d.id">Dr. {{ d.fullName }}</mat-option>
          </mat-select>
        </mat-form-field>

        <div *ngIf="selectedDoctorId" class="schedule-form">
          <form [formGroup]="scheduleForm" (ngSubmit)="saveSchedule()">
            <div formArrayName="slots" *ngFor="let slot of slotsArray.controls; let i = index">
              <div [formGroupName]="i" class="slot-row">
                <mat-form-field appearance="outline">
                  <mat-label>Day</mat-label>
                  <mat-select formControlName="dayOfWeek">
                    <mat-option *ngFor="let d of days; let di = index" [value]="di">{{ d }}</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Start Time</mat-label>
                  <input matInput type="time" formControlName="startTime">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>End Time</mat-label>
                  <input matInput type="time" formControlName="endTime">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Slot Duration (min)</mat-label>
                  <input matInput type="number" formControlName="slotDuration">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Fee (Rs.)</mat-label>
                  <input matInput type="number" min="0" formControlName="consultationFee">
                </mat-form-field>
                <button mat-icon-button color="warn" type="button" (click)="removeSlot(i)"><mat-icon>delete</mat-icon></button>
              </div>
            </div>
            <button mat-stroked-button type="button" (click)="addSlot()"><mat-icon>add</mat-icon> Add Slot</button>
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="saving">{{ saving ? 'Saving...' : 'Save Schedule' }}</button>
            </div>
          </form>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: white; padding: 1.5rem; border-radius: 8px; }
    .slot-row { display: flex; gap: 1rem; align-items: center; margin-bottom: 0.5rem; } .slot-row mat-form-field { flex: 1; }
    .form-actions { margin-top: 1rem; display: flex; justify-content: flex-end; }`]
})
export class DoctorScheduleComponent implements OnInit {
  doctors: any[] = [];
  selectedDoctorId: string | null = null;
  scheduleForm!: FormGroup;
  saving = false;
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(private fb: FormBuilder, private api: ApiService, private notification: NotificationService) {}

  ngOnInit() {
    this.scheduleForm = this.fb.group({ slots: this.fb.array([]) });
    this.api.get<any[]>('v1/doctors').subscribe(r => this.doctors = r);
  }

  get slotsArray(): FormArray { return this.scheduleForm.get('slots') as FormArray; }

  loadSchedule() {
    if (!this.selectedDoctorId) return;
    this.slotsArray.clear();
    this.api.get<any[]>(`v1/doctors/${this.selectedDoctorId}/schedule`).subscribe(slots => {
      slots.forEach(s => this.slotsArray.push(this.fb.group({ dayOfWeek: s.dayOfWeek, startTime: s.startTime, endTime: s.endTime, slotDuration: s.slotDuration, consultationFee: s.consultationFee ?? '' })));
    });
  }

  addSlot() { this.slotsArray.push(this.fb.group({ dayOfWeek: [1, Validators.required], startTime: ['09:00', Validators.required], endTime: ['17:00', Validators.required], slotDuration: [30, Validators.required], consultationFee: [''] })); }
  removeSlot(i: number) { this.slotsArray.removeAt(i); }

  saveSchedule() {
    this.saving = true;
    this.api.put('v1/doctors', `${this.selectedDoctorId}/schedule`, this.slotsArray.value).subscribe({
      next: () => { this.notification.success('Schedule saved'); this.saving = false; },
      error: () => this.saving = false
    });
  }
}
