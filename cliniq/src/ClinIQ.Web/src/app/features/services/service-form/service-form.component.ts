import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { TenantService } from '../../../core/services/tenant.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ClinicalService, ServiceType, SERVICE_TYPE_OPTIONS } from '../models/service.model';

@Component({
  standalone: false,
  selector: 'app-service-form',
  template: `
    <app-main-layout>
      <app-page-header [title]="isEdit ? 'Edit Service' : 'Add Service'" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Services', route: '/services' }, { label: isEdit ? 'Edit' : 'Add' }]"></app-page-header>
      <div class="card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Service Name</mat-label>
              <input matInput formControlName="name" placeholder="e.g., Complete Blood Count">
              <mat-error *ngIf="form.get('name')?.hasError('required')">Name is required</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Code</mat-label>
              <input matInput formControlName="code" placeholder="e.g., LAB-CBC">
              <mat-error *ngIf="form.get('code')?.hasError('required')">Code is required</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3" placeholder="Describe the service..."></textarea>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Category</mat-label>
              <mat-select formControlName="categoryId" [compareWith]="compareCategory">
                <mat-option value="">None</mat-option>
                <mat-option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Service Type</mat-label>
              <mat-select formControlName="type">
                <mat-option *ngFor="let t of serviceTypeOptions" [value]="t.value">{{ t.label }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Price</mat-label>
              <input matInput type="number" formControlName="price" min="0">
              <span matPrefix>&nbsp;{{ currencySymbol }}&nbsp;</span>
              <mat-error *ngIf="form.get('price')?.hasError('required')">Price is required</mat-error>
              <mat-error *ngIf="form.get('price')?.hasError('min')">Price must be positive</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Tax %</mat-label>
              <input matInput type="number" formControlName="taxPercent" min="0" max="100">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Duration (minutes)</mat-label>
              <input matInput type="number" formControlName="durationMinutes" min="0">
            </mat-form-field>
            <mat-slide-toggle formControlName="isTaxable" color="primary">Taxable</mat-slide-toggle>
            <mat-slide-toggle formControlName="isActive" color="primary">Active</mat-slide-toggle>
          </div>
          <div class="form-actions">
            <button mat-button type="button" routerLink="/services">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">
              <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
              {{ isEdit ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: white; padding: 1.5rem; border-radius: 8px; max-width: 800px; } .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; } .full-width { grid-column: 1 / -1; } .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }`]
})
export class ServiceFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  saving = false;
  serviceId: string | null = null;
  categories: { id: string; name: string }[] = [];
  currencySymbol = '';
  serviceTypeOptions = SERVICE_TYPE_OPTIONS;

  private tenantService = inject(TenantService);

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      taxPercent: [0],
      durationMinutes: [0],
      isTaxable: [false],
      isActive: [true],
      type: [ServiceType.General]
    });
  }

  ngOnInit() {
    this.loadCurrencySymbol();
    this.loadCategories();
    this.serviceId = this.route.snapshot.paramMap.get('id');
    if (this.serviceId) {
      this.isEdit = true;
      this.api.getById<any>('v1/services', this.serviceId).subscribe(data => {
        this.form.patchValue(data);
      });
    }
  }

  private loadCategories() {
    this.api.get<any[]>('v1/service-categories').subscribe({
      next: (r) => {
        const list = Array.isArray(r) ? r : ((r as any)?.data ?? []);
        this.categories = list.map((c: any) => ({ id: c.id, name: c.name }));
      }
    });
  }

  private loadCurrencySymbol() {
    const currency = this.tenantService.getSetting('currency') || 'USD';
    try {
      const parts = new Intl.NumberFormat('en', { style: 'currency', currency }).formatToParts(0);
      this.currencySymbol = parts.find(p => p.type === 'currency')?.value || '';
    } catch {
      this.currencySymbol = '';
    }
  }

  compareCategory(a: any, b: any): boolean {
    return a && b ? a === b : a === b;
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.value;
    const payload = {
      name: v.name,
      code: v.code,
      description: v.description || null,
      categoryId: v.categoryId || null,
      departmentId: null,
      price: v.price,
      cost: null,
      minPrice: null,
      maxPrice: null,
      isTaxable: v.isTaxable,
      taxPercent: v.taxPercent || 0,
      isCoveredByInsurance: false,
      insuranceCode: null,
      durationMinutes: v.durationMinutes || null,
      isActive: v.isActive,
      displayOrder: 0,
      type: v.type
    };
    const request = this.isEdit
      ? this.api.put('v1/services', this.serviceId!, payload)
      : this.api.post('v1/services', payload);
    request.subscribe({
      next: () => this.router.navigate(['/services']),
      error: () => this.saving = false
    });
  }
}
