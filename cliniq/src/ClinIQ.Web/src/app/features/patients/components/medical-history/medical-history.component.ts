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
            <mat-panel-title>
              <span class="record-type" [class.visit]="record.type === 'Visit'" [class.prescription]="record.type === 'Prescription'">{{ record.type }}</span>
              {{ record.diagnosis || 'No diagnosis' }}
            </mat-panel-title>
            <mat-panel-description>{{ record.date | date:'mediumDate' }} - Dr. {{ record.doctorName }}</mat-panel-description>
          </mat-expansion-panel-header>
          <div class="record-content">
            <div class="section" *ngIf="record.chiefComplaint"><h5>Chief Complaint</h5><p>{{ record.chiefComplaint }}</p></div>
            <div class="section" *ngIf="record.treatment"><h5>Treatment</h5><p>{{ record.treatment }}</p></div>
            <div class="section" *ngIf="record.medicines && record.medicines.length > 0">
              <h5>Medications</h5>
              <div class="med-list">
                <div class="med-item" *ngFor="let med of record.medicines">
                  <div class="med-name">{{ med.medicineName }}</div>
                  <div class="med-details">
                    <span *ngIf="med.dosage"><mat-icon>science</mat-icon> {{ med.dosage }}</span>
                    <span *ngIf="med.frequency"><mat-icon>schedule</mat-icon> {{ formatFrequency(med.frequency) }}</span>
                    <span *ngIf="med.durationDays"><mat-icon>timer</mat-icon> {{ med.durationDays }} days</span>
                    <span *ngIf="med.quantity"><mat-icon>inventory_2</mat-icon> Qty: {{ med.quantity }}</span>
                  </div>
                  <div class="med-timing" *ngIf="med.timing">
                    <span *ngIf="med.timing.morning" class="timing-chip">Morning</span>
                    <span *ngIf="med.timing.afternoon" class="timing-chip">Afternoon</span>
                    <span *ngIf="med.timing.evening" class="timing-chip">Evening</span>
                    <span *ngIf="med.timing.night" class="timing-chip">Night</span>
                  </div>
                  <div class="med-instructions" *ngIf="med.instructions"><mat-icon>info</mat-icon> {{ med.instructions }}</div>
                </div>
              </div>
            </div>
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
    .record-type { 
      display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: 600; margin-right: 8px;
    }
    .record-type.visit { background: #e8eaf6; color: #3f51b5; }
    .record-type.prescription { background: #e8f5e9; color: #2e7d32; }
    .med-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .med-item { background: #f8f9fa; border-radius: 8px; padding: 0.75rem 1rem; border-left: 3px solid #4caf50; }
    .med-name { font-weight: 600; font-size: 0.95rem; color: #333; margin-bottom: 0.25rem; }
    .med-details { display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.8rem; color: #666; }
    .med-details span { display: flex; align-items: center; gap: 4px; }
    .med-details mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .med-timing { display: flex; gap: 0.4rem; margin-top: 0.4rem; }
    .timing-chip { background: #e3f2fd; color: #1565c0; padding: 2px 8px; border-radius: 8px; font-size: 0.7rem; font-weight: 500; }
    .med-instructions { margin-top: 0.4rem; font-size: 0.8rem; color: #888; display: flex; align-items: center; gap: 4px; }
    .med-instructions mat-icon { font-size: 14px; width: 14px; height: 14px; }
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

  formatFrequency(freq: string): string {
    const map: Record<string, string> = {
      'OnceDaily': 'Once Daily',
      'TwiceDaily': 'Twice Daily',
      'ThriceDaily': 'Thrice Daily',
      'FourTimesDaily': '4 Times Daily',
      'EveryFourHours': 'Every 4 Hours',
      'EverySixHours': 'Every 6 Hours',
      'EveryEightHours': 'Every 8 Hours',
      'EveryTwelveHours': 'Every 12 Hours',
      'BeforeMeals': 'Before Meals',
      'AfterMeals': 'After Meals',
      'AtBedtime': 'At Bedtime',
      'AsNeeded': 'As Needed',
      'Weekly': 'Weekly',
      'Custom': 'Custom'
    };
    return map[freq] || freq;
  }
}
