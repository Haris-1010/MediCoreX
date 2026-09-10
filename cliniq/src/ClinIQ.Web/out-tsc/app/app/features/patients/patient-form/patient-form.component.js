import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@angular/router";
import * as i3 from "../../../core/services/api.service";
import * as i4 from "../../../core/services/notification.service";
import * as i5 from "@angular/common";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/material/input";
import * as i9 from "@angular/material/select";
import * as i10 from "@angular/material/datepicker";
import * as i11 from "@angular/material/list";
import * as i12 from "@angular/material/progress-spinner";
import * as i13 from "@angular/material/chips";
import * as i14 from "../../../shared/components/page-header/page-header.component";
import * as i15 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Patients", route: "/patients" });
const _c2 = a0 => ({ label: a0 });
const _c3 = (a0, a1, a2) => [a0, a1, a2];
function PatientFormComponent_div_95_mat_chip_row_78_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-chip-row", 61);
    i0.ɵɵlistener("removed", function PatientFormComponent_div_95_mat_chip_row_78_Template_mat_chip_row_removed_0_listener() { const allergy_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r4 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r4.removeAllergy(allergy_r4)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementStart(2, "button", 62)(3, "mat-icon");
    i0.ɵɵtext(4, "cancel");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const allergy_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", allergy_r4, " ");
} }
function PatientFormComponent_div_95_mat_chip_row_85_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-chip-row", 61);
    i0.ɵɵlistener("removed", function PatientFormComponent_div_95_mat_chip_row_85_Template_mat_chip_row_removed_0_listener() { const condition_r7 = i0.ɵɵrestoreView(_r6).$implicit; const ctx_r4 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r4.removeCondition(condition_r7)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementStart(2, "button", 62)(3, "mat-icon");
    i0.ɵɵtext(4, "cancel");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const condition_r7 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", condition_r7, " ");
} }
function PatientFormComponent_div_95_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 40);
    i0.ɵɵelement(1, "mat-divider");
    i0.ɵɵelementStart(2, "h4");
    i0.ɵɵtext(3, "Contact Details");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 8)(5, "mat-form-field", 9)(6, "mat-label");
    i0.ɵɵtext(7, "Email");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(8, "input", 41);
    i0.ɵɵelementStart(9, "mat-icon", 13);
    i0.ɵɵtext(10, "email");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "mat-form-field", 9)(12, "mat-label");
    i0.ɵɵtext(13, "Alternate Phone");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(14, "input", 42);
    i0.ɵɵelementStart(15, "mat-icon", 13);
    i0.ɵɵtext(16, "phone");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(17, "div", 8)(18, "mat-form-field", 43)(19, "mat-label");
    i0.ɵɵtext(20, "Address");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(21, "input", 44);
    i0.ɵɵelementStart(22, "mat-icon", 13);
    i0.ɵɵtext(23, "location_on");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(24, "div", 8)(25, "mat-form-field", 9)(26, "mat-label");
    i0.ɵɵtext(27, "City");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(28, "input", 45);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "mat-form-field", 9)(30, "mat-label");
    i0.ɵɵtext(31, "State");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(32, "input", 46);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(33, "mat-divider");
    i0.ɵɵelementStart(34, "h4");
    i0.ɵɵtext(35, "Emergency Contact");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "div", 8)(37, "mat-form-field", 9)(38, "mat-label");
    i0.ɵɵtext(39, "Contact Name");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(40, "input", 47);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "mat-form-field", 9)(42, "mat-label");
    i0.ɵɵtext(43, "Contact Phone");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(44, "input", 48);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "mat-form-field", 9)(46, "mat-label");
    i0.ɵɵtext(47, "Relationship");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "mat-select", 49)(49, "mat-option", 50);
    i0.ɵɵtext(50, "Spouse");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(51, "mat-option", 51);
    i0.ɵɵtext(52, "Parent");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(53, "mat-option", 52);
    i0.ɵɵtext(54, "Sibling");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(55, "mat-option", 53);
    i0.ɵɵtext(56, "Child");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(57, "mat-option", 54);
    i0.ɵɵtext(58, "Friend");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(59, "mat-option", 17);
    i0.ɵɵtext(60, "Other");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelement(61, "mat-divider");
    i0.ɵɵelementStart(62, "h4");
    i0.ɵɵtext(63, "Medical Information");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(64, "div", 8)(65, "mat-form-field", 9)(66, "mat-label");
    i0.ɵɵtext(67, "National ID");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(68, "input", 55);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(69, "mat-form-field", 9)(70, "mat-label");
    i0.ɵɵtext(71, "Occupation");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(72, "input", 56);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(73, "div", 57)(74, "label");
    i0.ɵɵtext(75, "Allergies");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(76, "mat-chip-grid", null, 1);
    i0.ɵɵtemplate(78, PatientFormComponent_div_95_mat_chip_row_78_Template, 5, 1, "mat-chip-row", 58);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(79, "input", 59);
    i0.ɵɵlistener("matChipInputTokenEnd", function PatientFormComponent_div_95_Template_input_matChipInputTokenEnd_79_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r4 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r4.addAllergy($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(80, "div", 57)(81, "label");
    i0.ɵɵtext(82, "Chronic Conditions");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(83, "mat-chip-grid", null, 2);
    i0.ɵɵtemplate(85, PatientFormComponent_div_95_mat_chip_row_85_Template, 5, 1, "mat-chip-row", 58);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(86, "input", 60);
    i0.ɵɵlistener("matChipInputTokenEnd", function PatientFormComponent_div_95_Template_input_matChipInputTokenEnd_86_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r4 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r4.addCondition($event)); });
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const allergyChipGrid_r8 = i0.ɵɵreference(77);
    const conditionChipGrid_r9 = i0.ɵɵreference(84);
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵadvance(78);
    i0.ɵɵproperty("ngForOf", ctx_r4.allergies);
    i0.ɵɵadvance();
    i0.ɵɵproperty("matChipInputFor", allergyChipGrid_r8);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngForOf", ctx_r4.chronicConditions);
    i0.ɵɵadvance();
    i0.ɵɵproperty("matChipInputFor", conditionChipGrid_r9);
} }
function PatientFormComponent_mat_spinner_102_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "mat-spinner", 63);
} }
function PatientFormComponent_span_103_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span")(1, "mat-icon");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r4.isEditMode ? "save" : "person_add");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r4.isEditMode ? "Update Patient" : "Register Patient", " ");
} }
export class PatientFormComponent {
    constructor(fb, route, router, api, notification) {
        this.fb = fb;
        this.route = route;
        this.router = router;
        this.api = api;
        this.notification = notification;
        this.isEditMode = false;
        this.patientId = null;
        this.saving = false;
        this.showOptional = false;
        this.allergies = [];
        this.chronicConditions = [];
        this.destroy$ = new Subject();
        this.syncingDobAge = false;
    }
    ngOnInit() {
        this.initForm();
        this.patientId = this.route.snapshot.paramMap.get('id');
        if (this.patientId) {
            this.isEditMode = true;
            this.loadPatient(this.patientId);
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    initForm() {
        this.patientForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phone: ['', Validators.required],
            gender: ['', Validators.required],
            dateOfBirth: [''],
            age: [null],
            bloodGroup: [''],
            email: [''],
            alternatePhone: [''],
            address: [''],
            city: [''],
            state: [''],
            nationalId: [''],
            occupation: [''],
            emergencyContactName: [''],
            emergencyContactPhone: [''],
            emergencyContactRelation: ['']
        });
        this.patientForm.get('dateOfBirth').valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(dob => {
            if (this.syncingDobAge)
                return;
            this.syncingDobAge = true;
            this.patientForm.patchValue({ age: this.calculateAge(dob) }, { emitEvent: false });
            this.syncingDobAge = false;
        });
        this.patientForm.get('age').valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(age => {
            if (this.syncingDobAge)
                return;
            this.syncingDobAge = true;
            const years = age === null || age === '' ? null : Number(age);
            this.patientForm.patchValue({
                dateOfBirth: years !== null && !isNaN(years) && years >= 0 ? this.dateFromAge(years) : null
            }, { emitEvent: false });
            this.syncingDobAge = false;
        });
    }
    loadPatient(id) {
        this.api.getById('v1/patients', id).subscribe({
            next: (patient) => {
                this.patientForm.patchValue({
                    firstName: patient.firstName,
                    lastName: patient.lastName,
                    phone: patient.phone,
                    gender: patient.gender,
                    dateOfBirth: patient.dateOfBirth,
                    age: patient.age ?? this.calculateAge(patient.dateOfBirth),
                    bloodGroup: patient.bloodGroup,
                    email: patient.email,
                    alternatePhone: patient.alternatePhone,
                    address: patient.address,
                    city: patient.city,
                    state: patient.state,
                    nationalId: patient.nationalId,
                    occupation: patient.occupation,
                    emergencyContactName: patient.emergencyContactName,
                    emergencyContactPhone: patient.emergencyContactPhone,
                    emergencyContactRelation: patient.emergencyContactRelation
                });
                this.allergies = patient.allergies || [];
                this.chronicConditions = patient.chronicConditions || [];
                this.showOptional = true;
            }
        });
    }
    addAllergy(event) {
        const value = (event.value || '').trim();
        if (value && !this.allergies.includes(value)) {
            this.allergies.push(value);
        }
        event.chipInput?.clear();
    }
    removeAllergy(allergy) {
        const index = this.allergies.indexOf(allergy);
        if (index >= 0) {
            this.allergies.splice(index, 1);
        }
    }
    addCondition(event) {
        const value = (event.value || '').trim();
        if (value && !this.chronicConditions.includes(value)) {
            this.chronicConditions.push(value);
        }
        event.chipInput?.clear();
    }
    removeCondition(condition) {
        const index = this.chronicConditions.indexOf(condition);
        if (index >= 0) {
            this.chronicConditions.splice(index, 1);
        }
    }
    goBack() {
        this.router.navigate(['/patients']);
    }
    calculateAge(dateOfBirth) {
        if (!dateOfBirth)
            return null;
        const dob = new Date(dateOfBirth);
        if (isNaN(dob.getTime()))
            return null;
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age < 0 ? null : age;
    }
    dateFromAge(age) {
        const today = new Date();
        return new Date(today.getFullYear() - age, today.getMonth(), today.getDate());
    }
    onSubmit() {
        if (this.patientForm.invalid || this.saving)
            return;
        this.saving = true;
        this.patientForm.disable();
        const formValue = this.patientForm.getRawValue();
        const payload = {
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            phone: formValue.phone,
            gender: formValue.gender,
            dateOfBirth: formValue.dateOfBirth || null,
            age: formValue.age === '' || formValue.age === null ? null : Number(formValue.age),
            bloodGroup: formValue.bloodGroup || null,
            email: formValue.email || null,
            alternatePhone: formValue.alternatePhone || null,
            address: formValue.address || null,
            city: formValue.city || null,
            state: formValue.state || null,
            nationalId: formValue.nationalId || null,
            occupation: formValue.occupation || null,
            emergencyContactName: formValue.emergencyContactName || null,
            emergencyContactPhone: formValue.emergencyContactPhone || null,
            emergencyContactRelation: formValue.emergencyContactRelation || null,
            allergies: this.allergies.length > 0 ? this.allergies : null,
            chronicConditions: this.chronicConditions.length > 0 ? this.chronicConditions : null
        };
        const request = this.isEditMode
            ? this.api.put('v1/patients', this.patientId, payload)
            : this.api.post('v1/patients', payload);
        request.subscribe({
            next: (result) => {
                this.notification.success(this.isEditMode ? 'Patient updated successfully' : 'Patient registered successfully');
                this.router.navigate(['/patients']);
            },
            error: () => {
                this.saving = false;
                this.patientForm.enable();
            },
            complete: () => {
                this.saving = false;
            }
        });
    }
    static { this.ɵfac = function PatientFormComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PatientFormComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ActivatedRoute), i0.ɵɵdirectiveInject(i2.Router), i0.ɵɵdirectiveInject(i3.ApiService), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PatientFormComponent, selectors: [["app-patient-form"]], standalone: false, decls: 104, vars: 20, consts: [["dobPicker", ""], ["allergyChipGrid", ""], ["conditionChipGrid", ""], [3, "title", "subtitle", "breadcrumbs"], [3, "ngSubmit", "formGroup"], [1, "card", "required-card"], [1, "card-header-row"], [1, "required-badge"], [1, "form-row"], ["appearance", "outline"], ["matInput", "", "formControlName", "firstName", "placeholder", "Enter first name"], ["matInput", "", "formControlName", "lastName", "placeholder", "Enter last name"], ["matInput", "", "formControlName", "phone", "placeholder", "+92-300-1234567"], ["matPrefix", ""], ["formControlName", "gender"], ["value", "Male"], ["value", "Female"], ["value", "Other"], ["matInput", "", "formControlName", "dateOfBirth", "placeholder", "Select date of birth", 3, "matDatepicker"], ["matIconSuffix", "", 3, "for"], ["matInput", "", "type", "number", "min", "0", "max", "150", "formControlName", "age", "placeholder", "e.g. 35"], ["formControlName", "bloodGroup"], ["value", ""], ["value", "A+"], ["value", "A-"], ["value", "B+"], ["value", "B-"], ["value", "AB+"], ["value", "AB-"], ["value", "O+"], ["value", "O-"], [1, "card", "optional-card"], ["type", "button", 1, "expand-toggle", 3, "click"], [1, "toggle-hint"], ["class", "optional-fields", 4, "ngIf"], [1, "action-buttons"], ["mat-stroked-button", "", "type", "button", 3, "click"], ["mat-raised-button", "", "color", "primary", "type", "submit", 3, "disabled"], ["diameter", "20", 4, "ngIf"], [4, "ngIf"], [1, "optional-fields"], ["matInput", "", "type", "email", "formControlName", "email", "placeholder", "patient@email.com"], ["matInput", "", "formControlName", "alternatePhone", "placeholder", "+92-321-1234567"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "formControlName", "address", "placeholder", "Street address"], ["matInput", "", "formControlName", "city", "placeholder", "City"], ["matInput", "", "formControlName", "state", "placeholder", "State/Province"], ["matInput", "", "formControlName", "emergencyContactName", "placeholder", "Emergency contact name"], ["matInput", "", "formControlName", "emergencyContactPhone", "placeholder", "+92-300-1234567"], ["formControlName", "emergencyContactRelation"], ["value", "Spouse"], ["value", "Parent"], ["value", "Sibling"], ["value", "Child"], ["value", "Friend"], ["matInput", "", "formControlName", "nationalId", "placeholder", "CNIC number"], ["matInput", "", "formControlName", "occupation", "placeholder", "Occupation"], [1, "chip-section"], [3, "removed", 4, "ngFor", "ngForOf"], ["placeholder", "Type allergy and press Enter...", 3, "matChipInputTokenEnd", "matChipInputFor"], ["placeholder", "Type condition and press Enter...", 3, "matChipInputTokenEnd", "matChipInputFor"], [3, "removed"], ["matChipRemove", ""], ["diameter", "20"]], template: function PatientFormComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 3);
            i0.ɵɵelementStart(2, "form", 4);
            i0.ɵɵlistener("ngSubmit", function PatientFormComponent_Template_form_ngSubmit_2_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onSubmit()); });
            i0.ɵɵelementStart(3, "div", 5)(4, "div", 6)(5, "h3")(6, "mat-icon");
            i0.ɵɵtext(7, "person_add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(8, " Patient Information");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "span", 7);
            i0.ɵɵtext(10, "Required Fields");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "div", 8)(12, "mat-form-field", 9)(13, "mat-label");
            i0.ɵɵtext(14, "First Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(15, "input", 10);
            i0.ɵɵelementStart(16, "mat-error");
            i0.ɵɵtext(17, "First name is required");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(18, "mat-form-field", 9)(19, "mat-label");
            i0.ɵɵtext(20, "Last Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(21, "input", 11);
            i0.ɵɵelementStart(22, "mat-error");
            i0.ɵɵtext(23, "Last name is required");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(24, "div", 8)(25, "mat-form-field", 9)(26, "mat-label");
            i0.ɵɵtext(27, "Phone Number");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(28, "input", 12);
            i0.ɵɵelementStart(29, "mat-icon", 13);
            i0.ɵɵtext(30, "phone");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "mat-error");
            i0.ɵɵtext(32, "Phone number is required");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(33, "mat-form-field", 9)(34, "mat-label");
            i0.ɵɵtext(35, "Gender");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(36, "mat-select", 14)(37, "mat-option", 15);
            i0.ɵɵtext(38, "Male");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "mat-option", 16);
            i0.ɵɵtext(40, "Female");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "mat-option", 17);
            i0.ɵɵtext(42, "Other");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(43, "mat-icon", 13);
            i0.ɵɵtext(44, "wc");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(45, "mat-error");
            i0.ɵɵtext(46, "Gender is required");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(47, "div", 8)(48, "mat-form-field", 9)(49, "mat-label");
            i0.ɵɵtext(50, "Date of Birth");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(51, "input", 18)(52, "mat-datepicker-toggle", 19)(53, "mat-datepicker", null, 0);
            i0.ɵɵelementStart(55, "mat-hint");
            i0.ɵɵtext(56, "Or enter age if DOB is unknown");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(57, "mat-form-field", 9)(58, "mat-label");
            i0.ɵɵtext(59, "Age (years)");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(60, "input", 20);
            i0.ɵɵelementStart(61, "mat-icon", 13);
            i0.ɵɵtext(62, "hourglass_empty");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(63, "mat-hint");
            i0.ɵɵtext(64, "Fills approximate date of birth");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(65, "mat-form-field", 9)(66, "mat-label");
            i0.ɵɵtext(67, "Blood Group");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(68, "mat-select", 21)(69, "mat-option", 22);
            i0.ɵɵtext(70, "Select Blood Group");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(71, "mat-option", 23);
            i0.ɵɵtext(72, "A+");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(73, "mat-option", 24);
            i0.ɵɵtext(74, "A-");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(75, "mat-option", 25);
            i0.ɵɵtext(76, "B+");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(77, "mat-option", 26);
            i0.ɵɵtext(78, "B-");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(79, "mat-option", 27);
            i0.ɵɵtext(80, "AB+");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(81, "mat-option", 28);
            i0.ɵɵtext(82, "AB-");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(83, "mat-option", 29);
            i0.ɵɵtext(84, "O+");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(85, "mat-option", 30);
            i0.ɵɵtext(86, "O-");
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(87, "div", 31)(88, "button", 32);
            i0.ɵɵlistener("click", function PatientFormComponent_Template_button_click_88_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.showOptional = !ctx.showOptional); });
            i0.ɵɵelementStart(89, "mat-icon");
            i0.ɵɵtext(90);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(91, "span");
            i0.ɵɵtext(92, "Additional Information (Optional)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(93, "span", 33);
            i0.ɵɵtext(94);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(95, PatientFormComponent_div_95_Template, 87, 4, "div", 34);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(96, "div", 35)(97, "button", 36);
            i0.ɵɵlistener("click", function PatientFormComponent_Template_button_click_97_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.goBack()); });
            i0.ɵɵelementStart(98, "mat-icon");
            i0.ɵɵtext(99, "arrow_back");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(100, " Cancel ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(101, "button", 37);
            i0.ɵɵtemplate(102, PatientFormComponent_mat_spinner_102_Template, 1, 0, "mat-spinner", 38)(103, PatientFormComponent_span_103_Template, 4, 2, "span", 39);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            const dobPicker_r10 = i0.ɵɵreference(54);
            i0.ɵɵadvance();
            i0.ɵɵproperty("title", ctx.isEditMode ? "Edit Patient" : "Quick Register Patient")("subtitle", ctx.isEditMode ? "Update patient information" : "Register a new patient with minimum required fields")("breadcrumbs", i0.ɵɵpureFunction3(16, _c3, i0.ɵɵpureFunction0(12, _c0), i0.ɵɵpureFunction0(13, _c1), i0.ɵɵpureFunction1(14, _c2, ctx.isEditMode ? "Edit" : "New")));
            i0.ɵɵadvance();
            i0.ɵɵproperty("formGroup", ctx.patientForm);
            i0.ɵɵadvance(49);
            i0.ɵɵproperty("matDatepicker", dobPicker_r10);
            i0.ɵɵadvance();
            i0.ɵɵproperty("for", dobPicker_r10);
            i0.ɵɵadvance(38);
            i0.ɵɵtextInterpolate(ctx.showOptional ? "expand_less" : "expand_more");
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(ctx.showOptional ? "Click to hide" : "Click to expand");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.showOptional);
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("disabled", ctx.saving || ctx.patientForm.invalid);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.saving);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.saving);
        } }, dependencies: [i5.NgForOf, i5.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.MinValidator, i1.MaxValidator, i1.FormGroupDirective, i1.FormControlName, i6.MatButton, i7.MatIcon, i8.MatInput, i8.MatFormField, i8.MatLabel, i8.MatHint, i8.MatError, i8.MatPrefix, i8.MatSuffix, i9.MatSelect, i9.MatOption, i10.MatDatepicker, i10.MatDatepickerInput, i10.MatDatepickerToggle, i11.MatDivider, i12.MatProgressSpinner, i13.MatChipGrid, i13.MatChipInput, i13.MatChipRemove, i13.MatChipRow, i14.PageHeaderComponent, i15.MainLayoutComponent], styles: [".card[_ngcontent-%COMP%] {\n      background: white;\n      border-radius: 12px;\n      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n      padding: 1.5rem;\n      margin-bottom: 1rem;\n    }\n\n    .required-card[_ngcontent-%COMP%] {\n      border-left: 4px solid #3f51b5;\n    }\n\n    .optional-card[_ngcontent-%COMP%] {\n      border-left: 4px solid #e0e0e0;\n    }\n\n    .card-header-row[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 1.5rem;\n    }\n\n    .card-header-row[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n      margin: 0;\n      font-size: 1.1rem;\n      font-weight: 600;\n      color: #333;\n    }\n\n    .required-badge[_ngcontent-%COMP%] {\n      background: #e8eaf6;\n      color: #3f51b5;\n      padding: 0.25rem 0.75rem;\n      border-radius: 12px;\n      font-size: 0.75rem;\n      font-weight: 500;\n    }\n\n    .form-row[_ngcontent-%COMP%] {\n      display: flex;\n      gap: 1rem;\n      margin-bottom: 1rem;\n    }\n\n    .form-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] {\n      flex: 1;\n    }\n\n    .full-width[_ngcontent-%COMP%] {\n      width: 100%;\n    }\n\n    .expand-toggle[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n      width: 100%;\n      padding: 0.75rem 0;\n      border: none;\n      background: none;\n      cursor: pointer;\n      font-size: 1rem;\n      font-weight: 500;\n      color: #666;\n      transition: color 0.2s;\n    }\n\n    .expand-toggle[_ngcontent-%COMP%]:hover {\n      color: #333;\n    }\n\n    .toggle-hint[_ngcontent-%COMP%] {\n      margin-left: auto;\n      font-size: 0.8rem;\n      color: #999;\n    }\n\n    .optional-fields[_ngcontent-%COMP%] {\n      padding-top: 1rem;\n    }\n\n    .optional-fields[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n      font-size: 0.9rem;\n      font-weight: 600;\n      color: #555;\n      margin: 1rem 0 0.75rem;\n      text-transform: uppercase;\n      letter-spacing: 0.5px;\n    }\n\n    .chip-section[_ngcontent-%COMP%] {\n      margin-bottom: 1rem;\n    }\n\n    .chip-section[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n      display: block;\n      font-size: 0.85rem;\n      font-weight: 500;\n      color: #666;\n      margin-bottom: 0.5rem;\n    }\n\n    .chip-section[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n      border: 1px solid #e0e0e0;\n      border-radius: 4px;\n      padding: 0.5rem;\n      width: 100%;\n      font-size: 0.9rem;\n    }\n\n    .chip-section[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n      outline: none;\n      border-color: #3f51b5;\n    }\n\n    .action-buttons[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: flex-end;\n      gap: 1rem;\n      margin-top: 1rem;\n    }\n\n    .action-buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n    }\n\n    mat-divider[_ngcontent-%COMP%] {\n      margin: 1rem 0;\n    }\n\n    @media (max-width: 768px) {\n      .form-row[_ngcontent-%COMP%] {\n        flex-direction: column;\n      }\n\n      .card-header-row[_ngcontent-%COMP%] {\n        flex-direction: column;\n        align-items: flex-start;\n        gap: 0.5rem;\n      }\n\n      .action-buttons[_ngcontent-%COMP%] {\n        flex-direction: column;\n      }\n\n      .action-buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n        width: 100%;\n        justify-content: center;\n      }\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PatientFormComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-patient-form', template: `
    <app-main-layout>
      <app-page-header
        [title]="isEditMode ? 'Edit Patient' : 'Quick Register Patient'"
        [subtitle]="isEditMode ? 'Update patient information' : 'Register a new patient with minimum required fields'"
        [breadcrumbs]="[
          { label: 'Dashboard', route: '/dashboard' },
          { label: 'Patients', route: '/patients' },
          { label: isEditMode ? 'Edit' : 'New' }
        ]">
      </app-page-header>

      <form [formGroup]="patientForm" (ngSubmit)="onSubmit()">
        <!-- Required Fields Card -->
        <div class="card required-card">
          <div class="card-header-row">
            <h3><mat-icon>person_add</mat-icon> Patient Information</h3>
            <span class="required-badge">Required Fields</span>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" placeholder="Enter first name">
              <mat-error>First name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" placeholder="Enter last name">
              <mat-error>Last name is required</mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Phone Number</mat-label>
              <input matInput formControlName="phone" placeholder="+92-300-1234567">
              <mat-icon matPrefix>phone</mat-icon>
              <mat-error>Phone number is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Gender</mat-label>
              <mat-select formControlName="gender">
                <mat-option value="Male">Male</mat-option>
                <mat-option value="Female">Female</mat-option>
                <mat-option value="Other">Other</mat-option>
              </mat-select>
              <mat-icon matPrefix>wc</mat-icon>
              <mat-error>Gender is required</mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Date of Birth</mat-label>
              <input matInput [matDatepicker]="dobPicker" formControlName="dateOfBirth" placeholder="Select date of birth">
              <mat-datepicker-toggle matIconSuffix [for]="dobPicker"></mat-datepicker-toggle>
              <mat-datepicker #dobPicker></mat-datepicker>
              <mat-hint>Or enter age if DOB is unknown</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Age (years)</mat-label>
              <input matInput type="number" min="0" max="150" formControlName="age" placeholder="e.g. 35">
              <mat-icon matPrefix>hourglass_empty</mat-icon>
              <mat-hint>Fills approximate date of birth</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Blood Group</mat-label>
              <mat-select formControlName="bloodGroup">
                <mat-option value="">Select Blood Group</mat-option>
                <mat-option value="A+">A+</mat-option>
                <mat-option value="A-">A-</mat-option>
                <mat-option value="B+">B+</mat-option>
                <mat-option value="B-">B-</mat-option>
                <mat-option value="AB+">AB+</mat-option>
                <mat-option value="AB-">AB-</mat-option>
                <mat-option value="O+">O+</mat-option>
                <mat-option value="O-">O-</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <!-- Optional Fields - Expandable Section -->
        <div class="card optional-card">
          <button type="button" class="expand-toggle" (click)="showOptional = !showOptional">
            <mat-icon>{{ showOptional ? 'expand_less' : 'expand_more' }}</mat-icon>
            <span>Additional Information (Optional)</span>
            <span class="toggle-hint">{{ showOptional ? 'Click to hide' : 'Click to expand' }}</span>
          </button>

          <div class="optional-fields" *ngIf="showOptional">
            <mat-divider></mat-divider>

            <h4>Contact Details</h4>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="patient@email.com">
                <mat-icon matPrefix>email</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Alternate Phone</mat-label>
                <input matInput formControlName="alternatePhone" placeholder="+92-321-1234567">
                <mat-icon matPrefix>phone</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Address</mat-label>
                <input matInput formControlName="address" placeholder="Street address">
                <mat-icon matPrefix>location_on</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>City</mat-label>
                <input matInput formControlName="city" placeholder="City">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>State</mat-label>
                <input matInput formControlName="state" placeholder="State/Province">
              </mat-form-field>
            </div>

            <mat-divider></mat-divider>

            <h4>Emergency Contact</h4>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Contact Name</mat-label>
                <input matInput formControlName="emergencyContactName" placeholder="Emergency contact name">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Contact Phone</mat-label>
                <input matInput formControlName="emergencyContactPhone" placeholder="+92-300-1234567">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Relationship</mat-label>
                <mat-select formControlName="emergencyContactRelation">
                  <mat-option value="Spouse">Spouse</mat-option>
                  <mat-option value="Parent">Parent</mat-option>
                  <mat-option value="Sibling">Sibling</mat-option>
                  <mat-option value="Child">Child</mat-option>
                  <mat-option value="Friend">Friend</mat-option>
                  <mat-option value="Other">Other</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-divider></mat-divider>

            <h4>Medical Information</h4>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>National ID</mat-label>
                <input matInput formControlName="nationalId" placeholder="CNIC number">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Occupation</mat-label>
                <input matInput formControlName="occupation" placeholder="Occupation">
              </mat-form-field>
            </div>

            <div class="chip-section">
              <label>Allergies</label>
              <mat-chip-grid #allergyChipGrid>
                <mat-chip-row *ngFor="let allergy of allergies" (removed)="removeAllergy(allergy)">
                  {{ allergy }}
                  <button matChipRemove><mat-icon>cancel</mat-icon></button>
                </mat-chip-row>
              </mat-chip-grid>
              <input placeholder="Type allergy and press Enter..."
                     [matChipInputFor]="allergyChipGrid"
                     (matChipInputTokenEnd)="addAllergy($event)">
            </div>

            <div class="chip-section">
              <label>Chronic Conditions</label>
              <mat-chip-grid #conditionChipGrid>
                <mat-chip-row *ngFor="let condition of chronicConditions" (removed)="removeCondition(condition)">
                  {{ condition }}
                  <button matChipRemove><mat-icon>cancel</mat-icon></button>
                </mat-chip-row>
              </mat-chip-grid>
              <input placeholder="Type condition and press Enter..."
                     [matChipInputFor]="conditionChipGrid"
                     (matChipInputTokenEnd)="addCondition($event)">
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button mat-stroked-button type="button" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="saving || patientForm.invalid">
            <mat-spinner diameter="20" *ngIf="saving"></mat-spinner>
            <span *ngIf="!saving">
              <mat-icon>{{ isEditMode ? 'save' : 'person_add' }}</mat-icon>
              {{ isEditMode ? 'Update Patient' : 'Register Patient' }}
            </span>
          </button>
        </div>
      </form>
    </app-main-layout>
  `, styles: ["\n    .card {\n      background: white;\n      border-radius: 12px;\n      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n      padding: 1.5rem;\n      margin-bottom: 1rem;\n    }\n\n    .required-card {\n      border-left: 4px solid #3f51b5;\n    }\n\n    .optional-card {\n      border-left: 4px solid #e0e0e0;\n    }\n\n    .card-header-row {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 1.5rem;\n    }\n\n    .card-header-row h3 {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n      margin: 0;\n      font-size: 1.1rem;\n      font-weight: 600;\n      color: #333;\n    }\n\n    .required-badge {\n      background: #e8eaf6;\n      color: #3f51b5;\n      padding: 0.25rem 0.75rem;\n      border-radius: 12px;\n      font-size: 0.75rem;\n      font-weight: 500;\n    }\n\n    .form-row {\n      display: flex;\n      gap: 1rem;\n      margin-bottom: 1rem;\n    }\n\n    .form-row mat-form-field {\n      flex: 1;\n    }\n\n    .full-width {\n      width: 100%;\n    }\n\n    .expand-toggle {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n      width: 100%;\n      padding: 0.75rem 0;\n      border: none;\n      background: none;\n      cursor: pointer;\n      font-size: 1rem;\n      font-weight: 500;\n      color: #666;\n      transition: color 0.2s;\n    }\n\n    .expand-toggle:hover {\n      color: #333;\n    }\n\n    .toggle-hint {\n      margin-left: auto;\n      font-size: 0.8rem;\n      color: #999;\n    }\n\n    .optional-fields {\n      padding-top: 1rem;\n    }\n\n    .optional-fields h4 {\n      font-size: 0.9rem;\n      font-weight: 600;\n      color: #555;\n      margin: 1rem 0 0.75rem;\n      text-transform: uppercase;\n      letter-spacing: 0.5px;\n    }\n\n    .chip-section {\n      margin-bottom: 1rem;\n    }\n\n    .chip-section label {\n      display: block;\n      font-size: 0.85rem;\n      font-weight: 500;\n      color: #666;\n      margin-bottom: 0.5rem;\n    }\n\n    .chip-section input {\n      border: 1px solid #e0e0e0;\n      border-radius: 4px;\n      padding: 0.5rem;\n      width: 100%;\n      font-size: 0.9rem;\n    }\n\n    .chip-section input:focus {\n      outline: none;\n      border-color: #3f51b5;\n    }\n\n    .action-buttons {\n      display: flex;\n      justify-content: flex-end;\n      gap: 1rem;\n      margin-top: 1rem;\n    }\n\n    .action-buttons button {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n    }\n\n    mat-divider {\n      margin: 1rem 0;\n    }\n\n    @media (max-width: 768px) {\n      .form-row {\n        flex-direction: column;\n      }\n\n      .card-header-row {\n        flex-direction: column;\n        align-items: flex-start;\n        gap: 0.5rem;\n      }\n\n      .action-buttons {\n        flex-direction: column;\n      }\n\n      .action-buttons button {\n        width: 100%;\n        justify-content: center;\n      }\n    }\n  "] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ActivatedRoute }, { type: i2.Router }, { type: i3.ApiService }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PatientFormComponent, { className: "PatientFormComponent", filePath: "app/features/patients/patient-form/patient-form.component.ts", lineNumber: 391 }); })();
//# sourceMappingURL=patient-form.component.js.map