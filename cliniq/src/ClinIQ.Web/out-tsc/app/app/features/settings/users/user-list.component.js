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
const _c2 = () => ({ label: "Users" });
const _c3 = (a0, a1, a2) => [a0, a1, a2];
function UserListComponent_tr_33_span_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 21);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const role_r2 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(role_r2);
} }
function UserListComponent_tr_33_span_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 22);
    i0.ɵɵtext(1, "No roles");
    i0.ɵɵelementEnd();
} }
function UserListComponent_tr_33_Template(rf, ctx) { if (rf & 1) {
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
    i0.ɵɵelementStart(7, "td");
    i0.ɵɵtemplate(8, UserListComponent_tr_33_span_8_Template, 2, 1, "span", 11)(9, UserListComponent_tr_33_span_9_Template, 2, 0, "span", 12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "td")(11, "span", 13);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "td");
    i0.ɵɵtext(14);
    i0.ɵɵpipe(15, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "td", 14)(17, "button", 15);
    i0.ɵɵlistener("click", function UserListComponent_tr_33_Template_button_click_17_listener() { const user_r3 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.editUser(user_r3.id)); });
    i0.ɵɵelement(18, "i", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "button", 17);
    i0.ɵɵlistener("click", function UserListComponent_tr_33_Template_button_click_19_listener() { const user_r3 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.resetPassword(user_r3.id)); });
    i0.ɵɵelement(20, "i", 18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "button", 19);
    i0.ɵɵlistener("click", function UserListComponent_tr_33_Template_button_click_21_listener() { const user_r3 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.deleteUser(user_r3.id)); });
    i0.ɵɵelement(22, "i", 20);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const user_r3 = ctx.$implicit;
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(user_r3.fullName || ((user_r3.firstName || "") + " " + (user_r3.lastName || "")).trim() || "Unknown User");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(user_r3.email);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(user_r3.phoneNumber || user_r3.phone || "N/A");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngForOf", ctx_r3.getUserRoles(user_r3));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r3.getUserRoles(user_r3).length);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("badge-success", user_r3.isActive)("badge-danger", !user_r3.isActive);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", user_r3.isActive ? "Active" : "Inactive", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(user_r3.lastLoginAt ? i0.ɵɵpipeBind2(15, 11, user_r3.lastLoginAt, "short") : "Never");
} }
function UserListComponent_div_34_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 23)(1, "button", 24);
    i0.ɵɵlistener("click", function UserListComponent_div_34_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r5); const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.goToPage(ctx_r3.currentPage - 1)); });
    i0.ɵɵtext(2, "Previous");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 24);
    i0.ɵɵlistener("click", function UserListComponent_div_34_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r5); const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.goToPage(ctx_r3.currentPage + 1)); });
    i0.ɵɵtext(6, "Next");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r3.currentPage === 1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate2("Page ", ctx_r3.currentPage, " of ", ctx_r3.totalPages, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r3.currentPage === ctx_r3.totalPages);
} }
export class UserListComponent {
    constructor(api, router) {
        this.api = api;
        this.router = router;
        this.users = [];
        this.searchTerm = '';
        this.currentPage = 1;
        this.totalPages = 1;
    }
    ngOnInit() {
        this.loadUsers();
    }
    getUserRoles(user) {
        if (Array.isArray(user?.roles)) {
            return user.roles.map((role) => typeof role === 'string' ? role : (role?.name || role?.roleName || 'Role'));
        }
        const roleIds = Array.isArray(user?.roleIds) ? user.roleIds : [];
        return roleIds.map((role) => typeof role === 'string' ? role : (role?.name || role?.roleName || 'Role'));
    }
    loadUsers() {
        this.api.get('v1/users', { pageNumber: this.currentPage, searchTerm: this.searchTerm }).subscribe({
            next: (res) => {
                this.users = res.items || [];
                this.totalPages = res.totalPages || 1;
            },
            error: (err) => console.error('Failed to load users', err)
        });
    }
    addUser() {
        this.router.navigate(['/settings/users/new']);
    }
    editUser(id) {
        this.router.navigate(['/settings/users/edit', id]);
    }
    resetPassword(id) {
        if (confirm('Reset password to ChangeMe@123?')) {
            this.api.post(`v1/users/${id}/reset-password`, {}).subscribe({
                next: () => alert('Password reset successfully'),
                error: () => alert('Failed to reset password')
            });
        }
    }
    deleteUser(id) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.api.delete('v1/users', id).subscribe({
                next: () => this.loadUsers(),
                error: () => alert('Failed to delete user')
            });
        }
    }
    goToPage(page) {
        this.currentPage = page;
        this.loadUsers();
    }
    static { this.ɵfac = function UserListComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || UserListComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.Router)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: UserListComponent, selectors: [["app-user-list"]], standalone: false, decls: 35, vars: 11, consts: [["title", "Users", 3, "breadcrumbs"], [1, "page-card"], [1, "page-header"], [1, "btn", "btn-primary", 3, "click"], [1, "fas", "fa-plus"], [1, "filters"], ["type", "text", "placeholder", "Search users...", 1, "form-control", 3, "ngModelChange", "input", "ngModel"], [1, "table-container"], [1, "data-table"], [4, "ngFor", "ngForOf"], ["class", "pagination", 4, "ngIf"], ["class", "badge badge-info", 4, "ngFor", "ngForOf"], ["class", "badge badge-muted", 4, "ngIf"], [1, "badge"], [1, "actions"], ["title", "Edit", 1, "btn", "btn-sm", "btn-outline", 3, "click"], [1, "fas", "fa-edit"], ["title", "Reset Password", 1, "btn", "btn-sm", "btn-outline", 3, "click"], [1, "fas", "fa-key"], ["title", "Delete", 1, "btn", "btn-sm", "btn-outline-danger", 3, "click"], [1, "fas", "fa-trash"], [1, "badge", "badge-info"], [1, "badge", "badge-muted"], [1, "pagination"], [1, "btn", "btn-sm", 3, "click", "disabled"]], template: function UserListComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1)(3, "div", 2)(4, "div")(5, "h2");
            i0.ɵɵtext(6, "Users Management");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p");
            i0.ɵɵtext(8, "Manage user accounts, access rights, and account status.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "button", 3);
            i0.ɵɵlistener("click", function UserListComponent_Template_button_click_9_listener() { return ctx.addUser(); });
            i0.ɵɵelement(10, "i", 4);
            i0.ɵɵtext(11, " Add User ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(12, "div", 5)(13, "input", 6);
            i0.ɵɵtwoWayListener("ngModelChange", function UserListComponent_Template_input_ngModelChange_13_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.searchTerm, $event) || (ctx.searchTerm = $event); return $event; });
            i0.ɵɵlistener("input", function UserListComponent_Template_input_input_13_listener() { return ctx.loadUsers(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(14, "div", 7)(15, "table", 8)(16, "thead")(17, "tr")(18, "th");
            i0.ɵɵtext(19, "Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "th");
            i0.ɵɵtext(21, "Email");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "th");
            i0.ɵɵtext(23, "Phone");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "th");
            i0.ɵɵtext(25, "Roles");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "th");
            i0.ɵɵtext(27, "Status");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "th");
            i0.ɵɵtext(29, "Last Login");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "th");
            i0.ɵɵtext(31, "Actions");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(32, "tbody");
            i0.ɵɵtemplate(33, UserListComponent_tr_33_Template, 23, 14, "tr", 9);
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(34, UserListComponent_div_34_Template, 7, 4, "div", 10);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction3(7, _c3, i0.ɵɵpureFunction0(4, _c0), i0.ɵɵpureFunction0(5, _c1), i0.ɵɵpureFunction0(6, _c2)));
            i0.ɵɵadvance(12);
            i0.ɵɵtwoWayProperty("ngModel", ctx.searchTerm);
            i0.ɵɵadvance(20);
            i0.ɵɵproperty("ngForOf", ctx.users);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.totalPages > 1);
        } }, dependencies: [i3.NgForOf, i3.NgIf, i4.DefaultValueAccessor, i4.NgControlStatus, i4.NgModel, i5.PageHeaderComponent, i6.MainLayoutComponent, i3.DatePipe], styles: [".page-card[_ngcontent-%COMP%] { background: #fff; border: 1px solid rgba(0, 0, 0, 0.06); border-radius: 12px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04); }\n    .page-header[_ngcontent-%COMP%] { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }\n    .page-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { margin: 0; color: #1f2937; }\n    .page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0.4rem 0 0; color: #6b7280; }\n    .filters[_ngcontent-%COMP%] { margin-bottom: 20px; }\n    .filters[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] { width: 300px; }\n    .table-container[_ngcontent-%COMP%] { overflow-x: auto; }\n    .data-table[_ngcontent-%COMP%] { width: 100%; border-collapse: collapse; }\n    .data-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .data-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }\n    .data-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] { background: #f8fafc; font-weight: 600; }\n    .data-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover { background: #f9fafb; }\n    .badge[_ngcontent-%COMP%] { padding: 4px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; margin-right: 4px; display: inline-block; }\n    .badge-info[_ngcontent-%COMP%] { background: #dbeafe; color: #1d4ed8; }\n    .badge-muted[_ngcontent-%COMP%] { background: #e5e7eb; color: #4b5563; }\n    .badge-success[_ngcontent-%COMP%] { background: #dcfce7; color: #166534; }\n    .badge-danger[_ngcontent-%COMP%] { background: #fee2e2; color: #991b1b; }\n    .actions[_ngcontent-%COMP%] { white-space: nowrap; }\n    .actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] { margin-right: 4px; }\n    .pagination[_ngcontent-%COMP%] { display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 20px; }\n    .btn[_ngcontent-%COMP%] { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }\n    .btn-primary[_ngcontent-%COMP%] { background: #2196f3; color: white; }\n    .btn-primary[_ngcontent-%COMP%]:hover { background: #1976d2; }\n    .btn-outline[_ngcontent-%COMP%] { background: white; border: 1px solid #ddd; color: #333; }\n    .btn-outline[_ngcontent-%COMP%]:hover { background: #f5f5f5; }\n    .btn-outline-danger[_ngcontent-%COMP%] { background: white; border: 1px solid #f44336; color: #f44336; }\n    .btn-outline-danger[_ngcontent-%COMP%]:hover { background: #ffebee; }\n    .btn[_ngcontent-%COMP%]:disabled { opacity: 0.5; cursor: not-allowed; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(UserListComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-user-list', template: `
    <app-main-layout>
      <app-page-header title="Users" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Settings', route: '/settings' }, { label: 'Users' }]"></app-page-header>

      <div class="page-card">
        <div class="page-header">
          <div>
            <h2>Users Management</h2>
            <p>Manage user accounts, access rights, and account status.</p>
          </div>
          <button class="btn btn-primary" (click)="addUser()">
            <i class="fas fa-plus"></i> Add User
          </button>
        </div>

        <div class="filters">
          <input type="text"
                 class="form-control"
                 placeholder="Search users..."
                 [(ngModel)]="searchTerm"
                 (input)="loadUsers()">
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Roles</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>{{ user.fullName || ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || 'Unknown User' }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phoneNumber || user.phone || 'N/A' }}</td>
                <td>
                  <span *ngFor="let role of getUserRoles(user)" class="badge badge-info">{{ role }}</span>
                  <span *ngIf="!getUserRoles(user).length" class="badge badge-muted">No roles</span>
                </td>
                <td>
                  <span class="badge" [class.badge-success]="user.isActive" [class.badge-danger]="!user.isActive">
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>{{ user.lastLoginAt ? (user.lastLoginAt | date:'short') : 'Never' }}</td>
                <td class="actions">
                  <button class="btn btn-sm btn-outline" (click)="editUser(user.id)" title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline" (click)="resetPassword(user.id)" title="Reset Password">
                    <i class="fas fa-key"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" (click)="deleteUser(user.id)" title="Delete">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination" *ngIf="totalPages > 1">
          <button class="btn btn-sm" [disabled]="currentPage === 1" (click)="goToPage(currentPage - 1)">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="btn btn-sm" [disabled]="currentPage === totalPages" (click)="goToPage(currentPage + 1)">Next</button>
        </div>
      </div>
    </app-main-layout>
  `, styles: ["\n    .page-card { background: #fff; border: 1px solid rgba(0, 0, 0, 0.06); border-radius: 12px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04); }\n    .page-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }\n    .page-header h2 { margin: 0; color: #1f2937; }\n    .page-header p { margin: 0.4rem 0 0; color: #6b7280; }\n    .filters { margin-bottom: 20px; }\n    .filters input { width: 300px; }\n    .table-container { overflow-x: auto; }\n    .data-table { width: 100%; border-collapse: collapse; }\n    .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }\n    .data-table th { background: #f8fafc; font-weight: 600; }\n    .data-table tr:hover { background: #f9fafb; }\n    .badge { padding: 4px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; margin-right: 4px; display: inline-block; }\n    .badge-info { background: #dbeafe; color: #1d4ed8; }\n    .badge-muted { background: #e5e7eb; color: #4b5563; }\n    .badge-success { background: #dcfce7; color: #166534; }\n    .badge-danger { background: #fee2e2; color: #991b1b; }\n    .actions { white-space: nowrap; }\n    .actions button { margin-right: 4px; }\n    .pagination { display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 20px; }\n    .btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }\n    .btn-primary { background: #2196f3; color: white; }\n    .btn-primary:hover { background: #1976d2; }\n    .btn-outline { background: white; border: 1px solid #ddd; color: #333; }\n    .btn-outline:hover { background: #f5f5f5; }\n    .btn-outline-danger { background: white; border: 1px solid #f44336; color: #f44336; }\n    .btn-outline-danger:hover { background: #ffebee; }\n    .btn:disabled { opacity: 0.5; cursor: not-allowed; }\n  "] }]
    }], () => [{ type: i1.ApiService }, { type: i2.Router }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(UserListComponent, { className: "UserListComponent", filePath: "app/features/settings/users/user-list.component.ts", lineNumber: 113 }); })();
//# sourceMappingURL=user-list.component.js.map