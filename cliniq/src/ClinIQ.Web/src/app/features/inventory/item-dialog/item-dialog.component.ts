import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService } from '../../../core/services/tenant.service';

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
          <mat-label>Item Name *</mat-label>
          <input matInput formControlName="name" placeholder="Enter item name">
          <mat-error>Name is required</mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Code / SKU *</mat-label>
            <input matInput formControlName="code" placeholder="e.g. MED-001">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select formControlName="categoryId">
              <mat-option value="">None</mat-option>
              <mat-option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Generic Name</mat-label>
            <input matInput formControlName="genericName" placeholder="e.g. Amoxicillin">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Brand Name</mat-label>
            <input matInput formControlName="brandName" placeholder="e.g. Amoxil">
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Strength</mat-label>
            <input matInput formControlName="strength" placeholder="e.g. 500mg">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Form</mat-label>
            <mat-select formControlName="form">
              <mat-option value="">None</mat-option>
              <mat-option value="Tablet">Tablet</mat-option>
              <mat-option value="Capsule">Capsule</mat-option>
              <mat-option value="Syrup">Syrup</mat-option>
              <mat-option value="Injection">Injection</mat-option>
              <mat-option value="Cream">Cream</mat-option>
              <mat-option value="Drops">Drops</mat-option>
              <mat-option value="Inhaler">Inhaler</mat-option>
              <mat-option value="Powder">Powder</mat-option>
              <mat-option value="Other">Other</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Purchase Unit</mat-label>
            <mat-select formControlName="purchaseUnit">
              <mat-option value="pcs">Pieces</mat-option>
              <mat-option value="box">Box</mat-option>
              <mat-option value="bottle">Bottle</mat-option>
              <mat-option value="strip">Strip</mat-option>
              <mat-option value="sachet">Sachet</mat-option>
              <mat-option value="kg">Kilogram</mat-option>
              <mat-option value="liter">Liter</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Sale Unit</mat-label>
            <mat-select formControlName="saleUnit">
              <mat-option value="pcs">Pieces</mat-option>
              <mat-option value="box">Box</mat-option>
              <mat-option value="bottle">Bottle</mat-option>
              <mat-option value="strip">Strip</mat-option>
              <mat-option value="sachet">Sachet</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="section-label">Pricing</div>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Purchase Price *</mat-label>
            <input matInput type="number" formControlName="purchasePrice" min="0">
            <span matPrefix>&nbsp;{{ currencySymbol }}&nbsp;</span>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Selling Price *</mat-label>
            <input matInput type="number" formControlName="sellingPrice" min="0">
            <span matPrefix>&nbsp;{{ currencySymbol }}&nbsp;</span>
          </mat-form-field>
        </div>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Cost Price</mat-label>
            <input matInput type="number" formControlName="costPrice" min="0">
            <span matPrefix>&nbsp;{{ currencySymbol }}&nbsp;</span>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>MRP</mat-label>
            <input matInput type="number" formControlName="mrp" min="0">
            <span matPrefix>&nbsp;{{ currencySymbol }}&nbsp;</span>
          </mat-form-field>
        </div>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Tax %</mat-label>
            <input matInput type="number" formControlName="taxPercent" min="0" max="100">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Initial Stock</mat-label>
            <input matInput type="number" formControlName="currentStock" min="0">
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Reorder Level</mat-label>
            <input matInput type="number" formControlName="reorderLevel" min="0">
            <mat-hint>Alert when stock falls below this</mat-hint>
          </mat-form-field>
        </div>

        <div class="form-row checkboxes">
          <mat-checkbox formControlName="isMedicine">Is Medicine</mat-checkbox>
          <mat-checkbox formControlName="requiresPrescription">Requires Prescription</mat-checkbox>
          <mat-checkbox formControlName="isActive">Active</mat-checkbox>
        </div>
      </form>

      <!-- Adjust Stock Form -->
      <div *ngIf="data.mode === 'adjust'">
        <div class="current-stock" *ngIf="data.item">
          <span>{{ data.item.name }}</span>
          <strong>{{ data.item.currentStock }} units</strong>
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
  gap: 0.6rem;
  margin: 0;
  padding: 18px 24px;
  font-size: 21px;
  font-weight: 600;
  color: var(--text-primary, #172033);
  border-bottom: 1px solid var(--border-color, #e0e0e0);
}

h2[mat-dialog-title] mat-icon {
  color: var(--accent-primary, #1f3b64);
  font-size: 23px;
  width: 23px;
  height: 23px;
}

mat-dialog-content {
  width: 680px;
  max-width: 680px;
  min-width: 680px;
  padding: 22px 24px 10px !important;
  box-sizing: border-box;
  overflow-x: hidden;
  background: var(--bg-card, #fff);
}

.full-width {
  width: 100%;
}

.form-row {
  display: flex;
  gap: 14px;
  margin-bottom: 4px;
}

.form-row mat-form-field {
  flex: 1;
  min-width: 0;
}

mat-form-field {
  font-size: 14px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 0 8px;
  padding-bottom: 7px;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  font-size: 12px;
  font-weight: 700;
  color: var(--accent-primary, #1f3b64);
  text-transform: uppercase;
  letter-spacing: 0.7px;
}

.section-label::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  border-radius: 4px;
  background: var(--accent-primary, #1f3b64);
}

.checkboxes {
  display: flex;
  gap: 24px;
  align-items: center;
  margin-top: 8px;
  padding: 12px 14px;
  background: var(--bg-hover, #f5f5f5);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
}

.current-stock {
  background: linear-gradient(135deg, var(--bg-hover, #eef6ff), var(--bg-card, #f7fbff));
  border: 1px solid var(--border-color, #e0e0e0);
  padding: 14px 16px;
  border-radius: 10px;
  margin-bottom: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-stock span {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary, #475569);
}

.current-stock strong {
  font-size: 17px;
  font-weight: 700;
  color: var(--accent-primary, #1f3b64);
}

mat-dialog-actions {
  padding: 14px 24px 18px !important;
  margin: 0 !important;
  border-top: 1px solid var(--border-color, #e0e0e0);
  background: var(--bg-hover, #f5f5f5);
}

mat-dialog-actions button {
  min-width: 90px;
  height: 40px;
  border-radius: 7px;
}

mat-dialog-actions button[color="primary"] {
  min-width: 105px;
}

textarea {
  resize: vertical;
}

@media (max-width: 720px) {
  mat-dialog-content {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .checkboxes {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
} 
  `]
})
export class ItemDialogComponent implements OnInit {
  itemForm!: FormGroup;
  adjustForm!: FormGroup;
  categories: any[] = [];
  saving = false;
  currencySymbol = '';

  get modeIcon(): string {
    if (this.data.mode === 'add') return 'add_box';
    if (this.data.mode === 'edit') return 'edit';
    return 'tune';
  }

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private notification: NotificationService,
    private tenantService: TenantService,
    public dialogRef: MatDialogRef<ItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemDialogData
  ) {
    this.currencySymbol = tenantService.getCurrencySymbol();
  }

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
        code: [item?.code || '', Validators.required],
        categoryId: [item?.categoryId || ''],
        genericName: [item?.genericName || ''],
        brandName: [item?.brandName || ''],
        strength: [item?.strength || ''],
        form: [item?.form || ''],
        purchaseUnit: [item?.purchaseUnit || 'pcs'],
        saleUnit: [item?.saleUnit || 'pcs'],
        purchasePrice: [item?.purchasePrice || 0, Validators.min(0)],
        sellingPrice: [item?.sellingPrice || 0, Validators.min(0)],
        costPrice: [item?.costPrice || 0],
        mrp: [item?.mrp || 0],
        taxPercent: [item?.taxPercent || 0],
        currentStock: [item?.currentStock || 0, Validators.min(0)],
        reorderLevel: [item?.reorderLevel || 10],
        isMedicine: [item?.isMedicine ?? true],
        requiresPrescription: [item?.requiresPrescription ?? false],
        isActive: [item?.isActive ?? true]
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
      const raw = this.itemForm.value;
      const formValue: any = {};
      for (const key of Object.keys(raw)) {
        const v = raw[key];
        if (v === '' || v === undefined) {
          formValue[key] = null;
        } else {
          formValue[key] = v;
        }
      }
      const request = this.data.mode === 'edit'
        ? this.api.put('v1/inventory/items', this.data.item.id, formValue)
        : this.api.post('v1/inventory/items', formValue);

      request.subscribe({
        next: (res: any) => {
          this.notification.success(this.data.mode === 'edit' ? 'Item updated' : 'Item added');
          const createdItem = this.data.mode === 'edit' ? this.data.item : (res?.data || res);
          this.dialogRef.close(createdItem);
        },
        error: () => { this.saving = false; }
      });
    }
  }
}
