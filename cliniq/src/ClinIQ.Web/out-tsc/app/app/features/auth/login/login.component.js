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
function LoginComponent_mat_error_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Email is required");
    i0.ɵɵelementEnd();
} }
function LoginComponent_mat_error_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Invalid email format");
    i0.ɵɵelementEnd();
} }
function LoginComponent_mat_error_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Password is required");
    i0.ɵɵelementEnd();
} }
function LoginComponent_mat_form_field_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-form-field", 3)(1, "mat-label");
    i0.ɵɵtext(2, "Tenant Code");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "input", 17);
    i0.ɵɵelementStart(4, "mat-icon", 5);
    i0.ɵɵtext(5, "business");
    i0.ɵɵelementEnd()();
} }
function LoginComponent_mat_spinner_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "mat-spinner", 18);
} }
function LoginComponent_span_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1, "Sign In");
    i0.ɵɵelementEnd();
} }
export class LoginComponent {
    constructor(fb, authService, router, route, notification) {
        this.fb = fb;
        this.authService = authService;
        this.router = router;
        this.route = route;
        this.notification = notification;
        this.hidePassword = true;
        this.isLoading = false;
        this.showTenantCode = false;
        this.returnUrl = '/dashboard';
    }
    ngOnInit() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            tenantCode: [''],
            rememberMe: [false]
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    }
    onSubmit() {
        if (this.loginForm.invalid)
            return;
        this.isLoading = true;
        const { email, password } = this.loginForm.value;
        this.authService.login({ email, password }).subscribe({
            next: () => {
                this.notification.success('Welcome back!');
                this.router.navigateByUrl(this.returnUrl);
            },
            error: (error) => {
                this.isLoading = false;
                if (error.status === 400 && error.error?.requiresTenantCode) {
                    this.showTenantCode = true;
                    this.notification.info('Please enter your tenant code');
                }
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }
    static { this.ɵfac = function LoginComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LoginComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.AuthService), i0.ɵɵdirectiveInject(i3.Router), i0.ɵɵdirectiveInject(i3.ActivatedRoute), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LoginComponent, selectors: [["app-login"]], standalone: false, decls: 37, vars: 10, consts: [[1, "login-card"], [1, "subtitle"], [3, "ngSubmit", "formGroup"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "type", "email", "formControlName", "email", "placeholder", "Enter your email"], ["matPrefix", ""], [4, "ngIf"], ["matInput", "", "formControlName", "password", 3, "type"], ["mat-icon-button", "", "matSuffix", "", "type", "button", 3, "click"], ["appearance", "outline", "class", "full-width", 4, "ngIf"], [1, "form-actions"], ["formControlName", "rememberMe"], ["routerLink", "/auth/forgot-password"], ["mat-raised-button", "", "color", "primary", "type", "submit", 1, "full-width", "submit-btn", 3, "disabled"], ["diameter", "20", 4, "ngIf"], [1, "register-link"], ["routerLink", "/auth/register"], ["matInput", "", "formControlName", "tenantCode", "placeholder", "Enter tenant code"], ["diameter", "20"]], template: function LoginComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "h2");
            i0.ɵɵtext(2, "Welcome Back");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "p", 1);
            i0.ɵɵtext(4, "Sign in to your account");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "form", 2);
            i0.ɵɵlistener("ngSubmit", function LoginComponent_Template_form_ngSubmit_5_listener() { return ctx.onSubmit(); });
            i0.ɵɵelementStart(6, "mat-form-field", 3)(7, "mat-label");
            i0.ɵɵtext(8, "Email");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(9, "input", 4);
            i0.ɵɵelementStart(10, "mat-icon", 5);
            i0.ɵɵtext(11, "email");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(12, LoginComponent_mat_error_12_Template, 2, 0, "mat-error", 6)(13, LoginComponent_mat_error_13_Template, 2, 0, "mat-error", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "mat-form-field", 3)(15, "mat-label");
            i0.ɵɵtext(16, "Password");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(17, "input", 7);
            i0.ɵɵelementStart(18, "mat-icon", 5);
            i0.ɵɵtext(19, "lock");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "button", 8);
            i0.ɵɵlistener("click", function LoginComponent_Template_button_click_20_listener() { return ctx.hidePassword = !ctx.hidePassword; });
            i0.ɵɵelementStart(21, "mat-icon");
            i0.ɵɵtext(22);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(23, LoginComponent_mat_error_23_Template, 2, 0, "mat-error", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(24, LoginComponent_mat_form_field_24_Template, 6, 0, "mat-form-field", 9);
            i0.ɵɵelementStart(25, "div", 10)(26, "mat-checkbox", 11);
            i0.ɵɵtext(27, "Remember me");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "a", 12);
            i0.ɵɵtext(29, "Forgot password?");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(30, "button", 13);
            i0.ɵɵtemplate(31, LoginComponent_mat_spinner_31_Template, 1, 0, "mat-spinner", 14)(32, LoginComponent_span_32_Template, 2, 0, "span", 6);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(33, "div", 15);
            i0.ɵɵtext(34, " Don't have an account? ");
            i0.ɵɵelementStart(35, "a", 16);
            i0.ɵɵtext(36, "Sign up");
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            let tmp_1_0;
            let tmp_2_0;
            let tmp_5_0;
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("formGroup", ctx.loginForm);
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("ngIf", (tmp_1_0 = ctx.loginForm.get("email")) == null ? null : tmp_1_0.hasError("required"));
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", (tmp_2_0 = ctx.loginForm.get("email")) == null ? null : tmp_2_0.hasError("email"));
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("type", ctx.hidePassword ? "password" : "text");
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.hidePassword ? "visibility_off" : "visibility");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", (tmp_5_0 = ctx.loginForm.get("password")) == null ? null : tmp_5_0.hasError("required"));
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.showTenantCode);
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("disabled", ctx.loginForm.invalid || ctx.isLoading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.isLoading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.isLoading);
        } }, dependencies: [i5.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i3.RouterLink, i6.MatButton, i6.MatIconButton, i7.MatIcon, i8.MatInput, i8.MatFormField, i8.MatLabel, i8.MatError, i8.MatPrefix, i8.MatSuffix, i9.MatCheckbox, i10.MatProgressSpinner], styles: [".login-card[_ngcontent-%COMP%] {\n      background: white;\n      padding: 2.5rem;\n      border-radius: 12px;\n      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n      width: 100%;\n      max-width: 400px;\n    }\n\n    h2[_ngcontent-%COMP%] {\n      margin: 0 0 0.5rem;\n      font-size: 1.75rem;\n      font-weight: 600;\n      text-align: center;\n    }\n\n    .subtitle[_ngcontent-%COMP%] {\n      color: #666;\n      text-align: center;\n      margin-bottom: 2rem;\n    }\n\n    .full-width[_ngcontent-%COMP%] {\n      width: 100%;\n    }\n\n    .form-actions[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 1.5rem;\n    }\n\n    .form-actions[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n      color: #3f51b5;\n      text-decoration: none;\n      font-size: 0.875rem;\n    }\n\n    .submit-btn[_ngcontent-%COMP%] {\n      height: 48px;\n      font-size: 1rem;\n    }\n\n    .register-link[_ngcontent-%COMP%] {\n      text-align: center;\n      margin-top: 1.5rem;\n      color: #666;\n    }\n\n    .register-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n      color: #3f51b5;\n      text-decoration: none;\n      font-weight: 500;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LoginComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-login', template: `
    <div class="login-card">
      <h2>Welcome Back</h2>
      <p class="subtitle">Sign in to your account</p>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="Enter your email">
          <mat-icon matPrefix>email</mat-icon>
          <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
          <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Invalid email format</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
          <mat-icon matPrefix>lock</mat-icon>
          <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
            <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width" *ngIf="showTenantCode">
          <mat-label>Tenant Code</mat-label>
          <input matInput formControlName="tenantCode" placeholder="Enter tenant code">
          <mat-icon matPrefix>business</mat-icon>
        </mat-form-field>

        <div class="form-actions">
          <mat-checkbox formControlName="rememberMe">Remember me</mat-checkbox>
          <a routerLink="/auth/forgot-password">Forgot password?</a>
        </div>

        <button mat-raised-button color="primary" type="submit" class="full-width submit-btn"
                [disabled]="loginForm.invalid || isLoading">
          <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
          <span *ngIf="!isLoading">Sign In</span>
        </button>
      </form>

      <div class="register-link">
        Don't have an account? <a routerLink="/auth/register">Sign up</a>
      </div>
    </div>
  `, styles: ["\n    .login-card {\n      background: white;\n      padding: 2.5rem;\n      border-radius: 12px;\n      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n      width: 100%;\n      max-width: 400px;\n    }\n\n    h2 {\n      margin: 0 0 0.5rem;\n      font-size: 1.75rem;\n      font-weight: 600;\n      text-align: center;\n    }\n\n    .subtitle {\n      color: #666;\n      text-align: center;\n      margin-bottom: 2rem;\n    }\n\n    .full-width {\n      width: 100%;\n    }\n\n    .form-actions {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 1.5rem;\n    }\n\n    .form-actions a {\n      color: #3f51b5;\n      text-decoration: none;\n      font-size: 0.875rem;\n    }\n\n    .submit-btn {\n      height: 48px;\n      font-size: 1rem;\n    }\n\n    .register-link {\n      text-align: center;\n      margin-top: 1.5rem;\n      color: #666;\n    }\n\n    .register-link a {\n      color: #3f51b5;\n      text-decoration: none;\n      font-weight: 500;\n    }\n  "] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.AuthService }, { type: i3.Router }, { type: i3.ActivatedRoute }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "app/features/auth/login/login.component.ts", lineNumber: 115 }); })();
//# sourceMappingURL=login.component.js.map