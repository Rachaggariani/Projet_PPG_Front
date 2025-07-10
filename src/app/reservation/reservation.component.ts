import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {
 showLanguageDropdown = false;
    currentLanguage: string = 'fr'; // Définit la langue par défaut

    constructor(
        private route: ActivatedRoute,
         private router: Router,
          public translate: TranslateService
      ) {
        translate.addLangs(['en', 'fr', 'ar']);
      
      // Force le français comme langue par défaut
      this.translate.setDefaultLang('fr');
      }

      changeLanguage(lang: string) {
    this.currentLanguage = lang;
    this.showLanguageDropdown = false;
    // Change la langue dans ngx-translate si utilisé
    this.translate.use(lang);
  }
}
