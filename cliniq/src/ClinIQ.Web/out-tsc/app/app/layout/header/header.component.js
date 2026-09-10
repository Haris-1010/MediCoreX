import { Component, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/auth.service";
import * as i2 from "../../core/services/tenant.service";
import * as i3 from "../../core/services/signalr.service";
import * as i4 from "@angular/router";
import * as i5 from "@angular/common";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/material/menu";
import * as i9 from "@angular/material/toolbar";
import * as i10 from "@angular/material/list";
import * as i11 from "@angular/material/badge";
import * as i12 from "../../shared/pipes/time-ago.pipe";
function HeaderComponent_button_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 24)(1, "mat-icon");
    i0.ɵɵtext(2, "business");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "mat-icon");
    i0.ɵɵtext(6, "arrow_drop_down");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    const branchMenu_r3 = i0.ɵɵreference(9);
    i0.ɵɵproperty("matMenuTriggerFor", branchMenu_r3);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate((ctx_r1.currentBranch == null ? null : ctx_r1.currentBranch.name) || "Select Branch");
} }
function HeaderComponent_button_10_mat_icon_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-icon");
    i0.ɵɵtext(1, "check");
    i0.ɵɵelementEnd();
} }
function HeaderComponent_button_10_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 23);
    i0.ɵɵlistener("click", function HeaderComponent_button_10_Template_button_click_0_listener() { const branch_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.switchBranch(branch_r5)); });
    i0.ɵɵtemplate(1, HeaderComponent_button_10_mat_icon_1_Template, 2, 0, "mat-icon", 25);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const branch_r5 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", branch_r5.id === (ctx_r1.currentBranch == null ? null : ctx_r1.currentBranch.id));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(branch_r5.name);
} }
function HeaderComponent_button_19_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 26);
    i0.ɵɵlistener("click", function HeaderComponent_button_19_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.markAllAsRead($event)); });
    i0.ɵɵtext(1, " Mark all read ");
    i0.ɵɵelementEnd();
} }
function HeaderComponent_ng_container_21_button_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 28)(1, "mat-icon");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 29)(4, "span", 30);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 31);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "span", 32);
    i0.ɵɵtext(9);
    i0.ɵɵpipe(10, "timeAgo");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const notification_r7 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("unread", !notification_r7.isRead);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.getNotificationIcon(notification_r7.type));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(notification_r7.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(notification_r7.message);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(10, 6, notification_r7.createdAt));
} }
function HeaderComponent_ng_container_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, HeaderComponent_ng_container_21_button_1_Template, 11, 8, "button", 27);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.notifications);
} }
function HeaderComponent_ng_template_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 33)(1, "mat-icon");
    i0.ɵɵtext(2, "notifications_none");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "No notifications");
    i0.ɵɵelementEnd()();
} }
export class HeaderComponent {
    constructor(authService, tenantService, signalRService, router) {
        this.authService = authService;
        this.tenantService = tenantService;
        this.signalRService = signalRService;
        this.router = router;
        this.menuToggle = new EventEmitter();
        this.currentUser = null;
        this.currentBranch = null;
        this.branches = [];
        this.notifications = [];
        this.unreadCount = 0;
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
            this.currentUser = user;
        });
        this.tenantService.currentBranch$.pipe(takeUntil(this.destroy$)).subscribe(branch => {
            this.currentBranch = branch;
        });
        this.tenantService.branches$.pipe(takeUntil(this.destroy$)).subscribe(branches => {
            this.branches = branches;
        });
        this.signalRService.notification$.pipe(takeUntil(this.destroy$)).subscribe(notification => {
            this.notifications.unshift(notification);
            if (!notification.isRead) {
                this.unreadCount++;
            }
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    getUserInitials() {
        if (!this.currentUser)
            return '';
        const first = this.currentUser.firstName?.charAt(0) || '';
        const last = this.currentUser.lastName?.charAt(0) || '';
        return (first + last).toUpperCase();
    }
    switchBranch(branch) {
        this.authService.switchBranch(branch.id).subscribe(() => {
            this.tenantService.setCurrentBranch(branch);
            window.location.reload();
        });
    }
    getNotificationIcon(type) {
        const icons = {
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
    markAllAsRead(event) {
        event.stopPropagation();
        this.notifications.forEach(n => n.isRead = true);
        this.unreadCount = 0;
    }
    logout() {
        this.authService.logout();
    }
    static { this.ɵfac = function HeaderComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || HeaderComponent)(i0.ɵɵdirectiveInject(i1.AuthService), i0.ɵɵdirectiveInject(i2.TenantService), i0.ɵɵdirectiveInject(i3.SignalRService), i0.ɵɵdirectiveInject(i4.Router)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: HeaderComponent, selectors: [["app-header"]], outputs: { menuToggle: "menuToggle" }, standalone: false, decls: 58, vars: 15, consts: [["branchMenu", "matMenu"], ["notificationMenu", "matMenu"], ["noNotifications", ""], ["userMenu", "matMenu"], ["color", "primary", 1, "header-toolbar"], ["mat-icon-button", "", 3, "click"], [1, "brand"], [1, "spacer"], ["mat-button", "", "class", "branch-selector", 3, "matMenuTriggerFor", 4, "ngIf"], ["mat-menu-item", "", 3, "click", 4, "ngFor", "ngForOf"], ["mat-icon-button", "", 1, "notification-btn", 3, "matMenuTriggerFor"], ["matBadgeColor", "warn", 3, "matBadge", "matBadgeHidden"], [1, "notification-menu"], [1, "notification-header"], ["mat-button", "", "color", "primary", 3, "click", 4, "ngIf"], [4, "ngIf", "ngIfElse"], ["mat-menu-item", "", "routerLink", "/notifications", 1, "view-all"], ["mat-button", "", 1, "user-menu-btn", 3, "matMenuTriggerFor"], [1, "user-avatar"], [1, "user-name"], ["mat-menu-item", "", "disabled", "", 1, "user-info"], ["mat-menu-item", "", "routerLink", "/profile"], ["mat-menu-item", "", "routerLink", "/settings"], ["mat-menu-item", "", 3, "click"], ["mat-button", "", 1, "branch-selector", 3, "matMenuTriggerFor"], [4, "ngIf"], ["mat-button", "", "color", "primary", 3, "click"], ["mat-menu-item", "", 3, "unread", 4, "ngFor", "ngForOf"], ["mat-menu-item", ""], [1, "notification-content"], [1, "notification-title"], [1, "notification-message"], [1, "notification-time"], [1, "no-notifications"]], template: function HeaderComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "mat-toolbar", 4)(1, "button", 5);
            i0.ɵɵlistener("click", function HeaderComponent_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.menuToggle.emit()); });
            i0.ɵɵelementStart(2, "mat-icon");
            i0.ɵɵtext(3, "menu");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(4, "span", 6);
            i0.ɵɵtext(5, "ClinIQ");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(6, "span", 7);
            i0.ɵɵtemplate(7, HeaderComponent_button_7_Template, 7, 2, "button", 8);
            i0.ɵɵelementStart(8, "mat-menu", null, 0);
            i0.ɵɵtemplate(10, HeaderComponent_button_10_Template, 4, 2, "button", 9);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "button", 10)(12, "mat-icon", 11);
            i0.ɵɵtext(13, " notifications ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(14, "mat-menu", 12, 1)(16, "div", 13)(17, "span");
            i0.ɵɵtext(18, "Notifications");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(19, HeaderComponent_button_19_Template, 2, 0, "button", 14);
            i0.ɵɵelementEnd();
            i0.ɵɵelement(20, "mat-divider");
            i0.ɵɵtemplate(21, HeaderComponent_ng_container_21_Template, 2, 1, "ng-container", 15)(22, HeaderComponent_ng_template_22_Template, 5, 0, "ng-template", null, 2, i0.ɵɵtemplateRefExtractor);
            i0.ɵɵelement(24, "mat-divider");
            i0.ɵɵelementStart(25, "button", 16);
            i0.ɵɵtext(26, " View all notifications ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(27, "button", 17)(28, "div", 18);
            i0.ɵɵtext(29);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "span", 19);
            i0.ɵɵtext(31);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(32, "mat-icon");
            i0.ɵɵtext(33, "arrow_drop_down");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(34, "mat-menu", null, 3)(36, "div", 20)(37, "strong");
            i0.ɵɵtext(38);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "small");
            i0.ɵɵtext(40);
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(41, "mat-divider");
            i0.ɵɵelementStart(42, "button", 21)(43, "mat-icon");
            i0.ɵɵtext(44, "person");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(45, "span");
            i0.ɵɵtext(46, "My Profile");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(47, "button", 22)(48, "mat-icon");
            i0.ɵɵtext(49, "settings");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(50, "span");
            i0.ɵɵtext(51, "Settings");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(52, "mat-divider");
            i0.ɵɵelementStart(53, "button", 23);
            i0.ɵɵlistener("click", function HeaderComponent_Template_button_click_53_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.logout()); });
            i0.ɵɵelementStart(54, "mat-icon");
            i0.ɵɵtext(55, "exit_to_app");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(56, "span");
            i0.ɵɵtext(57, "Logout");
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            const notificationMenu_r8 = i0.ɵɵreference(15);
            const noNotifications_r9 = i0.ɵɵreference(23);
            const userMenu_r10 = i0.ɵɵreference(35);
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("ngIf", ctx.branches.length > 1);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngForOf", ctx.branches);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matMenuTriggerFor", notificationMenu_r8);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matBadge", ctx.unreadCount)("matBadgeHidden", ctx.unreadCount === 0);
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("ngIf", ctx.unreadCount > 0);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.notifications.length > 0)("ngIfElse", noNotifications_r9);
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("matMenuTriggerFor", userMenu_r10);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" ", ctx.getUserInitials(), " ");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate2("", ctx.currentUser == null ? null : ctx.currentUser.firstName, " ", ctx.currentUser == null ? null : ctx.currentUser.lastName, "");
            i0.ɵɵadvance(7);
            i0.ɵɵtextInterpolate2("", ctx.currentUser == null ? null : ctx.currentUser.firstName, " ", ctx.currentUser == null ? null : ctx.currentUser.lastName, "");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.currentUser == null ? null : ctx.currentUser.email);
        } }, dependencies: [i5.NgForOf, i5.NgIf, i4.RouterLink, i6.MatButton, i6.MatIconButton, i7.MatIcon, i8.MatMenu, i8.MatMenuItem, i8.MatMenuTrigger, i9.MatToolbar, i10.MatDivider, i11.MatBadge, i12.TimeAgoPipe], styles: [".header-toolbar[_ngcontent-%COMP%] {\n      position: fixed;\n      top: 0;\n      left: 0;\n      right: 0;\n      z-index: 1000;\n    }\n\n    .brand[_ngcontent-%COMP%] {\n      font-size: 1.25rem;\n      font-weight: 600;\n      margin-left: 0.5rem;\n    }\n\n    .spacer[_ngcontent-%COMP%] {\n      flex: 1;\n    }\n\n    .branch-selector[_ngcontent-%COMP%] {\n      margin-right: 1rem;\n    }\n\n    .user-menu-btn[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n    }\n\n    .user-avatar[_ngcontent-%COMP%] {\n      width: 32px;\n      height: 32px;\n      border-radius: 50%;\n      background: rgba(255, 255, 255, 0.2);\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-size: 0.875rem;\n      font-weight: 500;\n    }\n\n    .user-name[_ngcontent-%COMP%] {\n      max-width: 150px;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n    }\n\n    .user-info[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      padding: 0.5rem 1rem;\n    }\n\n    .user-info[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n      color: #666;\n      font-size: 0.75rem;\n    }\n\n    .notification-header[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      padding: 0.5rem 1rem;\n      font-weight: 500;\n    }\n\n    .notification-content[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n    }\n\n    .notification-title[_ngcontent-%COMP%] {\n      font-weight: 500;\n    }\n\n    .notification-message[_ngcontent-%COMP%] {\n      font-size: 0.75rem;\n      color: #666;\n    }\n\n    .notification-time[_ngcontent-%COMP%] {\n      font-size: 0.625rem;\n      color: #999;\n    }\n\n    .unread[_ngcontent-%COMP%] {\n      background: #e3f2fd;\n    }\n\n    .no-notifications[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      padding: 2rem;\n      color: #666;\n    }\n\n    .view-all[_ngcontent-%COMP%] {\n      text-align: center;\n      color: #3f51b5;\n    }\n\n    @media (max-width: 768px) {\n      .user-name[_ngcontent-%COMP%], .branch-selector[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n        display: none;\n      }\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(HeaderComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-header', template: `
    <mat-toolbar class="header-toolbar" color="primary">
      <button mat-icon-button (click)="menuToggle.emit()">
        <mat-icon>menu</mat-icon>
      </button>

      <span class="brand">ClinIQ</span>
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

      <!-- Notifications -->
      <button mat-icon-button [matMenuTriggerFor]="notificationMenu" class="notification-btn">
        <mat-icon [matBadge]="unreadCount" [matBadgeHidden]="unreadCount === 0" matBadgeColor="warn">
          notifications
        </mat-icon>
      </button>
      <mat-menu #notificationMenu="matMenu" class="notification-menu">
        <div class="notification-header">
          <span>Notifications</span>
          <button mat-button color="primary" *ngIf="unreadCount > 0" (click)="markAllAsRead($event)">
            Mark all read
          </button>
        </div>
        <mat-divider></mat-divider>
        <ng-container *ngIf="notifications.length > 0; else noNotifications">
          <button mat-menu-item *ngFor="let notification of notifications" [class.unread]="!notification.isRead">
            <mat-icon>{{ getNotificationIcon(notification.type) }}</mat-icon>
            <div class="notification-content">
              <span class="notification-title">{{ notification.title }}</span>
              <span class="notification-message">{{ notification.message }}</span>
              <span class="notification-time">{{ notification.createdAt | timeAgo }}</span>
            </div>
          </button>
        </ng-container>
        <ng-template #noNotifications>
          <div class="no-notifications">
            <mat-icon>notifications_none</mat-icon>
            <span>No notifications</span>
          </div>
        </ng-template>
        <mat-divider></mat-divider>
        <button mat-menu-item routerLink="/notifications" class="view-all">
          View all notifications
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
  `, styles: ["\n    .header-toolbar {\n      position: fixed;\n      top: 0;\n      left: 0;\n      right: 0;\n      z-index: 1000;\n    }\n\n    .brand {\n      font-size: 1.25rem;\n      font-weight: 600;\n      margin-left: 0.5rem;\n    }\n\n    .spacer {\n      flex: 1;\n    }\n\n    .branch-selector {\n      margin-right: 1rem;\n    }\n\n    .user-menu-btn {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n    }\n\n    .user-avatar {\n      width: 32px;\n      height: 32px;\n      border-radius: 50%;\n      background: rgba(255, 255, 255, 0.2);\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-size: 0.875rem;\n      font-weight: 500;\n    }\n\n    .user-name {\n      max-width: 150px;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n    }\n\n    .user-info {\n      display: flex;\n      flex-direction: column;\n      padding: 0.5rem 1rem;\n    }\n\n    .user-info small {\n      color: #666;\n      font-size: 0.75rem;\n    }\n\n    .notification-header {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      padding: 0.5rem 1rem;\n      font-weight: 500;\n    }\n\n    .notification-content {\n      display: flex;\n      flex-direction: column;\n    }\n\n    .notification-title {\n      font-weight: 500;\n    }\n\n    .notification-message {\n      font-size: 0.75rem;\n      color: #666;\n    }\n\n    .notification-time {\n      font-size: 0.625rem;\n      color: #999;\n    }\n\n    .unread {\n      background: #e3f2fd;\n    }\n\n    .no-notifications {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      padding: 2rem;\n      color: #666;\n    }\n\n    .view-all {\n      text-align: center;\n      color: #3f51b5;\n    }\n\n    @media (max-width: 768px) {\n      .user-name, .branch-selector span {\n        display: none;\n      }\n    }\n  "] }]
    }], () => [{ type: i1.AuthService }, { type: i2.TenantService }, { type: i3.SignalRService }, { type: i4.Router }], { menuToggle: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(HeaderComponent, { className: "HeaderComponent", filePath: "app/layout/header/header.component.ts", lineNumber: 210 }); })();
//# sourceMappingURL=header.component.js.map