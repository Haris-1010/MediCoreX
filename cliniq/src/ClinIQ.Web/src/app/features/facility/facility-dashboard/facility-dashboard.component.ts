import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-facility-dashboard',
  template: `
    <app-main-layout>
      <app-page-header title="Facility Management" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Facility' }]"></app-page-header>
      <mat-tab-group>
        <mat-tab label="Buildings">
          <div class="tab-content">
            <div class="empty-state" *ngIf="buildings.length === 0">
              <mat-icon>business</mat-icon>
              <h4>No Buildings</h4>
              <p>Buildings will appear here once registered.</p>
            </div>
            <div class="facility-grid" *ngIf="buildings.length > 0">
              <div class="facility-card" *ngFor="let b of buildings">
                <mat-icon>business</mat-icon>
                <h4>{{ b.name }}</h4>
                <p>{{ b.floors }} floors</p>
              </div>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Wards">
          <div class="tab-content">
            <div class="empty-state" *ngIf="wards.length === 0">
              <mat-icon>hotel</mat-icon>
              <h4>No Wards</h4>
              <p>Ward information will appear here once configured.</p>
            </div>
            <table mat-table [dataSource]="wards" *ngIf="wards.length > 0">
              <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Ward Name</th><td mat-cell *matCellDef="let w">{{ w.name }}</td></ng-container>
              <ng-container matColumnDef="type"><th mat-header-cell *matHeaderCellDef>Type</th><td mat-cell *matCellDef="let w">{{ w.type }}</td></ng-container>
              <ng-container matColumnDef="beds"><th mat-header-cell *matHeaderCellDef>Total Beds</th><td mat-cell *matCellDef="let w">{{ w.totalBeds }}</td></ng-container>
              <ng-container matColumnDef="available"><th mat-header-cell *matHeaderCellDef>Available</th><td mat-cell *matCellDef="let w">{{ w.availableBeds }}</td></ng-container>
              <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let w"><app-status-badge [status]="w.status"></app-status-badge></td></ng-container>
              <tr mat-header-row *matHeaderRowDef="wardColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: wardColumns;"></tr>
            </table>
          </div>
        </mat-tab>
        <mat-tab label="Rooms">
          <div class="tab-content">
            <p>Room management interface</p>
          </div>
        </mat-tab>
        <mat-tab label="Equipment">
          <div class="tab-content">
            <p>Equipment tracking interface</p>
          </div>
        </mat-tab>
      </mat-tab-group>
    </app-main-layout>
  `,
  styles: [`.tab-content { padding: 1.5rem; }
    .facility-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .facility-card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: var(--shadow-sm, 0 2px 4px rgba(0,0,0,0.1)); }
    .facility-card mat-icon { font-size: 48px; width: 48px; height: 48px; color: #3f51b5; }
    .facility-card h4 { margin: 0.5rem 0 0; } .facility-card p { margin: 0; color: var(--text-muted, #666); }
    table { width: 100%; background: var(--bg-card, #fff); }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 3rem; color: var(--text-muted, #999); background: var(--bg-card, #fff); border-radius: 8px; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 1rem; opacity: 0.5; }
    .empty-state h4 { margin: 0 0 0.5rem; color: var(--text-muted, #666); }
    .empty-state p { margin: 0; }`]
})
export class FacilityDashboardComponent implements OnInit {
  buildings: any[] = []; wards: any[] = [];
  wardColumns = ['name', 'type', 'beds', 'available', 'status'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<any[]>('v1/facility/buildings').subscribe(r => this.buildings = r);
    this.api.get<any[]>('v1/wards').subscribe(r => this.wards = r);
  }
}
