import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class TimeAgoPipe {
    transform(value) {
        if (!value) {
            return '';
        }
        const date = typeof value === 'string' ? new Date(value) : value;
        if (isNaN(date.getTime())) {
            return '';
        }
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (seconds < 0) {
            return 'in the future';
        }
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };
        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return interval === 1
                    ? `${interval} ${unit} ago`
                    : `${interval} ${unit}s ago`;
            }
        }
        return 'just now';
    }
    static { this.ɵfac = function TimeAgoPipe_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TimeAgoPipe)(); }; }
    static { this.ɵpipe = /*@__PURE__*/ i0.ɵɵdefinePipe({ name: "timeAgo", type: TimeAgoPipe, pure: true, standalone: false }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TimeAgoPipe, [{
        type: Pipe,
        args: [{
                standalone: false,
                name: 'timeAgo'
            }]
    }], null, null); })();
//# sourceMappingURL=time-ago.pipe.js.map