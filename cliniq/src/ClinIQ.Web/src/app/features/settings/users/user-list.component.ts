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
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: any[] = [];
  stats: { total: number; active: number; inactive: number; doctors: number; neverLoggedIn: number } | null = null;
  searchTerm = '';
  filterType = '';
  filterStatus = '';
  totalCount = 0;
  pageSize = 25;

  readonly typeFilters = [
    { value: '', label: 'Everyone', icon: 'groups' },
    { value: 'Admin', label: 'Admins', icon: USER_TYPE_ICONS['Admin'] },
    { value: 'Doctor', label: 'Doctors', icon: USER_TYPE_ICONS['Doctor'] },
    { value: 'Nurse', label: 'Nurses', icon: USER_TYPE_ICONS['Nurse'] },
    { value: 'Receptionist', label: 'Reception', icon: USER_TYPE_ICONS['Receptionist'] },
    { value: 'PharmacyManager', label: 'Pharmacy', icon: USER_TYPE_ICONS['PharmacyManager'] },
    { value: 'LabManager', label: 'Laboratory', icon: USER_TYPE_ICONS['LabManager'] },
  ];
  pageIndex = 0;
  loading = false;

  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private api: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private notification: NotificationService,
    public permissions: PermissionService
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

  setType(value: string) {
    this.filterType = value;
    this.onFilterChange();
  }

  setStatus(value: '' | 'active' | 'inactive') {
    this.filterStatus = this.filterStatus === value ? '' : value;
    this.onFilterChange();
  }

  /** Stable accent per user type so the list scans quickly. */
  typeTone(user: any): string {
    const type = this.displayUserType(user);
    return ({ Admin: 'indigo', Doctor: 'teal', Nurse: 'rose', Receptionist: 'amber', PharmacyManager: 'emerald', LabManager: 'sky' } as Record<string, string>)[type] || 'slate';
  }

  visibleRoles(user: any): string[] {
    return (Array.isArray(user?.roles) ? user.roles : [])
      .map((r: any) => String(typeof r === 'string' ? r : (r?.name || '')))
      .filter((r: string) => !!r)
      .map((r: string) => r.replace(/([a-z])([A-Z])/g, '$1 $2'));
  }

  isSelfUser(user: any): boolean { return this.isSelf(user); }

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
        this.stats = res.stats ?? null;
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
