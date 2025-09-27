import { Directive, ElementRef, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppleAnimationsService } from '../services/apple-animations.service';

@Directive({
  selector: '[appleHover]',
  standalone: true
})
export class AppleHoverDirective implements OnInit {
  @Input() appleHover: 'lift' | 'scale' | 'glow' | 'rotate' = 'lift';

  constructor(
    private el: ElementRef,
    private animationService: AppleAnimationsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.animationService.createHoverEffect(this.el.nativeElement, this.appleHover);
    }
  }
}