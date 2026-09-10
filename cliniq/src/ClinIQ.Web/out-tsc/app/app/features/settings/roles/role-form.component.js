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
const _c2 = () => ({ label: "Roles", route: "/settings/roles" });
const _c3 = a0 => ({ label: a0 });
const _c4 = (a0, a1, a2, a3) => [a0, a1, a2, a3];
function RoleFormComponent_div_24_label_3_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 15)(1, "input", 16);
    i0.ɵɵlistener("change", function RoleFormComponent_div_24_label_3_Template_input_change_1_listener() { const p_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.togglePerm(p_r2.key)); });
    i0.ɵɵelementEnd();
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("checked", ctx_r2.isPermSelected(p_r2.key));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", p_r2.label, " ");
} }
function RoleFormComponent_div_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 13)(1, "h4");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, RoleFormComponent_div_24_label_3_Template, 3, 2, "label", 14);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const perm_r4 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(perm_r4.group);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", perm_r4.items);
} }
export class RoleFormComponent {
    constructor(api, router, route) {
        this.api = api;
        this.router = router;
        this.route = route;
        this.isEdit = false;
        this.roleId = '';
        this.saving = false;
        this.role = {
            name: '',
            description: '',
            permissionNames: []
        };
        this.selectedPermissions = [];
        this.permissionGroups = [
            {
                group: 'Patients',
                items: [
                    { key: 'patients.view', label: 'View Patients' },
                    { key: 'patients.create', label: 'Create Patients' },
                    { key: 'patients.edit', label: 'Edit Patients' },
                    { key: 'patients.delete', label: 'Delete Patients' }
                ]
            },
            {
                group: 'Appointments',
                items: [
                    { key: 'appointments.view', label: 'View Appointments' },
                    { key: 'appointments.create', label: 'Create Appointments' },
                    { key: 'appointments.edit', label: 'Edit Appointments' },
                    { key: 'appointments.delete', label: 'Delete Appointments' }
                ]
            },
            {
                group: 'Billing',
                items: [
                    { key: 'billing.view', label: 'View Billing' },
                    { key: 'billing.create', label: 'Create Invoices' },
                    { key: 'billing.edit', label: 'Edit Billing' },
                    { key: 'billing.delete', label: 'Delete Billing' }
                ]
            },
            {
                group: 'Administration',
                items: [
                    { key: 'users.manage', label: 'Manage Users' },
                    { key: 'roles.manage', label: 'Manage Roles' },
                    { key: 'settings.manage', label: 'Manage Settings' },
                    { key: 'reports.view', label: 'View Reports' }
                ]
            }
        ];
    }
    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEdit = true;
            this.roleId = id;
            this.loadRole();
        }
    }
    loadRole() {
        this.api.get(`v1/roles/${this.roleId}`).subscribe({
            next: (res) => {
                this.role = {
                    name: res.name || '',
                    description: res.description || ''
                };
                this.selectedPermissions = Array.isArray(res.permissionNames)
                    ? res.permissionNames
                    : Array.isArray(res.permissions)
                        ? res.permissions.map((perm) => typeof perm === 'string' ? perm : (perm?.name || perm?.key || ''))
                        : [];
            },
            error: (err) => console.error('Failed to load role', err)
        });
    }
    isPermSelected(key) {
        return this.selectedPermissions.includes(key);
    }
    togglePerm(key) {
        const idx = this.selectedPermissions.indexOf(key);
        if (idx >= 0) {
            this.selectedPermissions.splice(idx, 1);
        }
        else {
            this.selectedPermissions.push(key);
        }
    }
    save() {
        if (!this.role.name) {
            alert('Please enter a role name');
            return;
        }
        this.saving = true;
        const payload = {
            ...this.role,
            permissionNames: this.selectedPermissions
        };
        const request = this.isEdit
            ? this.api.put('v1/roles', this.roleId, payload)
            : this.api.post('v1/roles', payload);
        request.subscribe({
            next: () => {
                this.router.navigate(['/settings/roles']);
            },
            error: (err) => {
                this.saving = false;
                alert('Failed to save role: ' + (err.message || 'Unknown error'));
            }
        });
    }
    goBack() {
        this.router.navigate(['/settings/roles']);
    }
    static { this.ɵfac = function RoleFormComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RoleFormComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.Router), i0.ɵɵdirectiveInject(i2.ActivatedRoute)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: RoleFormComponent, selectors: [["app-role-form"]], standalone: false, decls: 30, vars: 19, consts: [[3, "title", "breadcrumbs"], [1, "page-card"], [1, "page-header"], [1, "btn", "btn-outline", 3, "click"], [1, "form-container", 3, "ngSubmit"], [1, "form-group"], ["type", "text", "name", "name", "required", "", "placeholder", "e.g. Doctor, Nurse, Admin", 1, "form-control", 3, "ngModelChange", "ngModel"], ["name", "description", "rows", "3", "placeholder", "Brief description of this role", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "permissions-grid"], ["class", "perm-group", 4, "ngFor", "ngForOf"], [1, "form-actions"], ["type", "button", 1, "btn", "btn-outline", 3, "click"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], [1, "perm-group"], ["class", "checkbox-label", 4, "ngFor", "ngForOf"], [1, "checkbox-label"], ["type", "checkbox", 3, "change", "checked"]], template: function RoleFormComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1)(3, "div", 2)(4, "div")(5, "h2");
            i0.ɵɵtext(6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p");
            i0.ɵɵtext(8);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "button", 3);
            i0.ɵɵlistener("click", function RoleFormComponent_Template_button_click_9_listener() { return ctx.goBack(); });
            i0.ɵɵtext(10, "Back to Roles");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "form", 4);
            i0.ɵɵlistener("ngSubmit", function RoleFormComponent_Template_form_ngSubmit_11_listener() { return ctx.save(); });
            i0.ɵɵelementStart(12, "div", 5)(13, "label");
            i0.ɵɵtext(14, "Role Name *");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "input", 6);
            i0.ɵɵtwoWayListener("ngModelChange", function RoleFormComponent_Template_input_ngModelChange_15_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.role.name, $event) || (ctx.role.name = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(16, "div", 5)(17, "label");
            i0.ɵɵtext(18, "Description");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "textarea", 7);
            i0.ɵɵtwoWayListener("ngModelChange", function RoleFormComponent_Template_textarea_ngModelChange_19_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.role.description, $event) || (ctx.role.description = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(20, "div", 5)(21, "label");
            i0.ɵɵtext(22, "Permissions");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "div", 8);
            i0.ɵɵtemplate(24, RoleFormComponent_div_24_Template, 4, 2, "div", 9);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(25, "div", 10)(26, "button", 11);
            i0.ɵɵlistener("click", function RoleFormComponent_Template_button_click_26_listener() { return ctx.goBack(); });
            i0.ɵɵtext(27, "Cancel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "button", 12);
            i0.ɵɵtext(29);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("title", ctx.isEdit ? "Edit Role" : "Create Role")("breadcrumbs", i0.ɵɵpureFunction4(14, _c4, i0.ɵɵpureFunction0(9, _c0), i0.ɵɵpureFunction0(10, _c1), i0.ɵɵpureFunction0(11, _c2), i0.ɵɵpureFunction1(12, _c3, ctx.isEdit ? "Edit" : "New")));
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.isEdit ? "Edit Role" : "Create Role");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.isEdit ? "Update the permission set for this role." : "Create a new permission set for your users.");
            i0.ɵɵadvance(7);
            i0.ɵɵtwoWayProperty("ngModel", ctx.role.name);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.role.description);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngForOf", ctx.permissionGroups);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("disabled", ctx.saving);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.saving ? "Saving..." : ctx.isEdit ? "Update Role" : "Create Role", " ");
        } }, dependencies: [i3.NgForOf, i4.ɵNgNoValidate, i4.DefaultValueAccessor, i4.NgControlStatus, i4.NgControlStatusGroup, i4.RequiredValidator, i4.NgModel, i4.NgForm, i5.PageHeaderComponent, i6.MainLayoutComponent], styles: [".page-card[_ngcontent-%COMP%] { background: #fff; border: 1px solid rgba(0, 0, 0, 0.06); border-radius: 12px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04); }\n    .page-header[_ngcontent-%COMP%] { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }\n    .page-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { margin: 0; color: #1f2937; }\n    .page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0.4rem 0 0; color: #6b7280; }\n    .form-container[_ngcontent-%COMP%] { background: white; padding: 24px; border-radius: 8px; }\n    .form-group[_ngcontent-%COMP%] { margin-bottom: 20px; }\n    .form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] { display: block; margin-bottom: 6px; font-weight: 500; color: #333; }\n    .form-control[_ngcontent-%COMP%] { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box; }\n    .form-control[_ngcontent-%COMP%]:focus { border-color: #2196f3; outline: none; }\n    .permissions-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }\n    .perm-group[_ngcontent-%COMP%] { background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; }\n    .perm-group[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { margin: 0 0 12px 0; font-size: 14px; color: #555; }\n    .checkbox-label[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; cursor: pointer; font-size: 13px; }\n    .form-actions[_ngcontent-%COMP%] { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee; }\n    .btn[_ngcontent-%COMP%] { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }\n    .btn-primary[_ngcontent-%COMP%] { background: #2196f3; color: white; }\n    .btn-primary[_ngcontent-%COMP%]:hover { background: #1976d2; }\n    .btn-primary[_ngcontent-%COMP%]:disabled { background: #ccc; }\n    .btn-outline[_ngcontent-%COMP%] { background: white; border: 1px solid #ddd; color: #333; }\n    .btn-outline[_ngcontent-%COMP%]:hover { background: #f5f5f5; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RoleFormComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-role-form', template: `
    <app-main-layout>
      <app-page-header [title]="isEdit ? 'Edit Role' : 'Create Role'" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Settings', route: '/settings' }, { label: 'Roles', route: '/settings/roles' }, { label: isEdit ? 'Edit' : 'New' }]"></app-page-header>

      <div class="page-card">
        <div class="page-header">
          <div>
            <h2>{{ isEdit ? 'Edit Role' : 'Create Role' }}</h2>
            <p>{{ isEdit ? 'Update the permission set for this role.' : 'Create a new permission set for your users.' }}</p>
          </div>
          <button class="btn btn-outline" (click)="goBack()">Back to Roles</button>
        </div>

        <form (ngSubmit)="save()" class="form-container">
          <div class="form-group">
            <label>Role Name *</label>
            <input type="text" class="form-control" [(ngModel)]="role.name" name="name" required placeholder="e.g. Doctor, Nurse, Admin">
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" [(ngModel)]="role.description" name="description" rows="3" placeholder="Brief description of this role"></textarea>
          </div>

          <div class="form-group">
            <label>Permissions</label>
            <div class="permissions-grid">
              <div *ngFor="let perm of permissionGroups" class="perm-group">
                <h4>{{ perm.group }}</h4>
                <label *ngFor="let p of perm.items" class="checkbox-label">
                  <input type="checkbox" [checked]="isPermSelected(p.key)" (change)="togglePerm(p.key)">
                  {{ p.label }}
                </label>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="saving">
              {{ saving ? 'Saving...' : (isEdit ? 'Update Role' : 'Create Role') }}
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `, styles: ["\n    .page-card { background: #fff; border: 1px solid rgba(0, 0, 0, 0.06); border-radius: 12px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04); }\n    .page-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }\n    .page-header h2 { margin: 0; color: #1f2937; }\n    .page-header p { margin: 0.4rem 0 0; color: #6b7280; }\n    .form-container { background: white; padding: 24px; border-radius: 8px; }\n    .form-group { margin-bottom: 20px; }\n    .form-group label { display: block; margin-bottom: 6px; font-weight: 500; color: #333; }\n    .form-control { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box; }\n    .form-control:focus { border-color: #2196f3; outline: none; }\n    .permissions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }\n    .perm-group { background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; }\n    .perm-group h4 { margin: 0 0 12px 0; font-size: 14px; color: #555; }\n    .checkbox-label { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; cursor: pointer; font-size: 13px; }\n    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee; }\n    .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }\n    .btn-primary { background: #2196f3; color: white; }\n    .btn-primary:hover { background: #1976d2; }\n    .btn-primary:disabled { background: #ccc; }\n    .btn-outline { background: white; border: 1px solid #ddd; color: #333; }\n    .btn-outline:hover { background: #f5f5f5; }\n  "] }]
    }], () => [{ type: i1.ApiService }, { type: i2.Router }, { type: i2.ActivatedRoute }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(RoleFormComponent, { className: "RoleFormComponent", filePath: "app/features/settings/roles/role-form.component.ts", lineNumber: 78 }); })();
//# sourceMappingURL=role-form.component.js.map