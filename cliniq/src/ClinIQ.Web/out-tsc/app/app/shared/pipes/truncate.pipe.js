import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class TruncatePipe {
    transform(value, limit = 50, ellipsis = '...') {
        if (!value) {
            return '';
        }
        if (value.length <= limit) {
            return value;
        }
        return value.substring(0, limit).trim() + ellipsis;
    }
    static { this.ɵfac = function TruncatePipe_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TruncatePipe)(); }; }
    static { this.ɵpipe = /*@__PURE__*/ i0.ɵɵdefinePipe({ name: "truncate", type: TruncatePipe, pure: true, standalone: false }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TruncatePipe, [{
        type: Pipe,
        args: [{
                standalone: false,
                name: 'truncate'
            }]
    }], null, null); })();
//# sourceMappingURL=truncate.pipe.js.map