import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-inventory-dashboard',
  template: `
    <app-main-layout>
      <app-page-header title="Inventory" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Inventory' }]">
        <button mat-raised-button color="primary" routerLink="items"><mat-icon>inventory_2</mat-icon> Manage Items</button>
      </app-page-header>
      <div class="stats-grid">
        <div class="stat-card"><mat-icon>inventory</mat-icon><div><h3>{{ stats.totalItems }}</h3><p>Total Items</p></div></div>
        <div class="stat-card warn"><mat-icon>warning</mat-icon><div><h3>{{ stats.lowStock }}</h3><p>Low Stock</p></div></div>
        <div class="stat-card danger"><mat-icon>error</mat-icon><div><h3>{{ stats.outOfStock }}</h3><p>Out of Stock</p></div></div>
        <div class="stat-card"><mat-icon>event</mat-icon><div><h3>{{ stats.expiringItems }}</h3><p>Expiring Soon</p></div></div>
      </div>
      <div class="dashboard-grid">
        <div class="card"><h3>Low Stock Items</h3>
          <div class="item-list">
            <div class="item" *ngFor="let i of lowStockItems"><div class="info"><strong>{{ i.name }}</strong><span>{{ i.category }}</span></div><div class="stock" [class.critical]="i.quantity <= i.reorderLevel / 2">{{ i.quantity }} / {{ i.reorderLevel }}</div></div>
          </div>
        </div>
        <div class="card"><h3>Recent Purchase Orders</h3>
          <div class="order-list">
            <div class="order" *ngFor="let o of recentOrders"><div class="info"><strong>{{ o.poNumber }}</strong><span>{{ o.supplierName }}</span></div><app-status-badge [status]="o.status"></app-status-badge></div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }
    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; }
    .stat-card.warn mat-icon { color: #ff9800; } .stat-card.danger mat-icon { color: #f44336; }
    .stat-card h3 { margin: 0; font-size: 1.75rem; } .stat-card p { margin: 0; color: #666; }
    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }
    .item-list, .order-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .item, .order { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f5f5f5; border-radius: 8px; }
    .info strong { display: block; } .info span { font-size: 0.875rem; color: #666; }
    .stock { font-weight: 600; } .stock.critical { color: #f44336; }`]
})
export class InventoryDashboardComponent implements OnInit {
  stats = { totalItems: 0, lowStock: 0, outOfStock: 0, expiringItems: 0 };
  lowStockItems: any[] = []; recentOrders: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<any>('v1/inventory/stats').subscribe(r => this.stats = r);
    this.api.get<any[]>('v1/inventory/low-stock').subscribe(r => this.lowStockItems = r);
    this.api.get<any[]>('v1/purchase-orders/recent').subscribe(r => this.recentOrders = r);
  }
}
