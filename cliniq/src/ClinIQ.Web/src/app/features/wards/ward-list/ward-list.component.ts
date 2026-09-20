import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-ward-list',
  template: `
    <app-main-layout>
      <app-page-header title="Wards" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Wards' }]">
        <button mat-raised-button color="primary" (click)="addWard()">
          <mat-icon>add</mat-icon> Add Ward
        </button>
      </app-page-header>

      <div class="ward-stats">
        <div class="stat-card">
          <mat-icon>bed</mat-icon>
          <div><span class="stat-value">{{ wards.length }}</span><span class="stat-label">Total Wards</span></div>
        </div>
        <div class="stat-card">
          <mat-icon>single_bed</mat-icon>
          <div><span class="stat-value">{{ totalBeds }}</span><span class="stat-label">Total Beds</span></div>
        </div>
        <div class="stat-card available">
          <mat-icon>check_circle</mat-icon>
          <div><span class="stat-value">{{ totalAvailable }}</span><span class="stat-label">Available</span></div>
        </div>
        <div class="stat-card occupied">
          <mat-icon>block</mat-icon>
          <div><span class="stat-value">{{ totalOccupied }}</span><span class="stat-label">Occupied</span></div>
        </div>
      </div>

      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search wards..." (search)="onSearch($event)"></app-search-input>
        </div>

        <div *ngIf="loading" class="loading-container"><mat-spinner diameter="40"></mat-spinner></div>

        <div *ngIf="!loading && filteredWards.length === 0" class="empty-state">
          <mat-icon class="empty-icon">hotel</mat-icon>
          <h3>No Wards</h3>
          <p>Create your first ward to get started.</p>
          <button mat-raised-button color="primary" (click)="addWard()"><mat-icon>add</mat-icon> Add Ward</button>
        </div>

        <div class="ward-grid" *ngIf="!loading && filteredWards.length > 0">
          <div class="ward-card" *ngFor="let w of filteredWards">
            <div class="ward-header">
              <div class="ward-avatar">{{ w.name.charAt(0) }}</div>
              <div class="ward-info">
                <h3>{{ w.name }}</h3>
                <span class="ward-code">{{ w.code }} · {{ w.wardType }}</span>
              </div>
              <button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="viewBeds(w)"><mat-icon>bed</mat-icon> View Beds</button>
                <button mat-menu-item (click)="deleteWard(w)" class="delete-action"><mat-icon color="warn">delete</mat-icon> Delete</button>
              </mat-menu>
            </div>
            <div class="ward-details">
              <div class="detail-row"><span>Building:</span><span>{{ w.buildingName || '—' }}</span></div>
              <div class="detail-row"><span>Floor:</span><span>{{ w.floorName || '—' }}</span></div>
              <div class="detail-row"><span>Rooms:</span><span>{{ w.roomCount }}</span></div>
            </div>
            <div class="bed-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="getOccupancyPercent(w)"></div>
              </div>
              <div class="bed-counts">
                <span class="available">{{ w.availableBeds }} available</span>
                <span class="occupied">{{ w.occupiedBeds }} occupied</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; margin-top: 1rem; }
    .ward-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
    .stat-card { background: var(--bg-card, #fff); padding: 1.25rem; border-radius: 8px; display: flex; align-items: center; gap: 1rem; }
    .stat-card mat-icon { font-size: 28px; width: 28px; height: 28px; color: #1a237e; }
    .stat-card.available mat-icon { color: #2e7d32; }
    .stat-card.occupied mat-icon { color: #c62828; }
    .stat-value { display: block; font-size: 1.5rem; font-weight: 700; color: var(--text-primary, #333); }
    .stat-label { font-size: 0.75rem; color: var(--text-muted, #999); }
    .loading-container { display: flex; justify-content: center; padding: 3rem; }
    .empty-state { text-align: center; padding: 3rem; color: var(--text-muted, #666); }
    .empty-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; margin-bottom: 1rem; }
    .empty-state h3 { margin: 0 0 0.5rem; color: var(--text-primary, #333); }
    .empty-state p { margin: 0 0 1.5rem; }
    .ward-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; margin-top: 0.5rem; }
    .ward-card { background: var(--bg-hover, #f5f5f5); border: 1px solid var(--border-color, #e0e0e0); border-radius: 10px; padding: 1.25rem; transition: box-shadow 0.2s; }
    .ward-card:hover { box-shadow: var(--shadow-md, 0 2px 12px rgba(0,0,0,0.08)); }
    .ward-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
    .ward-avatar { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #1a237e, #0d47a1); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; }
    .ward-info { flex: 1; }
    .ward-info h3 { margin: 0; font-size: 1rem; }
    .ward-code { font-size: 0.75rem; color: var(--text-muted, #999); }
    .ward-details { margin-bottom: 1rem; }
    .detail-row { display: flex; justify-content: space-between; padding: 0.25rem 0; font-size: 0.85rem; color: var(--text-muted, #666); }
    .bed-progress { margin-top: auto; }
    .progress-bar { height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden; margin-bottom: 0.5rem; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #2e7d32, #66bb6a); border-radius: 3px; transition: width 0.3s; }
    .bed-counts { display: flex; justify-content: space-between; font-size: 0.75rem; }
    .bed-counts .available { color: #2e7d32; }
    .bed-counts .occupied { color: #c62828; }
  `]
})
export class WardListComponent implements OnInit {
  wards: any[] = [];
  filteredWards: any[] = [];
  loading = false;
  searchTerm = '';
  totalBeds = 0;
  totalAvailable = 0;
  totalOccupied = 0;

  constructor(
    private api: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.get<any[]>('v1/wards').subscribe({
      next: (data) => {
        this.wards = data;
        this.totalBeds = data.reduce((s: number, w: any) => s + (w.totalBeds || 0), 0);
        this.totalAvailable = data.reduce((s: number, w: any) => s + (w.availableBeds || 0), 0);
        this.totalOccupied = data.reduce((s: number, w: any) => s + (w.occupiedBeds || 0), 0);
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load wards'); }
    });
  }

  onSearch(term: string) { this.searchTerm = term; this.applyFilter(); }

  applyFilter() {
    if (!this.searchTerm) { this.filteredWards = [...this.wards]; return; }
    const t = this.searchTerm.toLowerCase();
    this.filteredWards = this.wards.filter(w => w.name.toLowerCase().includes(t) || (w.code && w.code.toLowerCase().includes(t)));
  }

  getOccupancyPercent(w: any): number {
    if (!w.totalBeds) return 0;
    return Math.round((w.occupiedBeds / w.totalBeds) * 100);
  }

  addWard() { this.router.navigate(['/wards/new']); }

  viewBeds(w: any) { this.router.navigate(['/wards', w.id, 'beds']); }

  deleteWard(w: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Ward', message: `Delete "${w.name}"?`, confirmText: 'Delete', cancelText: 'Cancel' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete('v1/wards', w.id).subscribe({
          next: () => { this.notification.success('Ward deleted'); this.load(); },
          error: () => { this.notification.error('Failed to delete ward'); }
        });
      }
    });
  }
}
