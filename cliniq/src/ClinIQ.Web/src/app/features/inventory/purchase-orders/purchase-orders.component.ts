import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService, PagedResult } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService } from '../../../core/services/tenant.service';

@Component({
  standalone: false,
  selector: 'app-purchase-orders',
  template: `
    <app-main-layout>
      <app-page-header title="Purchase Orders" [breadcrumbs]="[{ label: 'Inventory', route: '/inventory' }, { label: 'Purchase Orders' }]">
        <button mat-raised-button color="primary" (click)="showCreate = true"><mat-icon>add</mat-icon> New Order</button>
      </app-page-header>

      <!-- List View -->
      <div class="card" *ngIf="!showCreate && !selectedOrder && !showReceiveDialog">
        <div class="filters">
          <app-search-input placeholder="Search POs..." (search)="onSearch($event)"></app-search-input>
          <mat-form-field appearance="outline"><mat-label>Status</mat-label><mat-select [(value)]="filterStatus" (selectionChange)="load()"><mat-option value="">All</mat-option><mat-option value="Draft">Draft</mat-option><mat-option value="Approved">Approved</mat-option><mat-option value="Ordered">Ordered</mat-option><mat-option value="Received">Received</mat-option></mat-select></mat-form-field>
        </div>
        <table mat-table [dataSource]="orders">
          <ng-container matColumnDef="poNumber"><th mat-header-cell *matHeaderCellDef>PO Number</th><td mat-cell *matCellDef="let o">{{ o.poNumber }}</td></ng-container>
          <ng-container matColumnDef="supplier"><th mat-header-cell *matHeaderCellDef>Supplier</th><td mat-cell *matCellDef="let o">{{ o.supplierName }}</td></ng-container>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let o">{{ o.orderDate | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="items"><th mat-header-cell *matHeaderCellDef>Items</th><td mat-cell *matCellDef="let o">{{ o.itemCount }}</td></ng-container>
          <ng-container matColumnDef="total"><th mat-header-cell *matHeaderCellDef>Total</th><td mat-cell *matCellDef="let o">{{ o.totalAmount | currencyFormat }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let o"><button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button><mat-menu #menu="matMenu"><button mat-menu-item (click)="viewOrder(o.id)"><mat-icon>visibility</mat-icon> View</button><button mat-menu-item *ngIf="o.status === 'Approved' || o.status === 'Draft'" (click)="viewOrder(o.id)"><mat-icon>local_shipping</mat-icon> Receive</button><button mat-menu-item (click)="printOrder(o.id)"><mat-icon>print</mat-icon> Print</button></mat-menu></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>

      <!-- Create PO View -->
      <div class="card" *ngIf="showCreate">
        <div class="section-header">
          <div class="section-icon"><mat-icon>add_shopping_cart</mat-icon></div>
          <h3 class="section-title">New Purchase Order</h3>
        </div>
        <form [formGroup]="poForm" (ngSubmit)="submitPO()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="flex-2">
              <mat-label>Supplier *</mat-label>
              <input matInput [matAutocomplete]="supplierAuto" formControlName="supplierSearch" placeholder="Search supplier...">
              <mat-autocomplete #supplierAuto="matAutocomplete" [displayWith]="displaySupplier" (optionSelected)="onSupplierSelected($event)">
                <mat-option *ngFor="let s of filteredSuppliers" [value]="s">{{ s.name }}</mat-option>
              </mat-autocomplete>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Expected Delivery</mat-label>
              <input matInput [matDatepicker]="deliveryPicker" formControlName="expectedDeliveryDate">
              <mat-datepicker-toggle matSuffix [for]="deliveryPicker"></mat-datepicker-toggle>
              <mat-datepicker #deliveryPicker></mat-datepicker>
            </mat-form-field>
          </div>

          <div formArrayName="items" class="items-section">
            <div class="item-header">
              <span class="col-item">Item</span>
              <span class="col-qty">Qty</span>
              <span class="col-price">Unit Price</span>
              <span class="col-total">Total</span>
              <span class="col-action"></span>
            </div>
            <div *ngFor="let item of poItems.controls; let i = index" [formGroupName]="i" class="item-row">
              <mat-form-field appearance="outline" class="col-item">
                <input matInput [matAutocomplete]="itemAuto" formControlName="itemSearch" placeholder="Type to search items...">
                <mat-autocomplete #itemAuto="matAutocomplete" [displayWith]="displayItem" (optionSelected)="onItemSelected($event, i)">
                  <mat-option *ngFor="let it of filteredItems[i]" [value]="it">{{ it.name }} ({{ it.code }}) - Stock: {{ it.currentStock }}</mat-option>
                </mat-autocomplete>
              </mat-form-field>
              <mat-form-field appearance="outline" class="col-qty">
                <input matInput type="number" formControlName="quantity" min="1">
              </mat-form-field>
              <mat-form-field appearance="outline" class="col-price">
                <input matInput type="number" formControlName="unitPrice" min="0">
                <span matPrefix>&nbsp;{{ currencySymbol }}&nbsp;</span>
              </mat-form-field>
              <span class="col-total">{{ getItemTotal(i) | currencyFormat }}</span>
              <button mat-icon-button color="warn" type="button" (click)="removeItem(i)"><mat-icon>delete</mat-icon></button>
            </div>
          </div>
          <button mat-stroked-button type="button" color="primary" (click)="addItem()"><mat-icon>add</mat-icon> Add Item</button>

          <div class="po-notes">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notes</mat-label>
              <textarea matInput formControlName="notes" rows="2"></textarea>
            </mat-form-field>
          </div>

          <div class="po-total">Total: <strong>{{ getGrandTotal() | currencyFormat }}</strong></div>
          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="showCreate = false">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="saving">{{ saving ? 'Saving...' : 'Create PO' }}</button>
          </div>
        </form>
      </div>

      <!-- View PO Detail -->
      <div class="card" *ngIf="selectedOrder && !showReceiveDialog">
        <div class="section-header">
          <div class="section-icon"><mat-icon>description</mat-icon></div>
          <div>
            <h3 class="section-title">{{ selectedOrder.poNumber }}</h3>
            <span class="section-sub">{{ selectedOrder.status }}</span>
          </div>
          <app-status-badge [status]="selectedOrder.status" class="status-badge"></app-status-badge>
        </div>
        <div class="po-detail-grid">
          <div class="info-item"><span class="info-label">Supplier</span><span class="info-value">{{ selectedOrder.supplierName }}</span></div>
          <div class="info-item"><span class="info-label">Date</span><span class="info-value">{{ selectedOrder.orderDate | date:'mediumDate' }}</span></div>
          <div class="info-item"><span class="info-label">Expected</span><span class="info-value">{{ selectedOrder.expectedDeliveryDate ? (selectedOrder.expectedDeliveryDate | date:'mediumDate') : '-' }}</span></div>
          <div class="info-item"><span class="info-label">Status</span><span class="info-value">{{ selectedOrder.status }}</span></div>
        </div>
        <table mat-table [dataSource]="selectedOrder.items" class="detail-table">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Item</th><td mat-cell *matCellDef="let i">{{ i.itemName }}</td></ng-container>
          <ng-container matColumnDef="qty"><th mat-header-cell *matHeaderCellDef>Ordered</th><td mat-cell *matCellDef="let i">{{ i.orderedQuantity }}</td></ng-container>
          <ng-container matColumnDef="received"><th mat-header-cell *matHeaderCellDef>Received</th><td mat-cell *matCellDef="let i">{{ i.receivedQuantity || 0 }}</td></ng-container>
          <ng-container matColumnDef="batch"><th mat-header-cell *matHeaderCellDef>Batch</th><td mat-cell *matCellDef="let i">{{ i.batchNumber || '-' }}</td></ng-container>
          <ng-container matColumnDef="expiry"><th mat-header-cell *matHeaderCellDef>Expiry</th><td mat-cell *matCellDef="let i">{{ (i.expiryDate | date:'mediumDate') || '-' }}</td></ng-container>
          <ng-container matColumnDef="price"><th mat-header-cell *matHeaderCellDef>Price</th><td mat-cell *matCellDef="let i">{{ i.unitPrice | currencyFormat }}</td></ng-container>
          <ng-container matColumnDef="total"><th mat-header-cell *matHeaderCellDef>Total</th><td mat-cell *matCellDef="let i">{{ i.totalAmount | currencyFormat }}</td></ng-container>
          <tr mat-header-row *matHeaderRowDef="['name', 'qty', 'received', 'batch', 'expiry', 'price', 'total']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['name', 'qty', 'received', 'batch', 'expiry', 'price', 'total'];"></tr>
        </table>
        <div class="po-total">Grand Total: <strong>{{ selectedOrder.totalAmount | currencyFormat }}</strong></div>
        <div class="form-actions">
          <button mat-stroked-button (click)="selectedOrder = null">Back to List</button>
          <button mat-stroked-button *ngIf="selectedOrder.status === 'Approved' || selectedOrder.status === 'Draft'" (click)="openReceiveDialog()">
            <mat-icon>local_shipping</mat-icon> Receive Order
          </button>
          <button mat-raised-button color="primary" (click)="printOrder(selectedOrder.id)"><mat-icon>print</mat-icon> Print</button>
        </div>
      </div>

      <!-- Receive PO Dialog -->
      <div class="card receive-card" *ngIf="showReceiveDialog">
        <div class="section-header">
          <div class="section-icon receive-icon"><mat-icon>inventory_2</mat-icon></div>
          <div>
            <h3 class="section-title">Receive - {{ selectedOrder.poNumber }}</h3>
            <span class="section-sub">Enter batch numbers and expiry dates for each item</span>
          </div>
        </div>

        <div class="receive-items">
          <div *ngFor="let item of receiveItems; let ri = index" class="receive-item-card">
            <div class="receive-item-header">
              <div class="receive-item-info">
                <strong>{{ item.itemName }}</strong>
                <span class="ordered-qty">Ordered: {{ item.orderedQuantity }}</span>
              </div>
              <mat-form-field appearance="outline" class="receive-qty-field">
                <mat-label>Receive Qty</mat-label>
                <input matInput type="number" [(ngModel)]="receiveItems[ri].receiveQty" min="0" [max]="item.orderedQuantity">
              </mat-form-field>
            </div>
            <div class="receive-item-fields">
              <mat-form-field appearance="outline" class="flex-field">
                <mat-label>Batch Number</mat-label>
                <input matInput [(ngModel)]="receiveItems[ri].batchNumber" placeholder="e.g. BATCH-001">
              </mat-form-field>
              <mat-form-field appearance="outline" class="flex-field">
                <mat-label>Expiry Date</mat-label>
                <input matInput type="date" [(ngModel)]="receiveItems[ri].expiryDateStr">
              </mat-form-field>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button mat-stroked-button (click)="showReceiveDialog = false">Cancel</button>
          <button mat-raised-button color="primary" (click)="confirmReceive()" [disabled]="receiving">
            <mat-icon *ngIf="!receiving">check_circle</mat-icon>
            <mat-spinner *ngIf="receiving" diameter="18"></mat-spinner>
            {{ receiving ? 'Receiving...' : 'Confirm Receive' }}
          </button>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card {
      background: white; padding: 1.25rem; border-radius: 10px;
      border: 1px solid #e8eaf6; box-shadow: 0 1px 2px rgba(63, 81, 181, 0.06);
    }
    .filters { display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center; }
    table { width: 100%; }
    h3 { margin: 0; }
    .form-row { display: flex; gap: 0.6rem; margin-bottom: 1rem; align-items: flex-start; }
    .flex-2 { flex: 2; }
    .full-width { width: 100%; }

    .section-header {
      display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem;
    }
    .section-icon {
      width: 34px; height: 34px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center; background: #e8eaf6;
    }
    .section-icon mat-icon { color: #3f51b5; font-size: 18px; width: 18px; height: 18px; }
    .receive-icon { background: #e8f5e9 !important; }
    .receive-icon mat-icon { color: #2e7d32 !important; }
    .section-title { margin: 0; font-size: 0.95rem; font-weight: 600; color: #1a237e; }
    .section-sub { font-size: 0.78rem; color: #7986cb; display: block; }
    .status-badge { margin-left: auto; }

    .item-header {
      display: flex; gap: 0.5rem; padding: 0.5rem 0; font-weight: 600; font-size: 0.75rem; color: #7986cb;
      text-transform: uppercase; letter-spacing: 0.4px;
    }
    .item-row { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; }
    .col-item { flex: 3; }
    .col-qty { flex: 1; }
    .col-price { flex: 1.5; }
    .col-total { flex: 1.5; text-align: right; font-weight: 600; }
    .col-action { width: 36px; }

    .items-section { margin-bottom: 0.5rem; }
    .po-notes { margin-top: 0.5rem; }
    .po-total { text-align: right; font-size: 1.1rem; margin: 0.75rem 0; padding-top: 0.75rem; border-top: 2px solid #3f51b5; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.75rem; }

    .po-detail-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 2rem;
      margin-bottom: 1.5rem; padding: 1rem; background: #f5f6ff; border-radius: 8px;
    }
    .info-item { display: flex; flex-direction: column; gap: 2px; }
    .info-label { font-size: 0.72rem; color: #7986cb; text-transform: uppercase; letter-spacing: 0.3px; }
    .info-value { font-size: 0.88rem; font-weight: 500; color: #333; }
    .detail-table { margin-bottom: 1rem; }

    /* Receive Dialog Styles */
    .receive-card { border: 1.5px solid #c5cae9; background: #fafbff; }

    .receive-items { margin-bottom: 1rem; }

    .receive-item-card {
      background: white; border: 1px solid #e8eaf6; border-radius: 8px;
      padding: 0.75rem 1rem; margin-bottom: 0.6rem;
    }
    .receive-item-header {
      display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;
    }
    .receive-item-info { flex: 1; }
    .receive-item-info strong { color: #1a237e; display: block; }
    .ordered-qty { font-size: 0.78rem; color: #7986cb; }
    .receive-qty-field { width: 100px; }
    ::ng-deep .receive-qty-field .mat-mdc-form-field-subscript-wrapper { display: none; }

    .receive-item-fields { display: flex; gap: 0.6rem; }
    .flex-field { flex: 1; }
  `]
})
export class PurchaseOrdersComponent implements OnInit {
  orders: any[] = [];
  columns = ['poNumber', 'supplier', 'date', 'items', 'total', 'status', 'actions'];
  totalCount = 0; pageSize = 10; pageIndex = 0; searchTerm = ''; filterStatus = '';
  showCreate = false; selectedOrder: any = null; saving = false;
  poForm!: FormGroup;
  filteredSuppliers: any[] = [];
  filteredItems: any[][] = [];

  showReceiveDialog = false;
  receiveItems: any[] = [];
  receiving = false;

  branding: any = null;
  currencySymbol = '$';

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private notification: NotificationService,
    private tenantService: TenantService
  ) {
    this.currencySymbol = tenantService.getCurrencySymbol();
  }

  ngOnInit() {
    this.load();
    this.initForm();
    this.tenantService.loadTenant().subscribe(t => this.branding = t);
  }

  initForm() {
    this.poForm = this.fb.group({
      supplierId: ['', Validators.required],
      supplierSearch: ['', Validators.required],
      expectedDeliveryDate: [null],
      notes: [''],
      items: this.fb.array([])
    });
    this.addItem();

    this.poForm.get('supplierSearch')?.valueChanges.subscribe(val => {
      if (typeof val === 'string' && val.length >= 2) {
        this.api.get<any[]>('v1/suppliers/all', { searchTerm: val }).subscribe(r => this.filteredSuppliers = r);
      }
    });
  }

  get poItems(): FormArray { return this.poForm.get('items') as FormArray; }

  addItem() {
    const idx = this.poItems.length;
    const fg = this.fb.group({
      itemId: [''],
      itemSearch: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, Validators.min(0)]
    });

    fg.get('itemSearch')?.valueChanges.subscribe(val => {
      if (typeof val === 'string' && val.length >= 2) {
        this.api.get<any[]>('v1/inventory/items/search', { term: val }).subscribe(r => {
          this.filteredItems[idx] = r;
        });
      }
    });

    this.poItems.push(fg);
    this.filteredItems[idx] = [];
  }

  removeItem(i: number) {
    this.poItems.removeAt(i);
    this.filteredItems.splice(i, 1);
  }

  displaySupplier(s: any): string { return s ? s.name : ''; }
  displayItem(i: any): string { return i ? `${i.name} (${i.code})` : ''; }

  onSupplierSelected(e: any) { this.poForm.patchValue({ supplierId: e.option.value.id }); }

  onItemSelected(e: any, idx: number) {
    const item = e.option.value;
    this.poItems.at(idx).patchValue({ itemId: item.id, unitPrice: item.purchasePrice || 0 });
  }

  getItemTotal(i: number): number {
    const v = this.poItems.at(i).value;
    return (v.quantity || 0) * (v.unitPrice || 0);
  }

  getGrandTotal(): number {
    return this.poItems.controls.reduce((sum, _, i) => sum + this.getItemTotal(i), 0);
  }

  load() {
    this.api.get<PagedResult<any>>('v1/purchase-orders', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, status: this.filterStatus })
      .subscribe(r => { this.orders = r.items; this.totalCount = r.totalCount; });
  }

  onSearch(term: string) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
  onPage(e: any) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }

  submitPO() {
    if (this.poForm.invalid) return;
    this.saving = true;
    const fv = this.poForm.value;
    const payload = {
      supplierId: fv.supplierId,
      expectedDeliveryDate: fv.expectedDeliveryDate,
      notes: fv.notes,
      items: fv.items.filter((i: any) => i.itemId).map((i: any) => ({
        itemId: i.itemId,
        quantity: i.quantity,
        unitPrice: i.unitPrice
      }))
    };
    if (payload.items.length === 0) {
      this.notification.error('Please add at least one item');
      this.saving = false;
      return;
    }
    this.api.post('v1/purchase-orders', payload).subscribe({
      next: () => {
        this.notification.success('Purchase order created');
        this.showCreate = false;
        this.poForm.reset({ supplierId: '', supplierSearch: '', notes: '' });
        this.poItems.clear();
        this.filteredItems = [];
        this.addItem();
        this.load();
        this.saving = false;
      },
      error: (err) => {
        this.notification.error(err?.message || 'Failed to create purchase order');
        this.saving = false;
      }
    });
  }

  viewOrder(id: string) {
    this.api.getById<any>('v1/purchase-orders', id).subscribe(r => this.selectedOrder = r);
  }

  openReceiveDialog() {
    this.receiveItems = (this.selectedOrder.items || []).map((item: any) => ({
      ...item,
      batchNumber: item.batchNumber || '',
      expiryDateStr: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
      receiveQty: item.orderedQuantity
    }));
    this.showReceiveDialog = true;
  }

  confirmReceive() {
    this.receiving = true;
    this.api.post(`v1/purchase-orders/${this.selectedOrder.id}/receive`, {
      items: this.receiveItems.map(i => ({
        purchaseOrderItemId: i.id,
        batchNumber: i.batchNumber || null,
        expiryDate: i.expiryDateStr ? i.expiryDateStr : null,
        receivedQuantity: i.receiveQty
      }))
    }).subscribe({
      next: () => {
        this.notification.success('Order received - inventory updated');
        this.showReceiveDialog = false;
        this.selectedOrder = null;
        this.receiving = false;
        this.load();
      },
      error: () => { this.receiving = false; }
    });
  }

  printOrder(id: string) {
    this.api.getById<any>('v1/purchase-orders', id).subscribe(order => {
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>PO ${order.poNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #333; }
            .brand { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #1a237e; }
            .brand-logo { max-width: 60px; max-height: 60px; }
            .brand-info h2 { margin: 0; color: #1a237e; font-size: 18px; }
            .brand-info p { margin: 2px 0; color: #666; font-size: 11px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .header h1 { color: #1a237e; font-size: 22px; letter-spacing: 1px; }
            .header p { color: #666; font-size: 12px; }
            .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; padding: 12px; background: #f5f6ff; border-radius: 6px; }
            .meta span { font-size: 12px; }
            .meta strong { color: #1a237e; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background: #1a237e; color: white; padding: 8px 12px; text-align: left; font-size: 11px; }
            td { padding: 8px 12px; border-bottom: 1px solid #e0e0e0; font-size: 12px; }
            .total-section { text-align: right; font-size: 16px; margin-bottom: 20px; padding-top: 10px; border-top: 2px solid #1a237e; }
            .total-section strong { color: #1a237e; }
            .notes { font-size: 12px; color: #666; margin-bottom: 20px; }
            .footer { display: flex; justify-content: space-between; margin-top: 40px; font-size: 11px; color: #999; border-top: 1px solid #e0e0e0; padding-top: 10px; }
            @media print { body { padding: 15px; } }
          </style>
        </head>
        <body>
          <div class="brand">
            ${this.branding?.logoUrl ? `<img src="${this.branding.logoUrl}" alt="logo" class="brand-logo">` : ''}
            <div class="brand-info">
              <h2>${this.branding?.name || 'Hospital Name'}</h2>
              ${this.branding?.phone ? `<p>${this.branding.phone}</p>` : ''}
              ${this.branding?.address ? `<p>${this.branding.address}</p>` : ''}
            </div>
          </div>
          <div class="header">
            <div><h1>PURCHASE ORDER</h1><p>${order.poNumber}</p></div>
            <div style="text-align:right"><p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p><p><strong>Status:</strong> ${order.status}</p></div>
          </div>
          <div class="meta">
            <div><span><strong>Supplier:</strong> ${order.supplierName || 'N/A'}</span></div>
            <div><span><strong>Expected Delivery:</strong> ${order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'N/A'}</span></div>
          </div>
          <table>
            <thead><tr><th>Item</th><th>Qty</th><th>Batch</th><th>Expiry</th><th>Unit Price</th><th>Total</th></tr></thead>
            <tbody>
              ${(order.items || []).map((i: any) => `<tr><td>${i.itemName || 'N/A'}</td><td>${i.orderedQuantity}</td><td>${i.batchNumber || '-'}</td><td>${i.expiryDate ? new Date(i.expiryDate).toLocaleDateString() : '-'}</td><td>${this.currencySymbol}${i.unitPrice}</td><td>${this.currencySymbol}${i.totalAmount}</td></tr>`).join('')}
            </tbody>
          </table>
          <div class="total-section"><strong>Total: ${this.currencySymbol}${order.totalAmount}</strong></div>
          ${order.notes ? `<div class="notes"><strong>Notes:</strong> ${order.notes}</div>` : ''}
          <div class="footer">
            <span>Generated by ${this.branding?.name || 'System'}</span>
            <span>${new Date().toLocaleString()}</span>
          </div>
        </body>
        </html>`;
      const w = window.open('', '_blank');
      if (w) { w.document.write(printContent); w.document.close(); w.print(); }
    });
  }
}
