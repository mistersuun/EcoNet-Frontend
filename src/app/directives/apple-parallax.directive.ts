import { Directive, ElementRef, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppleAnimationsService } from '../services/apple-animations.service';

@Directive({
  selector: '[appleParallax]',
  standalone: true
})
export class AppleParallaxDirective implements OnInit {
  @Input() appleParallax: string | number = 0.5; // Speed multiplier
  @Input() direction: 'vertical' | 'horizontal' = 'vertical';

  constructor(
    private el: ElementRef,
    private animationService: AppleAnimationsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const speed = typeof this.appleParallax === 'string' ? parseFloat(this.appleParallax) : this.appleParallax;
      this.animationService.initializeParallax([{
        element: this.el.nativeElement,
        speed: speed,
        direction: this.direction
      }]);
    }
  }
}