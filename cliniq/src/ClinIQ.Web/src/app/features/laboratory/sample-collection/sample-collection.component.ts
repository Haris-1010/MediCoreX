import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-sample-collection',
  template: `
    <app-main-layout>
      <app-page-header title="Sample Collection" [breadcrumbs]="[{ label: 'Laboratory', route: '/laboratory' }, { label: 'Sample Collection' }]"></app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search orders..." (search)="onSearch($event)"></app-search-input>
        </div>
        <table mat-table [dataSource]="filteredOrders">
          <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}<br><small>MRN: {{ o.mrn }}</small></td></ng-container>
          <ng-container matColumnDef="tests"><th mat-header-cell *matHeaderCellDef>Tests</th><td mat-cell *matCellDef="let o">
            <div *ngFor="let item of o.items" class="test-item">
              <span>{{ item.serviceName }}</span>
              <small>{{ item.sampleType }}</small>
            </div>
          </td></ng-container>
          <ng-container matColumnDef="priority"><th mat-header-cell *matHeaderCellDef>Priority</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.priority"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="orderedBy"><th mat-header-cell *matHeaderCellDef>Ordered By</th><td mat-cell *matCellDef="let o">Dr. {{ o.orderedBy }}</td></ng-container>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Order Date</th><td mat-cell *matCellDef="let o">{{ o.orderDate | date:'medium' }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th><td mat-cell *matCellDef="let o">
            <button mat-raised-button color="primary" (click)="openCollectDialog(o)">
              <mat-icon>science</mat-icon> Collect
            </button>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <div *ngIf="filteredOrders.length === 0" class="empty-state">
          <mat-icon>check_circle_outline</mat-icon>
          <p>No orders pending sample collection</p>
        </div>
      </div>

      <!-- Collect Sample Dialog -->
      <div class="dialog-overlay" *ngIf="showCollectDialog" (click)="showCollectDialog = false">
        <div class="dialog" (click)="$event.stopPropagation()">
          <h3>Collect Sample</h3>
          <div class="dialog-content" *ngIf="selectedOrder">
            <p><strong>Order:</strong> {{ selectedOrder.orderNumber }}</p>
            <p><strong>Patient:</strong> {{ selectedOrder.patientName }}</p>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Sample ID</mat-label>
                <input matInput [(ngModel)]="collectData.sampleId" placeholder="Auto-generated if empty">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Sample Type</mat-label>
                <mat-select [(ngModel)]="collectData.sampleType">
                  <mat-option value="Blood">Blood</mat-option>
                  <mat-option value="Urine">Urine</mat-option>
                  <mat-option value="Stool">Stool</mat-option>
                  <mat-option value="Serum">Serum</mat-option>
                  <mat-option value="Plasma">Plasma</mat-option>
                  <mat-option value="CSF">CSF</mat-option>
                  <mat-option value="Sputum">Sputum</mat-option>
                  <mat-option value="Swab">Swab</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Container</mat-label>
                <input matInput [(ngModel)]="collectData.container" placeholder="e.g. EDTA Tube, Plain Tube">
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notes</mat-label>
              <textarea matInput [(ngModel)]="collectData.notes" rows="2"></textarea>
            </mat-form-field>
            <div class="item-checkboxes">
              <label class="section-label">Select items to collect:</label>
              <mat-checkbox *ngFor="let item of selectableItems" [(ngModel)]="item.selected">
                {{ item.serviceName }} ({{ item.sampleType }})
              </mat-checkbox>
            </div>
          </div>
          <div class="dialog-actions">
            <button mat-stroked-button (click)="showCollectDialog = false">Cancel</button>
            <button mat-raised-button color="primary" (click)="collectSample()" [disabled]="collecting">
              {{ collecting ? 'Collecting...' : 'Collect Sample' }}
            </button>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    .filters { display: flex; gap: 1rem; margin-bottom: 1rem; }
    table { width: 100%; }
    .test-item { display: flex; flex-direction: column; }
    .test-item small { color: var(--text-secondary, #666); font-size: 0.75rem; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 2rem; color: var(--text-muted, #999); }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 0.5rem; }
    .dialog-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog { background: var(--bg-card, #fff); border-radius: 12px; padding: 1.5rem; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; }
    .dialog h3 { margin: 0 0 1rem; }
    .dialog-content { margin-bottom: 1rem; }
    .form-row { margin-bottom: 0.5rem; }
    .full-width { width: 100%; }
    .section-label { display: block; font-weight: 500; margin-bottom: 0.5rem; }
    .item-checkboxes { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
  `]
})
export class SampleCollectionComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  columns = ['orderNumber', 'patient', 'tests', 'priority', 'orderedBy', 'date', 'actions'];
  showCollectDialog = false;
  selectedOrder: any = null;
  selectableItems: any[] = [];
  collectData = { sampleId: '', sampleType: 'Blood', container: '', notes: '' };
  collecting = false;
  loading = false;
  searchTerm = '';

  constructor(private api: ApiService, private notification: NotificationService, private auth: AuthService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.get<any[]>('v1/laboratory/sample-collection').subscribe({
      next: r => { this.orders = r; this.applyFilter(); this.loading = false; },
      error: (err) => { this.loading = false; this.notification.error(err?.message || 'Failed to load pending orders'); }
    });
  }

  onSearch(term: string) { this.searchTerm = term; this.applyFilter(); }

  applyFilter() {
    if (!this.searchTerm) { this.filteredOrders = this.orders; return; }
    const t = this.searchTerm.toLowerCase();
    this.filteredOrders = this.orders.filter(o =>
      o.orderNumber.toLowerCase().includes(t) ||
      (o.patientName || '').toLowerCase().includes(t) ||
      (o.mrn || '').toLowerCase().includes(t)
    );
  }

  openCollectDialog(order: any) {
    this.selectedOrder = order;
    this.selectableItems = (order.items || []).map((item: any) => ({ ...item, selected: true }));
    this.collectData = { sampleId: '', sampleType: this.selectableItems[0]?.sampleType || 'Blood', container: '', notes: '' };
    this.showCollectDialog = true;
  }

  collectSample() {
    const selectedIds = this.selectableItems.filter(i => i.selected).map(i => i.id);
    if (selectedIds.length === 0) { this.notification.error('Select at least one item'); return; }
    this.collecting = true;
    this.api.post(`v1/laboratory/orders/${this.selectedOrder.id}/collect-sample`, {
      orderItemIds: selectedIds,
      sampleId: this.collectData.sampleId || null,
      sampleType: this.collectData.sampleType,
      container: this.collectData.container,
      collectedById: this.auth.getCurrentUser()?.id || null,
      notes: this.collectData.notes
    }).subscribe({
      next: () => { this.notification.success('Sample collected'); this.showCollectDialog = false; this.load(); this.collecting = false; },
      error: (err) => { this.collecting = false; this.notification.error(err?.message || 'Failed to collect sample'); }
    });
  }
}
