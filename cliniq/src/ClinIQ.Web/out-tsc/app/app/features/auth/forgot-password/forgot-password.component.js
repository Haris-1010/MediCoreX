import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../../core/services/auth.service";
import * as i3 from "../../../core/services/notification.service";
import * as i4 from "@angular/common";
import * as i5 from "@angular/router";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/material/input";
import * as i9 from "@angular/material/progress-spinner";
function ForgotPasswordComponent_form_5_mat_error_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Email is required");
    i0.ɵɵelementEnd();
} }
function ForgotPasswordComponent_form_5_mat_error_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Invalid email format");
    i0.ɵɵelementEnd();
} }
function ForgotPasswordComponent_form_5_mat_spinner_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "mat-spinner", 13);
} }
function ForgotPasswordComponent_form_5_span_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1, "Send Reset Link");
    i0.ɵɵelementEnd();
} }
function ForgotPasswordComponent_form_5_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "form", 6);
    i0.ɵɵlistener("ngSubmit", function ForgotPasswordComponent_form_5_Template_form_ngSubmit_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onSubmit()); });
    i0.ɵɵelementStart(1, "mat-form-field", 7)(2, "mat-label");
    i0.ɵɵtext(3, "Email");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(4, "input", 8);
    i0.ɵɵelementStart(5, "mat-icon", 9);
    i0.ɵɵtext(6, "email");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, ForgotPasswordComponent_form_5_mat_error_7_Template, 2, 0, "mat-error", 10)(8, ForgotPasswordComponent_form_5_mat_error_8_Template, 2, 0, "mat-error", 10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "button", 11);
    i0.ɵɵtemplate(10, ForgotPasswordComponent_form_5_mat_spinner_10_Template, 1, 0, "mat-spinner", 12)(11, ForgotPasswordComponent_form_5_span_11_Template, 2, 0, "span", 10);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("formGroup", ctx_r1.forgotForm);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("ngIf", (tmp_2_0 = ctx_r1.forgotForm.get("email")) == null ? null : tmp_2_0.hasError("required"));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", (tmp_3_0 = ctx_r1.forgotForm.get("email")) == null ? null : tmp_3_0.hasError("email"));
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.forgotForm.invalid || ctx_r1.isLoading);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.isLoading);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.isLoading);
} }
function ForgotPasswordComponent_div_6_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 14)(1, "mat-icon");
    i0.ɵɵtext(2, "check_circle");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h3");
    i0.ɵɵtext(4, "Check your email");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6, "We've sent a password reset link to ");
    i0.ɵɵelementStart(7, "strong");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "button", 15);
    i0.ɵɵlistener("click", function ForgotPasswordComponent_div_6_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.emailSent = false); });
    i0.ɵɵtext(10, " Try another email ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r1.email);
} }
export class ForgotPasswordComponent {
    constructor(fb, authService, notification) {
        this.fb = fb;
        this.authService = authService;
        this.notification = notification;
        this.isLoading = false;
        this.emailSent = false;
        this.email = '';
    }
    ngOnInit() {
        this.forgotForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }
    onSubmit() {
        if (this.forgotForm.invalid)
            return;
        this.isLoading = true;
        this.email = this.forgotForm.value.email;
        this.authService.forgotPassword(this.email).subscribe({
            next: () => {
                this.emailSent = true;
            },
            error: () => {
                this.isLoading = false;
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }
    static { this.ɵfac = function ForgotPasswordComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ForgotPasswordComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.AuthService), i0.ɵɵdirectiveInject(i3.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ForgotPasswordComponent, selectors: [["app-forgot-password"]], standalone: false, decls: 12, vars: 2, consts: [[1, "forgot-card"], [1, "subtitle"], [3, "formGroup", "ngSubmit", 4, "ngIf"], ["class", "success-message", 4, "ngIf"], [1, "back-link"], ["routerLink", "/auth/login"], [3, "ngSubmit", "formGroup"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "type", "email", "formControlName", "email", "placeholder", "Enter your email"], ["matPrefix", ""], [4, "ngIf"], ["mat-raised-button", "", "color", "primary", "type", "submit", 1, "full-width", "submit-btn", 3, "disabled"], ["diameter", "20", 4, "ngIf"], ["diameter", "20"], [1, "success-message"], ["mat-stroked-button", "", "color", "primary", 3, "click"]], template: function ForgotPasswordComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "h2");
            i0.ɵɵtext(2, "Forgot Password");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "p", 1);
            i0.ɵɵtext(4, "Enter your email to reset your password");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(5, ForgotPasswordComponent_form_5_Template, 12, 6, "form", 2)(6, ForgotPasswordComponent_div_6_Template, 11, 1, "div", 3);
            i0.ɵɵelementStart(7, "div", 4)(8, "a", 5)(9, "mat-icon");
            i0.ɵɵtext(10, "arrow_back");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(11, " Back to sign in ");
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngIf", !ctx.emailSent);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.emailSent);
        } }, dependencies: [i4.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i5.RouterLink, i6.MatButton, i7.MatIcon, i8.MatInput, i8.MatFormField, i8.MatLabel, i8.MatError, i8.MatPrefix, i9.MatProgressSpinner], styles: [".forgot-card[_ngcontent-%COMP%] {\n      background: white;\n      padding: 2.5rem;\n      border-radius: 12px;\n      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n      width: 100%;\n      max-width: 400px;\n    }\n\n    h2[_ngcontent-%COMP%] {\n      margin: 0 0 0.5rem;\n      font-size: 1.75rem;\n      font-weight: 600;\n      text-align: center;\n    }\n\n    .subtitle[_ngcontent-%COMP%] {\n      color: #666;\n      text-align: center;\n      margin-bottom: 2rem;\n    }\n\n    .full-width[_ngcontent-%COMP%] {\n      width: 100%;\n    }\n\n    .submit-btn[_ngcontent-%COMP%] {\n      height: 48px;\n      font-size: 1rem;\n    }\n\n    .success-message[_ngcontent-%COMP%] {\n      text-align: center;\n      padding: 1rem;\n    }\n\n    .success-message[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      font-size: 64px;\n      width: 64px;\n      height: 64px;\n      color: #4caf50;\n    }\n\n    .success-message[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n      margin: 1rem 0 0.5rem;\n    }\n\n    .success-message[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n      color: #666;\n      margin-bottom: 1.5rem;\n    }\n\n    .back-link[_ngcontent-%COMP%] {\n      text-align: center;\n      margin-top: 1.5rem;\n    }\n\n    .back-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n      display: inline-flex;\n      align-items: center;\n      gap: 0.5rem;\n      color: #3f51b5;\n      text-decoration: none;\n    }\n\n    .back-link[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      font-size: 18px;\n      width: 18px;\n      height: 18px;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ForgotPasswordComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-forgot-password', template: `
    <div class="forgot-card">
      <h2>Forgot Password</h2>
      <p class="subtitle">Enter your email to reset your password</p>

      <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" *ngIf="!emailSent">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="Enter your email">
          <mat-icon matPrefix>email</mat-icon>
          <mat-error *ngIf="forgotForm.get('email')?.hasError('required')">Email is required</mat-error>
          <mat-error *ngIf="forgotForm.get('email')?.hasError('email')">Invalid email format</mat-error>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" class="full-width submit-btn"
                [disabled]="forgotForm.invalid || isLoading">
          <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
          <span *ngIf="!isLoading">Send Reset Link</span>
        </button>
      </form>

      <div class="success-message" *ngIf="emailSent">
        <mat-icon>check_circle</mat-icon>
        <h3>Check your email</h3>
        <p>We've sent a password reset link to <strong>{{ email }}</strong></p>
        <button mat-stroked-button color="primary" (click)="emailSent = false">
          Try another email
        </button>
      </div>

      <div class="back-link">
        <a routerLink="/auth/login">
          <mat-icon>arrow_back</mat-icon>
          Back to sign in
        </a>
      </div>
    </div>
  `, styles: ["\n    .forgot-card {\n      background: white;\n      padding: 2.5rem;\n      border-radius: 12px;\n      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n      width: 100%;\n      max-width: 400px;\n    }\n\n    h2 {\n      margin: 0 0 0.5rem;\n      font-size: 1.75rem;\n      font-weight: 600;\n      text-align: center;\n    }\n\n    .subtitle {\n      color: #666;\n      text-align: center;\n      margin-bottom: 2rem;\n    }\n\n    .full-width {\n      width: 100%;\n    }\n\n    .submit-btn {\n      height: 48px;\n      font-size: 1rem;\n    }\n\n    .success-message {\n      text-align: center;\n      padding: 1rem;\n    }\n\n    .success-message mat-icon {\n      font-size: 64px;\n      width: 64px;\n      height: 64px;\n      color: #4caf50;\n    }\n\n    .success-message h3 {\n      margin: 1rem 0 0.5rem;\n    }\n\n    .success-message p {\n      color: #666;\n      margin-bottom: 1.5rem;\n    }\n\n    .back-link {\n      text-align: center;\n      margin-top: 1.5rem;\n    }\n\n    .back-link a {\n      display: inline-flex;\n      align-items: center;\n      gap: 0.5rem;\n      color: #3f51b5;\n      text-decoration: none;\n    }\n\n    .back-link mat-icon {\n      font-size: 18px;\n      width: 18px;\n      height: 18px;\n    }\n  "] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.AuthService }, { type: i3.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ForgotPasswordComponent, { className: "ForgotPasswordComponent", filePath: "app/features/auth/forgot-password/forgot-password.component.ts", lineNumber: 120 }); })();
//# sourceMappingURL=forgot-password.component.js.map