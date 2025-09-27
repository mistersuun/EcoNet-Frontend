import { Directive, ElementRef, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppleAnimationsService } from '../services/apple-animations.service';

@Directive({
  selector: '[appleScroll]',
  standalone: true
})
export class AppleScrollDirective implements OnInit, OnDestroy {
  @Input() appleScroll: 'fadeInUp' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'rotateIn' = 'fadeInUp';
  @Input() delay: number = 0;
  @Input() duration: number = 0.8;

  constructor(
    private el: ElementRef,
    private animationService: AppleAnimationsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.animationService.initializeScrollAnimations([{
        element: this.el.nativeElement,
        animation: this.appleScroll,
        delay: this.delay,
        duration: this.duration
      }]);
    }
  }

  ngOnDestroy() {
    this.animationService.destroy();
  }
}