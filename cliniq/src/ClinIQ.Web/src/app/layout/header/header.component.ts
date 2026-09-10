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
      <button mat-icon-button (click)="menuToggle.emit()">
        <mat-icon>menu</mat-icon>
      </button>

      <span class="spacer"></span>

      <!-- Shortcuts -->
      <button mat-button [matMenuTriggerFor]="shortcutsMenu" class="shortcuts-btn">
        <span>Shortcuts</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>
      <mat-menu #shortcutsMenu="matMenu">
        <button mat-menu-item routerLink="/dashboard">
          <mat-icon>dashboard</mat-icon>
          <span>Dashboard</span>
        </button>
        <button mat-menu-item routerLink="/patients">
          <mat-icon>people</mat-icon>
          <span>Patients</span>
        </button>
        <button mat-menu-item routerLink="/appointments">
          <mat-icon>event</mat-icon>
          <span>Appointments</span>
        </button>
      </mat-menu>

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

      <!-- User Menu -->
      <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-btn">
        <div class="user-avatar">
          {{ getUserInitials() }}
        </div>
        <span class="user-name">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>
      <mat-menu #userMenu="matMenu">
        <div class="user-info" mat-menu-item disabled>
          <strong>{{ currentUser?.firstName }} {{ currentUser?.lastName }}</strong>
          <small>{{ currentUser?.email }}</small>
        </div>
        <mat-divider></mat-divider>
        <button mat-menu-item routerLink="/profile">
          <mat-icon>person</mat-icon>
          <span>My Profile</span>
        </button>
        <button mat-menu-item routerLink="/settings">
          <mat-icon>settings</mat-icon>
          <span>Settings</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>

    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: white;
      color: #333;
      border-bottom: 1px solid #e0e0e0;
    }

    .brand {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1a237e;
      display: block;
    }

    .brand-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .org-name {
      font-size: 0.65rem;
      color: #666;
      font-weight: 400;
      margin-top: 0.1rem;
    }

    .spacer {
      flex: 1;
    }

    .shortcuts-btn {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      margin: 0;
      color: #1a237e;
      background: #e8eaf6;
      border: 1px solid #9fa8da;
      font-weight: 500;
    }

    .shortcuts-btn:hover {
      background: #c5cae9;
    }

    .branch-selector {
      margin-right: 1rem;
    }

    .notification-btn {
      margin-right: 0.5rem;
    }

    .user-menu-btn {
      display: flex;
      align-items: center;
      width: 180px;
      min-width: 180px;
      gap: 0.5rem;
      justify-content: flex-start;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 500;
      color: white;
    }

    .user-name {
      flex: 1;
      width: 100px;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #333;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      padding: 0.5rem 1rem;
    }

    .user-info small {
      color: #666;
      font-size: 0.75rem;
    }

    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      font-weight: 500;
    }

    .notification-content {
      display: flex;
      flex-direction: column;
    }

    .notification-title {
      font-weight: 500;
    }

    .notification-message {
      font-size: 0.75rem;
      color: #666;
    }

    .notification-time {
      font-size: 0.625rem;
      color: #999;
    }

    .unread {
      background: #e3f2fd;
    }

    .no-notifications {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      color: #666;
    }

    .view-all {
      text-align: center;
      color: #3f51b5;
    }

    .settings-btn {
      color: #666;
    }

    @media (max-width: 768px) {
      .user-name, .branch-selector span, .sms-credit, .shortcuts-btn {
        display: none;
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
