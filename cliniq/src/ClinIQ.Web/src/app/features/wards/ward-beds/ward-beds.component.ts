import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-ward-beds',
  template: `
    <app-main-layout>
      <app-page-header [title]="wardName + ' — Beds'" [breadcrumbs]="[{ label: 'Wards', route: '/wards' }, { label: wardName }]"></app-page-header>
      <div class="bed-stats">
        <div class="stat-pill available"><mat-icon>check_circle</mat-icon> {{ availableCount }} Available</div>
        <div class="stat-pill occupied"><mat-icon>block</mat-icon> {{ occupiedCount }} Occupied</div>
        <div class="stat-pill total"><mat-icon>bed</mat-icon> {{ beds.length }} Total</div>
      </div>
      <div class="card">
        <div *ngIf="loading" class="loading-container"><mat-spinner diameter="40"></mat-spinner></div>
        <div *ngIf="!loading && beds.length === 0" class="empty-state">
          <mat-icon class="empty-icon">bed</mat-icon>
          <h3>No Beds</h3>
          <p>This ward has no beds configured.</p>
        </div>
        <div class="bed-grid" *ngIf="!loading && beds.length > 0">
          <div class="bed-card" *ngFor="let b of beds" [class.available]="b.status === 'Available'" [class.occupied]="b.status === 'Occupied'" [class.maintenance]="b.status === 'Maintenance'">
            <div class="bed-icon"><mat-icon>single_bed</mat-icon></div>
            <div class="bed-number">{{ b.bedNumber }}</div>
            <div class="bed-room">Room {{ b.roomNumber || '—' }}</div>
            <div class="bed-type">{{ b.bedType }}</div>
            <div class="bed-status-badge" [class]="b.status.toLowerCase()">{{ b.status }}</div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card { background: white; padding: 1.5rem; border-radius: 8px; margin-top: 1rem; }
    .bed-stats { display: flex; gap: 1rem; }
    .stat-pill { display: flex; align-items: center; gap: 0.5rem; background: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.875rem; font-weight: 600; }
    .stat-pill.available { color: #2e7d32; border: 1px solid #a5d6a7; }
    .stat-pill.occupied { color: #c62828; border: 1px solid #ef9a9a; }
    .stat-pill.total { color: #1565c0; border: 1px solid #90caf9; }
    .stat-pill mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .loading-container { display: flex; justify-content: center; padding: 3rem; }
    .empty-state { text-align: center; padding: 3rem; color: #666; }
    .empty-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; }
    .bed-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .bed-card { border: 2px solid #e0e0e0; border-radius: 10px; padding: 1rem; text-align: center; transition: all 0.2s; }
    .bed-card.available { border-color: #a5d6a7; background: #f1f8e9; }
    .bed-card.occupied { border-color: #ef9a9a; background: #fce4ec; }
    .bed-card.maintenance { border-color: #fff9c4; background: #fffde7; }
    .bed-icon mat-icon { font-size: 32px; width: 32px; height: 32px; color: #1a237e; }
    .bed-number { font-size: 1.1rem; font-weight: 700; margin: 0.25rem 0; }
    .bed-room { font-size: 0.75rem; color: #999; }
    .bed-type { font-size: 0.75rem; color: #666; margin-bottom: 0.5rem; }
    .bed-status-badge { display: inline-block; padding: 0.1rem 0.5rem; border-radius: 8px; font-size: 0.7rem; font-weight: 600; }
    .bed-status-badge.available { background: #c8e6c9; color: #2e7d32; }
    .bed-status-badge.occupied { background: #ffcdd2; color: #c62828; }
    .bed-status-badge.maintenance { background: #fff9c4; color: #f57f17; }
  `]
})
export class WardBedsComponent implements OnInit {
  wardId = '';
  wardName = 'Ward';
  beds: any[] = [];
  loading = false;
  availableCount = 0;
  occupiedCount = 0;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.wardId = this.route.snapshot.paramMap.get('id') || '';
    this.loadBeds();
  }

  loadBeds() {
    this.loading = true;
    this.api.get<any[]>(`v1/wards/${this.wardId}/beds`).subscribe({
      next: (data) => {
        this.beds = data;
        this.availableCount = data.filter((b: any) => b.status === 'Available').length;
        this.occupiedCount = data.filter((b: any) => b.status === 'Occupied').length;
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load beds'); }
    });
  }
}
