import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../core/services/notification.service';

/* ── Interfaces ──────────────────────────────────── */

interface UserSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface CatalogPermission {
  name: string;
  displayName: string;
}

interface CatalogModule {
  module: string;
  category: string;
  permissions: CatalogPermission[];
}

interface UserPermission {
  name: string;
  displayName: string;
  granted: boolean;
  source: 'role' | 'user-grant' | 'user-deny' | 'none';
  branchId: string | null;
}

interface UserModule {
  module: string;
  category: string;
  permissions: UserPermission[];
}

interface UserPermissionsResponse {
  userId: string;
  modules: UserModule[];
}

type PermissionState = 'inherit' | 'grant' | 'deny';

/* ── Component ───────────────────────────────────── */

@Component({
  standalone: false,
  selector: 'app-user-permissions',
  template: `
    <div class="perms-shell">
      <div class="panel selector-panel">
        <div class="panel-title">
          <mat-icon>person_search</mat-icon>
          <h3>User Permissions</h3>
        </div>
        <p class="subtitle">Select a user to view and manage their individual permission overrides.</p>

        <mat-form-field appearance="outline" class="user-select">
          <mat-label>Search user</mat-label>
          <input
            matInput
            [formControl]="userSearchCtrl"
            [matAutocomplete]="auto"
            placeholder="Type a name or email..."
          />
          <mat-icon matPrefix>search</mat-icon>
          <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onUserSelected($event)">
            <mat-option *ngFor="let user of filteredUsers" [value]="user.id">
              <div class="user-option">
                <span class="user-avatar">{{ (user.firstName || '?')[0] }}{{ (user.lastName || '?')[0] }}</span>
                <div class="user-info">
                  <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </div>
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
      </div>

      <div class="loading" *ngIf="loadingPermissions">
        <mat-spinner diameter="36"></mat-spinner>
        <span>Loading permissions...</span>
      </div>

      <div class="empty" *ngIf="!loadingPermissions && !selectedUserId">
        <mat-icon>admin_panel_settings</mat-icon>
        <h3>No user selected</h3>
        <p>Search and select a user above to manage their permissions.</p>
      </div>

      <ng-container *ngIf="!loadingPermissions && selectedUserId && moduleGroups.length">
        <div class="panel matrix-panel">
          <div class="matrix-header">
            <div class="header-left">
              <h3>Permission Matrix</h3>
              <span class="change-count" *ngIf="dirtyCount > 0">
                {{ dirtyCount }} unsaved change{{ dirtyCount === 1 ? '' : 's' }}
              </span>
            </div>
            <div class="header-actions">
              <button mat-stroked-button (click)="resetChanges()" [disabled]="dirtyCount === 0">
                <mat-icon>restart_alt</mat-icon>
                Reset
              </button>
              <button mat-raised-button color="primary" (click)="saveOverrides()" [disabled]="saving || dirtyCount === 0">
                <mat-spinner *ngIf="saving" diameter="18"></mat-spinner>
                <span *ngIf="!saving">Save Changes</span>
              </button>
            </div>
          </div>

          <div class="legend">
            <span class="legend-item"><span class="dot dot-inherit"></span> Inherited from role</span>
            <span class="legend-item"><span class="dot dot-grant"></span> Granted (override)</span>
            <span class="legend-item"><span class="dot dot-deny"></span> Denied (override)</span>
          </div>
        </div>

        <div class="module-grid">
          <div class="panel module-card" *ngFor="let group of moduleGroups">
            <div class="module-header">
              <span class="module-avatar">{{ group.module[0] }}</span>
              <div>
                <h4>{{ group.module }}</h4>
                <small>{{ group.category }}</small>
              </div>
            </div>
            <div class="perm-list">
              <div
                class="perm-row"
                *ngFor="let perm of group.permissions"
                [class.dirty]="isDirty(perm.name)"
                [class.granted]="getState(perm.name) === 'grant'"
                [class.denied]="getState(perm.name) === 'deny'"
              >
                <div class="perm-info">
                  <span class="perm-name">{{ perm.displayName }}</span>
                  <span class="perm-source" [attr.data-source]="perm.source">{{ formatSource(perm.source) }}</span>
                </div>
                <div class="perm-toggle">
                  <button
                    mat-icon-button
                    class="toggle-btn inherit"
                    [class.active]="getState(perm.name) === 'inherit'"
                    matTooltip="Inherit from role"
                    (click)="setState(perm.name, 'inherit')"
                  >
                    <mat-icon>remove_circle_outline</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    class="toggle-btn grant"
                    [class.active]="getState(perm.name) === 'grant'"
                    matTooltip="Grant permission"
                    (click)="setState(perm.name, 'grant')"
                  >
                    <mat-icon>check_circle</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    class="toggle-btn deny"
                    [class.active]="getState(perm.name) === 'deny'"
                    matTooltip="Deny permission"
                    (click)="setState(perm.name, 'deny')"
                  >
                    <mat-icon>block</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>

      <div class="empty" *ngIf="!loadingPermissions && selectedUserId && moduleGroups.length === 0 && !catalogLoading">
        <mat-icon>check_circle</mat-icon>
        <h3>No permissions available</h3>
        <p>There are no permissions in the catalog to display.</p>
      </div>
    </div>
  `,
  styles: [`
    .perms-shell { display: grid; gap: 16px; }

    .panel {
      background: var(--bg-card, #fff);
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 12px;
      padding: 20px;
    }

    .selector-panel .panel-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 4px;
    }
    .selector-panel .panel-title mat-icon { color: var(--text-primary, #102b35); }
    .selector-panel .panel-title h3 { margin: 0; color: var(--text-primary, #172033); font-size: 18px; }
    .subtitle { color: var(--text-muted, #64748b); font-size: 13px; margin: 0 0 12px; }

    .user-select { width: 100%; max-width: 480px; }

    .user-option { display: flex; align-items: center; gap: 10px; padding: 4px 0; }
    .user-avatar {
      width: 32px; height: 32px;
      border-radius: 8px;
      background: var(--text-primary, #102b35);
      color: var(--accent-primary, #f0b35b);
      display: grid; place-items: center;
      font-weight: 700; font-size: 12px;
      flex-shrink: 0;
    }
    .user-info { display: flex; flex-direction: column; }
    .user-name { font-size: 14px; font-weight: 500; }
    .user-email { font-size: 12px; color: var(--text-muted, #64748b); }

    .loading { display: grid; place-items: center; padding: 60px; gap: 12px; color: var(--text-muted, #64748b); }
    .empty { text-align: center; padding: 60px 20px; color: var(--text-muted, #64748b); background: var(--bg-card, #fff); border: 1px dashed var(--border-color, #e0e0e0); border-radius: 12px; }
    .empty h3 { margin: 8px 0 4px; color: var(--text-primary, #172033); }
    .empty p { margin: 0 0 12px; }

    .matrix-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .header-left { display: flex; align-items: center; gap: 12px; }
    .header-left h3 { margin: 0; color: var(--text-primary, #172033); font-size: 18px; }
    .change-count {
      padding: 3px 10px;
      border-radius: 999px;
      background: var(--status-warning-bg, #fff3e0);
      color: var(--status-warning, #856404);
      font-size: 12px;
      font-weight: 600;
    }
    .header-actions { display: flex; gap: 8px; }

    .legend {
      display: flex;
      gap: 20px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--border-color, #e0e0e0);
    }
    .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted, #64748b); }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot-inherit { background: var(--border-color, #cbd5d5); }
    .dot-grant { background: var(--status-success, #22c55e); }
    .dot-deny { background: var(--status-error, #ef4444); }

    .module-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 16px;
    }

    .module-card { padding: 0; overflow: hidden; }

    .module-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: var(--bg-hover, #f5f5f5);
      border-bottom: 1px solid var(--border-color, #edf1f1);
    }
    .module-avatar {
      width: 38px; height: 38px;
      border-radius: 10px;
      background: var(--text-primary, #102b35);
      color: var(--accent-primary, #f0b35b);
      display: grid; place-items: center;
      font-weight: 700; font-size: 15px;
      flex-shrink: 0;
    }
    .module-header h4 { margin: 0; color: var(--text-primary, #172033); font-size: 15px; }
    .module-header small { color: var(--text-muted, #64748b); font-size: 12px; }

    .perm-list { padding: 4px 0; }

    .perm-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      border-bottom: 1px solid var(--border-color, #f5f7f7);
      transition: background 0.15s;
    }
    .perm-row:last-child { border-bottom: none; }
    .perm-row:hover { background: var(--bg-secondary, #f8fafb); }
    .perm-row.dirty { background: var(--status-warning-bg, #fff3e0); }
    .perm-row.granted {       background: var(--status-success-bg, #f1f8e9); }
    .perm-row.denied {       background: var(--status-error-bg, #ffebee); }

    .perm-info { display: flex; flex-direction: column; gap: 2px; }
    .perm-name { font-size: 13px; color: var(--text-primary, #172033); font-weight: 500; }
    .perm-source {
      font-size: 11px;
      font-weight: 600;
      text-transform: capitalize;
    }
    .perm-source[data-source="role"] { color: var(--text-muted, #64748b); }
    .perm-source[data-source="user-grant"] { color: var(--status-success, #18794e); }
    .perm-source[data-source="user-deny"] { color: var(--status-error, #b42318); }
    .perm-source[data-source="none"] { color: var(--text-muted, #94a3b8); }

    .perm-toggle { display: flex; gap: 2px; }

    .toggle-btn {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      opacity: 0.35;
      transition: opacity 0.15s, transform 0.15s;
    }
    .toggle-btn:hover { opacity: 0.7; }
    .toggle-btn.active { opacity: 1; transform: scale(1.1); }

    .toggle-btn.inherit mat-icon { color: var(--text-muted, #94a3b8); }
    .toggle-btn.inherit.active mat-icon { color: var(--text-muted, #64748b); }
    .toggle-btn.grant mat-icon { color: var(--status-success, #22c55e); }
    .toggle-btn.grant.active { background: var(--status-success-bg, #f1f8e9); }
    .toggle-btn.deny mat-icon { color: var(--status-error, #ef4444); }
    .toggle-btn.deny.active { background: var(--status-error-bg, #ffebee); }
  `]
})
export class UserPermissionsComponent implements OnInit, OnDestroy {
  userSearchCtrl = new FormControl('');
  filteredUsers: UserSearchResult[] = [];
  selectedUserId: string | null = null;

  moduleGroups: (CatalogModule & { permissions: (CatalogPermission & { granted: boolean; source: string; branchId: string | null })[] })[] = [];

  private originalStates = new Map<string, PermissionState>();
  currentStates = new Map<string, PermissionState>();

  saving = false;
  loadingPermissions = false;
  catalogLoading = false;
  dirtyCount = 0;

  private readonly usersEndpoint = `${environment.apiUrl}/v1/users`;
  private readonly catalogEndpoint = `${environment.apiUrl}/v1/users/permission-catalog`;
  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.userSearchCtrl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => this.searchUsers(term || ''));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ── User search ──────────────────────────────── */

  private searchUsers(term: string): void {
    if (term.length < 2) {
      this.filteredUsers = [];
      return;
    }
    this.http.get<{ items: UserSearchResult[] }>(`${this.usersEndpoint}?search=${encodeURIComponent(term)}`).subscribe({
      next: res => { this.filteredUsers = res.items || []; },
      error: () => { this.filteredUsers = []; }
    });
  }

  onUserSelected(event: MatAutocompleteSelectedEvent): void {
    const userId = event.option.value;
    this.selectedUserId = userId;
    this.filteredUsers = [];
    this.userSearchCtrl.setValue(event.option.viewValue, { emitEvent: false });
    this.loadUserPermissions(userId);
  }

  /* ── Permissions ───────────────────────────────── */

  private loadUserPermissions(userId: string): void {
    this.loadingPermissions = true;
    this.currentStates = new Map();
    this.originalStates = new Map();
    this.dirtyCount = 0;

    const catalog$ = this.http.get<CatalogModule[]>(this.catalogEndpoint);
    const userPerms$ = this.http.get<UserPermissionsResponse>(`${this.usersEndpoint}/${userId}/permissions`);

    let catalog: CatalogModule[] = [];
    let userResponse: UserPermissionsResponse | null = null;

    const buildGroups = () => {
      if (!catalog.length || !userResponse) return;

      const userPermMap = new Map<string, { granted: boolean; source: string; branchId: string | null }>();
      for (const mod of userResponse.modules) {
        for (const p of mod.permissions) {
          userPermMap.set(p.name, { granted: p.granted, source: p.source, branchId: p.branchId });
        }
      }

      this.moduleGroups = catalog.map(cat => ({
        ...cat,
        permissions: cat.permissions.map(p => {
          const userPerm = userPermMap.get(p.name);
          const granted = userPerm?.granted ?? false;
          const source = userPerm?.source ?? 'none';
          const branchId = userPerm?.branchId ?? null;

          let initialState: PermissionState = 'inherit';
          if (source === 'user-grant') initialState = 'grant';
          else if (source === 'user-deny') initialState = 'deny';

          this.originalStates.set(p.name, initialState);
          this.currentStates.set(p.name, initialState);

          return { ...p, granted, source, branchId };
        })
      }));

      this.loadingPermissions = false;
      this.catalogLoading = false;
    };

    this.catalogLoading = true;

    catalog$.subscribe({
      next: data => { catalog = data || []; buildGroups(); },
      error: () => {
        this.notification.error('Unable to load permission catalog.');
        this.loadingPermissions = false;
        this.catalogLoading = false;
      }
    });

    userPerms$.subscribe({
      next: data => { userResponse = data; buildGroups(); },
      error: () => {
        this.notification.error('Unable to load user permissions.');
        this.loadingPermissions = false;
        this.catalogLoading = false;
      }
    });
  }

  /* ── State management ──────────────────────────── */

  getState(permName: string): PermissionState {
    return this.currentStates.get(permName) || 'inherit';
  }

  setState(permName: string, state: PermissionState): void {
    const original = this.originalStates.get(permName) || 'inherit';
    this.currentStates.set(permName, state);
    this.dirtyCount = 0;
    this.currentStates.forEach((val, key) => {
      if (val !== this.originalStates.get(key)) this.dirtyCount++;
    });
  }

  isDirty(permName: string): boolean {
    return this.currentStates.get(permName) !== this.originalStates.get(permName);
  }

  resetChanges(): void {
    this.currentStates = new Map(this.originalStates);
    this.dirtyCount = 0;
  }

  formatSource(source: string): string {
    switch (source) {
      case 'role': return 'via role';
      case 'user-grant': return 'user grant';
      case 'user-deny': return 'user deny';
      default: return 'not set';
    }
  }

  /* ── Save ───────────────────────────────────────── */

  saveOverrides(): void {
    if (!this.selectedUserId || this.dirtyCount === 0) return;

    const grants: string[] = [];
    const denies: string[] = [];

    this.currentStates.forEach((state, permName) => {
      if (state === 'grant') grants.push(permName);
      else if (state === 'deny') denies.push(permName);
    });

    this.saving = true;
    this.http.put(`${this.usersEndpoint}/${this.selectedUserId}/permissions`, { grants, denies }).pipe(
      finalize(() => { this.saving = false; })
    ).subscribe({
      next: () => {
        this.notification.success('Permissions updated successfully.');
        this.originalStates = new Map(this.currentStates);
        this.dirtyCount = 0;
        this.loadUserPermissions(this.selectedUserId!);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Unable to update permissions.');
      }
    });
  }
}
