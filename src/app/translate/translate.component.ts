import { Component } from '@angular/core';
import { TranslationService } from '../Services/translation.service';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.css']
})
export class TranslateComponent {
 constructor(public translationService: TranslationService) {}

  changeLanguage(lang: string): void {
    this.translationService.setLanguage(lang);
  }

  // Ajout de la méthode pour le template
  getLanguageName(lang: string): string {
    return this.translationService.getLanguageName(lang);
  }
}