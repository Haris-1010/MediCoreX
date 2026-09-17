import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly collapsed = signal(false);

  toggle(): void {
    this.collapsed.set(!this.collapsed());
  }
}