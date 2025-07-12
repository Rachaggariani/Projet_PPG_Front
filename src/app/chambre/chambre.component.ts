import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChambreService } from '../Services/chambre.service';
import { catchError, forkJoin, map, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chambre',
  templateUrl: './chambre.component.html',
  styleUrls: ['./chambre.component.css']
})
export class ChambreComponent implements OnInit {
    @ViewChild('exitButton') exitButton!: ElementRef;

  hotelId!: number;
  loading = false;
      isLoading = false; 
  error: string | null = null;
 roomImages: {[key: string]: string} = {};
   showLanguageDropdown = false;
    currentLanguage: string = 'fr'; // Définit la langue par défaut
  // Structure de données simplifiée
  roomTypes = [
    { key: 'simple', name: 'simple', available: false },
    { key: 'double', name: 'Double', available: false },
    { key: 'suite', name: 'Suite', available: false }
  ];

  chambres: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private chambreService: ChambreService,
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


  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('hotelId');
    if (!idParam || isNaN(+idParam)) {
      this.error = 'ID d\'hôtel invalide';
      this.loading = false;
      return;
    }

    this.hotelId = +idParam;
    this.loadData();
  }

  loadData(): void {
    this.loading=true;
    forkJoin([
      this.chambreService.getDisponibilite(this.hotelId),
      this.chambreService.getChambresByHotel(this.hotelId),
      // Ajoutez les appels pour récupérer les images
      ...this.roomTypes.map(roomType => 
        this.chambreService.getFirstRoomImage(this.hotelId, roomType.key)
          .pipe(
            catchError(() => of('')), // Gérer les erreurs
            map(imageUrl => ({ type: roomType.key, url: imageUrl }))
          )
      )
    ]).subscribe({
      next: ([disponibilite, chambres, ...images]) => {
        // Mise à jour de la disponibilité
        this.roomTypes.forEach(type => {
          type.available = disponibilite[type.key as keyof typeof disponibilite];
        });

        this.chambres = chambres;
        
        // Stocker les URLs des images
        images.forEach((img: any) => {
          if (img.url) {
            this.roomImages[img.type] = img.url;
          }
        });
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des données';
        this.loading = false;
        console.error(err);
      }
    });
        this.lloadRoomImages();

  }

  lloadRoomImages(): void {
    this.roomTypes.forEach(roomType => {
      this.chambreService.getFirstRoomImage(1, roomType.key) // 1 = exemple hotelId
        .subscribe(imageUrl => {
          this.roomImages[roomType.key] = imageUrl;
        });
    });
  }

  getRoomImage(roomType: string): string {
    return this.roomImages[roomType] || 
           this.chambreService.getDefaultImage(roomType);
  }

  handleImageError(event: Event, roomType: string): void {
    const img = event.target as HTMLImageElement;
    img.src = this.chambreService.getDefaultImage(roomType);
  }
  getChambresByType(type: string): any[] {
    return this.chambres.filter(c => 
      c.type?.toLowerCase() === type.toLowerCase() && 
      c.disponible
    );
  }
  getCapacity(roomTypeKey: string): number {
  switch(roomTypeKey.toLowerCase()) {
    case 'simple':
      return 1;
    case 'double':
      return 2;
    case 'suite':
      return 4; // Typically suites accommodate more people
    default:
      return 1; // Default to 1 if type is unknown
  }
}

 navigateToReservation(roomType: string) {
    this.isLoading = true;
    
    setTimeout(() => {
      this.router.navigate(['/reservation', this.hotelId, roomType], { 
        queryParams: {} 
      });
      this.isLoading = false;
    }, 2000);
  }
}
