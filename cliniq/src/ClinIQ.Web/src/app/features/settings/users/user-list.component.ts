import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PermissionService } from '../../../core/services/permission.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PasswordResetDialogComponent } from './password-reset-dialog/password-reset-dialog.component';

const USER_TYPE_LABELS: Record<string, string> = {
  Admin: 'Admin',
  Doctor: 'Doctor',
  PharmacyManager: 'Pharmacy Manager',
  LabManager: 'Lab Manager',
  Receptionist: 'Receptionist',
  Nurse: 'Nurse'
};

const USER_TYPE_ICONS: Record<string, string> = {
  Admin: 'admin_panel_settings',
  Doctor: 'medical_services',
  PharmacyManager: 'local_pharmacy',
  LabManager: 'biotech',
  Receptionist: 'support_agent',
  Nurse: 'health_and_safety'
};

@Component({
  standalone: false,
  selector: 'app-user-list',
  template: `
    <app-main-layout>
      <app-page-header title="Users" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Settings', route: '/settings' }, { label: 'Users' }]"></app-page-header>

      <div class="page-card">
        <div class="page-header">
          <div>
            <h2>Users Management</h2>
            <p>Manage accounts, user types and permission overrides.</p>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="addUser()">
              <mat-icon>person_add</mat-icon> Add User
            </button>
          </div>
        </div>

        <div class="filters">
          <div class="search-box">
            <mat-icon>search</mat-icon>
            <input type="text"
                   autocomplete="off"
                   placeholder="Search by name or email..."
                   [(ngModel)]="searchTerm"
                   (ngModelChange)="onSearchChange($event)">
          </div>

          <label class="filter-field">
            <span>User Type</span>
            <select class="filter-select" [(ngModel)]="filterType" (ngModelChange)="onFilterChange()">
              <option value="">All types</option>
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="PharmacyManager">Pharmacy Manager</option>
              <option value="LabManager">Lab Manager</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Nurse">Nurse</option>
            </select>
          </label>

          <label class="filter-field">
            <span>Status</span>
            <select class="filter-select" [(ngModel)]="filterStatus" (ngModelChange)="onFilterChange()">
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <button *ngIf="hasFilters()" class="clear-filters" type="button" (click)="clearFilters()">
            <mat-icon>close</mat-icon> Clear
          </button>

          <span class="result-count" *ngIf="users.length">{{ totalCount }} user{{ totalCount === 1 ? '' : 's' }}</span>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>User Type</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Last Login</th>
                <th class="actions-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>
                  <div class="user-cell">
                    <span class="avatar">{{ getInitials(user) }}</span>
                    <div class="user-meta">
                      <strong>{{ user.fullName || ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || 'Unknown User' }}</strong>
                      <small>{{ user.email }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="type-badge" *ngIf="displayUserType(user)">
                    <mat-icon>{{ typeIcon(displayUserType(user)) }}</mat-icon>
                    {{ typeLabel(displayUserType(user)) }}
                  </span>
                  <span class="badge badge-muted" *ngIf="!displayUserType(user)">—</span>
                </td>
                <td>{{ (user.phoneNumber || user.phone || 'N/A') | phone }}</td>
                <td>
                  <span class="badge" [class.badge-success]="user.isActive" [class.badge-danger]="!user.isActive">
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>{{ user.lastLoginAt ? (user.lastLoginAt | date:'short') : 'Never' }}</td>
                <td class="actions">
                  <button mat-icon-button color="primary" (click)="editUser(user.id)" matTooltip="Edit user">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="openPermissions(user)" matTooltip="Permissions">
                    <mat-icon>admin_panel_settings</mat-icon>
                  </button>
                  <button mat-icon-button (click)="openPasswordResetDialog(user)" matTooltip="Reset password">
                    <mat-icon>key</mat-icon>
                  </button>
                  <button mat-icon-button
                          *ngIf="canSuspend(user)"
                          [class.warn-action]="user.isActive"
                          [matTooltip]="user.isActive ? 'Suspend user' : 'Activate user'"
                          (click)="toggleSuspend(user)">
                    <mat-icon>{{ user.isActive ? 'person_off' : 'person_check' }}</mat-icon>
                  </button>
                  <button mat-icon-button
                          *ngIf="canDelete(user)"
                          class="danger-action"
                          matTooltip="Delete user"
                          (click)="deleteUser(user)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </tr>
              <tr *ngIf="!users.length && !loading">
                <td colspan="6" class="empty-state">No users found. Create a user to get started.</td>
              </tr>
              <tr *ngIf="loading">
                <td colspan="6" class="empty-state">Loading users…</td>
              </tr>
            </tbody>
          </table>
        </div>

        <mat-paginator
          *ngIf="totalCount > 0 || loading"
          [length]="totalCount"
          [pageIndex]="pageIndex"
          [pageSize]="pageSize"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .page-card { background: var(--bg-card, #fff); border: 1px solid var(--border-color, rgba(0, 0, 0, 0.06)); border-radius: 12px; padding: 1.5rem; box-shadow: var(--shadow-md, 0 8px 24px rgba(15, 23, 42, 0.04)); }
    .page-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .page-header h2 { margin: 0; color: var(--text-primary, #1f2937); }
    .page-header p { margin: 0.4rem 0 0; color: var(--text-muted, #6b7280); }
    .header-actions { display: flex; gap: 8px; align-items: center; }
    .header-actions button { display: inline-flex; align-items: center; gap: 4px; }
    .filters { display: flex; align-items: flex-end; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .search-box { display: flex; align-items: center; gap: 8px; width: 280px; max-width: 100%; padding: 0 12px; border: 1px solid var(--border-color, #d1d5db); border-radius: 8px; background: var(--bg-card, #fff); }
    .search-box mat-icon { color: var(--text-muted, #94a3b8); font-size: 18px; width: 18px; height: 18px; }
    .search-box input { flex: 1; border: none; outline: none; padding: 10px 0; font-size: 14px; background: transparent; color: var(--text-primary, #111827); }
    .filter-field { display: flex; flex-direction: column; gap: 4px; min-width: 150px; }
    .filter-field span { font-size: 11px; font-weight: 600; color: var(--text-muted, #6b7280); text-transform: uppercase; letter-spacing: 0.04em; }
    .filter-select { padding: 9px 10px; border: 1px solid var(--border-color, #d1d5db); border-radius: 8px; background: var(--bg-card, #fff); color: var(--text-primary, #111827); font-size: 14px; cursor: pointer; }
    .filter-select:focus { outline: none; border-color: #2196f3; }
    .clear-filters { display: inline-flex; align-items: center; gap: 4px; padding: 8px 12px; border: 1px solid var(--border-color, #d1d5db); border-radius: 8px; background: var(--bg-card, #fff); color: var(--text-primary, #374151); font-size: 13px; cursor: pointer; margin-bottom: 1px; }
    .clear-filters:hover { background: var(--bg-hover, #f3f4f6); }
    .clear-filters mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .result-count { font-size: 13px; color: var(--text-muted, #6b7280); margin-left: auto; align-self: center; }
    .table-container { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border-color, #eee); vertical-align: middle; }
    .data-table th { background: var(--table-header-bg, #f8fafc); font-weight: 600; color: var(--text-muted, #64748b); font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; }
    .data-table tr:hover { background: var(--table-row-hover, #f9fafb); }
    .actions-th { text-align: right; }
    .user-cell { display: flex; align-items: center; gap: 10px; min-width: 180px; }
    .avatar { width: 36px; height: 36px; border-radius: 10px; background: var(--text-primary, #102b35); color: var(--accent-primary, #f0b35b); display: grid; place-items: center; font-weight: 700; font-size: 12px; flex-shrink: 0; }
    .user-meta { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
    .user-meta strong { font-size: 13px; color: var(--text-primary, #1f2937); }
    .user-meta small { font-size: 12px; color: var(--text-muted, #6b7280); overflow: hidden; text-overflow: ellipsis; }
    .type-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; background: #eff6ff; color: #1d4ed8; white-space: nowrap; }
    .type-badge mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .badge { padding: 4px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; margin-right: 4px; display: inline-block; }
    .badge-muted { background: var(--bg-hover, #e5e7eb); color: var(--text-secondary, #4b5563); }
    .badge-success { background: var(--badge-success-bg, #dcfce7); color: var(--badge-success-text, #166534); }
    .badge-danger { background: var(--badge-danger-bg, #fee2e2); color: var(--badge-danger-text, #991b1b); }
    .actions { white-space: nowrap; text-align: right; }
    .actions button { margin-left: 2px; }
    .actions .danger-action { color: #ef4444; }
    .actions .warn-action { color: #f59e0b; }
    .empty-state { padding: 2.5rem; text-align: center; color: var(--text-muted, #6b7280); }
    mat-paginator { border-top: 1px solid var(--border-color, #f1f5f9); background: transparent; }
    @media (max-width: 700px) {
      .filters { flex-direction: column; align-items: stretch; }
      .search-box, .filter-field { width: 100%; }
      .result-count { margin-left: 0; }
    }
  `]
})
export class UserListComponent implements OnInit, OnDestroy {
  users: any[] = [];
  searchTerm = '';
  filterType = '';
  filterStatus = '';
  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;
  loading = false;

  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private api: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private notification: NotificationService,
    private permissions: PermissionService
  ) {}

  ngOnInit() {
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.pageIndex = 0;
      this.loadUsers();
    });

    this.loadUsers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(value: string) {
    this.search$.next(value || '');
  }

  onFilterChange() {
    this.pageIndex = 0;
    this.loadUsers();
  }

  onPageChange(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadUsers();
  }

  hasFilters(): boolean {
    return !!(this.searchTerm || this.filterType || this.filterStatus);
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterType = '';
    this.filterStatus = '';
    this.pageIndex = 0;
    this.loadUsers();
  }

  typeLabel(type: string): string {
    return USER_TYPE_LABELS[type] || type;
  }

  typeIcon(type: string): string {
    return USER_TYPE_ICONS[type] || 'person';
  }

  getUserRoleNames(user: any): string[] {
    if (Array.isArray(user?.roles)) {
      return user.roles.map((role: any) =>
        String(typeof role === 'string' ? role : (role?.name || role?.roleName || '')).toLowerCase()
      );
    }
    const roleIds = Array.isArray(user?.roleIds) ? user.roleIds : [];
    return roleIds.map((role: any) =>
      String(typeof role === 'string' ? role : (role?.name || role?.roleName || '')).toLowerCase()
    );
  }

  isAdminUser(user: any): boolean {
    if (user?.isSuperAdmin) return true;
    return this.getUserRoleNames(user).some(n =>
      n.includes('organizationadmin') ||
      n.includes('organizationowner') ||
      n === 'admin' ||
      n.includes('superadmin')
    );
  }

  displayUserType(user: any): string {
    if (this.isAdminUser(user)) return 'Admin';
    return user?.userType || '';
  }

  getInitials(user: any): string {
    const first = (user.firstName || '?')[0];
    const last = (user.lastName || '?')[0];
    return (first + last).toUpperCase();
  }

  loadUsers() {
    const params: any = {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined,
      userType: this.filterType || undefined
    };

    if (this.filterStatus === 'active') params.isActive = true;
    if (this.filterStatus === 'inactive') params.isActive = false;

    this.loading = true;
    this.api.get<any>('v1/users', params).subscribe({
      next: (res: any) => {
        this.users = res.items || [];
        this.totalCount = res.totalCount ?? (res.items?.length || 0);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to load users', err);
        this.notification.error('Failed to load users');
      }
    });
  }

  addUser() {
    this.router.navigate(['/settings/users/new']);
  }

  editUser(id: string) {
    this.router.navigate(['/settings/users/edit', id]);
  }

  openPermissions(user: any) {
    this.router.navigate(['/settings/users', user.id, 'permissions']);
  }

  openPasswordResetDialog(user: any) {
    const dialogRef = this.dialog.open(PasswordResetDialogComponent, {
      width: '450px',
      data: {
        userId: user.id,
        userName: user.fullName || ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || user.email,
        currentPassword: 'ChangeMe@123'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.newPassword) {
        this.api.post<any>(`v1/users/${user.id}/reset-password`, { newPassword: result.newPassword }).subscribe({
          next: () => {
            this.notification.success('Password updated successfully');
          },
          error: () => {
            this.notification.error('Failed to update password');
          }
        });
      }
    });
  }

  private isSelf(user: any): boolean {
    const currentId = this.permissions.current()?.userId;
    return !!currentId && !!user?.id && String(user.id).toLowerCase() === String(currentId).toLowerCase();
  }

  private isProtected(user: any): boolean {
    return !!user?.isMaster || !!user?.isSuperAdmin || this.isSelf(user);
  }

  canSuspend(user: any): boolean {
    return this.permissions.has('users.edit') && !this.isProtected(user);
  }

  canDelete(user: any): boolean {
    return this.permissions.has('users.delete') && !this.isProtected(user);
  }

  displayName(user: any): string {
    return user?.fullName || ((user?.firstName || '') + ' ' + (user?.lastName || '')).trim() || user?.email || 'this user';
  }

  toggleSuspend(user: any) {
    const isSuspend = !!user.isActive;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: isSuspend ? 'Suspend User' : 'Activate User',
        message: isSuspend
          ? `Are you sure you want to suspend ${this.displayName(user)}? They will not be able to sign in until reactivated.`
          : `Are you sure you want to activate ${this.displayName(user)}?`,
        confirmText: isSuspend ? 'Suspend' : 'Activate',
        confirmColor: isSuspend ? 'warn' : 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      const endpoint = isSuspend ? 'suspend' : 'activate';
      this.api.post<any>(`v1/users/${user.id}/${endpoint}`, {}).subscribe({
        next: () => {
          this.notification.success(isSuspend ? 'User suspended' : 'User activated');
          this.loadUsers();
        },
        error: (err) => this.notification.error(err?.message || 'Failed to update user status')
      });
    });
  }

  deleteUser(user: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete ${this.displayName(user)}? This action cannot be undone.`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.api.delete<any>('v1/users', user.id).subscribe({
        next: () => {
          this.notification.success('User deleted');
          this.loadUsers();
        },
        error: (err) => this.notification.error(err?.message || 'Failed to delete user')
      });
    });
  }
}
