import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

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
            <p>{{ isEdit ? 'Update the selected user account.' : 'Create a new staff account and assign access roles.' }}</p>
          </div>
          <button class="btn btn-outline" (click)="goBack()">Back to Users</button>
        </div>

        <form (ngSubmit)="save()" class="form-container">
          <div class="form-row">
            <div class="form-group">
              <label>First Name *</label>
              <input type="text" class="form-control" [(ngModel)]="user.firstName" name="firstName" required>
            </div>
            <div class="form-group">
              <label>Last Name *</label>
              <input type="text" class="form-control" [(ngModel)]="user.lastName" name="lastName" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Email *</label>
              <input type="email" class="form-control" [(ngModel)]="user.email" name="email" required>
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="text" class="form-control" [(ngModel)]="user.phone" name="phone">
            </div>
          </div>

          <div class="form-row" *ngIf="!isEdit">
            <div class="form-group">
              <label>Password (default: ChangeMe&#64;123)</label>
              <input type="password" class="form-control" [(ngModel)]="user.password" name="password">
            </div>
            <div class="form-group">
              <label>Status</label>
              <select class="form-control" [(ngModel)]="user.isActive" name="isActive">
                <option [ngValue]="true">Active</option>
                <option [ngValue]="false">Inactive</option>
              </select>
            </div>
          </div>

          <div class="form-row" *ngIf="isEdit">
            <div class="form-group">
              <label>Status</label>
              <select class="form-control" [(ngModel)]="user.isActive" name="isActive">
                <option [ngValue]="true">Active</option>
                <option [ngValue]="false">Inactive</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Roles</label>
            <div class="checkbox-group">
              <label *ngFor="let role of availableRoles" class="checkbox-label">
                <input type="checkbox" [checked]="isRoleSelected(role)" (change)="toggleRole(role.id || role.roleId || role.name)">
                {{ role.name }}
              </label>
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
    .page-card { background: #fff; border: 1px solid rgba(0, 0, 0, 0.06); border-radius: 12px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04); }
    .page-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .page-header h2 { margin: 0; color: #1f2937; }
    .page-header p { margin: 0.4rem 0 0; color: #6b7280; }
    .form-container { background: white; padding: 24px; border-radius: 8px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 6px; font-weight: 500; color: #333; }
    .form-control { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
    .form-control:focus { border-color: #2196f3; outline: none; }
    .checkbox-group { display: flex; flex-wrap: wrap; gap: 16px; }
    .checkbox-label { display: flex; align-items: center; gap: 6px; cursor: pointer; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee; }
    .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
    .btn-primary { background: #2196f3; color: white; }
    .btn-primary:hover { background: #1976d2; }
    .btn-primary:disabled { background: #ccc; }
    .btn-outline { background: white; border: 1px solid #ddd; color: #333; }
    .btn-outline:hover { background: #f5f5f5; }
  `]
})
export class UserFormComponent implements OnInit {
  isEdit = false;
  userId = '';
  saving = false;
  user: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    isActive: true,
    roleIds: []
  };
  availableRoles: any[] = [];

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadRoles();
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.userId = id;
      this.loadUser();
    }
  }

  loadRoles() {
    this.api.get<any[]>('v1/roles').subscribe({
      next: (res: any) => {
        this.availableRoles = Array.isArray(res) ? res.map((role: any) => ({
          ...role,
          id: role.id ?? role.roleId ?? role.name,
          name: role.name ?? role.roleName ?? 'Role'
        })) : [];
      },
      error: (err) => console.error('Failed to load roles', err)
    });
  }

  private normalizeRoleIds(res: any): string[] {
    const direct = Array.isArray(res?.roleIds) ? res.roleIds : [];
    const nested = Array.isArray(res?.roles) ? res.roles : [];
    const all = direct.length ? direct : nested;

    return all.map((role: any) => String(typeof role === 'string' ? role : (role?.id ?? role?.roleId ?? role?.name ?? '')).toLowerCase())
      .filter(Boolean);
  }

  isRoleSelected(role: any): boolean {
    const roleId = String(role.id ?? role.roleId ?? role.name).toLowerCase();
    return (this.user.roleIds || []).some((selectedId: string) => String(selectedId).toLowerCase() === roleId);
  }

  loadUser() {
    this.api.get<any>(`v1/users/${this.userId}`).subscribe({
      next: (res: any) => {
        this.user = {
          firstName: res.firstName || '',
          lastName: res.lastName || '',
          email: res.email || '',
          phone: res.phoneNumber || res.phone || '',
          isActive: res.isActive ?? true,
          roleIds: this.normalizeRoleIds(res)
        };
      },
      error: (err) => console.error('Failed to load user', err)
    });
  }

  toggleRole(roleId: string) {
    roleId = String(roleId).toLowerCase();
    const roleIds = this.user.roleIds || [];
    const idx = roleIds.indexOf(roleId);
    if (idx >= 0) {
      roleIds.splice(idx, 1);
    } else {
      roleIds.push(roleId);
    }
  }

  save() {
    if (!this.user.firstName || !this.user.lastName || !this.user.email) {
      alert('Please fill in required fields');
      return;
    }

    this.saving = true;
    const payload = {
      ...this.user,
      roleIds: this.user.roleIds
    };

    const request = this.isEdit
      ? this.api.put<any>('v1/users', this.userId, payload)
      : this.api.post<any>('v1/users', payload);

    request.subscribe({
      next: () => {
        this.router.navigate(['/settings/users']);
      },
      error: (err) => {
        this.saving = false;
        alert('Failed to save user: ' + (err.message || 'Unknown error'));
      }
    });
  }

  goBack() {
    this.router.navigate(['/settings/users']);
  }
}
