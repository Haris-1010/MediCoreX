import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as i0 from "@angular/core";
export class DebounceClickDirective {
    constructor() {
        this.debounceTime = 500;
        this.debounceClick = new EventEmitter();
        this.clicks = new Subject();
    }
    ngOnInit() {
        this.subscription = this.clicks.pipe(debounceTime(this.debounceTime)).subscribe(event => {
            this.debounceClick.emit(event);
        });
    }
    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
    clickEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        this.clicks.next(event);
    }
    static { this.ɵfac = function DebounceClickDirective_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DebounceClickDirective)(); }; }
    static { this.ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: DebounceClickDirective, selectors: [["", "appDebounceClick", ""]], hostBindings: function DebounceClickDirective_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("click", function DebounceClickDirective_click_HostBindingHandler($event) { return ctx.clickEvent($event); });
        } }, inputs: { debounceTime: "debounceTime" }, outputs: { debounceClick: "debounceClick" }, standalone: false }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DebounceClickDirective, [{
        type: Directive,
        args: [{
                standalone: false,
                selector: '[appDebounceClick]'
            }]
    }], null, { debounceTime: [{
            type: Input
        }], debounceClick: [{
            type: Output
        }], clickEvent: [{
            type: HostListener,
            args: ['click', ['$event']]
        }] }); })();
//# sourceMappingURL=debounce-click.directive.js.map