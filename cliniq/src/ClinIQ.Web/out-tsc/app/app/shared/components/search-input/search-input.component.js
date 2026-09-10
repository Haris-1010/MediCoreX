import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/icon";
import * as i5 from "@angular/material/input";
function SearchInputComponent_button_6_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 4);
    i0.ɵɵlistener("click", function SearchInputComponent_button_6_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.clear()); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "close");
    i0.ɵɵelementEnd()();
} }
export class SearchInputComponent {
    constructor() {
        this.placeholder = 'Search...';
        this.debounceMs = 300;
        this.maxLength = 100;
        this.appearance = 'outline';
        this.initialValue = '';
        this.search = new EventEmitter();
        this.searchControl = new FormControl('');
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        if (this.initialValue) {
            this.searchControl.setValue(this.initialValue);
        }
        this.searchControl.valueChanges.pipe(debounceTime(this.debounceMs), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(value => {
            this.search.emit(value || '');
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    clear() {
        this.searchControl.setValue('');
    }
    static { this.ɵfac = function SearchInputComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SearchInputComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SearchInputComponent, selectors: [["app-search-input"]], inputs: { placeholder: "placeholder", debounceMs: "debounceMs", maxLength: "maxLength", appearance: "appearance", initialValue: "initialValue" }, outputs: { search: "search" }, standalone: false, decls: 7, vars: 5, consts: [[1, "search-field", 3, "appearance"], ["matInput", "", 3, "formControl"], ["matPrefix", ""], ["mat-icon-button", "", "matSuffix", "", 3, "click", 4, "ngIf"], ["mat-icon-button", "", "matSuffix", "", 3, "click"]], template: function SearchInputComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "mat-form-field", 0)(1, "mat-label");
            i0.ɵɵtext(2);
            i0.ɵɵelementEnd();
            i0.ɵɵelement(3, "input", 1);
            i0.ɵɵelementStart(4, "mat-icon", 2);
            i0.ɵɵtext(5, "search");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(6, SearchInputComponent_button_6_Template, 3, 0, "button", 3);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵproperty("appearance", ctx.appearance);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.placeholder);
            i0.ɵɵadvance();
            i0.ɵɵproperty("formControl", ctx.searchControl);
            i0.ɵɵattribute("maxlength", ctx.maxLength);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngIf", ctx.searchControl.value);
        } }, dependencies: [i1.NgIf, i2.DefaultValueAccessor, i2.NgControlStatus, i2.FormControlDirective, i3.MatIconButton, i4.MatIcon, i5.MatInput, i5.MatFormField, i5.MatLabel, i5.MatPrefix, i5.MatSuffix], styles: [".search-field[_ngcontent-%COMP%] {\n      width: 100%;\n      max-width: 300px;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SearchInputComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-search-input', template: `
    <mat-form-field [appearance]="appearance" class="search-field">
      <mat-label>{{ placeholder }}</mat-label>
      <input matInput [formControl]="searchControl" [attr.maxlength]="maxLength">
      <mat-icon matPrefix>search</mat-icon>
      <button mat-icon-button matSuffix *ngIf="searchControl.value" (click)="clear()">
        <mat-icon>close</mat-icon>
      </button>
    </mat-form-field>
  `, styles: ["\n    .search-field {\n      width: 100%;\n      max-width: 300px;\n    }\n  "] }]
    }], null, { placeholder: [{
            type: Input
        }], debounceMs: [{
            type: Input
        }], maxLength: [{
            type: Input
        }], appearance: [{
            type: Input
        }], initialValue: [{
            type: Input
        }], search: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SearchInputComponent, { className: "SearchInputComponent", filePath: "app/shared/components/search-input/search-input.component.ts", lineNumber: 26 }); })();
//# sourceMappingURL=search-input.component.js.map