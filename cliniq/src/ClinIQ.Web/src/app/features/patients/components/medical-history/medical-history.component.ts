import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-medical-history',
  template: `
    <div class="medical-history">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      <div *ngIf="!loading && history.length === 0" class="empty">
        <mat-icon>history</mat-icon>
        <p>No medical history recorded</p>
      </div>
      <mat-accordion *ngIf="!loading && history.length > 0">
        <mat-expansion-panel *ngFor="let record of history">
          <mat-expansion-panel-header>
            <mat-panel-title>{{ record.diagnosis }}</mat-panel-title>
            <mat-panel-description>{{ record.date | date:'mediumDate' }} - Dr. {{ record.doctorName }}</mat-panel-description>
          </mat-expansion-panel-header>
          <div class="record-content">
            <div class="section"><h5>Chief Complaint</h5><p>{{ record.chiefComplaint }}</p></div>
            <div class="section"><h5>Treatment</h5><p>{{ record.treatment }}</p></div>
            <div class="section" *ngIf="record.prescription"><h5>Prescription</h5><p>{{ record.prescription }}</p></div>
            <div class="section" *ngIf="record.notes"><h5>Notes</h5><p>{{ record.notes }}</p></div>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: [`
    .medical-history { padding: 1rem 0; }
    .empty { text-align: center; padding: 2rem; color: #666; }
    .empty mat-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; }
    .record-content { padding: 1rem 0; }
    .section { margin-bottom: 1rem; }
    .section h5 { margin: 0 0 0.25rem; color: #666; font-size: 0.75rem; text-transform: uppercase; }
    .section p { margin: 0; }
  `]
})
export class MedicalHistoryComponent implements OnInit {
  @Input() patientId!: string;
  history: any[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<any[]>(`v1/patients/${this.patientId}/medical-history`).subscribe({
      next: (data) => { this.history = data; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
