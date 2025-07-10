import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Hotel, HotelService } from '../Services/hotel.service';
import { TranslateService } from '@ngx-translate/core';
import { PermissionService } from '../Services/permissions.service';
import { AuthService } from '../Services/auth.service';
import { UserService } from '../Services/user.service';
import { Role } from '../role';
import { User } from '../user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  hotels: Hotel[] = [];
  showLanguageDropdown = false;
    currentLanguage: string = 'fr'; // Définit la langue par défaut

  loading = false;
    isLoading = false; 
  loggedIn = false ;
  error: string | null = null;
  canEditHotel: boolean | undefined;
  canDeleteHotel: boolean | undefined;
  admin: boolean =false;

  constructor(
    private hotelService: HotelService,
    private router: Router,
    public translate: TranslateService,
    private permissionService : PermissionService,
    private authService: AuthService,
    private userService : UserService
  ) { 
   translate.addLangs(['en', 'fr', 'ar']);
  
  // Force le français comme langue par défaut
  this.translate.setDefaultLang('fr');
  
   /* const langToUse = localStorage.getItem('userLang') || 
                     translate.getBrowserLang() || 
                     'fr';
    translate.use(langToUse.match(/en|fr|ar/) ? langToUse : 'fr');*/

  }
toggleLanguageDropdown() {
    this.showLanguageDropdown = !this.showLanguageDropdown;
  }

  changeLanguage(lang: string) {
    this.currentLanguage = lang;
    this.showLanguageDropdown = false;
    // Change la langue dans ngx-translate si utilisé
    this.translate.use(lang);
  }



  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.loggedIn = true
    }
    const rolesString = sessionStorage.getItem("roles");
    if (rolesString) {
      const roles = JSON.parse(rolesString);
      if (roles.includes("CLIENT")) {
        this.userService.getUsersByRole(Role.CLIENT).subscribe((data: any) => {
          data.map((user: User) => {
            console.log(user);

            this.permissionService.getPermissionsByUser(user.id).subscribe(data => {
              const hotelPerm = data.find(p => p.interfaceName === 'Hôtel');
              if (hotelPerm) {
                this.canEditHotel = hotelPerm.canEdit;
                console.log(this.canEditHotel);
                this.canDeleteHotel = hotelPerm.canDelete;
                console.log(this.canDeleteHotel);
              }
            });
          })
        });
      }else{
        this.admin =true;
      }
    }
    this.loadHotels();
  }

  loadHotels(): void {
    this.hotelService.getAllHotels().subscribe({
      next: (data) => {
        this.hotels = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading hotels:', err);
        this.error = 'Failed to load hotels. Please try again later.';
        this.loading = false;
      }
    });
  }

 navigateToChambres(hotelId: number | undefined): void {
  if (hotelId) {
    this.loading = true;

    setTimeout(() => {
      this.router.navigate(['/hotels', hotelId, 'chambres']);
      this.loading = false;
    }, 2000); // ⏱️ 60 secondes
  }
}

  getStars(rating: number): string {
    const fullStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.ceil(rating));
    return fullStars + emptyStars;
  }

  getFirstImage(images: string | undefined): string {
  // Si images est une URL complète
  if (images?.startsWith('http')) {
    return images;
  }
  // Si c'est un chemin relatif
  if (images) {
    // Retire l'extension si elle est déjà présente
    const imageName = images.replace(/\.(png|jpg|jpeg)$/i, '');
    return `assets/images/${imageName}.png`;
  }
  // Image par défaut
  return 'assets/images/default-hotel.png';
}
  hasAvailableRooms(hotel: Hotel): boolean {
    return hotel.chambres?.some(c => c.disponible) || false;
  }

// Dans home.component.ts
deleteHotel(id?: number) {
  if (!id) return; // Si l'ID est undefined, on ne fait rien
  
  if (confirm('Êtes-vous sûr de vouloir supprimer cet hôtel ?')) {
    this.hotelService.deleteHotel(id).subscribe({
      next: (response) => {
        console.log('Hôtel supprimé:', response);
        this.hotels = this.hotels.filter(hotel => hotel.id !== id);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
      }
    });
  }
}
 logOut(){
    this.authService.logOut();
    this.router.navigate(['auth']);
  }

}