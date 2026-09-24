import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-patient-card',
  template: `
    <div class="patient-card" (click)="cardClick.emit(patient)">
      <div class="avatar">{{ getInitials() }}</div>
      <div class="info">
        <h4>{{ patient.fullName }}</h4>
        <p>MRN: {{ patient.mrn }}</p>
        <p>{{ patient.gender }}, {{ patient.age }} years</p>
      </div>
      <app-status-badge [status]="patient.status"></app-status-badge>
    </div>
  `,
  styles: [`
    .patient-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-card, #fff); border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer; }
    .patient-card:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
    .avatar { width: 48px; height: 48px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }
    .info { flex: 1; }
    .info h4 { margin: 0; }
    .info p { margin: 0; font-size: 0.875rem; color: var(--text-secondary, #666); }
  `]
})
export class PatientCardComponent {
  @Input() patient: any;
  @Output() cardClick = new EventEmitter<any>();

  getInitials(): string {
    const name = (this.patient?.fullName
      || `${this.patient?.firstName || ''} ${this.patient?.lastName || ''}`.trim()).trim();
    if (!name) return '';
    const parts = name.split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}
