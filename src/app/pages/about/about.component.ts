import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

interface TeamMember {
  name: string;
  position: string;
  description: string;
  image: string;
  specialties: string[];
}

interface CompanyValue {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoPipe],
  template: `
    <!-- Hero Section -->
    <section class="hero wave-border-bottom-only" #heroSection>
      <div class="hero-background">
        <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=800&fit=crop&auto=format&q=80"
             [alt]="'ABOUT.PAGE.HERO.IMAGE_ALT' | transloco" class="hero-bg-image">
        <div class="hero-overlay"></div>
      </div>
      <div class="container">
        <div class="hero-content fade-in-up" [class.visible]="isHeroVisible">
          <div class="hero-badge">{{ 'ABOUT.PAGE.HERO.BADGE' | transloco }}</div>
          <h1 class="hero-title">{{ 'ABOUT.PAGE.HERO.TITLE' | transloco }}</h1>
          <p class="hero-subtitle">
            {{ 'ABOUT.PAGE.HERO.SUBTITLE' | transloco }}
          </p>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section class="section story-section" #storySection>
      <div class="container">
        <div class="story-content">
          <div class="story-text fade-in-left" [class.visible]="isStoryVisible">
            <h2 class="section-title">{{ 'ABOUT.PAGE.STORY.TITLE' | transloco }}</h2>
            <p *ngFor="let paragraph of getStoryParagraphs()">
              {{paragraph}}
            </p>
          </div>
          <div class="story-visual fade-in-right" [class.visible]="isStoryVisible">
            <div class="story-image">
              <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop&auto=format&q=80"
                   [alt]="'ABOUT.PAGE.STORY.IMAGE_ALT' | transloco" class="img-cover">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="section values-section" #valuesSection>
      <div class="container">
        <div class="section-header fade-in-up" [class.visible]="areValuesVisible">
          <h2 class="section-title">{{ 'ABOUT.PAGE.VALUES.TITLE' | transloco }}</h2>
          <p class="section-subtitle">{{ 'ABOUT.PAGE.VALUES.SUBTITLE' | transloco }}</p>
        </div>

        <div class="values-grid">
          <div class="value-card fade-in-up"
               [class.visible]="areValuesVisible"
               [style.transition-delay]="(i * 0.1) + 's'"
               *ngFor="let value of companyValues; index as i">
            <div class="value-icon">{{getValueIcon(i)}}</div>
            <h3>{{getValueTitle(i)}}</h3>
            <p>{{getValueDescription(i)}}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="section team-section" #teamSection>
      <div class="container">
        <div class="section-header fade-in-up" [class.visible]="isTeamVisible">
          <h2 class="section-title">{{ 'ABOUT.PAGE.TEAM.TITLE' | transloco }}</h2>
          <p class="section-subtitle">{{ 'ABOUT.PAGE.TEAM.SUBTITLE' | transloco }}</p>
        </div>

        <div class="team-grid">
          <div class="team-card fade-in-up"
               [class.visible]="isTeamVisible"
               [style.transition-delay]="(i * 0.15) + 's'"
               *ngFor="let member of teamMembers; index as i">
            <div class="member-image">
              <img [src]="member.image" [alt]="member.name" class="img-cover">
            </div>
            <div class="member-info">
              <h3>{{getMemberName(i)}}</h3>
              <p class="member-position">{{getMemberPosition(i)}}</p>
              <p class="member-description">{{getMemberDescription(i)}}</p>
              <div class="member-specialties">
                <span class="specialty-tag" *ngFor="let specialty of getMemberSpecialties(i); let j = index">
                  {{specialty}}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="section mission-section" #missionSection>
      <div class="container">
        <div class="mission-content">
          <div class="mission-text fade-in-left" [class.visible]="isMissionVisible">
            <h2>{{ 'ABOUT.PAGE.MISSION.TITLE' | transloco }}</h2>
            <p>
              {{ 'ABOUT.PAGE.MISSION.DESCRIPTION' | transloco }}
            </p>
            <div class="mission-points">
              <div class="mission-point">
                <span class="point-icon">🌍</span>
                <div>
                  <h4>{{ 'ABOUT.PAGE.MISSION.POINTS.ENVIRONMENT.TITLE' | transloco }}</h4>
                  <p>{{ 'ABOUT.PAGE.MISSION.POINTS.ENVIRONMENT.DESCRIPTION' | transloco }}</p>
                </div>
              </div>
              <div class="mission-point">
                <span class="point-icon">👥</span>
                <div>
                  <h4>{{ 'ABOUT.PAGE.MISSION.POINTS.COMMUNITY.TITLE' | transloco }}</h4>
                  <p>{{ 'ABOUT.PAGE.MISSION.POINTS.COMMUNITY.DESCRIPTION' | transloco }}</p>
                </div>
              </div>
              <div class="mission-point">
                <span class="point-icon">⭐</span>
                <div>
                  <h4>{{ 'ABOUT.PAGE.MISSION.POINTS.EXCELLENCE.TITLE' | transloco }}</h4>
                  <p>{{ 'ABOUT.PAGE.MISSION.POINTS.EXCELLENCE.DESCRIPTION' | transloco }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="mission-stats fade-in-right" [class.visible]="isMissionVisible">
            <div class="stat-box">
              <div class="stat-number">500+</div>
              <div class="stat-label">{{ 'ABOUT.PAGE.MISSION.STATS.CLIENTS' | transloco }}</div>
            </div>
            <div class="stat-box">
              <div class="stat-number">5+</div>
              <div class="stat-label">{{ 'ABOUT.PAGE.MISSION.STATS.EXPERIENCE' | transloco }}</div>
            </div>
            <div class="stat-box">
              <div class="stat-number">15</div>
              <div class="stat-label">{{ 'ABOUT.PAGE.MISSION.STATS.EMPLOYEES' | transloco }}</div>
            </div>
            <div class="stat-box">
              <div class="stat-number">100%</div>
              <div class="stat-label">{{ 'ABOUT.PAGE.MISSION.STATS.ECO_PRODUCTS' | transloco }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta-section wave-border-bottom-only" #ctaSection>
      <div class="container">
        <div class="cta-content fade-in-up" [class.visible]="isCtaVisible">
          <h2 class="cta-title">{{ 'ABOUT.PAGE.CTA.TITLE' | transloco }}</h2>
          <p class="cta-subtitle">
            {{ 'ABOUT.PAGE.CTA.SUBTITLE' | transloco }}
          </p>
          <div class="cta-actions">
            <a routerLink="/booking" class="btn btn-primary btn-lg">
              {{ 'ABOUT.PAGE.CTA.BOOK_NOW' | transloco }}
            </a>
            <a routerLink="/contact" class="btn btn-secondary btn-lg">
              {{ 'ABOUT.PAGE.CTA.CONTACT_US' | transloco }}
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .hero {
      position: relative;
      min-height: 70vh;
      display: flex;
      align-items: center;
      color: var(--pure-white);
      overflow: visible;
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -2;
    }

    .hero-bg-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(107, 144, 128, 0.8) 0%, rgba(164, 195, 178, 0.6) 100%);
      z-index: -1;
    }

    .hero-content {
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-badge {
      display: inline-block;
      padding: var(--space-sm) var(--space-lg);
      background: rgba(255, 255, 255, 0.2);
      color: var(--pure-white);
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      font-weight: var(--font-weight-medium);
      letter-spacing: 0.02em;
      margin-bottom: var(--space-2xl);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .hero-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-xl);
      color: var(--pure-white);
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      font-weight: var(--font-weight-bold);
      line-height: 1.1;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.9);
      max-width: 600px;
      margin: 0 auto;
    }

    /* Story Section */
    .story-section {
      background: var(--pure-white);
    }

    .story-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4xl);
      align-items: center;
    }

    .story-text p {
      font-size: 1.1rem;
      line-height: 1.7;
      margin-bottom: var(--space-lg);
      color: var(--neutral-medium);
    }

    .story-image {
      width: 100%;
      height: 400px;
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-large);
    }

    /* Values Section */
    .values-section {
      background: var(--mint-cream);
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-2xl);
      margin-top: var(--space-3xl);
    }

    .value-card {
      text-align: center;
      padding: var(--space-2xl);
      background: rgba(255, 255, 255, 0.9);
      border-radius: var(--radius-xl);
      transition: all var(--transition-base);
      box-shadow: var(--shadow-subtle);
      backdrop-filter: blur(10px);
    }

    .value-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-large);
    }

    .value-icon {
      font-size: 3.5rem;
      margin-bottom: var(--space-lg);
    }

    .value-card h3 {
      margin-bottom: var(--space-md);
      color: var(--neutral-dark);
    }

    /* Team Section */
    .team-section {
      background: var(--pure-white);
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-2xl);
      margin-top: var(--space-3xl);
    }

    .team-card {
      background: var(--pure-white);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-medium);
      transition: all var(--transition-base);
    }

    .team-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-xl);
    }

    .member-image {
      height: 280px;
      overflow: hidden;
    }

    .member-info {
      padding: var(--space-xl);
    }

    .member-position {
      color: var(--primary);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--space-sm);
      font-size: 1rem;
    }

    .member-description {
      margin-bottom: var(--space-lg);
      line-height: 1.6;
      color: var(--neutral-medium);
    }

    .member-specialties {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-xs);
    }

    .specialty-tag {
      background: var(--cambridge-blue);
      color: var(--pure-white);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      font-weight: var(--font-weight-medium);
    }

    /* Mission Section */
    .mission-section {
      background: linear-gradient(135deg, var(--viridian) 0%, var(--cambridge-blue) 100%);
      color: var(--pure-white);
    }

    .mission-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-4xl);
      align-items: start;
    }

    .mission-text h2 {
      color: var(--pure-white);
      margin-bottom: var(--space-lg);
    }

    .mission-text > p {
      font-size: 1.2rem;
      line-height: 1.7;
      margin-bottom: var(--space-2xl);
      color: rgba(255, 255, 255, 0.9);
    }

    .mission-points {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .mission-point {
      display: flex;
      align-items: flex-start;
      gap: var(--space-md);
    }

    .point-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .mission-point h4 {
      color: var(--pure-white);
      margin-bottom: var(--space-xs);
    }

    .mission-point p {
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      font-size: 0.95rem;
    }

    .mission-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-lg);
    }

    .stat-box {
      text-align: center;
      padding: var(--space-xl);
      background: rgba(255, 255, 255, 0.15);
      border-radius: var(--radius-xl);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: var(--font-weight-bold);
      color: var(--pure-white);
      margin-bottom: var(--space-xs);
    }

    .stat-label {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
    }

    /* CTA Section */
    .cta-section {
      background: var(--primary);
      color: var(--pure-white);
      position: relative;
      overflow: visible;
    }

    .cta-content {
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .cta-title {
      color: var(--pure-white);
      margin-bottom: var(--space-lg);
    }

    .cta-subtitle {
      font-size: 1.2rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: var(--space-3xl);
    }

    .cta-actions {
      display: flex;
      gap: var(--space-lg);
      justify-content: center;
      flex-wrap: wrap;
    }

    .cta-section .btn-primary {
      background: var(--pure-white);
      color: var(--primary);
    }

    .cta-section .btn-primary:hover {
      background: var(--secondary);
      transform: translateY(-3px) scale(1.05);
    }

    .cta-section .btn-secondary {
      background: transparent;
      color: var(--pure-white);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .cta-section .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: var(--pure-white);
      transform: translateY(-3px) scale(1.05);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .story-content,
      .mission-content {
        grid-template-columns: 1fr;
        gap: var(--space-3xl);
        text-align: center;
      }

      .mission-stats {
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-md);
      }
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }

      .team-grid {
        grid-template-columns: 1fr;
      }

      .mission-stats {
        grid-template-columns: 1fr 1fr;
      }

      .cta-actions {
        flex-direction: column;
        align-items: center;
      }

      .cta-actions .btn {
        width: 100%;
        max-width: 300px;
      }

      .values-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }
    }
  `]
})
export class AboutComponent implements OnInit, AfterViewInit {
  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('storySection') storySection!: ElementRef;
  @ViewChild('valuesSection') valuesSection!: ElementRef;
  @ViewChild('teamSection') teamSection!: ElementRef;
  @ViewChild('missionSection') missionSection!: ElementRef;
  @ViewChild('ctaSection') ctaSection!: ElementRef;

  // Animation states
  isHeroVisible = false;
  isStoryVisible = false;
  areValuesVisible = false;
  isTeamVisible = false;
  isMissionVisible = false;
  isCtaVisible = false;

  private observer!: IntersectionObserver;

  teamMembers: TeamMember[] = [
    {
      name: 'Marie-Claude Dubois',
      position: 'Fondatrice & Directrice Générale',
      description: 'Passionnée par l\'environnement et l\'entrepreneuriat, Marie-Claude a fondé ÉcoNet Propreté avec la vision de révolutionner l\'industrie du nettoyage.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&auto=format&q=80',
      specialties: ['Leadership', 'Développement durable', 'Gestion d\'entreprise']
    },
    {
      name: 'Jean-François Martin',
      position: 'Responsable des Opérations',
      description: 'Fort de 10 ans d\'expérience dans le nettoyage commercial, Jean-François supervise toutes nos opérations avec un souci du détail exemplaire.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&auto=format&q=80',
      specialties: ['Gestion d\'équipe', 'Qualité', 'Formation']
    },
    {
      name: 'Sophie Tremblay',
      position: 'Spécialiste Produits Écologiques',
      description: 'Chimiste de formation, Sophie développe et sélectionne tous nos produits écologiques pour garantir efficacité et respect de l\'environnement.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&auto=format&q=80',
      specialties: ['Chimie verte', 'R&D', 'Certifications']
    }
  ];

  companyValues: CompanyValue[] = [
    {
      title: 'Respect de l\'Environnement',
      description: 'Nous utilisons exclusivement des produits biodégradables et respectueux de l\'écosystème pour préserver notre planète.',
      icon: '🌱'
    },
    {
      title: 'Qualité & Excellence',
      description: 'Chaque intervention est réalisée selon nos standards les plus élevés pour garantir votre satisfaction.',
      icon: '⭐'
    },
    {
      title: 'Transparence',
      description: 'Nous communiquons ouvertement sur nos pratiques, nos produits et nos processus.',
      icon: '🔍'
    },
    {
      title: 'Innovation',
      description: 'Nous investissons constamment dans de nouvelles technologies et méthodes de nettoyage écologique.',
      icon: '💡'
    },
    {
      title: 'Communauté',
      description: 'Nous contribuons activement au bien-être de notre communauté locale.',
      icon: '🤝'
    },
    {
      title: 'Intégrité',
      description: 'Nous agissons avec honnêteté et éthique dans toutes nos relations d\'affaires.',
      icon: '🛡️'
    }
  ];

  private valueKeys = ['ENVIRONMENT', 'QUALITY', 'TRANSPARENCY', 'INNOVATION', 'COMMUNITY', 'INTEGRITY'];
  private memberKeys = ['MARIE_CLAUDE', 'JEAN_FRANCOIS', 'SOPHIE', 'ALEXANDRE'];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private transloco: TranslocoService) {}

  ngOnInit() {
    this.isHeroVisible = true;
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupScrollAnimations();
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupScrollAnimations() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;

            if (element === this.storySection?.nativeElement) {
              this.isStoryVisible = true;
            } else if (element === this.valuesSection?.nativeElement) {
              this.areValuesVisible = true;
            } else if (element === this.teamSection?.nativeElement) {
              this.isTeamVisible = true;
            } else if (element === this.missionSection?.nativeElement) {
              this.isMissionVisible = true;
            } else if (element === this.ctaSection?.nativeElement) {
              this.isCtaVisible = true;
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe sections
    if (this.storySection) this.observer.observe(this.storySection.nativeElement);
    if (this.valuesSection) this.observer.observe(this.valuesSection.nativeElement);
    if (this.teamSection) this.observer.observe(this.teamSection.nativeElement);
    if (this.missionSection) this.observer.observe(this.missionSection.nativeElement);
    if (this.ctaSection) this.observer.observe(this.ctaSection.nativeElement);
  }

  getValueIcon(index: number): string {
    return this.companyValues[index]?.icon || '';
  }

  getValueTitle(index: number): string {
    const key = this.valueKeys[index];
    return key ? this.transloco.translate(`ABOUT.PAGE.VALUES.LIST.${key}.TITLE`) : '';
  }

  getValueDescription(index: number): string {
    const key = this.valueKeys[index];
    return key ? this.transloco.translate(`ABOUT.PAGE.VALUES.LIST.${key}.DESCRIPTION`) : '';
  }

  getMemberName(index: number): string {
    const key = this.memberKeys[index];
    return key ? this.transloco.translate(`ABOUT.PAGE.TEAM.MEMBERS.${key}.NAME`) : '';
  }

  getMemberPosition(index: number): string {
    const key = this.memberKeys[index];
    return key ? this.transloco.translate(`ABOUT.PAGE.TEAM.MEMBERS.${key}.POSITION`) : '';
  }

  getMemberDescription(index: number): string {
    const key = this.memberKeys[index];
    return key ? this.transloco.translate(`ABOUT.PAGE.TEAM.MEMBERS.${key}.DESCRIPTION`) : '';
  }

  getMemberSpecialties(index: number): string[] {
    const key = this.memberKeys[index];
    if (!key) return [];

    const specialties = this.transloco.translate(`ABOUT.PAGE.TEAM.MEMBERS.${key}.SPECIALTIES`);
    return Array.isArray(specialties) ? specialties : [];
  }

  getStoryParagraphs(): string[] {
    const paragraphs = this.transloco.translate('ABOUT.PAGE.STORY.PARAGRAPHS');
    return Array.isArray(paragraphs) ? paragraphs : [];
  }
}