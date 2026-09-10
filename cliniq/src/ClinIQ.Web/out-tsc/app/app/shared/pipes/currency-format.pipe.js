import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/tenant.service";
export class CurrencyFormatPipe {
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    transform(value, currency) {
        if (value === null || value === undefined) {
            return '';
        }
        if (currency) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency
            }).format(value);
        }
        return this.tenantService.formatCurrency(value);
    }
    static { this.ɵfac = function CurrencyFormatPipe_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CurrencyFormatPipe)(i0.ɵɵdirectiveInject(i1.TenantService, 16)); }; }
    static { this.ɵpipe = /*@__PURE__*/ i0.ɵɵdefinePipe({ name: "currencyFormat", type: CurrencyFormatPipe, pure: true, standalone: false }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CurrencyFormatPipe, [{
        type: Pipe,
        args: [{
                standalone: false,
                name: 'currencyFormat'
            }]
    }], () => [{ type: i1.TenantService }], null); })();
//# sourceMappingURL=currency-format.pipe.js.map