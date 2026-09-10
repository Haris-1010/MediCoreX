import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

interface InventoryOverview {
  totalProduct: number;
  expiryProduct: number;
  nearToExpire: number;
  nearToFinish: number;
}

@Component({
  standalone: false,
  selector: 'app-inventory-overview',
  template: `
    <div class="inventory-overview">
      <div class="overview-header">
        <h3><mat-icon>layers</mat-icon> Inventory Overview</h3>
        <a routerLink="/inventory">Go To Inventory <mat-icon>open_in_new</mat-icon></a>
      </div>

      <div *ngIf="loading" class="loading">Loading inventory...</div>
      <div *ngIf="!loading" class="overview-body">
        <div class="donut" [style.background]="donutBackground">
          <div class="donut-center">
            <strong>Total Product</strong>
            <span>{{ overview.totalProduct | number }}</span>
          </div>
        </div>
        <div class="legend">
          <div><i class="total"></i><span>Total Product ({{ overview.totalProduct | number }})</span></div>
          <div><i class="expired"></i><span>Expiry Product ({{ overview.expiryProduct | number }})</span></div>
          <div><i class="near-expiry"></i><span>Near To Expire ({{ overview.nearToExpire | number }})</span></div>
          <div><i class="near-finish"></i><span>Near To Finish ({{ overview.nearToFinish | number }})</span></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inventory-overview { min-height: 270px; }
    .overview-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
    .overview-header h3 { display: flex; align-items: center; gap: .5rem; margin: 0; color: #526b88; font-size: 1rem; }
    .overview-header h3 mat-icon { color: #41627f; }
    .overview-header a { display: flex; align-items: center; gap: .25rem; color: #222; font-size: .8rem; text-decoration: none; white-space: nowrap; }
    .overview-header a:hover { text-decoration: underline; }
    .overview-header a mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .overview-body { display: flex; align-items: center; justify-content: center; gap: 2.5rem; min-height: 210px; }
    .donut { width: 178px; height: 178px; border-radius: 50%; display: grid; place-items: center; transform: rotate(-90deg); }
    .donut::before { content: ''; width: 136px; height: 136px; border-radius: 50%; background: #fff; }
    .donut-center { position: absolute; display: flex; flex-direction: column; align-items: center; transform: rotate(90deg); color: #111; }
    .donut-center strong { font-size: 1rem; }
    .donut-center span { font-size: 1.35rem; margin-top: .25rem; }
    .legend { display: flex; flex-direction: column; gap: .8rem; font-size: .78rem; }
    .legend div { display: flex; align-items: center; gap: .55rem; }
    .legend i { width: 18px; height: 18px; display: inline-block; }
    .total { background: #1168a7; } .expired { background: #3b86bb; } .near-expiry { background: #6fa4ca; } .near-finish { background: #9abbd3; }
    .loading { min-height: 210px; display: grid; place-items: center; color: #6b7280; }
    @media (max-width: 640px) { .overview-body { flex-direction: column; gap: 1rem; } }
  `]
})
export class InventoryOverviewComponent implements OnInit {
  overview: InventoryOverview = { totalProduct: 0, expiryProduct: 0, nearToExpire: 0, nearToFinish: 0 };
  loading = true;

  constructor(private api: ApiService) {}

  get donutBackground(): string {
    const total = Math.max(this.overview.totalProduct, 1);
    const expired = (this.overview.expiryProduct / total) * 100;
    const nearExpiry = expired + (this.overview.nearToExpire / total) * 100;
    const nearFinish = nearExpiry + (this.overview.nearToFinish / total) * 100;
    return `conic-gradient(#1168a7 0 ${Math.min(expired, 100)}%, #3b86bb ${Math.min(expired, 100)}% ${Math.min(nearExpiry, 100)}%, #6fa4ca ${Math.min(nearExpiry, 100)}% ${Math.min(nearFinish, 100)}%, #9abbd3 ${Math.min(nearFinish, 100)}% 100%)`;
  }

  ngOnInit(): void {
    this.api.get<InventoryOverview>('v1/dashboard/inventory-overview').subscribe({
      next: (data) => { this.overview = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
