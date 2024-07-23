import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appIntersectionObserver]'
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  @Output() inView = new EventEmitter<void>();

  private observer: IntersectionObserver;
  private isActive: boolean = false;

  constructor(private element: ElementRef) { }

  ngOnInit(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.inView.emit();
        }
      });
    });

    this.observer.observe(this.element.nativeElement);
    this.isActive = true;
  }

  scrollObserverDisconnect() {
    this.observer.disconnect();
    // this.isActive = false;
  }

  ngOnDestroy(): void {
    // if (!this.isActive) {
    this.scrollObserverDisconnect();
    // }
  }
}
