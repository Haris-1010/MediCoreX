import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-result-entry',
  template: `
    <app-main-layout>
      <app-page-header title="Enter Lab Results" [breadcrumbs]="[{ label: 'Laboratory', route: '/laboratory' }, { label: 'Results' }]"></app-page-header>
      <div class="results-grid" *ngIf="order">
        <div class="card patient-info">
          <h3>Order Information</h3>
          <div class="info-row"><span>Order #:</span><strong>{{ order.orderNumber }}</strong></div>
          <div class="info-row"><span>Patient:</span><strong>{{ order.patientName }}</strong></div>
          <div class="info-row"><span>MRN:</span><strong>{{ order.mrn }}</strong></div>
          <div class="info-row"><span>Ordered By:</span><strong>Dr. {{ order.orderedBy }}</strong></div>
          <div class="info-row"><span>Date:</span><strong>{{ order.orderDate | date:'mediumDate' }}</strong></div>
        </div>
        <div class="card results-form">
          <h3>Test Results</h3>
          <div class="test-result" *ngFor="let test of order.tests">
            <h4>{{ test.testName }}</h4>
            <div class="parameters">
              <div class="param" *ngFor="let param of test.parameters">
                <mat-form-field appearance="outline"><mat-label>{{ param.name }}</mat-label><input matInput [(ngModel)]="param.value" [placeholder]="param.unit"></mat-form-field>
                <span class="range">Range: {{ param.normalRange }}</span>
                <mat-icon *ngIf="isAbnormal(param)" color="warn">warning</mat-icon>
              </div>
            </div>
          </div>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Comments</mat-label><textarea matInput [(ngModel)]="comments" rows="3"></textarea></mat-form-field>
          <div class="form-actions">
            <button mat-stroked-button routerLink="/laboratory">Cancel</button>
            <button mat-stroked-button (click)="save()">Save Draft</button>
            <button mat-raised-button color="primary" (click)="complete()" [disabled]="saving">{{ saving ? 'Processing...' : 'Complete & Publish' }}</button>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`.results-grid { display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }
    .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee; } .info-row span { color: #666; }
    .test-result { margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #eee; }
    .test-result h4 { margin: 0 0 1rem; color: #3f51b5; }
    .parameters { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .param { display: flex; align-items: center; gap: 0.5rem; } .param mat-form-field { flex: 1; } .range { font-size: 0.75rem; color: #666; }
    .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }`]
})
export class ResultEntryComponent implements OnInit {
  order: any; comments = ''; saving = false;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router, private notification: NotificationService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.api.getById<any>('v1/laboratory/orders', id).subscribe(r => this.order = r);
  }

  isAbnormal(param: any): boolean {
    if (!param.value || !param.normalRange) return false;
    const [min, max] = param.normalRange.split('-').map((n: string) => parseFloat(n));
    const val = parseFloat(param.value);
    return val < min || val > max;
  }

  save() {
    this.api.put('v1/laboratory/orders', this.order.id, { tests: this.order.tests, comments: this.comments, status: 'InProgress' }).subscribe(() => this.notification.success('Draft saved'));
  }

  complete() {
    this.saving = true;
    this.api.post(`v1/laboratory/orders/${this.order.id}/complete`, { tests: this.order.tests, comments: this.comments }).subscribe({
      next: () => { this.notification.success('Results published'); this.router.navigate(['/laboratory']); },
      error: () => this.saving = false
    });
  }
}
