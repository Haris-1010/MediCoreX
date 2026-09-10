import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/router";
import * as i3 from "../../../core/services/notification.service";
import * as i4 from "@angular/common";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/material/icon";
import * as i7 from "@angular/material/input";
import * as i8 from "@angular/material/select";
import * as i9 from "@angular/material/paginator";
import * as i10 from "../../../shared/components/page-header/page-header.component";
import * as i11 from "../../../shared/components/status-badge/status-badge.component";
import * as i12 from "../../../shared/components/search-input/search-input.component";
import * as i13 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Doctors" });
const _c2 = (a0, a1) => [a0, a1];
const _c3 = () => [12, 24, 48];
function DoctorListComponent_mat_option_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 13);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const d_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", d_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(d_r1.name);
} }
function DoctorListComponent_button_16_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 14);
    i0.ɵɵlistener("click", function DoctorListComponent_button_16_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.clearFilters()); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "filter_list_off");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " Clear Filters ");
    i0.ɵɵelementEnd();
} }
function DoctorListComponent_div_18_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 15);
    i0.ɵɵlistener("click", function DoctorListComponent_div_18_Template_div_click_0_listener() { const d_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.gotoEdit(d_r5)); });
    i0.ɵɵelementStart(1, "div", 16);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 17)(4, "h4");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 18);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 19);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 20)(11, "span", 21)(12, "mat-icon");
    i0.ɵɵtext(13, "phone");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(15, "app-status-badge", 22);
    i0.ɵɵelementStart(16, "button", 23);
    i0.ɵɵlistener("click", function DoctorListComponent_div_18_Template_button_click_16_listener($event) { const d_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onDeleteDoctor($event, d_r5.id)); });
    i0.ɵɵelementStart(17, "mat-icon");
    i0.ɵɵtext(18, "delete");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const d_r5 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(d_r5.initials);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Dr. ", d_r5.fullName, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(d_r5.specialization);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(d_r5.departmentName);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", d_r5.phone || d_r5.phoneNumber, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", d_r5.status);
} }
export class DoctorListComponent {
    constructor(api, router, notification) {
        this.api = api;
        this.router = router;
        this.notification = notification;
        this.doctors = [];
        this.departments = [];
        this.totalCount = 0;
        this.pageSize = 12;
        this.pageIndex = 0;
        this.searchTerm = '';
        this.filterDept = '';
        this.deletingIds = new Set();
    }
    ngOnInit() { this.load(); this.api.get('v1/departments').subscribe(r => this.departments = r); }
    load() {
        this.api.get('v1/doctors', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, departmentId: this.filterDept })
            .subscribe(r => { this.doctors = r.items; this.totalCount = r.totalCount; });
    }
    onSearch(term) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
    onPage(e) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
    hasActiveFilters() {
        return !!(this.searchTerm || this.filterDept);
    }
    clearFilters() {
        this.searchTerm = '';
        this.filterDept = '';
        this.pageIndex = 0;
        this.load();
    }
    gotoEdit(d) {
        this.router.navigate(['/doctors', d.id, 'edit']);
    }
    onDeleteDoctor(e, id) {
        e.stopPropagation();
        if (!confirm('Delete this doctor?'))
            return;
        if (this.deletingIds.has(id))
            return;
        this.deletingIds.add(id);
        this.api.delete(`v1/doctors`, id).subscribe({
            next: () => {
                this.deletingIds.delete(id);
                this.doctors = this.doctors.filter(d => d.id !== id);
                try {
                    this.notification.success('Doctor deleted');
                }
                catch { }
            },
            error: () => {
                this.deletingIds.delete(id);
                try {
                    this.notification.error('Delete failed');
                }
                catch {
                    alert('Delete failed');
                }
            }
        });
    }
    static { this.ɵfac = function DoctorListComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DoctorListComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.Router), i0.ɵɵdirectiveInject(i3.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DoctorListComponent, selectors: [["app-doctor-list"]], standalone: false, decls: 20, vars: 14, consts: [["title", "Doctors", 3, "breadcrumbs"], ["mat-raised-button", "", "color", "primary", "routerLink", "new"], [1, "card"], [1, "filters"], ["placeholder", "Search doctors...", 3, "search"], ["appearance", "outline"], [3, "valueChange", "selectionChange", "value"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], ["mat-stroked-button", "", 3, "click", 4, "ngIf"], [1, "doctor-grid"], ["class", "doctor-card", 3, "click", 4, "ngFor", "ngForOf"], [3, "page", "length", "pageSize", "pageSizeOptions"], [3, "value"], ["mat-stroked-button", "", 3, "click"], [1, "doctor-card", 3, "click"], [1, "avatar"], [1, "info"], [1, "spec"], [1, "dept"], [1, "meta"], [1, "phone"], [3, "status"], ["mat-icon-button", "", "color", "warn", "aria-label", "Delete doctor", 3, "click"]], template: function DoctorListComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 0)(2, "button", 1)(3, "mat-icon");
            i0.ɵɵtext(4, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " Add Doctor");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 2)(7, "div", 3)(8, "app-search-input", 4);
            i0.ɵɵlistener("search", function DoctorListComponent_Template_app_search_input_search_8_listener($event) { return ctx.onSearch($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "mat-form-field", 5)(10, "mat-label");
            i0.ɵɵtext(11, "Department");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "mat-select", 6);
            i0.ɵɵtwoWayListener("valueChange", function DoctorListComponent_Template_mat_select_valueChange_12_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.filterDept, $event) || (ctx.filterDept = $event); return $event; });
            i0.ɵɵlistener("selectionChange", function DoctorListComponent_Template_mat_select_selectionChange_12_listener() { return ctx.load(); });
            i0.ɵɵelementStart(13, "mat-option", 7);
            i0.ɵɵtext(14, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(15, DoctorListComponent_mat_option_15_Template, 2, 2, "mat-option", 8);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(16, DoctorListComponent_button_16_Template, 4, 0, "button", 9);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "div", 10);
            i0.ɵɵtemplate(18, DoctorListComponent_div_18_Template, 19, 6, "div", 11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "mat-paginator", 12);
            i0.ɵɵlistener("page", function DoctorListComponent_Template_mat_paginator_page_19_listener($event) { return ctx.onPage($event); });
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(10, _c2, i0.ɵɵpureFunction0(8, _c0), i0.ɵɵpureFunction0(9, _c1)));
            i0.ɵɵadvance(11);
            i0.ɵɵtwoWayProperty("value", ctx.filterDept);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngForOf", ctx.departments);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.hasActiveFilters());
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngForOf", ctx.doctors);
            i0.ɵɵadvance();
            i0.ɵɵproperty("length", ctx.totalCount)("pageSize", ctx.pageSize)("pageSizeOptions", i0.ɵɵpureFunction0(13, _c3));
        } }, dependencies: [i4.NgForOf, i4.NgIf, i2.RouterLink, i5.MatButton, i5.MatIconButton, i6.MatIcon, i7.MatFormField, i7.MatLabel, i8.MatSelect, i8.MatOption, i9.MatPaginator, i10.PageHeaderComponent, i11.StatusBadgeComponent, i12.SearchInputComponent, i13.MainLayoutComponent], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .filters[_ngcontent-%COMP%] { display: flex; gap: 1rem; margin-bottom: 1rem; }\n    .doctor-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }\n    .doctor-card[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 8px; cursor: pointer; }\n    .doctor-card[_ngcontent-%COMP%]:hover { background: #e8eaf6; }\n    .avatar[_ngcontent-%COMP%] { width: 50px; height: 50px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }\n    .info[_ngcontent-%COMP%] { flex: 1; } .info[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { margin: 0; } .spec[_ngcontent-%COMP%] { margin: 0; color: #3f51b5; font-size: 0.875rem; } .dept[_ngcontent-%COMP%] { margin: 0; color: #666; font-size: 0.75rem; }\n    .meta[_ngcontent-%COMP%] { display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem; }\n    .phone[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: #666; } .phone[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 14px; width: 14px; height: 14px; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DoctorListComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-doctor-list', template: `
    <app-main-layout>
      <app-page-header title="Doctors" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Doctors' }]">
        <button mat-raised-button color="primary" routerLink="new"><mat-icon>add</mat-icon> Add Doctor</button>
      </app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search doctors..." (search)="onSearch($event)"></app-search-input>
          <mat-form-field appearance="outline"><mat-label>Department</mat-label><mat-select [(value)]="filterDept" (selectionChange)="load()"><mat-option value="">All</mat-option><mat-option *ngFor="let d of departments" [value]="d.id">{{ d.name }}</mat-option></mat-select></mat-form-field>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear Filters
          </button>
        </div>
        <div class="doctor-grid">
          <div class="doctor-card" *ngFor="let d of doctors" (click)="gotoEdit(d)">
            <div class="avatar">{{ d.initials }}</div>
            <div class="info"><h4>Dr. {{ d.fullName }}</h4><p class="spec">{{ d.specialization }}</p><p class="dept">{{ d.departmentName }}</p></div>
            <div class="meta"><span class="phone"><mat-icon>phone</mat-icon> {{ d.phone || d.phoneNumber }}</span><app-status-badge [status]="d.status"></app-status-badge>
              <button mat-icon-button color="warn" aria-label="Delete doctor" (click)="onDeleteDoctor($event, d.id)"><mat-icon>delete</mat-icon></button>
            </div>
          </div>
        </div>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[12, 24, 48]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `, styles: [".card { background: white; padding: 1.5rem; border-radius: 8px; } .filters { display: flex; gap: 1rem; margin-bottom: 1rem; }\n    .doctor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }\n    .doctor-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 8px; cursor: pointer; }\n    .doctor-card:hover { background: #e8eaf6; }\n    .avatar { width: 50px; height: 50px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }\n    .info { flex: 1; } .info h4 { margin: 0; } .spec { margin: 0; color: #3f51b5; font-size: 0.875rem; } .dept { margin: 0; color: #666; font-size: 0.75rem; }\n    .meta { display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem; }\n    .phone { display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: #666; } .phone mat-icon { font-size: 14px; width: 14px; height: 14px; }"] }]
    }], () => [{ type: i1.ApiService }, { type: i2.Router }, { type: i3.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DoctorListComponent, { className: "DoctorListComponent", filePath: "app/features/doctors/doctor-list/doctor-list.component.ts", lineNumber: 44 }); })();
//# sourceMappingURL=doctor-list.component.js.map