import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-discount-form',
  template: `
    <app-main-layout>
      <app-page-header [title]="isEdit ? 'Edit Discount' : 'New Discount'" [breadcrumbs]="[{ label: 'Billing', route: '/billing' }, { label: 'Discounts', route: '/billing/discounts' }, { label: isEdit ? 'Edit' : 'New' }]"></app-page-header>
      <div class="card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Discount Name</mat-label>
            <input matInput formControlName="name" placeholder="e.g. Senior Citizen, Loyalty, Staff">
            <mat-error *ngIf="form.get('name')?.hasError('required')">Name is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="2" placeholder="Optional description for this discount"></textarea>
          </mat-form-field>

          <div class="type-value-row">
            <mat-form-field appearance="outline">
              <mat-label>Discount Type</mat-label>
              <mat-select formControlName="type">
                <mat-option value="Flat">Flat (Fixed Amount)</mat-option>
                <mat-option value="Percent">Percentage (%)</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Value</mat-label>
              <input matInput type="number" formControlName="value" [placeholder]="form.get('type')?.value === 'Percent' ? 'e.g. 10' : 'e.g. 500'">
              <mat-hint *ngIf="form.get('type')?.value === 'Percent'">Enter percentage (0-100)</mat-hint>
              <mat-hint *ngIf="form.get('type')?.value === 'Flat'">Enter flat amount</mat-hint>
              <mat-error *ngIf="form.get('value')?.hasError('required')">Value is required</mat-error>
              <mat-error *ngIf="form.get('value')?.hasError('min')">Value must be greater than 0</mat-error>
              <mat-error *ngIf="form.get('type')?.value === 'Percent' && form.get('value')?.hasError('max')">Percentage cannot exceed 100</mat-error>
            </mat-form-field>
          </div>

          <div class="preview" *ngIf="form.get('value')?.value > 0">
            <strong>Preview:</strong>
            <span *ngIf="form.get('type')?.value === 'Percent'">
              {{ form.get('value')?.value / 100 | percent:'1.0-1' }} off the subtotal
            </span>
            <span *ngIf="form.get('type')?.value === 'Flat'">
              {{ form.get('value')?.value | currencyFormat }} off the subtotal
            </span>
          </div>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/billing/discounts">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}</button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card { background: white; padding: 1.5rem; border-radius: 8px; max-width: 600px; }
    .full-width { width: 100%; }
    .type-value-row { display: flex; gap: 1rem; }
    .type-value-row mat-form-field { flex: 1; }
    .preview { padding: 1rem; background: #f5f5f5; border-radius: 8px; margin: 1rem 0; font-size: 0.9rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; }
  `]
})
export class DiscountFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      type: ['Flat', Validators.required],
      value: [0, [Validators.required, Validators.min(0.01)]]
    });

    this.form.get('type')?.valueChanges.subscribe(type => {
      const valCtrl = this.form.get('value');
      if (type === 'Percent') {
        valCtrl?.setValidators([Validators.required, Validators.min(0.01), Validators.max(100)]);
      } else {
        valCtrl?.setValidators([Validators.required, Validators.min(0.01)]);
      }
      valCtrl?.updateValueAndValidity();
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.api.getById<any>('v1/discounts', id).subscribe(d => {
        this.form.patchValue({ name: d.name, description: d.description || '', type: d.type, value: d.value });
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;
    const req = this.isEdit
      ? this.api.put('v1/discounts', this.route.snapshot.paramMap.get('id')!, this.form.value)
      : this.api.post('v1/discounts', this.form.value);
    req.subscribe({
      next: () => { this.notification.success(this.isEdit ? 'Discount updated' : 'Discount created'); this.router.navigate(['/billing/discounts']); },
      error: () => this.saving = false
    });
  }
}
