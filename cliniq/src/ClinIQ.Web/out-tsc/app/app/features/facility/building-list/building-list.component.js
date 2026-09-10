import { Component } from '@angular/core';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/router";
import * as i3 from "@angular/material/dialog";
import * as i4 from "../../../core/services/notification.service";
import * as i5 from "@angular/common";
import * as i6 from "@angular/forms";
import * as i7 from "@angular/material/button";
import * as i8 from "@angular/material/icon";
import * as i9 from "@angular/material/input";
import * as i10 from "@angular/material/menu";
import * as i11 from "@angular/material/progress-spinner";
import * as i12 from "../../../shared/components/page-header/page-header.component";
import * as i13 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Facility", route: "/facility" });
const _c1 = () => ({ label: "Buildings" });
const _c2 = (a0, a1) => [a0, a1];
function BuildingListComponent_div_6_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 8)(1, "h3");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 9)(4, "mat-form-field", 10)(5, "mat-label");
    i0.ɵɵtext(6, "Name *");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "input", 11);
    i0.ɵɵtwoWayListener("ngModelChange", function BuildingListComponent_div_6_Template_input_ngModelChange_7_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.formData.name, $event) || (ctx_r1.formData.name = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "mat-form-field", 10)(9, "mat-label");
    i0.ɵɵtext(10, "Code");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "input", 11);
    i0.ɵɵtwoWayListener("ngModelChange", function BuildingListComponent_div_6_Template_input_ngModelChange_11_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.formData.code, $event) || (ctx_r1.formData.code = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "mat-form-field", 10)(13, "mat-label");
    i0.ɵɵtext(14, "Floors");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "input", 12);
    i0.ɵɵtwoWayListener("ngModelChange", function BuildingListComponent_div_6_Template_input_ngModelChange_15_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.formData.numberOfFloors, $event) || (ctx_r1.formData.numberOfFloors = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(16, "mat-form-field", 13)(17, "mat-label");
    i0.ɵɵtext(18, "Description");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "textarea", 14);
    i0.ɵɵtwoWayListener("ngModelChange", function BuildingListComponent_div_6_Template_textarea_ngModelChange_19_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.formData.description, $event) || (ctx_r1.formData.description = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "mat-form-field", 13)(21, "mat-label");
    i0.ɵɵtext(22, "Address");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "input", 11);
    i0.ɵɵtwoWayListener("ngModelChange", function BuildingListComponent_div_6_Template_input_ngModelChange_23_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.formData.address, $event) || (ctx_r1.formData.address = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "div", 15)(25, "button", 16);
    i0.ɵɵlistener("click", function BuildingListComponent_div_6_Template_button_click_25_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.cancelCreate()); });
    i0.ɵɵtext(26, "Cancel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "button", 17);
    i0.ɵɵlistener("click", function BuildingListComponent_div_6_Template_button_click_27_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.saveBuilding()); });
    i0.ɵɵtext(28);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r1.editId ? "Edit" : "New", " Building");
    i0.ɵɵadvance(5);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.formData.name);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.formData.code);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.formData.numberOfFloors);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.formData.description);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.formData.address);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", !ctx_r1.formData.name);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.editId ? "Update" : "Create");
} }
function BuildingListComponent_div_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 18);
    i0.ɵɵelement(1, "mat-spinner", 19);
    i0.ɵɵelementEnd();
} }
function BuildingListComponent_div_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 20)(1, "mat-icon", 21);
    i0.ɵɵtext(2, "apartment");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h3");
    i0.ɵɵtext(4, "No Buildings");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6, "Add your first building to start managing facilities.");
    i0.ɵɵelementEnd()();
} }
function BuildingListComponent_div_10_div_1_p_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const b_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(b_r4.description);
} }
function BuildingListComponent_div_10_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 24)(1, "div", 25)(2, "div", 26);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 27)(5, "h3");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "span");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "button", 28)(10, "mat-icon");
    i0.ɵɵtext(11, "more_vert");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "mat-menu", null, 0)(14, "button", 29);
    i0.ɵɵlistener("click", function BuildingListComponent_div_10_div_1_Template_button_click_14_listener() { const b_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.editBuilding(b_r4)); });
    i0.ɵɵelementStart(15, "mat-icon");
    i0.ɵɵtext(16, "edit");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(17, " Edit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "button", 29);
    i0.ɵɵlistener("click", function BuildingListComponent_div_10_div_1_Template_button_click_18_listener() { const b_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.deleteBuilding(b_r4)); });
    i0.ɵɵelementStart(19, "mat-icon", 30);
    i0.ɵɵtext(20, "delete");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(21, " Delete");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(22, BuildingListComponent_div_10_div_1_p_22_Template, 2, 1, "p", 31);
    i0.ɵɵelementStart(23, "div", 32)(24, "span")(25, "mat-icon");
    i0.ɵɵtext(26, "layers");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "span")(29, "mat-icon");
    i0.ɵɵtext(30, "bed");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(31);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const b_r4 = ctx.$implicit;
    const menu_r5 = i0.ɵɵreference(13);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(b_r4.name.charAt(0));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(b_r4.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(b_r4.code || "\u2014");
    i0.ɵɵadvance();
    i0.ɵɵproperty("matMenuTriggerFor", menu_r5);
    i0.ɵɵadvance(13);
    i0.ɵɵproperty("ngIf", b_r4.description);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", b_r4.floorCount, " Floors");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", b_r4.bedCount, " Beds");
} }
function BuildingListComponent_div_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 22);
    i0.ɵɵtemplate(1, BuildingListComponent_div_10_div_1_Template, 32, 7, "div", 23);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.buildings);
} }
export class BuildingListComponent {
    constructor(api, router, dialog, notification) {
        this.api = api;
        this.router = router;
        this.dialog = dialog;
        this.notification = notification;
        this.buildings = [];
        this.loading = false;
        this.showCreate = false;
        this.editId = null;
        this.formData = { name: '', code: '', description: '', address: '', numberOfFloors: 1 };
    }
    ngOnInit() { this.load(); }
    load() {
        this.loading = true;
        this.api.get('v1/facility/buildings').subscribe({
            next: (data) => { this.buildings = data; this.loading = false; },
            error: () => { this.loading = false; this.notification.error('Failed to load buildings'); }
        });
    }
    saveBuilding() {
        if (!this.formData.name)
            return;
        const req = this.editId
            ? this.api.put('v1/facility/buildings', this.editId, this.formData)
            : this.api.post('v1/facility/buildings', this.formData);
        req.subscribe({
            next: () => { this.notification.success(this.editId ? 'Building updated' : 'Building created'); this.cancelCreate(); this.load(); },
            error: () => { this.notification.error('Failed to save building'); }
        });
    }
    editBuilding(b) {
        this.editId = b.id;
        this.formData = { name: b.name, code: b.code, description: b.description, address: b.address, numberOfFloors: b.numberOfFloors };
        this.showCreate = true;
    }
    cancelCreate() {
        this.showCreate = false;
        this.editId = null;
        this.formData = { name: '', code: '', description: '', address: '', numberOfFloors: 1 };
    }
    deleteBuilding(b) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { title: 'Delete Building', message: `Delete "${b.name}"?`, confirmText: 'Delete', cancelText: 'Cancel' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.api.delete('v1/facility/buildings', b.id).subscribe({
                    next: () => { this.notification.success('Building deleted'); this.load(); },
                    error: () => { this.notification.error('Failed to delete building'); }
                });
            }
        });
    }
    static { this.ɵfac = function BuildingListComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BuildingListComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.Router), i0.ɵɵdirectiveInject(i3.MatDialog), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: BuildingListComponent, selectors: [["app-building-list"]], standalone: false, decls: 11, vars: 10, consts: [["menu", "matMenu"], ["title", "Buildings", 3, "breadcrumbs"], ["mat-raised-button", "", "color", "primary", 3, "click"], ["class", "card create-form", 4, "ngIf"], [1, "card"], ["class", "loading-container", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], ["class", "building-grid", 4, "ngIf"], [1, "card", "create-form"], [1, "form-row"], ["appearance", "outline"], ["matInput", "", 3, "ngModelChange", "ngModel"], ["matInput", "", "type", "number", 3, "ngModelChange", "ngModel"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "rows", "2", 3, "ngModelChange", "ngModel"], [1, "form-actions"], ["mat-stroked-button", "", 3, "click"], ["mat-raised-button", "", "color", "primary", 3, "click", "disabled"], [1, "loading-container"], ["diameter", "40"], [1, "empty-state"], [1, "empty-icon"], [1, "building-grid"], ["class", "building-card", 4, "ngFor", "ngForOf"], [1, "building-card"], [1, "building-header"], [1, "building-avatar"], [1, "building-info"], ["mat-icon-button", "", 3, "matMenuTriggerFor"], ["mat-menu-item", "", 3, "click"], ["color", "warn"], ["class", "desc", 4, "ngIf"], [1, "building-stats"], [1, "desc"]], template: function BuildingListComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 1)(2, "button", 2);
            i0.ɵɵlistener("click", function BuildingListComponent_Template_button_click_2_listener() { return ctx.showCreate = !ctx.showCreate; });
            i0.ɵɵelementStart(3, "mat-icon");
            i0.ɵɵtext(4, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " Add Building ");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(6, BuildingListComponent_div_6_Template, 29, 8, "div", 3);
            i0.ɵɵelementStart(7, "div", 4);
            i0.ɵɵtemplate(8, BuildingListComponent_div_8_Template, 2, 0, "div", 5)(9, BuildingListComponent_div_9_Template, 7, 0, "div", 6)(10, BuildingListComponent_div_10_Template, 2, 1, "div", 7);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(7, _c2, i0.ɵɵpureFunction0(5, _c0), i0.ɵɵpureFunction0(6, _c1)));
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngIf", ctx.showCreate);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.buildings.length === 0);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.buildings.length > 0);
        } }, dependencies: [i5.NgForOf, i5.NgIf, i6.DefaultValueAccessor, i6.NumberValueAccessor, i6.NgControlStatus, i6.NgModel, i7.MatButton, i7.MatIconButton, i8.MatIcon, i9.MatInput, i9.MatFormField, i9.MatLabel, i10.MatMenu, i10.MatMenuItem, i10.MatMenuTrigger, i11.MatProgressSpinner, i12.PageHeaderComponent, i13.MainLayoutComponent], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; margin-top: 1rem; }\n    .create-form[_ngcontent-%COMP%] { margin-bottom: 1rem; }\n    .create-form[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 1rem; }\n    .form-row[_ngcontent-%COMP%] { display: flex; gap: 1rem; flex-wrap: wrap; }\n    .form-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] { flex: 1; min-width: 150px; }\n    .full-width[_ngcontent-%COMP%] { width: 100%; }\n    .form-actions[_ngcontent-%COMP%] { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 0.5rem; }\n    .loading-container[_ngcontent-%COMP%] { display: flex; justify-content: center; padding: 3rem; }\n    .empty-state[_ngcontent-%COMP%] { text-align: center; padding: 3rem; color: #666; }\n    .empty-icon[_ngcontent-%COMP%] { font-size: 48px; width: 48px; height: 48px; color: #ccc; }\n    .building-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }\n    .building-card[_ngcontent-%COMP%] { background: #fafafa; border: 1px solid #eee; border-radius: 10px; padding: 1.25rem; }\n    .building-header[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 0.75rem; }\n    .building-avatar[_ngcontent-%COMP%] { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #0d47a1, #1565c0); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; }\n    .building-info[_ngcontent-%COMP%] { flex: 1; }\n    .building-info[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0; font-size: 1rem; }\n    .building-info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] { font-size: 0.75rem; color: #999; }\n    .desc[_ngcontent-%COMP%] { font-size: 0.85rem; color: #666; margin: 0.75rem 0; }\n    .building-stats[_ngcontent-%COMP%] { display: flex; gap: 1.5rem; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #eee; }\n    .building-stats[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: #666; }\n    .building-stats[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 16px; width: 16px; height: 16px; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BuildingListComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-building-list', template: `
    <app-main-layout>
      <app-page-header title="Buildings" [breadcrumbs]="[{ label: 'Facility', route: '/facility' }, { label: 'Buildings' }]">
        <button mat-raised-button color="primary" (click)="showCreate = !showCreate">
          <mat-icon>add</mat-icon> Add Building
        </button>
      </app-page-header>

      <div *ngIf="showCreate" class="card create-form">
        <h3>{{ editId ? 'Edit' : 'New' }} Building</h3>
        <div class="form-row">
          <mat-form-field appearance="outline"><mat-label>Name *</mat-label><input matInput [(ngModel)]="formData.name"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Code</mat-label><input matInput [(ngModel)]="formData.code"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Floors</mat-label><input matInput type="number" [(ngModel)]="formData.numberOfFloors"></mat-form-field>
        </div>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Description</mat-label><textarea matInput [(ngModel)]="formData.description" rows="2"></textarea></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Address</mat-label><input matInput [(ngModel)]="formData.address"></mat-form-field>
        <div class="form-actions">
          <button mat-stroked-button (click)="cancelCreate()">Cancel</button>
          <button mat-raised-button color="primary" (click)="saveBuilding()" [disabled]="!formData.name">{{ editId ? 'Update' : 'Create' }}</button>
        </div>
      </div>

      <div class="card">
        <div *ngIf="loading" class="loading-container"><mat-spinner diameter="40"></mat-spinner></div>
        <div *ngIf="!loading && buildings.length === 0" class="empty-state">
          <mat-icon class="empty-icon">apartment</mat-icon>
          <h3>No Buildings</h3>
          <p>Add your first building to start managing facilities.</p>
        </div>
        <div class="building-grid" *ngIf="!loading && buildings.length > 0">
          <div class="building-card" *ngFor="let b of buildings">
            <div class="building-header">
              <div class="building-avatar">{{ b.name.charAt(0) }}</div>
              <div class="building-info">
                <h3>{{ b.name }}</h3>
                <span>{{ b.code || '—' }}</span>
              </div>
              <button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="editBuilding(b)"><mat-icon>edit</mat-icon> Edit</button>
                <button mat-menu-item (click)="deleteBuilding(b)"><mat-icon color="warn">delete</mat-icon> Delete</button>
              </mat-menu>
            </div>
            <p class="desc" *ngIf="b.description">{{ b.description }}</p>
            <div class="building-stats">
              <span><mat-icon>layers</mat-icon> {{ b.floorCount }} Floors</span>
              <span><mat-icon>bed</mat-icon> {{ b.bedCount }} Beds</span>
            </div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `, styles: ["\n    .card { background: white; padding: 1.5rem; border-radius: 8px; margin-top: 1rem; }\n    .create-form { margin-bottom: 1rem; }\n    .create-form h3 { margin: 0 0 1rem; }\n    .form-row { display: flex; gap: 1rem; flex-wrap: wrap; }\n    .form-row mat-form-field { flex: 1; min-width: 150px; }\n    .full-width { width: 100%; }\n    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 0.5rem; }\n    .loading-container { display: flex; justify-content: center; padding: 3rem; }\n    .empty-state { text-align: center; padding: 3rem; color: #666; }\n    .empty-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; }\n    .building-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }\n    .building-card { background: #fafafa; border: 1px solid #eee; border-radius: 10px; padding: 1.25rem; }\n    .building-header { display: flex; align-items: center; gap: 0.75rem; }\n    .building-avatar { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #0d47a1, #1565c0); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; }\n    .building-info { flex: 1; }\n    .building-info h3 { margin: 0; font-size: 1rem; }\n    .building-info span { font-size: 0.75rem; color: #999; }\n    .desc { font-size: 0.85rem; color: #666; margin: 0.75rem 0; }\n    .building-stats { display: flex; gap: 1.5rem; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #eee; }\n    .building-stats span { display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: #666; }\n    .building-stats mat-icon { font-size: 16px; width: 16px; height: 16px; }\n  "] }]
    }], () => [{ type: i1.ApiService }, { type: i2.Router }, { type: i3.MatDialog }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(BuildingListComponent, { className: "BuildingListComponent", filePath: "app/features/facility/building-list/building-list.component.ts", lineNumber: 89 }); })();
//# sourceMappingURL=building-list.component.js.map