import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-root',
  template: `
    <div class="app-loading" *ngIf="isLoading">
      <mat-spinner diameter="50"></mat-spinner>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .app-loading {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(255, 255, 255, 0.8);
      z-index: 9999;
    }
  `]
})
export class AppComponent implements OnInit {
  isLoading = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isLoading = false;
      }
    });
  }
}
