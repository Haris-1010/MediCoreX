import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
import * as i2 from "@angular/material/button";
export class ConfirmDialogComponent {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onConfirm() {
        this.dialogRef.close(true);
    }
    static { this.ɵfac = function ConfirmDialogComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ConfirmDialogComponent)(i0.ɵɵdirectiveInject(i1.MatDialogRef), i0.ɵɵdirectiveInject(MAT_DIALOG_DATA)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ConfirmDialogComponent, selectors: [["app-confirm-dialog"]], standalone: false, decls: 10, vars: 5, consts: [["mat-dialog-title", ""], ["align", "end"], ["mat-button", "", 3, "click"], ["mat-raised-button", "", 3, "click", "color"]], template: function ConfirmDialogComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "h2", 0);
            i0.ɵɵtext(1);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(2, "mat-dialog-content")(3, "p");
            i0.ɵɵtext(4);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(5, "mat-dialog-actions", 1)(6, "button", 2);
            i0.ɵɵlistener("click", function ConfirmDialogComponent_Template_button_click_6_listener() { return ctx.onCancel(); });
            i0.ɵɵtext(7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "button", 3);
            i0.ɵɵlistener("click", function ConfirmDialogComponent_Template_button_click_8_listener() { return ctx.onConfirm(); });
            i0.ɵɵtext(9);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate(ctx.data.title);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.data.message);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate1(" ", ctx.data.cancelText || "Cancel", " ");
            i0.ɵɵadvance();
            i0.ɵɵproperty("color", ctx.data.confirmColor || "primary");
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.data.confirmText || "Confirm", " ");
        } }, dependencies: [i2.MatButton, i1.MatDialogTitle, i1.MatDialogActions, i1.MatDialogContent], styles: ["mat-dialog-content[_ngcontent-%COMP%] {\n      min-width: 300px;\n    }\n    mat-dialog-actions[_ngcontent-%COMP%] {\n      padding: 16px 0;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ConfirmDialogComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-confirm-dialog', template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        {{ data.cancelText || 'Cancel' }}
      </button>
      <button mat-raised-button [color]="data.confirmColor || 'primary'" (click)="onConfirm()">
        {{ data.confirmText || 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `, styles: ["\n    mat-dialog-content {\n      min-width: 300px;\n    }\n    mat-dialog-actions {\n      padding: 16px 0;\n    }\n  "] }]
    }], () => [{ type: i1.MatDialogRef }, { type: undefined, decorators: [{
                type: Inject,
                args: [MAT_DIALOG_DATA]
            }] }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ConfirmDialogComponent, { className: "ConfirmDialogComponent", filePath: "app/shared/components/confirm-dialog/confirm-dialog.component.ts", lineNumber: 38 }); })();
//# sourceMappingURL=confirm-dialog.component.js.map