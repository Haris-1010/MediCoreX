import { Component, Output, EventEmitter, OnInit, OnDestroy, computed, signal, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavigationService, NavItem } from '../../core/services/navigation.service';
import { TenantService, Tenant } from '../../core/services/tenant.service';

@Component({
  standalone: false,
  selector: 'app-sidebar',
  template: `
    <div class="sidebar" [class.collapsed]="collapsed">
      <!-- Logo Section -->
      <div class="sidebar-header" routerLink="/dashboard" role="link" tabindex="0">
        <div class="logo-container">
          <div class="logo-icon">
            <img *ngIf="tenant?.logoUrl" [src]="tenant?.logoUrl" alt="logo" class="org-logo">
            <mat-icon *ngIf="!tenant?.logoUrl">local_hospital</mat-icon>
          </div>
          <div class="logo-text">
            <span class="brand">MediCoreX</span>
            <span class="org-name" *ngIf="tenant?.name">{{ tenant?.name }}</span>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="sidebar-search" [class.search-collapsed]="collapsed">
        <mat-icon class="search-icon">search</mat-icon>
        <input *ngIf="!collapsed" type="text"
           placeholder="Search"
           class="search-input"
           [ngModel]="searchQuery()"
           (ngModelChange)="searchQuery.set($event)">
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <ng-container *ngFor="let item of filteredMenuItems()">
          <!-- Simple menu item -->
          <a *ngIf="!item.children"
             class="nav-item"
             [routerLink]="item.route"
             routerLinkActive="active"
             [attr.title]="collapsed ? item.label : null"
             (click)="onItemClick()">
            <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
            <span class="nav-label">{{ item.label }}</span>
          </a>

          <!-- Menu item with children -->
          <div *ngIf="item.children" class="nav-group">
            <button class="nav-item nav-group-toggle" [attr.title]="collapsed ? item.label : null" (click)="toggleGroup(item)">
              <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
              <span class="nav-label">{{ item.label }}</span>
              <mat-icon class="toggle-icon" [class.expanded]="item.expanded">chevron_right</mat-icon>
            </button>
            <div class="nav-group-items" [class.expanded]="item.expanded && !collapsed">
              <!-- shown as a heading only inside the hover flyout (collapsed mode) -->
              <div *ngIf="collapsed" class="flyout-title">{{ item.label }}</div>
              <ng-container *ngFor="let child of item.children">
                <a class="nav-item nav-child"
                   [routerLink]="child.route"
                   routerLinkActive="active"
                   [attr.title]="collapsed ? child.label : null"
                   (click)="onItemClick()">
                  <mat-icon class="nav-icon child-icon">{{ child.icon }}</mat-icon>
                  <span class="nav-label">{{ child.label }}</span>
                </a>
              </ng-container>
            </div>
          </div>
        </ng-container>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <div class="version-badge">
          <span>v1.0.0</span>
        </div>
        <div class="copyright">&copy; 2026 MediCoreX</div>
      </div>
    </div>
  `,
  styles: [`

     :host {
    display: block;
    height: 100%;
    width: 100%;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bg-sidebar, #ffffff);
    color: var(--text-primary, #333333);
    overflow: hidden;
    transition: width 0.2s ease, background-color 0.3s ease, color 0.3s ease;
  }
     .sidebar.collapsed {
    overflow: visible;
  }

    .sidebar.collapsed {
      width: 72px;
    }

    /* Logo Section */
    .sidebar-header {
      padding: 1rem 1rem;
      border-bottom: 1px solid var(--border-color, #e0e0e0);
      cursor: pointer;
    }

    .sidebar-header:hover {
      background: var(--bg-hover, #f8f9ff);
    }

    .sidebar.collapsed .sidebar-header {
      padding: 1rem 0;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .sidebar.collapsed .logo-container {
      justify-content: center;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: var(--accent-gradient, linear-gradient(135deg, #1a237e 0%, #3f51b5 100%));
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: var(--text-inverse, white);
    }

    .org-logo {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      object-fit: contain;
      background: var(--bg-card, white);
      padding: 2px;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .brand {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--accent-primary, #1a237e);
      letter-spacing: 0.3px;
      line-height: 1.2;
    }

    .org-name {
      font-size: 0.75rem;
      color: var(--text-muted, #666);
      font-weight: 400;
      margin-top: 0.15rem;
    }

    /* Search */
    .sidebar-search {
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 1px solid var(--border-color, #e0e0e0);
      background: var(--bg-hover, #fafafa);
    }

    .sidebar.collapsed .sidebar-search {
      justify-content: center;
      padding-left: 0;
      padding-right: 0;
    }

    .sidebar.collapsed .logo-text,
    .sidebar.collapsed .nav-label,
    .sidebar.collapsed .toggle-icon,
    .sidebar.collapsed .sidebar-footer {
      display: none;
    }

    .search-icon {
      color: var(--text-muted, #666);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 0.875rem;
      color: var(--text-primary, #333);
      background: transparent;
      font-family: inherit;
    }

    .search-input::placeholder {
      color: var(--text-muted, #999);
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 0.5rem 0;
    }

    /* Collapsed rail: let the hover flyouts escape the scroll container */
    .sidebar.collapsed .sidebar-nav {
      overflow: visible;
    }

    .sidebar-nav::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar-nav::-webkit-scrollbar-track {
      background: transparent;
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb, #ccc);
      border-radius: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 1rem;
      color: var(--text-secondary, #444);
      text-decoration: none;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      border-left: 3px solid transparent;
    }

    .nav-item:hover {
      background: var(--bg-hover, #f0f0f0);
      color: var(--accent-primary, #1a237e);
    }

    .sidebar.collapsed .nav-item {
      justify-content: center;
      padding-left: 0;
      padding-right: 0;
      border-left-width: 0;
    }

    .nav-item.active {
      background: var(--bg-hover, #e8eaf6);
      color: var(--accent-primary, #1a237e);
      border-left-color: var(--accent-primary, #1a237e);
      font-weight: 600;
    }

    .nav-item.active .nav-icon {
      color: var(--accent-primary, #1a237e);
    }

    .nav-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--text-muted, #666);
    }

    .nav-item.active .nav-icon,
    .nav-item:hover .nav-icon {
      color: var(--accent-primary, #1a237e);
    }

    .nav-label {
      font-size: 0.875rem;
      font-weight: 500;
      letter-spacing: 0.2px;
    }

    /* Group Toggle */
    .nav-group-toggle {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .toggle-icon {
      margin-left: auto;
      transition: transform 0.2s ease;
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--text-muted, #999);
    }

    .toggle-icon.expanded {
      transform: rotate(90deg);
    }

    /* Group Items (expanded, non-collapsed mode) */
    .nav-group {
      position: relative;
    }

    .nav-group-items {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .nav-group-items.expanded {
      max-height: 500px;
    }

    .nav-child {
      padding-left: 3rem;
      font-size: 0.8rem;
    }

    .child-icon {
      font-size: 16px !important;
      width: 16px !important;
      height: 16px !important;
    }

    /* --- Collapsed rail: hover flyout submenu --- */
    .sidebar.collapsed .nav-group-items {
      display: block;
      position: absolute;
      top: 0;
      left: 100%;
      margin-left: 8px;
      min-width: 220px;
      max-height: none;
      overflow: visible;
      background: var(--bg-sidebar, #ffffff);
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 8px;
      box-shadow: var(--shadow-lg, 6px 6px 24px rgba(0,0,0,0.14));
      padding: 0.5rem 0;
      opacity: 0;
      visibility: hidden;
      transform: translateX(-6px);
      transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
      z-index: 1200;
    }
 .sidebar.collapsed .nav-group-items .nav-item {
    justify-content: flex-start;
    padding-left: 1rem;
    padding-right: 1rem;
    text-align: left;
  }

  .sidebar.collapsed .nav-group:hover .nav-group-items,
  .sidebar.collapsed .nav-group:focus-within .nav-group-items {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
  }

  .sidebar.collapsed .nav-group-items .nav-label {
    display: inline-block;
  }

  .sidebar.collapsed .nav-child {
    padding-left: 1rem;
  }
    .sidebar.collapsed .nav-group:hover .nav-group-items,
    .sidebar.collapsed .nav-group:focus-within .nav-group-items {
      opacity: 1;
      visibility: visible;
      transform: translateX(0);
    }

    .sidebar.collapsed .nav-group-items .nav-label {
      display: inline-block;
    }

    .sidebar.collapsed .nav-child {
      padding-left: 1rem;
    }

    .flyout-title {
      display: none;
      padding: 0.35rem 1rem 0.5rem;
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--accent-primary, #1a237e);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--border-color, #f0f0f0);
      margin-bottom: 0.25rem;
      white-space: nowrap;
    }

    .sidebar.collapsed .flyout-title {
      display: block;
    }

    /* Footer */
    .sidebar-footer {
      padding: 0.75rem 1rem;
      border-top: 1px solid var(--border-color, #e0e0e0);
      text-align: center;
      background: var(--bg-hover, #fafafa);
    }

    .version-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: var(--bg-badge, #e8eaf6);
      padding: 0.25rem 0.6rem;
      border-radius: 12px;
      font-size: 0.65rem;
      color: var(--accent-primary, #1a237e);
      margin-bottom: 0.35rem;
      font-weight: 500;
    }

    .copyright {
      font-size: 0.65rem;
      color: var(--text-muted, #888);
    }
  `]
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Output() menuItemClick = new EventEmitter<void>();
  @Input() collapsed = false;

  tenant: Tenant | null = null;
  searchQuery = signal('');
  filteredMenuItems = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const menu = this.navigation.menu();

    if (!query) return menu;

    const results: NavItem[] = [];
    for (const item of menu) {
      if (item.children) {
        const matchedChildren = item.children.filter(c => c.label.toLowerCase().includes(query));
        if (matchedChildren.length > 0) {
          results.push({ ...item, children: matchedChildren, expanded: true });
        } else if (item.label.toLowerCase().includes(query)) {
          results.push({ ...item, expanded: true });
        }
      } else if (item.label.toLowerCase().includes(query)) {
        results.push(item);
      }
    }
    return results;
  });
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private navigation: NavigationService,
    private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.expandActiveGroup();
    });

    this.expandActiveGroup();

    this.tenantService.loadTenant().subscribe(tenant => this.tenant = tenant);

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleGroup(item: NavItem): void {
    // In collapsed (rail) mode, visibility is handled purely by CSS hover.
    if (this.collapsed) return;
    item.expanded = !item.expanded;
  }

  onItemClick(): void {
    this.menuItemClick.emit();
  }

  private expandActiveGroup(): void {
    const currentUrl = this.router.url;
    this.navigation.menu().forEach(item => {
      if (item.children) {
        item.expanded = item.children.some(child =>
          child.route && currentUrl.startsWith(child.route)
        );
      }
    });
  }
}