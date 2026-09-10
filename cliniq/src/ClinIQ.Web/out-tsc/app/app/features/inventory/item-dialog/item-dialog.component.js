import { Component, Inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../../core/services/api.service";
import * as i3 from "../../../core/services/notification.service";
import * as i4 from "@angular/material/dialog";
import * as i5 from "@angular/common";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/material/input";
import * as i9 from "@angular/material/select";
function ItemDialogComponent_form_5_mat_option_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 25);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const c_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", c_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(c_r1.name);
} }
function ItemDialogComponent_form_5_mat_error_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Required");
    i0.ɵɵelementEnd();
} }
function ItemDialogComponent_form_5_mat_error_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Min 0");
    i0.ɵɵelementEnd();
} }
function ItemDialogComponent_form_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "form", 6)(1, "mat-form-field", 7)(2, "mat-label");
    i0.ɵɵtext(3, "Item Name");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(4, "input", 8);
    i0.ɵɵelementStart(5, "mat-error");
    i0.ɵɵtext(6, "Name is required");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "mat-form-field", 7)(8, "mat-label");
    i0.ɵɵtext(9, "SKU");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(10, "input", 9);
    i0.ɵɵelementStart(11, "mat-error");
    i0.ɵɵtext(12, "SKU is required");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 10)(14, "mat-form-field", 11)(15, "mat-label");
    i0.ɵɵtext(16, "Category");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "mat-select", 12);
    i0.ɵɵtemplate(18, ItemDialogComponent_form_5_mat_option_18_Template, 2, 2, "mat-option", 13);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "mat-form-field", 11)(20, "mat-label");
    i0.ɵɵtext(21, "Unit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "mat-select", 14)(23, "mat-option", 15);
    i0.ɵɵtext(24, "Pieces");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "mat-option", 16);
    i0.ɵɵtext(26, "Box");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "mat-option", 17);
    i0.ɵɵtext(28, "Bottle");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "mat-option", 18);
    i0.ɵɵtext(30, "Strip");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "mat-option", 19);
    i0.ɵɵtext(32, "Sachet");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(33, "div", 10)(34, "mat-form-field", 11)(35, "mat-label");
    i0.ɵɵtext(36, "Quantity");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(37, "input", 20);
    i0.ɵɵtemplate(38, ItemDialogComponent_form_5_mat_error_38_Template, 2, 0, "mat-error", 2)(39, ItemDialogComponent_form_5_mat_error_39_Template, 2, 0, "mat-error", 2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "mat-form-field", 11)(41, "mat-label");
    i0.ɵɵtext(42, "Reorder Level");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(43, "input", 21);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(44, "div", 10)(45, "mat-form-field", 11)(46, "mat-label");
    i0.ɵɵtext(47, "Unit Price");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(48, "input", 22);
    i0.ɵɵelementStart(49, "span", 23);
    i0.ɵɵtext(50, "$\u00A0");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(51, "mat-form-field", 11)(52, "mat-label");
    i0.ɵɵtext(53, "Supplier");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(54, "input", 24);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("formGroup", ctx_r1.itemForm);
    i0.ɵɵadvance(18);
    i0.ɵɵproperty("ngForOf", ctx_r1.categories);
    i0.ɵɵadvance(20);
    i0.ɵɵproperty("ngIf", (tmp_3_0 = ctx_r1.itemForm.get("quantity")) == null ? null : tmp_3_0.hasError("required"));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", (tmp_4_0 = ctx_r1.itemForm.get("quantity")) == null ? null : tmp_4_0.hasError("min"));
} }
function ItemDialogComponent_div_6_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 40)(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.data.item.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ctx_r1.data.item.quantity, " ", ctx_r1.data.item.unit, "");
} }
function ItemDialogComponent_div_6_mat_error_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Must be at least 1");
    i0.ɵɵelementEnd();
} }
function ItemDialogComponent_div_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div");
    i0.ɵɵtemplate(1, ItemDialogComponent_div_6_div_1_Template, 5, 3, "div", 26);
    i0.ɵɵelementStart(2, "form", 6)(3, "div", 10)(4, "mat-form-field", 11)(5, "mat-label");
    i0.ɵɵtext(6, "Adjustment Type");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "mat-select", 27)(8, "mat-option", 28);
    i0.ɵɵtext(9, "Add (+)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "mat-option", 29);
    i0.ɵɵtext(11, "Remove (-)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "mat-option", 30);
    i0.ɵɵtext(13, "Set to");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(14, "mat-form-field", 11)(15, "mat-label");
    i0.ɵɵtext(16, "Quantity");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(17, "input", 20);
    i0.ɵɵtemplate(18, ItemDialogComponent_div_6_mat_error_18_Template, 2, 0, "mat-error", 2);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "mat-form-field", 7)(20, "mat-label");
    i0.ɵɵtext(21, "Reason");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "mat-select", 31)(23, "mat-option", 32);
    i0.ɵɵtext(24, "Damaged");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "mat-option", 33);
    i0.ɵɵtext(26, "Expired");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "mat-option", 34);
    i0.ɵɵtext(28, "Lost");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "mat-option", 35);
    i0.ɵɵtext(30, "Found");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "mat-option", 36);
    i0.ɵɵtext(32, "Correction");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "mat-option", 37);
    i0.ɵɵtext(34, "Received (PO)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "mat-option", 38);
    i0.ɵɵtext(36, "Other");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(37, "mat-form-field", 7)(38, "mat-label");
    i0.ɵɵtext(39, "Notes");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(40, "textarea", 39);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.data.item);
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroup", ctx_r1.adjustForm);
    i0.ɵɵadvance(16);
    i0.ɵɵproperty("ngIf", (tmp_3_0 = ctx_r1.adjustForm.get("quantity")) == null ? null : tmp_3_0.hasError("min"));
} }
export class ItemDialogComponent {
    get modeIcon() {
        if (this.data.mode === 'add')
            return 'add_box';
        if (this.data.mode === 'edit')
            return 'edit';
        return 'tune';
    }
    constructor(fb, api, notification, dialogRef, data) {
        this.fb = fb;
        this.api = api;
        this.notification = notification;
        this.dialogRef = dialogRef;
        this.data = data;
        this.categories = [];
        this.saving = false;
    }
    ngOnInit() {
        this.api.get('v1/inventory/categories').subscribe(r => this.categories = r);
        if (this.data.mode === 'adjust') {
            this.adjustForm = this.fb.group({
                adjustmentType: ['Add', Validators.required],
                quantity: [1, [Validators.required, Validators.min(1)]],
                reason: ['', Validators.required],
                notes: ['']
            });
        }
        else {
            const item = this.data.item;
            this.itemForm = this.fb.group({
                name: [item?.name || '', Validators.required],
                sku: [item?.sku || '', Validators.required],
                categoryId: [item?.categoryId || ''],
                unit: [item?.unit || 'pcs'],
                quantity: [item?.quantity || 0, [Validators.required, Validators.min(0)]],
                reorderLevel: [item?.reorderLevel || 10],
                unitPrice: [item?.unitPrice || 0],
                supplierName: [item?.supplierName || '']
            });
        }
    }
    onSave() {
        if (this.data.mode === 'adjust' && this.adjustForm.invalid)
            return;
        if (this.data.mode !== 'adjust' && this.itemForm.invalid)
            return;
        this.saving = true;
        if (this.data.mode === 'adjust') {
            const formValue = this.adjustForm.value;
            const payload = {
                itemId: this.data.item.id,
                adjustmentType: formValue.adjustmentType,
                quantity: formValue.quantity,
                reason: formValue.reason,
                notes: formValue.notes || null
            };
            this.api.post('v1/inventory/adjustments', payload).subscribe({
                next: () => {
                    this.notification.success('Stock adjusted successfully');
                    this.dialogRef.close(true);
                },
                error: () => { this.saving = false; }
            });
        }
        else {
            const formValue = this.itemForm.value;
            const request = this.data.mode === 'edit'
                ? this.api.put('v1/inventory/items', this.data.item.id, formValue)
                : this.api.post('v1/inventory/items', formValue);
            request.subscribe({
                next: () => {
                    this.notification.success(this.data.mode === 'edit' ? 'Item updated' : 'Item added');
                    this.dialogRef.close(true);
                },
                error: () => { this.saving = false; }
            });
        }
    }
    static { this.ɵfac = function ItemDialogComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ItemDialogComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.NotificationService), i0.ɵɵdirectiveInject(i4.MatDialogRef), i0.ɵɵdirectiveInject(MAT_DIALOG_DATA)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ItemDialogComponent, selectors: [["app-item-dialog"]], standalone: false, decls: 12, vars: 6, consts: [["mat-dialog-title", ""], [3, "formGroup", 4, "ngIf"], [4, "ngIf"], ["align", "end"], ["mat-button", "", "mat-dialog-close", ""], ["mat-raised-button", "", "color", "primary", 3, "click", "disabled"], [3, "formGroup"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "formControlName", "name", "placeholder", "Enter item name"], ["matInput", "", "formControlName", "sku", "placeholder", "e.g. MED-001"], [1, "form-row"], ["appearance", "outline"], ["formControlName", "categoryId"], [3, "value", 4, "ngFor", "ngForOf"], ["formControlName", "unit"], ["value", "pcs"], ["value", "box"], ["value", "bottle"], ["value", "strip"], ["value", "sachet"], ["matInput", "", "type", "number", "formControlName", "quantity"], ["matInput", "", "type", "number", "formControlName", "reorderLevel"], ["matInput", "", "type", "number", "formControlName", "unitPrice"], ["matPrefix", ""], ["matInput", "", "formControlName", "supplierName", "placeholder", "Supplier name"], [3, "value"], ["class", "current-stock", 4, "ngIf"], ["formControlName", "adjustmentType"], ["value", "Add"], ["value", "Remove"], ["value", "Set"], ["formControlName", "reason"], ["value", "Damaged"], ["value", "Expired"], ["value", "Lost"], ["value", "Found"], ["value", "Correction"], ["value", "Received"], ["value", "Other"], ["matInput", "", "formControlName", "notes", "rows", "2", "placeholder", "Optional notes"], [1, "current-stock"]], template: function ItemDialogComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "h2", 0)(1, "mat-icon");
            i0.ɵɵtext(2);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(3);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "mat-dialog-content");
            i0.ɵɵtemplate(5, ItemDialogComponent_form_5_Template, 55, 4, "form", 1)(6, ItemDialogComponent_div_6_Template, 41, 3, "div", 2);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "mat-dialog-actions", 3)(8, "button", 4);
            i0.ɵɵtext(9, "Cancel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "button", 5);
            i0.ɵɵlistener("click", function ItemDialogComponent_Template_button_click_10_listener() { return ctx.onSave(); });
            i0.ɵɵtext(11);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.modeIcon);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.data.mode === "add" ? "Add New Item" : ctx.data.mode === "edit" ? "Edit Item" : "Adjust Stock", " ");
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.data.mode !== "adjust");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.data.mode === "adjust");
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("disabled", ctx.saving);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.saving ? "Saving..." : ctx.data.mode === "adjust" ? "Submit" : "Save", " ");
        } }, dependencies: [i5.NgForOf, i5.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i6.MatButton, i7.MatIcon, i8.MatInput, i8.MatFormField, i8.MatLabel, i8.MatError, i8.MatPrefix, i9.MatSelect, i9.MatOption, i4.MatDialogClose, i4.MatDialogTitle, i4.MatDialogActions, i4.MatDialogContent], styles: ["h2[mat-dialog-title][_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n    }\n    .full-width[_ngcontent-%COMP%] { width: 100%; }\n    .form-row[_ngcontent-%COMP%] { display: flex; gap: 1rem; }\n    .form-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] { flex: 1; }\n    .current-stock[_ngcontent-%COMP%] {\n      background: #e3f2fd;\n      padding: 1rem;\n      border-radius: 8px;\n      margin-bottom: 1rem;\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n    }\n    mat-dialog-content[_ngcontent-%COMP%] { min-width: 400px; max-width: 550px; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ItemDialogComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-item-dialog', template: `
    <h2 mat-dialog-title>
      <mat-icon>{{ modeIcon }}</mat-icon>
      {{ data.mode === 'add' ? 'Add New Item' : data.mode === 'edit' ? 'Edit Item' : 'Adjust Stock' }}
    </h2>

    <mat-dialog-content>
      <!-- Add/Edit Form -->
      <form *ngIf="data.mode !== 'adjust'" [formGroup]="itemForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Item Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter item name">
          <mat-error>Name is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>SKU</mat-label>
          <input matInput formControlName="sku" placeholder="e.g. MED-001">
          <mat-error>SKU is required</mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select formControlName="categoryId">
              <mat-option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Unit</mat-label>
            <mat-select formControlName="unit">
              <mat-option value="pcs">Pieces</mat-option>
              <mat-option value="box">Box</mat-option>
              <mat-option value="bottle">Bottle</mat-option>
              <mat-option value="strip">Strip</mat-option>
              <mat-option value="sachet">Sachet</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Quantity</mat-label>
            <input matInput type="number" formControlName="quantity">
            <mat-error *ngIf="itemForm.get('quantity')?.hasError('required')">Required</mat-error>
            <mat-error *ngIf="itemForm.get('quantity')?.hasError('min')">Min 0</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Reorder Level</mat-label>
            <input matInput type="number" formControlName="reorderLevel">
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Unit Price</mat-label>
            <input matInput type="number" formControlName="unitPrice">
            <span matPrefix>$&nbsp;</span>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Supplier</mat-label>
            <input matInput formControlName="supplierName" placeholder="Supplier name">
          </mat-form-field>
        </div>
      </form>

      <!-- Adjust Stock Form -->
      <div *ngIf="data.mode === 'adjust'">
        <div class="current-stock" *ngIf="data.item">
          <span>{{ data.item.name }}</span>
          <strong>{{ data.item.quantity }} {{ data.item.unit }}</strong>
        </div>
        <form [formGroup]="adjustForm">
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Adjustment Type</mat-label>
              <mat-select formControlName="adjustmentType">
                <mat-option value="Add">Add (+)</mat-option>
                <mat-option value="Remove">Remove (-)</mat-option>
                <mat-option value="Set">Set to</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Quantity</mat-label>
              <input matInput type="number" formControlName="quantity">
              <mat-error *ngIf="adjustForm.get('quantity')?.hasError('min')">Must be at least 1</mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Reason</mat-label>
            <mat-select formControlName="reason">
              <mat-option value="Damaged">Damaged</mat-option>
              <mat-option value="Expired">Expired</mat-option>
              <mat-option value="Lost">Lost</mat-option>
              <mat-option value="Found">Found</mat-option>
              <mat-option value="Correction">Correction</mat-option>
              <mat-option value="Received">Received (PO)</mat-option>
              <mat-option value="Other">Other</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Notes</mat-label>
            <textarea matInput formControlName="notes" rows="2" placeholder="Optional notes"></textarea>
          </mat-form-field>
        </form>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="saving">
        {{ saving ? 'Saving...' : (data.mode === 'adjust' ? 'Submit' : 'Save') }}
      </button>
    </mat-dialog-actions>
  `, styles: ["\n    h2[mat-dialog-title] {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n    }\n    .full-width { width: 100%; }\n    .form-row { display: flex; gap: 1rem; }\n    .form-row mat-form-field { flex: 1; }\n    .current-stock {\n      background: #e3f2fd;\n      padding: 1rem;\n      border-radius: 8px;\n      margin-bottom: 1rem;\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n    }\n    mat-dialog-content { min-width: 400px; max-width: 550px; }\n  "] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ApiService }, { type: i3.NotificationService }, { type: i4.MatDialogRef }, { type: undefined, decorators: [{
                type: Inject,
                args: [MAT_DIALOG_DATA]
            }] }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ItemDialogComponent, { className: "ItemDialogComponent", filePath: "app/features/inventory/item-dialog/item-dialog.component.ts", lineNumber: 157 }); })();
//# sourceMappingURL=item-dialog.component.js.map