import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-main-layout',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav
                   class="sidenav"
                   [mode]="(isHandset$ | async) ? 'over' : 'side'"
                   [opened]="!(isHandset$ | async)"
                   [fixedInViewport]="true"
                   fixedTopGap="64">
        <app-sidebar (menuItemClick)="onMenuItemClick()"></app-sidebar>
      </mat-sidenav>

      <mat-sidenav-content class="sidenav-content">
        <app-header (menuToggle)="sidenav.toggle()"></app-header>
        <main class="main-content">
          <ng-content></ng-content>
        </main>
        <app-footer></app-footer>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 260px;
      background: #ffffff;
      border-right: 1px solid #e0e0e0;
    }

    .sidenav-content {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
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
export class MainLayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isHandset$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(result => result.matches),
      shareReplay()
    );
  }

  ngOnInit(): void {}

  onMenuItemClick(): void {
    this.isHandset$.subscribe(isHandset => {
      if (isHandset) {
        this.sidenav.close();
      }
    });
  }
}
