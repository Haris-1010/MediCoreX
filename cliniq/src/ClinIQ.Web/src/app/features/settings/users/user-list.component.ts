import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PasswordResetDialogComponent } from './password-reset-dialog/password-reset-dialog.component';

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
            <p>Manage user accounts, access rights, and account status.</p>
          </div>
          <button mat-raised-button color="primary" (click)="addUser()">
            <mat-icon>person_add</mat-icon> Add User
          </button>
        </div>

        <div class="filters">
          <input type="text"
                 class="form-control"
                 placeholder="Search users..."
                 [(ngModel)]="searchTerm"
                 (input)="loadUsers()">
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Roles</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>{{ user.fullName || ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || 'Unknown User' }}</td>
                <td>{{ user.email }}</td>
                <td>{{ (user.phoneNumber || user.phone || 'N/A') | phone }}</td>
                <td>
                  <span *ngFor="let role of getUserRoles(user)" class="badge badge-info">{{ role }}</span>
                  <span *ngIf="!getUserRoles(user).length" class="badge badge-muted">No roles</span>
                </td>
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
                  <button mat-icon-button (click)="openPasswordResetDialog(user)" matTooltip="Reset password">
                    <mat-icon>key</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteUser(user.id)" matTooltip="Delete user">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination" *ngIf="totalPages > 1">
          <button mat-stroked-button [disabled]="currentPage === 1" (click)="goToPage(currentPage - 1)"><mat-icon>chevron_left</mat-icon> Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button mat-stroked-button [disabled]="currentPage === totalPages" (click)="goToPage(currentPage + 1)">Next <mat-icon>chevron_right</mat-icon></button>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .page-card { background: #fff; border: 1px solid rgba(0, 0, 0, 0.06); border-radius: 12px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04); }
    .page-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .page-header h2 { margin: 0; color: #1f2937; }
    .page-header p { margin: 0.4rem 0 0; color: #6b7280; }
    .filters { margin-bottom: 20px; }
    .filters input { width: 300px; }
    .table-container { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    .data-table th { background: #f8fafc; font-weight: 600; }
    .data-table tr:hover { background: #f9fafb; }
    .badge { padding: 4px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; margin-right: 4px; display: inline-block; }
    .badge-info { background: #dbeafe; color: #1d4ed8; }
    .badge-muted { background: #e5e7eb; color: #4b5563; }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
    .actions { white-space: nowrap; }
    .actions button { margin-right: 2px; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 20px; }
    .page-header button mat-icon { margin-right: 4px; }
    .pagination button { display: inline-flex; align-items: center; gap: 4px; }
    .pagination button mat-icon { font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;

  constructor(
    private api: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  getUserRoles(user: any): string[] {
    if (Array.isArray(user?.roles)) {
      return user.roles.map((role: any) => typeof role === 'string' ? role : (role?.name || role?.roleName || 'Role'));
    }

    const roleIds = Array.isArray(user?.roleIds) ? user.roleIds : [];
    return roleIds.map((role: any) => typeof role === 'string' ? role : (role?.name || role?.roleName || 'Role'));
  }

  loadUsers() {
    this.api.get<any>('v1/users', { pageNumber: this.currentPage, searchTerm: this.searchTerm }).subscribe({
      next: (res: any) => {
        this.users = res.items || [];
        this.totalPages = res.totalPages || 1;
      },
      error: (err) => console.error('Failed to load users', err)
    });
  }

  addUser() {
    this.router.navigate(['/settings/users/new']);
  }

  editUser(id: string) {
    this.router.navigate(['/settings/users/edit', id]);
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

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.api.delete<any>('v1/users', id).subscribe({
        next: () => this.loadUsers(),
        error: () => alert('Failed to delete user')
      });
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }
}
