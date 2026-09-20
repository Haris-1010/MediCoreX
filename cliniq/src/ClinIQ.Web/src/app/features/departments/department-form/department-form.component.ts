import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-department-form',
  template: `
    <app-main-layout>
      <app-page-header
        [title]="isEditMode ? 'Edit Department' : 'New Department'"
        [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Departments', route: '/departments' }, { label: isEditMode ? 'Edit' : 'New' }]">
      </app-page-header>

      <div class="form-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Department Name *</mat-label>
              <input matInput formControlName="name" placeholder="e.g. Cardiology">
              <mat-error *ngIf="form.get('name')?.hasError('required')">Name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Department Code *</mat-label>
              <input matInput formControlName="code" placeholder="e.g. CARD">
              <mat-error *ngIf="form.get('code')?.hasError('required')">Code is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3" placeholder="Brief description of the department"></textarea>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="cancel()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">
              <mat-icon *ngIf="!saving">{{ isEditMode ? 'save' : 'add' }}</mat-icon>
              <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
              {{ isEditMode ? 'Update Department' : 'Create Department' }}
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .form-card {
      background: var(--bg-card, #fff);
      padding: 2rem;
      border-radius: 8px;
      max-width: 700px;
    }
    .form-grid {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .full-width {
      width: 100%;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color, #e0e0e0);
    }
  `]
})
export class DepartmentFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  saving = false;
  departmentId: string | null = null;

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
      description: ['']
    });

    this.departmentId = this.route.snapshot.paramMap.get('id');
    if (this.departmentId) {
      this.isEditMode = true;
      this.loadDepartment();
    }
  }

  loadDepartment() {
    this.api.get<any>(`v1/departments/${this.departmentId}`).subscribe({
      next: (dept) => {
        this.form.patchValue({
          name: dept.name,
          code: dept.code,
          description: dept.description
        });
      },
      error: () => {
        this.notification.error('Failed to load department');
        this.router.navigate(['/departments']);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid || this.saving) return;
    this.saving = true;

    const payload = this.form.getRawValue();
    const request = this.isEditMode
      ? this.api.put('v1/departments', this.departmentId!, payload)
      : this.api.post('v1/departments', payload);

    request.subscribe({
      next: () => {
        this.notification.success(this.isEditMode ? 'Department updated successfully' : 'Department created successfully');
        this.router.navigate(['/departments']);
      },
      error: () => {
        this.saving = false;
        this.notification.error('Failed to save department');
      }
    });
  }

  cancel() {
    this.router.navigate(['/departments']);
  }
}
