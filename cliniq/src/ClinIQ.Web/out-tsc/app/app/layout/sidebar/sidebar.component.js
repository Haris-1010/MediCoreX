import { Component, Output, EventEmitter } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../../core/services/auth.service";
import * as i3 from "@angular/common";
import * as i4 from "@angular/material/icon";
function SidebarComponent_ng_container_12_ng_container_1_a_1_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "a", 15);
    i0.ɵɵlistener("click", function SidebarComponent_ng_container_12_ng_container_1_a_1_Template_a_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onItemClick()); });
    i0.ɵɵelementStart(1, "mat-icon", 16);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 17);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r3 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵproperty("routerLink", item_r3.route);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r3.icon);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r3.label);
} }
function SidebarComponent_ng_container_12_ng_container_1_div_2_ng_container_9_a_1_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "a", 23);
    i0.ɵɵlistener("click", function SidebarComponent_ng_container_12_ng_container_1_div_2_ng_container_9_a_1_Template_a_click_0_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r1.onItemClick()); });
    i0.ɵɵelementStart(1, "mat-icon", 24);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 17);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const child_r6 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("routerLink", child_r6.route);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(child_r6.icon);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(child_r6.label);
} }
function SidebarComponent_ng_container_12_ng_container_1_div_2_ng_container_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, SidebarComponent_ng_container_12_ng_container_1_div_2_ng_container_9_a_1_Template, 5, 3, "a", 22);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const child_r6 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !child_r6.permission || ctx_r1.hasPermission(child_r6.permission));
} }
function SidebarComponent_ng_container_12_ng_container_1_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 18)(1, "button", 19);
    i0.ɵɵlistener("click", function SidebarComponent_ng_container_12_ng_container_1_div_2_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r4); const item_r3 = i0.ɵɵnextContext(2).$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleGroup(item_r3)); });
    i0.ɵɵelementStart(2, "mat-icon", 16);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 17);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "mat-icon", 20);
    i0.ɵɵtext(7, "expand_more");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 21);
    i0.ɵɵtemplate(9, SidebarComponent_ng_container_12_ng_container_1_div_2_ng_container_9_Template, 2, 1, "ng-container", 8);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r3 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r3.icon);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r3.label);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("expanded", item_r3.expanded);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("expanded", item_r3.expanded);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", item_r3.children);
} }
function SidebarComponent_ng_container_12_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, SidebarComponent_ng_container_12_ng_container_1_a_1_Template, 5, 3, "a", 13)(2, SidebarComponent_ng_container_12_ng_container_1_div_2_Template, 10, 7, "div", 14);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const item_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !item_r3.children);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", item_r3.children);
} }
function SidebarComponent_ng_container_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, SidebarComponent_ng_container_12_ng_container_1_Template, 3, 2, "ng-container", 12);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !item_r3.permission || ctx_r1.hasPermission(item_r3.permission));
} }
export class SidebarComponent {
    constructor(router, authService) {
        this.router = router;
        this.authService = authService;
        this.menuItemClick = new EventEmitter();
        this.menuItems = [
            {
                label: 'Dashboard',
                icon: 'dashboard',
                route: '/dashboard'
            },
            {
                label: 'Patients',
                icon: 'people',
                route: '/patients',
                permission: 'Patients.View'
            },
            {
                label: 'Appointments',
                icon: 'event',
                route: '/appointments',
                permission: 'Appointments.View'
            },
            {
                label: 'Clinical',
                icon: 'medical_services',
                permission: 'OPD.View',
                children: [
                    { label: 'OPD', icon: 'person', route: '/opd', permission: 'OPD.View' },
                    { label: 'IPD', icon: 'local_hospital', route: '/ipd', permission: 'IPD.View' },
                    { label: 'Emergency', icon: 'emergency', route: '/emergency', permission: 'Emergency.View' }
                ]
            },
            {
                label: 'Diagnostics',
                icon: 'biotech',
                children: [
                    { label: 'Laboratory', icon: 'science', route: '/laboratory', permission: 'Laboratory.View' },
                    { label: 'Radiology', icon: 'medical_information', route: '/radiology', permission: 'Radiology.View' }
                ]
            },
            {
                label: 'Pharmacy',
                icon: 'local_pharmacy',
                route: '/pharmacy',
                permission: 'Pharmacy.View'
            },
            {
                label: 'Billing',
                icon: 'receipt_long',
                route: '/billing',
                permission: 'Billing.View'
            },
            {
                label: 'Inventory',
                icon: 'inventory_2',
                route: '/inventory',
                permission: 'Inventory.View'
            },
            {
                label: 'Administration',
                icon: 'badge',
                children: [
                    { label: 'Departments', icon: 'business', route: '/departments', permission: 'Departments.View' },
                    { label: 'Doctors', icon: 'local_hospital', route: '/doctors', permission: 'Doctors.View' },
                    { label: 'Staff', icon: 'people', route: '/staff', permission: 'Staff.View' }
                ]
            },
            {
                label: 'Facility',
                icon: 'apartment',
                permission: 'Facility.View',
                children: [
                    { label: 'Overview', icon: 'dashboard', route: '/facility', permission: 'Facility.View' },
                    { label: 'Buildings', icon: 'apartment', route: '/facility/buildings', permission: 'Facility.View' },
                    { label: 'Wards', icon: 'hotel', route: '/wards', permission: 'Facility.View' }
                ]
            },
            {
                label: 'Reports',
                icon: 'assessment',
                route: '/reports',
                permission: 'Reports.View'
            },
            {
                label: 'Settings',
                icon: 'settings',
                route: '/settings',
                permission: 'Settings.View'
            }
        ];
    }
    ngOnInit() {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
            this.expandActiveGroup();
        });
        this.expandActiveGroup();
    }
    hasPermission(permission) {
        return this.authService.hasPermission(permission);
    }
    toggleGroup(item) {
        item.expanded = !item.expanded;
    }
    onItemClick() {
        this.menuItemClick.emit();
    }
    expandActiveGroup() {
        const currentUrl = this.router.url;
        this.menuItems.forEach(item => {
            if (item.children) {
                item.expanded = item.children.some(child => child.route && currentUrl.startsWith(child.route));
            }
        });
    }
    static { this.ɵfac = function SidebarComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SidebarComponent)(i0.ɵɵdirectiveInject(i1.Router), i0.ɵɵdirectiveInject(i2.AuthService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SidebarComponent, selectors: [["app-sidebar"]], outputs: { menuItemClick: "menuItemClick" }, standalone: false, decls: 21, vars: 1, consts: [[1, "sidebar"], [1, "sidebar-header"], [1, "logo-container"], [1, "logo-icon"], [1, "logo-text"], [1, "brand"], [1, "subtitle"], [1, "sidebar-nav"], [4, "ngFor", "ngForOf"], [1, "sidebar-footer"], [1, "version-badge"], [1, "copyright"], [4, "ngIf"], ["class", "nav-item", "routerLinkActive", "active", 3, "routerLink", "click", 4, "ngIf"], ["class", "nav-group", 4, "ngIf"], ["routerLinkActive", "active", 1, "nav-item", 3, "click", "routerLink"], [1, "nav-icon"], [1, "nav-label"], [1, "nav-group"], [1, "nav-item", "nav-group-toggle", 3, "click"], [1, "toggle-icon"], [1, "nav-group-items"], ["class", "nav-item nav-child", "routerLinkActive", "active", 3, "routerLink", "click", 4, "ngIf"], ["routerLinkActive", "active", 1, "nav-item", "nav-child", 3, "click", "routerLink"], [1, "nav-icon", "child-icon"]], template: function SidebarComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "mat-icon");
            i0.ɵɵtext(5, "local_hospital");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 4)(7, "span", 5);
            i0.ɵɵtext(8, "ClinIQ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "span", 6);
            i0.ɵɵtext(10, "Hospital Management");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(11, "nav", 7);
            i0.ɵɵtemplate(12, SidebarComponent_ng_container_12_Template, 2, 1, "ng-container", 8);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "div", 9)(14, "div", 10)(15, "mat-icon");
            i0.ɵɵtext(16, "verified");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "span");
            i0.ɵɵtext(18, "v1.0.0");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(19, "div", 11);
            i0.ɵɵtext(20, "\u00A9 2024 ClinIQ");
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(12);
            i0.ɵɵproperty("ngForOf", ctx.menuItems);
        } }, dependencies: [i3.NgForOf, i3.NgIf, i1.RouterLink, i1.RouterLinkActive, i4.MatIcon], styles: [".sidebar[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      height: 100%;\n      background: linear-gradient(180deg, #1a237e 0%, #0d47a1 50%, #01579b 100%);\n      color: white;\n      overflow: hidden;\n    }\n\n    \n\n    .sidebar-header[_ngcontent-%COMP%] {\n      padding: 1.25rem 1rem;\n      border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n    }\n\n    .logo-container[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.75rem;\n    }\n\n    .logo-icon[_ngcontent-%COMP%] {\n      width: 42px;\n      height: 42px;\n      border-radius: 10px;\n      background: rgba(255, 255, 255, 0.15);\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      backdrop-filter: blur(10px);\n    }\n\n    .logo-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      font-size: 24px;\n      width: 24px;\n      height: 24px;\n      color: #80deea;\n    }\n\n    .logo-text[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n    }\n\n    .brand[_ngcontent-%COMP%] {\n      font-size: 1.3rem;\n      font-weight: 700;\n      letter-spacing: 0.5px;\n      line-height: 1.2;\n    }\n\n    .subtitle[_ngcontent-%COMP%] {\n      font-size: 0.65rem;\n      color: rgba(255, 255, 255, 0.6);\n      text-transform: uppercase;\n      letter-spacing: 0.8px;\n    }\n\n    \n\n    .sidebar-nav[_ngcontent-%COMP%] {\n      flex: 1;\n      overflow-y: auto;\n      overflow-x: hidden;\n      padding: 0.75rem 0;\n    }\n\n    .sidebar-nav[_ngcontent-%COMP%]::-webkit-scrollbar {\n      width: 4px;\n    }\n\n    .sidebar-nav[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n      background: transparent;\n    }\n\n    .sidebar-nav[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n      background: rgba(255, 255, 255, 0.2);\n      border-radius: 2px;\n    }\n\n    .nav-item[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.75rem;\n      padding: 0.7rem 1.25rem;\n      color: rgba(255, 255, 255, 0.7);\n      text-decoration: none;\n      border: none;\n      background: none;\n      width: 100%;\n      text-align: left;\n      cursor: pointer;\n      transition: all 0.2s ease;\n      position: relative;\n      border-left: 3px solid transparent;\n    }\n\n    .nav-item[_ngcontent-%COMP%]:hover {\n      background: rgba(255, 255, 255, 0.08);\n      color: white;\n    }\n\n    .nav-item.active[_ngcontent-%COMP%] {\n      background: rgba(255, 255, 255, 0.12);\n      color: white;\n      border-left-color: #80deea;\n    }\n\n    .nav-item.active[_ngcontent-%COMP%]   .nav-icon[_ngcontent-%COMP%] {\n      color: #80deea;\n    }\n\n    .nav-icon[_ngcontent-%COMP%] {\n      font-size: 20px;\n      width: 20px;\n      height: 20px;\n      opacity: 0.9;\n    }\n\n    .nav-label[_ngcontent-%COMP%] {\n      font-size: 0.875rem;\n      font-weight: 500;\n      letter-spacing: 0.2px;\n    }\n\n    \n\n    .nav-group-toggle[_ngcontent-%COMP%] {\n      font-size: 0.875rem;\n      font-weight: 500;\n    }\n\n    .toggle-icon[_ngcontent-%COMP%] {\n      margin-left: auto;\n      transition: transform 0.2s ease;\n      font-size: 18px;\n      width: 18px;\n      height: 18px;\n      opacity: 0.6;\n    }\n\n    .toggle-icon.expanded[_ngcontent-%COMP%] {\n      transform: rotate(180deg);\n    }\n\n    \n\n    .nav-group-items[_ngcontent-%COMP%] {\n      max-height: 0;\n      overflow: hidden;\n      transition: max-height 0.3s ease;\n    }\n\n    .nav-group-items.expanded[_ngcontent-%COMP%] {\n      max-height: 500px;\n    }\n\n    .nav-child[_ngcontent-%COMP%] {\n      padding-left: 3rem;\n      font-size: 0.8rem;\n    }\n\n    .child-icon[_ngcontent-%COMP%] {\n      font-size: 16px !important;\n      width: 16px !important;\n      height: 16px !important;\n    }\n\n    \n\n    .sidebar-footer[_ngcontent-%COMP%] {\n      padding: 1rem 1.25rem;\n      border-top: 1px solid rgba(255, 255, 255, 0.1);\n      text-align: center;\n    }\n\n    .version-badge[_ngcontent-%COMP%] {\n      display: inline-flex;\n      align-items: center;\n      gap: 0.35rem;\n      background: rgba(255, 255, 255, 0.1);\n      padding: 0.25rem 0.6rem;\n      border-radius: 12px;\n      font-size: 0.7rem;\n      color: rgba(255, 255, 255, 0.7);\n      margin-bottom: 0.5rem;\n    }\n\n    .version-badge[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      font-size: 12px;\n      width: 12px;\n      height: 12px;\n      color: #80deea;\n    }\n\n    .copyright[_ngcontent-%COMP%] {\n      font-size: 0.65rem;\n      color: rgba(255, 255, 255, 0.4);\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SidebarComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-sidebar', template: `
    <div class="sidebar">
      <!-- Logo Section -->
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-icon">
            <mat-icon>local_hospital</mat-icon>
          </div>
          <div class="logo-text">
            <span class="brand">ClinIQ</span>
            <span class="subtitle">Hospital Management</span>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <ng-container *ngFor="let item of menuItems">
          <ng-container *ngIf="!item.permission || hasPermission(item.permission)">
            <!-- Simple menu item -->
            <a *ngIf="!item.children"
               class="nav-item"
               [routerLink]="item.route"
               routerLinkActive="active"
               (click)="onItemClick()">
              <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
              <span class="nav-label">{{ item.label }}</span>
            </a>

            <!-- Menu item with children -->
            <div *ngIf="item.children" class="nav-group">
              <button class="nav-item nav-group-toggle" (click)="toggleGroup(item)">
                <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
                <span class="nav-label">{{ item.label }}</span>
                <mat-icon class="toggle-icon" [class.expanded]="item.expanded">expand_more</mat-icon>
              </button>
              <div class="nav-group-items" [class.expanded]="item.expanded">
                <ng-container *ngFor="let child of item.children">
                  <a *ngIf="!child.permission || hasPermission(child.permission)"
                     class="nav-item nav-child"
                     [routerLink]="child.route"
                     routerLinkActive="active"
                     (click)="onItemClick()">
                    <mat-icon class="nav-icon child-icon">{{ child.icon }}</mat-icon>
                    <span class="nav-label">{{ child.label }}</span>
                  </a>
                </ng-container>
              </div>
            </div>
          </ng-container>
        </ng-container>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <div class="version-badge">
          <mat-icon>verified</mat-icon>
          <span>v1.0.0</span>
        </div>
        <div class="copyright">&copy; 2024 ClinIQ</div>
      </div>
    </div>
  `, styles: ["\n    .sidebar {\n      display: flex;\n      flex-direction: column;\n      height: 100%;\n      background: linear-gradient(180deg, #1a237e 0%, #0d47a1 50%, #01579b 100%);\n      color: white;\n      overflow: hidden;\n    }\n\n    /* Logo Section */\n    .sidebar-header {\n      padding: 1.25rem 1rem;\n      border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n    }\n\n    .logo-container {\n      display: flex;\n      align-items: center;\n      gap: 0.75rem;\n    }\n\n    .logo-icon {\n      width: 42px;\n      height: 42px;\n      border-radius: 10px;\n      background: rgba(255, 255, 255, 0.15);\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      backdrop-filter: blur(10px);\n    }\n\n    .logo-icon mat-icon {\n      font-size: 24px;\n      width: 24px;\n      height: 24px;\n      color: #80deea;\n    }\n\n    .logo-text {\n      display: flex;\n      flex-direction: column;\n    }\n\n    .brand {\n      font-size: 1.3rem;\n      font-weight: 700;\n      letter-spacing: 0.5px;\n      line-height: 1.2;\n    }\n\n    .subtitle {\n      font-size: 0.65rem;\n      color: rgba(255, 255, 255, 0.6);\n      text-transform: uppercase;\n      letter-spacing: 0.8px;\n    }\n\n    /* Navigation */\n    .sidebar-nav {\n      flex: 1;\n      overflow-y: auto;\n      overflow-x: hidden;\n      padding: 0.75rem 0;\n    }\n\n    .sidebar-nav::-webkit-scrollbar {\n      width: 4px;\n    }\n\n    .sidebar-nav::-webkit-scrollbar-track {\n      background: transparent;\n    }\n\n    .sidebar-nav::-webkit-scrollbar-thumb {\n      background: rgba(255, 255, 255, 0.2);\n      border-radius: 2px;\n    }\n\n    .nav-item {\n      display: flex;\n      align-items: center;\n      gap: 0.75rem;\n      padding: 0.7rem 1.25rem;\n      color: rgba(255, 255, 255, 0.7);\n      text-decoration: none;\n      border: none;\n      background: none;\n      width: 100%;\n      text-align: left;\n      cursor: pointer;\n      transition: all 0.2s ease;\n      position: relative;\n      border-left: 3px solid transparent;\n    }\n\n    .nav-item:hover {\n      background: rgba(255, 255, 255, 0.08);\n      color: white;\n    }\n\n    .nav-item.active {\n      background: rgba(255, 255, 255, 0.12);\n      color: white;\n      border-left-color: #80deea;\n    }\n\n    .nav-item.active .nav-icon {\n      color: #80deea;\n    }\n\n    .nav-icon {\n      font-size: 20px;\n      width: 20px;\n      height: 20px;\n      opacity: 0.9;\n    }\n\n    .nav-label {\n      font-size: 0.875rem;\n      font-weight: 500;\n      letter-spacing: 0.2px;\n    }\n\n    /* Group Toggle */\n    .nav-group-toggle {\n      font-size: 0.875rem;\n      font-weight: 500;\n    }\n\n    .toggle-icon {\n      margin-left: auto;\n      transition: transform 0.2s ease;\n      font-size: 18px;\n      width: 18px;\n      height: 18px;\n      opacity: 0.6;\n    }\n\n    .toggle-icon.expanded {\n      transform: rotate(180deg);\n    }\n\n    /* Group Items */\n    .nav-group-items {\n      max-height: 0;\n      overflow: hidden;\n      transition: max-height 0.3s ease;\n    }\n\n    .nav-group-items.expanded {\n      max-height: 500px;\n    }\n\n    .nav-child {\n      padding-left: 3rem;\n      font-size: 0.8rem;\n    }\n\n    .child-icon {\n      font-size: 16px !important;\n      width: 16px !important;\n      height: 16px !important;\n    }\n\n    /* Footer */\n    .sidebar-footer {\n      padding: 1rem 1.25rem;\n      border-top: 1px solid rgba(255, 255, 255, 0.1);\n      text-align: center;\n    }\n\n    .version-badge {\n      display: inline-flex;\n      align-items: center;\n      gap: 0.35rem;\n      background: rgba(255, 255, 255, 0.1);\n      padding: 0.25rem 0.6rem;\n      border-radius: 12px;\n      font-size: 0.7rem;\n      color: rgba(255, 255, 255, 0.7);\n      margin-bottom: 0.5rem;\n    }\n\n    .version-badge mat-icon {\n      font-size: 12px;\n      width: 12px;\n      height: 12px;\n      color: #80deea;\n    }\n\n    .copyright {\n      font-size: 0.65rem;\n      color: rgba(255, 255, 255, 0.4);\n    }\n  "] }]
    }], () => [{ type: i1.Router }, { type: i2.AuthService }], { menuItemClick: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SidebarComponent, { className: "SidebarComponent", filePath: "app/layout/sidebar/sidebar.component.ts", lineNumber: 279 }); })();
//# sourceMappingURL=sidebar.component.js.map