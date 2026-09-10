import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-role-list',
  template: `
    <app-main-layout>
      <app-page-header title="Roles" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Settings', route: '/settings' }, { label: 'Roles' }]"></app-page-header>

      <div class="page-card">
        <div class="page-header">
          <div>
            <h2>Roles Management</h2>
            <p>Define permission sets and control access across the application.</p>
          </div>
          <button mat-raised-button color="primary" (click)="addRole()">
            <mat-icon>add</mat-icon> Add Role
          </button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Permissions</th>
                <th>Users</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let role of roles">
                <td>{{ role.name }}</td>
                <td>{{ role.description || 'N/A' }}</td>
                <td><span class="badge badge-info">{{ role.permissionNames?.length || 0 }}</span></td>
                <td>{{ role.userCount || role.usersCount || 0 }}</td>
                <td>
                  <span class="badge" [class.badge-warning]="role.isSystemRole" [class.badge-info]="!role.isSystemRole">
                    {{ role.isSystemRole ? 'System' : 'Custom' }}
                  </span>
                </td>
                <td class="actions">
                  <button mat-icon-button color="primary" (click)="editRole(role.id)" matTooltip="Edit role" [disabled]="role.isSystemRole">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteRole(role.id)" matTooltip="Delete role" [disabled]="role.isSystemRole">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </tr>
              <tr *ngIf="!roles.length">
                <td colspan="6" class="empty-state">No custom roles found. Create a role to assign permissions.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .page-card { background: #fff; border: 1px solid rgba(0, 0, 0, 0.06); border-radius: 12px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04); }
    .page-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .page-header h2 { margin: 0; color: #1f2937; }
    .page-header p { margin: 0.4rem 0 0; color: #6b7280; }
    .table-container { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; background: white; }
    .data-table th, .data-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #eee; }
    .data-table th { background: #f8fafc; font-weight: 600; }
    .data-table tr:hover { background: #f9fafb; }
    .badge { padding: 4px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
    .badge-info { background: #dbeafe; color: #1d4ed8; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .actions { white-space: nowrap; }
    .actions button { margin-right: 4px; }
    .page-header button mat-icon { margin-right: 4px; }
    .empty-state { padding: 2rem !important; text-align: center; color: #64748b; }
  `]
})
export class RoleListComponent implements OnInit {
  roles: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.api.get<any[]>('v1/roles').subscribe({
      next: (res: any) => {
        this.roles = Array.isArray(res) ? res.filter(role => !role.isSystemRole) : [];
      },
      error: (err) => console.error('Failed to load roles', err)
    });
  }

  addRole() {
    this.router.navigate(['/settings/roles/new']);
  }

  editRole(id: string) {
    this.router.navigate(['/settings/roles/edit', id]);
  }

  deleteRole(id: string) {
    if (confirm('Are you sure you want to delete this role?')) {
      this.api.delete<any>('v1/roles', id).subscribe({
        next: () => this.loadRoles(),
        error: () => alert('Failed to delete role')
      });
    }
  }
}
