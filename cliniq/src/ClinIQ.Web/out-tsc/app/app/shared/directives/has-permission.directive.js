import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject, } from '@angular/core';
import { PermissionService } from '../../core/services/permission.service';
import * as i0 from "@angular/core";
/**
 * Structural directive that removes UI the user cannot act on.
 *
 *   <button *hasPermission="'patients.create'">New Patient</button>
 *   <button *hasPermission="'billing.refund'; module: 'billing'">Refund</button>
 *   <a *hasPermission="['billing.edit','billing.create']; mode: 'any'">Edit</a>
 *
 * Removing the element is presentation, not protection. Every action behind one
 * of these is independently rejected by its own API endpoint.
 */
export class HasPermissionDirective {
    constructor() {
        this.templateRef = inject((TemplateRef));
        this.viewContainer = inject(ViewContainerRef);
        this.permissions = inject(PermissionService);
        this.required = [];
        this.mode = 'all';
        this.rendered = false;
        // Re-evaluates when the permission context changes, so a branch switch
        // updates the UI without a reload.
        effect(() => {
            this.permissions.current();
            this.update();
        });
    }
    set hasPermission(value) {
        this.required = Array.isArray(value) ? value : [value];
        this.update();
    }
    set hasPermissionModule(value) {
        this.module = value;
        this.update();
    }
    set hasPermissionMode(value) {
        this.mode = value ?? 'all';
        this.update();
    }
    update() {
        const moduleOk = !this.module || this.permissions.hasModule(this.module);
        const permOk = this.required.length === 0 ||
            (this.mode === 'any'
                ? this.permissions.hasAny(this.required)
                : this.permissions.hasAll(this.required));
        const allowed = moduleOk && permOk;
        if (allowed && !this.rendered) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.rendered = true;
        }
        else if (!allowed && this.rendered) {
            this.viewContainer.clear();
            this.rendered = false;
        }
    }
    static { this.ɵfac = function HasPermissionDirective_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || HasPermissionDirective)(); }; }
    static { this.ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: HasPermissionDirective, selectors: [["", "hasPermission", ""]], inputs: { hasPermission: "hasPermission", hasPermissionModule: "hasPermissionModule", hasPermissionMode: "hasPermissionMode" } }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(HasPermissionDirective, [{
        type: Directive,
        args: [{
                selector: '[hasPermission]',
                standalone: true,
            }]
    }], () => [], { hasPermission: [{
            type: Input
        }], hasPermissionModule: [{
            type: Input
        }], hasPermissionMode: [{
            type: Input
        }] }); })();
//# sourceMappingURL=has-permission.directive.js.map