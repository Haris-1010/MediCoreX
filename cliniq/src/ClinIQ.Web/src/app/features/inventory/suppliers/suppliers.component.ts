import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService, PagedResult } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService } from '../../../core/services/tenant.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-suppliers',
  template: `
    <app-main-layout>
      <app-page-header title="Suppliers" [breadcrumbs]="[{ label: 'Inventory', route: '/inventory' }, { label: 'Suppliers' }]">
        <button mat-raised-button color="primary" (click)="showForm = true; editId = null; resetForm()"><mat-icon>add</mat-icon> Add Supplier</button>
      </app-page-header>

      <!-- List View -->
      <div class="card" *ngIf="!showForm">
        <div class="filters">
          <app-search-input placeholder="Search suppliers..." (search)="onSearch($event)"></app-search-input>
        </div>
        <table mat-table [dataSource]="suppliers">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let s">{{ s.name }}</td></ng-container>
          <ng-container matColumnDef="code"><th mat-header-cell *matHeaderCellDef>Code</th><td mat-cell *matCellDef="let s">{{ s.code }}</td></ng-container>
          <ng-container matColumnDef="phone"><th mat-header-cell *matHeaderCellDef>Phone</th><td mat-cell *matCellDef="let s">{{ s.phone | phone }}</td></ng-container>
          <ng-container matColumnDef="email"><th mat-header-cell *matHeaderCellDef>Email</th><td mat-cell *matCellDef="let s">{{ s.email }}</td></ng-container>
          <ng-container matColumnDef="contact"><th mat-header-cell *matHeaderCellDef>Contact Person</th><td mat-cell *matCellDef="let s">{{ s.contactPersonName }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let s"><span [class]="s.isActive ? 'badge-active' : 'badge-inactive'">{{ s.isActive ? 'Active' : 'Inactive' }}</span></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let s"><button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button><mat-menu #menu="matMenu"><button mat-menu-item (click)="editSupplier(s)"><mat-icon>edit</mat-icon> Edit</button><button mat-menu-item (click)="deleteSupplier(s.id)"><mat-icon>delete</mat-icon> Delete</button></mat-menu></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>

      <!-- Create/Edit Form -->
      <div class="card" *ngIf="showForm">
        <h3>{{ editId ? 'Edit Supplier' : 'New Supplier' }}</h3>
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="flex-2"><mat-label>Name *</mat-label><input matInput formControlName="name"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Code</mat-label><input matInput formControlName="code"></mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput formControlName="email" type="email"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Phone</mat-label><input matInput formControlName="phone"></mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Address</mat-label><input matInput formControlName="address"></mat-form-field>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>City</mat-label><input matInput formControlName="city"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>State</mat-label><input matInput formControlName="state"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Country</mat-label><input matInput formControlName="country"></mat-form-field>
          </div>
          <div class="section-label">Contact Person</div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Name</mat-label><input matInput formControlName="contactPersonName"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Phone</mat-label><input matInput formControlName="contactPersonPhone"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput formControlName="contactPersonEmail"></mat-form-field>
          </div>
          <div class="section-label">Payment Terms</div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Payment Days</mat-label><input matInput type="number" formControlName="paymentTermsDays"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Credit Limit</mat-label><input matInput type="number" formControlName="creditLimit"><span matPrefix>&nbsp;{{ currencySymbol }}&nbsp;</span></mat-form-field>
          </div>
          <div class="form-row checkboxes">
            <mat-checkbox formControlName="isActive">Active</mat-checkbox>
          </div>
          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="showForm = false">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : 'Save' }}</button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; } .filters { display: flex; gap: 1rem; margin-bottom: 1rem; }
    table { width: 100%; } h3 { margin: 0 0 1rem; } .form-row { display: flex; gap: 1rem; margin-bottom: 0.25rem; } .form-row mat-form-field { flex: 1; }
    .flex-2 { flex: 2; } .full-width { width: 100%; } .section-label { font-size: 0.85rem; font-weight: 600; color: #3f51b5; margin: 1rem 0 0.25rem; }
    .checkboxes { gap: 1.5rem; align-items: center; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; }
    .badge-active { background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; }
    .badge-inactive { background: var(--status-error-bg, #ffebee); color: #c62828; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; }`]
})
export class SuppliersComponent implements OnInit {
  suppliers: any[] = [];
  columns = ['name', 'code', 'phone', 'email', 'contact', 'status', 'actions'];
  totalCount = 0; pageSize = 10; pageIndex = 0; searchTerm = '';
  showForm = false; editId: string | null = null; saving = false;
  form!: FormGroup;
  currencySymbol = '';

  constructor(private api: ApiService, private fb: FormBuilder, private notification: NotificationService, private tenantService: TenantService, private dialog: MatDialog) {
    this.currencySymbol = tenantService.getCurrencySymbol();
  }

  ngOnInit() {
    this.load();
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: [''],
      email: [''],
      phone: [''],
      address: [''],
      city: [''],
      state: [''],
      country: [''],
      contactPersonName: [''],
      contactPersonPhone: [''],
      contactPersonEmail: [''],
      paymentTermsDays: [30],
      creditLimit: [0],
      isActive: [true]
    });
  }

  load() {
    this.api.get<PagedResult<any>>('v1/suppliers', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm })
      .subscribe(r => { this.suppliers = r.items; this.totalCount = r.totalCount; });
  }

  onSearch(term: string) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
  onPage(e: any) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }

  resetForm() { this.form.reset({ isActive: true, paymentTermsDays: 30, creditLimit: 0 }); }

  editSupplier(s: any) {
    this.editId = s.id;
    this.showForm = true;
    this.api.getById<any>('v1/suppliers', s.id).subscribe(data => {
      this.form.patchValue(data);
    });
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;
    const req = this.editId
      ? this.api.put('v1/suppliers', this.editId, this.form.value)
      : this.api.post('v1/suppliers', this.form.value);
    req.subscribe({
      next: () => { this.notification.success(this.editId ? 'Supplier updated' : 'Supplier created'); this.showForm = false; this.load(); },
      error: () => { this.saving = false; }
    });
  }

  deleteSupplier(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Supplier', message: 'Are you sure you want to delete this supplier? This action cannot be undone.', confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete('v1/suppliers', id).subscribe({ next: () => { this.notification.success('Supplier deleted'); this.load(); } });
      }
    });
  }
}
