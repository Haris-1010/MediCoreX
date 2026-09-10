import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@angular/material/input";
import * as i3 from "@angular/material/datepicker";
export class DateRangePickerComponent {
    constructor() {
        this.label = 'Date Range';
        this.startPlaceholder = 'Start date';
        this.endPlaceholder = 'End date';
        this.rangeChange = new EventEmitter();
        this.range = new FormGroup({
            start: new FormControl(null),
            end: new FormControl(null)
        });
    }
    ngOnInit() {
        this.range.valueChanges.subscribe(value => {
            if (value.start && value.end) {
                this.rangeChange.emit({
                    start: value.start,
                    end: value.end
                });
            }
        });
    }
    setValue(start, end) {
        this.range.setValue({ start, end });
    }
    clear() {
        this.range.reset();
    }
    static { this.ɵfac = function DateRangePickerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DateRangePickerComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DateRangePickerComponent, selectors: [["app-date-range-picker"]], inputs: { label: "label", startPlaceholder: "startPlaceholder", endPlaceholder: "endPlaceholder" }, outputs: { rangeChange: "rangeChange" }, standalone: false, decls: 9, vars: 6, consts: [["picker", ""], ["appearance", "outline", 1, "date-range-field"], [3, "formGroup", "rangePicker"], ["matStartDate", "", "formControlName", "start", 3, "placeholder"], ["matEndDate", "", "formControlName", "end", 3, "placeholder"], ["matIconSuffix", "", 3, "for"]], template: function DateRangePickerComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "mat-form-field", 1)(1, "mat-label");
            i0.ɵɵtext(2);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "mat-date-range-input", 2);
            i0.ɵɵelement(4, "input", 3)(5, "input", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelement(6, "mat-datepicker-toggle", 5)(7, "mat-date-range-picker", null, 0);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            const picker_r1 = i0.ɵɵreference(8);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.label);
            i0.ɵɵadvance();
            i0.ɵɵproperty("formGroup", ctx.range)("rangePicker", picker_r1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("placeholder", ctx.startPlaceholder);
            i0.ɵɵadvance();
            i0.ɵɵproperty("placeholder", ctx.endPlaceholder);
            i0.ɵɵadvance();
            i0.ɵɵproperty("for", picker_r1);
        } }, dependencies: [i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i2.MatFormField, i2.MatLabel, i2.MatSuffix, i3.MatDatepickerToggle, i3.MatDateRangeInput, i3.MatStartDate, i3.MatEndDate, i3.MatDateRangePicker], styles: [".date-range-field[_ngcontent-%COMP%] {\n      width: 100%;\n      max-width: 300px;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DateRangePickerComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-date-range-picker', template: `
    <mat-form-field appearance="outline" class="date-range-field">
      <mat-label>{{ label }}</mat-label>
      <mat-date-range-input [formGroup]="range" [rangePicker]="picker">
        <input matStartDate formControlName="start" [placeholder]="startPlaceholder">
        <input matEndDate formControlName="end" [placeholder]="endPlaceholder">
      </mat-date-range-input>
      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-date-range-picker #picker></mat-date-range-picker>
    </mat-form-field>
  `, styles: ["\n    .date-range-field {\n      width: 100%;\n      max-width: 300px;\n    }\n  "] }]
    }], null, { label: [{
            type: Input
        }], startPlaceholder: [{
            type: Input
        }], endPlaceholder: [{
            type: Input
        }], rangeChange: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DateRangePickerComponent, { className: "DateRangePickerComponent", filePath: "app/shared/components/date-range-picker/date-range-picker.component.ts", lineNumber: 30 }); })();
//# sourceMappingURL=date-range-picker.component.js.map