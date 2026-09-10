import { Component } from '@angular/core';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../../../core/services/api.service";
import * as i3 from "../../../core/services/notification.service";
import * as i4 from "@angular/material/dialog";
import * as i5 from "@angular/common";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/material/list";
import * as i9 from "@angular/material/tabs";
import * as i10 from "@angular/material/chips";
import * as i11 from "../../../shared/components/loading-spinner/loading-spinner.component";
import * as i12 from "../../../shared/components/page-header/page-header.component";
import * as i13 from "../../../shared/components/status-badge/status-badge.component";
import * as i14 from "../../../layout/main-layout/main-layout.component";
import * as i15 from "../components/medical-history/medical-history.component";
import * as i16 from "../components/visit-history/visit-history.component";
import * as i17 from "../../../shared/pipes/phone.pipe";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Patients", route: "/patients" });
const _c2 = a0 => ({ label: a0 });
const _c3 = (a0, a1, a2) => [a0, a1, a2];
const _c4 = () => ["edit"];
function PatientDetailComponent_button_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 6)(1, "mat-icon");
    i0.ɵɵtext(2, "edit");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " Edit ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction0(1, _c4));
} }
function PatientDetailComponent_button_7_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 7);
    i0.ɵɵlistener("click", function PatientDetailComponent_button_7_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.bookAppointment()); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "event");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " Book Appointment ");
    i0.ɵɵelementEnd();
} }
function PatientDetailComponent_div_8_div_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 19)(1, "mat-icon");
    i0.ɵɵtext(2, "phone");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div")(4, "label");
    i0.ɵɵtext(5, "Alternate Phone");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span");
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "phone");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(8, 1, ctx_r1.patient.alternatePhone));
} }
function PatientDetailComponent_div_8_mat_divider_121_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "mat-divider");
} }
function PatientDetailComponent_div_8_div_122_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 17)(1, "h4");
    i0.ɵɵtext(2, "Insurance Information");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 18)(4, "div", 19)(5, "mat-icon");
    i0.ɵɵtext(6, "business");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div")(8, "label");
    i0.ɵɵtext(9, "Provider");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "span");
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(12, "div", 19)(13, "mat-icon");
    i0.ɵɵtext(14, "credit_card");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "div")(16, "label");
    i0.ɵɵtext(17, "Policy Number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "span");
    i0.ɵɵtext(19);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(11);
    i0.ɵɵtextInterpolate(ctx_r1.patient.insuranceProvider);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r1.patient.insurancePolicyNumber);
} }
function PatientDetailComponent_div_8_div_129_mat_chip_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-chip", 36);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const allergy_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", allergy_r3, " ");
} }
function PatientDetailComponent_div_8_div_129_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 34)(1, "mat-chip-listbox");
    i0.ɵɵtemplate(2, PatientDetailComponent_div_8_div_129_mat_chip_2_Template, 2, 1, "mat-chip", 35);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngForOf", ctx_r1.patient.allergies);
} }
function PatientDetailComponent_div_8_p_130_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 37);
    i0.ɵɵtext(1, "No known allergies");
    i0.ɵɵelementEnd();
} }
function PatientDetailComponent_div_8_div_134_mat_chip_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-chip");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const condition_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", condition_r4, " ");
} }
function PatientDetailComponent_div_8_div_134_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 34)(1, "mat-chip-listbox");
    i0.ɵɵtemplate(2, PatientDetailComponent_div_8_div_134_mat_chip_2_Template, 2, 1, "mat-chip", 38);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngForOf", ctx_r1.patient.chronicConditions);
} }
function PatientDetailComponent_div_8_p_135_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 37);
    i0.ɵɵtext(1, "No chronic conditions");
    i0.ɵɵelementEnd();
} }
function PatientDetailComponent_div_8_ng_template_143_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 39)(1, "p");
    i0.ɵɵtext(2, "Appointment history will be displayed here");
    i0.ɵɵelementEnd()();
} }
function PatientDetailComponent_div_8_ng_template_145_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 39)(1, "p");
    i0.ɵɵtext(2, "Billing history will be displayed here");
    i0.ɵɵelementEnd()();
} }
function PatientDetailComponent_div_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 8)(1, "div", 9)(2, "div", 10)(3, "div", 11)(4, "div", 12);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 13)(7, "h2");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 14)(10, "span")(11, "mat-icon");
    i0.ɵɵtext(12, "cake");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "span")(15, "mat-icon");
    i0.ɵɵtext(16, "wc");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "span", 15)(19, "mat-icon");
    i0.ɵɵtext(20, "bloodtype");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(22, "app-status-badge", 16);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(23, "mat-divider");
    i0.ɵɵelementStart(24, "div", 17)(25, "h4");
    i0.ɵɵtext(26, "Contact Information");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "div", 18)(28, "div", 19)(29, "mat-icon");
    i0.ɵɵtext(30, "phone");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "div")(32, "label");
    i0.ɵɵtext(33, "Phone");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "span");
    i0.ɵɵtext(35);
    i0.ɵɵpipe(36, "phone");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(37, PatientDetailComponent_div_8_div_37_Template, 9, 3, "div", 20);
    i0.ɵɵelementStart(38, "div", 19)(39, "mat-icon");
    i0.ɵɵtext(40, "email");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "div")(42, "label");
    i0.ɵɵtext(43, "Email");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "span");
    i0.ɵɵtext(45);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(46, "div", 19)(47, "mat-icon");
    i0.ɵɵtext(48, "location_on");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "div")(50, "label");
    i0.ɵɵtext(51, "Address");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(52, "span");
    i0.ɵɵtext(53);
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelement(54, "mat-divider");
    i0.ɵɵelementStart(55, "div", 17)(56, "h4");
    i0.ɵɵtext(57, "Personal Information");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(58, "div", 18)(59, "div", 19)(60, "mat-icon");
    i0.ɵɵtext(61, "badge");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(62, "div")(63, "label");
    i0.ɵɵtext(64, "National ID");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(65, "span");
    i0.ɵɵtext(66);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(67, "div", 19)(68, "mat-icon");
    i0.ɵɵtext(69, "favorite");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(70, "div")(71, "label");
    i0.ɵɵtext(72, "Marital Status");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(73, "span");
    i0.ɵɵtext(74);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(75, "div", 19)(76, "mat-icon");
    i0.ɵɵtext(77, "work");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(78, "div")(79, "label");
    i0.ɵɵtext(80, "Occupation");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(81, "span");
    i0.ɵɵtext(82);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(83, "div", 19)(84, "mat-icon");
    i0.ɵɵtext(85, "public");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(86, "div")(87, "label");
    i0.ɵɵtext(88, "Nationality");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(89, "span");
    i0.ɵɵtext(90);
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelement(91, "mat-divider");
    i0.ɵɵelementStart(92, "div", 17)(93, "h4");
    i0.ɵɵtext(94, "Emergency Contact");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(95, "div", 18)(96, "div", 19)(97, "mat-icon");
    i0.ɵɵtext(98, "person");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(99, "div")(100, "label");
    i0.ɵɵtext(101, "Name");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(102, "span");
    i0.ɵɵtext(103);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(104, "div", 19)(105, "mat-icon");
    i0.ɵɵtext(106, "phone");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(107, "div")(108, "label");
    i0.ɵɵtext(109, "Phone");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(110, "span");
    i0.ɵɵtext(111);
    i0.ɵɵpipe(112, "phone");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(113, "div", 19)(114, "mat-icon");
    i0.ɵɵtext(115, "family_restroom");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(116, "div")(117, "label");
    i0.ɵɵtext(118, "Relationship");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(119, "span");
    i0.ɵɵtext(120);
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵtemplate(121, PatientDetailComponent_div_8_mat_divider_121_Template, 1, 0, "mat-divider", 21)(122, PatientDetailComponent_div_8_div_122_Template, 20, 2, "div", 22);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(123, "div", 23)(124, "h3");
    i0.ɵɵtext(125, "Medical Information");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(126, "div", 24)(127, "h4");
    i0.ɵɵtext(128, "Allergies");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(129, PatientDetailComponent_div_8_div_129_Template, 3, 1, "div", 25)(130, PatientDetailComponent_div_8_p_130_Template, 2, 0, "p", 26);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(131, "div", 24)(132, "h4");
    i0.ɵɵtext(133, "Chronic Conditions");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(134, PatientDetailComponent_div_8_div_134_Template, 3, 1, "div", 25)(135, PatientDetailComponent_div_8_p_135_Template, 2, 0, "p", 26);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(136, "div", 27)(137, "mat-tab-group")(138, "mat-tab", 28);
    i0.ɵɵelement(139, "app-visit-history", 29);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(140, "mat-tab", 30);
    i0.ɵɵelement(141, "app-medical-history", 29);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(142, "mat-tab", 31);
    i0.ɵɵtemplate(143, PatientDetailComponent_div_8_ng_template_143_Template, 3, 0, "ng-template", 32);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(144, "mat-tab", 33);
    i0.ɵɵtemplate(145, PatientDetailComponent_div_8_ng_template_145_Template, 3, 0, "ng-template", 32);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.getInitials(), " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.patient.fullName);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.patient.age, " years old");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.patient.gender, "");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.patient.bloodGroup, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", ctx_r1.patient.status);
    i0.ɵɵadvance(13);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(36, 28, ctx_r1.patient.phone));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.patient.alternatePhone);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r1.patient.email);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate4("", ctx_r1.patient.address, ", ", ctx_r1.patient.city, ", ", ctx_r1.patient.state, " ", ctx_r1.patient.postalCode, "");
    i0.ɵɵadvance(13);
    i0.ɵɵtextInterpolate(ctx_r1.patient.nationalId);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r1.patient.maritalStatus);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r1.patient.occupation || "Not specified");
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r1.patient.nationality);
    i0.ɵɵadvance(13);
    i0.ɵɵtextInterpolate(ctx_r1.patient.emergencyContactName);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(112, 30, ctx_r1.patient.emergencyContactPhone));
    i0.ɵɵadvance(9);
    i0.ɵɵtextInterpolate(ctx_r1.patient.emergencyContactRelation);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.patient.insuranceProvider);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.patient.insuranceProvider);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("ngIf", ctx_r1.patient.allergies == null ? null : ctx_r1.patient.allergies.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !(ctx_r1.patient.allergies == null ? null : ctx_r1.patient.allergies.length));
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", ctx_r1.patient.chronicConditions == null ? null : ctx_r1.patient.chronicConditions.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !(ctx_r1.patient.chronicConditions == null ? null : ctx_r1.patient.chronicConditions.length));
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("patientId", ctx_r1.patient.id);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("patientId", ctx_r1.patient.id);
} }
function PatientDetailComponent_app_loading_spinner_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-loading-spinner", 40);
} if (rf & 2) {
    i0.ɵɵproperty("overlay", true);
} }
export class PatientDetailComponent {
    constructor(route, router, api, notification, dialog) {
        this.route = route;
        this.router = router;
        this.api = api;
        this.notification = notification;
        this.dialog = dialog;
        this.patient = null;
        this.loading = true;
    }
    ngOnInit() {
        const patientId = this.route.snapshot.paramMap.get('id');
        if (patientId) {
            this.loadPatient(patientId);
        }
    }
    loadPatient(id) {
        this.loading = true;
        this.api.getById('v1/patients', id).subscribe({
            next: (patient) => {
                this.patient = {
                    ...patient,
                    age: patient.age ?? this.calculateAge(patient.dateOfBirth)
                };
                this.loading = false;
            },
            error: () => {
                this.notification.error('Failed to load patient details');
                this.router.navigate(['/patients']);
            }
        });
    }
    getInitials() {
        if (!this.patient)
            return '';
        return (this.patient.firstName.charAt(0) + this.patient.lastName.charAt(0)).toUpperCase();
    }
    bookAppointment() {
        this.router.navigate(['/appointments/new'], {
            queryParams: { patientId: this.patient?.id }
        });
    }
    calculateAge(dateOfBirth) {
        if (!dateOfBirth)
            return 0;
        const dob = new Date(dateOfBirth);
        if (isNaN(dob.getTime()))
            return 0;
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return Math.max(age, 0);
    }
    deletePatient() {
        if (!this.patient)
            return;
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Delete Patient',
                message: `Are you sure you want to delete ${this.patient.fullName}? This action cannot be undone.`,
                confirmText: 'Delete',
                confirmColor: 'warn'
            }
        });
        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed && this.patient) {
                this.api.delete('v1/patients', this.patient.id).subscribe({
                    next: () => {
                        this.notification.success('Patient deleted successfully');
                        this.router.navigate(['/patients']);
                    }
                });
            }
        });
    }
    static { this.ɵfac = function PatientDetailComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PatientDetailComponent)(i0.ɵɵdirectiveInject(i1.ActivatedRoute), i0.ɵɵdirectiveInject(i1.Router), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.NotificationService), i0.ɵɵdirectiveInject(i4.MatDialog)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PatientDetailComponent, selectors: [["app-patient-detail"]], standalone: false, decls: 10, vars: 15, consts: [[3, "title", "subtitle", "breadcrumbs"], ["mat-stroked-button", "", "color", "warn", 3, "click"], ["mat-stroked-button", "", 3, "routerLink", 4, "appHasPermission"], ["mat-raised-button", "", "color", "primary", 3, "click", 4, "appHasPermission"], ["class", "patient-detail", 4, "ngIf"], [3, "overlay", 4, "ngIf"], ["mat-stroked-button", "", 3, "routerLink"], ["mat-raised-button", "", "color", "primary", 3, "click"], [1, "patient-detail"], [1, "detail-grid"], [1, "card", "info-card"], [1, "patient-header"], [1, "avatar"], [1, "header-info"], [1, "meta"], [1, "blood-group"], [3, "status"], [1, "info-section"], [1, "info-grid"], [1, "info-item"], ["class", "info-item", 4, "ngIf"], [4, "ngIf"], ["class", "info-section", 4, "ngIf"], [1, "card", "medical-card"], [1, "medical-section"], ["class", "chips", 4, "ngIf"], ["class", "no-data", 4, "ngIf"], [1, "card", "history-card"], ["label", "Visit History"], [3, "patientId"], ["label", "Medical History"], ["label", "Appointments"], ["matTabContent", ""], ["label", "Billing"], [1, "chips"], ["color", "warn", 4, "ngFor", "ngForOf"], ["color", "warn"], [1, "no-data"], [4, "ngFor", "ngForOf"], [1, "tab-content"], [3, "overlay"]], template: function PatientDetailComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 0)(2, "button", 1);
            i0.ɵɵlistener("click", function PatientDetailComponent_Template_button_click_2_listener() { return ctx.deletePatient(); });
            i0.ɵɵelementStart(3, "mat-icon");
            i0.ɵɵtext(4, "delete");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " Delete ");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(6, PatientDetailComponent_button_6_Template, 4, 2, "button", 2)(7, PatientDetailComponent_button_7_Template, 4, 0, "button", 3);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(8, PatientDetailComponent_div_8_Template, 146, 32, "div", 4)(9, PatientDetailComponent_app_loading_spinner_9_Template, 1, 1, "app-loading-spinner", 5);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("title", (ctx.patient == null ? null : ctx.patient.fullName) || "Patient Details")("subtitle", "MRN: " + ((ctx.patient == null ? null : ctx.patient.mrn) || ""))("breadcrumbs", i0.ɵɵpureFunction3(11, _c3, i0.ɵɵpureFunction0(7, _c0), i0.ɵɵpureFunction0(8, _c1), i0.ɵɵpureFunction1(9, _c2, (ctx.patient == null ? null : ctx.patient.fullName) || "Details")));
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("appHasPermission", "Patients.Edit");
            i0.ɵɵadvance();
            i0.ɵɵproperty("appHasPermission", "Appointments.Create");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.patient);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.loading);
        } }, dependencies: [i5.NgForOf, i5.NgIf, i1.RouterLink, i6.MatButton, i7.MatIcon, i8.MatDivider, i9.MatTabContent, i9.MatTab, i9.MatTabGroup, i10.MatChip, i10.MatChipListbox, i11.LoadingSpinnerComponent, i12.PageHeaderComponent, i13.StatusBadgeComponent, i14.MainLayoutComponent, i15.MedicalHistoryComponent, i16.VisitHistoryComponent, i17.PhonePipe], styles: [".detail-grid[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: 2fr 1fr;\n      gap: 1.5rem;\n      margin-bottom: 1.5rem;\n    }\n\n    .card[_ngcontent-%COMP%] {\n      background: white;\n      border-radius: 8px;\n      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n      padding: 1.5rem;\n    }\n\n    .patient-header[_ngcontent-%COMP%] {\n      display: flex;\n      gap: 1.5rem;\n      align-items: flex-start;\n      margin-bottom: 1.5rem;\n    }\n\n    .avatar[_ngcontent-%COMP%] {\n      width: 80px;\n      height: 80px;\n      border-radius: 50%;\n      background: #3f51b5;\n      color: white;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-size: 2rem;\n      font-weight: 600;\n    }\n\n    .header-info[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n      margin: 0 0 0.5rem;\n    }\n\n    .meta[_ngcontent-%COMP%] {\n      display: flex;\n      gap: 1rem;\n      color: #666;\n      font-size: 0.875rem;\n      margin-bottom: 0.5rem;\n    }\n\n    .meta[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.25rem;\n    }\n\n    .meta[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      font-size: 16px;\n      width: 16px;\n      height: 16px;\n    }\n\n    .blood-group[_ngcontent-%COMP%] {\n      color: #c62828;\n      font-weight: 500;\n    }\n\n    .info-section[_ngcontent-%COMP%] {\n      padding: 1rem 0;\n    }\n\n    .info-section[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n      margin: 0 0 1rem;\n      color: #333;\n      font-weight: 600;\n    }\n\n    .info-grid[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: repeat(2, 1fr);\n      gap: 1rem;\n    }\n\n    .info-item[_ngcontent-%COMP%] {\n      display: flex;\n      gap: 0.75rem;\n    }\n\n    .info-item[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      color: #666;\n    }\n\n    .info-item[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n      display: block;\n      font-size: 0.75rem;\n      color: #666;\n    }\n\n    .info-item[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n      font-weight: 500;\n    }\n\n    .medical-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n      margin: 0 0 1.5rem;\n    }\n\n    .medical-section[_ngcontent-%COMP%] {\n      margin-bottom: 1.5rem;\n    }\n\n    .medical-section[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n      margin: 0 0 0.5rem;\n      font-size: 0.875rem;\n      color: #666;\n    }\n\n    .no-data[_ngcontent-%COMP%] {\n      color: #999;\n      font-style: italic;\n    }\n\n    .history-card[_ngcontent-%COMP%] {\n      margin-top: 1.5rem;\n    }\n\n    .tab-content[_ngcontent-%COMP%] {\n      padding: 1.5rem;\n    }\n\n    @media (max-width: 992px) {\n      .detail-grid[_ngcontent-%COMP%] {\n        grid-template-columns: 1fr;\n      }\n\n      .info-grid[_ngcontent-%COMP%] {\n        grid-template-columns: 1fr;\n      }\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PatientDetailComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-patient-detail', template: `
    <app-main-layout>
      <app-page-header
        [title]="patient?.fullName || 'Patient Details'"
        [subtitle]="'MRN: ' + (patient?.mrn || '')"
        [breadcrumbs]="[
          { label: 'Dashboard', route: '/dashboard' },
          { label: 'Patients', route: '/patients' },
          { label: patient?.fullName || 'Details' }
        ]">
        <button mat-stroked-button color="warn" (click)="deletePatient()">
          <mat-icon>delete</mat-icon>
          Delete
        </button>
        <button mat-stroked-button [routerLink]="['edit']" *appHasPermission="'Patients.Edit'">
          <mat-icon>edit</mat-icon>
          Edit
        </button>
        <button mat-raised-button color="primary" (click)="bookAppointment()" *appHasPermission="'Appointments.Create'">
          <mat-icon>event</mat-icon>
          Book Appointment
        </button>
      </app-page-header>

      <div class="patient-detail" *ngIf="patient">
        <div class="detail-grid">
          <!-- Patient Info Card -->
          <div class="card info-card">
            <div class="patient-header">
              <div class="avatar">
                {{ getInitials() }}
              </div>
              <div class="header-info">
                <h2>{{ patient.fullName }}</h2>
                <div class="meta">
                  <span><mat-icon>cake</mat-icon> {{ patient.age }} years old</span>
                  <span><mat-icon>wc</mat-icon> {{ patient.gender }}</span>
                  <span class="blood-group"><mat-icon>bloodtype</mat-icon> {{ patient.bloodGroup }}</span>
                </div>
                <app-status-badge [status]="patient.status"></app-status-badge>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="info-section">
              <h4>Contact Information</h4>
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>phone</mat-icon>
                  <div>
                    <label>Phone</label>
                    <span>{{ patient.phone | phone }}</span>
                  </div>
                </div>
                <div class="info-item" *ngIf="patient.alternatePhone">
                  <mat-icon>phone</mat-icon>
                  <div>
                    <label>Alternate Phone</label>
                    <span>{{ patient.alternatePhone | phone }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>email</mat-icon>
                  <div>
                    <label>Email</label>
                    <span>{{ patient.email }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>location_on</mat-icon>
                  <div>
                    <label>Address</label>
                    <span>{{ patient.address }}, {{ patient.city }}, {{ patient.state }} {{ patient.postalCode }}</span>
                  </div>
                </div>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="info-section">
              <h4>Personal Information</h4>
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>badge</mat-icon>
                  <div>
                    <label>National ID</label>
                    <span>{{ patient.nationalId }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>favorite</mat-icon>
                  <div>
                    <label>Marital Status</label>
                    <span>{{ patient.maritalStatus }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>work</mat-icon>
                  <div>
                    <label>Occupation</label>
                    <span>{{ patient.occupation || 'Not specified' }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>public</mat-icon>
                  <div>
                    <label>Nationality</label>
                    <span>{{ patient.nationality }}</span>
                  </div>
                </div>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="info-section">
              <h4>Emergency Contact</h4>
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>person</mat-icon>
                  <div>
                    <label>Name</label>
                    <span>{{ patient.emergencyContactName }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>phone</mat-icon>
                  <div>
                    <label>Phone</label>
                    <span>{{ patient.emergencyContactPhone | phone }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>family_restroom</mat-icon>
                  <div>
                    <label>Relationship</label>
                    <span>{{ patient.emergencyContactRelation }}</span>
                  </div>
                </div>
              </div>
            </div>

            <mat-divider *ngIf="patient.insuranceProvider"></mat-divider>

            <div class="info-section" *ngIf="patient.insuranceProvider">
              <h4>Insurance Information</h4>
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>business</mat-icon>
                  <div>
                    <label>Provider</label>
                    <span>{{ patient.insuranceProvider }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>credit_card</mat-icon>
                  <div>
                    <label>Policy Number</label>
                    <span>{{ patient.insurancePolicyNumber }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Medical Info Card -->
          <div class="card medical-card">
            <h3>Medical Information</h3>

            <div class="medical-section">
              <h4>Allergies</h4>
              <div class="chips" *ngIf="patient.allergies?.length">
                <mat-chip-listbox>
                  <mat-chip *ngFor="let allergy of patient.allergies" color="warn">
                    {{ allergy }}
                  </mat-chip>
                </mat-chip-listbox>
              </div>
              <p *ngIf="!patient.allergies?.length" class="no-data">No known allergies</p>
            </div>

            <div class="medical-section">
              <h4>Chronic Conditions</h4>
              <div class="chips" *ngIf="patient.chronicConditions?.length">
                <mat-chip-listbox>
                  <mat-chip *ngFor="let condition of patient.chronicConditions">
                    {{ condition }}
                  </mat-chip>
                </mat-chip-listbox>
              </div>
              <p *ngIf="!patient.chronicConditions?.length" class="no-data">No chronic conditions</p>
            </div>
          </div>
        </div>

        <!-- Tabs for History -->
        <div class="card history-card">
          <mat-tab-group>
            <mat-tab label="Visit History">
              <app-visit-history [patientId]="patient.id"></app-visit-history>
            </mat-tab>
            <mat-tab label="Medical History">
              <app-medical-history [patientId]="patient.id"></app-medical-history>
            </mat-tab>
            <mat-tab label="Appointments">
              <ng-template matTabContent>
                <!-- Appointments content -->
                <div class="tab-content">
                  <p>Appointment history will be displayed here</p>
                </div>
              </ng-template>
            </mat-tab>
            <mat-tab label="Billing">
              <ng-template matTabContent>
                <!-- Billing content -->
                <div class="tab-content">
                  <p>Billing history will be displayed here</p>
                </div>
              </ng-template>
            </mat-tab>
          </mat-tab-group>
        </div>
      </div>

      <app-loading-spinner *ngIf="loading" [overlay]="true"></app-loading-spinner>
    </app-main-layout>
  `, styles: ["\n    .detail-grid {\n      display: grid;\n      grid-template-columns: 2fr 1fr;\n      gap: 1.5rem;\n      margin-bottom: 1.5rem;\n    }\n\n    .card {\n      background: white;\n      border-radius: 8px;\n      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n      padding: 1.5rem;\n    }\n\n    .patient-header {\n      display: flex;\n      gap: 1.5rem;\n      align-items: flex-start;\n      margin-bottom: 1.5rem;\n    }\n\n    .avatar {\n      width: 80px;\n      height: 80px;\n      border-radius: 50%;\n      background: #3f51b5;\n      color: white;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-size: 2rem;\n      font-weight: 600;\n    }\n\n    .header-info h2 {\n      margin: 0 0 0.5rem;\n    }\n\n    .meta {\n      display: flex;\n      gap: 1rem;\n      color: #666;\n      font-size: 0.875rem;\n      margin-bottom: 0.5rem;\n    }\n\n    .meta span {\n      display: flex;\n      align-items: center;\n      gap: 0.25rem;\n    }\n\n    .meta mat-icon {\n      font-size: 16px;\n      width: 16px;\n      height: 16px;\n    }\n\n    .blood-group {\n      color: #c62828;\n      font-weight: 500;\n    }\n\n    .info-section {\n      padding: 1rem 0;\n    }\n\n    .info-section h4 {\n      margin: 0 0 1rem;\n      color: #333;\n      font-weight: 600;\n    }\n\n    .info-grid {\n      display: grid;\n      grid-template-columns: repeat(2, 1fr);\n      gap: 1rem;\n    }\n\n    .info-item {\n      display: flex;\n      gap: 0.75rem;\n    }\n\n    .info-item mat-icon {\n      color: #666;\n    }\n\n    .info-item label {\n      display: block;\n      font-size: 0.75rem;\n      color: #666;\n    }\n\n    .info-item span {\n      font-weight: 500;\n    }\n\n    .medical-card h3 {\n      margin: 0 0 1.5rem;\n    }\n\n    .medical-section {\n      margin-bottom: 1.5rem;\n    }\n\n    .medical-section h4 {\n      margin: 0 0 0.5rem;\n      font-size: 0.875rem;\n      color: #666;\n    }\n\n    .no-data {\n      color: #999;\n      font-style: italic;\n    }\n\n    .history-card {\n      margin-top: 1.5rem;\n    }\n\n    .tab-content {\n      padding: 1.5rem;\n    }\n\n    @media (max-width: 992px) {\n      .detail-grid {\n        grid-template-columns: 1fr;\n      }\n\n      .info-grid {\n        grid-template-columns: 1fr;\n      }\n    }\n  "] }]
    }], () => [{ type: i1.ActivatedRoute }, { type: i1.Router }, { type: i2.ApiService }, { type: i3.NotificationService }, { type: i4.MatDialog }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PatientDetailComponent, { className: "PatientDetailComponent", filePath: "app/features/patients/patient-detail/patient-detail.component.ts", lineNumber: 411 }); })();
//# sourceMappingURL=patient-detail.component.js.map