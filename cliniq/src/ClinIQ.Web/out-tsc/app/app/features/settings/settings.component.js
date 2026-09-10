import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../core/services/api.service";
import * as i3 from "../../core/services/notification.service";
import * as i4 from "@angular/router";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/material/input";
import * as i7 from "@angular/material/select";
import * as i8 from "@angular/material/tabs";
import * as i9 from "@angular/material/slide-toggle";
import * as i10 from "../../shared/components/page-header/page-header.component";
import * as i11 from "../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Settings" });
const _c2 = (a0, a1) => [a0, a1];
export class SettingsComponent {
    constructor(fb, api, notification) {
        this.fb = fb;
        this.api = api;
        this.notification = notification;
        this.appointmentSettings = { slotDuration: 30, advanceBookingDays: 30, allowOnlineBooking: true };
        this.billingSettings = { invoicePrefix: 'INV-', defaultTax: 0, paymentDueDays: 30 };
    }
    ngOnInit() {
        this.generalForm = this.fb.group({ organizationName: [''], phone: [''], email: [''], address: [''], currency: ['USD'], dateFormat: ['MM/dd/yyyy'] });
        this.api.get('v1/settings/general').subscribe(r => this.generalForm.patchValue(r));
    }
    saveGeneral() { this.api.put('v1/settings', 'general', this.generalForm.value).subscribe(() => this.notification.success('Settings saved')); }
    static { this.ɵfac = function SettingsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SettingsComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SettingsComponent, selectors: [["app-settings"]], standalone: false, decls: 103, vars: 13, consts: [["title", "Settings", 3, "breadcrumbs"], ["label", "General"], [1, "tab-content"], [3, "ngSubmit", "formGroup"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "formControlName", "organizationName"], [1, "form-row"], ["appearance", "outline"], ["matInput", "", "formControlName", "phone"], ["matInput", "", "formControlName", "email"], ["matInput", "", "formControlName", "address", "rows", "2"], ["formControlName", "currency"], ["value", "USD"], ["value", "EUR"], ["value", "GBP"], ["value", "INR"], ["formControlName", "dateFormat"], ["value", "MM/dd/yyyy"], ["value", "dd/MM/yyyy"], ["value", "yyyy-MM-dd"], [1, "form-actions"], ["mat-raised-button", "", "color", "primary", "type", "submit"], ["label", "Appointments"], ["matInput", "", "type", "number", 3, "ngModelChange", "ngModel"], [3, "ngModelChange", "ngModel"], ["label", "Billing"], ["matInput", "", 3, "ngModelChange", "ngModel"], ["label", "Users & Roles"], [1, "management-links"], [1, "link-cards"], ["routerLink", "/settings/users", 1, "link-card"], [1, "fas", "fa-users"], ["routerLink", "/settings/roles", 1, "link-card"], [1, "fas", "fa-user-tag"]], template: function SettingsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "mat-tab-group")(3, "mat-tab", 1)(4, "div", 2)(5, "form", 3);
            i0.ɵɵlistener("ngSubmit", function SettingsComponent_Template_form_ngSubmit_5_listener() { return ctx.saveGeneral(); });
            i0.ɵɵelementStart(6, "h3");
            i0.ɵɵtext(7, "Organization Settings");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "mat-form-field", 4)(9, "mat-label");
            i0.ɵɵtext(10, "Organization Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(11, "input", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "div", 6)(13, "mat-form-field", 7)(14, "mat-label");
            i0.ɵɵtext(15, "Phone");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(16, "input", 8);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "mat-form-field", 7)(18, "mat-label");
            i0.ɵɵtext(19, "Email");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(20, "input", 9);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(21, "mat-form-field", 4)(22, "mat-label");
            i0.ɵɵtext(23, "Address");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(24, "textarea", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "h3");
            i0.ɵɵtext(26, "Regional Settings");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "div", 6)(28, "mat-form-field", 7)(29, "mat-label");
            i0.ɵɵtext(30, "Currency");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "mat-select", 11)(32, "mat-option", 12);
            i0.ɵɵtext(33, "USD");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "mat-option", 13);
            i0.ɵɵtext(35, "EUR");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(36, "mat-option", 14);
            i0.ɵɵtext(37, "GBP");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(38, "mat-option", 15);
            i0.ɵɵtext(39, "INR");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(40, "mat-form-field", 7)(41, "mat-label");
            i0.ɵɵtext(42, "Date Format");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(43, "mat-select", 16)(44, "mat-option", 17);
            i0.ɵɵtext(45, "MM/dd/yyyy");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(46, "mat-option", 18);
            i0.ɵɵtext(47, "dd/MM/yyyy");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "mat-option", 19);
            i0.ɵɵtext(49, "yyyy-MM-dd");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(50, "div", 20)(51, "button", 21);
            i0.ɵɵtext(52, "Save Changes");
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(53, "mat-tab", 22)(54, "div", 2)(55, "h3");
            i0.ɵɵtext(56, "Appointment Settings");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(57, "mat-form-field", 7)(58, "mat-label");
            i0.ɵɵtext(59, "Default Slot Duration (minutes)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(60, "input", 23);
            i0.ɵɵtwoWayListener("ngModelChange", function SettingsComponent_Template_input_ngModelChange_60_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.appointmentSettings.slotDuration, $event) || (ctx.appointmentSettings.slotDuration = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(61, "mat-form-field", 7)(62, "mat-label");
            i0.ɵɵtext(63, "Advance Booking Days");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(64, "input", 23);
            i0.ɵɵtwoWayListener("ngModelChange", function SettingsComponent_Template_input_ngModelChange_64_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.appointmentSettings.advanceBookingDays, $event) || (ctx.appointmentSettings.advanceBookingDays = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(65, "mat-slide-toggle", 24);
            i0.ɵɵtwoWayListener("ngModelChange", function SettingsComponent_Template_mat_slide_toggle_ngModelChange_65_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.appointmentSettings.allowOnlineBooking, $event) || (ctx.appointmentSettings.allowOnlineBooking = $event); return $event; });
            i0.ɵɵtext(66, "Allow Online Booking");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(67, "mat-tab", 25)(68, "div", 2)(69, "h3");
            i0.ɵɵtext(70, "Billing Settings");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(71, "mat-form-field", 7)(72, "mat-label");
            i0.ɵɵtext(73, "Invoice Prefix");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(74, "input", 26);
            i0.ɵɵtwoWayListener("ngModelChange", function SettingsComponent_Template_input_ngModelChange_74_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.billingSettings.invoicePrefix, $event) || (ctx.billingSettings.invoicePrefix = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(75, "mat-form-field", 7)(76, "mat-label");
            i0.ɵɵtext(77, "Default Tax %");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(78, "input", 23);
            i0.ɵɵtwoWayListener("ngModelChange", function SettingsComponent_Template_input_ngModelChange_78_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.billingSettings.defaultTax, $event) || (ctx.billingSettings.defaultTax = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(79, "mat-form-field", 7)(80, "mat-label");
            i0.ɵɵtext(81, "Payment Due Days");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(82, "input", 23);
            i0.ɵɵtwoWayListener("ngModelChange", function SettingsComponent_Template_input_ngModelChange_82_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.billingSettings.paymentDueDays, $event) || (ctx.billingSettings.paymentDueDays = $event); return $event; });
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(83, "mat-tab", 27)(84, "div", 2)(85, "div", 28)(86, "h3");
            i0.ɵɵtext(87, "User & Role Management");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(88, "p");
            i0.ɵɵtext(89, "Manage system users, their roles, and permissions.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(90, "div", 29)(91, "a", 30);
            i0.ɵɵelement(92, "i", 31);
            i0.ɵɵelementStart(93, "h4");
            i0.ɵɵtext(94, "Users");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(95, "p");
            i0.ɵɵtext(96, "Create, edit, and manage user accounts");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(97, "a", 32);
            i0.ɵɵelement(98, "i", 33);
            i0.ɵɵelementStart(99, "h4");
            i0.ɵɵtext(100, "Roles");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(101, "p");
            i0.ɵɵtext(102, "Define roles and assign permissions");
            i0.ɵɵelementEnd()()()()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(10, _c2, i0.ɵɵpureFunction0(8, _c0), i0.ɵɵpureFunction0(9, _c1)));
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("formGroup", ctx.generalForm);
            i0.ɵɵadvance(55);
            i0.ɵɵtwoWayProperty("ngModel", ctx.appointmentSettings.slotDuration);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.appointmentSettings.advanceBookingDays);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.appointmentSettings.allowOnlineBooking);
            i0.ɵɵadvance(9);
            i0.ɵɵtwoWayProperty("ngModel", ctx.billingSettings.invoicePrefix);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.billingSettings.defaultTax);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.billingSettings.paymentDueDays);
        } }, dependencies: [i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.NgModel, i1.FormGroupDirective, i1.FormControlName, i4.RouterLink, i5.MatButton, i6.MatInput, i6.MatFormField, i6.MatLabel, i7.MatSelect, i7.MatOption, i8.MatTab, i8.MatTabGroup, i9.MatSlideToggle, i10.PageHeaderComponent, i11.MainLayoutComponent], styles: [".tab-content[_ngcontent-%COMP%] { padding: 1.5rem; max-width: 800px; } h3[_ngcontent-%COMP%] { margin: 1.5rem 0 1rem; } h3[_ngcontent-%COMP%]:first-child { margin-top: 0; }\n    .form-row[_ngcontent-%COMP%] { display: flex; gap: 1rem; } .form-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] { flex: 1; } .full-width[_ngcontent-%COMP%] { width: 100%; }\n    .form-actions[_ngcontent-%COMP%] { margin-top: 1.5rem; }\n    mat-slide-toggle[_ngcontent-%COMP%] { margin: 1rem 0; display: block; }\n    .management-links[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin-top: 0; }\n    .management-links[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { color: #666; margin-bottom: 1.5rem; }\n    .link-cards[_ngcontent-%COMP%] { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }\n    .link-card[_ngcontent-%COMP%] { display: block; padding: 1.5rem; background: #f8f9fa; border-radius: 8px; text-decoration: none; color: inherit; border: 2px solid transparent; transition: all 0.2s; }\n    .link-card[_ngcontent-%COMP%]:hover { border-color: #2196f3; background: #e3f2fd; }\n    .link-card[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] { font-size: 2rem; color: #2196f3; margin-bottom: 0.75rem; }\n    .link-card[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { margin: 0 0 0.5rem; color: #333; }\n    .link-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; color: #666; font-size: 0.9rem; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SettingsComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-settings', template: `
    <app-main-layout>
      <app-page-header title="Settings" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Settings' }]"></app-page-header>
      <mat-tab-group>
        <mat-tab label="General">
          <div class="tab-content">
            <form [formGroup]="generalForm" (ngSubmit)="saveGeneral()">
              <h3>Organization Settings</h3>
              <mat-form-field appearance="outline" class="full-width"><mat-label>Organization Name</mat-label><input matInput formControlName="organizationName"></mat-form-field>
              <div class="form-row">
                <mat-form-field appearance="outline"><mat-label>Phone</mat-label><input matInput formControlName="phone"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput formControlName="email"></mat-form-field>
              </div>
              <mat-form-field appearance="outline" class="full-width"><mat-label>Address</mat-label><textarea matInput formControlName="address" rows="2"></textarea></mat-form-field>
              <h3>Regional Settings</h3>
              <div class="form-row">
                <mat-form-field appearance="outline"><mat-label>Currency</mat-label><mat-select formControlName="currency"><mat-option value="USD">USD</mat-option><mat-option value="EUR">EUR</mat-option><mat-option value="GBP">GBP</mat-option><mat-option value="INR">INR</mat-option></mat-select></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Date Format</mat-label><mat-select formControlName="dateFormat"><mat-option value="MM/dd/yyyy">MM/dd/yyyy</mat-option><mat-option value="dd/MM/yyyy">dd/MM/yyyy</mat-option><mat-option value="yyyy-MM-dd">yyyy-MM-dd</mat-option></mat-select></mat-form-field>
              </div>
              <div class="form-actions"><button mat-raised-button color="primary" type="submit">Save Changes</button></div>
            </form>
          </div>
        </mat-tab>
        <mat-tab label="Appointments">
          <div class="tab-content">
            <h3>Appointment Settings</h3>
            <mat-form-field appearance="outline"><mat-label>Default Slot Duration (minutes)</mat-label><input matInput type="number" [(ngModel)]="appointmentSettings.slotDuration"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Advance Booking Days</mat-label><input matInput type="number" [(ngModel)]="appointmentSettings.advanceBookingDays"></mat-form-field>
            <mat-slide-toggle [(ngModel)]="appointmentSettings.allowOnlineBooking">Allow Online Booking</mat-slide-toggle>
          </div>
        </mat-tab>
        <mat-tab label="Billing">
          <div class="tab-content">
            <h3>Billing Settings</h3>
            <mat-form-field appearance="outline"><mat-label>Invoice Prefix</mat-label><input matInput [(ngModel)]="billingSettings.invoicePrefix"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Default Tax %</mat-label><input matInput type="number" [(ngModel)]="billingSettings.defaultTax"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Payment Due Days</mat-label><input matInput type="number" [(ngModel)]="billingSettings.paymentDueDays"></mat-form-field>
          </div>
        </mat-tab>
        <mat-tab label="Users & Roles">
          <div class="tab-content">
            <div class="management-links">
              <h3>User & Role Management</h3>
              <p>Manage system users, their roles, and permissions.</p>
              <div class="link-cards">
                <a routerLink="/settings/users" class="link-card">
                  <i class="fas fa-users"></i>
                  <h4>Users</h4>
                  <p>Create, edit, and manage user accounts</p>
                </a>
                <a routerLink="/settings/roles" class="link-card">
                  <i class="fas fa-user-tag"></i>
                  <h4>Roles</h4>
                  <p>Define roles and assign permissions</p>
                </a>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </app-main-layout>
  `, styles: [".tab-content { padding: 1.5rem; max-width: 800px; } h3 { margin: 1.5rem 0 1rem; } h3:first-child { margin-top: 0; }\n    .form-row { display: flex; gap: 1rem; } .form-row mat-form-field { flex: 1; } .full-width { width: 100%; }\n    .form-actions { margin-top: 1.5rem; }\n    mat-slide-toggle { margin: 1rem 0; display: block; }\n    .management-links h3 { margin-top: 0; }\n    .management-links p { color: #666; margin-bottom: 1.5rem; }\n    .link-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }\n    .link-card { display: block; padding: 1.5rem; background: #f8f9fa; border-radius: 8px; text-decoration: none; color: inherit; border: 2px solid transparent; transition: all 0.2s; }\n    .link-card:hover { border-color: #2196f3; background: #e3f2fd; }\n    .link-card i { font-size: 2rem; color: #2196f3; margin-bottom: 0.75rem; }\n    .link-card h4 { margin: 0 0 0.5rem; color: #333; }\n    .link-card p { margin: 0; color: #666; font-size: 0.9rem; }"] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ApiService }, { type: i3.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SettingsComponent, { className: "SettingsComponent", filePath: "app/features/settings/settings.component.ts", lineNumber: 84 }); })();
//# sourceMappingURL=settings.component.js.map