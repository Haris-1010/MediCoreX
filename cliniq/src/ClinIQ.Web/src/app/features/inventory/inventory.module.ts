import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { InventoryDashboardComponent } from './inventory-dashboard/inventory-dashboard.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemDialogComponent } from './item-dialog/item-dialog.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { StockAdjustmentComponent } from './stock-adjustment/stock-adjustment.component';

const routes: Routes = [
  { path: '', component: InventoryDashboardComponent },
  { path: 'items', component: ItemListComponent },
  { path: 'purchase-orders', component: PurchaseOrdersComponent },
  { path: 'adjustments', component: StockAdjustmentComponent }
];

@NgModule({
  declarations: [InventoryDashboardComponent, ItemListComponent, ItemDialogComponent, PurchaseOrdersComponent, StockAdjustmentComponent],
  imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
})
export class InventoryModule { }
