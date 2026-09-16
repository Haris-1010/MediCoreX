import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-category-list',
  template: `
    <app-main-layout>
      <app-page-header title="Service Categories" [breadcrumbs]="[{ label: 'Services', route: '/services' }, { label: 'Categories' }]">
        <button mat-raised-button color="primary" (click)="openDialog()"><mat-icon>add</mat-icon> Add Category</button>
      </app-page-header>

      <div class="card">
        <table mat-table [dataSource]="categories">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let c">{{ c.name }}</td>
          </ng-container>
          <ng-container matColumnDef="code">
            <th mat-header-cell *matHeaderCellDef>Code</th>
            <td mat-cell *matCellDef="let c">{{ c.code }}</td>
          </ng-container>
          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let c">{{ c.description || '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let c">
              <span class="status-chip" [class.active]="c.isActive">{{ c.isActive ? 'Active' : 'Inactive' }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let c">
              <button mat-icon-button (click)="openDialog(c)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button (click)="deleteCategory(c)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <p class="empty" *ngIf="categories.length === 0">No categories found. Add one to organize your services.</p>
      </div>
    </app-main-layout>

    <ng-template #dialogRef>
      <h2 mat-dialog-title>{{ editingCategory ? 'Edit' : 'Add' }} Category</h2>
      <mat-dialog-content>
        <form [formGroup]="form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Name *</mat-label>
            <input matInput formControlName="name" placeholder="e.g., Laboratory">
            <mat-error>Required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Code</mat-label>
            <input matInput formControlName="code" placeholder="e.g., LAB">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="2"></textarea>
          </mat-form-field>
          <mat-slide-toggle formControlName="isActive" color="primary">Active</mat-slide-toggle>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" (click)="saveCategory()" [disabled]="form.invalid || saving">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
      </mat-dialog-actions>
    </ng-template>
  `,
  styles: [`
    .card { background: white; padding: 1.5rem; border-radius: 8px; }
    table { width: 100%; }
    .status-chip { padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; background: #ffcdd2; color: #c62828; }
    .status-chip.active { background: #c8e6c9; color: #2e7d32; }
    .empty { text-align: center; color: #888; padding: 2rem; }
    .full-width { width: 100%; }
  `]
})
export class CategoryListComponent implements OnInit {
  @ViewChild('dialogRef') dialogRef!: TemplateRef<any>;

  categories: any[] = [];
  columns = ['name', 'code', 'description', 'status', 'actions'];
  form!: FormGroup;
  editingCategory: any = null;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: [''],
      description: [''],
      isActive: [true]
    });
    this.loadCategories();
  }

  loadCategories() {
    this.api.get<any[]>('v1/service-categories').subscribe({
      next: (r) => this.categories = Array.isArray(r) ? r : ((r as any)?.data ?? [])
    });
  }

  openDialog(category?: any) {
    this.editingCategory = category || null;
    if (category) {
      this.form.patchValue({ name: category.name, code: category.code, description: category.description, isActive: category.isActive });
    } else {
      this.form.reset({ name: '', code: '', description: '', isActive: true });
    }
    this.dialog.open(this.dialogRef, { width: '450px', disableClose: true });
  }

  saveCategory() {
    if (this.form.invalid) return;
    this.saving = true;
    const req = this.editingCategory
      ? this.api.put('v1/service-categories', this.editingCategory.id, this.form.value)
      : this.api.post('v1/service-categories', this.form.value);
    req.subscribe({
      next: () => {
        this.saving = false;
        this.dialog.closeAll();
        this.notification.success(`Category ${this.editingCategory ? 'updated' : 'created'}`);
        this.loadCategories();
      },
      error: () => this.saving = false
    });
  }

  deleteCategory(category: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Category', message: `Are you sure you want to delete category "${category.name}"? This action cannot be undone.`, confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete('v1/service-categories', category.id).subscribe({
          next: () => { this.notification.success('Category deleted'); this.loadCategories(); }
        });
      }
    });
  }
}
