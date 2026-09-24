import { Component, Output, EventEmitter, OnInit, OnDestroy, effect } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService, User } from '../../core/services/auth.service';
import { TenantService, Tenant, Branch } from '../../core/services/tenant.service';
import { PermissionService, CurrentUserContext } from '../../core/services/permission.service';
import { SignalRService, NotificationMessage } from '../../core/services/signalr.service';
import { ThemeService } from '../../core/services/theme.service';
import { StorageService } from '../../core/services/storage.service';
import { environment } from '../../../environments/environment';

@Component({
  standalone: false,
  selector: 'app-header',
  template: `
    <mat-toolbar class="header-toolbar" color="primary">
      <!-- Menu Button -->
      <button mat-icon-button (click)="menuToggle.emit()" class="menu-btn">
        <mat-icon>menu</mat-icon>
      </button>

      <!-- Hospital Name (Tenant Branding) - Centered -->
      <div class="hospital-name-container">
        <span class="hospital-name">{{ tenant?.name || 'MediCoreX' }}</span>
      </div>

      <span class="spacer"></span>

      <!-- Location Selector -->
      <button mat-button [matMenuTriggerFor]="branchMenu" class="branch-selector" *ngIf="showLocationSelector">
        <mat-icon>location_on</mat-icon>
        <span>{{ currentLocationLabel }}</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>
      <mat-menu #branchMenu="matMenu">
        <button mat-menu-item *ngIf="hasAllLocationAccess" (click)="switchToAllLocations()">
          <mat-icon *ngIf="isAllLocationsMode">check</mat-icon>
          <span>All Locations</span>
        </button>
        <mat-divider *ngIf="hasAllLocationAccess && branches.length"></mat-divider>
        <button mat-menu-item *ngFor="let branch of branches" (click)="switchBranch(branch)">
          <mat-icon *ngIf="branch.id === currentBranch?.id && !isAllLocationsMode">check</mat-icon>
          <span>{{ branch.name }}</span>
        </button>
      </mat-menu>

      <!-- User Name (display only, no dropdown) -->
      <div class="user-display">
        <div class="user-avatar">
          {{ getUserInitials() }}
        </div>
        <span class="user-name">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</span>
      </div>

      <!-- Dark Mode Toggle -->
      <button mat-icon-button (click)="toggleTheme()" class="action-btn theme-toggle" [matTooltip]="isDark ? 'Light Mode' : 'Dark Mode'">
        <mat-icon>{{ isDark ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>

      <!-- Settings -->
      <button mat-icon-button routerLink="/settings" class="action-btn" matTooltip="Settings">
        <mat-icon>settings</mat-icon>
      </button>

      <!-- Logout -->
      <button mat-icon-button (click)="logout()" class="action-btn logout-btn" matTooltip="Logout">
        <mat-icon>exit_to_app</mat-icon>
      </button>

    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--bg-header, linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%));
      color: var(--text-primary, #1e293b);
      box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06));
      padding: 0 16px;
      height: 64px;
      display: flex;
      align-items: center;
      gap: 4px;
      border-bottom: 1px solid var(--border-color, rgba(102,126,234,0.1));
      transition: background 0.3s ease, color 0.3s ease;
    }

    .menu-btn {
      color: var(--text-secondary, #475569);
      margin-right: 8px;
      transition: all 0.2s ease;
    }

    .menu-btn:hover {
      background: var(--bg-hover, #f1f5f9);
      color: var(--accent-primary, #667eea);
    }

    .hospital-name-container {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      max-width: calc(100% - 280px);
      pointer-events: none;
      z-index: 1;
    }

    .hospital-name {
      background: var(--accent-gradient, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
      color: #ffffff;
      border-radius: 25px;
      padding: 6px 24px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);
      display: inline-flex;
      align-items: center;
      min-height: 36px;
      letter-spacing: 0.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }

    .spacer {
      flex: 1;
    }

    .branch-selector {
      color: var(--text-secondary, #475569);
      margin-right: 16px;
      background: var(--bg-badge, #f8fafc);
      border-radius: 10px;
      padding: 4px 12px;
      min-height: 36px;
      transition: all 0.2s ease;
      border: 1px solid var(--border-color, #e2e8f0);
    }

    .branch-selector:hover {
      background: var(--bg-hover, #f1f5f9);
      border-color: var(--border-color, #cbd5e1);
    }

    /* User display (no dropdown) */
    .user-display {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-badge, rgba(255,255,255,0.7));
      border-radius: 28px;
      padding: 3px 16px 3px 3px;
      min-height: 40px;
      max-height: 40px;
      margin-right: 8px;
      border: 1px solid var(--border-color, #e2e8f0);
      overflow: hidden;
      white-space: nowrap;
    }

    .user-avatar {
      width: 34px;
      height: 34px;
      min-width: 34px;
      border-radius: 50%;
      background: var(--accent-gradient, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
      color: #ffffff;
      flex-shrink: 0;
    }

    .user-name {
      font-weight: 600;
      font-size: 13px;
      color: var(--text-primary, #334155);
      max-width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1;
    }

    /* Settings / Logout icon buttons */
    .action-btn {
      color: var(--text-secondary, #475569);
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background: var(--bg-hover, #f1f5f9);
      color: var(--accent-primary, #667eea);
    }

    .theme-toggle:hover {
      background: var(--badge-warning-bg, #fef3c7);
      color: var(--warning, #d97706);
    }

    .logout-btn:hover {
      background: var(--badge-danger-bg, #fee2e2);
      color: var(--danger, #dc2626);
    }

    @media (max-width: 768px) {
      .user-name, .branch-selector span {
        display: none;
      }

      .hospital-name-container {
        max-width: calc(100% - 160px);
      }

      .hospital-name {
        font-size: 14px;
        padding: 4px 14px;
      }
    }

    @media (max-width: 480px) {
      .hospital-name-container {
        max-width: calc(100% - 100px);
      }

      .hospital-name {
        font-size: 13px;
        padding: 3px 12px;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() menuToggle = new EventEmitter<void>();

  currentUser: User | null = null;
  currentBranch: Branch | null = null;
  tenant: Tenant | null = null;
  branches: Branch[] = [];
  notifications: NotificationMessage[] = [];
  unreadCount = 0;
  isDark = false;
  hasAllLocationAccess = false;
  isAllLocationsMode = false;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private tenantService: TenantService,
    private permissions: PermissionService,
    private signalRService: SignalRService,
    private themeService: ThemeService,
    private router: Router,
    private storage: StorageService
  ) {
    effect(() => {
      this.applyPermissionContext(this.permissions.current());
    });
  }

  ngOnInit(): void {
    this.syncAllLocationsFlag();

    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.currentUser = user;
    });

    this.tenantService.currentTenant$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(tenant => {
      this.tenant = tenant;
    });

    this.tenantService.currentBranch$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(branch => {
      this.currentBranch = branch;
      this.syncAllLocationsFlag();
    });

    this.tenantService.branches$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(branches => {
      this.branches = branches;
    });

    this.signalRService.notification$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(notification => {
      this.notifications.unshift(notification);
      if (!notification.isRead) {
        this.unreadCount++;
      }
    });

    this.themeService.theme$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(theme => {
      this.isDark = theme === 'dark';
    });

    // Initial branch list load (permission context may arrive later).
    this.tenantService.loadBranches().subscribe({ error: () => {} });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get showLocationSelector(): boolean {
    return this.branches.length > 1 || (this.hasAllLocationAccess && this.branches.length > 0);
  }

  get currentLocationLabel(): string {
    if (this.isAllLocationsMode) return 'All Locations';
    return this.currentBranch?.name || 'Select Location';
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    const first = this.currentUser.firstName?.charAt(0) || '';
    const last = this.currentUser.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  }

  switchBranch(branch: Branch): void {
    if (this.isAllLocationsMode === false && this.currentBranch?.id === branch.id) return;

    this.authService.switchBranch(branch.id).subscribe({
      next: () => {
        this.tenantService.setCurrentBranch(branch);
        window.location.reload();
      },
      error: () => {
        // Keep current selection on failure.
      }
    });
  }

  switchToAllLocations(): void {
    if (this.isAllLocationsMode) return;

    this.authService.switchBranch('all').subscribe({
      next: () => {
        window.location.reload();
      },
      error: () => {}
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'info': 'info',
      'warning': 'warning',
      'error': 'error',
      'success': 'check_circle',
      'appointment': 'event',
      'admission': 'local_hospital',
      'billing': 'receipt'
    };
    return icons[type] || 'notifications';
  }

  markAllAsRead(event: Event): void {
    event.stopPropagation();
    this.notifications.forEach(n => n.isRead = true);
    this.unreadCount = 0;
  }

  logout(): void {
    this.authService.logout();
  }

  private applyPermissionContext(ctx: CurrentUserContext | null): void {
    this.hasAllLocationAccess = !!(ctx?.hasAllLocationAccess || ctx?.isSuperAdmin);
    this.syncAllLocationsFlag();

    if (ctx?.accessibleBranches?.length) {
      const mapped: Branch[] = ctx.accessibleBranches.map(b => ({
        id: b.branchId,
        name: b.branchName,
        code: '',
        address: '',
        phone: '',
        email: '',
        isActive: true
      }));
      this.branches = mapped;
      this.tenantService.setBranches(mapped);
    }

    // Never stamp a concrete branch while the user is in All Locations mode —
    // JWT still carries a write target, but storage must stay 'all'.
    const stored = this.getStoredBranchId();
    if (stored === 'all') {
      return;
    }

    if (stored) {
      const match = this.branches.find(b => b.id === stored);
      if (match && this.currentBranch?.id !== match.id) {
        this.tenantService.setCurrentBranch(match);
      }
      return;
    }

    if (ctx?.branchId) {
      const match = this.branches.find(b => b.id === ctx.branchId);
      if (match) this.tenantService.setCurrentBranch(match);
    }
  }

  private getStoredBranchId(): string | null {
    return this.storage.getItem<string>(environment.branchKey);
  }

  private syncAllLocationsFlag(): void {
    this.isAllLocationsMode = this.getStoredBranchId() === 'all';
  }
}