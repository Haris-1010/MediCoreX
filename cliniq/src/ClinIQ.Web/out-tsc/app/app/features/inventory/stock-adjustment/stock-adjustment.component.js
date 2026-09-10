import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../../core/services/api.service";
import * as i3 from "../../../core/services/notification.service";
import * as i4 from "@angular/common";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/material/input";
import * as i7 from "@angular/material/select";
import * as i8 from "@angular/material/autocomplete";
import * as i9 from "../../../shared/components/page-header/page-header.component";
import * as i10 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Inventory", route: "/inventory" });
const _c1 = () => ({ label: "Adjustments" });
const _c2 = (a0, a1) => [a0, a1];
function StockAdjustmentComponent_mat_option_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r2 = ctx.$implicit;
    i0.ɵɵproperty("value", i_r2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", i_r2.name, " (", i_r2.sku, ")");
} }
function StockAdjustmentComponent_div_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 27)(1, "span");
    i0.ɵɵtext(2, "Current Stock:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2("", ctx_r2.selectedItem.quantity, " ", ctx_r2.selectedItem.unit, "");
} }
export class StockAdjustmentComponent {
    constructor(fb, api, notification) {
        this.fb = fb;
        this.api = api;
        this.notification = notification;
        this.saving = false;
        this.filteredItems = [];
        this.selectedItem = null;
    }
    ngOnInit() {
        this.form = this.fb.group({ itemId: ['', Validators.required], itemSearch: [''], adjustmentType: ['Add', Validators.required], quantity: ['', [Validators.required, Validators.min(1)]], reason: ['', Validators.required], notes: [''] });
        this.form.get('itemSearch')?.valueChanges.subscribe(val => {
            if (typeof val === 'string' && val.length >= 2)
                this.api.get('v1/inventory/items/search', { term: val }).subscribe(r => this.filteredItems = r);
        });
    }
    displayItem(i) { return i ? `${i.name} (${i.sku})` : ''; }
    onItemSelected(e) { this.selectedItem = e.option.value; this.form.patchValue({ itemId: e.option.value.id }); }
    submit() {
        if (this.form.invalid)
            return;
        this.saving = true;
        this.api.post('v1/inventory/adjustments', this.form.value).subscribe({
            next: () => { this.notification.success('Stock adjusted'); this.form.reset(); this.selectedItem = null; this.saving = false; },
            error: () => this.saving = false
        });
    }
    static { this.ɵfac = function StockAdjustmentComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StockAdjustmentComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StockAdjustmentComponent, selectors: [["app-stock-adjustment"]], standalone: false, decls: 50, vars: 13, consts: [["itemAuto", "matAutocomplete"], ["title", "Stock Adjustment", 3, "breadcrumbs"], [1, "card"], [3, "ngSubmit", "formGroup"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "formControlName", "itemSearch", 3, "matAutocomplete"], [3, "optionSelected", "displayWith"], [3, "value", 4, "ngFor", "ngForOf"], ["class", "current-stock", 4, "ngIf"], [1, "form-row"], ["appearance", "outline"], ["formControlName", "adjustmentType"], ["value", "Add"], ["value", "Remove"], ["value", "Set"], ["matInput", "", "type", "number", "formControlName", "quantity"], ["formControlName", "reason"], ["value", "Damaged"], ["value", "Expired"], ["value", "Lost"], ["value", "Found"], ["value", "Correction"], ["value", "Other"], ["matInput", "", "formControlName", "notes", "rows", "2"], [1, "form-actions"], ["mat-raised-button", "", "color", "primary", "type", "submit", 3, "disabled"], [3, "value"], [1, "current-stock"]], template: function StockAdjustmentComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 1);
            i0.ɵɵelementStart(2, "div", 2)(3, "form", 3);
            i0.ɵɵlistener("ngSubmit", function StockAdjustmentComponent_Template_form_ngSubmit_3_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.submit()); });
            i0.ɵɵelementStart(4, "mat-form-field", 4)(5, "mat-label");
            i0.ɵɵtext(6, "Item");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(7, "input", 5);
            i0.ɵɵelementStart(8, "mat-autocomplete", 6, 0);
            i0.ɵɵlistener("optionSelected", function StockAdjustmentComponent_Template_mat_autocomplete_optionSelected_8_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onItemSelected($event)); });
            i0.ɵɵtemplate(10, StockAdjustmentComponent_mat_option_10_Template, 2, 3, "mat-option", 7);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(11, StockAdjustmentComponent_div_11_Template, 5, 2, "div", 8);
            i0.ɵɵelementStart(12, "div", 9)(13, "mat-form-field", 10)(14, "mat-label");
            i0.ɵɵtext(15, "Adjustment Type");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "mat-select", 11)(17, "mat-option", 12);
            i0.ɵɵtext(18, "Add");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "mat-option", 13);
            i0.ɵɵtext(20, "Remove");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "mat-option", 14);
            i0.ɵɵtext(22, "Set to");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(23, "mat-form-field", 10)(24, "mat-label");
            i0.ɵɵtext(25, "Quantity");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(26, "input", 15);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(27, "mat-form-field", 4)(28, "mat-label");
            i0.ɵɵtext(29, "Reason");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "mat-select", 16)(31, "mat-option", 17);
            i0.ɵɵtext(32, "Damaged");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(33, "mat-option", 18);
            i0.ɵɵtext(34, "Expired");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "mat-option", 19);
            i0.ɵɵtext(36, "Lost");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "mat-option", 20);
            i0.ɵɵtext(38, "Found");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "mat-option", 21);
            i0.ɵɵtext(40, "Correction");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "mat-option", 22);
            i0.ɵɵtext(42, "Other");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(43, "mat-form-field", 4)(44, "mat-label");
            i0.ɵɵtext(45, "Notes");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(46, "textarea", 23);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(47, "div", 24)(48, "button", 25);
            i0.ɵɵtext(49);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            const itemAuto_r4 = i0.ɵɵreference(9);
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(10, _c2, i0.ɵɵpureFunction0(8, _c0), i0.ɵɵpureFunction0(9, _c1)));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("formGroup", ctx.form);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("matAutocomplete", itemAuto_r4);
            i0.ɵɵadvance();
            i0.ɵɵproperty("displayWith", ctx.displayItem);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngForOf", ctx.filteredItems);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.selectedItem);
            i0.ɵɵadvance(37);
            i0.ɵɵproperty("disabled", ctx.form.invalid || ctx.saving);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate(ctx.saving ? "Saving..." : "Submit Adjustment");
        } }, dependencies: [i4.NgForOf, i4.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i5.MatButton, i6.MatInput, i6.MatFormField, i6.MatLabel, i7.MatSelect, i7.MatOption, i8.MatAutocomplete, i8.MatAutocompleteTrigger, i9.PageHeaderComponent, i10.MainLayoutComponent], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; max-width: 600px; }\n    .form-row[_ngcontent-%COMP%] { display: flex; gap: 1rem; } .form-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] { flex: 1; } .full-width[_ngcontent-%COMP%] { width: 100%; }\n    .current-stock[_ngcontent-%COMP%] { background: #e3f2fd; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; justify-content: space-between; }\n    .form-actions[_ngcontent-%COMP%] { margin-top: 1rem; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StockAdjustmentComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-stock-adjustment', template: `
    <app-main-layout>
      <app-page-header title="Stock Adjustment" [breadcrumbs]="[{ label: 'Inventory', route: '/inventory' }, { label: 'Adjustments' }]"></app-page-header>
      <div class="card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width"><mat-label>Item</mat-label>
            <input matInput [matAutocomplete]="itemAuto" formControlName="itemSearch">
            <mat-autocomplete #itemAuto="matAutocomplete" [displayWith]="displayItem" (optionSelected)="onItemSelected($event)">
              <mat-option *ngFor="let i of filteredItems" [value]="i">{{ i.name }} ({{ i.sku }})</mat-option>
            </mat-autocomplete>
          </mat-form-field>
          <div class="current-stock" *ngIf="selectedItem"><span>Current Stock:</span><strong>{{ selectedItem.quantity }} {{ selectedItem.unit }}</strong></div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Adjustment Type</mat-label>
              <mat-select formControlName="adjustmentType"><mat-option value="Add">Add</mat-option><mat-option value="Remove">Remove</mat-option><mat-option value="Set">Set to</mat-option></mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Quantity</mat-label><input matInput type="number" formControlName="quantity"></mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Reason</mat-label>
            <mat-select formControlName="reason"><mat-option value="Damaged">Damaged</mat-option><mat-option value="Expired">Expired</mat-option><mat-option value="Lost">Lost</mat-option><mat-option value="Found">Found</mat-option><mat-option value="Correction">Correction</mat-option><mat-option value="Other">Other</mat-option></mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Notes</mat-label><textarea matInput formControlName="notes" rows="2"></textarea></mat-form-field>
          <div class="form-actions"><button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : 'Submit Adjustment' }}</button></div>
        </form>
      </div>
    </app-main-layout>
  `, styles: [".card { background: white; padding: 1.5rem; border-radius: 8px; max-width: 600px; }\n    .form-row { display: flex; gap: 1rem; } .form-row mat-form-field { flex: 1; } .full-width { width: 100%; }\n    .current-stock { background: #e3f2fd; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; justify-content: space-between; }\n    .form-actions { margin-top: 1rem; }"] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ApiService }, { type: i3.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StockAdjustmentComponent, { className: "StockAdjustmentComponent", filePath: "app/features/inventory/stock-adjustment/stock-adjustment.component.ts", lineNumber: 41 }); })();
//# sourceMappingURL=stock-adjustment.component.js.map