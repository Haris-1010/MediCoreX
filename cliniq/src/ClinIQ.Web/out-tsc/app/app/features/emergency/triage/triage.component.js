import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../../core/services/api.service";
import * as i3 from "@angular/router";
import * as i4 from "../../../core/services/notification.service";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/material/input";
import * as i7 from "@angular/material/select";
import * as i8 from "@angular/material/radio";
import * as i9 from "../../../shared/components/page-header/page-header.component";
import * as i10 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Emergency", route: "/emergency" });
const _c1 = () => ({ label: "Triage" });
const _c2 = (a0, a1) => [a0, a1];
export class TriageComponent {
    constructor(fb, api, router, notification) {
        this.fb = fb;
        this.api = api;
        this.router = router;
        this.notification = notification;
        this.saving = false;
    }
    ngOnInit() {
        this.form = this.fb.group({
            patientName: ['', Validators.required], age: ['', Validators.required], gender: ['', Validators.required],
            contactPhone: [''], chiefComplaint: ['', Validators.required], priority: ['Urgent', Validators.required],
            vitals: this.fb.group({ bloodPressure: [''], pulse: [''], temperature: [''], spO2: [''] }), assessmentNotes: ['']
        });
    }
    submit() {
        if (this.form.invalid)
            return;
        this.saving = true;
        this.api.post('v1/emergency', this.form.value).subscribe({
            next: () => { this.notification.success('Emergency case registered'); this.router.navigate(['/emergency']); },
            error: () => this.saving = false
        });
    }
    static { this.ɵfac = function TriageComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TriageComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.Router), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TriageComponent, selectors: [["app-triage"]], standalone: false, decls: 81, vars: 9, consts: [["title", "Emergency Triage", 3, "breadcrumbs"], [1, "card"], [3, "ngSubmit", "formGroup"], [1, "form-row"], ["appearance", "outline"], ["matInput", "", "formControlName", "patientName"], ["matInput", "", "type", "number", "formControlName", "age"], ["formControlName", "gender"], ["value", "Male"], ["value", "Female"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "formControlName", "contactPhone"], ["matInput", "", "formControlName", "chiefComplaint", "rows", "3"], [1, "priority-selection"], ["formControlName", "priority"], ["value", "Critical", "color", "warn"], [1, "priority", "critical"], ["value", "Urgent"], [1, "priority", "urgent"], ["value", "Moderate"], [1, "priority", "moderate"], ["value", "Stable"], [1, "priority", "stable"], ["formGroupName", "vitals", 1, "form-row"], ["matInput", "", "formControlName", "bloodPressure", "placeholder", "120/80"], ["matInput", "", "type", "number", "formControlName", "pulse"], ["matInput", "", "type", "number", "formControlName", "temperature"], ["matInput", "", "type", "number", "formControlName", "spO2"], ["matInput", "", "formControlName", "assessmentNotes", "rows", "3"], [1, "form-actions"], ["mat-stroked-button", "", "type", "button", "routerLink", "/emergency"], ["mat-raised-button", "", "color", "warn", "type", "submit", 3, "disabled"]], template: function TriageComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1)(3, "form", 2);
            i0.ɵɵlistener("ngSubmit", function TriageComponent_Template_form_ngSubmit_3_listener() { return ctx.submit(); });
            i0.ɵɵelementStart(4, "h3");
            i0.ɵɵtext(5, "Patient Information");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "div", 3)(7, "mat-form-field", 4)(8, "mat-label");
            i0.ɵɵtext(9, "Patient Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(10, "input", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "mat-form-field", 4)(12, "mat-label");
            i0.ɵɵtext(13, "Age");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(14, "input", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "mat-form-field", 4)(16, "mat-label");
            i0.ɵɵtext(17, "Gender");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "mat-select", 7)(19, "mat-option", 8);
            i0.ɵɵtext(20, "Male");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "mat-option", 9);
            i0.ɵɵtext(22, "Female");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(23, "mat-form-field", 10)(24, "mat-label");
            i0.ɵɵtext(25, "Contact Phone");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(26, "input", 11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "h3");
            i0.ɵɵtext(28, "Triage Assessment");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "mat-form-field", 10)(30, "mat-label");
            i0.ɵɵtext(31, "Chief Complaint");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(32, "textarea", 12);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(33, "div", 13)(34, "label");
            i0.ɵɵtext(35, "Priority Level:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(36, "mat-radio-group", 14)(37, "mat-radio-button", 15)(38, "span", 16);
            i0.ɵɵtext(39, "Critical");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(40, " - Immediate life threat");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "mat-radio-button", 17)(42, "span", 18);
            i0.ɵɵtext(43, "Urgent");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(44, " - Requires prompt attention");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(45, "mat-radio-button", 19)(46, "span", 20);
            i0.ɵɵtext(47, "Moderate");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(48, " - Can wait up to 1 hour");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(49, "mat-radio-button", 21)(50, "span", 22);
            i0.ɵɵtext(51, "Stable");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(52, " - Non-urgent");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(53, "h3");
            i0.ɵɵtext(54, "Vitals");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(55, "div", 23)(56, "mat-form-field", 4)(57, "mat-label");
            i0.ɵɵtext(58, "Blood Pressure");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(59, "input", 24);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(60, "mat-form-field", 4)(61, "mat-label");
            i0.ɵɵtext(62, "Pulse");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(63, "input", 25);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(64, "mat-form-field", 4)(65, "mat-label");
            i0.ɵɵtext(66, "Temperature (\u00B0F)");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(67, "input", 26);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(68, "mat-form-field", 4)(69, "mat-label");
            i0.ɵɵtext(70, "SpO2 (%)");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(71, "input", 27);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(72, "mat-form-field", 10)(73, "mat-label");
            i0.ɵɵtext(74, "Initial Assessment Notes");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(75, "textarea", 28);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(76, "div", 29)(77, "button", 30);
            i0.ɵɵtext(78, "Cancel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(79, "button", 31);
            i0.ɵɵtext(80);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(6, _c2, i0.ɵɵpureFunction0(4, _c0), i0.ɵɵpureFunction0(5, _c1)));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("formGroup", ctx.form);
            i0.ɵɵadvance(76);
            i0.ɵɵproperty("disabled", ctx.form.invalid || ctx.saving);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate(ctx.saving ? "Saving..." : "Register Emergency");
        } }, dependencies: [i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i1.FormGroupName, i3.RouterLink, i5.MatButton, i6.MatInput, i6.MatFormField, i6.MatLabel, i7.MatSelect, i7.MatOption, i8.MatRadioGroup, i8.MatRadioButton, i9.PageHeaderComponent, i10.MainLayoutComponent], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } h3[_ngcontent-%COMP%] { margin: 1.5rem 0 1rem; } h3[_ngcontent-%COMP%]:first-child { margin-top: 0; }\n    .form-row[_ngcontent-%COMP%] { display: flex; gap: 1rem; } .form-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] { flex: 1; } .full-width[_ngcontent-%COMP%] { width: 100%; }\n    .priority-selection[_ngcontent-%COMP%] { margin: 1rem 0; } .priority-selection[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] { display: block; margin-bottom: 0.5rem; font-weight: 500; }\n    .priority-selection[_ngcontent-%COMP%]   mat-radio-button[_ngcontent-%COMP%] { display: block; margin: 0.5rem 0; }\n    .priority[_ngcontent-%COMP%] { padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600; }\n    .priority.critical[_ngcontent-%COMP%] { background: #ffebee; color: #c62828; } .priority.urgent[_ngcontent-%COMP%] { background: #fff3e0; color: #e65100; }\n    .priority.moderate[_ngcontent-%COMP%] { background: #fffde7; color: #f9a825; } .priority.stable[_ngcontent-%COMP%] { background: #e8f5e9; color: #2e7d32; }\n    .form-actions[_ngcontent-%COMP%] { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TriageComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-triage', template: `
    <app-main-layout>
      <app-page-header title="Emergency Triage" [breadcrumbs]="[{ label: 'Emergency', route: '/emergency' }, { label: 'Triage' }]"></app-page-header>
      <div class="card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <h3>Patient Information</h3>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Patient Name</mat-label><input matInput formControlName="patientName"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Age</mat-label><input matInput type="number" formControlName="age"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Gender</mat-label><mat-select formControlName="gender"><mat-option value="Male">Male</mat-option><mat-option value="Female">Female</mat-option></mat-select></mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Contact Phone</mat-label><input matInput formControlName="contactPhone"></mat-form-field>

          <h3>Triage Assessment</h3>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Chief Complaint</mat-label><textarea matInput formControlName="chiefComplaint" rows="3"></textarea></mat-form-field>

          <div class="priority-selection">
            <label>Priority Level:</label>
            <mat-radio-group formControlName="priority">
              <mat-radio-button value="Critical" color="warn"><span class="priority critical">Critical</span> - Immediate life threat</mat-radio-button>
              <mat-radio-button value="Urgent"><span class="priority urgent">Urgent</span> - Requires prompt attention</mat-radio-button>
              <mat-radio-button value="Moderate"><span class="priority moderate">Moderate</span> - Can wait up to 1 hour</mat-radio-button>
              <mat-radio-button value="Stable"><span class="priority stable">Stable</span> - Non-urgent</mat-radio-button>
            </mat-radio-group>
          </div>

          <h3>Vitals</h3>
          <div class="form-row" formGroupName="vitals">
            <mat-form-field appearance="outline"><mat-label>Blood Pressure</mat-label><input matInput formControlName="bloodPressure" placeholder="120/80"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Pulse</mat-label><input matInput type="number" formControlName="pulse"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Temperature (°F)</mat-label><input matInput type="number" formControlName="temperature"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>SpO2 (%)</mat-label><input matInput type="number" formControlName="spO2"></mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width"><mat-label>Initial Assessment Notes</mat-label><textarea matInput formControlName="assessmentNotes" rows="3"></textarea></mat-form-field>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/emergency">Cancel</button>
            <button mat-raised-button color="warn" type="submit" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : 'Register Emergency' }}</button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `, styles: [".card { background: white; padding: 1.5rem; border-radius: 8px; } h3 { margin: 1.5rem 0 1rem; } h3:first-child { margin-top: 0; }\n    .form-row { display: flex; gap: 1rem; } .form-row mat-form-field { flex: 1; } .full-width { width: 100%; }\n    .priority-selection { margin: 1rem 0; } .priority-selection label { display: block; margin-bottom: 0.5rem; font-weight: 500; }\n    .priority-selection mat-radio-button { display: block; margin: 0.5rem 0; }\n    .priority { padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600; }\n    .priority.critical { background: #ffebee; color: #c62828; } .priority.urgent { background: #fff3e0; color: #e65100; }\n    .priority.moderate { background: #fffde7; color: #f9a825; } .priority.stable { background: #e8f5e9; color: #2e7d32; }\n    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }"] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ApiService }, { type: i3.Router }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TriageComponent, { className: "TriageComponent", filePath: "app/features/emergency/triage/triage.component.ts", lineNumber: 63 }); })();
//# sourceMappingURL=triage.component.js.map