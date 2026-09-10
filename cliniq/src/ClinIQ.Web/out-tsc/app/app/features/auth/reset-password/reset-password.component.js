import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../../core/services/auth.service";
import * as i3 from "@angular/router";
import * as i4 from "../../../core/services/notification.service";
import * as i5 from "@angular/common";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/material/input";
import * as i9 from "@angular/material/progress-spinner";
function ResetPasswordComponent_mat_error_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Password is required");
    i0.ɵɵelementEnd();
} }
function ResetPasswordComponent_mat_error_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Minimum 8 characters");
    i0.ɵɵelementEnd();
} }
function ResetPasswordComponent_mat_error_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Please confirm password");
    i0.ɵɵelementEnd();
} }
function ResetPasswordComponent_mat_error_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Passwords don't match");
    i0.ɵɵelementEnd();
} }
function ResetPasswordComponent_mat_spinner_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "mat-spinner", 13);
} }
function ResetPasswordComponent_span_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1, "Reset Password");
    i0.ɵɵelementEnd();
} }
export class ResetPasswordComponent {
    constructor(fb, authService, router, route, notification) {
        this.fb = fb;
        this.authService = authService;
        this.router = router;
        this.route = route;
        this.notification = notification;
        this.hidePassword = true;
        this.hideConfirmPassword = true;
        this.isLoading = false;
        this.token = '';
        this.email = '';
    }
    ngOnInit() {
        this.token = this.route.snapshot.queryParams['token'] || '';
        this.email = this.route.snapshot.queryParams['email'] || '';
        if (!this.token || !this.email) {
            this.notification.error('Invalid reset link');
            this.router.navigate(['/auth/forgot-password']);
            return;
        }
        this.resetForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required]
        }, {
            validators: this.passwordMatchValidator
        });
    }
    passwordMatchValidator(control) {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        if (password && confirmPassword && password.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        return null;
    }
    onSubmit() {
        if (this.resetForm.invalid)
            return;
        this.isLoading = true;
        const { password, confirmPassword } = this.resetForm.value;
        this.authService.resetPassword(this.token, this.email, password, confirmPassword).subscribe({
            next: () => {
                this.notification.success('Password reset successfully! Please sign in.');
                this.router.navigate(['/auth/login']);
            },
            error: () => {
                this.isLoading = false;
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }
    static { this.ɵfac = function ResetPasswordComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ResetPasswordComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.AuthService), i0.ɵɵdirectiveInject(i3.Router), i0.ɵɵdirectiveInject(i3.ActivatedRoute), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ResetPasswordComponent, selectors: [["app-reset-password"]], standalone: false, decls: 36, vars: 12, consts: [[1, "reset-card"], [1, "subtitle"], [3, "ngSubmit", "formGroup"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "formControlName", "password", 3, "type"], ["matPrefix", ""], ["mat-icon-button", "", "matSuffix", "", "type", "button", 3, "click"], [4, "ngIf"], ["matInput", "", "formControlName", "confirmPassword", 3, "type"], ["mat-raised-button", "", "color", "primary", "type", "submit", 1, "full-width", "submit-btn", 3, "disabled"], ["diameter", "20", 4, "ngIf"], [1, "back-link"], ["routerLink", "/auth/login"], ["diameter", "20"]], template: function ResetPasswordComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "h2");
            i0.ɵɵtext(2, "Reset Password");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "p", 1);
            i0.ɵɵtext(4, "Enter your new password");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "form", 2);
            i0.ɵɵlistener("ngSubmit", function ResetPasswordComponent_Template_form_ngSubmit_5_listener() { return ctx.onSubmit(); });
            i0.ɵɵelementStart(6, "mat-form-field", 3)(7, "mat-label");
            i0.ɵɵtext(8, "New Password");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(9, "input", 4);
            i0.ɵɵelementStart(10, "mat-icon", 5);
            i0.ɵɵtext(11, "lock");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "button", 6);
            i0.ɵɵlistener("click", function ResetPasswordComponent_Template_button_click_12_listener() { return ctx.hidePassword = !ctx.hidePassword; });
            i0.ɵɵelementStart(13, "mat-icon");
            i0.ɵɵtext(14);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(15, ResetPasswordComponent_mat_error_15_Template, 2, 0, "mat-error", 7)(16, ResetPasswordComponent_mat_error_16_Template, 2, 0, "mat-error", 7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "mat-form-field", 3)(18, "mat-label");
            i0.ɵɵtext(19, "Confirm Password");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(20, "input", 8);
            i0.ɵɵelementStart(21, "mat-icon", 5);
            i0.ɵɵtext(22, "lock");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "button", 6);
            i0.ɵɵlistener("click", function ResetPasswordComponent_Template_button_click_23_listener() { return ctx.hideConfirmPassword = !ctx.hideConfirmPassword; });
            i0.ɵɵelementStart(24, "mat-icon");
            i0.ɵɵtext(25);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(26, ResetPasswordComponent_mat_error_26_Template, 2, 0, "mat-error", 7)(27, ResetPasswordComponent_mat_error_27_Template, 2, 0, "mat-error", 7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "button", 9);
            i0.ɵɵtemplate(29, ResetPasswordComponent_mat_spinner_29_Template, 1, 0, "mat-spinner", 10)(30, ResetPasswordComponent_span_30_Template, 2, 0, "span", 7);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(31, "div", 11)(32, "a", 12)(33, "mat-icon");
            i0.ɵɵtext(34, "arrow_back");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(35, " Back to sign in ");
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            let tmp_3_0;
            let tmp_4_0;
            let tmp_7_0;
            let tmp_8_0;
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("formGroup", ctx.resetForm);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("type", ctx.hidePassword ? "password" : "text");
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.hidePassword ? "visibility_off" : "visibility");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", (tmp_3_0 = ctx.resetForm.get("password")) == null ? null : tmp_3_0.hasError("required"));
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", (tmp_4_0 = ctx.resetForm.get("password")) == null ? null : tmp_4_0.hasError("minlength"));
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("type", ctx.hideConfirmPassword ? "password" : "text");
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.hideConfirmPassword ? "visibility_off" : "visibility");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", (tmp_7_0 = ctx.resetForm.get("confirmPassword")) == null ? null : tmp_7_0.hasError("required"));
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", (tmp_8_0 = ctx.resetForm.get("confirmPassword")) == null ? null : tmp_8_0.hasError("passwordMismatch"));
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.resetForm.invalid || ctx.isLoading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.isLoading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.isLoading);
        } }, dependencies: [i5.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i3.RouterLink, i6.MatButton, i6.MatIconButton, i7.MatIcon, i8.MatInput, i8.MatFormField, i8.MatLabel, i8.MatError, i8.MatPrefix, i8.MatSuffix, i9.MatProgressSpinner], styles: [".reset-card[_ngcontent-%COMP%] {\n      background: white;\n      padding: 2.5rem;\n      border-radius: 12px;\n      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n      width: 100%;\n      max-width: 400px;\n    }\n\n    h2[_ngcontent-%COMP%] {\n      margin: 0 0 0.5rem;\n      font-size: 1.75rem;\n      font-weight: 600;\n      text-align: center;\n    }\n\n    .subtitle[_ngcontent-%COMP%] {\n      color: #666;\n      text-align: center;\n      margin-bottom: 2rem;\n    }\n\n    .full-width[_ngcontent-%COMP%] {\n      width: 100%;\n    }\n\n    .submit-btn[_ngcontent-%COMP%] {\n      height: 48px;\n      font-size: 1rem;\n    }\n\n    .back-link[_ngcontent-%COMP%] {\n      text-align: center;\n      margin-top: 1.5rem;\n    }\n\n    .back-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n      display: inline-flex;\n      align-items: center;\n      gap: 0.5rem;\n      color: #3f51b5;\n      text-decoration: none;\n    }\n\n    .back-link[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      font-size: 18px;\n      width: 18px;\n      height: 18px;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ResetPasswordComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-reset-password', template: `
    <div class="reset-card">
      <h2>Reset Password</h2>
      <p class="subtitle">Enter your new password</p>

      <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>New Password</mat-label>
          <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
          <mat-icon matPrefix>lock</mat-icon>
          <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
            <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-error *ngIf="resetForm.get('password')?.hasError('required')">Password is required</mat-error>
          <mat-error *ngIf="resetForm.get('password')?.hasError('minlength')">Minimum 8 characters</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirm Password</mat-label>
          <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" formControlName="confirmPassword">
          <mat-icon matPrefix>lock</mat-icon>
          <button mat-icon-button matSuffix type="button" (click)="hideConfirmPassword = !hideConfirmPassword">
            <mat-icon>{{ hideConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-error *ngIf="resetForm.get('confirmPassword')?.hasError('required')">Please confirm password</mat-error>
          <mat-error *ngIf="resetForm.get('confirmPassword')?.hasError('passwordMismatch')">Passwords don't match</mat-error>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" class="full-width submit-btn"
                [disabled]="resetForm.invalid || isLoading">
          <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
          <span *ngIf="!isLoading">Reset Password</span>
        </button>
      </form>

      <div class="back-link">
        <a routerLink="/auth/login">
          <mat-icon>arrow_back</mat-icon>
          Back to sign in
        </a>
      </div>
    </div>
  `, styles: ["\n    .reset-card {\n      background: white;\n      padding: 2.5rem;\n      border-radius: 12px;\n      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n      width: 100%;\n      max-width: 400px;\n    }\n\n    h2 {\n      margin: 0 0 0.5rem;\n      font-size: 1.75rem;\n      font-weight: 600;\n      text-align: center;\n    }\n\n    .subtitle {\n      color: #666;\n      text-align: center;\n      margin-bottom: 2rem;\n    }\n\n    .full-width {\n      width: 100%;\n    }\n\n    .submit-btn {\n      height: 48px;\n      font-size: 1rem;\n    }\n\n    .back-link {\n      text-align: center;\n      margin-top: 1.5rem;\n    }\n\n    .back-link a {\n      display: inline-flex;\n      align-items: center;\n      gap: 0.5rem;\n      color: #3f51b5;\n      text-decoration: none;\n    }\n\n    .back-link mat-icon {\n      font-size: 18px;\n      width: 18px;\n      height: 18px;\n    }\n  "] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.AuthService }, { type: i3.Router }, { type: i3.ActivatedRoute }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ResetPasswordComponent, { className: "ResetPasswordComponent", filePath: "app/features/auth/reset-password/reset-password.component.ts", lineNumber: 105 }); })();
//# sourceMappingURL=reset-password.component.js.map