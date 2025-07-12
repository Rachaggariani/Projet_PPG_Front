import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { HotelService } from '../Services/hotel.service';
import { catchError, map, Observable, throwError, of } from 'rxjs';
import { finalize } from 'rxjs/operators';

interface ReservationData {
  hotelId: number;
  hotelName$: string;
  roomType: string;
  roomNumber: string;
  guestCount: number;
  services: string[];
  checkInDate: string;
  checkOutDate: string;
  roomPrice: number;
  selectedServices: {
    label: string;
    price: number;
  }[];
}

@Component({
  selector: 'app-chambre',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class FactureComponent implements OnInit{
  @ViewChild('invoiceContent', { static: false }) invoiceContent!: ElementRef;
  isLoading = false;
  hotelId!: number;
  hotelName$: Observable<string> = of('Chargement...'); // Initialize immediately
  isLoadingHotel = true;
  roomType!: string;
  // Invoice data
  invoiceNumber: string = Math.floor(1000000 + Math.random() * 9000000).toString();
  clientName: string = 'Guest';
  reservationData!: ReservationData;
  
  // Calculated values
  totalNights: number = 0;
  subTotal: number = 0;
  tvaAmount: number = 0;
  totalTTC: number = 0;
  constructor(private hotelService: HotelService, private router: Router) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.clientName = user.username; // or user.name if available
    }
    const navigation = this.router.getCurrentNavigation();
    this.reservationData = navigation?.extras.state as ReservationData;
    if (!this.reservationData) {
      const savedData = localStorage.getItem('reservationData');
      if (savedData) this.reservationData = JSON.parse(savedData);
    }
    if (!this.reservationData) {
      console.error('No reservation data found!');
      this.router.navigate(['/home']);
      return;
    }
    this.hotelId = this.reservationData.hotelId;
    this.roomType = this.reservationData.roomType;
    // Calculate stay duration
    const checkIn = new Date(this.reservationData.checkInDate);
    const checkOut = new Date(this.reservationData.checkOutDate);
    this.totalNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    // Calculate prices
    this.calculateInvoice();
    if (this.reservationData?.hotelId) {
      this.hotelName$ = this.hotelService.getHotelName(this.reservationData.hotelId).pipe(
        finalize(() => this.isLoadingHotel = false)
      );
    } else {
      this.hotelName$ = of('Hôtel non spécifié');
    }
  }
  private calculateInvoice(): void {
    // Room cost
    const roomCost = this.reservationData.roomPrice * this.totalNights;
    
    // Services cost
    const servicesCost = this.reservationData.selectedServices.reduce(
      (sum, service) => sum + (service.price  * this.totalNights), 
      0
    );
    
    this.subTotal = roomCost + servicesCost;
    this.tvaAmount = this.subTotal * 0.12; // 12% TVA
    this.totalTTC = this.subTotal + this.tvaAmount;
  }
  calculateTotal(): number {
    const roomTotal = this.reservationData.roomPrice * this.totalNights;
    const servicesTotal = this.reservationData.selectedServices.reduce(
      (sum, service) => sum + (service.price * this.reservationData.guestCount * this.totalNights), 
      0
    );
    return roomTotal + servicesTotal;
  }
  navigateToAccueil() {
    this.isLoading = true;
    
    setTimeout(() => {
      this.router.navigate(['/home'], { 
        queryParams: {} 
      });
      this.isLoading = false;
    }, 2000);
  }

  navigateToReservation() {
    this.router.navigate(
      ['/reservation', this.reservationData.hotelId, this.reservationData.roomType],
      { state: this.reservationData } // Pass the data back
    );
  }
  navigateToPaiementCarte() {
    this.isLoading = true;
    
    setTimeout(() => {
      this.router.navigate(['/paiement_carte'],{ state: this.reservationData, 
        queryParams: {} 
      });
      this.isLoading = false;
    }, 2000);
  }
  navigateToPaiementEspeces() {
    this.isLoading = true;
    
    setTimeout(() => {
      this.router.navigate(['/paiement_espece'], { state: this.reservationData, 
        queryParams: {} 
      });
      this.isLoading = false;
    }, 2000);
  }
  downloadInvoice(event: Event) {
    if(event) event.preventDefault();
    setTimeout(() => {
      const options = {
        filename: 'facture.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const content: HTMLElement = this.invoiceContent.nativeElement;
      html2pdf().from(content).set(options).save();
    }, 100);
  }
  PaymentMessage() {
    alert("✅ Chambre(s) réservée(s). Veuillez payer à la caisse à votre arrivée à l'hotel ! ");
  }


}
