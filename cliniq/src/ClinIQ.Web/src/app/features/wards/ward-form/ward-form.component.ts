import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-ward-form',
  template: `
    <app-main-layout>
      <app-page-header title="New Ward" [breadcrumbs]="[{ label: 'Wards', route: '/wards' }, { label: 'New' }]"></app-page-header>
      <div class="form-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Ward Name *</mat-label>
              <input matInput formControlName="name" placeholder="e.g. ICU Ward A">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Code *</mat-label>
              <input matInput formControlName="code" placeholder="e.g. ICU-A">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Ward Type</mat-label>
              <mat-select formControlName="wardType">
                <mat-option value="General">General</mat-option>
                <mat-option value="ICU">ICU</mat-option>
                <mat-option value="NICU">NICU</mat-option>
                <mat-option value="PICU">PICU</mat-option>
                <mat-option value="Surgical">Surgical</mat-option>
                <mat-option value="Maternity">Maternity</mat-option>
                <mat-option value="Isolation">Isolation</mat-option>
                <mat-option value="Emergency">Emergency</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Total Beds *</mat-label>
              <input matInput type="number" formControlName="totalBeds" min="1">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Daily Rate</mat-label>
              <input matInput type="number" formControlName="dailyRate" min="0">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Gender Restriction</mat-label>
              <mat-select formControlName="genderRestriction">
                <mat-option value="">None</mat-option>
                <mat-option value="Male">Male Only</mat-option>
                <mat-option value="Female">Female Only</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="2"></textarea>
            </mat-form-field>
          </div>
          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="cancel()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">
              <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
              Create Ward
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .form-card { background: white; padding: 2rem; border-radius: 8px; max-width: 700px; }
    .form-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .form-grid mat-form-field { flex: 1; min-width: 200px; }
    .full-width { flex-basis: 100% !important; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #eee; }
  `]
})
export class WardFormComponent implements OnInit {
  form!: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      wardType: ['General'],
      totalBeds: [10, [Validators.required, Validators.min(1)]],
      dailyRate: [0],
      genderRestriction: [''],
      description: ['']
    });
  }

  onSubmit() {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    const payload = this.form.getRawValue();
    this.api.post('v1/wards', payload).subscribe({
      next: () => { this.notification.success('Ward created'); this.router.navigate(['/wards']); },
      error: () => { this.saving = false; this.notification.error('Failed to create ward'); }
    });
  }

  cancel() { this.router.navigate(['/wards']); }
}
