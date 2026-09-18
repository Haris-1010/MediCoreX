import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService, PagedResult } from '../../../core/services/api.service';
import { ItemDialogComponent } from '../item-dialog/item-dialog.component';
import { StockBatchesDialogComponent } from '../stock-batches-dialog/stock-batches-dialog.component';

@Component({
  standalone: false,
  selector: 'app-item-list',
  template: `
    <app-main-layout>
      <app-page-header title="Inventory Items" [breadcrumbs]="[{ label: 'Inventory', route: '/inventory' }, { label: 'Items' }]">
        <button mat-raised-button color="primary" (click)="openItemDialog()"><mat-icon>add</mat-icon> Add Item</button>
      </app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search items..." (search)="onSearch($event)"></app-search-input>
          <mat-form-field appearance="outline"><mat-label>Category</mat-label><mat-select [(value)]="filterCategory" (selectionChange)="load()"><mat-option value="">All</mat-option><mat-option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</mat-option></mat-select></mat-form-field>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear
          </button>
        </div>
        <table mat-table [dataSource]="items">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Item Name</th><td mat-cell *matCellDef="let i">{{ i.name }}</td></ng-container>
          <ng-container matColumnDef="code"><th mat-header-cell *matHeaderCellDef>Code</th><td mat-cell *matCellDef="let i">{{ i.code }}</td></ng-container>
          <ng-container matColumnDef="category"><th mat-header-cell *matHeaderCellDef>Category</th><td mat-cell *matCellDef="let i">{{ i.categoryName }}</td></ng-container>
          <ng-container matColumnDef="stock"><th mat-header-cell *matHeaderCellDef>Stock</th><td mat-cell *matCellDef="let i" [class.low]="i.stockStatus === 'LowStock'" [class.out]="i.stockStatus === 'OutOfStock'">{{ i.currentStock }}</td></ng-container>
          <ng-container matColumnDef="reorderLevel"><th mat-header-cell *matHeaderCellDef>Reorder</th><td mat-cell *matCellDef="let i">{{ i.reorderLevel }}</td></ng-container>
          <ng-container matColumnDef="purchasePrice"><th mat-header-cell *matHeaderCellDef>Cost</th><td mat-cell *matCellDef="let i">{{ i.purchasePrice | currencyFormat }}</td></ng-container>
          <ng-container matColumnDef="sellingPrice"><th mat-header-cell *matHeaderCellDef>Selling</th><td mat-cell *matCellDef="let i">{{ i.sellingPrice | currencyFormat }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let i"><button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button><mat-menu #menu="matMenu"><button mat-menu-item (click)="openItemDialog(i)"><mat-icon>edit</mat-icon> Edit</button><button mat-menu-item (click)="adjustStock(i)"><mat-icon>tune</mat-icon> Adjust Stock</button><button mat-menu-item (click)="viewBatches(i)"><mat-icon>inventory_2</mat-icon> View Batches</button></mat-menu></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: white; padding: 1.5rem; border-radius: 8px; } .filters { display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center; } table { width: 100%; } .low { color: #ff9800; font-weight: 600; } .out { color: #f44336; font-weight: 600; }`]
})
export class ItemListComponent implements OnInit {
  items: any[] = []; categories: any[] = [];
  columns = ['name', 'code', 'category', 'stock', 'reorderLevel', 'purchasePrice', 'sellingPrice', 'actions'];
  totalCount = 0; pageSize = 10; pageIndex = 0; searchTerm = ''; filterCategory = '';

  constructor(private api: ApiService, private dialog: MatDialog) {}

  ngOnInit() { this.load(); this.api.get<any[]>('v1/inventory/categories').subscribe(r => this.categories = r); }

  load() {
    this.api.get<PagedResult<any>>('v1/inventory/items', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, categoryId: this.filterCategory })
      .subscribe(r => { this.items = r.items; this.totalCount = r.totalCount; });
  }

  onSearch(term: string) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
  onPage(e: any) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
 openItemDialog(item?: any) {

  const dialogRef = this.dialog.open(ItemDialogComponent, {
    data: { item, mode: item ? 'edit' : 'add' },
    width: '720px',
    maxWidth: '95vw'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) this.load();
  });
}

adjustStock(item: any) {

  const dialogRef = this.dialog.open(ItemDialogComponent, {
    data: { item, mode: 'adjust' },
   width: '720px',
    maxWidth: '95vw'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) this.load();
  });
}

viewBatches(item: any) {
  const dialogRef = this.dialog.open(StockBatchesDialogComponent, {
    data: { itemId: item.id, itemName: item.name },
    width: '800px',
    maxWidth: '95vw'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) this.load();
  });
}

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.filterCategory);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterCategory = '';
    this.pageIndex = 0;
    this.load();
  }
}
