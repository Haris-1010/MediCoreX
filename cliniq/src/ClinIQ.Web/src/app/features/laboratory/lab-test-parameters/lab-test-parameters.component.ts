import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-lab-test-parameters',
  template: `
    <app-main-layout>
      <app-page-header title="Manage Test Parameters" [breadcrumbs]="[{ label: 'Laboratory', route: '/laboratory' }, { label: 'Test Parameters' }]"></app-page-header>
      <div class="card" *ngIf="service">
        <h3>{{ service.name }} <small>({{ service.code }})</small></h3>
        <p class="subtitle">Manage parameters for this laboratory test. Parameters define what values are measured and their reference ranges.</p>

        <table mat-table [dataSource]="parameters">
          <ng-container matColumnDef="order"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let p">{{ p.displayOrder }}</td></ng-container>
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Parameter</th><td mat-cell *matCellDef="let p"><strong>{{ p.name }}</strong><br><small>{{ p.code }}</small></td></ng-container>
          <ng-container matColumnDef="unit"><th mat-header-cell *matHeaderCellDef>Unit</th><td mat-cell *matCellDef="let p">{{ p.unit }}</td></ng-container>
          <ng-container matColumnDef="dataType"><th mat-header-cell *matHeaderCellDef>Type</th><td mat-cell *matCellDef="let p">{{ p.dataType }}</td></ng-container>
          <ng-container matColumnDef="normalRange"><th mat-header-cell *matHeaderCellDef>Normal Range</th><td mat-cell *matCellDef="let p">{{ p.normalRange }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let p">
            <button mat-icon-button color="primary" (click)="editParameter(p)"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button color="warn" (click)="deleteParameter(p)"><mat-icon>delete</mat-icon></button>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>

        <div *ngIf="parameters.length === 0" class="empty-state">
          <mat-icon>configuration</mat-icon>
          <p>No parameters configured. Add parameters to define test results.</p>
        </div>

        <button mat-raised-button color="primary" (click)="openAddDialog()" style="margin-top: 1rem;">
          <mat-icon>add</mat-icon> Add Parameter
        </button>
      </div>

      <!-- Add/Edit Dialog -->
      <div class="dialog-overlay" *ngIf="showDialog" (click)="showDialog = false">
        <div class="dialog" (click)="$event.stopPropagation()">
          <h3>{{ editingParameter ? 'Edit' : 'Add' }} Parameter</h3>
          <div class="dialog-content">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Name *</mat-label>
                <input matInput [(ngModel)]="paramForm.name" placeholder="e.g. Hemoglobin">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Code</mat-label>
                <input matInput [(ngModel)]="paramForm.code" placeholder="e.g. HGB">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Unit</mat-label>
                <input matInput [(ngModel)]="paramForm.unit" placeholder="e.g. g/dL">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Data Type</mat-label>
                <mat-select [(ngModel)]="paramForm.dataType">
                  <mat-option value="Numeric">Numeric</mat-option>
                  <mat-option value="Text">Text</mat-option>
                  <mat-option value="Boolean">Boolean</mat-option>
                  <mat-option value="Option">Option</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Normal Range</mat-label>
                <input matInput [(ngModel)]="paramForm.normalRange" placeholder="e.g. 13-17">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Display Order</mat-label>
                <input matInput type="number" [(ngModel)]="paramForm.displayOrder">
              </mat-form-field>
            </div>
            <div class="form-row" *ngIf="isNumericType()">
              <mat-form-field appearance="outline">
                <mat-label>Min Value</mat-label>
                <input matInput type="number" [(ngModel)]="paramForm.minValue">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Max Value</mat-label>
                <input matInput type="number" [(ngModel)]="paramForm.maxValue">
              </mat-form-field>
            </div>
            <div class="form-row" *ngIf="isNumericType()">
              <mat-form-field appearance="outline">
                <mat-label>Male Range</mat-label>
                <input matInput [(ngModel)]="paramForm.maleRange" placeholder="e.g. 14-18">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Female Range</mat-label>
                <input matInput [(ngModel)]="paramForm.femaleRange" placeholder="e.g. 12-16">
              </mat-form-field>
            </div>
            <div class="form-row" *ngIf="isNumericType()">
              <mat-form-field appearance="outline">
                <mat-label>Child Range</mat-label>
                <input matInput [(ngModel)]="paramForm.childRange" placeholder="e.g. 11-14">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Critical Low</mat-label>
                <input matInput type="number" [(ngModel)]="paramForm.criticalLow">
              </mat-form-field>
            </div>
            <div class="form-row" *ngIf="isNumericType()">
              <mat-form-field appearance="outline">
                <mat-label>Critical High</mat-label>
                <input matInput type="number" [(ngModel)]="paramForm.criticalHigh">
              </mat-form-field>
            </div>
            <div *ngIf="isOptionType()" class="options-section">
              <label class="section-label">Dropdown Options (one per line)</label>
              <textarea matInput [(ngModel)]="optionsText" rows="4" placeholder="Option 1&#10;Option 2&#10;Option 3" class="options-textarea"></textarea>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput [(ngModel)]="paramForm.description" rows="2"></textarea>
            </mat-form-field>
          </div>
          <div class="dialog-actions">
            <button mat-stroked-button (click)="showDialog = false">Cancel</button>
            <button mat-raised-button color="primary" (click)="saveParameter()" [disabled]="saving || !paramForm.name">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    .card h3 { margin: 0 0 0.25rem; }
    .subtitle { color: var(--text-secondary, #666); margin: 0 0 1rem; font-size: 0.85rem; }
    table { width: 100%; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 2rem; color: var(--text-muted, #999); }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 0.5rem; }
    .dialog-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog { background: var(--bg-card, #fff); border-radius: 12px; padding: 1.5rem; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; }
    .dialog h3 { margin: 0 0 1rem; }
    .form-row { display: flex; gap: 1rem; }
    .form-row mat-form-field { flex: 1; }
    .full-width { width: 100%; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
    .options-section { margin-bottom: 1rem; }
    .section-label { display: block; margin-bottom: 0.5rem; font-size: 0.85rem; color: var(--text-secondary, #666); }
    .options-textarea { width: 100%; border: 1px solid var(--border-color, #ccc); border-radius: 4px; padding: 0.5rem; font-family: inherit; resize: vertical; }
  `]
})
export class LabTestParametersComponent implements OnInit {
  serviceId = '';
  service: any = null;
  parameters: any[] = [];
  columns = ['order', 'name', 'unit', 'dataType', 'normalRange', 'actions'];
  showDialog = false;
  editingParameter: any = null;
  paramForm: any = {};
  saving = false;
  optionsText = '';

  constructor(private api: ApiService, private route: ActivatedRoute, private notification: NotificationService) {}

  ngOnInit() {
    this.serviceId = this.route.snapshot.paramMap.get('serviceId') || '';
    if (this.serviceId) {
      this.api.get<any>('v1/services').subscribe(r => {
        const services = Array.isArray(r) ? r : (r?.items || r?.data || []);
        this.service = services.find((s: any) => s.id === this.serviceId);
      });
      this.loadParameters();
    }
  }

  loadParameters() {
    this.api.get<any[]>(`v1/laboratory/services/${this.serviceId}/parameters`).subscribe(r => this.parameters = r);
  }

  isNumericType(): boolean {
    return this.normalizeDataType(this.paramForm.dataType) === 'numeric';
  }

  isOptionType(): boolean {
    return this.normalizeDataType(this.paramForm.dataType) === 'option';
  }

  private normalizeDataType(dt: any): string {
    return (dt || '').toString().toLowerCase();
  }

  openAddDialog() {
    this.editingParameter = null;
    this.paramForm = { name: '', code: '', unit: '', dataType: 'Numeric', normalRange: '', displayOrder: this.parameters.length + 1, minValue: null, maxValue: null, maleRange: '', femaleRange: '', childRange: '', criticalLow: null, criticalHigh: null, description: '', options: '' };
    this.optionsText = '';
    this.showDialog = true;
  }

  editParameter(param: any) {
    this.editingParameter = param;
    this.paramForm = { ...param };
    // Normalize dataType to PascalCase so mat-select matches the option value
    const rawDt = (param.dataType || '').toString().toLowerCase();
    if (rawDt === 'numeric' || rawDt === '1') this.paramForm.dataType = 'Numeric';
    else if (rawDt === 'text' || rawDt === '2') this.paramForm.dataType = 'Text';
    else if (rawDt === 'boolean' || rawDt === '3') this.paramForm.dataType = 'Boolean';
    else if (rawDt === 'option' || rawDt === '4') this.paramForm.dataType = 'Option';
    // Convert stored JSON options array to editable text (one per line)
    if (param.options) {
      try {
        const arr = JSON.parse(param.options);
        this.optionsText = Array.isArray(arr) ? arr.join('\n') : '';
      } catch {
        this.optionsText = param.options || '';
      }
    } else {
      this.optionsText = '';
    }
    this.showDialog = true;
  }

  saveParameter() {
    if (!this.paramForm.name) return;
    this.saving = true;

    // Build payload with proper DataType string value (always send PascalCase for backend parsing)
    const payload = { ...this.paramForm };
    const rawDt = (payload.dataType || '').toString();
    // Normalize to PascalCase for backend Enum.TryParse
    const dtLower = rawDt.toLowerCase();
    if (dtLower === 'numeric' || dtLower === '1') payload.dataType = 'Numeric';
    else if (dtLower === 'text' || dtLower === '2') payload.dataType = 'Text';
    else if (dtLower === 'boolean' || dtLower === '3') payload.dataType = 'Boolean';
    else if (dtLower === 'option' || dtLower === '4') payload.dataType = 'Option';

    // Convert options text to JSON array
    if (this.isOptionType() && this.optionsText.trim()) {
      const opts = this.optionsText.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
      payload.options = JSON.stringify(opts);
    } else if (!this.isOptionType()) {
      payload.options = '';
    }

    if (this.editingParameter) {
      this.api.put(`v1/laboratory/parameters`, this.editingParameter.id, payload).subscribe({
        next: () => { this.notification.success('Parameter saved'); this.showDialog = false; this.loadParameters(); this.saving = false; },
        error: () => { this.saving = false; }
      });
    } else {
      this.api.post(`v1/laboratory/services/${this.serviceId}/parameters`, payload).subscribe({
        next: () => { this.notification.success('Parameter saved'); this.showDialog = false; this.loadParameters(); this.saving = false; },
        error: () => { this.saving = false; }
      });
    }
  }

  deleteParameter(param: any) {
    if (!confirm('Deactivate this parameter?')) return;
    this.api.delete(`v1/laboratory/parameters`, param.id).subscribe({
      next: () => { this.notification.success('Parameter deactivated'); this.loadParameters(); },
      error: () => {}
    });
  }
}
