import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-platform-layout',
  template: `
    <div class="platform-shell">
      <aside class="platform-sidebar">
        <div class="brand">
          <mat-icon>admin_panel_settings</mat-icon>
          <div>
            <strong>MediCoreX Platform</strong>
            <small>Operations</small>
          </div>
        </div>

        <nav class="side-nav">
          <a routerLink="/platform/organizations"
             routerLinkActive="active"
             [routerLinkActiveOptions]="{ exact: true }">
            <mat-icon>corporate_fare</mat-icon>
            Organizations
          </a>
          <a routerLink="/platform/organizations/new"
             routerLinkActive="active">
            <mat-icon>add_business</mat-icon>
            New Organization
          </a>
          <a routerLink="/platform/admins"
             routerLinkActive="active">
            <mat-icon>shield_person</mat-icon>
            Platform Admins
          </a>
          <a routerLink="/platform/roles"
             routerLinkActive="active">
            <mat-icon>admin_panel_settings</mat-icon>
            Roles
          </a>
          <a routerLink="/platform/user-permissions"
             routerLinkActive="active">
            <mat-icon>lock</mat-icon>
            User Permissions
          </a>
        </nav>

        <div class="sidebar-foot">
          <span class="current-user">
            <mat-icon>account_circle</mat-icon>
            {{ currentUser?.firstName }} {{ currentUser?.lastName }}
          </span>
          <button mat-stroked-button (click)="logout()">
            <mat-icon>logout</mat-icon>
            Sign out
          </button>
        </div>
      </aside>

      <main class="platform-main">
        <div class="topbar">
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .platform-shell { display: flex; min-height: 100vh; background: var(--bg-primary, #f4f7f7); color: var(--text-primary, #172033); }
    .platform-sidebar { width: 260px; background: var(--bg-sidebar, #102b35); color: white; display: flex; flex-direction: column; flex-shrink: 0; }
    .brand { display: flex; align-items: center; gap: 12px; padding: 24px 20px; border-bottom: 1px solid rgba(255,255,255,.1); }
    .brand mat-icon { color: #f0b35b; font-size: 30px; width: 30px; height: 30px; }
    .brand strong { display: block; font-size: 16px; }
    .brand small { color: rgba(255,255,255,.55); font-size: 11px; text-transform: uppercase; letter-spacing: .06em; }
    .side-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
    .side-nav a { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 8px; color: rgba(255,255,255,.72); text-decoration: none; font-size: 14px; font-weight: 500; transition: .15s; }
    .side-nav a:hover { background: rgba(255,255,255,.08); color: white; }
    .side-nav a.active { background: rgba(240,179,91,.16); color: #f0b35b; }
    .sidebar-foot { padding: 16px 20px; border-top: 1px solid rgba(255,255,255,.1); display: flex; flex-direction: column; gap: 12px; }
    .current-user { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,.7); font-size: 13px; }
    .sidebar-foot button { color: white; border-color: rgba(255,255,255,.3); }
    .platform-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .topbar { background: var(--bg-sidebar, #102b35); color: white; padding: 22px 5vw; }
    .topbar h1 { margin: 0; font-size: 24px; }
    .content { width: min(1180px, 94vw); margin: 28px auto; }
    @media (max-width: 760px) {
      .platform-shell { flex-direction: column; }
      .platform-sidebar { width: 100%; }
      .side-nav { flex-direction: row; overflow-x: auto; }
    }
  `]
})
export class PlatformLayoutComponent implements OnInit {
  currentUser: any;
  pageTitle = 'Organizations';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const url = this.router.url;
      if (url.includes('organizations/new')) this.pageTitle = 'New Organization';
      else if (url.includes('organizations/')) this.pageTitle = 'Organization Details';
      else if (url.includes('admins')) this.pageTitle = 'Platform Admins';
      else if (url.includes('roles')) this.pageTitle = 'Role Management';
      else if (url.includes('user-permissions')) this.pageTitle = 'User Permissions';
      else this.pageTitle = 'Organizations';
    });
  }

  logout(): void {
    this.auth.logout();
  }
}