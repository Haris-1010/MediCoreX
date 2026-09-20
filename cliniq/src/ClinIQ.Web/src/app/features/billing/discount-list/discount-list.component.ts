import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-discount-list',
  template: `
    <app-main-layout>
      <app-page-header title="Discount Templates" [breadcrumbs]="[{ label: 'Billing', route: '/billing' }, { label: 'Discounts' }]">
        <button mat-raised-button color="primary" routerLink="new"><mat-icon>add</mat-icon> New Discount</button>
      </app-page-header>
      <div class="card">
        <table mat-table [dataSource]="discounts">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let d">{{ d.name }}</td>
          </ng-container>
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let d">
              <mat-chip-listbox>
                <mat-chip [color]="d.type === 'Percent' ? 'accent' : 'primary'" selected>{{ d.type === 'Percent' ? '%' : 'Flat' }}</mat-chip>
              </mat-chip-listbox>
            </td>
          </ng-container>
          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef>Value</th>
            <td mat-cell *matCellDef="let d">
              {{ d.type === 'Percent' ? (d.value / 100 | percent:'1.0-1') : (d.value | currencyFormat) }}
            </td>
          </ng-container>
          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let d">{{ d.description || '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let d">
              <span class="status-badge" [class.active]="d.isActive" [class.inactive]="!d.isActive">
                {{ d.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let d">
              <button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item [routerLink]="[d.id, 'edit']"><mat-icon>edit</mat-icon> Edit</button>
                <button mat-menu-item (click)="toggleStatus(d)">
                  <mat-icon>{{ d.isActive ? 'block' : 'check_circle' }}</mat-icon>
                  {{ d.isActive ? 'Deactivate' : 'Activate' }}
                </button>
                <button mat-menu-item color="warn" (click)="deleteDiscount(d)"><mat-icon>delete</mat-icon> Delete</button>
              </mat-menu>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <div *ngIf="discounts.length === 0" class="empty-state">
          <mat-icon>local_offer</mat-icon>
          <p>No discount templates yet. Create one to get started.</p>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    table { width: 100%; }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .status-badge.active { background: #e8f5e9; color: #2e7d32; }
    .status-badge.inactive { background: #fbe9e7; color: #c62828; }
    .empty-state { text-align: center; padding: 3rem; color: var(--text-secondary, #666); }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; color: var(--text-muted, #ccc); }
  `]
})
export class DiscountListComponent implements OnInit {
  discounts: any[] = [];
  columns = ['name', 'type', 'value', 'description', 'status', 'actions'];

  constructor(private api: ApiService, private router: Router, private notification: NotificationService, private dialog: MatDialog) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.get<any[]>('v1/discounts').subscribe(r => this.discounts = r);
  }

  toggleStatus(discount: any) {
    this.api.post<any>(`v1/discounts/${discount.id}/toggle`, {}).subscribe({
      next: () => { this.notification.success(`Discount ${discount.isActive ? 'deactivated' : 'activated'}`); this.load(); },
      error: () => this.notification.error('Failed to update discount')
    });
  }

  deleteDiscount(discount: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Discount', message: `Are you sure you want to delete discount "${discount.name}"? This action cannot be undone.`, confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete<any>(`v1/discounts`, discount.id).subscribe({
          next: () => { this.notification.success('Discount deleted'); this.load(); },
          error: () => this.notification.error('Failed to delete discount')
        });
      }
    });
  }
}
