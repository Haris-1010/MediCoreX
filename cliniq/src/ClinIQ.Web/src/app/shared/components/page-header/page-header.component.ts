import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

@Component({
  standalone: false,
  selector: 'app-page-header',
  template: `
    <div class="page-header">
      <div class="header-left">
        <nav class="breadcrumb" *ngIf="breadcrumbs?.length">
          <ng-container *ngFor="let item of breadcrumbs; let last = last">
            <a *ngIf="item.route && !last" [routerLink]="item.route">{{ item.label }}</a>
            <span *ngIf="!item.route || last">{{ item.label }}</span>
            <mat-icon *ngIf="!last">chevron_right</mat-icon>
          </ng-container>
        </nav>
        <h1>{{ title }}</h1>
        <p *ngIf="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      <div class="header-right">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .header-left {
      flex: 1;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .breadcrumb a {
      color: #3f51b5;
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .breadcrumb mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
    }

    .subtitle {
      margin: 0.25rem 0 0;
      color: #666;
      font-size: 0.875rem;
    }

    .header-right {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
  `]
})
export class PageHeaderComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() breadcrumbs?: BreadcrumbItem[];
}
