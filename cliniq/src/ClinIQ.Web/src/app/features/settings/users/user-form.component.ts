import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PermissionService } from '../../../core/services/permission.service';

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
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  isEdit = false;
  userId = '';
  saving = false;
  showErrors = false;
  loadingUser = false;
  showPassword = false;
  isOwner = false;
  rolesTouched = false;
  rolesAvailable = true;

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
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    hasAllLocations: false
  };

  availableRoles: any[] = [];
  departments: any[] = [];
  locations: any[] = [];

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService,
    private permissions: PermissionService
  ) {}

  /** UX only — the API refuses the grant for anyone without All Locations. */
  get canGrantAllLocations(): boolean {
    const ctx = this.permissions.current();
    return !!(ctx?.hasAllLocationAccess || ctx?.isSuperAdmin || ctx?.isOwner);
  }

  get fullName(): string {
    return `${this.user.firstName || ''} ${this.user.lastName || ''}`.trim();
  }

  get initials(): string {
    const f = (this.user.firstName || '')[0] || '';
    const l = (this.user.lastName || '')[0] || '';
    return (f + l).toUpperCase() || '?';
  }

  get selectedLocations(): any[] {
    return this.locations.filter(l => this.isBranchSelected(l.id));
  }

  /** Items still missing before the form can be saved (drives the checklist). */
  get missing(): string[] {
    const m: string[] = [];
    if (!this.user.userType) m.push('User type');
    if (!this.user.firstName || this.user.firstName.length < 2) m.push('First name');
    if (!this.user.lastName || this.user.lastName.length < 2) m.push('Last name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email || '')) m.push('Valid email');
    if (this.user.userType === 'Doctor' && !this.user.specialization) m.push('Specialization');
    if (!this.user.hasAllLocations && !this.user.branchIds?.length) m.push('At least one location');
    return m;
  }

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

  generatePassword() {
    const sets = ['ABCDEFGHJKLMNPQRSTUVWXYZ', 'abcdefghijkmnopqrstuvwxyz', '23456789', '@#$%&*!?'];
    const bytes = new Uint32Array(14);
    crypto.getRandomValues(bytes);
    const chars = Array.from(bytes, (b, i) => { const set = sets[i % sets.length]; return set[b % set.length]; });
    for (let i = chars.length - 1; i > 0; i--) { const j = bytes[i] % (i + 1); [chars[i], chars[j]] = [chars[j], chars[i]]; }
    this.user.password = chars.join('');
    this.showPassword = true;
  }

  copyPassword() {
    if (!this.user.password) return;
    navigator.clipboard?.writeText(this.user.password).then(() => this.notification.info('Password copied'));
  }

  get passwordStrength(): { score: number; label: string } {
    const p: string = this.user.password || '';
    if (!p) return { score: 0, label: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
    return { score, label: labels[score] };
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
    this.user.userType = type.value;
    if (type.value === 'Doctor' && !this.user.workingDays?.length) {
      this.user.workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    }
    // Organization admins see every location unless the creator narrows it.
    if (!this.isEdit && this.canGrantAllLocations) {
      this.user.hasAllLocations = type.value === 'Admin';
    }
  }

  selectAllLocations(on: boolean) {
    this.user.branchIds = on ? this.locations.map(l => l.id) : [];
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
    this.loadingUser = true;
    this.api.get<any>(`v1/users/${this.userId}`).subscribe({
      next: (res: any) => {
        this.loadingUser = false;
        this.isOwner = !!res.isOwner;
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
          workingDays,
          hasAllLocations: !!res.hasAllLocations
        };
      },
      error: (err) => {
        this.loadingUser = false;
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
    if (!this.user.hasAllLocations && !this.user.branchIds?.length) {
      this.notification.error('Select at least one location, or give access to all locations');
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
      branchIds: this.user.branchIds || [],
      userType: this.user.userType,
      designation: this.user.designation || null,
      employeeId: this.user.employeeId || null
    };

    // Only send the All Locations flag when the caller could actually grant it.
    if (this.canGrantAllLocations && !this.isOwner) {
      payload.hasAllLocations = !!this.user.hasAllLocations;
    }
    // Without the roles list the API applies the type's default role.
    if (!this.rolesAvailable) {
      delete payload.roleIds;
    }

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
        this.notification.error(err?.message || 'Failed to save user');
      }
    });
  }

  goBack() {
    this.router.navigate(['/settings/users']);
  }
}
