import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-role-form',
  template: `
    <app-main-layout>
      <app-page-header [title]="isEdit ? 'Edit Role' : 'Create Role'" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Settings', route: '/settings' }, { label: 'Roles', route: '/settings/roles' }, { label: isEdit ? 'Edit' : 'New' }]"></app-page-header>

      <div class="page-card">
        <div class="page-header">
          <div>
            <h2>{{ isEdit ? 'Edit Role' : 'Create Role' }}</h2>
            <p>{{ isEdit ? 'Update the permission set for this role.' : 'Create a new permission set for your users.' }}</p>
          </div>
          <button class="btn btn-outline" (click)="goBack()">Back to Roles</button>
        </div>

        <form (ngSubmit)="save()" class="form-container">
          <div class="form-group">
            <label>Role Name *</label>
            <input type="text" class="form-control" [(ngModel)]="role.name" name="name" required placeholder="e.g. Doctor, Nurse, Admin">
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" [(ngModel)]="role.description" name="description" rows="3" placeholder="Brief description of this role"></textarea>
          </div>

          <div class="form-group">
            <label>Permissions</label>
            <div class="permissions-state" *ngIf="permissionsLoading">Loading available permissions...</div>
            <div class="permissions-state error" *ngIf="permissionsError">{{ permissionsError }}</div>
            <div class="full-access-card">
              <div>
                <strong>Grant Full Access?</strong>
                <span>Enable every available permission for this role.</span>
              </div>
              <label class="switch">
                <input type="checkbox" [checked]="hasFullAccess()" (change)="toggleFullAccess()">
                <span class="slider"></span>
              </label>
            </div>
            <div class="permissions-grid">
              <section *ngFor="let perm of permissionGroups" class="perm-group">
                <header class="perm-header">
                  <h4>{{ perm.group }}</h4>
                  <label class="switch small-switch">
                    <input type="checkbox" [checked]="isGroupSelected(perm)" (change)="toggleGroup(perm)">
                    <span class="slider"></span>
                  </label>
                </header>
                <div *ngFor="let p of perm.items" class="permission-row">
                  <span>{{ p.label }} <small>{{ p.key }}</small></span>
                  <label class="switch small-switch">
                    <input type="checkbox" [checked]="isPermSelected(p.key)" (change)="togglePerm(p.key)">
                    <span class="slider"></span>
                  </label>
                </div>
              </section>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="saving">
              {{ saving ? 'Saving...' : (isEdit ? 'Update Role' : 'Create Role') }}
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
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 6px; font-weight: 500; color: #333; }
    .form-control { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
    .form-control:focus { border-color: #2196f3; outline: none; }
    .full-access-card { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1rem 1.25rem; margin-bottom: 1rem; color: #fff; background: #374151; border-radius: 6px; }
    .full-access-card div { display: flex; flex-direction: column; gap: 4px; }
    .full-access-card span { font-size: 12px; color: #e5e7eb; }
    .permissions-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    .perm-group { overflow: hidden; background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; }
    .perm-header { display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; color: #fff; background: #374151; }
    .perm-group h4 { margin: 0; font-size: 15px; color: #fff; }
    .permission-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.65rem 1rem; border-bottom: 1px solid #f1f5f9; cursor: pointer; font-size: 13px; }
    .permission-row:last-child { border-bottom: 0; }
    .permission-row:hover { background: #f8fafc; }
    .permission-row span { display: flex; flex-direction: column; gap: 2px; color: #111827; }
    .permission-row small { color: #94a3b8; font-size: 10px; }
    .switch { position: relative; display: inline-block; flex: 0 0 auto; width: 43px; height: 24px; }
    .small-switch { width: 40px; height: 22px; }
    .switch input { width: 0; height: 0; opacity: 0; }
    .slider { position: absolute; inset: 0; cursor: pointer; background: #b7b9a0; border-radius: 999px; transition: .2s; }
    .slider::before { content: ''; position: absolute; width: 20px; height: 20px; left: 2px; top: 2px; background: #fff; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,.2); transition: .2s; }
    .switch input:checked + .slider { background: #8bc34a; }
    .switch input:checked + .slider::before { transform: translateX(19px); }
    .permissions-state { padding: 12px; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 12px; }
    .permissions-state.error { color: #b91c1c; background: #fef2f2; border-color: #fecaca; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee; }
    .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
    .btn-primary { background: #2196f3; color: white; }
    .btn-primary:hover { background: #1976d2; }
    .btn-primary:disabled { background: #ccc; }
    .btn-outline { background: white; border: 1px solid #ddd; color: #333; }
    .btn-outline:hover { background: #f5f5f5; }
    @media (max-width: 800px) { .permissions-grid { grid-template-columns: 1fr; } }
  `]
})
export class RoleFormComponent implements OnInit {
  isEdit = false;
  roleId = '';
  saving = false;
  role: any = {
    name: '',
    description: '',
    permissionNames: [] as string[]
  };
  selectedPermissions: string[] = [];

  permissionGroups: any[] = [];
  permissionsLoading = false;
  permissionsError = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadPermissionGroups();
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.roleId = id;
      this.loadRole();
    }
  }

  loadPermissionGroups() {
    this.permissionsLoading = true;
    this.permissionsError = '';
    this.api.get<any[]>('v1/roles/permissions').subscribe({
      next: (groups) => {
        this.permissionGroups = (groups || []).filter(group => Array.isArray(group.items) && group.items.length > 0);
        this.permissionsLoading = false;
      },
      error: (err) => {
        this.permissionsLoading = false;
        this.permissionsError = err?.message || 'Unable to load available permissions.';
      }
    });
  }

  loadRole() {
    this.api.get<any>(`v1/roles/${this.roleId}`).subscribe({
      next: (res: any) => {
        this.role = {
          name: res.name || '',
          description: res.description || ''
        };
        this.selectedPermissions = Array.isArray(res.permissionNames)
          ? res.permissionNames
          : Array.isArray(res.permissions)
            ? res.permissions.map((perm: any) => typeof perm === 'string' ? perm : (perm?.name || perm?.key || ''))
            : [];
      },
      error: (err) => console.error('Failed to load role', err)
    });
  }

  isPermSelected(key: string): boolean {
    return this.selectedPermissions.includes(key);
  }

  hasFullAccess(): boolean {
    const keys = this.permissionGroups.flatMap(group => group.items.map((item: any) => item.key));
    return keys.length > 0 && keys.every(key => this.selectedPermissions.includes(key));
  }

  toggleFullAccess(): void {
    const keys = this.permissionGroups.flatMap(group => group.items.map((item: any) => item.key));
    this.selectedPermissions = this.hasFullAccess()
      ? []
      : [...new Set([...this.selectedPermissions, ...keys])];
  }

  isGroupSelected(group: any): boolean {
    return group.items.length > 0 && group.items.every((item: any) => this.selectedPermissions.includes(item.key));
  }

  toggleGroup(group: any): void {
    const keys = group.items.map((item: any) => item.key);
    if (this.isGroupSelected(group)) {
      this.selectedPermissions = this.selectedPermissions.filter(key => !keys.includes(key));
    } else {
      this.selectedPermissions = [...new Set([...this.selectedPermissions, ...keys])];
    }
  }

  togglePerm(key: string) {
    const idx = this.selectedPermissions.indexOf(key);
    if (idx >= 0) {
      this.selectedPermissions.splice(idx, 1);
    } else {
      this.selectedPermissions.push(key);
    }
  }

  save() {
    if (!this.role.name) {
      alert('Please enter a role name');
      return;
    }

    this.saving = true;
    const payload = {
      ...this.role,
      permissionNames: this.selectedPermissions
    };

    const request = this.isEdit
      ? this.api.put<any>('v1/roles', this.roleId, payload)
      : this.api.post<any>('v1/roles', payload);

    request.subscribe({
      next: () => {
        this.router.navigate(['/settings/roles']);
      },
      error: (err) => {
        this.saving = false;
        alert('Failed to save role: ' + (err.message || 'Unknown error'));
      }
    });
  }

  goBack() {
    this.router.navigate(['/settings/roles']);
  }
}
