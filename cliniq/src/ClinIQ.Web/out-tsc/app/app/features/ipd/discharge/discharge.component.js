import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../../core/services/api.service";
import * as i3 from "@angular/router";
import * as i4 from "../../../core/services/notification.service";
import * as i5 from "@angular/common";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/material/input";
import * as i9 from "@angular/material/select";
import * as i10 from "@angular/material/datepicker";
import * as i11 from "../../../shared/components/page-header/page-header.component";
import * as i12 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "IPD", route: "/ipd" });
const _c1 = () => ({ label: "Discharge" });
const _c2 = (a0, a1) => [a0, a1];
function DischargeComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 3)(1, "div", 4)(2, "h3");
    i0.ɵɵtext(3, "Admission Summary");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 5)(5, "span");
    i0.ɵɵtext(6, "Patient:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "strong");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 5)(10, "span");
    i0.ɵɵtext(11, "MRN:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "strong");
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div", 5)(15, "span");
    i0.ɵɵtext(16, "Admission #:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "strong");
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "div", 5)(20, "span");
    i0.ɵɵtext(21, "Admitted:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "strong");
    i0.ɵɵtext(23);
    i0.ɵɵpipe(24, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(25, "div", 5)(26, "span");
    i0.ɵɵtext(27, "Ward/Bed:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "strong");
    i0.ɵɵtext(29);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(30, "div", 5)(31, "span");
    i0.ɵɵtext(32, "Doctor:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "strong");
    i0.ɵɵtext(34);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(35, "div", 5)(36, "span");
    i0.ɵɵtext(37, "Duration:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "strong");
    i0.ɵɵtext(39);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(40, "div", 6)(41, "form", 7);
    i0.ɵɵlistener("ngSubmit", function DischargeComponent_div_2_Template_form_ngSubmit_41_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.submit()); });
    i0.ɵɵelementStart(42, "mat-form-field", 8)(43, "mat-label");
    i0.ɵɵtext(44, "Discharge Type");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "mat-select", 9)(46, "mat-option", 10);
    i0.ɵɵtext(47, "Normal");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "mat-option", 11);
    i0.ɵɵtext(49, "LAMA");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(50, "mat-option", 12);
    i0.ɵɵtext(51, "Absconded");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(52, "mat-option", 13);
    i0.ɵɵtext(53, "Expired");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(54, "mat-option", 14);
    i0.ɵɵtext(55, "Transfer");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(56, "mat-form-field", 8)(57, "mat-label");
    i0.ɵɵtext(58, "Final Diagnosis");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(59, "textarea", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(60, "mat-form-field", 8)(61, "mat-label");
    i0.ɵɵtext(62, "Discharge Summary");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(63, "textarea", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(64, "mat-form-field", 8)(65, "mat-label");
    i0.ɵɵtext(66, "Follow-up Instructions");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(67, "textarea", 17);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(68, "mat-form-field", 8)(69, "mat-label");
    i0.ɵɵtext(70, "Medications at Discharge");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(71, "textarea", 18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(72, "mat-form-field", 19)(73, "mat-label");
    i0.ɵɵtext(74, "Follow-up Date");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(75, "input", 20)(76, "mat-datepicker-toggle", 21)(77, "mat-datepicker", null, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(79, "div", 22)(80, "h4");
    i0.ɵɵtext(81, "Billing Summary");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(82, "div", 23)(83, "span");
    i0.ɵɵtext(84, "Room Charges:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(85, "span");
    i0.ɵɵtext(86);
    i0.ɵɵpipe(87, "currency");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(88, "div", 23)(89, "span");
    i0.ɵɵtext(90, "Doctor Fees:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(91, "span");
    i0.ɵɵtext(92);
    i0.ɵɵpipe(93, "currency");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(94, "div", 23)(95, "span");
    i0.ɵɵtext(96, "Lab Charges:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(97, "span");
    i0.ɵɵtext(98);
    i0.ɵɵpipe(99, "currency");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(100, "div", 23)(101, "span");
    i0.ɵɵtext(102, "Pharmacy:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(103, "span");
    i0.ɵɵtext(104);
    i0.ɵɵpipe(105, "currency");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(106, "div", 24)(107, "span");
    i0.ɵɵtext(108, "Total:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(109, "span");
    i0.ɵɵtext(110);
    i0.ɵɵpipe(111, "currency");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(112, "div", 23)(113, "span");
    i0.ɵɵtext(114, "Paid:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(115, "span");
    i0.ɵɵtext(116);
    i0.ɵɵpipe(117, "currency");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(118, "div", 25)(119, "span");
    i0.ɵɵtext(120, "Balance:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(121, "span");
    i0.ɵɵtext(122);
    i0.ɵɵpipe(123, "currency");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(124, "div", 26)(125, "button", 27);
    i0.ɵɵtext(126, "Cancel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(127, "button", 28);
    i0.ɵɵlistener("click", function DischargeComponent_div_2_Template_button_click_127_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printSummary()); });
    i0.ɵɵelementStart(128, "mat-icon");
    i0.ɵɵtext(129, "print");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(130, " Print Summary");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(131, "button", 29);
    i0.ɵɵtext(132);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const picker_r3 = i0.ɵɵreference(78);
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r1.admission.patientName);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.admission.mrn);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.admission.admissionNumber);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(24, 20, ctx_r1.admission.admissionDate, "mediumDate"));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate2("", ctx_r1.admission.wardName, " - ", ctx_r1.admission.bedNumber, "");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("Dr. ", ctx_r1.admission.doctorName, "");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("", ctx_r1.admission.daysAdmitted, " days");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("formGroup", ctx_r1.form);
    i0.ɵɵadvance(34);
    i0.ɵɵproperty("matDatepicker", picker_r3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("for", picker_r3);
    i0.ɵɵadvance(10);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(87, 23, ctx_r1.admission.roomCharges));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(93, 25, ctx_r1.admission.doctorFees));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(99, 27, ctx_r1.admission.labCharges));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(105, 29, ctx_r1.admission.pharmacyCharges));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(111, 31, ctx_r1.admission.totalAmount));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(117, 33, ctx_r1.admission.paidAmount));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(123, 35, ctx_r1.admission.balanceAmount));
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("disabled", ctx_r1.form.invalid || ctx_r1.saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.saving ? "Processing..." : "Discharge Patient");
} }
export class DischargeComponent {
    constructor(fb, api, route, router, notification) {
        this.fb = fb;
        this.api = api;
        this.route = route;
        this.router = router;
        this.notification = notification;
        this.saving = false;
    }
    ngOnInit() {
        this.form = this.fb.group({
            dischargeType: ['Normal', Validators.required], finalDiagnosis: ['', Validators.required],
            dischargeSummary: ['', Validators.required], followUpInstructions: [''], dischargeMedications: [''], followUpDate: ['']
        });
        const id = this.route.snapshot.paramMap.get('id');
        if (id)
            this.api.getById('v1/admissions', id).subscribe(r => this.admission = r);
    }
    printSummary() { window.print(); }
    submit() {
        if (this.form.invalid)
            return;
        this.saving = true;
        this.api.post(`v1/admissions/${this.admission.id}/discharge`, this.form.value).subscribe({
            next: () => { this.notification.success('Patient discharged successfully'); this.router.navigate(['/ipd/admissions']); },
            error: () => this.saving = false
        });
    }
    static { this.ɵfac = function DischargeComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DischargeComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.ActivatedRoute), i0.ɵɵdirectiveInject(i3.Router), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DischargeComponent, selectors: [["app-discharge"]], standalone: false, decls: 3, vars: 7, consts: [["picker", ""], ["title", "Discharge Patient", 3, "breadcrumbs"], ["class", "discharge-grid", 4, "ngIf"], [1, "discharge-grid"], [1, "card", "summary"], [1, "info-row"], [1, "card", "form"], [3, "ngSubmit", "formGroup"], ["appearance", "outline", 1, "full-width"], ["formControlName", "dischargeType"], ["value", "Normal"], ["value", "LAMA"], ["value", "Absconded"], ["value", "Expired"], ["value", "Transfer"], ["matInput", "", "formControlName", "finalDiagnosis", "rows", "3"], ["matInput", "", "formControlName", "dischargeSummary", "rows", "4"], ["matInput", "", "formControlName", "followUpInstructions", "rows", "3"], ["matInput", "", "formControlName", "dischargeMedications", "rows", "3"], ["appearance", "outline"], ["matInput", "", "formControlName", "followUpDate", 3, "matDatepicker"], ["matIconSuffix", "", 3, "for"], [1, "billing-summary"], [1, "billing-row"], [1, "billing-row", "total"], [1, "billing-row", "balance"], [1, "form-actions"], ["mat-stroked-button", "", "type", "button", "routerLink", "/ipd/admissions"], ["mat-stroked-button", "", "type", "button", 3, "click"], ["mat-raised-button", "", "color", "primary", "type", "submit", 3, "disabled"]], template: function DischargeComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 1);
            i0.ɵɵtemplate(2, DischargeComponent_div_2_Template, 133, 37, "div", 2);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(4, _c2, i0.ɵɵpureFunction0(2, _c0), i0.ɵɵpureFunction0(3, _c1)));
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.admission);
        } }, dependencies: [i5.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i3.RouterLink, i6.MatButton, i7.MatIcon, i8.MatInput, i8.MatFormField, i8.MatLabel, i8.MatSuffix, i9.MatSelect, i9.MatOption, i10.MatDatepicker, i10.MatDatepickerInput, i10.MatDatepickerToggle, i11.PageHeaderComponent, i12.MainLayoutComponent, i5.CurrencyPipe, i5.DatePipe], styles: [".discharge-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: 350px 1fr; gap: 1.5rem; }\n    .card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 1rem; }\n    .info-row[_ngcontent-%COMP%] { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee; } .info-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] { color: #666; }\n    .full-width[_ngcontent-%COMP%] { width: 100%; }\n    .billing-summary[_ngcontent-%COMP%] { background: #f5f5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0; }\n    .billing-summary[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { margin: 0 0 0.5rem; }\n    .billing-row[_ngcontent-%COMP%] { display: flex; justify-content: space-between; padding: 0.25rem 0; }\n    .billing-row.total[_ngcontent-%COMP%] { border-top: 1px solid #ccc; padding-top: 0.5rem; margin-top: 0.5rem; font-weight: 600; }\n    .billing-row.balance[_ngcontent-%COMP%] { color: #f44336; font-weight: 600; }\n    .form-actions[_ngcontent-%COMP%] { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DischargeComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-discharge', template: `
    <app-main-layout>
      <app-page-header title="Discharge Patient" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Discharge' }]"></app-page-header>
      <div class="discharge-grid" *ngIf="admission">
        <div class="card summary">
          <h3>Admission Summary</h3>
          <div class="info-row"><span>Patient:</span><strong>{{ admission.patientName }}</strong></div>
          <div class="info-row"><span>MRN:</span><strong>{{ admission.mrn }}</strong></div>
          <div class="info-row"><span>Admission #:</span><strong>{{ admission.admissionNumber }}</strong></div>
          <div class="info-row"><span>Admitted:</span><strong>{{ admission.admissionDate | date:'mediumDate' }}</strong></div>
          <div class="info-row"><span>Ward/Bed:</span><strong>{{ admission.wardName }} - {{ admission.bedNumber }}</strong></div>
          <div class="info-row"><span>Doctor:</span><strong>Dr. {{ admission.doctorName }}</strong></div>
          <div class="info-row"><span>Duration:</span><strong>{{ admission.daysAdmitted }} days</strong></div>
        </div>
        <div class="card form">
          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" class="full-width"><mat-label>Discharge Type</mat-label>
              <mat-select formControlName="dischargeType"><mat-option value="Normal">Normal</mat-option><mat-option value="LAMA">LAMA</mat-option><mat-option value="Absconded">Absconded</mat-option><mat-option value="Expired">Expired</mat-option><mat-option value="Transfer">Transfer</mat-option></mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Final Diagnosis</mat-label><textarea matInput formControlName="finalDiagnosis" rows="3"></textarea></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Discharge Summary</mat-label><textarea matInput formControlName="dischargeSummary" rows="4"></textarea></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Follow-up Instructions</mat-label><textarea matInput formControlName="followUpInstructions" rows="3"></textarea></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Medications at Discharge</mat-label><textarea matInput formControlName="dischargeMedications" rows="3"></textarea></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Follow-up Date</mat-label><input matInput [matDatepicker]="picker" formControlName="followUpDate"><mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle><mat-datepicker #picker></mat-datepicker></mat-form-field>

            <div class="billing-summary">
              <h4>Billing Summary</h4>
              <div class="billing-row"><span>Room Charges:</span><span>{{ admission.roomCharges | currency }}</span></div>
              <div class="billing-row"><span>Doctor Fees:</span><span>{{ admission.doctorFees | currency }}</span></div>
              <div class="billing-row"><span>Lab Charges:</span><span>{{ admission.labCharges | currency }}</span></div>
              <div class="billing-row"><span>Pharmacy:</span><span>{{ admission.pharmacyCharges | currency }}</span></div>
              <div class="billing-row total"><span>Total:</span><span>{{ admission.totalAmount | currency }}</span></div>
              <div class="billing-row"><span>Paid:</span><span>{{ admission.paidAmount | currency }}</span></div>
              <div class="billing-row balance"><span>Balance:</span><span>{{ admission.balanceAmount | currency }}</span></div>
            </div>

            <div class="form-actions">
              <button mat-stroked-button type="button" routerLink="/ipd/admissions">Cancel</button>
              <button mat-stroked-button type="button" (click)="printSummary()"><mat-icon>print</mat-icon> Print Summary</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">{{ saving ? 'Processing...' : 'Discharge Patient' }}</button>
            </div>
          </form>
        </div>
      </div>
    </app-main-layout>
  `, styles: [".discharge-grid { display: grid; grid-template-columns: 350px 1fr; gap: 1.5rem; }\n    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }\n    .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee; } .info-row span { color: #666; }\n    .full-width { width: 100%; }\n    .billing-summary { background: #f5f5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0; }\n    .billing-summary h4 { margin: 0 0 0.5rem; }\n    .billing-row { display: flex; justify-content: space-between; padding: 0.25rem 0; }\n    .billing-row.total { border-top: 1px solid #ccc; padding-top: 0.5rem; margin-top: 0.5rem; font-weight: 600; }\n    .billing-row.balance { color: #f44336; font-weight: 600; }\n    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }"] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ApiService }, { type: i3.ActivatedRoute }, { type: i3.Router }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DischargeComponent, { className: "DischargeComponent", filePath: "app/features/ipd/discharge/discharge.component.ts", lineNumber: 67 }); })();
//# sourceMappingURL=discharge.component.js.map