import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/router";
import * as i3 from "@angular/common";
import * as i4 from "../../../shared/components/page-header/page-header.component";
import * as i5 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Settings", route: "/settings" });
const _c2 = () => ({ label: "Roles" });
const _c3 = (a0, a1, a2) => [a0, a1, a2];
function RoleListComponent_tr_27_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td")(8, "span", 8);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "td", 9)(11, "button", 10);
    i0.ɵɵlistener("click", function RoleListComponent_tr_27_Template_button_click_11_listener() { const role_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.editRole(role_r2.id)); });
    i0.ɵɵelement(12, "i", 11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "button", 12);
    i0.ɵɵlistener("click", function RoleListComponent_tr_27_Template_button_click_13_listener() { const role_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.deleteRole(role_r2.id)); });
    i0.ɵɵelement(14, "i", 13);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const role_r2 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(role_r2.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(role_r2.description || "N/A");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(role_r2.userCount || role_r2.usersCount || 0);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("badge-warning", role_r2.isSystemRole)("badge-info", !role_r2.isSystemRole);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", role_r2.isSystemRole ? "System" : "Custom", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", role_r2.isSystemRole);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", role_r2.isSystemRole);
} }
export class RoleListComponent {
    constructor(api, router) {
        this.api = api;
        this.router = router;
        this.roles = [];
    }
    ngOnInit() {
        this.loadRoles();
    }
    loadRoles() {
        this.api.get('v1/roles').subscribe({
            next: (res) => {
                this.roles = Array.isArray(res) ? res : [];
            },
            error: (err) => console.error('Failed to load roles', err)
        });
    }
    addRole() {
        this.router.navigate(['/settings/roles/new']);
    }
    editRole(id) {
        this.router.navigate(['/settings/roles/edit', id]);
    }
    deleteRole(id) {
        if (confirm('Are you sure you want to delete this role?')) {
            this.api.delete('v1/roles', id).subscribe({
                next: () => this.loadRoles(),
                error: () => alert('Failed to delete role')
            });
        }
    }
    static { this.ɵfac = function RoleListComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RoleListComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.Router)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: RoleListComponent, selectors: [["app-role-list"]], standalone: false, decls: 28, vars: 9, consts: [["title", "Roles", 3, "breadcrumbs"], [1, "page-card"], [1, "page-header"], [1, "btn", "btn-primary", 3, "click"], [1, "fas", "fa-plus"], [1, "table-container"], [1, "data-table"], [4, "ngFor", "ngForOf"], [1, "badge"], [1, "actions"], ["title", "Edit", 1, "btn", "btn-sm", "btn-outline", 3, "click", "disabled"], [1, "fas", "fa-edit"], ["title", "Delete", 1, "btn", "btn-sm", "btn-outline-danger", 3, "click", "disabled"], [1, "fas", "fa-trash"]], template: function RoleListComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1)(3, "div", 2)(4, "div")(5, "h2");
            i0.ɵɵtext(6, "Roles Management");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p");
            i0.ɵɵtext(8, "Define permission sets and control access across the application.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "button", 3);
            i0.ɵɵlistener("click", function RoleListComponent_Template_button_click_9_listener() { return ctx.addRole(); });
            i0.ɵɵelement(10, "i", 4);
            i0.ɵɵtext(11, " Add Role ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(12, "div", 5)(13, "table", 6)(14, "thead")(15, "tr")(16, "th");
            i0.ɵɵtext(17, "Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "th");
            i0.ɵɵtext(19, "Description");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "th");
            i0.ɵɵtext(21, "Users");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "th");
            i0.ɵɵtext(23, "Type");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "th");
            i0.ɵɵtext(25, "Actions");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(26, "tbody");
            i0.ɵɵtemplate(27, RoleListComponent_tr_27_Template, 15, 10, "tr", 7);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction3(5, _c3, i0.ɵɵpureFunction0(2, _c0), i0.ɵɵpureFunction0(3, _c1), i0.ɵɵpureFunction0(4, _c2)));
            i0.ɵɵadvance(26);
            i0.ɵɵproperty("ngForOf", ctx.roles);
        } }, dependencies: [i3.NgForOf, i4.PageHeaderComponent, i5.MainLayoutComponent], styles: [".page-card[_ngcontent-%COMP%] { background: #fff; border: 1px solid rgba(0, 0, 0, 0.06); border-radius: 12px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04); }\n    .page-header[_ngcontent-%COMP%] { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }\n    .page-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { margin: 0; color: #1f2937; }\n    .page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0.4rem 0 0; color: #6b7280; }\n    .table-container[_ngcontent-%COMP%] { overflow-x: auto; }\n    .data-table[_ngcontent-%COMP%] { width: 100%; border-collapse: collapse; background: white; }\n    .data-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .data-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] { padding: 12px 16px; text-align: left; border-bottom: 1px solid #eee; }\n    .data-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] { background: #f8fafc; font-weight: 600; }\n    .data-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover { background: #f9fafb; }\n    .badge[_ngcontent-%COMP%] { padding: 4px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }\n    .badge-info[_ngcontent-%COMP%] { background: #dbeafe; color: #1d4ed8; }\n    .badge-warning[_ngcontent-%COMP%] { background: #fef3c7; color: #92400e; }\n    .actions[_ngcontent-%COMP%] { white-space: nowrap; }\n    .actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] { margin-right: 4px; }\n    .btn[_ngcontent-%COMP%] { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }\n    .btn-primary[_ngcontent-%COMP%] { background: #2196f3; color: white; }\n    .btn-primary[_ngcontent-%COMP%]:hover { background: #1976d2; }\n    .btn-outline[_ngcontent-%COMP%] { background: white; border: 1px solid #ddd; color: #333; }\n    .btn-outline[_ngcontent-%COMP%]:hover { background: #f5f5f5; }\n    .btn-outline-danger[_ngcontent-%COMP%] { background: white; border: 1px solid #f44336; color: #f44336; }\n    .btn-outline-danger[_ngcontent-%COMP%]:hover { background: #ffebee; }\n    .btn[_ngcontent-%COMP%]:disabled { opacity: 0.5; cursor: not-allowed; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RoleListComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-role-list', template: `
    <app-main-layout>
      <app-page-header title="Roles" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Settings', route: '/settings' }, { label: 'Roles' }]"></app-page-header>

      <div class="page-card">
        <div class="page-header">
          <div>
            <h2>Roles Management</h2>
            <p>Define permission sets and control access across the application.</p>
          </div>
          <button class="btn btn-primary" (click)="addRole()">
            <i class="fas fa-plus"></i> Add Role
          </button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Users</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let role of roles">
                <td>{{ role.name }}</td>
                <td>{{ role.description || 'N/A' }}</td>
                <td>{{ role.userCount || role.usersCount || 0 }}</td>
                <td>
                  <span class="badge" [class.badge-warning]="role.isSystemRole" [class.badge-info]="!role.isSystemRole">
                    {{ role.isSystemRole ? 'System' : 'Custom' }}
                  </span>
                </td>
                <td class="actions">
                  <button class="btn btn-sm btn-outline" (click)="editRole(role.id)" title="Edit" [disabled]="role.isSystemRole">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" (click)="deleteRole(role.id)" title="Delete" [disabled]="role.isSystemRole">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-main-layout>
  `, styles: ["\n    .page-card { background: #fff; border: 1px solid rgba(0, 0, 0, 0.06); border-radius: 12px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04); }\n    .page-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }\n    .page-header h2 { margin: 0; color: #1f2937; }\n    .page-header p { margin: 0.4rem 0 0; color: #6b7280; }\n    .table-container { overflow-x: auto; }\n    .data-table { width: 100%; border-collapse: collapse; background: white; }\n    .data-table th, .data-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #eee; }\n    .data-table th { background: #f8fafc; font-weight: 600; }\n    .data-table tr:hover { background: #f9fafb; }\n    .badge { padding: 4px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }\n    .badge-info { background: #dbeafe; color: #1d4ed8; }\n    .badge-warning { background: #fef3c7; color: #92400e; }\n    .actions { white-space: nowrap; }\n    .actions button { margin-right: 4px; }\n    .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }\n    .btn-primary { background: #2196f3; color: white; }\n    .btn-primary:hover { background: #1976d2; }\n    .btn-outline { background: white; border: 1px solid #ddd; color: #333; }\n    .btn-outline:hover { background: #f5f5f5; }\n    .btn-outline-danger { background: white; border: 1px solid #f44336; color: #f44336; }\n    .btn-outline-danger:hover { background: #ffebee; }\n    .btn:disabled { opacity: 0.5; cursor: not-allowed; }\n  "] }]
    }], () => [{ type: i1.ApiService }, { type: i2.Router }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(RoleListComponent, { className: "RoleListComponent", filePath: "app/features/settings/roles/role-list.component.ts", lineNumber: 84 }); })();
//# sourceMappingURL=role-list.component.js.map