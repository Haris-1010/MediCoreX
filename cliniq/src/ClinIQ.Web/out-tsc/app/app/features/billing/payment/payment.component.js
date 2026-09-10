import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../../core/services/api.service";
import * as i3 from "@angular/router";
import * as i4 from "../../../core/services/notification.service";
import * as i5 from "@angular/common";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/input";
import * as i8 from "@angular/material/select";
import * as i9 from "@angular/material/list";
import * as i10 from "../../../shared/components/page-header/page-header.component";
import * as i11 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Billing", route: "/billing" });
const _c1 = () => ({ label: "Payment" });
const _c2 = (a0, a1) => [a0, a1];
function PaymentComponent_div_2_mat_form_field_64_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-form-field", 9)(1, "mat-label");
    i0.ɵɵtext(2, "Reference Number");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "input", 22);
    i0.ɵɵelementEnd();
} }
function PaymentComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 2)(1, "div", 3)(2, "h3");
    i0.ɵɵtext(3, "Invoice Summary");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 4)(5, "span");
    i0.ɵɵtext(6, "Invoice #:");
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
    i0.ɵɵtext(16, "Date:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "strong");
    i0.ɵɵtext(18);
    i0.ɵɵpipe(19, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(20, "mat-divider");
    i0.ɵɵelementStart(21, "div", 4)(22, "span");
    i0.ɵɵtext(23, "Total Amount:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "strong");
    i0.ɵɵtext(25);
    i0.ɵɵpipe(26, "currency");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(27, "div", 4)(28, "span");
    i0.ɵɵtext(29, "Paid:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "strong", 5);
    i0.ɵɵtext(31);
    i0.ɵɵpipe(32, "currency");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(33, "div", 4)(34, "span");
    i0.ɵɵtext(35, "Balance Due:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "strong", 6);
    i0.ɵɵtext(37);
    i0.ɵɵpipe(38, "currency");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(39, "div", 7)(40, "h3");
    i0.ɵɵtext(41, "Payment Details");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "form", 8);
    i0.ɵɵlistener("ngSubmit", function PaymentComponent_div_2_Template_form_ngSubmit_42_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.submit()); });
    i0.ɵɵelementStart(43, "mat-form-field", 9)(44, "mat-label");
    i0.ɵɵtext(45, "Amount");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(46, "input", 10);
    i0.ɵɵelementStart(47, "mat-hint");
    i0.ɵɵtext(48);
    i0.ɵɵpipe(49, "currency");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(50, "mat-form-field", 9)(51, "mat-label");
    i0.ɵɵtext(52, "Payment Method");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(53, "mat-select", 11)(54, "mat-option", 12);
    i0.ɵɵtext(55, "Cash");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(56, "mat-option", 13);
    i0.ɵɵtext(57, "Card");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(58, "mat-option", 14);
    i0.ɵɵtext(59, "Bank Transfer");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(60, "mat-option", 15);
    i0.ɵɵtext(61, "Check");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(62, "mat-option", 16);
    i0.ɵɵtext(63, "Insurance");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(64, PaymentComponent_div_2_mat_form_field_64_Template, 4, 0, "mat-form-field", 17);
    i0.ɵɵelementStart(65, "mat-form-field", 9)(66, "mat-label");
    i0.ɵɵtext(67, "Notes");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(68, "textarea", 18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(69, "div", 19)(70, "button", 20);
    i0.ɵɵtext(71, "Cancel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(72, "button", 21);
    i0.ɵɵtext(73);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r1.invoice.invoiceNumber);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.invoice.patientName);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(19, 11, ctx_r1.invoice.invoiceDate, "mediumDate"));
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(26, 14, ctx_r1.invoice.totalAmount));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(32, 16, ctx_r1.invoice.paidAmount));
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(38, 18, ctx_r1.invoice.balanceAmount));
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("formGroup", ctx_r1.form);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1("Balance: ", i0.ɵɵpipeBind1(49, 20, ctx_r1.invoice.balanceAmount), "");
    i0.ɵɵadvance(16);
    i0.ɵɵproperty("ngIf", ctx_r1.form.value.paymentMethod !== "Cash");
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("disabled", ctx_r1.form.invalid || ctx_r1.saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.saving ? "Processing..." : "Record Payment");
} }
export class PaymentComponent {
    constructor(fb, api, route, router, notification) {
        this.fb = fb;
        this.api = api;
        this.route = route;
        this.router = router;
        this.notification = notification;
        this.saving = false;
    }
    ngOnInit() {
        this.form = this.fb.group({ amount: ['', [Validators.required, Validators.min(0.01)]], paymentMethod: ['Cash', Validators.required], referenceNumber: [''], notes: [''] });
        const id = this.route.snapshot.paramMap.get('id');
        if (id)
            this.api.getById('v1/invoices', id).subscribe(inv => { this.invoice = inv; this.form.patchValue({ amount: inv.balanceAmount }); });
    }
    submit() {
        if (this.form.invalid)
            return;
        this.saving = true;
        this.api.post(`v1/invoices/${this.invoice.id}/payments`, this.form.value).subscribe({
            next: () => { this.notification.success('Payment recorded'); this.router.navigate(['/billing/invoices']); },
            error: () => this.saving = false
        });
    }
    static { this.ɵfac = function PaymentComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PaymentComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.ActivatedRoute), i0.ɵɵdirectiveInject(i3.Router), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PaymentComponent, selectors: [["app-payment"]], standalone: false, decls: 3, vars: 7, consts: [["title", "Receive Payment", 3, "breadcrumbs"], ["class", "payment-grid", 4, "ngIf"], [1, "payment-grid"], [1, "card", "invoice-summary"], [1, "info-row"], [1, "paid"], [1, "balance"], [1, "card", "payment-form"], [3, "ngSubmit", "formGroup"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "type", "number", "formControlName", "amount"], ["formControlName", "paymentMethod"], ["value", "Cash"], ["value", "Card"], ["value", "BankTransfer"], ["value", "Check"], ["value", "Insurance"], ["appearance", "outline", "class", "full-width", 4, "ngIf"], ["matInput", "", "formControlName", "notes", "rows", "2"], [1, "form-actions"], ["mat-stroked-button", "", "type", "button", "routerLink", "/billing/invoices"], ["mat-raised-button", "", "color", "primary", "type", "submit", 3, "disabled"], ["matInput", "", "formControlName", "referenceNumber"]], template: function PaymentComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵtemplate(2, PaymentComponent_div_2_Template, 74, 22, "div", 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(4, _c2, i0.ɵɵpureFunction0(2, _c0), i0.ɵɵpureFunction0(3, _c1)));
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.invoice);
        } }, dependencies: [i5.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i3.RouterLink, i6.MatButton, i7.MatInput, i7.MatFormField, i7.MatLabel, i7.MatHint, i8.MatSelect, i8.MatOption, i9.MatDivider, i10.PageHeaderComponent, i11.MainLayoutComponent, i5.CurrencyPipe, i5.DatePipe], styles: [".payment-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }\n    .card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 1rem; }\n    .info-row[_ngcontent-%COMP%] { display: flex; justify-content: space-between; padding: 0.5rem 0; } .info-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] { color: #666; }\n    .paid[_ngcontent-%COMP%] { color: #4caf50; } .balance[_ngcontent-%COMP%] { color: #f44336; }\n    .full-width[_ngcontent-%COMP%] { width: 100%; }\n    .form-actions[_ngcontent-%COMP%] { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PaymentComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-payment', template: `
    <app-main-layout>
      <app-page-header title="Receive Payment" [breadcrumbs]="[{ label: 'Billing', route: '/billing' }, { label: 'Payment' }]"></app-page-header>
      <div class="payment-grid" *ngIf="invoice">
        <div class="card invoice-summary">
          <h3>Invoice Summary</h3>
          <div class="info-row"><span>Invoice #:</span><strong>{{ invoice.invoiceNumber }}</strong></div>
          <div class="info-row"><span>Patient:</span><strong>{{ invoice.patientName }}</strong></div>
          <div class="info-row"><span>Date:</span><strong>{{ invoice.invoiceDate | date:'mediumDate' }}</strong></div>
          <mat-divider></mat-divider>
          <div class="info-row"><span>Total Amount:</span><strong>{{ invoice.totalAmount | currency }}</strong></div>
          <div class="info-row"><span>Paid:</span><strong class="paid">{{ invoice.paidAmount | currency }}</strong></div>
          <div class="info-row"><span>Balance Due:</span><strong class="balance">{{ invoice.balanceAmount | currency }}</strong></div>
        </div>
        <div class="card payment-form">
          <h3>Payment Details</h3>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" class="full-width"><mat-label>Amount</mat-label><input matInput type="number" formControlName="amount"><mat-hint>Balance: {{ invoice.balanceAmount | currency }}</mat-hint></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Payment Method</mat-label>
              <mat-select formControlName="paymentMethod">
                <mat-option value="Cash">Cash</mat-option><mat-option value="Card">Card</mat-option><mat-option value="BankTransfer">Bank Transfer</mat-option><mat-option value="Check">Check</mat-option><mat-option value="Insurance">Insurance</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width" *ngIf="form.value.paymentMethod !== 'Cash'"><mat-label>Reference Number</mat-label><input matInput formControlName="referenceNumber"></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Notes</mat-label><textarea matInput formControlName="notes" rows="2"></textarea></mat-form-field>
            <div class="form-actions">
              <button mat-stroked-button type="button" routerLink="/billing/invoices">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">{{ saving ? 'Processing...' : 'Record Payment' }}</button>
            </div>
          </form>
        </div>
      </div>
    </app-main-layout>
  `, styles: [".payment-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }\n    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }\n    .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; } .info-row span { color: #666; }\n    .paid { color: #4caf50; } .balance { color: #f44336; }\n    .full-width { width: 100%; }\n    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }"] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ApiService }, { type: i3.ActivatedRoute }, { type: i3.Router }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PaymentComponent, { className: "PaymentComponent", filePath: "app/features/billing/payment/payment.component.ts", lineNumber: 51 }); })();
//# sourceMappingURL=payment.component.js.map