import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { DashboardComponent } from './dashboard.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { AppointmentWidgetComponent } from './components/appointment-widget/appointment-widget.component';
import { RevenueChartComponent } from './components/revenue-chart/revenue-chart.component';
import { QueueWidgetComponent } from './components/queue-widget/queue-widget.component';
import { BedOccupancyWidgetComponent } from './components/bed-occupancy-widget/bed-occupancy-widget.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: DashboardComponent
    }
];
export class DashboardModule {
    static { this.ɵfac = function DashboardModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DashboardModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: DashboardModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule,
            SharedModule,
            LayoutModule,
            RouterModule.forChild(routes)] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DashboardModule, [{
        type: NgModule,
        args: [{
                declarations: [
                    DashboardComponent,
                    StatsCardComponent,
                    AppointmentWidgetComponent,
                    RevenueChartComponent,
                    QueueWidgetComponent,
                    BedOccupancyWidgetComponent
                ],
                imports: [
                    CommonModule,
                    SharedModule,
                    LayoutModule,
                    RouterModule.forChild(routes)
                ]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(DashboardModule, { declarations: [DashboardComponent,
        StatsCardComponent,
        AppointmentWidgetComponent,
        RevenueChartComponent,
        QueueWidgetComponent,
        BedOccupancyWidgetComponent], imports: [CommonModule,
        SharedModule,
        LayoutModule, i1.RouterModule] }); })();
//# sourceMappingURL=dashboard.module.js.map