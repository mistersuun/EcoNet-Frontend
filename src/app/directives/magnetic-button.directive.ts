import { Directive, ElementRef, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppleAnimationsService } from '../services/apple-animations.service';

@Directive({
  selector: '[magneticButton]',
  standalone: true
})
export class MagneticButtonDirective implements OnInit {

  constructor(
    private el: ElementRef,
    private animationService: AppleAnimationsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.animationService.createMagneticButton(this.el.nativeElement);
    }
  }
}