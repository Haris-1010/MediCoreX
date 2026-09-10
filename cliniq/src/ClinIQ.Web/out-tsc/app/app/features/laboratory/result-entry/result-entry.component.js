import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/router";
import * as i3 from "../../../core/services/notification.service";
import * as i4 from "@angular/common";
import * as i5 from "@angular/forms";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/material/input";
import * as i9 from "../../../shared/components/page-header/page-header.component";
import * as i10 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Laboratory", route: "/laboratory" });
const _c1 = () => ({ label: "Results" });
const _c2 = (a0, a1) => [a0, a1];
function ResultEntryComponent_div_2_div_33_div_4_mat_icon_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-icon", 21);
    i0.ɵɵtext(1, "warning");
    i0.ɵɵelementEnd();
} }
function ResultEntryComponent_div_2_div_33_div_4_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 16)(1, "mat-form-field", 17)(2, "mat-label");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "input", 18);
    i0.ɵɵtwoWayListener("ngModelChange", function ResultEntryComponent_div_2_div_33_div_4_Template_input_ngModelChange_4_listener($event) { const param_r3 = i0.ɵɵrestoreView(_r2).$implicit; i0.ɵɵtwoWayBindingSet(param_r3.value, $event) || (param_r3.value = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "span", 19);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, ResultEntryComponent_div_2_div_33_div_4_mat_icon_7_Template, 2, 0, "mat-icon", 20);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const param_r3 = ctx.$implicit;
    const ctx_r3 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(param_r3.name);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", param_r3.value);
    i0.ɵɵproperty("placeholder", param_r3.unit);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Range: ", param_r3.normalRange, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r3.isAbnormal(param_r3));
} }
function ResultEntryComponent_div_2_div_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 13)(1, "h4");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 14);
    i0.ɵɵtemplate(4, ResultEntryComponent_div_2_div_33_div_4_Template, 8, 5, "div", 15);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const test_r5 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(test_r5.testName);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngForOf", test_r5.parameters);
} }
function ResultEntryComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 2)(1, "div", 3)(2, "h3");
    i0.ɵɵtext(3, "Order Information");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 4)(5, "span");
    i0.ɵɵtext(6, "Order #:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "strong");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 4)(10, "span");
    i0.ɵɵtext(11, "Patient:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "strong");
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div", 4)(15, "span");
    i0.ɵɵtext(16, "MRN:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "strong");
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "div", 4)(20, "span");
    i0.ɵɵtext(21, "Ordered By:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "strong");
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "div", 4)(25, "span");
    i0.ɵɵtext(26, "Date:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "strong");
    i0.ɵɵtext(28);
    i0.ɵɵpipe(29, "date");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(30, "div", 5)(31, "h3");
    i0.ɵɵtext(32, "Test Results");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(33, ResultEntryComponent_div_2_div_33_Template, 5, 2, "div", 6);
    i0.ɵɵelementStart(34, "mat-form-field", 7)(35, "mat-label");
    i0.ɵɵtext(36, "Comments");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "textarea", 8);
    i0.ɵɵtwoWayListener("ngModelChange", function ResultEntryComponent_div_2_Template_textarea_ngModelChange_37_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r3 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r3.comments, $event) || (ctx_r3.comments = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(38, "div", 9)(39, "button", 10);
    i0.ɵɵtext(40, "Cancel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "button", 11);
    i0.ɵɵlistener("click", function ResultEntryComponent_div_2_Template_button_click_41_listener() { i0.ɵɵrestoreView(_r1); const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.save()); });
    i0.ɵɵtext(42, "Save Draft");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "button", 12);
    i0.ɵɵlistener("click", function ResultEntryComponent_div_2_Template_button_click_43_listener() { i0.ɵɵrestoreView(_r1); const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.complete()); });
    i0.ɵɵtext(44);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r3.order.orderNumber);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r3.order.patientName);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r3.order.mrn);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("Dr. ", ctx_r3.order.orderedBy, "");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(29, 9, ctx_r3.order.orderDate, "mediumDate"));
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngForOf", ctx_r3.order.tests);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r3.comments);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("disabled", ctx_r3.saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r3.saving ? "Processing..." : "Complete & Publish");
} }
export class ResultEntryComponent {
    constructor(api, route, router, notification) {
        this.api = api;
        this.route = route;
        this.router = router;
        this.notification = notification;
        this.comments = '';
        this.saving = false;
    }
    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id)
            this.api.getById('v1/laboratory/orders', id).subscribe(r => this.order = r);
    }
    isAbnormal(param) {
        if (!param.value || !param.normalRange)
            return false;
        const [min, max] = param.normalRange.split('-').map((n) => parseFloat(n));
        const val = parseFloat(param.value);
        return val < min || val > max;
    }
    save() {
        this.api.put('v1/laboratory/orders', this.order.id, { tests: this.order.tests, comments: this.comments, status: 'InProgress' }).subscribe(() => this.notification.success('Draft saved'));
    }
    complete() {
        this.saving = true;
        this.api.post(`v1/laboratory/orders/${this.order.id}/complete`, { tests: this.order.tests, comments: this.comments }).subscribe({
            next: () => { this.notification.success('Results published'); this.router.navigate(['/laboratory']); },
            error: () => this.saving = false
        });
    }
    static { this.ɵfac = function ResultEntryComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ResultEntryComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.ActivatedRoute), i0.ɵɵdirectiveInject(i2.Router), i0.ɵɵdirectiveInject(i3.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ResultEntryComponent, selectors: [["app-result-entry"]], standalone: false, decls: 3, vars: 7, consts: [["title", "Enter Lab Results", 3, "breadcrumbs"], ["class", "results-grid", 4, "ngIf"], [1, "results-grid"], [1, "card", "patient-info"], [1, "info-row"], [1, "card", "results-form"], ["class", "test-result", 4, "ngFor", "ngForOf"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "rows", "3", 3, "ngModelChange", "ngModel"], [1, "form-actions"], ["mat-stroked-button", "", "routerLink", "/laboratory"], ["mat-stroked-button", "", 3, "click"], ["mat-raised-button", "", "color", "primary", 3, "click", "disabled"], [1, "test-result"], [1, "parameters"], ["class", "param", 4, "ngFor", "ngForOf"], [1, "param"], ["appearance", "outline"], ["matInput", "", 3, "ngModelChange", "ngModel", "placeholder"], [1, "range"], ["color", "warn", 4, "ngIf"], ["color", "warn"]], template: function ResultEntryComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵtemplate(2, ResultEntryComponent_div_2_Template, 45, 12, "div", 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(4, _c2, i0.ɵɵpureFunction0(2, _c0), i0.ɵɵpureFunction0(3, _c1)));
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.order);
        } }, dependencies: [i4.NgForOf, i4.NgIf, i5.DefaultValueAccessor, i5.NgControlStatus, i5.NgModel, i2.RouterLink, i6.MatButton, i7.MatIcon, i8.MatInput, i8.MatFormField, i8.MatLabel, i9.PageHeaderComponent, i10.MainLayoutComponent, i4.DatePipe], styles: [".results-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem; }\n    .card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 1rem; }\n    .info-row[_ngcontent-%COMP%] { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee; } .info-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] { color: #666; }\n    .test-result[_ngcontent-%COMP%] { margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #eee; }\n    .test-result[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { margin: 0 0 1rem; color: #3f51b5; }\n    .parameters[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }\n    .param[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 0.5rem; } .param[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] { flex: 1; } .range[_ngcontent-%COMP%] { font-size: 0.75rem; color: #666; }\n    .full-width[_ngcontent-%COMP%] { width: 100%; }\n    .form-actions[_ngcontent-%COMP%] { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ResultEntryComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-result-entry', template: `
    <app-main-layout>
      <app-page-header title="Enter Lab Results" [breadcrumbs]="[{ label: 'Laboratory', route: '/laboratory' }, { label: 'Results' }]"></app-page-header>
      <div class="results-grid" *ngIf="order">
        <div class="card patient-info">
          <h3>Order Information</h3>
          <div class="info-row"><span>Order #:</span><strong>{{ order.orderNumber }}</strong></div>
          <div class="info-row"><span>Patient:</span><strong>{{ order.patientName }}</strong></div>
          <div class="info-row"><span>MRN:</span><strong>{{ order.mrn }}</strong></div>
          <div class="info-row"><span>Ordered By:</span><strong>Dr. {{ order.orderedBy }}</strong></div>
          <div class="info-row"><span>Date:</span><strong>{{ order.orderDate | date:'mediumDate' }}</strong></div>
        </div>
        <div class="card results-form">
          <h3>Test Results</h3>
          <div class="test-result" *ngFor="let test of order.tests">
            <h4>{{ test.testName }}</h4>
            <div class="parameters">
              <div class="param" *ngFor="let param of test.parameters">
                <mat-form-field appearance="outline"><mat-label>{{ param.name }}</mat-label><input matInput [(ngModel)]="param.value" [placeholder]="param.unit"></mat-form-field>
                <span class="range">Range: {{ param.normalRange }}</span>
                <mat-icon *ngIf="isAbnormal(param)" color="warn">warning</mat-icon>
              </div>
            </div>
          </div>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Comments</mat-label><textarea matInput [(ngModel)]="comments" rows="3"></textarea></mat-form-field>
          <div class="form-actions">
            <button mat-stroked-button routerLink="/laboratory">Cancel</button>
            <button mat-stroked-button (click)="save()">Save Draft</button>
            <button mat-raised-button color="primary" (click)="complete()" [disabled]="saving">{{ saving ? 'Processing...' : 'Complete & Publish' }}</button>
          </div>
        </div>
      </div>
    </app-main-layout>
  `, styles: [".results-grid { display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem; }\n    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }\n    .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee; } .info-row span { color: #666; }\n    .test-result { margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #eee; }\n    .test-result h4 { margin: 0 0 1rem; color: #3f51b5; }\n    .parameters { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }\n    .param { display: flex; align-items: center; gap: 0.5rem; } .param mat-form-field { flex: 1; } .range { font-size: 0.75rem; color: #666; }\n    .full-width { width: 100%; }\n    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }"] }]
    }], () => [{ type: i1.ApiService }, { type: i2.ActivatedRoute }, { type: i2.Router }, { type: i3.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ResultEntryComponent, { className: "ResultEntryComponent", filePath: "app/features/laboratory/result-entry/result-entry.component.ts", lineNumber: 53 }); })();
//# sourceMappingURL=result-entry.component.js.map