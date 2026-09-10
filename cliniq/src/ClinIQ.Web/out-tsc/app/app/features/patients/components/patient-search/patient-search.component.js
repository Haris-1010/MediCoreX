import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, switchMap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../../../core/services/api.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/forms";
import * as i4 from "@angular/material/icon";
import * as i5 from "@angular/material/input";
import * as i6 from "@angular/material/select";
import * as i7 from "@angular/material/autocomplete";
function PatientSearchComponent_mat_option_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 7)(1, "div", 8)(2, "span", 9);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 10);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const patient_r2 = ctx.$implicit;
    i0.ɵɵproperty("value", patient_r2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(patient_r2.fullName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("MRN: ", patient_r2.mrn, " | ", patient_r2.phone, "");
} }
function PatientSearchComponent_mat_option_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 11);
    i0.ɵɵtext(1, " No patients found ");
    i0.ɵɵelementEnd();
} }
export class PatientSearchComponent {
    constructor(api) {
        this.api = api;
        this.patientSelected = new EventEmitter();
        this.searchControl = new FormControl('');
        this.searchResults = [];
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$), switchMap(term => {
            if (typeof term === 'string' && term.length >= 2) {
                return this.api.get('v1/patients/search', { term });
            }
            return [];
        })).subscribe(results => this.searchResults = results);
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    onPatientSelected(event) {
        this.patientSelected.emit(event.option.value);
        this.searchControl.setValue('');
    }
    static { this.ɵfac = function PatientSearchComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PatientSearchComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PatientSearchComponent, selectors: [["app-patient-search"]], outputs: { patientSelected: "patientSelected" }, standalone: false, decls: 10, vars: 4, consts: [["auto", "matAutocomplete"], ["appearance", "outline", 1, "search-field"], ["matInput", "", "placeholder", "Search by name, MRN, or phone", 3, "formControl", "matAutocomplete"], ["matPrefix", ""], [3, "optionSelected"], [3, "value", 4, "ngFor", "ngForOf"], ["disabled", "", 4, "ngIf"], [3, "value"], [1, "patient-option"], [1, "name"], [1, "details"], ["disabled", ""]], template: function PatientSearchComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "mat-form-field", 1)(1, "mat-label");
            i0.ɵɵtext(2, "Search Patient");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(3, "input", 2);
            i0.ɵɵelementStart(4, "mat-icon", 3);
            i0.ɵɵtext(5, "search");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "mat-autocomplete", 4, 0);
            i0.ɵɵlistener("optionSelected", function PatientSearchComponent_Template_mat_autocomplete_optionSelected_6_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onPatientSelected($event)); });
            i0.ɵɵtemplate(8, PatientSearchComponent_mat_option_8_Template, 6, 4, "mat-option", 5)(9, PatientSearchComponent_mat_option_9_Template, 2, 0, "mat-option", 6);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            const auto_r3 = i0.ɵɵreference(7);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("formControl", ctx.searchControl)("matAutocomplete", auto_r3);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngForOf", ctx.searchResults);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.searchResults.length === 0 && ctx.searchControl.value);
        } }, dependencies: [i2.NgForOf, i2.NgIf, i3.DefaultValueAccessor, i3.NgControlStatus, i3.FormControlDirective, i4.MatIcon, i5.MatInput, i5.MatFormField, i5.MatLabel, i5.MatPrefix, i6.MatOption, i7.MatAutocomplete, i7.MatAutocompleteTrigger], styles: [".search-field[_ngcontent-%COMP%] { width: 100%; }\n    .patient-option[_ngcontent-%COMP%] { display: flex; flex-direction: column; }\n    .patient-option[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] { font-weight: 500; }\n    .patient-option[_ngcontent-%COMP%]   .details[_ngcontent-%COMP%] { font-size: 0.75rem; color: #666; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PatientSearchComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-patient-search', template: `
    <mat-form-field appearance="outline" class="search-field">
      <mat-label>Search Patient</mat-label>
      <input matInput [formControl]="searchControl" [matAutocomplete]="auto" placeholder="Search by name, MRN, or phone">
      <mat-icon matPrefix>search</mat-icon>
      <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onPatientSelected($event)">
        <mat-option *ngFor="let patient of searchResults" [value]="patient">
          <div class="patient-option">
            <span class="name">{{ patient.fullName }}</span>
            <span class="details">MRN: {{ patient.mrn }} | {{ patient.phone }}</span>
          </div>
        </mat-option>
        <mat-option *ngIf="searchResults.length === 0 && searchControl.value" disabled>
          No patients found
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  `, styles: ["\n    .search-field { width: 100%; }\n    .patient-option { display: flex; flex-direction: column; }\n    .patient-option .name { font-weight: 500; }\n    .patient-option .details { font-size: 0.75rem; color: #666; }\n  "] }]
    }], () => [{ type: i1.ApiService }], { patientSelected: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PatientSearchComponent, { className: "PatientSearchComponent", filePath: "app/features/patients/components/patient-search/patient-search.component.ts", lineNumber: 43 }); })();
//# sourceMappingURL=patient-search.component.js.map