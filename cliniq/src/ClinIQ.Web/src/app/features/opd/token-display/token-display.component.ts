import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SignalRService } from '../../../core/services/signalr.service';

@Component({
  standalone: false,
  selector: 'app-token-display',
  template: `
    <div class="display-container">
      <div class="header"><h1>OPD Queue Display</h1><p>{{ currentTime | date:'mediumTime' }}</p></div>
      <div class="display-grid">
        <div class="doctor-display" *ngFor="let d of doctors">
          <div class="doctor-name">Dr. {{ d.name }}</div>
          <div class="room-number">Room {{ d.roomNumber }}</div>
          <div class="current-token" [class.calling]="d.isCalling">
            <span class="label">Now Serving</span>
            <span class="token">{{ d.currentToken || '--' }}</span>
            <span class="patient">{{ d.currentPatient || 'Waiting' }}</span>
          </div>
        </div>
      </div>
      <div class="announcement" *ngIf="announcement">
        <mat-icon>volume_up</mat-icon>
        <span>{{ announcement }}</span>
      </div>
    </div>
  `,
  styles: [`.display-container { min-height: 100vh; background: linear-gradient(135deg, #1a237e 0%, #3f51b5 100%); color: white; padding: 2rem; }
    .header { text-align: center; margin-bottom: 2rem; } .header h1 { margin: 0; font-size: 2.5rem; } .header p { margin: 0; font-size: 1.5rem; opacity: 0.8; }
    .display-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
    .doctor-display { background: rgba(255,255,255,0.1); border-radius: 16px; padding: 1.5rem; text-align: center; }
    .doctor-name { font-size: 1.5rem; font-weight: 600; } .room-number { font-size: 1rem; opacity: 0.8; margin-bottom: 1rem; }
    .current-token { background: rgba(255,255,255,0.2); border-radius: 12px; padding: 1.5rem; }
    .current-token.calling { animation: pulse 1s infinite; background: #4caf50; }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
    .current-token .label { display: block; font-size: 0.875rem; opacity: 0.8; }
    .current-token .token { display: block; font-size: 4rem; font-weight: 700; line-height: 1.2; }
    .current-token .patient { display: block; font-size: 1.25rem; }
    .announcement { position: fixed; bottom: 0; left: 0; right: 0; background: #ff9800; padding: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1.25rem; animation: slideUp 0.3s; }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`]
})
export class TokenDisplayComponent implements OnInit, OnDestroy {
  currentTime = new Date();
  doctors: any[] = [];
  announcement: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private signalR: SignalRService) {}

  ngOnInit() {
    setInterval(() => this.currentTime = new Date(), 1000);
    this.signalR.tokenCalled$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      const doctor = this.doctors.find(d => d.id === data.doctorId);
      if (doctor) { doctor.currentToken = data.tokenNumber; doctor.currentPatient = data.patientName; doctor.isCalling = true; setTimeout(() => doctor.isCalling = false, 5000); }
      this.announcement = `Token ${data.tokenNumber} - ${data.patientName} - Please proceed to Room ${data.roomNumber}`;
      setTimeout(() => this.announcement = null, 10000);
    });
    this.doctors = [
      { id: '1', name: 'Smith', roomNumber: '101', currentToken: 15, currentPatient: 'John Doe', isCalling: false },
      { id: '2', name: 'Johnson', roomNumber: '102', currentToken: 8, currentPatient: 'Jane Smith', isCalling: false },
      { id: '3', name: 'Williams', roomNumber: '103', currentToken: null, currentPatient: null, isCalling: false }
    ];
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
}
