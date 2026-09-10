import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  standalone: false,
  selector: '[appDebounceClick]'
})
export class DebounceClickDirective implements OnInit, OnDestroy {
  @Input() debounceTime: number = 500;
  @Output() debounceClick = new EventEmitter<MouseEvent>();

  private clicks = new Subject<MouseEvent>();
  private subscription!: Subscription;

  ngOnInit(): void {
    this.subscription = this.clicks.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(event => {
      this.debounceClick.emit(event);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}
