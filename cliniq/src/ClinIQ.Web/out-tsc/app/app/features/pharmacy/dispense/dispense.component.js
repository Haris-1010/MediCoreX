import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/router";
import * as i3 from "../../../core/services/notification.service";
import * as i4 from "@angular/common";
import * as i5 from "@angular/forms";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/input";
import * as i8 from "@angular/material/table";
import * as i9 from "../../../shared/components/page-header/page-header.component";
import * as i10 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Pharmacy", route: "/pharmacy" });
const _c1 = () => ({ label: "Dispense" });
const _c2 = (a0, a1) => [a0, a1];
function DispenseComponent_div_2_th_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 22);
    i0.ɵɵtext(1, "Medication");
    i0.ɵɵelementEnd();
} }
function DispenseComponent_div_2_td_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 23);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const m_r2 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(m_r2.medicationName);
} }
function DispenseComponent_div_2_th_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 22);
    i0.ɵɵtext(1, "Dosage");
    i0.ɵɵelementEnd();
} }
function DispenseComponent_div_2_td_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 23);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const m_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(m_r3.dosage);
} }
function DispenseComponent_div_2_th_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 22);
    i0.ɵɵtext(1, "Frequency");
    i0.ɵɵelementEnd();
} }
function DispenseComponent_div_2_td_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 23);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const m_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(m_r4.frequency);
} }
function DispenseComponent_div_2_th_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 22);
    i0.ɵɵtext(1, "Qty");
    i0.ɵɵelementEnd();
} }
function DispenseComponent_div_2_td_40_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "td", 23)(1, "input", 24);
    i0.ɵɵtwoWayListener("ngModelChange", function DispenseComponent_div_2_td_40_Template_input_ngModelChange_1_listener($event) { const m_r6 = i0.ɵɵrestoreView(_r5).$implicit; i0.ɵɵtwoWayBindingSet(m_r6.dispenseQuantity, $event) || (m_r6.dispenseQuantity = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const m_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", m_r6.dispenseQuantity);
    i0.ɵɵproperty("max", m_r6.prescribedQuantity);
} }
function DispenseComponent_div_2_th_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 22);
    i0.ɵɵtext(1, "Stock");
    i0.ɵɵelementEnd();
} }
function DispenseComponent_div_2_td_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 23);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const m_r7 = ctx.$implicit;
    i0.ɵɵclassProp("low", m_r7.stockQuantity < m_r7.prescribedQuantity);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(m_r7.stockQuantity);
} }
function DispenseComponent_div_2_th_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 22);
    i0.ɵɵtext(1, "Price");
    i0.ɵɵelementEnd();
} }
function DispenseComponent_div_2_td_46_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 23);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "currency");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const m_r8 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, m_r8.unitPrice * m_r8.dispenseQuantity));
} }
function DispenseComponent_div_2_tr_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 25);
} }
function DispenseComponent_div_2_tr_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 26);
} }
function DispenseComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 2)(1, "div", 3)(2, "h3");
    i0.ɵɵtext(3, "Patient Information");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 4)(5, "span");
    i0.ɵɵtext(6, "Name:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "strong");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 4)(10, "span");
    i0.ɵɵtext(11, "MRN:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "strong");
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div", 4)(15, "span");
    i0.ɵɵtext(16, "Doctor:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "strong");
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "div", 4)(20, "span");
    i0.ɵɵtext(21, "Date:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "strong");
    i0.ɵɵtext(23);
    i0.ɵɵpipe(24, "date");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(25, "div", 5)(26, "h3");
    i0.ɵɵtext(27, "Medications");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "table", 6);
    i0.ɵɵelementContainerStart(29, 7);
    i0.ɵɵtemplate(30, DispenseComponent_div_2_th_30_Template, 2, 0, "th", 8)(31, DispenseComponent_div_2_td_31_Template, 2, 1, "td", 9);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(32, 10);
    i0.ɵɵtemplate(33, DispenseComponent_div_2_th_33_Template, 2, 0, "th", 8)(34, DispenseComponent_div_2_td_34_Template, 2, 1, "td", 9);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(35, 11);
    i0.ɵɵtemplate(36, DispenseComponent_div_2_th_36_Template, 2, 0, "th", 8)(37, DispenseComponent_div_2_td_37_Template, 2, 1, "td", 9);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(38, 12);
    i0.ɵɵtemplate(39, DispenseComponent_div_2_th_39_Template, 2, 0, "th", 8)(40, DispenseComponent_div_2_td_40_Template, 2, 2, "td", 9);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(41, 13);
    i0.ɵɵtemplate(42, DispenseComponent_div_2_th_42_Template, 2, 0, "th", 8)(43, DispenseComponent_div_2_td_43_Template, 2, 3, "td", 14);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(44, 15);
    i0.ɵɵtemplate(45, DispenseComponent_div_2_th_45_Template, 2, 0, "th", 8)(46, DispenseComponent_div_2_td_46_Template, 3, 3, "td", 9);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵtemplate(47, DispenseComponent_div_2_tr_47_Template, 1, 0, "tr", 16)(48, DispenseComponent_div_2_tr_48_Template, 1, 0, "tr", 17);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "div", 18)(50, "span");
    i0.ɵɵtext(51, "Total:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(52, "strong");
    i0.ɵɵtext(53);
    i0.ɵɵpipe(54, "currency");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(55, "div", 19)(56, "button", 20);
    i0.ɵɵtext(57, "Cancel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(58, "button", 21);
    i0.ɵɵlistener("click", function DispenseComponent_div_2_Template_button_click_58_listener() { i0.ɵɵrestoreView(_r1); const ctx_r8 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r8.dispense()); });
    i0.ɵɵtext(59);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r8 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r8.prescription.patientName);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r8.prescription.mrn);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("Dr. ", ctx_r8.prescription.doctorName, "");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(24, 10, ctx_r8.prescription.date, "mediumDate"));
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("dataSource", ctx_r8.prescription.items);
    i0.ɵɵadvance(19);
    i0.ɵɵproperty("matHeaderRowDef", ctx_r8.columns);
    i0.ɵɵadvance();
    i0.ɵɵproperty("matRowDefColumns", ctx_r8.columns);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(54, 13, ctx_r8.calculateTotal()));
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("disabled", ctx_r8.dispensing);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r8.dispensing ? "Processing..." : "Dispense & Bill");
} }
export class DispenseComponent {
    constructor(api, route, router, notification) {
        this.api = api;
        this.route = route;
        this.router = router;
        this.notification = notification;
        this.dispensing = false;
        this.columns = ['medication', 'dosage', 'frequency', 'quantity', 'stock', 'price'];
    }
    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('prescriptionId');
        if (id)
            this.api.getById('v1/pharmacy/prescriptions', id).subscribe(r => { this.prescription = r; r.items.forEach((i) => i.dispenseQuantity = i.prescribedQuantity); });
    }
    calculateTotal() { return this.prescription?.items.reduce((sum, i) => sum + (i.unitPrice * i.dispenseQuantity), 0) || 0; }
    dispense() {
        this.dispensing = true;
        const data = { prescriptionId: this.prescription.id, items: this.prescription.items.map((i) => ({ medicationId: i.medicationId, quantity: i.dispenseQuantity })) };
        this.api.post('v1/pharmacy/dispense', data).subscribe({
            next: () => { this.notification.success('Medications dispensed'); this.router.navigate(['/pharmacy']); },
            error: () => this.dispensing = false
        });
    }
    static { this.ɵfac = function DispenseComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DispenseComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.ActivatedRoute), i0.ɵɵdirectiveInject(i2.Router), i0.ɵɵdirectiveInject(i3.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DispenseComponent, selectors: [["app-dispense"]], standalone: false, decls: 3, vars: 7, consts: [["title", "Dispense Medication", 3, "breadcrumbs"], ["class", "dispense-grid", 4, "ngIf"], [1, "dispense-grid"], [1, "card", "patient-info"], [1, "info-row"], [1, "card", "medications"], ["mat-table", "", 3, "dataSource"], ["matColumnDef", "medication"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "dosage"], ["matColumnDef", "frequency"], ["matColumnDef", "quantity"], ["matColumnDef", "stock"], ["mat-cell", "", 3, "low", 4, "matCellDef"], ["matColumnDef", "price"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], [1, "totals"], [1, "form-actions"], ["mat-stroked-button", "", "routerLink", "/pharmacy"], ["mat-raised-button", "", "color", "primary", 3, "click", "disabled"], ["mat-header-cell", ""], ["mat-cell", ""], ["matInput", "", "type", "number", 1, "qty-input", 3, "ngModelChange", "ngModel", "max"], ["mat-header-row", ""], ["mat-row", ""]], template: function DispenseComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵtemplate(2, DispenseComponent_div_2_Template, 60, 15, "div", 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(4, _c2, i0.ɵɵpureFunction0(2, _c0), i0.ɵɵpureFunction0(3, _c1)));
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.prescription);
        } }, dependencies: [i4.NgIf, i5.DefaultValueAccessor, i5.NumberValueAccessor, i5.NgControlStatus, i5.MaxValidator, i5.NgModel, i2.RouterLink, i6.MatButton, i7.MatInput, i8.MatTable, i8.MatHeaderCellDef, i8.MatHeaderRowDef, i8.MatColumnDef, i8.MatCellDef, i8.MatRowDef, i8.MatHeaderCell, i8.MatCell, i8.MatHeaderRow, i8.MatRow, i9.PageHeaderComponent, i10.MainLayoutComponent, i4.CurrencyPipe, i4.DatePipe], styles: [".dispense-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem; }\n    .card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 1rem; }\n    .info-row[_ngcontent-%COMP%] { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee; } .info-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] { color: #666; }\n    table[_ngcontent-%COMP%] { width: 100%; } .qty-input[_ngcontent-%COMP%] { width: 60px; text-align: center; } .low[_ngcontent-%COMP%] { color: #f44336; }\n    .totals[_ngcontent-%COMP%] { display: flex; justify-content: flex-end; gap: 1rem; padding: 1rem; font-size: 1.25rem; }\n    .form-actions[_ngcontent-%COMP%] { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DispenseComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-dispense', template: `
    <app-main-layout>
      <app-page-header title="Dispense Medication" [breadcrumbs]="[{ label: 'Pharmacy', route: '/pharmacy' }, { label: 'Dispense' }]"></app-page-header>
      <div class="dispense-grid" *ngIf="prescription">
        <div class="card patient-info">
          <h3>Patient Information</h3>
          <div class="info-row"><span>Name:</span><strong>{{ prescription.patientName }}</strong></div>
          <div class="info-row"><span>MRN:</span><strong>{{ prescription.mrn }}</strong></div>
          <div class="info-row"><span>Doctor:</span><strong>Dr. {{ prescription.doctorName }}</strong></div>
          <div class="info-row"><span>Date:</span><strong>{{ prescription.date | date:'mediumDate' }}</strong></div>
        </div>
        <div class="card medications">
          <h3>Medications</h3>
          <table mat-table [dataSource]="prescription.items">
            <ng-container matColumnDef="medication"><th mat-header-cell *matHeaderCellDef>Medication</th><td mat-cell *matCellDef="let m">{{ m.medicationName }}</td></ng-container>
            <ng-container matColumnDef="dosage"><th mat-header-cell *matHeaderCellDef>Dosage</th><td mat-cell *matCellDef="let m">{{ m.dosage }}</td></ng-container>
            <ng-container matColumnDef="frequency"><th mat-header-cell *matHeaderCellDef>Frequency</th><td mat-cell *matCellDef="let m">{{ m.frequency }}</td></ng-container>
            <ng-container matColumnDef="quantity"><th mat-header-cell *matHeaderCellDef>Qty</th><td mat-cell *matCellDef="let m"><input matInput type="number" [(ngModel)]="m.dispenseQuantity" [max]="m.prescribedQuantity" class="qty-input"></td></ng-container>
            <ng-container matColumnDef="stock"><th mat-header-cell *matHeaderCellDef>Stock</th><td mat-cell *matCellDef="let m" [class.low]="m.stockQuantity < m.prescribedQuantity">{{ m.stockQuantity }}</td></ng-container>
            <ng-container matColumnDef="price"><th mat-header-cell *matHeaderCellDef>Price</th><td mat-cell *matCellDef="let m">{{ m.unitPrice * m.dispenseQuantity | currency }}</td></ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
          <div class="totals"><span>Total:</span><strong>{{ calculateTotal() | currency }}</strong></div>
          <div class="form-actions">
            <button mat-stroked-button routerLink="/pharmacy">Cancel</button>
            <button mat-raised-button color="primary" (click)="dispense()" [disabled]="dispensing">{{ dispensing ? 'Processing...' : 'Dispense & Bill' }}</button>
          </div>
        </div>
      </div>
    </app-main-layout>
  `, styles: [".dispense-grid { display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem; }\n    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }\n    .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee; } .info-row span { color: #666; }\n    table { width: 100%; } .qty-input { width: 60px; text-align: center; } .low { color: #f44336; }\n    .totals { display: flex; justify-content: flex-end; gap: 1rem; padding: 1rem; font-size: 1.25rem; }\n    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }"] }]
    }], () => [{ type: i1.ApiService }, { type: i2.ActivatedRoute }, { type: i2.Router }, { type: i3.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DispenseComponent, { className: "DispenseComponent", filePath: "app/features/pharmacy/dispense/dispense.component.ts", lineNumber: 48 }); })();
//# sourceMappingURL=dispense.component.js.map