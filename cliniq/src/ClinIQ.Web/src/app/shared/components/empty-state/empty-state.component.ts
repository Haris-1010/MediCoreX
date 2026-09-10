import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-empty-state',
  template: `
    <div class="empty-state">
      <mat-icon>{{ icon }}</mat-icon>
      <h3>{{ title }}</h3>
      <p *ngIf="message">{{ message }}</p>
      <button mat-raised-button color="primary" *ngIf="actionText" (click)="onAction()">
        <mat-icon *ngIf="actionIcon">{{ actionIcon }}</mat-icon>
        {{ actionText }}
      </button>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      text-align: center;
    }

    mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 1rem;
    }

    h3 {
      margin: 0 0 0.5rem;
      color: #333;
      font-weight: 500;
    }

    p {
      margin: 0 0 1.5rem;
      color: #666;
      max-width: 400px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon: string = 'inbox';
  @Input() title: string = 'No data found';
  @Input() message?: string;
  @Input() actionText?: string;
  @Input() actionIcon?: string;
  @Output() action = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }
}
