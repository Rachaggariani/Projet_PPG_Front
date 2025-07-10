import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
 constructor(public translate: TranslateService) {  // Changé de private à public
    translate.addLangs(['fr', 'en', 'ar']);
    const savedLang = localStorage.getItem('lang');
    const browserLang = translate.getBrowserLang();
    const langToUse = savedLang || (browserLang && this.getSupportedLang(browserLang)) || 'fr';
    translate.use(langToUse);
  }

  private getSupportedLang(lang: string): string {
    return ['fr', 'en', 'ar'].includes(lang) ? lang : 'fr';
  }

  setLanguage(lang: string): void {
    if (['fr', 'en', 'ar'].includes(lang)) {
      this.translate.use(lang);
      localStorage.setItem('lang', lang);
    }
  }

  getCurrentLang(): string {
    return this.translate.currentLang;
  }

  getAvailableLangs(): string[] {
    return this.translate.getLangs();
  }

  getLanguageName(lang: string): string {
    const names: {[key: string]: string} = {
      'fr': 'Français',
      'en': 'English',
      'ar': 'العربية'
    };
    return names[lang] || lang;
  }
}