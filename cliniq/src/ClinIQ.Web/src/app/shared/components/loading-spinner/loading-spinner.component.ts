import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-loading-spinner',
  template: `
    <div class="loading-container" [class.overlay]="overlay">
      <mat-spinner [diameter]="diameter"></mat-spinner>
      <p *ngIf="message" class="loading-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }

    .loading-container.overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      z-index: 100;
    }

    .loading-message {
      margin-top: 1rem;
      color: #666;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() diameter: number = 40;
  @Input() message?: string;
  @Input() overlay: boolean = false;
}
