import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

type RoomKey = 'single' | 'double' | 'suite';


interface RoomType {
  name: string;
  guestCount: number;
  roomSize: number;
  price: number;
  description: string;
  features: string[];
  images: string[];
}


interface SelectedService {
    value: string;
    label: string;
    price: number;
}

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})

export class ReservationComponent implements OnInit {
  // Loading state
  isLoading = false;
  hotelId!: number;
  checkInDate: string = '';
  checkOutDate: string = '';
  // Current room data
  roomType: RoomKey = 'single';
  guestCount = 0;
  roomSize = 0;
  roomPrice = 0;
  roomDescription = '';
  roomFeatures: string[] = [];
  roomImages: string[] = [];
  
  // Services (shared across all rooms)
  
  selectedServices: SelectedService[] = []; 
  availableServices: SelectedService[] = [
    { value: 'demi_pension', label: 'Demi-pension', price: 50 },
    { value: 'pension_complete', label: 'Pension complète', price: 90 },
    { value: 'jacuzzi', label: 'Jacuzzi', price: 40 },
    { value: 'spa_massage', label: 'Spa & massages', price: 140 },
    { value: 'service_chambre', label: 'Service de chambre 24h/24', price: 30 },
    { value: 'navette', label: 'Navette aéroport', price: 60 }
  ];
  onServiceSelect(service: SelectedService, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    
    if (isChecked) {
      this.selectedServices.push({ ...service });
    } else {
      this.selectedServices = this.selectedServices.filter(
        s => s.value !== service.value
      );
    }
  }
  isServiceSelected(serviceValue: string): boolean {
    return this.selectedServices.some(s => s.value === serviceValue);
  }
  // Room configurations
  private readonly roomTypes: Record<RoomKey, RoomType> = {
    single: {
      name: 'Chambre Simple',
      guestCount: 1,
      roomSize: 18,
      price: 500,
      description: 'Notre chambre simple offre un espace fonctionnel et confortable avec un lit simple, parfait pour les voyageurs individuels. Équipée de tous les essentiels pour un séjour agréable.',
      features: [
        'Lit simple confortable',
        'Téléviseur HD 32"',
        'Machine à café',
        'Douche moderne',
        'WiFi haut débit',
        'Bureau de travail'
      ],
      images: [
        'assets/images/single_bed.jpg',
        'assets/images/coiffeuse.jpg',
        'assets/images/salle_eau_s.jpeg'
      ]
    },
    double: {
      name: 'Chambre Double',
      guestCount: 2,
      roomSize: 25,
      price: 900,
      description: 'Découvrez notre chambre double au design contemporain, équipée d\'un spacieux lit double et d\'une douche privative moderne. Appréciez le confort d\'une literie haut de gamme et d\'équipements pratiques.',
      features: [
        'Lit double premium avec matelas orthopédique',
        'Téléviseur HD 43" avec chaînes internationales',
        'Machine à café Nespresso et thé d\'accueil',
        'Douche à effet pluie avec produits d\'accueil',
        'WiFi haut débit (fibre optique)'
      ],
      images: [
        'assets/images/twin_bed.jpg',
        'assets/images/coin_cafe.png',
        'assets/images/salle_eau_d.jpeg'
      ]
    },
    suite: {
      name: 'Suite',
      guestCount: 4,
      roomSize: 200,
      price: 1700,
      description: 'Cette suite spacieuse avec lit King Size offre un cadre élégant et chaleureux, idéal pour accueillir jusqu\'à 4 personnes. Elle dispose d\'un matelas haut de gamme, d\'une literie soyeuse et d\'une salle de bain moderne avec bain.',
      features: [
        'Lit King Size ultra-confortable',
        'Téléviseur HD 48" avec plus de 60 chaînes',
        'Machine à café et à thé premium',
        'Bain chaud et froid',
        'Connexion Internet WiFi gratuite',
        'Espace salon séparé'
      ],
      images: [
        'assets/images/double_bed.jpg',
        'assets/images/livingRoom.png',
        'assets/images/jacuzzi.jpg'
      ]
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.hotelId = +params['hotelId'];
      const roomParam = params['roomType'] as RoomKey;
      this.roomType = this.isValidRoomKey(roomParam) ? roomParam : 'single';
      this.loadRoomData(this.roomType);
    });
    
  } 

  private isValidRoomKey(key: string): key is RoomKey {
    return ['single', 'double', 'suite'].includes(key);
  }

  private loadRoomData(roomType: RoomKey): void {
    const room = this.roomTypes[roomType];
    this.guestCount = room.guestCount;
    this.roomSize = room.roomSize;
    this.roomPrice = room.price;
    this.roomDescription = room.description;
    this.roomFeatures = room.features;
    this.roomImages = room.images;
  }

  // Navigation methods
  navigateToAccueil(): void {
    this.navigateWithLoader('/home');
  }
  
  // navigateToTypeChambre(): void {
  //   this.navigateWithLoader('/chambre');
  // }

   navigateToChambres() {
    this.router.navigate(['/hotels', this.hotelId, 'chambres']);
  }

  navigateToFacture(): void {
    if (!this.checkInDate || !this.checkOutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }
    const reservationData = {
      hotelId: this.hotelId,
      hotelName: 'Hôtel Regency Hammamet', // Get from your data
      roomType: this.roomType,
      roomNumber: '350', // Get from your data
      guestCount: this.guestCount,
      services: this.selectedServices.map(s => s.label),
      selectedServices: this.selectedServices,
      checkInDate: this.checkInDate, // Make sure these exist
      checkOutDate: this.checkOutDate,
      roomPrice: this.roomPrice
    };
    localStorage.setItem('reservationData', JSON.stringify(reservationData));
    console.log('Sending reservationData:', reservationData);
    this.router.navigate(['/facture'], { 
      state: reservationData 
    });
  }

  private navigateWithLoader(path: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.router.navigate([path]);
      this.isLoading = false;
    }, 2000);
  }
}