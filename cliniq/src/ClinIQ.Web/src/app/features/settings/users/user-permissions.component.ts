import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { environment } from '../../../../environments/environment';

interface PermissionItem {
  name: string;
  displayName: string;
  granted: boolean;
  source?: string;
}

interface PermissionModule {
  module: string;
  category: string;
  permissions: PermissionItem[];
}

@Component({
  standalone: false,
  selector: 'app-user-permissions',
  template: `
    <app-main-layout>
      <app-page-header
        title="User Permissions"
        [breadcrumbs]="[
          { label: 'Dashboard', route: '/dashboard' },
          { label: 'Settings', route: '/settings' },
          { label: 'Users', route: '/settings/users' },
          { label: 'Permissions' }
        ]"></app-page-header>

      <div class="page-card">
        <div class="page-header">
          <div>
            <h2>Permissions — {{ userName }}</h2>
            <p>Grant the permissions this organization has enabled on the platform.</p>
          </div>
          <button class="btn btn-outline" type="button" (click)="goBack()">Back to Users</button>
        </div>

        <div class="permissions-state" *ngIf="loading">Loading available permissions...</div>
        <div class="permissions-state error" *ngIf="error">{{ error }}</div>

        <ng-container *ngIf="!loading && !error">
          <div class="full-access-card">
            <div>
              <strong>Grant Full Access?</strong>
              <span>Enable every available permission for this user.</span>
            </div>
            <label class="switch">
              <input type="checkbox" [checked]="hasFullAccess()" (change)="toggleFullAccess()">
              <span class="slider"></span>
            </label>
          </div>

          <div class="permissions-grid">
            <section *ngFor="let group of tallGroups" class="perm-group tall">
              <header class="perm-header">
                <div class="perm-header-text">
                  <h4>{{ group.module }}</h4>
                  <small>{{ group.category }} · {{ group.permissions.length }}</small>
                </div>
                <label class="switch small-switch">
                  <input type="checkbox" [checked]="isGroupSelected(group)" (change)="toggleGroup(group)">
                  <span class="slider"></span>
                </label>
              </header>
              <div
                *ngFor="let p of group.permissions"
                class="permission-row"
                (click)="togglePerm(p.name)">
                <span>
                  {{ p.displayName }}
                  <small>{{ p.name }}</small>
                </span>
                <label class="switch small-switch" (click)="$event.stopPropagation()">
                  <input type="checkbox" [checked]="isPermSelected(p.name)" (change)="togglePerm(p.name)">
                  <span class="slider"></span>
                </label>
              </div>
            </section>
          </div>

          <div class="permissions-grid compact" *ngIf="shortGroups.length">
            <section *ngFor="let group of shortGroups" class="perm-group short">
              <header class="perm-header">
                <div class="perm-header-text">
                  <h4>{{ group.module }}</h4>
                  <small>{{ group.category }} · {{ group.permissions.length }}</small>
                </div>
                <label class="switch small-switch">
                  <input type="checkbox" [checked]="isGroupSelected(group)" (change)="toggleGroup(group)">
                  <span class="slider"></span>
                </label>
              </header>
              <div
                *ngFor="let p of group.permissions"
                class="permission-row"
                (click)="togglePerm(p.name)">
                <span>
                  {{ p.displayName }}
                  <small>{{ p.name }}</small>
                </span>
                <label class="switch small-switch" (click)="$event.stopPropagation()">
                  <input type="checkbox" [checked]="isPermSelected(p.name)" (change)="togglePerm(p.name)">
                  <span class="slider"></span>
                </label>
              </div>
            </section>
          </div>

          <div class="empty-perms" *ngIf="!permissionGroups.length">
            No permissions are available for this organization.
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
            <button type="button" class="btn btn-primary" [disabled]="saving" (click)="save()">
              {{ saving ? 'Saving...' : 'Save Permissions' }}
            </button>
          </div>
        </ng-container>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .page-card { background: var(--bg-card, #fff); border: 1px solid var(--border-color, rgba(0, 0, 0, 0.06)); border-radius: 12px; padding: 1.5rem; box-shadow: var(--shadow-md, 0 8px 24px rgba(15, 23, 42, 0.04)); }
    .page-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .page-header h2 { margin: 0; color: #1f2937; }
    .page-header p { margin: 0.4rem 0 0; color: #6b7280; }
    .permissions-state { padding: 12px; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 12px; }
    .permissions-state.error { color: #b91c1c; background: #fef2f2; border-color: #fecaca; }
    .full-access-card { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1rem 1.25rem; margin-bottom: 1rem; color: #fff; background: #374151; border-radius: 6px; }
    .full-access-card div { display: flex; flex-direction: column; gap: 4px; }
    .full-access-card strong { font-size: 14px; }
    .full-access-card span { font-size: 12px; color: #d1d5db; }
    .permissions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; align-items: start; margin-bottom: 1rem; }
    .permissions-grid.compact { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; }
    .perm-group { overflow: hidden; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; }
    .perm-group.tall { border-color: #cbd5e1; }
    .perm-group.short { border-color: #e2e8f0; }
    .perm-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0.75rem 1rem; background: #1e293b; }
    .perm-header-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .perm-group h4 { margin: 0; font-size: 14px; font-weight: 600; color: #fff; }
    .perm-header small { color: #94a3b8; font-size: 11px; }
    .permission-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.6rem 1rem; border-bottom: 1px solid #f1f5f9; cursor: pointer; font-size: 13px; transition: background 0.15s; }
    .permission-row:last-child { border-bottom: 0; }
    .permission-row:hover { background: #f8fafc; }
    .permission-row span { display: flex; flex-direction: column; gap: 1px; color: #1e293b; }
    .permission-row small { color: #64748b; font-size: 10px; font-family: monospace; }
    .switch { position: relative; display: inline-block; flex: 0 0 auto; width: 43px; height: 24px; }
    .small-switch { width: 40px; height: 22px; }
    .switch input { width: 0; height: 0; opacity: 0; }
    .slider { position: absolute; inset: 0; cursor: pointer; background: #cbd5e1; border-radius: 999px; transition: .2s; }
    .slider::before { content: ''; position: absolute; width: 18px; height: 18px; left: 2px; top: 2px; background: #fff; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,.25); transition: .2s; }
    .switch input:checked + .slider { background: #22c55e; }
    .switch input:checked + .slider::before { transform: translateX(20px); }
    .small-switch .slider::before { width: 16px; height: 16px; }
    .small-switch input:checked + .slider::before { transform: translateX(18px); }
    .empty-perms { padding: 1.5rem; text-align: center; color: #6b7280; background: #f8fafc; border: 1px dashed #e2e8f0; border-radius: 8px; margin-bottom: 1rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; }
    .btn-primary { background: #2563eb; color: white; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }
    .btn-outline { background: #fff; border: 1px solid #d1d5db; color: #374151; }
    .btn-outline:hover { background: #f9fafb; }
    @media (max-width: 800px) { .permissions-grid, .permissions-grid.compact { grid-template-columns: 1fr; } }
  `]
})
export class UserPermissionsComponent implements OnInit {
  userId = '';
  userName = '';
  permissionGroups: PermissionModule[] = [];
  tallGroups: PermissionModule[] = [];
  shortGroups: PermissionModule[] = [];
  selectedPermissions: string[] = [];
  loading = true;
  saving = false;
  error = '';

  constructor(
    private api: ApiService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.userId) {
      this.error = 'User not found.';
      this.loading = false;
      return;
    }
    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';
    this.selectedPermissions = [];
    this.permissionGroups = [];
    this.tallGroups = [];
    this.shortGroups = [];
    this.userName = '';

    this.api.get<any>(`v1/users/${this.userId}`).subscribe({
      next: (user) => {
        this.userName =
          user?.fullName ||
          ((user?.firstName || '') + ' ' + (user?.lastName || '')).trim() ||
          user?.email ||
          'User';
      },
      error: () => {
        this.userName = 'User';
      }
    });

    this.http.get<{ userId?: string; modules?: PermissionModule[] }>(
      `${environment.apiUrl}/v1/users/${this.userId}/permissions`
    ).subscribe({
      next: (current) => {
        const groups = current?.modules || [];
        this.permissionGroups = groups
          .filter(g => Array.isArray(g.permissions) && g.permissions.length > 0)
          .sort((a, b) => b.permissions.length - a.permissions.length || a.module.localeCompare(b.module));

        const threshold = this.medianCount(this.permissionGroups);
        this.tallGroups = this.permissionGroups.filter(g => g.permissions.length >= threshold);
        this.shortGroups = this.permissionGroups.filter(g => g.permissions.length < threshold);

        this.selectedPermissions = this.permissionGroups
          .flatMap(g => g.permissions)
          .filter(p => p.granted || p.source === 'user-grant')
          .map(p => p.name);

        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Unable to load permissions.';
      }
    });
  }

  private medianCount(groups: PermissionModule[]): number {
    if (!groups.length) return 0;
    const counts = groups.map(g => g.permissions.length).sort((a, b) => a - b);
    const mid = Math.floor(counts.length / 2);
    const median = counts.length % 2 ? counts[mid] : Math.round((counts[mid - 1] + counts[mid]) / 2);
    return Math.max(median, 3);
  }

  allKeys(): string[] {
    return this.permissionGroups.flatMap(g => g.permissions.map(p => p.name));
  }

  isPermSelected(key: string): boolean {
    return this.selectedPermissions.includes(key);
  }

  hasFullAccess(): boolean {
    const keys = this.allKeys();
    return keys.length > 0 && keys.every(key => this.selectedPermissions.includes(key));
  }

  toggleFullAccess(): void {
    this.selectedPermissions = this.hasFullAccess() ? [] : [...this.allKeys()];
  }

  isGroupSelected(group: PermissionModule): boolean {
    return group.permissions.length > 0 && group.permissions.every(p => this.selectedPermissions.includes(p.name));
  }

  toggleGroup(group: PermissionModule): void {
    const keys = group.permissions.map(p => p.name);
    if (this.isGroupSelected(group)) {
      this.selectedPermissions = this.selectedPermissions.filter(key => !keys.includes(key));
    } else {
      this.selectedPermissions = [...new Set([...this.selectedPermissions, ...keys])];
    }
  }

  togglePerm(key: string): void {
    const idx = this.selectedPermissions.indexOf(key);
    if (idx >= 0) {
      this.selectedPermissions.splice(idx, 1);
    } else {
      this.selectedPermissions.push(key);
    }
  }

  save(): void {
    this.saving = true;
    const grants = [...new Set(this.selectedPermissions)];

    this.http.put(`${environment.apiUrl}/v1/users/${this.userId}/permissions`, {
      grants,
      denies: []
    }).subscribe({
      next: () => {
        this.notification.success('Permissions saved for ' + this.userName);
        this.saving = false;
        this.load();
      },
      error: (err: any) => {
        this.saving = false;
        this.notification.error(err?.error?.message || err?.message || 'Unable to save permissions.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/settings/users']);
  }
}
