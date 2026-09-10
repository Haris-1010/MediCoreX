import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class PhonePipe {
    transform(value, format = 'default') {
        if (!value) {
            return '';
        }
        // Remove all non-digit characters
        const digits = value.replace(/\D/g, '');
        switch (format) {
            case 'us':
                return this.formatUS(digits);
            case 'international':
                return this.formatInternational(digits);
            case 'local':
                return this.formatLocal(digits);
            default:
                return this.formatDefault(digits);
        }
    }
    formatUS(digits) {
        if (digits.length === 10) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
        if (digits.length === 11 && digits.startsWith('1')) {
            return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
        }
        return digits;
    }
    formatInternational(digits) {
        if (digits.length >= 10) {
            const countryCode = digits.slice(0, digits.length - 10);
            const rest = digits.slice(-10);
            return `+${countryCode} ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
        }
        return digits;
    }
    formatLocal(digits) {
        if (digits.length === 10) {
            return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
        return digits;
    }
    formatDefault(digits) {
        // Auto-detect and format
        if (digits.length === 10) {
            return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
        if (digits.length === 11) {
            return `+${digits.slice(0, 1)} ${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
        }
        if (digits.length > 11) {
            const countryCode = digits.slice(0, digits.length - 10);
            const rest = digits.slice(-10);
            return `+${countryCode} ${rest.slice(0, 3)}-${rest.slice(3, 6)}-${rest.slice(6)}`;
        }
        return digits;
    }
    static { this.ɵfac = function PhonePipe_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PhonePipe)(); }; }
    static { this.ɵpipe = /*@__PURE__*/ i0.ɵɵdefinePipe({ name: "phone", type: PhonePipe, pure: true, standalone: false }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PhonePipe, [{
        type: Pipe,
        args: [{
                standalone: false,
                name: 'phone'
            }]
    }], null, null); })();
//# sourceMappingURL=phone.pipe.js.map