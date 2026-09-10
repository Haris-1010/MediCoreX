import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-staff-form',
  template: `
    <app-main-layout>
      <app-page-header
        [title]="isEditMode ? 'Edit Staff Member' : 'Add Staff Member'"
        [subtitle]="isEditMode ? 'Update staff information' : 'Register a new staff member'"
        [breadcrumbs]="[
          { label: 'Dashboard', route: '/dashboard' },
          { label: 'Staff', route: '/staff' },
          { label: isEditMode ? 'Edit' : 'New' }
        ]">
      </app-page-header>

      <div class="card">
        <form [formGroup]="staffForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName">
              <mat-error>First name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName">
              <mat-error>Last name is required</mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email">
              <mat-icon matPrefix>email</mat-icon>
              <mat-error>Email is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" *ngIf="!isEditMode">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password">
              <mat-icon matPrefix>lock</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Phone</mat-label>
              <input matInput formControlName="phone">
              <mat-icon matPrefix>phone</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Role</mat-label>
              <mat-select formControlName="roleId">
                <mat-option value="">Select role</mat-option>
                <mat-option *ngFor="let r of roles" [value]="r.id">{{ r.name }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="action-buttons">
            <button mat-stroked-button type="button" (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Cancel
            </button>
            <button mat-raised-button color="primary" type="submit" [disabled]="saving || staffForm.invalid">
              <mat-spinner diameter="20" *ngIf="saving"></mat-spinner>
              <span *ngIf="!saving">
                <mat-icon>{{ isEditMode ? 'save' : 'person_add' }}</mat-icon>
                {{ isEditMode ? 'Update Staff' : 'Add Staff' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eee;
    }

    .action-buttons button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }
    }
  `]
})
export class StaffFormComponent implements OnInit {
  staffForm!: FormGroup;
  isEditMode = false;
  staffId: string | null = null;
  saving = false;
  roles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.staffId = this.route.snapshot.paramMap.get('id');
    this.loadRoles();

    if (this.staffId) {
      this.isEditMode = true;
      this.loadStaff(this.staffId);
    }
  }

  private initForm(): void {
    this.staffForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['ChangeMe@123'],
      phone: [''],
      roleId: ['']
    });
  }

  loadRoles(): void {
    this.api.get<any[]>('v1/roles').subscribe({
      next: (r) => { this.roles = (r || []).filter(role => !role.isSystemRole); },
      error: () => { this.roles = []; }
    });
  }

  loadStaff(id: string): void {
    this.api.getById<any>('v1/staff', id).subscribe({
      next: (staff) => {
        this.staffForm.patchValue({
          firstName: staff.firstName || staff.fullName?.split(' ')[0],
          lastName: staff.lastName || staff.fullName?.split(' ').slice(1).join(' '),
          email: staff.email,
          phone: staff.phoneNumber,
          roleId: staff.roleId || ''
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/staff']);
  }

  onSubmit(): void {
    if (this.staffForm.invalid || this.saving) return;

    this.saving = true;
    this.staffForm.disable();
    const formValue = this.staffForm.getRawValue();

    const payload = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password || 'ChangeMe@123',
      phone: formValue.phone || null,
      roleId: formValue.roleId || null
    };

    const request = this.isEditMode
      ? this.api.put('v1/staff', this.staffId!, payload)
      : this.api.post('v1/staff', payload);

    request.subscribe({
      next: () => {
        this.notification.success(
          this.isEditMode ? 'Staff updated successfully' : 'Staff member added successfully'
        );
        this.router.navigate(['/staff']);
      },
      error: () => {
        this.saving = false;
        this.staffForm.enable();
      },
      complete: () => {
        this.saving = false;
      }
    });
  }
}
