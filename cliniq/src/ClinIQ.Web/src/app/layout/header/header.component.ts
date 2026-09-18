import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService, User } from '../../core/services/auth.service';
import { TenantService, Tenant, Branch } from '../../core/services/tenant.service';
import { SignalRService, NotificationMessage } from '../../core/services/signalr.service';

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

      <!-- Branch Selector -->
      <button mat-button [matMenuTriggerFor]="branchMenu" class="branch-selector" *ngIf="branches.length > 1">
        <mat-icon>business</mat-icon>
        <span>{{ currentBranch?.name || 'Select Branch' }}</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>
      <mat-menu #branchMenu="matMenu">
        <button mat-menu-item *ngFor="let branch of branches" (click)="switchBranch(branch)">
          <mat-icon *ngIf="branch.id === currentBranch?.id">check</mat-icon>
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
      background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
      color: #1e293b;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(102,126,234,0.08);
      padding: 0 16px;
      height: 64px;
      display: flex;
      align-items: center;
      gap: 4px;
      border-bottom: 1px solid rgba(102,126,234,0.1);
    }

    .menu-btn {
      color: #475569;
      margin-right: 8px;
      transition: all 0.2s ease;
    }

    .menu-btn:hover {
      background: #f1f5f9;
      color: #667eea;
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
      color: #475569;
      margin-right: 16px;
      background: #f8fafc;
      border-radius: 10px;
      padding: 4px 12px;
      min-height: 36px;
      transition: all 0.2s ease;
      border: 1px solid #e2e8f0;
    }

    .branch-selector:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    /* User display (no dropdown) */
    .user-display {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(255,255,255,0.7);
      border-radius: 28px;
      padding: 3px 16px 3px 3px;
      min-height: 40px;
      max-height: 40px;
      margin-right: 8px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      white-space: nowrap;
    }

    .user-avatar {
      width: 34px;
      height: 34px;
      min-width: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
      color: #334155;
      max-width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1;
    }

    /* Settings / Logout icon buttons */
    .action-btn {
      color: #475569;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background: #f1f5f9;
      color: #667eea;
    }

    .logout-btn:hover {
      background: #fee2e2;
      color: #dc2626;
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

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private tenantService: TenantService,
    private signalRService: SignalRService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    const first = this.currentUser.firstName?.charAt(0) || '';
    const last = this.currentUser.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  }

  switchBranch(branch: Branch): void {
    this.authService.switchBranch(branch.id).subscribe(() => {
      this.tenantService.setCurrentBranch(branch);
      window.location.reload();
    });
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
}