import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

export interface ItemDialogData {
  item?: any;
  mode: 'add' | 'edit' | 'adjust';
}

@Component({
  standalone: false,
  selector: 'app-item-dialog',
  template: `
    <h2 mat-dialog-title>
      <mat-icon>{{ modeIcon }}</mat-icon>
      {{ data.mode === 'add' ? 'Add New Item' : data.mode === 'edit' ? 'Edit Item' : 'Adjust Stock' }}
    </h2>

    <mat-dialog-content>
      <!-- Add/Edit Form -->
      <form *ngIf="data.mode !== 'adjust'" [formGroup]="itemForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Item Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter item name">
          <mat-error>Name is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>SKU</mat-label>
          <input matInput formControlName="sku" placeholder="e.g. MED-001">
          <mat-error>SKU is required</mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select formControlName="categoryId">
              <mat-option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Unit</mat-label>
            <mat-select formControlName="unit">
              <mat-option value="pcs">Pieces</mat-option>
              <mat-option value="box">Box</mat-option>
              <mat-option value="bottle">Bottle</mat-option>
              <mat-option value="strip">Strip</mat-option>
              <mat-option value="sachet">Sachet</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Quantity</mat-label>
            <input matInput type="number" formControlName="quantity">
            <mat-error *ngIf="itemForm.get('quantity')?.hasError('required')">Required</mat-error>
            <mat-error *ngIf="itemForm.get('quantity')?.hasError('min')">Min 0</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Reorder Level</mat-label>
            <input matInput type="number" formControlName="reorderLevel">
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Unit Price</mat-label>
            <input matInput type="number" formControlName="unitPrice">
            <span matPrefix>$&nbsp;</span>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Supplier</mat-label>
            <input matInput formControlName="supplierName" placeholder="Supplier name">
          </mat-form-field>
        </div>
      </form>

      <!-- Adjust Stock Form -->
      <div *ngIf="data.mode === 'adjust'">
        <div class="current-stock" *ngIf="data.item">
          <span>{{ data.item.name }}</span>
          <strong>{{ data.item.quantity }} {{ data.item.unit }}</strong>
        </div>
        <form [formGroup]="adjustForm">
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Adjustment Type</mat-label>
              <mat-select formControlName="adjustmentType">
                <mat-option value="Add">Add (+)</mat-option>
                <mat-option value="Remove">Remove (-)</mat-option>
                <mat-option value="Set">Set to</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Quantity</mat-label>
              <input matInput type="number" formControlName="quantity">
              <mat-error *ngIf="adjustForm.get('quantity')?.hasError('min')">Must be at least 1</mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Reason</mat-label>
            <mat-select formControlName="reason">
              <mat-option value="Damaged">Damaged</mat-option>
              <mat-option value="Expired">Expired</mat-option>
              <mat-option value="Lost">Lost</mat-option>
              <mat-option value="Found">Found</mat-option>
              <mat-option value="Correction">Correction</mat-option>
              <mat-option value="Received">Received (PO)</mat-option>
              <mat-option value="Other">Other</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Notes</mat-label>
            <textarea matInput formControlName="notes" rows="2" placeholder="Optional notes"></textarea>
          </mat-form-field>
        </form>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="saving">
        {{ saving ? 'Saving...' : (data.mode === 'adjust' ? 'Submit' : 'Save') }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .full-width { width: 100%; }
    .form-row { display: flex; gap: 1rem; }
    .form-row mat-form-field { flex: 1; }
    .current-stock {
      background: #e3f2fd;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    mat-dialog-content { min-width: 400px; max-width: 550px; }
  `]
})
export class ItemDialogComponent implements OnInit {
  itemForm!: FormGroup;
  adjustForm!: FormGroup;
  categories: any[] = [];
  saving = false;

  get modeIcon(): string {
    if (this.data.mode === 'add') return 'add_box';
    if (this.data.mode === 'edit') return 'edit';
    return 'tune';
  }

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private notification: NotificationService,
    public dialogRef: MatDialogRef<ItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemDialogData
  ) {}

  ngOnInit(): void {
    this.api.get<any[]>('v1/inventory/categories').subscribe(r => this.categories = r);

    if (this.data.mode === 'adjust') {
      this.adjustForm = this.fb.group({
        adjustmentType: ['Add', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        reason: ['', Validators.required],
        notes: ['']
      });
    } else {
      const item = this.data.item;
      this.itemForm = this.fb.group({
        name: [item?.name || '', Validators.required],
        sku: [item?.sku || '', Validators.required],
        categoryId: [item?.categoryId || ''],
        unit: [item?.unit || 'pcs'],
        quantity: [item?.quantity || 0, [Validators.required, Validators.min(0)]],
        reorderLevel: [item?.reorderLevel || 10],
        unitPrice: [item?.unitPrice || 0],
        supplierName: [item?.supplierName || '']
      });
    }
  }

  onSave(): void {
    if (this.data.mode === 'adjust' && this.adjustForm.invalid) return;
    if (this.data.mode !== 'adjust' && this.itemForm.invalid) return;

    this.saving = true;

    if (this.data.mode === 'adjust') {
      const formValue = this.adjustForm.value;
      const payload = {
        itemId: this.data.item.id,
        adjustmentType: formValue.adjustmentType,
        quantity: formValue.quantity,
        reason: formValue.reason,
        notes: formValue.notes || null
      };
      this.api.post('v1/inventory/adjustments', payload).subscribe({
        next: () => {
          this.notification.success('Stock adjusted successfully');
          this.dialogRef.close(true);
        },
        error: () => { this.saving = false; }
      });
    } else {
      const formValue = this.itemForm.value;
      const request = this.data.mode === 'edit'
        ? this.api.put('v1/inventory/items', this.data.item.id, formValue)
        : this.api.post('v1/inventory/items', formValue);

      request.subscribe({
        next: () => {
          this.notification.success(this.data.mode === 'edit' ? 'Item updated' : 'Item added');
          this.dialogRef.close(true);
        },
        error: () => { this.saving = false; }
      });
    }
  }
}
