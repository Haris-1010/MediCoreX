import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

import { InventoryDashboardComponent } from './inventory-dashboard/inventory-dashboard.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemDialogComponent } from './item-dialog/item-dialog.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { PurchaseOrderPrintComponent } from './purchase-order-print/purchase-order-print.component';
import { StockAdjustmentComponent } from './stock-adjustment/stock-adjustment.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { StockBatchesDialogComponent } from './stock-batches-dialog/stock-batches-dialog.component';

const routes: Routes = [
  { path: '', component: InventoryDashboardComponent },
  { path: 'items', component: ItemListComponent },
  { path: 'purchase-orders', component: PurchaseOrdersComponent },
  { path: 'purchase-orders/print/:id', component: PurchaseOrderPrintComponent },
  { path: 'adjustments', component: StockAdjustmentComponent },
  { path: 'suppliers', component: SuppliersComponent }
];

@NgModule({
  declarations: [InventoryDashboardComponent, ItemListComponent, ItemDialogComponent, PurchaseOrdersComponent, StockAdjustmentComponent, SuppliersComponent, StockBatchesDialogComponent],
  imports: [CommonModule, FormsModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
})
export class InventoryModule { }
