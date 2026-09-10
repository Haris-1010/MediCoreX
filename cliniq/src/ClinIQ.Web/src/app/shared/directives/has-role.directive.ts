import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  standalone: false,
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit, OnDestroy {
  @Input('appHasRole') role!: string | string[];
  @Input('appHasRoleElse') elseTemplate?: TemplateRef<any>;

  private destroy$ = new Subject<void>();
  private isVisible = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    const hasRole = this.checkRole();

    if (hasRole && !this.isVisible) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isVisible = true;
    } else if (!hasRole && this.isVisible) {
      this.viewContainer.clear();
      if (this.elseTemplate) {
        this.viewContainer.createEmbeddedView(this.elseTemplate);
      }
      this.isVisible = false;
    } else if (!hasRole && !this.isVisible && this.elseTemplate) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.elseTemplate);
    }
  }

  private checkRole(): boolean {
    if (!this.role) {
      return true;
    }

    if (Array.isArray(this.role)) {
      return this.authService.hasAnyRole(this.role);
    }

    return this.authService.hasRole(this.role);
  }
}
