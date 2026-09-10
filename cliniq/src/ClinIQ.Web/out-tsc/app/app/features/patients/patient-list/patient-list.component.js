import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../../../core/services/api.service";
import * as i3 from "@angular/material/dialog";
import * as i4 from "../../../core/services/notification.service";
import * as i5 from "@angular/common";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/material/input";
import * as i9 from "@angular/material/select";
import * as i10 from "@angular/material/table";
import * as i11 from "@angular/material/paginator";
import * as i12 from "@angular/material/sort";
import * as i13 from "@angular/material/menu";
import * as i14 from "@angular/material/list";
import * as i15 from "@angular/material/tooltip";
import * as i16 from "../../../shared/components/page-header/page-header.component";
import * as i17 from "../../../shared/components/status-badge/status-badge.component";
import * as i18 from "../../../shared/components/empty-state/empty-state.component";
import * as i19 from "../../../shared/components/search-input/search-input.component";
import * as i20 from "../../../layout/main-layout/main-layout.component";
import * as i21 from "../../../shared/pipes/phone.pipe";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Patients" });
const _c2 = (a0, a1) => [a0, a1];
const _c3 = () => [10, 25, 50, 100];
const _c4 = a0 => ({ patient: a0 });
const _c5 = a0 => [a0, "edit"];
function PatientListComponent_button_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 35)(1, "mat-icon");
    i0.ɵɵtext(2, "add");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " New Patient ");
    i0.ɵɵelementEnd();
} }
function PatientListComponent_button_28_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 36);
    i0.ɵɵlistener("click", function PatientListComponent_button_28_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.clearFilters()); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "filter_list_off");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " Clear Filters ");
    i0.ɵɵelementEnd();
} }
function PatientListComponent_th_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 37);
    i0.ɵɵtext(1, "MRN");
    i0.ɵɵelementEnd();
} }
function PatientListComponent_td_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 38);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const patient_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(patient_r4.mrn);
} }
function PatientListComponent_th_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 37);
    i0.ɵɵtext(1, "Name");
    i0.ɵɵelementEnd();
} }
function PatientListComponent_td_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 38)(1, "div", 39)(2, "span", 40);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 41);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const patient_r5 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(patient_r5.fullName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(patient_r5.email);
} }
function PatientListComponent_th_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 37);
    i0.ɵɵtext(1, "Date of Birth");
    i0.ɵɵelementEnd();
} }
function PatientListComponent_td_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 38);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const patient_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(2, 1, patient_r6.dateOfBirth, "mediumDate"));
} }
function PatientListComponent_th_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 42);
    i0.ɵɵtext(1, "Age");
    i0.ɵɵelementEnd();
} }
function PatientListComponent_td_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 38);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const patient_r7 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(patient_r7.age != null ? patient_r7.age + " yrs" : "\u2014");
} }
function PatientListComponent_th_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 37);
    i0.ɵɵtext(1, "Gender");
    i0.ɵɵelementEnd();
} }
function PatientListComponent_td_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 38);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const patient_r8 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(patient_r8.gender);
} }
function PatientListComponent_th_46_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 42);
    i0.ɵɵtext(1, "Phone");
    i0.ɵɵelementEnd();
} }
function PatientListComponent_td_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 38);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "phone");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const patient_r9 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, patient_r9.phone));
} }
function PatientListComponent_th_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 42);
    i0.ɵɵtext(1, "Blood Group");
    i0.ɵɵelementEnd();
} }
function PatientListComponent_td_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 38)(1, "span", 43);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const patient_r10 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(patient_r10.bloodGroup);
} }
function PatientListComponent_th_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 37);
    i0.ɵɵtext(1, "Last Visit");
    i0.ɵɵelementEnd();
} }
function PatientListComponent_td_53_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 38);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const patient_r11 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", patient_r11.lastVisit ? i0.ɵɵpipeBind2(2, 1, patient_r11.lastVisit, "mediumDate") : "Never", " ");
} }
function PatientListComponent_th_55_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 42);
    i0.ɵɵtext(1, "Status");
    i0.ɵɵelementEnd();
} }
function PatientListComponent_td_56_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 38);
    i0.ɵɵelement(1, "app-status-badge", 44);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const patient_r12 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", patient_r12.status);
} }
function PatientListComponent_th_58_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 42);
    i0.ɵɵtext(1, "Actions");
    i0.ɵɵelementEnd();
} }
function PatientListComponent_td_59_button_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 50)(1, "mat-icon");
    i0.ɵɵtext(2, "edit");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const patient_r14 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(1, _c5, patient_r14.id));
} }
function PatientListComponent_td_59_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "td", 45);
    i0.ɵɵlistener("click", function PatientListComponent_td_59_Template_td_click_0_listener($event) { i0.ɵɵrestoreView(_r13); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(1, "button", 46);
    i0.ɵɵlistener("click", function PatientListComponent_td_59_Template_button_click_1_listener() { const patient_r14 = i0.ɵɵrestoreView(_r13).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.viewPatient(patient_r14)); });
    i0.ɵɵelementStart(2, "mat-icon");
    i0.ɵɵtext(3, "visibility");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(4, PatientListComponent_td_59_button_4_Template, 3, 3, "button", 47);
    i0.ɵɵelementStart(5, "button", 48);
    i0.ɵɵlistener("click", function PatientListComponent_td_59_Template_button_click_5_listener() { const patient_r14 = i0.ɵɵrestoreView(_r13).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.deletePatient(patient_r14)); });
    i0.ɵɵelementStart(6, "mat-icon");
    i0.ɵɵtext(7, "delete");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "button", 49)(9, "mat-icon");
    i0.ɵɵtext(10, "more_vert");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const patient_r14 = ctx.$implicit;
    i0.ɵɵnextContext();
    const actionMenu_r15 = i0.ɵɵreference(64);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("appHasPermission", "Patients.Edit");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("matMenuTriggerFor", actionMenu_r15)("matMenuTriggerData", i0.ɵɵpureFunction1(3, _c4, patient_r14));
} }
function PatientListComponent_tr_60_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 51);
} }
function PatientListComponent_tr_61_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 52);
    i0.ɵɵlistener("click", function PatientListComponent_tr_61_Template_tr_click_0_listener() { const row_r17 = i0.ɵɵrestoreView(_r16).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.viewPatient(row_r17)); });
    i0.ɵɵelementEnd();
} }
function PatientListComponent_tr_62_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 53)(1, "td", 54)(2, "app-empty-state", 55);
    i0.ɵɵlistener("action", function PatientListComponent_tr_62_Template_app_empty_state_action_2_listener() { i0.ɵɵrestoreView(_r18); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.router.navigate(["/patients/new"])); });
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵattribute("colspan", ctx_r2.displayedColumns.length);
} }
function PatientListComponent_ng_template_65_button_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 61)(1, "mat-icon");
    i0.ɵɵtext(2, "edit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "Edit");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const patient_r20 = i0.ɵɵnextContext().patient;
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(1, _c5, patient_r20.id));
} }
function PatientListComponent_ng_template_65_button_6_Template(rf, ctx) { if (rf & 1) {
    const _r21 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 56);
    i0.ɵɵlistener("click", function PatientListComponent_ng_template_65_button_6_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r21); const patient_r20 = i0.ɵɵnextContext().patient; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.bookAppointment(patient_r20)); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "event");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "Book Appointment");
    i0.ɵɵelementEnd()();
} }
function PatientListComponent_ng_template_65_Template(rf, ctx) { if (rf & 1) {
    const _r19 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 56);
    i0.ɵɵlistener("click", function PatientListComponent_ng_template_65_Template_button_click_0_listener() { const patient_r20 = i0.ɵɵrestoreView(_r19).patient; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.viewPatient(patient_r20)); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "visibility");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "View Details");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(5, PatientListComponent_ng_template_65_button_5_Template, 5, 3, "button", 57)(6, PatientListComponent_ng_template_65_button_6_Template, 5, 0, "button", 58);
    i0.ɵɵelement(7, "mat-divider");
    i0.ɵɵelementStart(8, "button", 59);
    i0.ɵɵlistener("click", function PatientListComponent_ng_template_65_Template_button_click_8_listener() { const patient_r20 = i0.ɵɵrestoreView(_r19).patient; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.deletePatient(patient_r20)); });
    i0.ɵɵelementStart(9, "mat-icon", 60);
    i0.ɵɵtext(10, "delete");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span");
    i0.ɵɵtext(12, "Delete");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("appHasPermission", "Patients.Edit");
    i0.ɵɵadvance();
    i0.ɵɵproperty("appHasPermission", "Appointments.Create");
} }
export class PatientListComponent {
    constructor(router, api, dialog, notification) {
        this.router = router;
        this.api = api;
        this.dialog = dialog;
        this.notification = notification;
        this.patients = [];
        this.displayedColumns = ['mrn', 'fullName', 'dateOfBirth', 'age', 'gender', 'phone', 'bloodGroup', 'lastVisit', 'status', 'actions'];
        this.totalCount = 0;
        this.pageSize = 10;
        this.pageIndex = 0;
        this.searchTerm = '';
        this.sortBy = 'fullName';
        this.sortDescending = false;
        this.filterStatus = '';
        this.filterGender = '';
        this.loading = false;
    }
    ngOnInit() {
        this.loadPatients();
    }
    loadPatients() {
        this.loading = true;
        this.api.get('v1/patients', {
            pageNumber: this.pageIndex + 1,
            pageSize: this.pageSize,
            searchTerm: this.searchTerm,
            sortBy: this.sortBy,
            sortDescending: this.sortDescending,
            status: this.filterStatus,
            gender: this.filterGender
        }).subscribe({
            next: (result) => {
                this.patients = result.items;
                this.totalCount = result.totalCount;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }
    onSearch(term) {
        this.searchTerm = term;
        this.pageIndex = 0;
        this.loadPatients();
    }
    onSort(sort) {
        this.sortBy = sort.active;
        this.sortDescending = sort.direction === 'desc';
        this.loadPatients();
    }
    onPageChange(event) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadPatients();
    }
    viewPatient(patient) {
        this.router.navigate(['/patients', patient.id]);
    }
    bookAppointment(patient) {
        this.router.navigate(['/appointments/new'], {
            queryParams: { patientId: patient.id }
        });
    }
    deletePatient(patient) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Delete Patient',
                message: `Are you sure you want to delete ${patient.fullName}? This action cannot be undone.`,
                confirmText: 'Delete',
                confirmColor: 'warn'
            }
        });
        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.api.delete('v1/patients', patient.id).subscribe({
                    next: () => {
                        this.notification.success('Patient deleted successfully');
                        this.loadPatients();
                    }
                });
            }
        });
    }
    hasActiveFilters() {
        return !!(this.searchTerm || this.filterStatus || this.filterGender);
    }
    clearFilters() {
        this.searchTerm = '';
        this.filterStatus = '';
        this.filterGender = '';
        this.pageIndex = 0;
        this.loadPatients();
    }
    static { this.ɵfac = function PatientListComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PatientListComponent)(i0.ɵɵdirectiveInject(i1.Router), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.MatDialog), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PatientListComponent, selectors: [["app-patient-list"]], viewQuery: function PatientListComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(MatPaginator, 5);
            i0.ɵɵviewQuery(MatSort, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.paginator = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.sort = _t.first);
        } }, standalone: false, decls: 67, vars: 18, consts: [["actionMenu", "matMenu"], ["title", "Patients", "subtitle", "Manage patient records", 3, "breadcrumbs"], ["mat-raised-button", "", "color", "primary", "routerLink", "new", 4, "appHasPermission"], [1, "card"], [1, "filters"], ["placeholder", "Search patients...", 3, "search"], ["appearance", "outline"], [3, "valueChange", "selectionChange", "value"], ["value", ""], ["value", "Active"], ["value", "Inactive"], ["value", "Male"], ["value", "Female"], ["value", "Other"], ["mat-stroked-button", "", 3, "click", 4, "ngIf"], ["mat-table", "", "matSort", "", 3, "matSortChange", "dataSource"], ["matColumnDef", "mrn"], ["mat-header-cell", "", "mat-sort-header", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "fullName"], ["matColumnDef", "dateOfBirth"], ["matColumnDef", "age"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["matColumnDef", "gender"], ["matColumnDef", "phone"], ["matColumnDef", "bloodGroup"], ["matColumnDef", "lastVisit"], ["matColumnDef", "status"], ["matColumnDef", "actions"], ["mat-cell", "", 3, "click", 4, "matCellDef"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "patient-row", 3, "click", 4, "matRowDef", "matRowDefColumns"], ["class", "mat-row", 4, "matNoDataRow"], ["matMenuContent", ""], ["showFirstLastButtons", "", 3, "page", "length", "pageSize", "pageIndex", "pageSizeOptions"], ["mat-raised-button", "", "color", "primary", "routerLink", "new"], ["mat-stroked-button", "", 3, "click"], ["mat-header-cell", "", "mat-sort-header", ""], ["mat-cell", ""], [1, "patient-name"], [1, "name"], [1, "email"], ["mat-header-cell", ""], [1, "blood-group"], [3, "status"], ["mat-cell", "", 3, "click"], ["mat-icon-button", "", "matTooltip", "View", 3, "click"], ["mat-icon-button", "", "matTooltip", "Edit", 3, "routerLink", 4, "appHasPermission"], ["mat-icon-button", "", "color", "warn", "matTooltip", "Delete patient", 3, "click"], ["mat-icon-button", "", 3, "matMenuTriggerFor", "matMenuTriggerData"], ["mat-icon-button", "", "matTooltip", "Edit", 3, "routerLink"], ["mat-header-row", ""], ["mat-row", "", 1, "patient-row", 3, "click"], [1, "mat-row"], [1, "mat-cell", "no-data"], ["icon", "people", "title", "No patients found", "message", "Try adjusting your search or filters", "actionText", "Add Patient", "actionIcon", "add", 3, "action"], ["mat-menu-item", "", 3, "click"], ["mat-menu-item", "", 3, "routerLink", 4, "appHasPermission"], ["mat-menu-item", "", 3, "click", 4, "appHasPermission"], ["mat-menu-item", "", 1, "delete-action", 3, "click"], ["color", "warn"], ["mat-menu-item", "", 3, "routerLink"]], template: function PatientListComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 1);
            i0.ɵɵtemplate(2, PatientListComponent_button_2_Template, 4, 0, "button", 2);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "div", 3)(4, "div", 4)(5, "app-search-input", 5);
            i0.ɵɵlistener("search", function PatientListComponent_Template_app_search_input_search_5_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onSearch($event)); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "mat-form-field", 6)(7, "mat-label");
            i0.ɵɵtext(8, "Status");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "mat-select", 7);
            i0.ɵɵtwoWayListener("valueChange", function PatientListComponent_Template_mat_select_valueChange_9_listener($event) { i0.ɵɵrestoreView(_r1); i0.ɵɵtwoWayBindingSet(ctx.filterStatus, $event) || (ctx.filterStatus = $event); return i0.ɵɵresetView($event); });
            i0.ɵɵlistener("selectionChange", function PatientListComponent_Template_mat_select_selectionChange_9_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.loadPatients()); });
            i0.ɵɵelementStart(10, "mat-option", 8);
            i0.ɵɵtext(11, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "mat-option", 9);
            i0.ɵɵtext(13, "Active");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "mat-option", 10);
            i0.ɵɵtext(15, "Inactive");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(16, "mat-form-field", 6)(17, "mat-label");
            i0.ɵɵtext(18, "Gender");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "mat-select", 7);
            i0.ɵɵtwoWayListener("valueChange", function PatientListComponent_Template_mat_select_valueChange_19_listener($event) { i0.ɵɵrestoreView(_r1); i0.ɵɵtwoWayBindingSet(ctx.filterGender, $event) || (ctx.filterGender = $event); return i0.ɵɵresetView($event); });
            i0.ɵɵlistener("selectionChange", function PatientListComponent_Template_mat_select_selectionChange_19_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.loadPatients()); });
            i0.ɵɵelementStart(20, "mat-option", 8);
            i0.ɵɵtext(21, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "mat-option", 11);
            i0.ɵɵtext(23, "Male");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "mat-option", 12);
            i0.ɵɵtext(25, "Female");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "mat-option", 13);
            i0.ɵɵtext(27, "Other");
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(28, PatientListComponent_button_28_Template, 4, 0, "button", 14);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "table", 15);
            i0.ɵɵlistener("matSortChange", function PatientListComponent_Template_table_matSortChange_29_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onSort($event)); });
            i0.ɵɵelementContainerStart(30, 16);
            i0.ɵɵtemplate(31, PatientListComponent_th_31_Template, 2, 0, "th", 17)(32, PatientListComponent_td_32_Template, 2, 1, "td", 18);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(33, 19);
            i0.ɵɵtemplate(34, PatientListComponent_th_34_Template, 2, 0, "th", 17)(35, PatientListComponent_td_35_Template, 6, 2, "td", 18);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(36, 20);
            i0.ɵɵtemplate(37, PatientListComponent_th_37_Template, 2, 0, "th", 17)(38, PatientListComponent_td_38_Template, 3, 4, "td", 18);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(39, 21);
            i0.ɵɵtemplate(40, PatientListComponent_th_40_Template, 2, 0, "th", 22)(41, PatientListComponent_td_41_Template, 2, 1, "td", 18);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(42, 23);
            i0.ɵɵtemplate(43, PatientListComponent_th_43_Template, 2, 0, "th", 17)(44, PatientListComponent_td_44_Template, 2, 1, "td", 18);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(45, 24);
            i0.ɵɵtemplate(46, PatientListComponent_th_46_Template, 2, 0, "th", 22)(47, PatientListComponent_td_47_Template, 3, 3, "td", 18);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(48, 25);
            i0.ɵɵtemplate(49, PatientListComponent_th_49_Template, 2, 0, "th", 22)(50, PatientListComponent_td_50_Template, 3, 1, "td", 18);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(51, 26);
            i0.ɵɵtemplate(52, PatientListComponent_th_52_Template, 2, 0, "th", 17)(53, PatientListComponent_td_53_Template, 3, 4, "td", 18);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(54, 27);
            i0.ɵɵtemplate(55, PatientListComponent_th_55_Template, 2, 0, "th", 22)(56, PatientListComponent_td_56_Template, 2, 1, "td", 18);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(57, 28);
            i0.ɵɵtemplate(58, PatientListComponent_th_58_Template, 2, 0, "th", 22)(59, PatientListComponent_td_59_Template, 11, 5, "td", 29);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵtemplate(60, PatientListComponent_tr_60_Template, 1, 0, "tr", 30)(61, PatientListComponent_tr_61_Template, 1, 0, "tr", 31)(62, PatientListComponent_tr_62_Template, 3, 1, "tr", 32);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(63, "mat-menu", null, 0);
            i0.ɵɵtemplate(65, PatientListComponent_ng_template_65_Template, 13, 2, "ng-template", 33);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(66, "mat-paginator", 34);
            i0.ɵɵlistener("page", function PatientListComponent_Template_mat_paginator_page_66_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onPageChange($event)); });
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(14, _c2, i0.ɵɵpureFunction0(12, _c0), i0.ɵɵpureFunction0(13, _c1)));
            i0.ɵɵadvance();
            i0.ɵɵproperty("appHasPermission", "Patients.Create");
            i0.ɵɵadvance(7);
            i0.ɵɵtwoWayProperty("value", ctx.filterStatus);
            i0.ɵɵadvance(10);
            i0.ɵɵtwoWayProperty("value", ctx.filterGender);
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("ngIf", ctx.hasActiveFilters());
            i0.ɵɵadvance();
            i0.ɵɵproperty("dataSource", ctx.patients);
            i0.ɵɵadvance(31);
            i0.ɵɵproperty("matHeaderRowDef", ctx.displayedColumns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.displayedColumns);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("length", ctx.totalCount)("pageSize", ctx.pageSize)("pageIndex", ctx.pageIndex)("pageSizeOptions", i0.ɵɵpureFunction0(17, _c3));
        } }, dependencies: [i5.NgIf, i1.RouterLink, i6.MatButton, i6.MatIconButton, i7.MatIcon, i8.MatFormField, i8.MatLabel, i9.MatSelect, i9.MatOption, i10.MatTable, i10.MatHeaderCellDef, i10.MatHeaderRowDef, i10.MatColumnDef, i10.MatCellDef, i10.MatRowDef, i10.MatHeaderCell, i10.MatCell, i10.MatHeaderRow, i10.MatRow, i10.MatNoDataRow, i11.MatPaginator, i12.MatSort, i12.MatSortHeader, i13.MatMenu, i13.MatMenuItem, i13.MatMenuContent, i13.MatMenuTrigger, i14.MatDivider, i15.MatTooltip, i16.PageHeaderComponent, i17.StatusBadgeComponent, i18.EmptyStateComponent, i19.SearchInputComponent, i20.MainLayoutComponent, i5.DatePipe, i21.PhonePipe], styles: [".filters[_ngcontent-%COMP%] {\n      display: flex;\n      gap: 1rem;\n      margin-bottom: 1rem;\n      flex-wrap: wrap;\n    }\n\n    .filters[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] {\n      width: 150px;\n    }\n\n    table[_ngcontent-%COMP%] {\n      width: 100%;\n    }\n\n    .patient-row[_ngcontent-%COMP%] {\n      cursor: pointer;\n    }\n\n    .patient-row[_ngcontent-%COMP%]:hover {\n      background: #f5f5f5;\n    }\n\n    .patient-name[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n    }\n\n    .patient-name[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n      font-weight: 500;\n    }\n\n    .patient-name[_ngcontent-%COMP%]   .email[_ngcontent-%COMP%] {\n      font-size: 0.75rem;\n      color: #666;\n    }\n\n    .blood-group[_ngcontent-%COMP%] {\n      background: #ffebee;\n      color: #c62828;\n      padding: 0.25rem 0.5rem;\n      border-radius: 4px;\n      font-size: 0.75rem;\n      font-weight: 500;\n    }\n\n    .no-data[_ngcontent-%COMP%] {\n      text-align: center;\n      padding: 2rem;\n    }\n\n    .delete-action[_ngcontent-%COMP%] {\n      color: #f44336;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PatientListComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-patient-list', template: `
    <app-main-layout>
      <app-page-header
        title="Patients"
        subtitle="Manage patient records"
        [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Patients' }]">
        <button mat-raised-button color="primary" routerLink="new" *appHasPermission="'Patients.Create'">
          <mat-icon>add</mat-icon>
          New Patient
        </button>
      </app-page-header>

      <div class="card">
        <div class="filters">
          <app-search-input
            placeholder="Search patients..."
            (search)="onSearch($event)">
          </app-search-input>

          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select [(value)]="filterStatus" (selectionChange)="loadPatients()">
              <mat-option value="">All</mat-option>
              <mat-option value="Active">Active</mat-option>
              <mat-option value="Inactive">Inactive</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Gender</mat-label>
            <mat-select [(value)]="filterGender" (selectionChange)="loadPatients()">
              <mat-option value="">All</mat-option>
              <mat-option value="Male">Male</mat-option>
              <mat-option value="Female">Female</mat-option>
              <mat-option value="Other">Other</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear Filters
          </button>
        </div>

        <table mat-table [dataSource]="patients" matSort (matSortChange)="onSort($event)">
          <ng-container matColumnDef="mrn">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>MRN</th>
            <td mat-cell *matCellDef="let patient">{{ patient.mrn }}</td>
          </ng-container>

          <ng-container matColumnDef="fullName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
            <td mat-cell *matCellDef="let patient">
              <div class="patient-name">
                <span class="name">{{ patient.fullName }}</span>
                <span class="email">{{ patient.email }}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="dateOfBirth">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Date of Birth</th>
            <td mat-cell *matCellDef="let patient">{{ patient.dateOfBirth | date:'mediumDate' }}</td>
          </ng-container>

          <ng-container matColumnDef="age">
            <th mat-header-cell *matHeaderCellDef>Age</th>
            <td mat-cell *matCellDef="let patient">{{ patient.age != null ? patient.age + ' yrs' : '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="gender">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Gender</th>
            <td mat-cell *matCellDef="let patient">{{ patient.gender }}</td>
          </ng-container>

          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Phone</th>
            <td mat-cell *matCellDef="let patient">{{ patient.phone | phone }}</td>
          </ng-container>

          <ng-container matColumnDef="bloodGroup">
            <th mat-header-cell *matHeaderCellDef>Blood Group</th>
            <td mat-cell *matCellDef="let patient">
              <span class="blood-group">{{ patient.bloodGroup }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="lastVisit">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Last Visit</th>
            <td mat-cell *matCellDef="let patient">
              {{ patient.lastVisit ? (patient.lastVisit | date:'mediumDate') : 'Never' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let patient">
              <app-status-badge [status]="patient.status"></app-status-badge>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let patient" (click)="$event.stopPropagation()">
              <button mat-icon-button matTooltip="View" (click)="viewPatient(patient)">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button matTooltip="Edit" [routerLink]="[patient.id, 'edit']" *appHasPermission="'Patients.Edit'">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" matTooltip="Delete patient" (click)="deletePatient(patient)">
                <mat-icon>delete</mat-icon>
              </button>
              <button mat-icon-button [matMenuTriggerFor]="actionMenu" [matMenuTriggerData]="{patient: patient}">
                <mat-icon>more_vert</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"
              class="patient-row"
              (click)="viewPatient(row)"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell no-data" [attr.colspan]="displayedColumns.length">
              <app-empty-state
                icon="people"
                title="No patients found"
                message="Try adjusting your search or filters"
                actionText="Add Patient"
                actionIcon="add"
                (action)="router.navigate(['/patients/new'])">
              </app-empty-state>
            </td>
          </tr>
        </table>

        <mat-menu #actionMenu="matMenu">
          <ng-template matMenuContent let-patient="patient">
            <button mat-menu-item (click)="viewPatient(patient)">
              <mat-icon>visibility</mat-icon>
              <span>View Details</span>
            </button>
            <button mat-menu-item [routerLink]="[patient.id, 'edit']" *appHasPermission="'Patients.Edit'">
              <mat-icon>edit</mat-icon>
              <span>Edit</span>
            </button>
            <button mat-menu-item (click)="bookAppointment(patient)" *appHasPermission="'Appointments.Create'">
              <mat-icon>event</mat-icon>
              <span>Book Appointment</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="deletePatient(patient)" class="delete-action">
              <mat-icon color="warn">delete</mat-icon>
              <span>Delete</span>
            </button>
          </ng-template>
        </mat-menu>

        <mat-paginator
          [length]="totalCount"
          [pageSize]="pageSize"
          [pageIndex]="pageIndex"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </div>
    </app-main-layout>
  `, styles: ["\n    .filters {\n      display: flex;\n      gap: 1rem;\n      margin-bottom: 1rem;\n      flex-wrap: wrap;\n    }\n\n    .filters mat-form-field {\n      width: 150px;\n    }\n\n    table {\n      width: 100%;\n    }\n\n    .patient-row {\n      cursor: pointer;\n    }\n\n    .patient-row:hover {\n      background: #f5f5f5;\n    }\n\n    .patient-name {\n      display: flex;\n      flex-direction: column;\n    }\n\n    .patient-name .name {\n      font-weight: 500;\n    }\n\n    .patient-name .email {\n      font-size: 0.75rem;\n      color: #666;\n    }\n\n    .blood-group {\n      background: #ffebee;\n      color: #c62828;\n      padding: 0.25rem 0.5rem;\n      border-radius: 4px;\n      font-size: 0.75rem;\n      font-weight: 500;\n    }\n\n    .no-data {\n      text-align: center;\n      padding: 2rem;\n    }\n\n    .delete-action {\n      color: #f44336;\n    }\n  "] }]
    }], () => [{ type: i1.Router }, { type: i2.ApiService }, { type: i3.MatDialog }, { type: i4.NotificationService }], { paginator: [{
            type: ViewChild,
            args: [MatPaginator]
        }], sort: [{
            type: ViewChild,
            args: [MatSort]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PatientListComponent, { className: "PatientListComponent", filePath: "app/features/patients/patient-list/patient-list.component.ts", lineNumber: 256 }); })();
//# sourceMappingURL=patient-list.component.js.map