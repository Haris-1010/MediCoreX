import { Directive, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/auth.service";
export class HasRoleDirective {
    constructor(templateRef, viewContainer, authService) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.authService = authService;
        this.destroy$ = new Subject();
        this.isVisible = false;
    }
    ngOnInit() {
        this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.updateView();
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    updateView() {
        const hasRole = this.checkRole();
        if (hasRole && !this.isVisible) {
            this.viewContainer.clear();
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.isVisible = true;
        }
        else if (!hasRole && this.isVisible) {
            this.viewContainer.clear();
            if (this.elseTemplate) {
                this.viewContainer.createEmbeddedView(this.elseTemplate);
            }
            this.isVisible = false;
        }
        else if (!hasRole && !this.isVisible && this.elseTemplate) {
            this.viewContainer.clear();
            this.viewContainer.createEmbeddedView(this.elseTemplate);
        }
    }
    checkRole() {
        if (!this.role) {
            return true;
        }
        if (Array.isArray(this.role)) {
            return this.authService.hasAnyRole(this.role);
        }
        return this.authService.hasRole(this.role);
    }
    static { this.ɵfac = function HasRoleDirective_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || HasRoleDirective)(i0.ɵɵdirectiveInject(i0.TemplateRef), i0.ɵɵdirectiveInject(i0.ViewContainerRef), i0.ɵɵdirectiveInject(i1.AuthService)); }; }
    static { this.ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: HasRoleDirective, selectors: [["", "appHasRole", ""]], inputs: { role: [0, "appHasRole", "role"], elseTemplate: [0, "appHasRoleElse", "elseTemplate"] }, standalone: false }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(HasRoleDirective, [{
        type: Directive,
        args: [{
                standalone: false,
                selector: '[appHasRole]'
            }]
    }], () => [{ type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: i1.AuthService }], { role: [{
            type: Input,
            args: ['appHasRole']
        }], elseTemplate: [{
            type: Input,
            args: ['appHasRoleElse']
        }] }); })();
//# sourceMappingURL=has-role.directive.js.map