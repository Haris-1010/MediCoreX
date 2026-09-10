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
import * as i11 from "@angular/material/autocomplete";
import * as i12 from "../../../shared/components/page-header/page-header.component";
import * as i13 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Billing", route: "/billing" });
const _c1 = () => ({ label: "Invoices", route: "/billing/invoices" });
const _c2 = a0 => ({ label: a0 });
const _c3 = (a0, a1, a2) => [a0, a1, a2];
function InvoiceFormComponent_mat_option_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 28);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r2 = ctx.$implicit;
    i0.ɵɵproperty("value", p_r2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", p_r2.fullName, " (", p_r2.mrn, ")");
} }
function InvoiceFormComponent_div_29_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 29)(1, "mat-form-field", 7)(2, "mat-label");
    i0.ɵɵtext(3, "Description");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(4, "input", 30);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "mat-form-field", 11)(6, "mat-label");
    i0.ɵɵtext(7, "Qty");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "input", 31);
    i0.ɵɵlistener("input", function InvoiceFormComponent_div_29_Template_input_input_8_listener() { i0.ɵɵrestoreView(_r3); const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.calculateTotals()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "mat-form-field", 11)(10, "mat-label");
    i0.ɵɵtext(11, "Rate");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "input", 32);
    i0.ɵɵlistener("input", function InvoiceFormComponent_div_29_Template_input_input_12_listener() { i0.ɵɵrestoreView(_r3); const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.calculateTotals()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "mat-form-field", 11)(14, "mat-label");
    i0.ɵɵtext(15, "Amount");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(16, "input", 33);
    i0.ɵɵpipe(17, "currency");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "button", 34);
    i0.ɵɵlistener("click", function InvoiceFormComponent_div_29_Template_button_click_18_listener() { const i_r5 = i0.ɵɵrestoreView(_r3).index; const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.removeItem(i_r5)); });
    i0.ɵɵelementStart(19, "mat-icon");
    i0.ɵɵtext(20, "delete");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const i_r5 = ctx.index;
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵproperty("formGroupName", i_r5);
    i0.ɵɵadvance(16);
    i0.ɵɵproperty("value", i0.ɵɵpipeBind1(17, 2, ctx_r3.getItemTotal(i_r5)));
} }
export class InvoiceFormComponent {
    constructor(fb, api, route, router, notification) {
        this.fb = fb;
        this.api = api;
        this.route = route;
        this.router = router;
        this.notification = notification;
        this.isEdit = false;
        this.saving = false;
        this.filteredPatients = [];
        this.subtotal = 0;
        this.taxAmount = 0;
        this.grandTotal = 0;
    }
    ngOnInit() {
        this.form = this.fb.group({
            patientId: ['', Validators.required], patientSearch: [''], invoiceDate: [new Date(), Validators.required], dueDate: [''],
            items: this.fb.array([]), discountAmount: [0], taxPercentage: [0], notes: ['']
        });
        this.addItem();
        this.form.get('patientSearch')?.valueChanges.subscribe(val => {
            if (typeof val === 'string' && val.length >= 2)
                this.api.get('v1/patients/search', { term: val }).subscribe(r => this.filteredPatients = r);
        });
        const id = this.route.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEdit = true;
            this.loadInvoice(id);
        }
    }
    get itemsArray() { return this.form.get('items'); }
    loadInvoice(id) { this.api.getById('v1/invoices', id).subscribe(inv => { this.form.patchValue(inv); this.calculateTotals(); }); }
    displayPatient(p) { return p ? `${p.fullName} (${p.mrn})` : ''; }
    onPatientSelected(e) { this.form.patchValue({ patientId: e.option.value.id }); }
    addItem() { this.itemsArray.push(this.fb.group({ description: ['', Validators.required], quantity: [1], unitPrice: [0] })); }
    removeItem(i) { this.itemsArray.removeAt(i); this.calculateTotals(); }
    getItemTotal(i) { const item = this.itemsArray.at(i).value; return (item.quantity || 0) * (item.unitPrice || 0); }
    calculateTotals() {
        this.subtotal = this.itemsArray.controls.reduce((sum, c) => sum + this.getItemTotal(this.itemsArray.controls.indexOf(c)), 0);
        const discount = this.form.value.discountAmount || 0;
        const taxRate = this.form.value.taxPercentage || 0;
        this.taxAmount = (this.subtotal - discount) * (taxRate / 100);
        this.grandTotal = this.subtotal - discount + this.taxAmount;
    }
    saveAsDraft() { this.form.patchValue({ status: 'Draft' }); this.submit(); }
    submit() {
        if (this.form.invalid)
            return;
        this.saving = true;
        const data = { ...this.form.value, subtotal: this.subtotal, taxAmount: this.taxAmount, totalAmount: this.grandTotal };
        const req = this.isEdit ? this.api.put('v1/invoices', this.route.snapshot.paramMap.get('id'), data) : this.api.post('v1/invoices', data);
        req.subscribe({ next: () => { this.notification.success('Invoice saved'); this.router.navigate(['/billing/invoices']); }, error: () => this.saving = false });
    }
    static { this.ɵfac = function InvoiceFormComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || InvoiceFormComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.ActivatedRoute), i0.ɵɵdirectiveInject(i3.Router), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: InvoiceFormComponent, selectors: [["app-invoice-form"]], standalone: false, decls: 71, vars: 30, consts: [["patientAuto", "matAutocomplete"], ["picker", ""], ["duePicker", ""], [3, "title", "breadcrumbs"], [1, "card"], [3, "ngSubmit", "formGroup"], [1, "form-row"], ["appearance", "outline", 1, "flex-2"], ["matInput", "", "formControlName", "patientSearch", 3, "matAutocomplete"], [3, "optionSelected", "displayWith"], [3, "value", 4, "ngFor", "ngForOf"], ["appearance", "outline"], ["matInput", "", "formControlName", "invoiceDate", 3, "matDatepicker"], ["matIconSuffix", "", 3, "for"], ["matInput", "", "formControlName", "dueDate", 3, "matDatepicker"], ["formArrayName", "items"], ["class", "item-row", 3, "formGroupName", 4, "ngFor", "ngForOf"], ["mat-stroked-button", "", "type", "button", 3, "click"], [1, "totals"], [1, "total-row"], ["matInput", "", "type", "number", "formControlName", "discountAmount", 3, "input"], ["matInput", "", "type", "number", "formControlName", "taxPercentage", 3, "input"], [1, "total-row", "grand"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "formControlName", "notes", "rows", "2"], [1, "form-actions"], ["mat-stroked-button", "", "type", "button", "routerLink", "/billing/invoices"], ["mat-raised-button", "", "color", "primary", "type", "submit", 3, "disabled"], [3, "value"], [1, "item-row", 3, "formGroupName"], ["matInput", "", "formControlName", "description"], ["matInput", "", "type", "number", "formControlName", "quantity", 3, "input"], ["matInput", "", "type", "number", "formControlName", "unitPrice", 3, "input"], ["matInput", "", "readonly", "", 3, "value"], ["mat-icon-button", "", "color", "warn", "type", "button", 3, "click"]], template: function InvoiceFormComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 3);
            i0.ɵɵelementStart(2, "div", 4)(3, "form", 5);
            i0.ɵɵlistener("ngSubmit", function InvoiceFormComponent_Template_form_ngSubmit_3_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.submit()); });
            i0.ɵɵelementStart(4, "div", 6)(5, "mat-form-field", 7)(6, "mat-label");
            i0.ɵɵtext(7, "Patient");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(8, "input", 8);
            i0.ɵɵelementStart(9, "mat-autocomplete", 9, 0);
            i0.ɵɵlistener("optionSelected", function InvoiceFormComponent_Template_mat_autocomplete_optionSelected_9_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onPatientSelected($event)); });
            i0.ɵɵtemplate(11, InvoiceFormComponent_mat_option_11_Template, 2, 3, "mat-option", 10);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(12, "mat-form-field", 11)(13, "mat-label");
            i0.ɵɵtext(14, "Invoice Date");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(15, "input", 12)(16, "mat-datepicker-toggle", 13)(17, "mat-datepicker", null, 1);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "mat-form-field", 11)(20, "mat-label");
            i0.ɵɵtext(21, "Due Date");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(22, "input", 14)(23, "mat-datepicker-toggle", 13)(24, "mat-datepicker", null, 2);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(26, "h3");
            i0.ɵɵtext(27, "Invoice Items");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "div", 15);
            i0.ɵɵtemplate(29, InvoiceFormComponent_div_29_Template, 21, 4, "div", 16);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "button", 17);
            i0.ɵɵlistener("click", function InvoiceFormComponent_Template_button_click_30_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.addItem()); });
            i0.ɵɵelementStart(31, "mat-icon");
            i0.ɵɵtext(32, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(33, " Add Item");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "div", 18)(35, "div", 19)(36, "span");
            i0.ɵɵtext(37, "Subtotal:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(38, "span");
            i0.ɵɵtext(39);
            i0.ɵɵpipe(40, "currency");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(41, "div", 19)(42, "mat-form-field", 11)(43, "mat-label");
            i0.ɵɵtext(44, "Discount");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(45, "input", 20);
            i0.ɵɵlistener("input", function InvoiceFormComponent_Template_input_input_45_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.calculateTotals()); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(46, "div", 19)(47, "mat-form-field", 11)(48, "mat-label");
            i0.ɵɵtext(49, "Tax %");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(50, "input", 21);
            i0.ɵɵlistener("input", function InvoiceFormComponent_Template_input_input_50_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.calculateTotals()); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(51, "span");
            i0.ɵɵtext(52);
            i0.ɵɵpipe(53, "currency");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(54, "div", 22)(55, "span");
            i0.ɵɵtext(56, "Total:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(57, "span");
            i0.ɵɵtext(58);
            i0.ɵɵpipe(59, "currency");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(60, "mat-form-field", 23)(61, "mat-label");
            i0.ɵɵtext(62, "Notes");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(63, "textarea", 24);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(64, "div", 25)(65, "button", 26);
            i0.ɵɵtext(66, "Cancel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(67, "button", 17);
            i0.ɵɵlistener("click", function InvoiceFormComponent_Template_button_click_67_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.saveAsDraft()); });
            i0.ɵɵtext(68, "Save as Draft");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(69, "button", 27);
            i0.ɵɵtext(70);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            const patientAuto_r6 = i0.ɵɵreference(10);
            const picker_r7 = i0.ɵɵreference(18);
            const duePicker_r8 = i0.ɵɵreference(25);
            i0.ɵɵadvance();
            i0.ɵɵproperty("title", ctx.isEdit ? "Edit Invoice" : "New Invoice")("breadcrumbs", i0.ɵɵpureFunction3(26, _c3, i0.ɵɵpureFunction0(22, _c0), i0.ɵɵpureFunction0(23, _c1), i0.ɵɵpureFunction1(24, _c2, ctx.isEdit ? "Edit" : "New")));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("formGroup", ctx.form);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("matAutocomplete", patientAuto_r6);
            i0.ɵɵadvance();
            i0.ɵɵproperty("displayWith", ctx.displayPatient);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngForOf", ctx.filteredPatients);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("matDatepicker", picker_r7);
            i0.ɵɵadvance();
            i0.ɵɵproperty("for", picker_r7);
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("matDatepicker", duePicker_r8);
            i0.ɵɵadvance();
            i0.ɵɵproperty("for", duePicker_r8);
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("ngForOf", ctx.itemsArray.controls);
            i0.ɵɵadvance(10);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(40, 16, ctx.subtotal));
            i0.ɵɵadvance(13);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(53, 18, ctx.taxAmount));
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(59, 20, ctx.grandTotal));
            i0.ɵɵadvance(11);
            i0.ɵɵproperty("disabled", ctx.form.invalid || ctx.saving);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate(ctx.saving ? "Saving..." : "Create Invoice");
        } }, dependencies: [i5.NgForOf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i1.FormGroupName, i1.FormArrayName, i3.RouterLink, i6.MatButton, i6.MatIconButton, i7.MatIcon, i8.MatInput, i8.MatFormField, i8.MatLabel, i8.MatSuffix, i9.MatOption, i10.MatDatepicker, i10.MatDatepickerInput, i10.MatDatepickerToggle, i11.MatAutocomplete, i11.MatAutocompleteTrigger, i12.PageHeaderComponent, i13.MainLayoutComponent, i5.CurrencyPipe], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } h3[_ngcontent-%COMP%] { margin: 1.5rem 0 1rem; }\n    .form-row[_ngcontent-%COMP%], .item-row[_ngcontent-%COMP%] { display: flex; gap: 1rem; align-items: center; } .form-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%], .item-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] { flex: 1; } .flex-2[_ngcontent-%COMP%] { flex: 2 !important; }\n    .full-width[_ngcontent-%COMP%] { width: 100%; }\n    .totals[_ngcontent-%COMP%] { max-width: 400px; margin-left: auto; margin-top: 1.5rem; padding: 1rem; background: #f5f5f5; border-radius: 8px; }\n    .total-row[_ngcontent-%COMP%] { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; }\n    .total-row.grand[_ngcontent-%COMP%] { border-top: 2px solid #333; font-size: 1.25rem; font-weight: 700; }\n    .form-actions[_ngcontent-%COMP%] { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(InvoiceFormComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-invoice-form', template: `
    <app-main-layout>
      <app-page-header [title]="isEdit ? 'Edit Invoice' : 'New Invoice'" [breadcrumbs]="[{ label: 'Billing', route: '/billing' }, { label: 'Invoices', route: '/billing/invoices' }, { label: isEdit ? 'Edit' : 'New' }]"></app-page-header>
      <div class="card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="flex-2"><mat-label>Patient</mat-label>
              <input matInput [matAutocomplete]="patientAuto" formControlName="patientSearch">
              <mat-autocomplete #patientAuto="matAutocomplete" [displayWith]="displayPatient" (optionSelected)="onPatientSelected($event)">
                <mat-option *ngFor="let p of filteredPatients" [value]="p">{{ p.fullName }} ({{ p.mrn }})</mat-option>
              </mat-autocomplete>
            </mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Invoice Date</mat-label><input matInput [matDatepicker]="picker" formControlName="invoiceDate"><mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle><mat-datepicker #picker></mat-datepicker></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Due Date</mat-label><input matInput [matDatepicker]="duePicker" formControlName="dueDate"><mat-datepicker-toggle matIconSuffix [for]="duePicker"></mat-datepicker-toggle><mat-datepicker #duePicker></mat-datepicker></mat-form-field>
          </div>

          <h3>Invoice Items</h3>
          <div formArrayName="items">
            <div *ngFor="let item of itemsArray.controls; let i = index" [formGroupName]="i" class="item-row">
              <mat-form-field appearance="outline" class="flex-2"><mat-label>Description</mat-label><input matInput formControlName="description"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Qty</mat-label><input matInput type="number" formControlName="quantity" (input)="calculateTotals()"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Rate</mat-label><input matInput type="number" formControlName="unitPrice" (input)="calculateTotals()"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Amount</mat-label><input matInput [value]="getItemTotal(i) | currency" readonly></mat-form-field>
              <button mat-icon-button color="warn" type="button" (click)="removeItem(i)"><mat-icon>delete</mat-icon></button>
            </div>
          </div>
          <button mat-stroked-button type="button" (click)="addItem()"><mat-icon>add</mat-icon> Add Item</button>

          <div class="totals">
            <div class="total-row"><span>Subtotal:</span><span>{{ subtotal | currency }}</span></div>
            <div class="total-row"><mat-form-field appearance="outline"><mat-label>Discount</mat-label><input matInput type="number" formControlName="discountAmount" (input)="calculateTotals()"></mat-form-field></div>
            <div class="total-row"><mat-form-field appearance="outline"><mat-label>Tax %</mat-label><input matInput type="number" formControlName="taxPercentage" (input)="calculateTotals()"></mat-form-field><span>{{ taxAmount | currency }}</span></div>
            <div class="total-row grand"><span>Total:</span><span>{{ grandTotal | currency }}</span></div>
          </div>

          <mat-form-field appearance="outline" class="full-width"><mat-label>Notes</mat-label><textarea matInput formControlName="notes" rows="2"></textarea></mat-form-field>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/billing/invoices">Cancel</button>
            <button mat-stroked-button type="button" (click)="saveAsDraft()">Save as Draft</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : 'Create Invoice' }}</button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `, styles: [".card { background: white; padding: 1.5rem; border-radius: 8px; } h3 { margin: 1.5rem 0 1rem; }\n    .form-row, .item-row { display: flex; gap: 1rem; align-items: center; } .form-row mat-form-field, .item-row mat-form-field { flex: 1; } .flex-2 { flex: 2 !important; }\n    .full-width { width: 100%; }\n    .totals { max-width: 400px; margin-left: auto; margin-top: 1.5rem; padding: 1rem; background: #f5f5f5; border-radius: 8px; }\n    .total-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; }\n    .total-row.grand { border-top: 2px solid #333; font-size: 1.25rem; font-weight: 700; }\n    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; }"] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ApiService }, { type: i3.ActivatedRoute }, { type: i3.Router }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(InvoiceFormComponent, { className: "InvoiceFormComponent", filePath: "app/features/billing/invoice-form/invoice-form.component.ts", lineNumber: 64 }); })();
//# sourceMappingURL=invoice-form.component.js.map