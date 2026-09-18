import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-radiology-report-entry',
  template: `
    <app-main-layout>
      <app-page-header title="Enter Radiology Report" [breadcrumbs]="[{ label: 'Radiology', route: '/radiology' }, { label: 'Report Entry' }]"></app-page-header>

      <div *ngIf="!order" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="order" class="report-page">
        <div class="report-grid">
          <div class="card order-info">
            <h3>Order Information</h3>
            <div class="info-row"><span>Order #:</span><strong>{{ order.orderNumber }}</strong></div>
            <div class="info-row"><span>Patient:</span><strong>{{ order.patientName }}</strong></div>
            <div class="info-row"><span>Modality:</span><strong>{{ order.modality }}</strong></div>
            <div class="info-row"><span>Body Part:</span><strong>{{ order.bodyPart }}</strong></div>
            <div class="info-row"><span>Priority:</span><strong><app-status-badge [status]="order.priority"></app-status-badge></strong></div>
            <div class="info-row"><span>Ordered By:</span><strong>Dr. {{ order.orderedBy }}</strong></div>
            <div class="info-row"><span>Clinical Indication:</span><strong>{{ order.clinicalIndication }}</strong></div>
          </div>
          <div class="card report-form">
            <h3>Radiology Report</h3>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Results *</mat-label>
              <textarea matInput [(ngModel)]="results" rows="8" placeholder="Enter detailed radiology findings and results"></textarea>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Result Notes</mat-label>
              <textarea matInput [(ngModel)]="resultNotes" rows="3" placeholder="Additional notes or comments"></textarea>
            </mat-form-field>
            <div class="checkbox-row">
              <mat-checkbox [(ngModel)]="abnormalFindings">Abnormal Findings</mat-checkbox>
            </div>
            <div class="form-actions">
              <button mat-stroked-button routerLink="/radiology">Cancel</button>
              <button mat-raised-button color="primary" (click)="complete()" [disabled]="!results || saving">
                {{ saving ? 'Saving...' : 'Save & Complete Report' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`.loading-container { display: flex; justify-content: center; padding: 4rem; }
    .report-page { max-width: 1000px; }
    .report-grid { display: grid; grid-template-columns: 320px 1fr; gap: 1.5rem; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; }
    .card h3 { margin: 0 0 1rem; font-size: 1.1rem; }
    .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee; }
    .info-row span { color: #666; }
    .full-width { width: 100%; }
    .checkbox-row { margin-bottom: 1rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }`]
})
export class RadiologyReportEntryComponent implements OnInit {
  order: any;
  results = '';
  resultNotes = '';
  abnormalFindings = false;
  saving = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getById<any>('v1/radiology/orders', id).subscribe(r => this.order = r);
    }
  }

  complete() {
    if (!this.results) return;
    this.saving = true;
    this.api.post(`v1/radiology/orders/${this.order.id}/complete`, {
      results: this.results,
      resultNotes: this.resultNotes || null,
      abnormalFindings: this.abnormalFindings
    }).subscribe({
      next: () => {
        this.notification.success('Report completed and saved');
        this.router.navigate(['/radiology']);
      },
      error: () => { this.saving = false; }
    });
  }
}
