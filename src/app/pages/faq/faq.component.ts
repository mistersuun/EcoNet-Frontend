import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

interface FAQ {
  question: string;
  answer: string;
  category: string;
  icon: string;
  expanded?: boolean;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section #heroSection class="hero-section" [class.visible]="isHeroVisible">
      <div class="container">
        <div class="hero-content text-center fade-in-up" [class.visible]="isHeroVisible">
          <h1 class="stagger-1">Questions Fréquentes</h1>
          <p class="stagger-2">Trouvez rapidement les réponses à vos questions sur nos services de nettoyage écologique</p>
        </div>
      </div>
    </section>

    <section #searchSection class="search-section section">
      <div class="container narrow">
        <div class="search-box fade-in-up" [class.visible]="isSearchVisible">
          <input type="text"
                 class="search-input stagger-1"
                 placeholder="Rechercher dans les FAQ..."
                 [(ngModel)]="searchTerm"
                 (input)="filterFAQs()">
          <span class="search-icon">🔍</span>
        </div>
      </div>
    </section>

    <section #faqContentSection class="faq-content section">
      <div class="container">
        <div class="faq-layout">
          <!-- Categories Sidebar -->
          <div class="categories-sidebar fade-in-left" [class.visible]="isFaqContentVisible">
            <h3 class="stagger-1">Catégories</h3>
            <div class="category-list">
              <button class="category-btn stagger-2" [class.visible]="isFaqContentVisible"
                      *ngFor="let category of categories; let i = index"
                      [class.active]="category.active"
                      [class]="'stagger-' + (i + 2)"
                      (click)="selectCategory(category.id)">
                <span class="category-icon">{{category.icon}}</span>
                {{category.name}}
              </button>
            </div>
          </div>

          <!-- FAQ Items -->
          <div class="faq-main fade-in-right" [class.visible]="isFaqContentVisible">
            <div class="faq-results" *ngIf="searchTerm">
              <p>{{getFilteredFAQs().length}} résultat(s) trouvé(s) pour "{{searchTerm}}"</p>
            </div>

            <div class="faq-list">
              <div class="faq-item card slide-up" [class.visible]="isFaqContentVisible"
                   *ngFor="let faq of getFilteredFAQs(); trackBy: trackByQuestion; let i = index"
                   [class]="'stagger-' + (i + 1)">
                <div class="faq-question"
                     (click)="toggleFAQ(faq)">
                  <div class="question-content">
                    <span class="faq-icon">{{faq.icon}}</span>
                    <h3>{{faq.question}}</h3>
                  </div>
                  <span class="toggle-icon"
                        [class.expanded]="faq.expanded">
                    {{faq.expanded ? '−' : '+'}}
                  </span>
                </div>

                <div class="faq-answer"
                     [class.expanded]="faq.expanded"
                     [innerHTML]="faq.answer">
                </div>
              </div>
            </div>

            <!-- No Results -->
            <div class="no-results" *ngIf="getFilteredFAQs().length === 0 && searchTerm">
              <div class="no-results-content">
                <div class="no-results-icon">❓</div>
                <h3>Aucun résultat trouvé</h3>
                <p>Essayez avec d'autres mots-clés ou consultez toutes nos FAQ.</p>
                <button class="btn btn-primary" (click)="clearSearch()">
                  Voir toutes les FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section #helpSection class="help-section section">
      <div class="container">
        <div class="help-content text-center fade-in-up" [class.visible]="isHelpVisible">
          <div class="help-icon stagger-1">💬</div>
          <h2 class="stagger-2">Vous ne trouvez pas votre réponse?</h2>
          <p class="stagger-3">Notre équipe de service client est là pour vous aider</p>

          <div class="help-options">
            <div class="help-option card scale-in stagger-4" [class.visible]="isHelpVisible">
              <div class="option-icon">📞</div>
              <h4>Appelez-nous</h4>
              <p>(514) 942-2670</p>
              <p class="option-hours">Lun-Ven: 8h-18h</p>
            </div>

            <div class="help-option card scale-in stagger-5" [class.visible]="isHelpVisible">
              <div class="option-icon">📧</div>
              <h4>Écrivez-nous</h4>
              <p>econetentretienmenager@gmail.com</p>
              <p class="option-hours">Réponse sous 2h</p>
            </div>

            <div class="help-option card scale-in stagger-6" [class.visible]="isHelpVisible">
              <div class="option-icon">💬</div>
              <h4>Chat en direct</h4>
              <p>Support instantané</p>
              <p class="option-hours">Disponible maintenant</p>
            </div>
          </div>

          <div class="help-actions">
            <a routerLink="/contact" class="btn btn-primary btn-lg stagger-7">
              Nous Contacter
            </a>
            <a routerLink="/booking" class="btn btn-secondary stagger-8">
              Réserver Maintenant
            </a>
          </div>
        </div>
      </div>
    </section>

    <section #popularQuestionsSection class="popular-questions section">
      <div class="container">
        <div class="section-header text-center fade-in-up" [class.visible]="arePopularQuestionsVisible">
          <h2 class="section-title stagger-1">Questions Les Plus Populaires</h2>
          <p class="section-subtitle stagger-2">Les réponses aux questions les plus fréquentes</p>
        </div>

        <div class="popular-grid">
          <div class="popular-item card slide-up" [class.visible]="arePopularQuestionsVisible" *ngFor="let faq of getPopularFAQs(); let i = index" [class]="'stagger-' + (i + 3)">
            <div class="popular-icon">{{faq.icon}}</div>
            <h4>{{faq.question}}</h4>
            <p [innerHTML]="getShortAnswer(faq.answer)"></p>
            <button class="btn btn-secondary btn-sm" (click)="expandFAQ(faq)">
              Lire la suite
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    // Import NgModel for search
    :host {
      display: block;
    }

    // Hero Section
    .hero-section {
      background: linear-gradient(135deg, var(--primary-green), var(--secondary-green));
      color: var(--pure-white);
      padding: var(--spacing-3xl) 0;
    }

    .hero-content h1 {
      font-size: 3rem;
      margin-bottom: var(--spacing-md);
      color: var(--pure-white);
    }

    .hero-content p {
      font-size: 1.2rem;
      opacity: 0.9;
      max-width: 800px;
      margin: 0 auto;
    }

    // Search Section
    .search-section {
      background: var(--pale-beige);
      padding: var(--spacing-xl) 0;
    }

    .search-box {
      position: relative;
      max-width: 600px;
      margin: 0 auto;
    }

    .search-input {
      width: 100%;
      padding: var(--spacing-lg) var(--spacing-3xl) var(--spacing-lg) var(--spacing-lg);
      border: 2px solid var(--soft-gray);
      border-radius: var(--radius-xl);
      font-size: 1.1rem;
      transition: border-color var(--transition-normal);

      &:focus {
        outline: none;
        border-color: var(--accent-teal);
        box-shadow: 0 0 0 3px rgba(82, 183, 136, 0.1);
      }
    }

    .search-icon {
      position: absolute;
      right: var(--spacing-lg);
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      color: var(--medium-gray);
    }

    // FAQ Layout
    .faq-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: var(--spacing-3xl);
    }

    // Categories Sidebar
    .categories-sidebar {
      background: var(--pure-white);
      padding: var(--spacing-xl);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      height: fit-content;
      position: sticky;
      top: var(--spacing-lg);
    }

    .categories-sidebar h3 {
      margin-bottom: var(--spacing-lg);
      color: var(--primary-green);
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .category-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      border: none;
      background: transparent;
      border-radius: var(--radius-md);
      text-align: left;
      cursor: pointer;
      transition: all var(--transition-normal);
      color: var(--medium-gray);

      &:hover, &.active {
        background: var(--pale-beige);
        color: var(--primary-green);
      }

      &.active {
        font-weight: 600;
      }
    }

    .category-icon {
      font-size: 1.2rem;
    }

    // FAQ Main Content
    .faq-main {
      flex: 1;
    }

    .faq-results {
      margin-bottom: var(--spacing-lg);
      color: var(--medium-gray);
      font-style: italic;
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .faq-item {
      overflow: hidden;
      transition: all var(--transition-normal);

      &:hover {
        box-shadow: var(--shadow-lg);
      }
    }

    .faq-question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-xl);
      cursor: pointer;
      transition: background-color var(--transition-normal);

      &:hover {
        background: var(--pale-beige);
      }
    }

    .question-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      flex: 1;
    }

    .faq-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .faq-question h3 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--charcoal);
    }

    .toggle-icon {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--accent-teal);
      transition: transform var(--transition-normal);

      &.expanded {
        transform: rotate(180deg);
      }
    }

    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height var(--transition-slow);
      background: var(--cream-white);

      &.expanded {
        max-height: 500px;
      }

      :global(p) {
        padding: var(--spacing-xl);
        margin: 0;
        line-height: 1.7;
        color: var(--medium-gray);
      }

      :global(ul), :global(ol) {
        padding: 0 var(--spacing-xl) var(--spacing-xl);
        margin: 0;
      }

      :global(li) {
        margin-bottom: var(--spacing-sm);
        color: var(--medium-gray);
      }

      :global(strong) {
        color: var(--primary-green);
      }

      :global(a) {
        color: var(--accent-teal);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    // No Results
    .no-results {
      text-align: center;
      padding: var(--spacing-4xl);
      color: var(--medium-gray);
    }

    .no-results-icon {
      font-size: 4rem;
      margin-bottom: var(--spacing-lg);
    }

    .no-results h3 {
      margin-bottom: var(--spacing-md);
      color: var(--charcoal);
    }

    // Help Section
    .help-content {
      max-width: 900px;
      margin: 0 auto;
    }

    .help-icon {
      font-size: 4rem;
      margin-bottom: var(--spacing-lg);
    }

    .help-content h2 {
      margin-bottom: var(--spacing-md);
    }

    .help-content > p {
      color: var(--medium-gray);
      font-size: 1.1rem;
      margin-bottom: var(--spacing-3xl);
    }

    .help-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-xl);
      margin-bottom: var(--spacing-3xl);
    }

    .help-option {
      padding: var(--spacing-xl);
      text-align: center;
    }

    .option-icon {
      font-size: 2.5rem;
      margin-bottom: var(--spacing-md);
    }

    .help-option h4 {
      margin-bottom: var(--spacing-sm);
      color: var(--primary-green);
    }

    .help-option p {
      margin: var(--spacing-xs) 0;
      font-weight: 600;
    }

    .option-hours {
      color: var(--medium-gray) !important;
      font-weight: normal !important;
      font-size: 0.9rem;
    }

    .help-actions {
      display: flex;
      gap: var(--spacing-lg);
      justify-content: center;
    }

    // Popular Questions
    .popular-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: var(--spacing-xl);
    }

    .popular-item {
      padding: var(--spacing-xl);
      text-align: center;
    }

    .popular-icon {
      font-size: 2.5rem;
      margin-bottom: var(--spacing-md);
    }

    .popular-item h4 {
      margin-bottom: var(--spacing-sm);
      color: var(--primary-green);
      font-size: 1.1rem;
    }

    .popular-item p {
      color: var(--medium-gray);
      margin-bottom: var(--spacing-lg);
      line-height: 1.6;
    }

    // Mobile Responsive
    @media (max-width: 1024px) {
      .faq-layout {
        grid-template-columns: 1fr;
        gap: var(--spacing-xl);
      }

      .categories-sidebar {
        position: static;
        order: -1;
      }

      .category-list {
        flex-direction: row;
        flex-wrap: wrap;
      }

      .help-options {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2rem;
      }

      .hero-content p {
        font-size: 1rem;
      }

      .search-input {
        padding: var(--spacing-md) var(--spacing-2xl) var(--spacing-md) var(--spacing-md);
        font-size: 0.95rem;
      }

      .faq-question {
        padding: var(--spacing-md);
        flex-wrap: nowrap;
        gap: var(--spacing-sm);
      }

      .question-content {
        gap: var(--spacing-sm);
        flex: 1;
        min-width: 0;
      }

      .faq-icon {
        font-size: 1.2rem;
        flex-shrink: 0;
      }

      .faq-question h3 {
        font-size: 0.95rem;
        line-height: 1.4;
        word-wrap: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
      }

      .toggle-icon {
        font-size: 1.3rem;
        flex-shrink: 0;
        margin-left: var(--spacing-xs);
      }

      .faq-answer :global(p) {
        padding: var(--spacing-md);
        font-size: 0.9rem;
      }

      .faq-answer :global(ul), .faq-answer :global(ol) {
        padding: 0 var(--spacing-md) var(--spacing-md);
        font-size: 0.9rem;
      }

      .help-actions {
        flex-direction: column;
        align-items: center;
      }

      .help-actions .btn {
        width: 100%;
        max-width: 300px;
      }

      .popular-grid {
        grid-template-columns: 1fr;
      }

      .popular-item h4 {
        font-size: 1rem;
      }

      .popular-item p {
        font-size: 0.9rem;
      }
    }

    /* Additional mobile breakpoints for better responsive design */
    @media (max-width: 640px) {
      .hero-content h1 {
        font-size: 1.75rem;
      }

      .search-input {
        padding: var(--spacing-sm) var(--spacing-lg);
        font-size: 0.9rem;
      }

      .category-list {
        gap: var(--spacing-xs);
      }

      .category-btn {
        padding: var(--spacing-xs) var(--spacing-sm);
        font-size: 0.8rem;
      }

      .faq-layout {
        gap: var(--spacing-lg);
      }

      .faq-question {
        padding: var(--spacing-sm) var(--spacing-md);
      }

      .faq-question h3 {
        font-size: 0.875rem;
      }

      .faq-icon {
        font-size: 1rem;
      }

      .toggle-icon {
        font-size: 1.2rem;
      }
    }

    @media (max-width: 480px) {
      .hero-content h1 {
        font-size: 1.5rem;
        line-height: 1.2;
      }

      .hero-content p {
        font-size: 0.875rem;
      }

      .faq-layout {
        grid-template-columns: 1fr;
      }

      .categories-sidebar {
        order: 1;
        margin-bottom: var(--spacing-lg);
        padding: var(--spacing-md);
      }

      .faq-content {
        order: 2;
      }

      .search-input {
        padding: var(--spacing-sm) var(--spacing-md);
        font-size: 0.875rem;
      }

      .category-list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-xs);
      }

      .category-btn {
        flex: 1;
        min-width: 100px;
        text-align: center;
        font-size: 0.75rem;
        padding: var(--spacing-xs);
      }

      .faq-question {
        padding: var(--spacing-sm);
      }

      .faq-question h3 {
        font-size: 0.8rem;
        line-height: 1.3;
      }

      .help-content h2 {
        font-size: 1.5rem;
      }

      .help-content > p {
        font-size: 0.95rem;
      }
    }
  `]
})
export class FaqComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('searchSection') searchSection!: ElementRef;
  @ViewChild('faqContentSection') faqContentSection!: ElementRef;
  @ViewChild('helpSection') helpSection!: ElementRef;
  @ViewChild('popularQuestionsSection') popularQuestionsSection!: ElementRef;

  searchTerm = '';
  filteredFAQs: FAQ[] = [];

  isHeroVisible = false;
  isSearchVisible = false;
  isFaqContentVisible = false;
  isHelpVisible = false;
  arePopularQuestionsVisible = false;

  categories: FAQCategory[] = [
    { id: 'all', name: 'Toutes les FAQ', icon: '📚', active: true },
    { id: 'services', name: 'Services', icon: '🧹', active: false },
    { id: 'pricing', name: 'Tarifs', icon: '💰', active: false },
    { id: 'booking', name: 'Réservation', icon: '📅', active: false },
    { id: 'products', name: 'Produits', icon: '🌿', active: false },
    { id: 'general', name: 'Général', icon: '❓', active: false }
  ];

  faqs: FAQ[] = [
    // Services
    {
      category: 'services',
      icon: '🧹',
      question: 'Quels types de services de nettoyage offrez-vous?',
      answer: `<p>Nous offrons une gamme complète de services de nettoyage écologique:</p>
               <ul>
                 <li><strong>Nettoyage résidentiel:</strong> Maisons, appartements, condos</li>
                 <li><strong>Nettoyage commercial:</strong> Bureaux, magasins, restaurants</li>
                 <li><strong>Nettoyage post-construction:</strong> Après travaux ou rénovations</li>
                 <li><strong>Nettoyage en profondeur:</strong> Service intensif saisonnier</li>
                 <li><strong>Entretien régulier:</strong> Forfaits hebdomadaires ou mensuels</li>
                 <li><strong>Services spécialisés:</strong> Tapis, moquettes, vitres</li>
               </ul>
               <p>Tous nos services utilisent exclusivement des produits écologiques certifiés.</p>`
    },
    {
      category: 'products',
      icon: '🌿',
      question: 'Quels produits écologiques utilisez-vous?',
      answer: `<p>Nous utilisons uniquement des produits de nettoyage certifiés écologiques:</p>
               <ul>
                 <li><strong>Produits naturels:</strong> Bases végétales, sans produits chimiques toxiques</li>
                 <li><strong>Biodégradables:</strong> Respectueux de l'environnement</li>
                 <li><strong>Non-toxiques:</strong> Sécuritaires pour enfants et animaux</li>
                 <li><strong>Sans parfums artificiels:</strong> Évitent les allergies</li>
                 <li><strong>Certifications:</strong> Green Seal, EcoLogo, BNQ</li>
               </ul>
               <p>Nous pouvons également utiliser vos propres produits si vous préférez.</p>`
    },
    {
      category: 'pricing',
      icon: '💰',
      question: 'Comment calculez-vous vos tarifs?',
      answer: `<p>Nos tarifs sont basés sur plusieurs facteurs transparents:</p>
               <ul>
                 <li><strong>Superficie:</strong> Taille de l'espace à nettoyer</li>
                 <li><strong>Type de service:</strong> Résidentiel, commercial, spécialisé</li>
                 <li><strong>Fréquence:</strong> Rabais pour services récurrents (5% à 15%)</li>
                 <li><strong>Complexité:</strong> État général et besoins spécifiques</li>
                 <li><strong>Services additionnels:</strong> Options supplémentaires</li>
               </ul>
               <p>Nous offrons toujours un <strong>devis gratuit</strong> sans engagement avant chaque service.</p>`
    },
    {
      category: 'booking',
      icon: '📅',
      question: 'Comment puis-je réserver un service?',
      answer: `<p>Réserver avec nous est simple et flexible:</p>
               <ul>
                 <li><strong>En ligne:</strong> Formulaire de réservation sur notre site</li>
                 <li><strong>Par téléphone:</strong> (514) 942-2670 - Service 7j/7</li>
                 <li><strong>Par courriel:</strong> econetentretienmenager@gmail.com</li>
                 <li><strong>Par WhatsApp:</strong> Message direct et rapide</li>
               </ul>
               <p>Nous confirmons généralement les rendez-vous <strong>dans les 2 heures</strong> et pouvons souvent intervenir le jour même pour les urgences.</p>`
    },
    {
      category: 'booking',
      icon: '⏰',
      question: 'Quels sont vos horaires de service?',
      answer: `<p>Nous adaptons nos horaires à votre emploi du temps:</p>
               <ul>
                 <li><strong>Lundi à Vendredi:</strong> 7h00 - 20h00</li>
                 <li><strong>Samedi:</strong> 8h00 - 18h00</li>
                 <li><strong>Dimanche:</strong> 9h00 - 17h00 (sur demande)</li>
                 <li><strong>Urgences:</strong> Service 24h/7j disponible</li>
               </ul>
               <p>Nous offrons également des créneaux en soirée et le week-end sans frais supplémentaires.</p>`
    },
    {
      category: 'general',
      icon: '🛡️',
      question: 'Êtes-vous assurés et liés?',
      answer: `<p>Oui, nous sommes entièrement protégés et certifiés:</p>
               <ul>
                 <li><strong>Assurance responsabilité civile:</strong> 2M$ de couverture</li>
                 <li><strong>Assurance biens:</strong> Protection de vos biens personnels</li>
                 <li><strong>Cautionnement:</strong> Tous nos employés sont cautionnés</li>
                 <li><strong>Certifications:</strong> ISSA, Green Seal, BNQ</li>
                 <li><strong>Licence d'entreprise:</strong> Enregistrée au Québec</li>
               </ul>
               <p>Nous vous fournirons les preuves d'assurance sur demande.</p>`
    },
    {
      category: 'services',
      icon: '🗝️',
      question: 'Dois-je être présent pendant le nettoyage?',
      answer: `<p>Non, votre présence n'est pas obligatoire:</p>
               <ul>
                 <li><strong>Service avec clés:</strong> Nous pouvons garder un jeu de clés sécurisé</li>
                 <li><strong>Code d'accès:</strong> Système d'alarme et codes temporaires</li>
                 <li><strong>Concierge:</strong> Coordination avec votre gardien d'immeuble</li>
                 <li><strong>Présence optionnelle:</strong> Certains clients préfèrent être présents</li>
               </ul>
               <p>Nous prenons des <strong>photos avant/après</strong> et vous envoyons un rapport de service complet.</p>`
    },
    {
      category: 'pricing',
      icon: '💳',
      question: 'Quels modes de paiement acceptez-vous?',
      answer: `<p>Nous acceptons tous les modes de paiement courants:</p>
               <ul>
                 <li><strong>Cartes de crédit:</strong> Visa, MasterCard, American Express</li>
                 <li><strong>Cartes de débit:</strong> Interac</li>
                 <li><strong>Virement électronique:</strong> E-transfer</li>
                 <li><strong>Espèces:</strong> Paiement à la réception du service</li>
                 <li><strong>Chèque:</strong> Pour clients corporatifs</li>
               </ul>
               <p>Le paiement s'effectue <strong>après le service</strong>, une fois que vous êtes satisfait du résultat.</p>`
    },
    {
      category: 'general',
      icon: '📍',
      question: 'Dans quelles régions offrez-vous vos services?',
      answer: `<p>Nous couvrons toute la région métropolitaine de Montréal:</p>
               <ul>
                 <li><strong>Montréal:</strong> Tous les arrondissements</li>
                 <li><strong>Laval:</strong> Toutes les zones</li>
                 <li><strong>Longueuil:</strong> Rive-Sud complète</li>
                 <li><strong>Brossard, Saint-Hubert:</strong> Secteurs résidentiels</li>
                 <li><strong>Westmount, Outremont:</strong> Quartiers haut de gamme</li>
               </ul>
               <p>Contactez-nous pour confirmer la desserte de votre secteur spécifique.</p>`
    },
    {
      category: 'general',
      icon: '✅',
      question: 'Offrez-vous une garantie de satisfaction?',
      answer: `<p>Absolument! Notre garantie de satisfaction 100% inclut:</p>
               <ul>
                 <li><strong>Retour gratuit:</strong> Nous revenons sous 24h si non satisfait</li>
                 <li><strong>Service refait:</strong> Sans frais supplémentaires</li>
                 <li><strong>Remboursement:</strong> En cas d'insatisfaction persistante</li>
                 <li><strong>Suivi qualité:</strong> Appel de confirmation après chaque service</li>
                 <li><strong>Amélioration continue:</strong> Vos commentaires nous aident</li>
               </ul>
               <p>Votre satisfaction est notre priorité absolue depuis plus de 5 ans.</p>`
    }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private scrollAnimationService: ScrollAnimationService
  ) {}

  ngOnInit() {
    this.filteredFAQs = [...this.faqs];
    if (isPlatformBrowser(this.platformId)) {
      // Initialize hero visibility immediately
      setTimeout(() => {
        this.isHeroVisible = true;
      }, 100);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeScrollAnimations();
    }
  }

  ngOnDestroy() {
    if (this.scrollAnimationService) {
      this.scrollAnimationService.destroy();
    }
  }

  private initializeScrollAnimations() {
    const elements = [
      {
        element: this.searchSection.nativeElement,
        callback: () => { this.isSearchVisible = true; }
      },
      {
        element: this.faqContentSection.nativeElement,
        callback: () => { this.isFaqContentVisible = true; }
      },
      {
        element: this.helpSection.nativeElement,
        callback: () => { this.isHelpVisible = true; }
      },
      {
        element: this.popularQuestionsSection.nativeElement,
        callback: () => { this.arePopularQuestionsVisible = true; }
      }
    ];

    this.scrollAnimationService.initializeAnimations(elements);
  }

  selectCategory(categoryId: string) {
    // Update active category
    this.categories.forEach(cat => cat.active = cat.id === categoryId);

    // Filter FAQs
    if (categoryId === 'all') {
      this.filteredFAQs = [...this.faqs];
    } else {
      this.filteredFAQs = this.faqs.filter(faq => faq.category === categoryId);
    }

    // Clear search when selecting category
    this.searchTerm = '';
  }

  filterFAQs() {
    if (!this.searchTerm.trim()) {
      const activeCategory = this.categories.find(cat => cat.active);
      if (activeCategory?.id === 'all') {
        this.filteredFAQs = [...this.faqs];
      } else {
        this.filteredFAQs = this.faqs.filter(faq => faq.category === activeCategory?.id);
      }
      return;
    }

    const searchTerm = this.searchTerm.toLowerCase();
    this.filteredFAQs = this.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm) ||
      faq.answer.toLowerCase().includes(searchTerm)
    );
  }

  toggleFAQ(faq: FAQ) {
    faq.expanded = !faq.expanded;
  }

  expandFAQ(faq: FAQ) {
    // Find the FAQ in the main list and expand it
    const mainFaq = this.faqs.find(f => f.question === faq.question);
    if (mainFaq) {
      mainFaq.expanded = true;
      // Scroll to the FAQ item
      setTimeout(() => {
        const element = document.querySelector(`[data-question="${faq.question}"]`);
        element?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterFAQs();
  }

  getFilteredFAQs(): FAQ[] {
    return this.filteredFAQs;
  }

  getPopularFAQs(): FAQ[] {
    // Return the first 6 FAQs as popular
    return this.faqs.slice(0, 6);
  }

  getShortAnswer(answer: string): string {
    // Extract first paragraph and truncate
    const firstParagraph = answer.match(/<p>(.*?)<\/p>/)?.[1] || answer;
    return firstParagraph.length > 120 ?
           firstParagraph.substring(0, 120) + '...' :
           firstParagraph;
  }

  trackByQuestion(index: number, faq: FAQ): string {
    return faq.question;
  }
}