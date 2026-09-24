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
    .form-shell { max-width: 1100px; margin: 0 auto; }
    mat-card { border-radius: 14px; border: 1px solid var(--border-color, #e5e7eb); box-shadow: 0 1px 3px rgba(0,0,0,.04); }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px 20px; margin-top: 8px; }
    .full { grid-column: 1 / -1; }
    .section-title { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border-color, #edf1f1); display: flex; align-items: flex-start; gap: 14px; }
    .section-title:first-of-type { margin-top: 8px; padding-top: 0; border-top: none; }
    .section-title mat-icon { color: var(--accent-primary, #b7c9c9); margin-top: 2px; font-size: 22px; width: 22px; height: 22px; }
    .section-title h3 { margin: 0; font-size: 17px; font-weight: 600; color: var(--text-primary, #102b35); }
    .section-title p { margin: 4px 0 0; color: var(--text-muted, #64748b); font-size: 13px; line-height: 1.5; }
    .section-body { margin-top: 16px; }

    .credential-panel { margin-bottom: 20px; border: 1px solid var(--warning, #e2a93b); background: var(--badge-warning-bg, #fff3e0); border-radius: 12px; padding: 20px 24px; }
    .credential-panel h3 { margin: 0 0 6px; color: var(--badge-warning-text, #b54708); font-size: 15px; }
    .credential-panel p { margin: 0 0 14px; color: #92400e; font-size: 13px; }
    .cred-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
    .cred-row strong { font-size: 13px; color: #78350f; min-width: 130px; }
    .cred { font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; font-weight: 600; background: rgba(255,255,255,.7); border: 1px solid #fcd34d; border-radius: 6px; padding: 8px 14px; color: #92400e; user-select: all; }

    .give-all-bar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 16px 20px; margin: 20px 0 6px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 12px; }
    .give-all-bar .give-all-text { display: flex; flex-direction: column; gap: 3px; }
    .give-all-bar .give-all-text strong { font-size: 14px; color: #fff; }
    .give-all-bar .give-all-text span { font-size: 12px; color: #94a3b8; }
    .toggle-switch { position: relative; display: inline-block; width: 48px; height: 26px; flex: 0 0 auto; }
    .toggle-switch input { opacity: 0; width: 0; height: 0; }
    .toggle-slider { position: absolute; inset: 0; cursor: pointer; background: #64748b; border-radius: 999px; transition: .2s; }
    .toggle-slider::before { content: ''; position: absolute; width: 20px; height: 20px; left: 3px; top: 3px; background: #fff; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,.25); transition: .2s; }
    .toggle-switch input:checked + .toggle-slider { background: #22c55e; }
    .toggle-switch input:checked + .toggle-slider::before { transform: translateX(22px); }

    .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; margin-top: 8px; }
    .feature-card { display: flex; align-items: center; gap: 12px; border: 1.5px solid var(--border-color, #e5e7eb); border-radius: 12px; padding: 14px 16px; cursor: pointer; transition: all .18s; background: var(--bg-card, #fff); }
    .feature-card:hover { border-color: var(--accent-primary, #94a3b8); box-shadow: 0 2px 8px rgba(0,0,0,.06); transform: translateY(-1px); }
    .feature-card.selected { border-color: #22c55e; background: #f0fdf4; box-shadow: 0 0 0 1px #22c55e; }
    .feature-card .ficon { color: var(--accent-primary, #64748b); font-size: 22px; }
    .feature-card.selected .ficon { color: #16a34a; }
    .feature-card .ftext { display: flex; flex-direction: column; line-height: 1.3; flex: 1; min-width: 0; }
    .feature-card .ftext strong { font-size: 13px; color: var(--text-primary, #102b35); font-weight: 600; }
    .feature-card .ftext small { color: var(--text-muted, #64748b); font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .feature-card .checkmark { color: #16a34a; font-size: 20px; }

    .password-row { display: flex; gap: 12px; align-items: flex-start; margin-top: 12px; flex-wrap: wrap; }
    .password-row mat-form-field { min-width: 300px; flex: 1; }

    .actions-bar { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border-color, #edf1f1); }
    .actions-bar button { min-width: 140px; }

    .locations-table { width: 100%; border-collapse: collapse; background: var(--bg-card, #fff); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; overflow: hidden; }
    .locations-table th, .locations-table td { padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--border-color, #f1f5f9); font-size: 13px; }
    .locations-table th { background: var(--table-header-bg, #f8fafc); font-weight: 600; color: var(--text-secondary, #475569); font-size: 11.5px; text-transform: uppercase; letter-spacing: .04em; }
    .locations-table tr:last-child td { border-bottom: none; }
    .locations-loading, .locations-empty { padding: 14px; color: var(--text-muted, #64748b); background: var(--table-header-bg, #f8fafc); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; font-size: 13px; }
    .loc-chip { display: inline-block; padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
    .loc-chip.active { background: var(--badge-success-bg, #dcfce7); color: var(--badge-success-text, #166534); }
    .loc-chip.inactive { background: var(--bg-hover, #e5e7eb); color: var(--text-secondary, #4b5563); }
    .loc-chip.main { background: var(--badge-info-bg, #dbeafe); color: var(--badge-info-text, #1d4ed8); margin-left: 4px; }

    @media (max-width: 800px) {
      .grid { grid-template-columns: 1fr; }
      .features-grid { grid-template-columns: 1fr; }
      .password-row { flex-direction: column; }
      .password-row mat-form-field { min-width: 100%; }
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
  currentPassword = '';
  locations: any[] = [];
  locationsLoading = false;

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
          this.currentPassword = owner.plainPassword || '';
        }
        this.selectedFeatures = org.enabledFeatures || [];
        this.loading = false;
        this.loadLocations();
      },
      error: error => {
        this.loading = false;
        this.notification.error(error.error?.message || 'Unable to load organization.');
      }
    });
  }

  loadLocations(): void {
    if (!this.orgId) return;
    this.locationsLoading = true;
    this.http.get<any[]>(`${this.endpoint}/${this.orgId}/locations`).subscribe({
      next: locations => {
        this.locations = Array.isArray(locations) ? locations : [];
        this.locationsLoading = false;
      },
      error: () => {
        this.locations = [];
        this.locationsLoading = false;
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
        this.currentPassword = response.temporaryPassword;
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
        this.currentPassword = response.temporaryPassword || password;
        this.form.get('temporaryPassword')?.reset();
      },
      error: error => {
        this.saving = false;
        this.notification.error(error.error?.message || 'Master password could not be reset.');
      }
    });
  }
}
