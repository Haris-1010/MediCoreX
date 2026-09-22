import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../core/services/notification.service';

interface RoleRow {
  id: string;
  name: string;
  description: string;
  isSystemRole: boolean;
  isActive: boolean;
  userCount: number;
  permissionNames: string[];
}

interface PermissionItem {
  key: string;
  label: string;
}

interface PermissionGroup {
  group: string;
  category: string;
  items: PermissionItem[];
}

@Component({
  standalone: false,
  selector: 'app-roles-management',
  template: `
    <div class="roles-shell">
      <!-- Main list panel -->
      <div class="panel">
        <div class="filter-bar">
          <mat-form-field appearance="outline" class="search">
            <mat-icon matPrefix>search</mat-icon>
            <mat-label>Search roles</mat-label>
            <input matInput [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()">
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="openNew()">
            <mat-icon>add</mat-icon>
            New Role
          </button>
        </div>

        <div class="loading" *ngIf="loading">
          <mat-spinner diameter="36"></mat-spinner>
        </div>

        <div class="empty" *ngIf="!loading && !filtered.length">
          <mat-icon>admin_panel_settings</mat-icon>
          <h3>No roles found</h3>
          <p>Create your first custom role to get started.</p>
          <button mat-stroked-button color="primary" (click)="openNew()">Create role</button>
        </div>

        <table mat-table [dataSource]="filtered" class="roles-table" *ngIf="!loading && filtered.length">

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let role">
              <div class="role-name-cell">
                <span class="role-avatar">{{ (role.name || '?')[0] }}</span>
                <div>
                  <strong>{{ role.name }}</strong>
                  <small *ngIf="role.isSystemRole" class="system-badge">System</small>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let role">
              <span class="desc-text">{{ role.description || '—' }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="users">
            <th mat-header-cell *matHeaderCellDef>Users</th>
            <td mat-cell *matCellDef="let role">
              <span class="user-count">{{ role.userCount }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let role">
              <span class="status-chip" [class.active]="role.isActive" [class.inactive]="!role.isActive">
                {{ role.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let role">
              <div class="row-actions">
                <button mat-icon-button matTooltip="Edit" (click)="openEdit(role)" [disabled]="role.isSystemRole">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Delete" (click)="confirmDelete(role)" [disabled]="role.isSystemRole">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" [class.system-row]="row.isSystemRole"></tr>
        </table>
      </div>

      <!-- Side panel for create / edit -->
      <mat-sidenav-container class="side-container" *ngIf="panelOpen">
        <mat-sidenav #sidenav mode="side" [opened]="panelOpen" position="end" class="side-panel">
          <div class="panel-header">
            <h3>{{ editingRole ? 'Edit Role' : 'New Role' }}</h3>
            <button mat-icon-button (click)="closePanel()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="panel-body">
            <mat-form-field appearance="outline" class="full">
              <mat-label>Role name</mat-label>
              <input matInput [(ngModel)]="formName" placeholder="e.g. Receptionist">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full">
              <mat-label>Description</mat-label>
              <textarea matInput [(ngModel)]="formDescription" rows="3" placeholder="What this role is for"></textarea>
            </mat-form-field>

            <div class="permissions-section">
              <div class="perm-header">
                <h4>Permissions</h4>
                <button mat-button color="primary" (click)="toggleAllPermissions()">
                  {{ allSelected() ? 'Deselect All' : 'Select All' }}
                </button>
              </div>

              <div class="loading" *ngIf="loadingPermissions">
                <mat-spinner diameter="24"></mat-spinner>
              </div>

              <div class="perm-group" *ngFor="let group of permissionGroups">
                <div class="perm-group-header">
                  <span class="group-label">{{ group.group }}</span>
                  <button mat-button class="group-toggle" (click)="toggleGroup(group)">
                    {{ isGroupSelected(group) ? 'Deselect' : 'Select' }}
                  </button>
                </div>
                <div class="perm-items">
                  <label class="perm-item" *ngFor="let item of group.items">
                    <mat-checkbox
                      [checked]="selectedPermissions.has(item.key)"
                      (change)="togglePermission(item.key, $event.checked)">
                      {{ item.label }}
                    </mat-checkbox>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="panel-footer">
            <button mat-stroked-button (click)="closePanel()">Cancel</button>
            <button mat-raised-button color="primary" (click)="save()" [disabled]="saving || !formName.trim()">
              <mat-spinner *ngIf="saving" diameter="18"></mat-spinner>
              <span *ngIf="!saving">{{ editingRole ? 'Update' : 'Create' }}</span>
            </button>
          </div>
        </mat-sidenav>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .roles-shell { display: grid; gap: 16px; position: relative; }

    .filter-bar { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
    .search { width: min(320px, 100%); }

    .panel {
      background: var(--bg-card, #fff);
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 12px;
      padding: 20px;
    }

    .loading { display: grid; place-items: center; padding: 60px; }
    .empty { text-align: center; padding: 60px 20px; color: var(--text-muted, #64748b); background: var(--bg-card, #fff); border: 1px dashed var(--border-color, #e0e0e0); border-radius: 12px; }
    .empty h3 { margin: 8px 0 4px; color: var(--text-primary, #172033); }
    .empty p { margin: 0 0 12px; }

    /* Table */
    .roles-table { width: 100%; }
    .roles-table .mat-mdc-header-cell { color: var(--text-muted, #64748b); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; border-bottom-color: var(--border-color, #edf1f1); }
    .roles-table .mat-mdc-cell { border-bottom-color: var(--border-color, #edf1f1); padding: 14px 16px; }

    .role-name-cell { display: flex; align-items: center; gap: 12px; }
    .role-avatar { width: 38px; height: 38px; border-radius: 10px; background: var(--text-primary, #102b35); color: var(--accent-primary, #f0b35b); display: grid; place-items: center; font-weight: 700; font-size: 15px; flex-shrink: 0; }
    .role-name-cell strong { display: block; font-size: 14px; color: var(--text-primary, #172033); }
    .system-badge {
      display: inline-block;
      margin-left: 6px;
      padding: 1px 8px;
      border-radius: 999px;
      background: var(--bg-secondary, #e8edf2);
      color: var(--text-secondary, #475569);
      font-size: 11px;
      font-weight: 600;
      vertical-align: middle;
    }

    .desc-text { color: var(--text-muted, #64748b); font-size: 13px; max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .user-count { font-weight: 600; color: var(--text-primary, #102b35); }

    .status-chip { padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .status-chip.active { background: var(--status-success-bg, #e5f6ec); color: var(--status-success, #18794e); }
    .status-chip.inactive { background: var(--status-error-bg, #fdecea); color: var(--status-error, #b42318); }

    .row-actions { display: flex; gap: 2px; justify-content: flex-end; }
    .system-row { opacity: .65; }

    /* Side panel */
    .side-container { position: fixed; inset: 0; z-index: 200; pointer-events: none; }
    .side-panel {
      pointer-events: auto;
      width: min(520px, 90vw);
      background: var(--bg-card, #fff);
      border-left: 1px solid var(--border-color, #e0e0e0);
      box-shadow: -8px 0 32px rgba(16,43,53,.12);
      display: flex;
      flex-direction: column;
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px 12px;
      border-bottom: 1px solid var(--border-color, #e0e0e0);
    }
    .panel-header h3 { margin: 0; color: var(--text-primary, #172033); font-size: 18px; }
    .panel-body { flex: 1; overflow-y: auto; padding: 24px; }
    .panel-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid var(--border-color, #e0e0e0);
    }
    .full { width: 100%; }

    /* Permissions */
    .permissions-section { margin-top: 8px; }
    .perm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .perm-header h4 { margin: 0; color: var(--text-primary, #172033); font-size: 15px; }

    .perm-group { margin-bottom: 20px; }
    .perm-group-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: var(--bg-hover, #f5f5f5);
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .group-label { font-weight: 600; font-size: 13px; color: var(--text-primary, #102b35); text-transform: capitalize; }
    .group-toggle { font-size: 12px !important; }

    .perm-items { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 4px 12px; padding-left: 8px; }
    .perm-item { display: flex; align-items: center; }
    .perm-item mat-checkbox { font-size: 13px; }
  `]
})
export class RolesManagementComponent implements OnInit {
  roles: RoleRow[] = [];
  filtered: RoleRow[] = [];
  loading = true;
  searchTerm = '';

  displayedColumns = ['name', 'description', 'users', 'status', 'actions'];

  // Side panel state
  panelOpen = false;
  editingRole: RoleRow | null = null;
  formName = '';
  formDescription = '';
  saving = false;

  // Permissions
  permissionGroups: PermissionGroup[] = [];
  selectedPermissions = new Set<string>();
  loadingPermissions = false;

  private readonly rolesEndpoint = `${environment.apiUrl}/v1/roles`;
  private readonly permsEndpoint = `${environment.apiUrl}/v1/roles/permissions`;

  constructor(
    private http: HttpClient,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  /* ── Load data ─────────────────────────────── */

  loadRoles(): void {
    this.loading = true;
    this.http.get<{ items: RoleRow[] }>(this.rolesEndpoint).subscribe({
      next: response => {
        this.roles = response.items || [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Unable to load roles.');
      }
    });
  }

  loadPermissions(): void {
    this.loadingPermissions = true;
    this.http.get<PermissionGroup[]>(this.permsEndpoint).subscribe({
      next: groups => {
        this.permissionGroups = groups || [];
        this.loadingPermissions = false;
      },
      error: () => {
        this.loadingPermissions = false;
        this.notification.error('Unable to load permissions.');
      }
    });
  }

  /* ── Filter ─────────────────────────────────── */

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filtered = term
      ? this.roles.filter(r =>
          (r.name || '').toLowerCase().includes(term) ||
          (r.description || '').toLowerCase().includes(term))
      : [...this.roles];
  }

  /* ── Panel open / close ─────────────────────── */

  openNew(): void {
    this.editingRole = null;
    this.formName = '';
    this.formDescription = '';
    this.selectedPermissions = new Set();
    this.panelOpen = true;
    this.loadPermissions();
  }

  openEdit(role: RoleRow): void {
    this.editingRole = role;
    this.formName = role.name;
    this.formDescription = role.description || '';
    this.selectedPermissions = new Set(role.permissionNames || []);
    this.panelOpen = true;
    this.loadPermissions();
  }

  closePanel(): void {
    this.panelOpen = false;
    this.editingRole = null;
  }

  /* ── Permissions helpers ─────────────────────── */

  togglePermission(key: string, checked: boolean): void {
    if (checked) {
      this.selectedPermissions.add(key);
    } else {
      this.selectedPermissions.delete(key);
    }
  }

  toggleGroup(group: PermissionGroup): void {
    const allKeys = group.items.map(i => i.key);
    const allChecked = allKeys.every(k => this.selectedPermissions.has(k));
    if (allChecked) {
      allKeys.forEach(k => this.selectedPermissions.delete(k));
    } else {
      allKeys.forEach(k => this.selectedPermissions.add(k));
    }
  }

  isGroupSelected(group: PermissionGroup): boolean {
    return group.items.every(i => this.selectedPermissions.has(i.key));
  }

  toggleAllPermissions(): void {
    if (this.allSelected()) {
      this.selectedPermissions = new Set();
    } else {
      const allKeys = this.permissionGroups.flatMap(g => g.items.map(i => i.key));
      this.selectedPermissions = new Set(allKeys);
    }
  }

  allSelected(): boolean {
    const total = this.permissionGroups.reduce((sum, g) => sum + g.items.length, 0);
    return total > 0 && this.selectedPermissions.size === total;
  }

  /* ── CRUD ────────────────────────────────────── */

  save(): void {
    if (!this.formName.trim()) return;

    this.saving = true;
    const body = {
      name: this.formName.trim(),
      description: this.formDescription.trim(),
      permissionNames: Array.from(this.selectedPermissions)
    };

    if (this.editingRole) {
      this.http.put(`${this.rolesEndpoint}/${this.editingRole.id}`, body).subscribe({
        next: () => {
          this.saving = false;
          this.notification.success('Role updated successfully.');
          this.closePanel();
          this.loadRoles();
        },
        error: error => {
          this.saving = false;
          this.notification.error(error.error?.message || 'Role could not be updated.');
        }
      });
    } else {
      this.http.post(this.rolesEndpoint, body).subscribe({
        next: () => {
          this.saving = false;
          this.notification.success('Role created successfully.');
          this.closePanel();
          this.loadRoles();
        },
        error: error => {
          this.saving = false;
          this.notification.error(error.error?.message || 'Role could not be created.');
        }
      });
    }
  }

  confirmDelete(role: RoleRow): void {
    const confirmed = window.confirm(`Delete role "${role.name}"? This action cannot be undone.`);
    if (!confirmed) return;

    this.http.delete(`${this.rolesEndpoint}/${role.id}`).subscribe({
      next: () => {
        this.notification.success(`Role "${role.name}" deleted.`);
        this.loadRoles();
      },
      error: error => this.notification.error(error.error?.message || 'Role could not be deleted.')
    });
  }
}
