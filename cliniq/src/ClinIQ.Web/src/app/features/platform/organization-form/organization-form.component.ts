import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../core/services/notification.service';
import { PLATFORM_FEATURES } from '../platform.constants';

@Component({
  standalone: false,
  selector: 'app-organization-form',
  templateUrl: './organization-form.component.html',
  styles: [`
    .form-shell { max-width: 900px; }
    mat-card { border-radius: 12px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px 20px; margin-top: 8px; }
    .full { grid-column: 1 / -1; }
    .section-title { margin-top: 28px; padding-top: 22px; border-top: 1px solid var(--border-color, #edf1f1); display: flex; align-items: baseline; gap: 12px; }
    .section-title mat-icon { color: var(--text-primary, #102b35); }
    .section-title h3 { margin: 0; font-size: 16px; color: var(--text-primary, #172033); }
    .section-title p { margin: 0; color: var(--text-muted, #64748b); font-size: 13px; }

    .give-all-bar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 14px 18px; margin: 18px 0 4px; background: #374151; border-radius: 10px; }
    .give-all-bar .give-all-text { display: flex; flex-direction: column; gap: 2px; }
    .give-all-bar .give-all-text strong { font-size: 14px; color: #fff; }
    .give-all-bar .give-all-text span { font-size: 12px; color: #d1d5db; }
    .toggle-switch { position: relative; display: inline-block; width: 46px; height: 26px; flex: 0 0 auto; }
    .toggle-switch input { opacity: 0; width: 0; height: 0; }
    .toggle-slider { position: absolute; inset: 0; cursor: pointer; background: #6b7280; border-radius: 999px; transition: .2s; }
    .toggle-slider::before { content: ''; position: absolute; width: 20px; height: 20px; left: 3px; top: 3px; background: #fff; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,.2); transition: .2s; }
    .toggle-switch input:checked + .toggle-slider { background: #8bc34a; }
    .toggle-switch input:checked + .toggle-slider::before { transform: translateX(20px); }

    .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 18px 0 4px; }
    .feature-card { display: flex; align-items: center; gap: 12px; border: 1px solid var(--border-color, #dce5e5); border-radius: 10px; padding: 12px 14px; cursor: pointer; transition: border-color .15s, background .15s; }
    .feature-card:hover { border-color: var(--accent-primary, #b7c9c9); }
    .feature-card.selected { border-color: var(--text-primary, #102b35); background: var(--bg-hover, #f3f7f7); }
    .feature-card .ficon { color: var(--warning, #f0b35b); }
    .feature-card .ftext { display: flex; flex-direction: column; line-height: 1.3; }
    .feature-card .ftext strong { font-size: 13px; color: var(--text-primary, #172033); }
    .feature-card .ftext small { color: var(--text-muted, #64748b); font-size: 11px; }
    .feature-card .checkmark { margin-left: auto; color: var(--success, #18794e); }

    .actions-bar { display: flex; justify-content: flex-end; gap: 12px; margin-top: 26px; }
    .credential-panel { margin-top: 20px; border: 1px solid var(--warning, #e2a93b); background: var(--badge-warning-bg, #fff3e0); border-radius: 10px; padding: 20px; }
    .credential-panel h3 { margin: 0 0 8px; color: var(--badge-warning-text, #b54708); }
    .credential-panel .cred { font-family: 'Consolas', monospace; background: var(--bg-hover, #fdecd6); border-radius: 6px; padding: 8px 12px; display: inline-block; margin: 4px 8px 4px 0; }

    @media (max-width: 800px) {
      .grid, .features-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class OrganizationFormComponent implements OnInit {
  isEdit = false;
  orgId: string | null = null;
  loading = false;
  saving = false;
  form!: FormGroup;
  availableFeatures = PLATFORM_FEATURES;
  selectedFeatures: string[] = [];
  createdCredentials: { email: string; password: string } | null = null;
  private readonly endpoint = `${environment.apiUrl}/v1/platform/organizations`;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.orgId = this.route.snapshot.params['id'] || null;
    this.isEdit = !!this.orgId;

    this.form = this.fb.group({
      name: ['', Validators.required],
      code: [''],
      contactPersonName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: [''],
      address: [''],
      initialBranchName: ['Main Branch'],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      masterEmail: ['', [Validators.required, Validators.email]],
      temporaryPassword: ['', [Validators.required, Validators.minLength(8)]]
    });

    if (this.isEdit) {
      this.form.get('temporaryPassword')?.setValidators([]);
      this.form.get('firstName')?.disable();
      this.form.get('lastName')?.disable();
      this.form.get('masterEmail')?.disable();
      this.loadExisting();
    } else {
      this.selectedFeatures = PLATFORM_FEATURES.map(f => f.key);
    }
  }

  loadExisting(): void {
    this.loading = true;
    this.http.get<any>(`${this.endpoint}/${this.orgId}`).subscribe({
      next: org => {
        const owner = org.users?.find((u: any) => u.isOwner);
        this.form.patchValue({
          name: org.name,
          code: org.code || '',
          contactPersonName: owner?.fullName || '',
          contactEmail: org.email || '',
          contactPhone: org.phone || '',
          address: org.address || ''
        });
        if (owner) {
          this.form.patchValue({
            firstName: owner.fullName?.split(' ')[0] || '',
            lastName: owner.fullName?.split(' ').slice(1).join(' ') || '',
            masterEmail: owner.email || ''
          });
        }
        this.selectedFeatures = org.enabledFeatures || [];
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.notification.error(error.error?.message || 'Unable to load organization.');
      }
    });
  }

  isModuleSelected(featureKey: string): boolean {
    return this.selectedFeatures.includes(featureKey);
  }

  toggleModule(featureKey: string, enabled: boolean): void {
    this.selectedFeatures = enabled
      ? [...new Set([...this.selectedFeatures, featureKey])]
      : this.selectedFeatures.filter(f => f !== featureKey);
  }

  hasAllFeatures(): boolean {
    return this.availableFeatures.length > 0 &&
      this.availableFeatures.every(f => this.selectedFeatures.includes(f.key));
  }

  toggleAllFeatures(): void {
    if (this.hasAllFeatures()) {
      this.selectedFeatures = [];
    } else {
      this.selectedFeatures = this.availableFeatures.map(f => f.key);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.selectedFeatures.length === 0) {
      this.notification.warning('Select at least one module for this organization.');
      return;
    }

    this.saving = true;
    const value = this.form.getRawValue();

    if (this.isEdit) {
      const id = this.orgId!;
      this.http.put(`${this.endpoint}/${id}`, {
        name: value.name,
        code: value.code || null,
        email: value.contactEmail,
        phone: value.contactPhone || null,
        address: value.address || null
      }).subscribe({
        next: () => {
          this.http.put(`${this.endpoint}/${id}/entitlements`, {
            enabledFeatures: this.selectedFeatures,
            limits: null
          }).subscribe({
            next: () => {
              this.saving = false;
              this.notification.success('Organization updated successfully.');
              this.router.navigate(['/platform/organizations', id]);
            },
            error: error => {
              this.saving = false;
              this.notification.error(error.error?.message || 'Modules could not be updated.');
            }
          });
        },
        error: error => {
          this.saving = false;
          this.notification.error(error.error?.message || 'Organization could not be updated.');
        }
      });
      return;
    }

    const request = {
      name: value.name,
      code: value.code || null,
      organizationType: 'Clinic',
      contactPersonName: value.contactPersonName,
      contactEmail: value.contactEmail,
      contactPhone: value.contactPhone || null,
      address: value.address || null,
      city: null,
      country: null,
      timezone: 'UTC',
      currency: 'PKR',
      logoUrl: null,
      enabledFeatures: this.selectedFeatures,
      limits: null,
      notes: null,
      masterUser: {
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.masterEmail,
        phone: value.contactPhone || null,
        temporaryPassword: value.temporaryPassword
      },
      initialBranchName: value.initialBranchName || null
    };

    this.http.post<any>(this.endpoint, request).subscribe({
      next: response => {
        this.saving = false;
        this.createdCredentials = {
          email: response.masterUserEmail,
          password: response.temporaryPassword
        };
        this.notification.success('Organization created. Save the credentials shown below.');
        this.loadOrganizationsList();
      },
      error: error => {
        this.saving = false;
        this.notification.error(error.error?.message || error.message || 'Organization could not be created.');
      }
    });
  }

  loadOrganizationsList(): void {
    this.router.navigate(['/platform/organizations']);
  }

  resetMasterPassword(): void {
    if (!this.orgId) return;
    const password = this.form.get('temporaryPassword')?.value;
    if (!password || password.length < 8) {
      this.notification.error('Enter a new master-user password (min 8 characters) first.');
      return;
    }
    this.saving = true;
    this.http.post<any>(`${this.endpoint}/${this.orgId}/master-password`, { password }).subscribe({
      next: response => {
        this.saving = false;
        this.createdCredentials = { email: response.email, password: response.temporaryPassword };
        this.form.get('temporaryPassword')?.reset();
      },
      error: error => {
        this.saving = false;
        this.notification.error(error.error?.message || 'Master password could not be reset.');
      }
    });
  }
}
