import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/tenant.service";
export class DateFormatPipe {
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    transform(value, format) {
        if (!value) {
            return '';
        }
        const date = typeof value === 'string' ? new Date(value) : value;
        if (isNaN(date.getTime())) {
            return '';
        }
        if (format) {
            return this.formatWithPattern(date, format);
        }
        return this.tenantService.formatDate(date);
    }
    formatWithPattern(date, pattern) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return pattern
            .replace('dd', day)
            .replace('MM', month)
            .replace('yyyy', year)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    }
    static { this.ɵfac = function DateFormatPipe_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DateFormatPipe)(i0.ɵɵdirectiveInject(i1.TenantService, 16)); }; }
    static { this.ɵpipe = /*@__PURE__*/ i0.ɵɵdefinePipe({ name: "dateFormat", type: DateFormatPipe, pure: true, standalone: false }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DateFormatPipe, [{
        type: Pipe,
        args: [{
                standalone: false,
                name: 'dateFormat'
            }]
    }], () => [{ type: i1.TenantService }], null); })();
//# sourceMappingURL=date-format.pipe.js.map