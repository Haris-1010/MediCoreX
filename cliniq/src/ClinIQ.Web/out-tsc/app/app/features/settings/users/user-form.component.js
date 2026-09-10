import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/router";
import * as i3 from "@angular/common";
import * as i4 from "@angular/forms";
import * as i5 from "../../../shared/components/page-header/page-header.component";
import * as i6 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Settings", route: "/settings" });
const _c2 = () => ({ label: "Users", route: "/settings/users" });
const _c3 = a0 => ({ label: a0 });
const _c4 = (a0, a1, a2, a3) => [a0, a1, a2, a3];
function UserFormComponent_div_30_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 5)(1, "div", 6)(2, "label");
    i0.ɵɵtext(3, "Password (default: ChangeMe@123)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "input", 17);
    i0.ɵɵtwoWayListener("ngModelChange", function UserFormComponent_div_30_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.user.password, $event) || (ctx_r1.user.password = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div", 6)(6, "label");
    i0.ɵɵtext(7, "Status");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "select", 18);
    i0.ɵɵtwoWayListener("ngModelChange", function UserFormComponent_div_30_Template_select_ngModelChange_8_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.user.isActive, $event) || (ctx_r1.user.isActive = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementStart(9, "option", 19);
    i0.ɵɵtext(10, "Active");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "option", 19);
    i0.ɵɵtext(12, "Inactive");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.user.password);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.user.isActive);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngValue", true);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngValue", false);
} }
function UserFormComponent_div_31_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 5)(1, "div", 6)(2, "label");
    i0.ɵɵtext(3, "Status");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "select", 18);
    i0.ɵɵtwoWayListener("ngModelChange", function UserFormComponent_div_31_Template_select_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.user.isActive, $event) || (ctx_r1.user.isActive = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementStart(5, "option", 19);
    i0.ɵɵtext(6, "Active");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "option", 19);
    i0.ɵɵtext(8, "Inactive");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.user.isActive);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngValue", true);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngValue", false);
} }
function UserFormComponent_label_36_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 20)(1, "input", 21);
    i0.ɵɵlistener("change", function UserFormComponent_label_36_Template_input_change_1_listener() { const role_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleRole(role_r5.id || role_r5.roleId || role_r5.name)); });
    i0.ɵɵelementEnd();
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const role_r5 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("checked", ctx_r1.isRoleSelected(role_r5));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", role_r5.name, " ");
} }
export class UserFormComponent {
    constructor(api, router, route) {
        this.api = api;
        this.router = router;
        this.route = route;
        this.isEdit = false;
        this.userId = '';
        this.saving = false;
        this.user = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            isActive: true,
            roleIds: []
        };
        this.availableRoles = [];
    }
    ngOnInit() {
        this.loadRoles();
        const id = this.route.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEdit = true;
            this.userId = id;
            this.loadUser();
        }
    }
    loadRoles() {
        this.api.get('v1/roles').subscribe({
            next: (res) => {
                this.availableRoles = Array.isArray(res) ? res.map((role) => ({
                    ...role,
                    id: role.id ?? role.roleId ?? role.name,
                    name: role.name ?? role.roleName ?? 'Role'
                })) : [];
            },
            error: (err) => console.error('Failed to load roles', err)
        });
    }
    normalizeRoleIds(res) {
        const direct = Array.isArray(res?.roleIds) ? res.roleIds : [];
        const nested = Array.isArray(res?.roles) ? res.roles : [];
        const all = direct.length ? direct : nested;
        return all.map((role) => typeof role === 'string' ? role : (role?.id ?? role?.roleId ?? role?.name ?? ''))
            .filter(Boolean);
    }
    isRoleSelected(role) {
        const roleId = role.id ?? role.roleId ?? role.name;
        return (this.user.roleIds || []).includes(roleId);
    }
    loadUser() {
        this.api.get(`v1/users/${this.userId}`).subscribe({
            next: (res) => {
                this.user = {
                    firstName: res.firstName || '',
                    lastName: res.lastName || '',
                    email: res.email || '',
                    phone: res.phoneNumber || res.phone || '',
                    isActive: res.isActive ?? true,
                    roleIds: this.normalizeRoleIds(res)
                };
            },
            error: (err) => console.error('Failed to load user', err)
        });
    }
    toggleRole(roleId) {
        const roleIds = this.user.roleIds || [];
        const idx = roleIds.indexOf(roleId);
        if (idx >= 0) {
            roleIds.splice(idx, 1);
        }
        else {
            roleIds.push(roleId);
        }
    }
    save() {
        if (!this.user.firstName || !this.user.lastName || !this.user.email) {
            alert('Please fill in required fields');
            return;
        }
        this.saving = true;
        const payload = {
            ...this.user,
            roleIds: this.user.roleIds
        };
        const request = this.isEdit
            ? this.api.put('v1/users', this.userId, payload)
            : this.api.post('v1/users', payload);
        request.subscribe({
            next: () => {
                this.router.navigate(['/settings/users']);
            },
            error: (err) => {
                this.saving = false;
                alert('Failed to save user: ' + (err.message || 'Unknown error'));
            }
        });
    }
    goBack() {
        this.router.navigate(['/settings/users']);
    }
    static { this.ɵfac = function UserFormComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || UserFormComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.Router), i0.ɵɵdirectiveInject(i2.ActivatedRoute)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: UserFormComponent, selectors: [["app-user-form"]], standalone: false, decls: 42, vars: 23, consts: [[3, "title", "breadcrumbs"], [1, "page-card"], [1, "page-header"], [1, "btn", "btn-outline", 3, "click"], [1, "form-container", 3, "ngSubmit"], [1, "form-row"], [1, "form-group"], ["type", "text", "name", "firstName", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "lastName", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["type", "email", "name", "email", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "phone", 1, "form-control", 3, "ngModelChange", "ngModel"], ["class", "form-row", 4, "ngIf"], [1, "checkbox-group"], ["class", "checkbox-label", 4, "ngFor", "ngForOf"], [1, "form-actions"], ["type", "button", 1, "btn", "btn-outline", 3, "click"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["type", "password", "name", "password", 1, "form-control", 3, "ngModelChange", "ngModel"], ["name", "isActive", 1, "form-control", 3, "ngModelChange", "ngModel"], [3, "ngValue"], [1, "checkbox-label"], ["type", "checkbox", 3, "change", "checked"]], template: function UserFormComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1)(3, "div", 2)(4, "div")(5, "h2");
            i0.ɵɵtext(6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p");
            i0.ɵɵtext(8);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "button", 3);
            i0.ɵɵlistener("click", function UserFormComponent_Template_button_click_9_listener() { return ctx.goBack(); });
            i0.ɵɵtext(10, "Back to Users");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "form", 4);
            i0.ɵɵlistener("ngSubmit", function UserFormComponent_Template_form_ngSubmit_11_listener() { return ctx.save(); });
            i0.ɵɵelementStart(12, "div", 5)(13, "div", 6)(14, "label");
            i0.ɵɵtext(15, "First Name *");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "input", 7);
            i0.ɵɵtwoWayListener("ngModelChange", function UserFormComponent_Template_input_ngModelChange_16_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.user.firstName, $event) || (ctx.user.firstName = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(17, "div", 6)(18, "label");
            i0.ɵɵtext(19, "Last Name *");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "input", 8);
            i0.ɵɵtwoWayListener("ngModelChange", function UserFormComponent_Template_input_ngModelChange_20_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.user.lastName, $event) || (ctx.user.lastName = $event); return $event; });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(21, "div", 5)(22, "div", 6)(23, "label");
            i0.ɵɵtext(24, "Email *");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "input", 9);
            i0.ɵɵtwoWayListener("ngModelChange", function UserFormComponent_Template_input_ngModelChange_25_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.user.email, $event) || (ctx.user.email = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(26, "div", 6)(27, "label");
            i0.ɵɵtext(28, "Phone");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "input", 10);
            i0.ɵɵtwoWayListener("ngModelChange", function UserFormComponent_Template_input_ngModelChange_29_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.user.phone, $event) || (ctx.user.phone = $event); return $event; });
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(30, UserFormComponent_div_30_Template, 13, 4, "div", 11)(31, UserFormComponent_div_31_Template, 9, 3, "div", 11);
            i0.ɵɵelementStart(32, "div", 6)(33, "label");
            i0.ɵɵtext(34, "Roles");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "div", 12);
            i0.ɵɵtemplate(36, UserFormComponent_label_36_Template, 3, 2, "label", 13);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(37, "div", 14)(38, "button", 15);
            i0.ɵɵlistener("click", function UserFormComponent_Template_button_click_38_listener() { return ctx.goBack(); });
            i0.ɵɵtext(39, "Cancel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(40, "button", 16);
            i0.ɵɵtext(41);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("title", ctx.isEdit ? "Edit User" : "Create User")("breadcrumbs", i0.ɵɵpureFunction4(18, _c4, i0.ɵɵpureFunction0(13, _c0), i0.ɵɵpureFunction0(14, _c1), i0.ɵɵpureFunction0(15, _c2), i0.ɵɵpureFunction1(16, _c3, ctx.isEdit ? "Edit" : "New")));
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.isEdit ? "Edit User" : "Create User");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.isEdit ? "Update the selected user account." : "Create a new staff account and assign access roles.");
            i0.ɵɵadvance(8);
            i0.ɵɵtwoWayProperty("ngModel", ctx.user.firstName);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.user.lastName);
            i0.ɵɵadvance(5);
            i0.ɵɵtwoWayProperty("ngModel", ctx.user.email);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.user.phone);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.isEdit);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.isEdit);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngForOf", ctx.availableRoles);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("disabled", ctx.saving);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.saving ? "Saving..." : ctx.isEdit ? "Update User" : "Create User", " ");
        } }, dependencies: [i3.NgForOf, i3.NgIf, i4.ɵNgNoValidate, i4.NgSelectOption, i4.ɵNgSelectMultipleOption, i4.DefaultValueAccessor, i4.SelectControlValueAccessor, i4.NgControlStatus, i4.NgControlStatusGroup, i4.RequiredValidator, i4.NgModel, i4.NgForm, i5.PageHeaderComponent, i6.MainLayoutComponent], styles: [".page-card[_ngcontent-%COMP%] { background: #fff; border: 1px solid rgba(0, 0, 0, 0.06); border-radius: 12px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04); }\n    .page-header[_ngcontent-%COMP%] { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }\n    .page-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { margin: 0; color: #1f2937; }\n    .page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0.4rem 0 0; color: #6b7280; }\n    .form-container[_ngcontent-%COMP%] { background: white; padding: 24px; border-radius: 8px; }\n    .form-row[_ngcontent-%COMP%] { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }\n    .form-group[_ngcontent-%COMP%] { margin-bottom: 16px; }\n    .form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] { display: block; margin-bottom: 6px; font-weight: 500; color: #333; }\n    .form-control[_ngcontent-%COMP%] { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box; }\n    .form-control[_ngcontent-%COMP%]:focus { border-color: #2196f3; outline: none; }\n    .checkbox-group[_ngcontent-%COMP%] { display: flex; flex-wrap: wrap; gap: 16px; }\n    .checkbox-label[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 6px; cursor: pointer; }\n    .form-actions[_ngcontent-%COMP%] { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee; }\n    .btn[_ngcontent-%COMP%] { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }\n    .btn-primary[_ngcontent-%COMP%] { background: #2196f3; color: white; }\n    .btn-primary[_ngcontent-%COMP%]:hover { background: #1976d2; }\n    .btn-primary[_ngcontent-%COMP%]:disabled { background: #ccc; }\n    .btn-outline[_ngcontent-%COMP%] { background: white; border: 1px solid #ddd; color: #333; }\n    .btn-outline[_ngcontent-%COMP%]:hover { background: #f5f5f5; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(UserFormComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-user-form', template: `
    <app-main-layout>
      <app-page-header [title]="isEdit ? 'Edit User' : 'Create User'" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Settings', route: '/settings' }, { label: 'Users', route: '/settings/users' }, { label: isEdit ? 'Edit' : 'New' }]"></app-page-header>

      <div class="page-card">
        <div class="page-header">
          <div>
            <h2>{{ isEdit ? 'Edit User' : 'Create User' }}</h2>
            <p>{{ isEdit ? 'Update the selected user account.' : 'Create a new staff account and assign access roles.' }}</p>
          </div>
          <button class="btn btn-outline" (click)="goBack()">Back to Users</button>
        </div>

        <form (ngSubmit)="save()" class="form-container">
          <div class="form-row">
            <div class="form-group">
              <label>First Name *</label>
              <input type="text" class="form-control" [(ngModel)]="user.firstName" name="firstName" required>
            </div>
            <div class="form-group">
              <label>Last Name *</label>
              <input type="text" class="form-control" [(ngModel)]="user.lastName" name="lastName" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Email *</label>
              <input type="email" class="form-control" [(ngModel)]="user.email" name="email" required>
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="text" class="form-control" [(ngModel)]="user.phone" name="phone">
            </div>
          </div>

          <div class="form-row" *ngIf="!isEdit">
            <div class="form-group">
              <label>Password (default: ChangeMe&#64;123)</label>
              <input type="password" class="form-control" [(ngModel)]="user.password" name="password">
            </div>
            <div class="form-group">
              <label>Status</label>
              <select class="form-control" [(ngModel)]="user.isActive" name="isActive">
                <option [ngValue]="true">Active</option>
                <option [ngValue]="false">Inactive</option>
              </select>
            </div>
          </div>

          <div class="form-row" *ngIf="isEdit">
            <div class="form-group">
              <label>Status</label>
              <select class="form-control" [(ngModel)]="user.isActive" name="isActive">
                <option [ngValue]="true">Active</option>
                <option [ngValue]="false">Inactive</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Roles</label>
            <div class="checkbox-group">
              <label *ngFor="let role of availableRoles" class="checkbox-label">
                <input type="checkbox" [checked]="isRoleSelected(role)" (change)="toggleRole(role.id || role.roleId || role.name)">
                {{ role.name }}
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="saving">
              {{ saving ? 'Saving...' : (isEdit ? 'Update User' : 'Create User') }}
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `, styles: ["\n    .page-card { background: #fff; border: 1px solid rgba(0, 0, 0, 0.06); border-radius: 12px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04); }\n    .page-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }\n    .page-header h2 { margin: 0; color: #1f2937; }\n    .page-header p { margin: 0.4rem 0 0; color: #6b7280; }\n    .form-container { background: white; padding: 24px; border-radius: 8px; }\n    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }\n    .form-group { margin-bottom: 16px; }\n    .form-group label { display: block; margin-bottom: 6px; font-weight: 500; color: #333; }\n    .form-control { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box; }\n    .form-control:focus { border-color: #2196f3; outline: none; }\n    .checkbox-group { display: flex; flex-wrap: wrap; gap: 16px; }\n    .checkbox-label { display: flex; align-items: center; gap: 6px; cursor: pointer; }\n    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee; }\n    .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }\n    .btn-primary { background: #2196f3; color: white; }\n    .btn-primary:hover { background: #1976d2; }\n    .btn-primary:disabled { background: #ccc; }\n    .btn-outline { background: white; border: 1px solid #ddd; color: #333; }\n    .btn-outline:hover { background: #f5f5f5; }\n  "] }]
    }], () => [{ type: i1.ApiService }, { type: i2.Router }, { type: i2.ActivatedRoute }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(UserFormComponent, { className: "UserFormComponent", filePath: "app/features/settings/users/user-form.component.ts", lineNumber: 110 }); })();
//# sourceMappingURL=user-form.component.js.map