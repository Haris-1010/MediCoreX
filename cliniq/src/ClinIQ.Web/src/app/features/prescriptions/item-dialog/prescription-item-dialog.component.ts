import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService } from '../../../core/services/tenant.service';

@Component({
  standalone: false,
  selector: 'app-prescription-item-dialog',
  template: `
    <h2 mat-dialog-title>
      <mat-icon>add_box</mat-icon>
      Quick Add Item
    </h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Item Name *</mat-label>
          <input matInput formControlName="name" placeholder="e.g. Amoxicillin">
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Code / SKU *</mat-label>
            <input matInput formControlName="code" placeholder="e.g. MED-001">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Generic Name</mat-label>
            <input matInput formControlName="genericName" placeholder="e.g. Amoxicillin">
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
              <mat-option value="Tablet">Tablet</mat-option>
              <mat-option value="Capsule">Capsule</mat-option>
              <mat-option value="Syrup">Syrup</mat-option>
              <mat-option value="Injection">Injection</mat-option>
              <mat-option value="Cream">Cream</mat-option>
              <mat-option value="Drops">Drops</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Purchase Price</mat-label>
            <input matInput type="number" formControlName="purchasePrice" min="0">
            <span matPrefix>&nbsp;{{ currencySymbol }}&nbsp;</span>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Selling Price</mat-label>
            <input matInput type="number" formControlName="sellingPrice" min="0">
            <span matPrefix>&nbsp;{{ currencySymbol }}&nbsp;</span>
          </mat-form-field>
        </div>

        <mat-checkbox formControlName="isMedicine" class="full-width">Is Medicine</mat-checkbox>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="saving">
        {{ saving ? 'Saving...' : 'Create & Use' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2[mat-dialog-title] { display: flex; align-items: center; gap: 0.5rem; }
    .full-width { width: 100%; }
    .form-row { display: flex; gap: 1rem; margin-bottom: 0.25rem; }
    .form-row mat-form-field { flex: 1; }
    mat-dialog-content { min-width: 400px; }
  `]
})
export class PrescriptionItemDialogComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  currencySymbol = '$';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private notification: NotificationService,
    private tenantService: TenantService,
    public dialogRef: MatDialogRef<PrescriptionItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currencySymbol = tenantService.getCurrencySymbol();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      genericName: [''],
      strength: [''],
      form: ['Tablet'],
      purchasePrice: [0],
      sellingPrice: [0],
      isMedicine: [true]
    });
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const raw = this.form.value;
    const payload: any = {};
    for (const key of Object.keys(raw)) {
      const v = raw[key];
      if (v === '' || v === undefined) {
        payload[key] = null;
      } else {
        payload[key] = v;
      }
    }

    this.api.post('v1/inventory/items', payload).subscribe({
      next: (res: any) => {
        this.notification.success('Item created');
        const createdItem = res?.data || res;
        this.dialogRef.close(createdItem);
      },
      error: () => { this.saving = false; }
    });
  }
}
