import { Component } from '@angular/core';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  standalone: false,
  selector: 'app-main-layout',
  template: `
    <div class="layout-container">
      <aside class="sidenav" [class.collapsed]="layout.collapsed()">
        <app-sidebar [collapsed]="layout.collapsed()"></app-sidebar>
      </aside>

      <div class="content-area" [class.collapsed]="layout.collapsed()">
        <app-header (menuToggle)="layout.toggle()"></app-header>
        <main class="main-content">
          <ng-content></ng-content>
        </main>
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styles: [`
    .layout-container {
      height: 100vh;
      position: relative;
    }

    .sidenav {
      position: fixed;
      top: 64px;
      left: 0;
      bottom: 0;
      width: 260px;
      background: #ffffff;
      border-right: 1px solid #e0e0e0;
      transition: width 0.2s ease;
      overflow: visible;
      z-index: 900;
    }

    .sidenav.collapsed {
      width: 72px;
    }

    .content-area {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      margin-left: 260px;
      transition: margin-left 0.2s ease;
    }

    .content-area.collapsed {
      margin-left: 72px;
    }

    .main-content {
      flex: 1;
      padding: 1.5rem;
      background: #f5f5f5;
      margin-top: 64px;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 1rem;
      }
    }
  `]
})
export class MainLayoutComponent {
  constructor(public layout: LayoutService) {}
}