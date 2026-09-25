import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

interface UserTypeInfo {
  value: string;
  label: string;
  icon: string;
  description: string;
  defaultRoleName: string;
}

@Component({
  standalone: false,
  selector: 'app-user-form',
  template: `
    <app-main-layout>
      <app-page-header [title]="isEdit ? 'Edit User' : 'Create User'" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Settings', route: '/settings' }, { label: 'Users', route: '/settings/users' }, { label: isEdit ? 'Edit' : 'New' }]"></app-page-header>

      <div class="page-card">
        <div class="page-header">
          <div>
            <h2>{{ isEdit ? 'Edit User' : 'Create User' }}</h2>
            <p>{{ isEdit ? 'Update account details, type-specific fields and assigned roles.' : 'Choose a user type, fill in the details and assign access roles.' }}</p>
          </div>
          <button class="btn btn-outline" (click)="goBack()">Back to Users</button>
        </div>

        <form (ngSubmit)="save()" #userForm="ngForm" class="form-container" novalidate>
          <!-- User type -->
          <div class="section">
            <h3 class="section-title">User Type <span class="required">*</span></h3>
            <div class="type-grid">
              <label *ngFor="let t of userTypes" class="type-card" [class.active]="user.userType === t.value" [class.error]="showErrors && !user.userType">
                <input type="radio" name="userType" [value]="t.value" [(ngModel)]="user.userType" (change)="onUserTypeChange(t)" #userTypeCtrl="ngModel" required>
                <span class="type-icon"><mat-icon>{{ t.icon }}</mat-icon></span>
                <span class="type-body">
                  <strong>{{ t.label }}</strong>
                  <small>{{ t.description }}</small>
                </span>
              </label>
            </div>
            <div class="field-error" *ngIf="showErrors && !user.userType">Please select a user type</div>
          </div>

          <!-- Account -->
          <div class="section">
            <h3 class="section-title">Account Details</h3>
            <div class="form-row">
              <div class="form-group">
                <label>First Name <span class="required">*</span></label>
                <input type="text" class="form-control" [(ngModel)]="user.firstName" name="firstName" #firstName="ngModel" required minlength="2" placeholder="e.g. John" [class.invalid]="isInvalid(firstName)">
                <div class="field-error" *ngIf="isInvalid(firstName)">First name is required (min 2 characters)</div>
              </div>
              <div class="form-group">
                <label>Last Name <span class="required">*</span></label>
                <input type="text" class="form-control" [(ngModel)]="user.lastName" name="lastName" #lastName="ngModel" required minlength="2" placeholder="e.g. Doe" [class.invalid]="isInvalid(lastName)">
                <div class="field-error" *ngIf="isInvalid(lastName)">Last name is required (min 2 characters)</div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Email <span class="required">*</span></label>
                <input type="email" class="form-control" [(ngModel)]="user.email" name="email" #email="ngModel" required email placeholder="e.g. john.doe@clinic.com" [class.invalid]="isInvalid(email)">
                <div class="field-error" *ngIf="isInvalid(email)">Valid email is required</div>
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input type="tel" class="form-control" [(ngModel)]="user.phone" name="phone" placeholder="e.g. +1 234 567 890">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group" *ngIf="!isEdit">
                <label>Password <span class="muted">(optional — default: ChangeMe&#64;123)</span></label>
                <input type="password" class="form-control" [(ngModel)]="user.password" name="password" placeholder="Leave blank for default" autocomplete="new-password">
              </div>
              <div class="form-group" [class.half]="isEdit">
                <label>Status</label>
                <select class="form-control" [(ngModel)]="user.isActive" name="isActive">
                  <option [ngValue]="true">Active</option>
                  <option [ngValue]="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Doctor-specific -->
          <div class="section" *ngIf="user.userType === 'Doctor'">
            <h3 class="section-title">Doctor Details</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Specialization <span class="required">*</span></label>
                <input type="text" class="form-control" [(ngModel)]="user.specialization" name="specialization" #specialization="ngModel" required placeholder="e.g. Cardiology" [class.invalid]="isInvalid(specialization)">
                <div class="field-error" *ngIf="isInvalid(specialization)">Specialization is required for doctors</div>
              </div>
              <div class="form-group">
                <label>License Number</label>
                <input type="text" class="form-control" [(ngModel)]="user.licenseNumber" name="licenseNumber" placeholder="e.g. MD12345">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Qualifications</label>
                <input type="text" class="form-control" [(ngModel)]="user.qualifications" name="qualifications" placeholder="e.g. MBBS, MD">
              </div>
              <div class="form-group">
                <label>Department</label>
                <select class="form-control" [(ngModel)]="user.departmentId" name="departmentId">
                  <option value="">Select department</option>
                  <option *ngFor="let d of departments" [ngValue]="d.id">{{ d.name }}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Bio</label>
              <textarea class="form-control" [(ngModel)]="user.bio" name="bio" rows="2" placeholder="Brief professional summary..."></textarea>
            </div>

            <h3 class="section-title sub">Schedule &amp; Fee</h3>
            <div class="form-row four">
              <div class="form-group">
                <label>Start Time</label>
                <input type="time" class="form-control" [(ngModel)]="user.consultationStartTime" name="consultationStartTime">
              </div>
              <div class="form-group">
                <label>End Time</label>
                <input type="time" class="form-control" [(ngModel)]="user.consultationEndTime" name="consultationEndTime">
              </div>
              <div class="form-group">
                <label>Slot (min)</label>
                <input type="number" class="form-control" min="10" max="180" [(ngModel)]="user.slotDuration" name="slotDuration">
              </div>
              <div class="form-group">
                <label>Consultation Fee</label>
                <input type="number" class="form-control" min="0" [(ngModel)]="user.consultationFee" name="consultationFee">
              </div>
            </div>
            <div class="form-group">
              <label>Working Days</label>
              <div class="days-grid">
                <label *ngFor="let day of weekDays" class="day-chip" [class.active]="isDaySelected(day)">
                  <input type="checkbox" [checked]="isDaySelected(day)" (change)="toggleDay(day)">
                  {{ day }}
                </label>
              </div>
            </div>
          </div>

          <!-- Locations -->
          <div class="section">
            <h3 class="section-title">Locations</h3>
            <p class="section-hint">Assign the locations this user can access. At least one is required.</p>
            <div class="checkbox-group" *ngIf="locations.length">
              <label *ngFor="let loc of locations" class="checkbox-label" [class.suggested]="isBranchSelected(loc.id)">
                <input type="checkbox" [checked]="isBranchSelected(loc.id)" (change)="toggleBranch(loc.id)">
                {{ loc.name }}
                <span class="muted" *ngIf="loc.isMainBranch"> · Main</span>
              </label>
            </div>
            <div class="muted" *ngIf="!locations.length">No locations available.</div>
            <div class="field-error" *ngIf="showErrors && !user.branchIds?.length">Select at least one location</div>
          </div>

          <!-- Non-doctor professional details -->
          <div class="section" *ngIf="user.userType && user.userType !== 'Doctor'">
            <h3 class="section-title">Professional Details</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Designation</label>
                <input type="text" class="form-control" [(ngModel)]="user.designation" name="designation" placeholder="e.g. Senior Nurse">
              </div>
              <div class="form-group">
                <label>Employee ID</label>
                <input type="text" class="form-control" [(ngModel)]="user.employeeId" name="employeeId" placeholder="e.g. EMP-001">
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="saving">
              {{ saving ? 'Saving...' : (isEdit ? 'Update User' : 'Create User') }}
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .page-card { background: var(--bg-card, #fff); border: 1px solid var(--border-color, rgba(0, 0, 0, 0.06)); border-radius: 12px; padding: 1.5rem; box-shadow: var(--shadow-md, 0 8px 24px rgba(15, 23, 42, 0.04)); }
    .page-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .page-header h2 { margin: 0; color: var(--text-primary, #1f2937); }
    .page-header p { margin: 0.4rem 0 0; color: var(--text-muted, #6b7280); }
    .form-container { background: var(--bg-card, white); padding: 8px 0; }
    .section { margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color, #f1f5f9); }
    .section:last-of-type { border-bottom: none; }
    .section-title { margin: 0 0 14px; font-size: 15px; font-weight: 600; color: var(--text-primary, #1f2937); }
    .section-title.sub { margin-top: 20px; }
    .section-hint { margin: -6px 0 12px; font-size: 13px; color: var(--text-muted, #6b7280); }
    .type-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 12px; }
    .type-card { display: flex; align-items: flex-start; gap: 10px; padding: 14px; border: 2px solid var(--border-color, #e5e7eb); border-radius: 10px; cursor: pointer; transition: border-color .15s, background .15s; background: var(--bg-card, #fff); position: relative; }
    .type-card input { position: absolute; opacity: 0; pointer-events: none; }
    .type-card:hover { border-color: #93c5fd; }
    .type-card.active { border-color: #2196f3; background: #eff6ff; }
    .type-card.error { border-color: #ef4444; }
    .type-icon { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 8px; background: var(--bg-hover, #f1f5f9); color: var(--text-primary, #334155); flex-shrink: 0; }
    .type-card.active .type-icon { background: #dbeafe; color: #1d4ed8; }
    .type-icon mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .type-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .type-body strong { font-size: 13px; color: var(--text-primary, #1f2937); }
    .type-body small { font-size: 11px; color: var(--text-muted, #6b7280); line-height: 1.3; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 4px; }
    .form-row.four { grid-template-columns: repeat(4, 1fr); }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 6px; font-weight: 500; color: var(--text-primary, #333); font-size: 13px; }
    .required { color: #ef4444; font-weight: 700; margin-left: 2px; }
    .muted { color: var(--text-muted, #6b7280); font-weight: 400; font-size: 12px; }
    .form-control { width: 100%; padding: 10px; border: 1px solid var(--border-color, #d1d5db); border-radius: 8px; font-size: 14px; box-sizing: border-box; background: var(--bg-card, #fff); color: var(--text-primary, #111827); transition: border-color .15s, box-shadow .15s; }
    .form-control:focus { border-color: #2196f3; outline: none; box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1); }
    .form-control.invalid { border-color: #ef4444; }
    .form-control.invalid:focus { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }
    .field-error { color: #ef4444; font-size: 12px; margin-top: 4px; }
    textarea.form-control { resize: vertical; }
    .days-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .day-chip { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border: 1px solid var(--border-color, #d1d5db); border-radius: 999px; font-size: 13px; cursor: pointer; user-select: none; background: var(--bg-card, #fff); transition: all .15s; }
    .day-chip input { display: none; }
    .day-chip.active { background: #eff6ff; border-color: #2196f3; color: #1d4ed8; font-weight: 600; }
    .checkbox-group { display: flex; flex-wrap: wrap; gap: 12px; }
    .checkbox-label { display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 8px 14px; border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; font-size: 13px; background: var(--bg-card, #fff); }
    .checkbox-label.suggested { border-color: #86efac; background: #f0fdf4; }
    .muted { color: var(--text-muted, #6b7280); font-size: 13px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-color, #eee); }
    .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all .15s; }
    .btn-primary { background: #2196f3; color: white; }
    .btn-primary:hover { background: #1976d2; }
    .btn-primary:disabled { background: #ccc; cursor: not-allowed; }
    .btn-outline { background: var(--bg-card, white); border: 1px solid var(--border-color, #ddd); color: var(--text-primary, #333); }
    .btn-outline:hover { background: var(--bg-primary, #f5f5f5); }
    @media (max-width: 700px) {
      .form-row, .form-row.four { grid-template-columns: 1fr; }
      .type-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class UserFormComponent implements OnInit {
  isEdit = false;
  userId = '';
  saving = false;
  showErrors = false;

  userTypes: UserTypeInfo[] = [
    { value: 'Admin', label: 'Admin', icon: 'admin_panel_settings', description: 'Full organization administration', defaultRoleName: 'OrganizationAdmin' },
    { value: 'Doctor', label: 'Doctor', icon: 'medical_services', description: 'Consultations, fee & time slots', defaultRoleName: 'Doctor' },
    { value: 'PharmacyManager', label: 'Pharmacy Manager', icon: 'local_pharmacy', description: 'Manages pharmacy inventory & sales', defaultRoleName: 'Pharmacist' },
    { value: 'LabManager', label: 'Lab Manager', icon: 'biotech', description: 'Manages lab orders & results', defaultRoleName: 'LabStaff' },
    { value: 'Receptionist', label: 'Receptionist', icon: 'support_agent', description: 'Front desk, appointments & check-in', defaultRoleName: 'Receptionist' },
    { value: 'Nurse', label: 'Nurse', icon: 'health_and_safety', description: 'Patient care & vitals', defaultRoleName: 'Nurse' }
  ];

  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  user: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    isActive: true,
    roleIds: [],
    branchIds: [] as string[],
    userType: '',
    designation: '',
    employeeId: '',
    specialization: '',
    licenseNumber: '',
    qualifications: '',
    bio: '',
    departmentId: '',
    consultationStartTime: '09:00',
    consultationEndTime: '17:00',
    slotDuration: 30,
    consultationFee: 0,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  };

  availableRoles: any[] = [];
  departments: any[] = [];
  locations: any[] = [];

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.loadDepartments();
    this.loadLocations();
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.userId = id;
      this.loadUser();
    }
  }

  get selectedTypeInfo(): UserTypeInfo | undefined {
    return this.userTypes.find(t => t.value === this.user.userType);
  }

  loadDepartments() {
    this.api.get<any[]>('v1/departments').subscribe({
      next: (res: any) => {
        this.departments = Array.isArray(res) ? res : (Array.isArray(res?.items) ? res.items : []);
      },
      error: () => { this.departments = []; }
    });
  }

  loadLocations() {
    // all=true: the assignment list must contain every location in the org,
    // not just the ones this account happens to be linked to.
    this.api.get<any[]>('v1/branches', { all: true }).subscribe({
      next: (res) => {
        const body: any = res;
        this.locations = Array.isArray(body) ? body : (Array.isArray(body?.items) ? body.items : []);
      },
      error: () => {
        this.locations = [];
        this.notification.error('Failed to load locations');
      }
    });
  }

  isBranchSelected(branchId: string): boolean {
    return (this.user.branchIds || []).includes(branchId);
  }

  toggleBranch(branchId: string) {
    const ids = this.user.branchIds || [];
    const idx = ids.indexOf(branchId);
    if (idx >= 0) ids.splice(idx, 1);
    else ids.push(branchId);
    this.user.branchIds = [...ids];
  }

  onUserTypeChange(type: UserTypeInfo) {
    if (type.value === 'Doctor' && !this.user.workingDays?.length) {
      this.user.workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    }
  }

  isDaySelected(day: string): boolean {
    return (this.user.workingDays || []).includes(day);
  }

  toggleDay(day: string) {
    const days = this.user.workingDays || [];
    const idx = days.indexOf(day);
    if (idx >= 0) days.splice(idx, 1);
    else days.push(day);
    this.user.workingDays = [...days];
  }

  isInvalid(ctrl: any): boolean {
    return this.showErrors && ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched || this.showErrors);
  }

  private normalizeRoleIds(res: any): string[] {
    const direct = Array.isArray(res?.roleIds) ? res.roleIds : [];
    const nested = Array.isArray(res?.roles) ? res.roles : [];
    const all = direct.length ? direct : nested;

    return all.map((role: any) => String(typeof role === 'string' ? role : (role?.id ?? role?.roleId ?? role?.name ?? '')).toLowerCase())
      .filter(Boolean);
  }

  private looksLikeAdmin(res: any): boolean {
    const roleIds = Array.isArray(res?.roleIds) ? res.roleIds : [];
    const roles = Array.isArray(res?.roles) ? res.roles : [];
    const names = [...roleIds, ...roles].map((r: any) =>
      String(typeof r === 'string' ? r : (r?.name || r?.roleName || r?.normalizedName || '')).toLowerCase()
    );
    return names.some(n => n.includes('organizationadmin') || n.includes('organizationowner') || n === 'admin');
  }

  loadUser() {
    this.api.get<any>(`v1/users/${this.userId}`).subscribe({
      next: (res: any) => {
        const schedule = Array.isArray(res.schedule) && res.schedule.length ? res.schedule[0] : null;
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const workingDays = Array.isArray(res.schedule) && res.schedule.length
          ? res.schedule.map((s: any) => dayNames[s.dayOfWeek]).filter(Boolean)
          : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        this.user = {
          firstName: res.firstName || '',
          lastName: res.lastName || '',
          email: res.email || '',
          phone: res.phoneNumber || res.phone || '',
          isActive: res.isActive ?? true,
          roleIds: this.normalizeRoleIds(res),
          branchIds: Array.isArray(res.branchIds) ? res.branchIds.map((b: any) => String(b)) : [],
          userType: res.userType || (res.specialization ? 'Doctor' : (this.looksLikeAdmin(res) ? 'Admin' : '')),
          designation: res.designation || '',
          employeeId: res.employeeId || '',
          specialization: res.specialization || '',
          licenseNumber: res.licenseNumber || '',
          qualifications: res.qualification || res.qualifications || '',
          bio: res.bio || '',
          departmentId: res.departmentId || '',
          consultationStartTime: schedule?.startTime || '09:00',
          consultationEndTime: schedule?.endTime || '17:00',
          slotDuration: schedule?.slotDuration || 30,
          consultationFee: schedule?.consultationFee ?? 0,
          workingDays
        };
      },
      error: (err) => {
        console.error('Failed to load user', err);
        this.notification.error('Failed to load user');
      }
    });
  }

  save() {
    this.showErrors = true;

    if (!this.user.firstName || !this.user.lastName || !this.user.email) {
      this.notification.error('Please fill in required fields');
      return;
    }
    if (!this.user.userType) {
      this.notification.error('Please select a user type');
      return;
    }
    if (this.user.userType === 'Doctor' && !this.user.specialization) {
      this.notification.error('Specialization is required for doctors');
      return;
    }
    if (!this.user.branchIds?.length) {
      this.notification.error('Select at least one location');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.user.email)) {
      this.notification.error('Please enter a valid email address');
      return;
    }

    this.saving = true;
    const payload: any = {
      email: this.user.email,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      phone: this.user.phone,
      isActive: this.user.isActive,
      roleIds: this.user.roleIds || [],
      branchIds: this.user.branchIds || [],
      userType: this.user.userType,
      designation: this.user.designation || null,
      employeeId: this.user.employeeId || null
    };

    if (!this.isEdit) {
      payload.password = this.user.password || undefined;
    }

    if (this.user.userType === 'Doctor') {
      payload.specialization = this.user.specialization;
      payload.licenseNumber = this.user.licenseNumber || null;
      payload.qualifications = this.user.qualifications || null;
      payload.bio = this.user.bio || null;
      payload.departmentId = this.user.departmentId || null;
      payload.consultationStartTime = this.user.consultationStartTime;
      payload.consultationEndTime = this.user.consultationEndTime;
      payload.slotDuration = Number(this.user.slotDuration) || 30;
      payload.consultationFee = Number(this.user.consultationFee) || 0;
      payload.workingDays = this.user.workingDays || [];
    }

    const request = this.isEdit
      ? this.api.put<any>('v1/users', this.userId, payload)
      : this.api.post<any>('v1/users', payload);

    request.subscribe({
      next: () => {
        this.notification.success(this.isEdit ? 'User updated' : 'User created');
        this.router.navigate(['/settings/users']);
      },
      error: (err) => {
        this.saving = false;
        this.notification.error('Failed to save user: ' + (err.message || 'Unknown error'));
      }
    });
  }

  goBack() {
    this.router.navigate(['/settings/users']);
  }
}
