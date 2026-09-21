import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-radiology-report-entry',
  template: `
    <app-main-layout>
      <app-page-header title="Enter Radiology Report" [breadcrumbs]="[{ label: 'Radiology', route: '/radiology' }, { label: 'Reporting', route: '/radiology/reporting' }, { label: order?.orderNumber || 'Report' }]"></app-page-header>

      <div *ngIf="!order && !error" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="error" class="loading-container">
        <mat-icon style="font-size:48px;width:48px;height:48px;color:#ef4444;">error_outline</mat-icon>
        <p>Failed to load order.</p>
        <button mat-raised-button color="primary" routerLink="/radiology/reporting">Back to Reporting</button>
      </div>

      <div *ngIf="order" class="report-page">
        <div class="report-grid">
          <div class="card order-info">
            <h3>Order Information</h3>
            <div class="info-row"><span>Order #:</span><strong>{{ order.orderNumber }}</strong></div>
            <div class="info-row"><span>Patient:</span><strong>{{ order.patientName }}</strong></div>
            <div class="info-row"><span>MRN:</span><strong>{{ order.mrn }}</strong></div>
            <div class="info-row"><span>Ordered By:</span><strong>Dr. {{ order.orderedBy }}</strong></div>
            <div class="info-row"><span>Priority:</span><strong><app-status-badge [status]="order.priority"></app-status-badge></strong></div>
            <div class="info-row" *ngIf="order.clinicalIndication"><span>Clinical Indication:</span><strong>{{ order.clinicalIndication }}</strong></div>
            <div class="info-row" *ngIf="order.specialInstructions"><span>Special Instructions:</span><strong>{{ order.specialInstructions }}</strong></div>
          </div>
          <div class="card report-form">
            <h3>Radiology Report</h3>
            <div class="report-items">
              <div class="report-item" *ngFor="let item of reportItems; let i = index">
                <h4>{{ item.serviceName }} <small>({{ item.modality }} - {{ item.bodyPart }})</small></h4>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Technique</mat-label>
                  <textarea matInput [(ngModel)]="item.technique" rows="2" placeholder="Describe the technique used"></textarea>
                </mat-form-field>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Findings *</mat-label>
                  <textarea matInput [(ngModel)]="item.findings" rows="6" placeholder="Describe radiological findings"></textarea>
                </mat-form-field>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Impression *</mat-label>
                  <textarea matInput [(ngModel)]="item.impression" rows="3" placeholder="Summary impression"></textarea>
                </mat-form-field>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Recommendations</mat-label>
                  <textarea matInput [(ngModel)]="item.recommendations" rows="2" placeholder="Any recommendations"></textarea>
                </mat-form-field>
                <mat-checkbox [(ngModel)]="item.isAbnormal" color="warn">Abnormal Findings</mat-checkbox>
              </div>
            </div>
            <div class="checkbox-row" *ngIf="reportItems.length === 0">
              <mat-checkbox [(ngModel)]="abnormalFindings" color="warn">Abnormal Findings</mat-checkbox>
            </div>
            <div class="form-actions">
              <button mat-stroked-button routerLink="/radiology">Cancel</button>
              <button mat-stroked-button (click)="saveDraft()" [disabled]="!canSaveDraft || saving">{{ saving ? 'Saving...' : 'Save Draft' }}</button>
              <button mat-raised-button color="primary" (click)="submitReport()" [disabled]="!canSubmit || saving">{{ saving ? 'Submitting...' : 'Submit Report' }}</button>
            </div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; gap: 1rem; }
    .report-page { max-width: 1000px; }
    .report-grid { display: grid; grid-template-columns: 320px 1fr; gap: 1.5rem; }
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    .card h3 { margin: 0 0 1rem; font-size: 1.1rem; }
    .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color, #eee); }
    .info-row span { color: var(--text-secondary, #666); }
    .full-width { width: 100%; }
    .report-item { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #e8eaf6; }
    .report-item h4 { margin: 0 0 1rem; color: var(--accent-primary, #3f51b5); }
    .report-item h4 small { color: var(--text-secondary, #666); }
    .checkbox-row { margin-bottom: 1rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
  `]
})
export class RadiologyReportEntryComponent implements OnInit {
  order: any;
  reportItems: any[] = [];
  abnormalFindings = false;
  saving = false;
  error = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getById<any>('v1/radiology/orders', id).subscribe({
        next: r => {
          this.order = r;
          this.reportItems = (r.items || []).map((item: any) => ({
            ...item,
            technique: item.technique || '',
            findings: item.findings || '',
            impression: item.impression || '',
            recommendations: item.recommendations || '',
            isAbnormal: item.isAbnormal || false
          }));
        },
        error: (err) => { this.error = true; this.notification.error(err?.message || 'Failed to load radiology order'); }
      });
    }
  }

  get canSaveDraft(): boolean {
    return this.reportItems.some(i => i.findings || i.impression);
  }

  get canSubmit(): boolean {
    return this.reportItems.every(i => i.findings && i.impression);
  }

  saveDraft() {
    if (!this.order || !this.canSaveDraft) return;
    this.saving = true;
    this.api.post(`v1/radiology/orders/${this.order.id}/save-report`, {
      reportedById: this.auth.getCurrentUser()?.id || null,
      saveAsDraft: true,
      items: this.reportItems.map(i => ({
        orderItemId: i.id,
        technique: i.technique,
        findings: i.findings,
        impression: i.impression,
        recommendations: i.recommendations,
        isAbnormal: i.isAbnormal
      }))
    }).subscribe({
      next: () => { this.notification.success('Draft saved'); this.router.navigate(['/radiology']); },
      error: (err) => { this.saving = false; this.notification.error(err?.message || 'Failed to save draft'); }
    });
  }

  submitReport() {
    if (!this.order || !this.canSubmit) return;
    this.saving = true;
    this.api.post(`v1/radiology/orders/${this.order.id}/save-report`, {
      reportedById: this.auth.getCurrentUser()?.id || null,
      saveAsDraft: false,
      items: this.reportItems.map(i => ({
        orderItemId: i.id,
        technique: i.technique,
        findings: i.findings,
        impression: i.impression,
        recommendations: i.recommendations,
        isAbnormal: i.isAbnormal
      }))
    }).subscribe({
      next: () => { this.notification.success('Report submitted for verification'); this.router.navigate(['/radiology']); },
      error: (err) => { this.saving = false; this.notification.error(err?.message || 'Failed to submit report'); }
    });
  }
}
