import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { InventoryDashboardComponent } from './inventory-dashboard/inventory-dashboard.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemDialogComponent } from './item-dialog/item-dialog.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { StockAdjustmentComponent } from './stock-adjustment/stock-adjustment.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    { path: '', component: InventoryDashboardComponent },
    { path: 'items', component: ItemListComponent },
    { path: 'purchase-orders', component: PurchaseOrdersComponent },
    { path: 'adjustments', component: StockAdjustmentComponent }
];
export class InventoryModule {
    static { this.ɵfac = function InventoryModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || InventoryModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: InventoryModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(InventoryModule, [{
        type: NgModule,
        args: [{
                declarations: [InventoryDashboardComponent, ItemListComponent, ItemDialogComponent, PurchaseOrdersComponent, StockAdjustmentComponent],
                imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(InventoryModule, { declarations: [InventoryDashboardComponent, ItemListComponent, ItemDialogComponent, PurchaseOrdersComponent, StockAdjustmentComponent], imports: [CommonModule, SharedModule, LayoutModule, i1.RouterModule] }); })();
//# sourceMappingURL=inventory.module.js.map