import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-result-entry',
  template: `
    <app-main-layout>
      <app-page-header title="Result Entry" [breadcrumbs]="[{ label: 'Laboratory', route: '/laboratory' }, { label: 'Result Entry' }]"></app-page-header>

      <!-- List View (no ID param) -->
      <div class="card" *ngIf="!orderId">
        <table mat-table [dataSource]="pendingOrders">
          <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}<br><small>MRN: {{ o.mrn }}</small></td></ng-container>
          <ng-container matColumnDef="tests"><th mat-header-cell *matHeaderCellDef>Tests</th><td mat-cell *matCellDef="let o">
            <span *ngFor="let item of o.items; let last = last">{{ item.serviceName }}<span *ngIf="!last">, </span></span>
          </td></ng-container>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Order Date</th><td mat-cell *matCellDef="let o">{{ o.orderDate | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let o">
            <button mat-raised-button color="primary" [routerLink]="['/laboratory/results', o.id]">
              <mat-icon>edit_note</mat-icon> Enter Results
            </button>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="listColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: listColumns;"></tr>
        </table>
        <div *ngIf="pendingOrders.length === 0" class="empty-state">
          <mat-icon>edit_note</mat-icon>
          <p>No orders pending result entry</p>
        </div>
      </div>

      <!-- Result Entry View (with ID param) -->
      <div *ngIf="orderId && !order && !error" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="error" class="loading-container">
        <mat-icon style="font-size:48px;width:48px;height:48px;color:#ef4444;">error_outline</mat-icon>
        <p>Failed to load order.</p>
        <button mat-raised-button color="primary" routerLink="/laboratory/result-entry">Back to Result Entry</button>
      </div>

      <div class="results-grid" *ngIf="orderId && order">
        <div class="card patient-info">
          <h3>Order Information</h3>
          <div class="info-row"><span>Order #:</span><strong>{{ order.orderNumber }}</strong></div>
          <div class="info-row"><span>Patient:</span><strong>{{ order.patientName }}</strong></div>
          <div class="info-row"><span>MRN:</span><strong>{{ order.mrn }}</strong></div>
          <div class="info-row"><span>Ordered By:</span><strong>Dr. {{ order.orderedBy }}</strong></div>
          <div class="info-row"><span>Date:</span><strong>{{ order.orderDate | date:'mediumDate' }}</strong></div>
          <div class="info-row"><span>Status:</span><strong><app-status-badge [status]="order.status"></app-status-badge></strong></div>
          <div class="info-row" *ngIf="order.clinicalIndication"><span>Indication:</span><strong>{{ order.clinicalIndication }}</strong></div>
        </div>

        <div class="card results-form">
          <h3>Test Results</h3>
          <div class="no-items" *ngIf="orderItems.length === 0"><p>No test items found for this order.</p></div>
          <div class="test-result" *ngFor="let item of orderItems; let ti = index">
            <div class="test-header">
              <h4>{{ item.serviceName }}</h4>
              <span class="sample-badge" *ngIf="item.sampleType">{{ item.sampleType }}</span>
              <span class="sample-badge info" *ngIf="item.sampleId">Sample: {{ item.sampleId }}</span>
            </div>
            <div class="parameters" *ngIf="item.parameters && item.parameters.length > 0">
              <div class="param" *ngFor="let param of item.parameters; let pi = index">
                <mat-form-field appearance="outline" class="param-field">
                  <mat-label>{{ param.parameterName }}</mat-label>
                  <input matInput [(ngModel)]="param.resultValue" [placeholder]="param.unit || 'Value'">
                </mat-form-field>
                <div class="param-meta">
                  <span class="range" *ngIf="param.normalRange">Ref: {{ param.normalRange }} {{ param.unit }}</span>
                  <mat-icon *ngIf="isAbnormal(param)" color="warn" class="warning-icon" matTooltip="Out of range">warning</mat-icon>
                </div>
              </div>
            </div>
            <div class="simple-test" *ngIf="!item.parameters || item.parameters.length === 0">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Result for {{ item.serviceName }}</mat-label>
                <textarea matInput [(ngModel)]="item.simpleResult" rows="2" placeholder="Enter result..."></textarea>
              </mat-form-field>
            </div>
          </div>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Comments</mat-label><textarea matInput [(ngModel)]="comments" rows="3"></textarea></mat-form-field>
          <div class="form-actions">
            <button mat-stroked-button routerLink="/laboratory/result-entry">Back</button>
            <button mat-raised-button color="primary" (click)="saveResults()" [disabled]="saving">{{ saving ? 'Saving...' : 'Save Results' }}</button>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .results-grid { display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem; }
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }
    .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color, #eee); } .info-row span { color: var(--text-secondary, #666); }
    .test-result { margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #eee; }
    .test-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .test-header h4 { margin: 0; color: var(--accent-primary, #3f51b5); }
    .sample-badge { font-size: 0.7rem; background: #e8eaf6; color: #3f51b5; padding: 2px 8px; border-radius: 12px; font-weight: 500; }
    .sample-badge.info { background: #e3f2fd; color: #1565c0; }
    .parameters { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem 1rem; }
    .param { display: flex; flex-direction: column; gap: 2px; }
    .param-field { margin-bottom: -1.5em !important; }
    .param-meta { display: flex; align-items: center; gap: 4px; }
    .range { font-size: 0.7rem; color: var(--text-secondary, #666); }
    .warning-icon { font-size: 16px; width: 16px; height: 16px; }
    .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 2rem; color: var(--text-muted, #999); }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 0.5rem; }
    .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; gap: 1rem; }
    table { width: 100%; }
  `]
})
export class ResultEntryComponent implements OnInit {
  orderId: string | null = null;
  order: any;
  orderItems: any[] = [];
  pendingOrders: any[] = [];
  listColumns = ['orderNumber', 'patient', 'tests', 'date', 'actions'];
  comments = '';
  saving = false;
  loading = false;
  error = false;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router, private notification: NotificationService, private auth: AuthService) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.loadOrder();
    } else {
      this.loadPendingOrders();
    }
  }

  loadPendingOrders() {
    this.loading = true;
    this.api.get<any[]>('v1/laboratory/result-entry').subscribe({
      next: r => { this.pendingOrders = r; this.loading = false; },
      error: (err) => { this.loading = false; this.notification.error(err?.message || 'Failed to load pending orders'); }
    });
  }

  loadOrder() {
    if (!this.orderId) return;
    this.api.getById<any>('v1/laboratory/orders', this.orderId).subscribe({
      next: r => {
        this.order = r;
        this.orderItems = (r.items || []).map((item: any) => ({
          ...item,
          parameters: item.parameters || [],
          simpleResult: ''
        }));
      },
      error: (err) => { this.error = true; this.notification.error(err?.message || 'Failed to load order'); }
    });
  }

  isAbnormal(param: any): boolean {
    if (!param.resultValue || !param.normalRange) return false;
    const val = parseFloat(param.resultValue);
    if (isNaN(val)) return false;
    const range = param.normalRange.replace(/[<>]/g, '');
    const parts = range.split('-');
    if (parts.length === 2) {
      const min = parseFloat(parts[0]);
      const max = parseFloat(parts[1]);
      if (!isNaN(min) && !isNaN(max)) return val < min || val > max;
    }
    return false;
  }

  saveResults() {
    if (!this.order) return;
    this.saving = true;
    const items = this.orderItems.map(item => ({
      orderItemId: item.id,
      parameters: item.parameters.map((p: any, idx: number) => ({
        parameterId: p.parameterId || p.id || null,
        parameterName: p.parameterName || p.name,
        parameterCode: p.parameterCode || p.code,
        resultValue: p.resultValue || '',
        unit: p.unit,
        normalRange: p.normalRange,
        dataType: p.dataType || 'Numeric',
        displayOrder: p.displayOrder || idx + 1
      }))
    }));
    this.api.post(`v1/laboratory/orders/${this.order.id}/save-results`, {
      enteredById: this.auth.getCurrentUser()?.id || null,
      items,
      comments: this.comments || null
    }).subscribe({
      next: () => { this.notification.success('Results saved successfully'); this.router.navigate(['/laboratory']); },
      error: (err) => { this.saving = false; this.notification.error(err?.message || 'Failed to save results'); }
    });
  }
}
