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
import * as i9 from "@angular/material/checkbox";
import * as i10 from "@angular/material/progress-spinner";
function RegisterComponent_mat_error_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Required");
    i0.ɵɵelementEnd();
} }
function RegisterComponent_mat_error_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Required");
    i0.ɵɵelementEnd();
} }
function RegisterComponent_mat_error_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Email is required");
    i0.ɵɵelementEnd();
} }
function RegisterComponent_mat_error_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Invalid email format");
    i0.ɵɵelementEnd();
} }
function RegisterComponent_mat_error_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Organization name is required");
    i0.ɵɵelementEnd();
} }
function RegisterComponent_mat_error_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Password is required");
    i0.ɵɵelementEnd();
} }
function RegisterComponent_mat_error_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Minimum 8 characters");
    i0.ɵɵelementEnd();
} }
function RegisterComponent_mat_error_54_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Please confirm password");
    i0.ɵɵelementEnd();
} }
function RegisterComponent_mat_error_55_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Passwords don't match");
    i0.ɵɵelementEnd();
} }
function RegisterComponent_mat_spinner_64_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "mat-spinner", 22);
} }
function RegisterComponent_span_65_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1, "Create Account");
    i0.ɵɵelementEnd();
} }
export class RegisterComponent {
    constructor(fb, authService, router, notification) {
        this.fb = fb;
        this.authService = authService;
        this.router = router;
        this.notification = notification;
        this.hidePassword = true;
        this.hideConfirmPassword = true;
        this.isLoading = false;
    }
    ngOnInit() {
        this.registerForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            organizationName: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required],
            agreeToTerms: [false, Validators.requiredTrue]
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
        if (this.registerForm.invalid)
            return;
        this.isLoading = true;
        this.authService.register(this.registerForm.value).subscribe({
            next: () => {
                this.notification.success('Account created successfully! Please sign in.');
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
    static { this.ɵfac = function RegisterComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RegisterComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.AuthService), i0.ɵɵdirectiveInject(i3.Router), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: RegisterComponent, selectors: [["app-register"]], standalone: false, decls: 70, vars: 17, consts: [[1, "register-card"], [1, "subtitle"], [3, "ngSubmit", "formGroup"], [1, "form-row"], ["appearance", "outline"], ["matInput", "", "formControlName", "firstName"], [4, "ngIf"], ["matInput", "", "formControlName", "lastName"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "type", "email", "formControlName", "email"], ["matPrefix", ""], ["matInput", "", "formControlName", "organizationName"], ["matInput", "", "formControlName", "password", 3, "type"], ["mat-icon-button", "", "matSuffix", "", "type", "button", 3, "click"], ["matInput", "", "formControlName", "confirmPassword", 3, "type"], ["formControlName", "agreeToTerms", 1, "terms-checkbox"], ["href", "/terms", "target", "_blank"], ["href", "/privacy", "target", "_blank"], ["mat-raised-button", "", "color", "primary", "type", "submit", 1, "full-width", "submit-btn", 3, "disabled"], ["diameter", "20", 4, "ngIf"], [1, "login-link"], ["routerLink", "/auth/login"], ["diameter", "20"]], template: function RegisterComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "h2");
            i0.ɵɵtext(2, "Create Account");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "p", 1);
            i0.ɵɵtext(4, "Sign up to get started");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "form", 2);
            i0.ɵɵlistener("ngSubmit", function RegisterComponent_Template_form_ngSubmit_5_listener() { return ctx.onSubmit(); });
            i0.ɵɵelementStart(6, "div", 3)(7, "mat-form-field", 4)(8, "mat-label");
            i0.ɵɵtext(9, "First Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(10, "input", 5);
            i0.ɵɵtemplate(11, RegisterComponent_mat_error_11_Template, 2, 0, "mat-error", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "mat-form-field", 4)(13, "mat-label");
            i0.ɵɵtext(14, "Last Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(15, "input", 7);
            i0.ɵɵtemplate(16, RegisterComponent_mat_error_16_Template, 2, 0, "mat-error", 6);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(17, "mat-form-field", 8)(18, "mat-label");
            i0.ɵɵtext(19, "Email");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(20, "input", 9);
            i0.ɵɵelementStart(21, "mat-icon", 10);
            i0.ɵɵtext(22, "email");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(23, RegisterComponent_mat_error_23_Template, 2, 0, "mat-error", 6)(24, RegisterComponent_mat_error_24_Template, 2, 0, "mat-error", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "mat-form-field", 8)(26, "mat-label");
            i0.ɵɵtext(27, "Organization Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(28, "input", 11);
            i0.ɵɵelementStart(29, "mat-icon", 10);
            i0.ɵɵtext(30, "business");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "mat-hint");
            i0.ɵɵtext(32, "Enter your organization/hospital name");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(33, RegisterComponent_mat_error_33_Template, 2, 0, "mat-error", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "mat-form-field", 8)(35, "mat-label");
            i0.ɵɵtext(36, "Password");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(37, "input", 12);
            i0.ɵɵelementStart(38, "mat-icon", 10);
            i0.ɵɵtext(39, "lock");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(40, "button", 13);
            i0.ɵɵlistener("click", function RegisterComponent_Template_button_click_40_listener() { return ctx.hidePassword = !ctx.hidePassword; });
            i0.ɵɵelementStart(41, "mat-icon");
            i0.ɵɵtext(42);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(43, RegisterComponent_mat_error_43_Template, 2, 0, "mat-error", 6)(44, RegisterComponent_mat_error_44_Template, 2, 0, "mat-error", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(45, "mat-form-field", 8)(46, "mat-label");
            i0.ɵɵtext(47, "Confirm Password");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(48, "input", 14);
            i0.ɵɵelementStart(49, "mat-icon", 10);
            i0.ɵɵtext(50, "lock");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(51, "button", 13);
            i0.ɵɵlistener("click", function RegisterComponent_Template_button_click_51_listener() { return ctx.hideConfirmPassword = !ctx.hideConfirmPassword; });
            i0.ɵɵelementStart(52, "mat-icon");
            i0.ɵɵtext(53);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(54, RegisterComponent_mat_error_54_Template, 2, 0, "mat-error", 6)(55, RegisterComponent_mat_error_55_Template, 2, 0, "mat-error", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(56, "mat-checkbox", 15);
            i0.ɵɵtext(57, " I agree to the ");
            i0.ɵɵelementStart(58, "a", 16);
            i0.ɵɵtext(59, "Terms of Service");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(60, " and ");
            i0.ɵɵelementStart(61, "a", 17);
            i0.ɵɵtext(62, "Privacy Policy");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(63, "button", 18);
            i0.ɵɵtemplate(64, RegisterComponent_mat_spinner_64_Template, 1, 0, "mat-spinner", 19)(65, RegisterComponent_span_65_Template, 2, 0, "span", 6);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(66, "div", 20);
            i0.ɵɵtext(67, " Already have an account? ");
            i0.ɵɵelementStart(68, "a", 21);
            i0.ɵɵtext(69, "Sign in");
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            let tmp_1_0;
            let tmp_2_0;
            let tmp_3_0;
            let tmp_4_0;
            let tmp_5_0;
            let tmp_8_0;
            let tmp_9_0;
            let tmp_12_0;
            let tmp_13_0;
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("formGroup", ctx.registerForm);
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("ngIf", (tmp_1_0 = ctx.registerForm.get("firstName")) == null ? null : tmp_1_0.hasError("required"));
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngIf", (tmp_2_0 = ctx.registerForm.get("lastName")) == null ? null : tmp_2_0.hasError("required"));
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("ngIf", (tmp_3_0 = ctx.registerForm.get("email")) == null ? null : tmp_3_0.hasError("required"));
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", (tmp_4_0 = ctx.registerForm.get("email")) == null ? null : tmp_4_0.hasError("email"));
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("ngIf", (tmp_5_0 = ctx.registerForm.get("organizationName")) == null ? null : tmp_5_0.hasError("required"));
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("type", ctx.hidePassword ? "password" : "text");
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.hidePassword ? "visibility_off" : "visibility");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", (tmp_8_0 = ctx.registerForm.get("password")) == null ? null : tmp_8_0.hasError("required"));
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", (tmp_9_0 = ctx.registerForm.get("password")) == null ? null : tmp_9_0.hasError("minlength"));
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("type", ctx.hideConfirmPassword ? "password" : "text");
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.hideConfirmPassword ? "visibility_off" : "visibility");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", (tmp_12_0 = ctx.registerForm.get("confirmPassword")) == null ? null : tmp_12_0.hasError("required"));
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", (tmp_13_0 = ctx.registerForm.get("confirmPassword")) == null ? null : tmp_13_0.hasError("passwordMismatch"));
            i0.ɵɵadvance(8);
            i0.ɵɵproperty("disabled", ctx.registerForm.invalid || ctx.isLoading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.isLoading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.isLoading);
        } }, dependencies: [i5.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i3.RouterLink, i6.MatButton, i6.MatIconButton, i7.MatIcon, i8.MatInput, i8.MatFormField, i8.MatLabel, i8.MatHint, i8.MatError, i8.MatPrefix, i8.MatSuffix, i9.MatCheckbox, i10.MatProgressSpinner], styles: [".register-card[_ngcontent-%COMP%] {\n      background: white;\n      padding: 2.5rem;\n      border-radius: 12px;\n      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n      width: 100%;\n      max-width: 450px;\n    }\n\n    h2[_ngcontent-%COMP%] {\n      margin: 0 0 0.5rem;\n      font-size: 1.75rem;\n      font-weight: 600;\n      text-align: center;\n    }\n\n    .subtitle[_ngcontent-%COMP%] {\n      color: #666;\n      text-align: center;\n      margin-bottom: 2rem;\n    }\n\n    .form-row[_ngcontent-%COMP%] {\n      display: flex;\n      gap: 1rem;\n    }\n\n    .form-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] {\n      flex: 1;\n    }\n\n    .full-width[_ngcontent-%COMP%] {\n      width: 100%;\n    }\n\n    .terms-checkbox[_ngcontent-%COMP%] {\n      margin-bottom: 1.5rem;\n    }\n\n    .terms-checkbox[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n      color: #3f51b5;\n    }\n\n    .submit-btn[_ngcontent-%COMP%] {\n      height: 48px;\n      font-size: 1rem;\n    }\n\n    .login-link[_ngcontent-%COMP%] {\n      text-align: center;\n      margin-top: 1.5rem;\n      color: #666;\n    }\n\n    .login-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n      color: #3f51b5;\n      text-decoration: none;\n      font-weight: 500;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RegisterComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-register', template: `
    <div class="register-card">
      <h2>Create Account</h2>
      <p class="subtitle">Sign up to get started</p>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName">
            <mat-error *ngIf="registerForm.get('firstName')?.hasError('required')">Required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName">
            <mat-error *ngIf="registerForm.get('lastName')?.hasError('required')">Required</mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email">
          <mat-icon matPrefix>email</mat-icon>
          <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Email is required</mat-error>
          <mat-error *ngIf="registerForm.get('email')?.hasError('email')">Invalid email format</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Organization Name</mat-label>
          <input matInput formControlName="organizationName">
          <mat-icon matPrefix>business</mat-icon>
          <mat-hint>Enter your organization/hospital name</mat-hint>
          <mat-error *ngIf="registerForm.get('organizationName')?.hasError('required')">Organization name is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
          <mat-icon matPrefix>lock</mat-icon>
          <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
            <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-error *ngIf="registerForm.get('password')?.hasError('required')">Password is required</mat-error>
          <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">Minimum 8 characters</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirm Password</mat-label>
          <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" formControlName="confirmPassword">
          <mat-icon matPrefix>lock</mat-icon>
          <button mat-icon-button matSuffix type="button" (click)="hideConfirmPassword = !hideConfirmPassword">
            <mat-icon>{{ hideConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">Please confirm password</mat-error>
          <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('passwordMismatch')">Passwords don't match</mat-error>
        </mat-form-field>

        <mat-checkbox formControlName="agreeToTerms" class="terms-checkbox">
          I agree to the <a href="/terms" target="_blank">Terms of Service</a>
          and <a href="/privacy" target="_blank">Privacy Policy</a>
        </mat-checkbox>

        <button mat-raised-button color="primary" type="submit" class="full-width submit-btn"
                [disabled]="registerForm.invalid || isLoading">
          <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
          <span *ngIf="!isLoading">Create Account</span>
        </button>
      </form>

      <div class="login-link">
        Already have an account? <a routerLink="/auth/login">Sign in</a>
      </div>
    </div>
  `, styles: ["\n    .register-card {\n      background: white;\n      padding: 2.5rem;\n      border-radius: 12px;\n      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n      width: 100%;\n      max-width: 450px;\n    }\n\n    h2 {\n      margin: 0 0 0.5rem;\n      font-size: 1.75rem;\n      font-weight: 600;\n      text-align: center;\n    }\n\n    .subtitle {\n      color: #666;\n      text-align: center;\n      margin-bottom: 2rem;\n    }\n\n    .form-row {\n      display: flex;\n      gap: 1rem;\n    }\n\n    .form-row mat-form-field {\n      flex: 1;\n    }\n\n    .full-width {\n      width: 100%;\n    }\n\n    .terms-checkbox {\n      margin-bottom: 1.5rem;\n    }\n\n    .terms-checkbox a {\n      color: #3f51b5;\n    }\n\n    .submit-btn {\n      height: 48px;\n      font-size: 1rem;\n    }\n\n    .login-link {\n      text-align: center;\n      margin-top: 1.5rem;\n      color: #666;\n    }\n\n    .login-link a {\n      color: #3f51b5;\n      text-decoration: none;\n      font-weight: 500;\n    }\n  "] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.AuthService }, { type: i3.Router }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(RegisterComponent, { className: "RegisterComponent", filePath: "app/features/auth/register/register.component.ts", lineNumber: 147 }); })();
//# sourceMappingURL=register.component.js.map