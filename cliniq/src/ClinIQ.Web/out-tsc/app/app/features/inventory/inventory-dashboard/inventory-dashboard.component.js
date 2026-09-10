import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/router";
import * as i4 from "@angular/material/button";
import * as i5 from "@angular/material/icon";
import * as i6 from "../../../shared/components/page-header/page-header.component";
import * as i7 from "../../../shared/components/status-badge/status-badge.component";
import * as i8 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Inventory" });
const _c2 = (a0, a1) => [a0, a1];
function InventoryDashboardComponent_div_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 12)(1, "div", 13)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 14);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const i_r1 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i_r1.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i_r1.category);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("critical", i_r1.quantity <= i_r1.reorderLevel / 2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", i_r1.quantity, " / ", i_r1.reorderLevel, "");
} }
function InventoryDashboardComponent_div_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15)(1, "div", 13)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(6, "app-status-badge", 16);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r2 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(o_r2.poNumber);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(o_r2.supplierName);
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", o_r2.status);
} }
export class InventoryDashboardComponent {
    constructor(api) {
        this.api = api;
        this.stats = { totalItems: 0, lowStock: 0, outOfStock: 0, expiringItems: 0 };
        this.lowStockItems = [];
        this.recentOrders = [];
    }
    ngOnInit() {
        this.api.get('v1/inventory/stats').subscribe(r => this.stats = r);
        this.api.get('v1/inventory/low-stock').subscribe(r => this.lowStockItems = r);
        this.api.get('v1/purchase-orders/recent').subscribe(r => this.recentOrders = r);
    }
    static { this.ɵfac = function InventoryDashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || InventoryDashboardComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: InventoryDashboardComponent, selectors: [["app-inventory-dashboard"]], standalone: false, decls: 50, vars: 12, consts: [["title", "Inventory", 3, "breadcrumbs"], ["mat-raised-button", "", "color", "primary", "routerLink", "items"], [1, "stats-grid"], [1, "stat-card"], [1, "stat-card", "warn"], [1, "stat-card", "danger"], [1, "dashboard-grid"], [1, "card"], [1, "item-list"], ["class", "item", 4, "ngFor", "ngForOf"], [1, "order-list"], ["class", "order", 4, "ngFor", "ngForOf"], [1, "item"], [1, "info"], [1, "stock"], [1, "order"], [3, "status"]], template: function InventoryDashboardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 0)(2, "button", 1)(3, "mat-icon");
            i0.ɵɵtext(4, "inventory_2");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " Manage Items");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 2)(7, "div", 3)(8, "mat-icon");
            i0.ɵɵtext(9, "inventory");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "div")(11, "h3");
            i0.ɵɵtext(12);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "p");
            i0.ɵɵtext(14, "Total Items");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(15, "div", 4)(16, "mat-icon");
            i0.ɵɵtext(17, "warning");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "div")(19, "h3");
            i0.ɵɵtext(20);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "p");
            i0.ɵɵtext(22, "Low Stock");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(23, "div", 5)(24, "mat-icon");
            i0.ɵɵtext(25, "error");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "div")(27, "h3");
            i0.ɵɵtext(28);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "p");
            i0.ɵɵtext(30, "Out of Stock");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(31, "div", 3)(32, "mat-icon");
            i0.ɵɵtext(33, "event");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "div")(35, "h3");
            i0.ɵɵtext(36);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "p");
            i0.ɵɵtext(38, "Expiring Soon");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(39, "div", 6)(40, "div", 7)(41, "h3");
            i0.ɵɵtext(42, "Low Stock Items");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(43, "div", 8);
            i0.ɵɵtemplate(44, InventoryDashboardComponent_div_44_Template, 8, 6, "div", 9);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(45, "div", 7)(46, "h3");
            i0.ɵɵtext(47, "Recent Purchase Orders");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "div", 10);
            i0.ɵɵtemplate(49, InventoryDashboardComponent_div_49_Template, 7, 3, "div", 11);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(9, _c2, i0.ɵɵpureFunction0(7, _c0), i0.ɵɵpureFunction0(8, _c1)));
            i0.ɵɵadvance(11);
            i0.ɵɵtextInterpolate(ctx.stats.totalItems);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.stats.lowStock);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.stats.outOfStock);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.stats.expiringItems);
            i0.ɵɵadvance(8);
            i0.ɵɵproperty("ngForOf", ctx.lowStockItems);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngForOf", ctx.recentOrders);
        } }, dependencies: [i2.NgForOf, i3.RouterLink, i4.MatButton, i5.MatIcon, i6.PageHeaderComponent, i7.StatusBadgeComponent, i8.MainLayoutComponent], styles: [".stats-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }\n    .stat-card[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }\n    .stat-card[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; }\n    .stat-card.warn[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { color: #ff9800; } .stat-card.danger[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { color: #f44336; }\n    .stat-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0; font-size: 1.75rem; } .stat-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; color: #666; }\n    .dashboard-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }\n    .card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 1rem; }\n    .item-list[_ngcontent-%COMP%], .order-list[_ngcontent-%COMP%] { display: flex; flex-direction: column; gap: 0.5rem; }\n    .item[_ngcontent-%COMP%], .order[_ngcontent-%COMP%] { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f5f5f5; border-radius: 8px; }\n    .info[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] { display: block; } .info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] { font-size: 0.875rem; color: #666; }\n    .stock[_ngcontent-%COMP%] { font-weight: 600; } .stock.critical[_ngcontent-%COMP%] { color: #f44336; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(InventoryDashboardComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-inventory-dashboard', template: `
    <app-main-layout>
      <app-page-header title="Inventory" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Inventory' }]">
        <button mat-raised-button color="primary" routerLink="items"><mat-icon>inventory_2</mat-icon> Manage Items</button>
      </app-page-header>
      <div class="stats-grid">
        <div class="stat-card"><mat-icon>inventory</mat-icon><div><h3>{{ stats.totalItems }}</h3><p>Total Items</p></div></div>
        <div class="stat-card warn"><mat-icon>warning</mat-icon><div><h3>{{ stats.lowStock }}</h3><p>Low Stock</p></div></div>
        <div class="stat-card danger"><mat-icon>error</mat-icon><div><h3>{{ stats.outOfStock }}</h3><p>Out of Stock</p></div></div>
        <div class="stat-card"><mat-icon>event</mat-icon><div><h3>{{ stats.expiringItems }}</h3><p>Expiring Soon</p></div></div>
      </div>
      <div class="dashboard-grid">
        <div class="card"><h3>Low Stock Items</h3>
          <div class="item-list">
            <div class="item" *ngFor="let i of lowStockItems"><div class="info"><strong>{{ i.name }}</strong><span>{{ i.category }}</span></div><div class="stock" [class.critical]="i.quantity <= i.reorderLevel / 2">{{ i.quantity }} / {{ i.reorderLevel }}</div></div>
          </div>
        </div>
        <div class="card"><h3>Recent Purchase Orders</h3>
          <div class="order-list">
            <div class="order" *ngFor="let o of recentOrders"><div class="info"><strong>{{ o.poNumber }}</strong><span>{{ o.supplierName }}</span></div><app-status-badge [status]="o.status"></app-status-badge></div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `, styles: [".stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }\n    .stat-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }\n    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; }\n    .stat-card.warn mat-icon { color: #ff9800; } .stat-card.danger mat-icon { color: #f44336; }\n    .stat-card h3 { margin: 0; font-size: 1.75rem; } .stat-card p { margin: 0; color: #666; }\n    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }\n    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }\n    .item-list, .order-list { display: flex; flex-direction: column; gap: 0.5rem; }\n    .item, .order { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f5f5f5; border-radius: 8px; }\n    .info strong { display: block; } .info span { font-size: 0.875rem; color: #666; }\n    .stock { font-weight: 600; } .stock.critical { color: #f44336; }"] }]
    }], () => [{ type: i1.ApiService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(InventoryDashboardComponent, { className: "InventoryDashboardComponent", filePath: "app/features/inventory/inventory-dashboard/inventory-dashboard.component.ts", lineNumber: 44 }); })();
//# sourceMappingURL=inventory-dashboard.component.js.map