import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styles: [`
    .tab-content { padding: 1.5rem; max-width: 900px; }
    h3 { margin: 1.5rem 0 1rem; } h3:first-child { margin-top: 0; }
    .form-row { display: flex; gap: 1rem; } .form-row mat-form-field { flex: 1; }
    .full-width { width: 100%; }
    .form-actions { margin-top: 1.5rem; }
    mat-slide-toggle { margin: 1rem 0; display: block; }

    .section-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin: 0 0 1rem; }
    .section-header h3 { margin: 0; }
    .muted { color: #6b7280; font-size: 13px; }

    .table-container { overflow-x: auto; background: #fff; border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; box-shadow: 0 8px 24px rgba(15,23,42,0.04); }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .data-table th { background: #f8fafc; font-weight: 600; color: #475569; white-space: nowrap; }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tr:hover td { background: #f9fafb; }
    .badge { padding: 4px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; margin: 2px 4px 2px 0; display: inline-block; }
    .badge-info { background: #dbeafe; color: #1d4ed8; }
    .badge-muted { background: #e5e7eb; color: #4b5563; }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .actions { white-space: nowrap; }
    .actions button { margin-right: 4px; }

    .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
    .btn-primary { background: #2196f3; color: white; }
    .btn-primary:hover { background: #1976d2; }
    .btn-primary:disabled { background: #ccc; }
    .btn-outline { background: white; border: 1px solid #ddd; color: #333; }
    .btn-outline:hover { background: #f5f5f5; }
    .btn-danger-outline { background: white; border: 1px solid #f44336; color: #f44336; }
    .btn-danger-outline:hover { background: #ffebee; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 16px; }

    .form-card { background: #fff; border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(15,23,42,0.04); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-field { margin-bottom: 12px; }
    .form-field label { display: block; margin-bottom: 6px; font-weight: 500; color: #374151; font-size: 13px; }
    .form-control { width: 100%; padding: 9px 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
    .form-control:focus { border-color: #2196f3; outline: none; }
    .form-actions-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }

    .checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .perm-group { background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e5e7eb; }
    .perm-group h5 { margin: 0 0 10px; font-size: 13px; color: #6b7280; }
    .checkbox-label { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; cursor: pointer; font-size: 13px; }
    .empty-state { padding: 2rem; text-align: center; color: #6b7280; }
    .back-link { cursor: pointer; color: #2196f3; }

    .logo-upload-section { margin-bottom: 1.5rem; padding: 1rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e5e7eb; }
    .logo-upload-section h4 { margin: 0 0 0.5rem; font-size: 14px; color: #374151; }
    .logo-preview-container { margin-bottom: 1rem; }
    .logo-preview { position: relative; display: inline-block; }
    .logo-preview-img { max-width: 200px; max-height: 100px; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px; background: white; }
    .remove-logo-btn { position: absolute; top: -8px; right: -8px; }
    .logo-placeholder { display: flex; align-items: center; gap: 8px; padding: 1rem; border: 2px dashed #d1d5db; border-radius: 8px; color: #6b7280; }
    .logo-placeholder mat-icon { font-size: 32px; width: 32px; height: 32px; }
    .logo-upload-actions { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
  `]
})
export class SettingsComponent implements OnInit {
  generalForm!: FormGroup;
  brandingForm!: FormGroup;
  appointmentSettings = { slotDuration: 30, advanceBookingDays: 30, allowOnlineBooking: true };
  billingSettings = { invoicePrefix: 'INV-', defaultTax: 0, paymentDueDays: 30 };
  logoUploading = false;

  // ---- Users ----
  users: any[] = [];
  userSearch = '';
  userPage = 1;
  userTotalPages = 1;
  showUserForm = false;
  editingUser: any = null;
  userFormData: any = {};
  availableRoles: any[] = [];

  // ---- Roles ----
  roles: any[] = [];
  showRoleForm = false;
  editingRole: any = null;
  roleFormData: any = {};
  permissionGroups: any[] = [];

  constructor(private fb: FormBuilder, private api: ApiService, private notification: NotificationService) {}

  ngOnInit() {
    this.generalForm = this.fb.group({ organizationName: [''], phone: [''], email: [''], address: [''], currency: ['USD'], dateFormat: ['MM/dd/yyyy'] });
    this.api.get<any>('v1/settings/general').subscribe(r => this.generalForm.patchValue(r));

    this.brandingForm = this.fb.group({ name: [''], logoUrl: [''], phone: [''], email: [''], website: [''], address: [''], city: [''], state: [''], postalCode: [''], country: [''] });
    this.api.get<any>('v1/tenants/current').subscribe(r => this.brandingForm.patchValue({
      name: r?.name, logoUrl: r?.logoUrl, phone: r?.phone, email: r?.email,
      website: r?.website, address: r?.address, city: r?.city, state: r?.state,
      postalCode: r?.postalCode, country: r?.country
    }));

    this.loadPermissionGroups();
    this.loadRoles();
    this.loadUsers();
  }

  saveGeneral() { this.api.put('v1/settings', 'general', this.generalForm.value).subscribe(() => this.notification.success('Settings saved')); }

  saveBranding() {
    const value = this.brandingForm.value;
    Object.keys(value).forEach(k => { if (value[k] === '') value[k] = null; });
    this.api.put('v1/tenants', 'current', value).subscribe(() => this.notification.success('Branding saved'));
  }

  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.logoUploading = true;
    this.api.upload<any>('v1/tenants/current/logo', formData).subscribe({
      next: (res) => {
        const logoUrl = res?.logoUrl || res?.data?.logoUrl;
        if (logoUrl) {
          this.brandingForm.patchValue({ logoUrl });
        }
        this.notification.success('Logo uploaded successfully');
        this.logoUploading = false;
      },
      error: (err) => {
        this.notification.error(this.extractError(err));
        this.logoUploading = false;
      }
    });

    input.value = '';
  }

  removeLogo() {
    this.brandingForm.patchValue({ logoUrl: '' });
  }

  // ------------------------- USERS -------------------------
  loadUsers() {
    this.api.get<any>('v1/users', { pageNumber: this.userPage, searchTerm: this.userSearch }).subscribe({
      next: (res) => {
        this.users = res.items || [];
        this.userTotalPages = res.totalPages || 1;
      },
      error: (err) => this.notification.error(this.extractError(err))
    });
  }

  onUserSearch() { this.userPage = 1; this.loadUsers(); }

  userRoles(user: any): string[] {
    if (Array.isArray(user?.roles)) return user.roles.map((r: any) => typeof r === 'string' ? r : (r?.name || ''));
    return [];
  }

  addUser() {
    this.editingUser = null;
    this.userFormData = { firstName: '', lastName: '', email: '', phone: '', password: '', isActive: true, roleIds: [] };
    this.showUserForm = true;
  }

  editUser(user: any) {
    this.editingUser = user;
    this.userFormData = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phoneNumber || user.phone || '',
      isActive: user.isActive ?? true,
      roleIds: []
    };
    this.showUserForm = true;
    this.api.get<any>(`v1/users/${user.id}`).subscribe({
      next: (u) => {
        this.userFormData.firstName = u.firstName || u.firstName;
        this.userFormData.lastName = u.lastName || u.lastName;
        this.userFormData.email = u.email || this.userFormData.email;
        this.userFormData.phone = u.phoneNumber || this.userFormData.phone;
        this.userFormData.isActive = u.isActive ?? this.userFormData.isActive;
        this.userFormData.roleIds = Array.isArray(u.roleIds) ? [...u.roleIds] : [];
      },
      error: () => {}
    });
  }

  toggleUserRole(roleId: string) {
    const idx = this.userFormData.roleIds.indexOf(roleId);
    if (idx >= 0) this.userFormData.roleIds.splice(idx, 1);
    else this.userFormData.roleIds.push(roleId);
  }

  isUserRoleSelected(roleId: string): boolean {
    return this.userFormData.roleIds.includes(roleId);
  }

  saveUser() {
    const d = this.userFormData;
    if (!d.firstName || !d.lastName || !d.email) { this.notification.error('First name, last name and email are required.'); return; }
    if (this.editingUser) {
      this.api.put<any>('v1/users', this.editingUser.id, { email: d.email, firstName: d.firstName, lastName: d.lastName, phone: d.phone || null, isActive: d.isActive, roleIds: d.roleIds }).subscribe({
        next: () => { this.notification.success('User updated'); this.showUserForm = false; this.loadUsers(); },
        error: (err) => this.notification.error(this.extractError(err))
      });
    } else {
      this.api.post<any>('v1/users', { email: d.email, password: d.password || 'ChangeMe@123', firstName: d.firstName, lastName: d.lastName, phone: d.phone || null, roleIds: d.roleIds }).subscribe({
        next: () => { this.notification.success('User created'); this.showUserForm = false; this.loadUsers(); },
        error: (err) => this.notification.error(this.extractError(err))
      });
    }
  }

  deleteUser(user: any) {
    if (!confirm(`Delete user ${user.email}?`)) return;
    this.api.delete<any>('v1/users', user.id).subscribe({
      next: () => { this.notification.success('User deleted'); this.loadUsers(); },
      error: (err) => this.notification.error(this.extractError(err))
    });
  }

  resetPassword(user: any) {
    if (!confirm(`Reset password for ${user.email} to ChangeMe@123?`)) return;
    this.api.post<any>(`v1/users/${user.id}/reset-password`, {}).subscribe({
      next: () => this.notification.success('Password reset to ChangeMe@123'),
      error: (err) => this.notification.error(this.extractError(err))
    });
  }

  userPageNav(delta: number) { this.userPage += delta; this.loadUsers(); }

  // ------------------------- ROLES -------------------------
  loadPermissionGroups() {
    this.api.get<any[]>('v1/roles/permissions').subscribe({
      next: (groups) => this.permissionGroups = groups || [],
      error: (err) => this.notification.error(this.extractError(err))
    });
  }

  loadRoles() {
    this.api.get<any[]>('v1/roles').subscribe({
      next: (res) => { this.roles = Array.isArray(res) ? res.filter(role => !role.isSystemRole) : []; },
      error: (err) => this.notification.error(this.extractError(err))
    });
  }

  addRole() {
    this.editingRole = null;
    this.roleFormData = { name: '', description: '', selectedPermissions: [] };
    this.showRoleForm = true;
  }

  editRole(role: any) {
    this.editingRole = role;
    this.roleFormData = {
      name: role.name || '',
      description: role.description || '',
      selectedPermissions: Array.isArray(role.permissionNames) ? [...role.permissionNames] : []
    };
    this.showRoleForm = true;
  }

  togglePermission(key: string) {
    const p = this.roleFormData.selectedPermissions;
    const idx = p.indexOf(key);
    if (idx >= 0) p.splice(idx, 1); else p.push(key);
  }

  isPermissionSelected(key: string): boolean {
    return this.roleFormData.selectedPermissions.includes(key);
  }

  saveRole() {
    if (!this.roleFormData.name) { this.notification.error('Role name is required.'); return; }
    if (this.editingRole) {
      this.api.put<any>('v1/roles', this.editingRole.id, { name: this.roleFormData.name, description: this.roleFormData.description || null, permissionNames: this.roleFormData.selectedPermissions }).subscribe({
        next: () => { this.notification.success('Role updated'); this.showRoleForm = false; this.loadRoles(); },
        error: (err) => this.notification.error(this.extractError(err))
      });
    } else {
      this.api.post<any>('v1/roles', { name: this.roleFormData.name, description: this.roleFormData.description || null, permissionNames: this.roleFormData.selectedPermissions }).subscribe({
        next: () => { this.notification.success('Role created'); this.showRoleForm = false; this.loadRoles(); },
        error: (err) => this.notification.error(this.extractError(err))
      });
    }
  }

  deleteRole(role: any) {
    if (!confirm(`Delete role ${role.name}?`)) return;
    this.api.delete<any>('v1/roles', role.id).subscribe({
      next: () => { this.notification.success('Role deleted'); this.loadRoles(); },
      error: (err) => this.notification.error(this.extractError(err))
    });
  }

  cancelForm() { this.showUserForm = false; this.showRoleForm = false; }

  private extractError(err: any): string {
    return err?.message || 'Something went wrong';
  }
}
