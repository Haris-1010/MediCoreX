import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-building-list',
  template: `
    <app-main-layout>
      <app-page-header title="Buildings" [breadcrumbs]="[{ label: 'Facility', route: '/facility' }, { label: 'Buildings' }]">
        <button mat-raised-button color="primary" (click)="showCreate = !showCreate">
          <mat-icon>add</mat-icon> Add Building
        </button>
      </app-page-header>

      <div *ngIf="showCreate" class="card create-form">
        <h3>{{ editId ? 'Edit' : 'New' }} Building</h3>
        <div class="form-row">
          <mat-form-field appearance="outline"><mat-label>Name *</mat-label><input matInput [(ngModel)]="formData.name"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Code</mat-label><input matInput [(ngModel)]="formData.code"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Floors</mat-label><input matInput type="number" [(ngModel)]="formData.numberOfFloors"></mat-form-field>
        </div>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Description</mat-label><textarea matInput [(ngModel)]="formData.description" rows="2"></textarea></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Address</mat-label><input matInput [(ngModel)]="formData.address"></mat-form-field>
        <div class="form-actions">
          <button mat-stroked-button (click)="cancelCreate()">Cancel</button>
          <button mat-raised-button color="primary" (click)="saveBuilding()" [disabled]="!formData.name">{{ editId ? 'Update' : 'Create' }}</button>
        </div>
      </div>

      <div class="card">
        <div *ngIf="loading" class="loading-container"><mat-spinner diameter="40"></mat-spinner></div>
        <div *ngIf="!loading && buildings.length === 0" class="empty-state">
          <mat-icon class="empty-icon">apartment</mat-icon>
          <h3>No Buildings</h3>
          <p>Add your first building to start managing facilities.</p>
        </div>
        <div class="building-grid" *ngIf="!loading && buildings.length > 0">
          <div class="building-card" *ngFor="let b of buildings">
            <div class="building-header">
              <div class="building-avatar">{{ b.name.charAt(0) }}</div>
              <div class="building-info">
                <h3>{{ b.name }}</h3>
                <span>{{ b.code || '—' }}</span>
              </div>
              <button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="editBuilding(b)"><mat-icon>edit</mat-icon> Edit</button>
                <button mat-menu-item (click)="deleteBuilding(b)"><mat-icon color="warn">delete</mat-icon> Delete</button>
              </mat-menu>
            </div>
            <p class="desc" *ngIf="b.description">{{ b.description }}</p>
            <div class="building-stats">
              <span><mat-icon>layers</mat-icon> {{ b.floorCount }} Floors</span>
              <span><mat-icon>bed</mat-icon> {{ b.bedCount }} Beds</span>
            </div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; margin-top: 1rem; }
    .create-form { margin-bottom: 1rem; }
    .create-form h3 { margin: 0 0 1rem; }
    .form-row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .form-row mat-form-field { flex: 1; min-width: 150px; }
    .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 0.5rem; }
    .loading-container { display: flex; justify-content: center; padding: 3rem; }
    .empty-state { text-align: center; padding: 3rem; color: var(--text-muted, #666); }
    .empty-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; }
    .building-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }
    .building-card { background: var(--bg-hover, #f5f5f5); border: 1px solid var(--border-color, #e0e0e0); border-radius: 10px; padding: 1.25rem; }
    .building-header { display: flex; align-items: center; gap: 0.75rem; }
    .building-avatar { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #0d47a1, #1565c0); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; }
    .building-info { flex: 1; }
    .building-info h3 { margin: 0; font-size: 1rem; }
    .building-info span { font-size: 0.75rem; color: var(--text-muted, #999); }
    .desc { font-size: 0.85rem; color: var(--text-muted, #666); margin: 0.75rem 0; }
    .building-stats { display: flex; gap: 1.5rem; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #eee; }
    .building-stats span { display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: var(--text-muted, #666); }
    .building-stats mat-icon { font-size: 16px; width: 16px; height: 16px; }
  `]
})
export class BuildingListComponent implements OnInit {
  buildings: any[] = [];
  loading = false;
  showCreate = false;
  editId: string | null = null;
  formData: any = { name: '', code: '', description: '', address: '', numberOfFloors: 1 };

  constructor(
    private api: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.get<any[]>('v1/facility/buildings').subscribe({
      next: (data) => { this.buildings = data; this.loading = false; },
      error: () => { this.loading = false; this.notification.error('Failed to load buildings'); }
    });
  }

  saveBuilding() {
    if (!this.formData.name) return;
    const req = this.editId
      ? this.api.put('v1/facility/buildings', this.editId, this.formData)
      : this.api.post('v1/facility/buildings', this.formData);
    req.subscribe({
      next: () => { this.notification.success(this.editId ? 'Building updated' : 'Building created'); this.cancelCreate(); this.load(); },
      error: () => { this.notification.error('Failed to save building'); }
    });
  }

  editBuilding(b: any) {
    this.editId = b.id;
    this.formData = { name: b.name, code: b.code, description: b.description, address: b.address, numberOfFloors: b.numberOfFloors };
    this.showCreate = true;
  }

  cancelCreate() {
    this.showCreate = false;
    this.editId = null;
    this.formData = { name: '', code: '', description: '', address: '', numberOfFloors: 1 };
  }

  deleteBuilding(b: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Building', message: `Delete "${b.name}"?`, confirmText: 'Delete', cancelText: 'Cancel' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete('v1/facility/buildings', b.id).subscribe({
          next: () => { this.notification.success('Building deleted'); this.load(); },
          error: () => { this.notification.error('Failed to delete building'); }
        });
      }
    });
  }
}
