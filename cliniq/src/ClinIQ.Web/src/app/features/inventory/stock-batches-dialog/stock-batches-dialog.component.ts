import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-stock-batches-dialog',
  template: `
    <h2 mat-dialog-title>
      <mat-icon>inventory_2</mat-icon>
      Stock Batches - {{ data.itemName }}
    </h2>
    <mat-dialog-content>
      <div class="batches-container" *ngIf="batches.length > 0; else noBatches">
        <div class="batch-card" *ngFor="let batch of batches; let i = index"
             [class.expired]="batch.isExpired"
             [class.near-expiry]="batch.isNearExpiry">
          <div class="batch-header">
            <span class="batch-number">{{ batch.batchNumber || 'No Batch' }}</span>
            <span class="badge expired" *ngIf="batch.isExpired">EXPIRED</span>
            <span class="badge near-expiry" *ngIf="batch.isNearExpiry && !batch.isExpired">NEAR EXPIRY</span>
          </div>
          <div class="batch-fields">
            <div class="field">
              <label>Expiry Date</label>
              <div class="expiry-edit" *ngIf="editingIndex !== i">
                <span>{{ batch.expiryDate ? (batch.expiryDate | date:'mediumDate') : 'Not Set' }}</span>
                <button mat-icon-button color="primary" (click)="startEdit(i, batch)" matTooltip="Edit Expiry">
                  <mat-icon>edit</mat-icon>
                </button>
              </div>
              <div class="expiry-edit-active" *ngIf="editingIndex === i">
                <mat-form-field appearance="outline" class="expiry-input">
                  <input matInput [matDatepicker]="editPicker" [value]="editExpiryValue" (dateChange)="onEditDateChange($event)" readonly>
                  <mat-datepicker-toggle matSuffix [for]="editPicker"></mat-datepicker-toggle>
                </mat-form-field>
                <button mat-icon-button color="primary" (click)="saveExpiry(batch)" matTooltip="Save">
                  <mat-icon>check</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="cancelEdit()" matTooltip="Cancel">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            </div>
            <div class="field">
              <label>Available Qty</label>
              <span class="value">{{ batch.availableQuantity }}</span>
            </div>
            <div class="field">
              <label>Price</label>
              <span class="value">{{ batch.sellingPrice | currencyFormat }}</span>
            </div>
          </div>
          <div class="batch-location" *ngIf="batch.rackNumber || batch.shelfNumber">
            <mat-icon>place</mat-icon>
            Rack: {{ batch.rackNumber || '-' }} | Shelf: {{ batch.shelfNumber || '-' }}
          </div>
        </div>
      </div>
      <ng-template #noBatches>
        <div class="no-batches">
          <mat-icon>inventory_2</mat-icon>
          <p>No stock batches found for this item</p>
        </div>
      </ng-template>
      <mat-datepicker #editPicker></mat-datepicker>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1a237e;
    }

    .batches-container {
      max-height: 400px;
      overflow-y: auto;
    }

    .batch-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-left: 4px solid #4caf50;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 0.75rem;
    }

    .batch-card.expired {
      border-left-color: #f44336;
      background: #fff5f5;
    }

    .batch-card.near-expiry {
      border-left-color: #ff9800;
      background: #fff8e1;
    }

    .batch-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 0.75rem;
    }

    .batch-number {
      font-weight: 600;
      color: #1a237e;
    }

    .badge {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .badge.expired {
      background: #ffebee;
      color: #c62828;
    }

    .badge.near-expiry {
      background: #fff3e0;
      color: #e65100;
    }

    .batch-fields {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .field label {
      font-size: 0.7rem;
      color: #7986cb;
      text-transform: uppercase;
      font-weight: 600;
    }

    .field .value {
      font-size: 0.9rem;
      font-weight: 500;
      color: #333;
    }

    .expiry-edit {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .expiry-edit-active {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .expiry-input {
      width: 160px;
    }

    ::ng-deep .expiry-input .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    .batch-location {
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px dashed #e0e0e0;
      font-size: 0.78rem;
      color: #7986cb;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .batch-location mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .no-batches {
      text-align: center;
      padding: 2rem;
      color: #9fa8da;
    }

    .no-batches mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 0.5rem;
    }
  `]
})
export class StockBatchesDialogComponent implements OnInit {
  batches: any[] = [];
  editingIndex: number = -1;
  editExpiryValue: Date | null = null;

  constructor(
    private api: ApiService,
    private notification: NotificationService,
    public dialogRef: MatDialogRef<StockBatchesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { itemId: string; itemName: string }
  ) {}

  ngOnInit() {
    this.loadBatches();
  }

  loadBatches() {
    this.api.get<any[]>(`v1/inventory/stock-batches/${this.data.itemId}`).subscribe({
      next: (batches) => this.batches = batches,
      error: () => this.notification.error('Failed to load batches')
    });
  }

  startEdit(index: number, batch: any) {
    this.editingIndex = index;
    this.editExpiryValue = batch.expiryDate ? new Date(batch.expiryDate) : new Date();
  }

  cancelEdit() {
    this.editingIndex = -1;
    this.editExpiryValue = null;
  }

  onEditDateChange(event: any) {
    if (event.value) {
      this.editExpiryValue = event.value;
    }
  }

  saveExpiry(batch: any) {
    if (!this.editExpiryValue) return;

    const d = this.editExpiryValue;
    const expiryStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    this.api.put('v1/inventory/stock-batches/expiry', batch.id, { expiryDate: expiryStr }).subscribe({
      next: () => {
        this.notification.success('Expiry date updated');
        this.cancelEdit();
        this.loadBatches();
      },
      error: () => this.notification.error('Failed to update expiry date')
    });
  }
}
