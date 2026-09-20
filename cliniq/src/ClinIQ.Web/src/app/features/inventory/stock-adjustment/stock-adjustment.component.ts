import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-stock-adjustment',
  template: `
    <app-main-layout>
      <app-page-header title="Stock Adjustment" [breadcrumbs]="[{ label: 'Inventory', route: '/inventory' }, { label: 'Adjustments' }]"></app-page-header>
      <div class="card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width"><mat-label>Item</mat-label>
            <input matInput [matAutocomplete]="itemAuto" formControlName="itemSearch">
            <mat-autocomplete #itemAuto="matAutocomplete" [displayWith]="displayItem" (optionSelected)="onItemSelected($event)">
              <mat-option *ngFor="let i of filteredItems" [value]="i">{{ i.name }} ({{ i.code }})</mat-option>
            </mat-autocomplete>
          </mat-form-field>
          <div class="current-stock" *ngIf="selectedItem"><span>Current Stock:</span><strong>{{ selectedItem.currentStock }} units</strong></div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Adjustment Type</mat-label>
              <mat-select formControlName="adjustmentType"><mat-option value="Add">Add (+)</mat-option><mat-option value="Remove">Remove (-)</mat-option><mat-option value="Set">Set to</mat-option></mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Quantity</mat-label><input matInput type="number" formControlName="quantity" min="1"></mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Reason</mat-label>
            <mat-select formControlName="reason"><mat-option value="Damaged">Damaged</mat-option><mat-option value="Expired">Expired</mat-option><mat-option value="Lost">Lost</mat-option><mat-option value="Found">Found</mat-option><mat-option value="Correction">Correction</mat-option><mat-option value="Received">Received (PO)</mat-option><mat-option value="Other">Other</mat-option></mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Notes</mat-label><textarea matInput formControlName="notes" rows="2"></textarea></mat-form-field>
          <div class="form-actions"><button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : 'Submit Adjustment' }}</button></div>
        </form>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    .form-row { display: flex; gap: 1rem; } .form-row mat-form-field { flex: 1; } .full-width { width: 100%; }
    .current-stock { background: #e3f2fd; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; justify-content: space-between; }
    .form-actions { margin-top: 1rem; }`]
})
export class StockAdjustmentComponent implements OnInit {
  form!: FormGroup; saving = false;
  filteredItems: any[] = []; selectedItem: any = null;

  constructor(private fb: FormBuilder, private api: ApiService, private notification: NotificationService) {}

  ngOnInit() {
    this.form = this.fb.group({ itemId: ['', Validators.required], itemSearch: [''], adjustmentType: ['Add', Validators.required], quantity: ['', [Validators.required, Validators.min(1)]], reason: ['', Validators.required], notes: [''] });
    this.form.get('itemSearch')?.valueChanges.subscribe(val => {
      if (typeof val === 'string' && val.length >= 2) this.api.get<any[]>('v1/inventory/items/search', { term: val }).subscribe(r => this.filteredItems = r);
    });
  }

  displayItem(i: any): string { return i ? `${i.name} (${i.code})` : ''; }
  onItemSelected(e: any) { this.selectedItem = e.option.value; this.form.patchValue({ itemId: e.option.value.id }); }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;
    this.api.post('v1/inventory/adjustments', this.form.value).subscribe({
      next: () => { this.notification.success('Stock adjusted'); this.form.reset(); this.selectedItem = null; this.saving = false; },
      error: () => this.saving = false
    });
  }
}
