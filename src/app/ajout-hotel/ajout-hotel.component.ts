import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chambre, Hotel, HotelService } from '../Services/hotel.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ajout-hotel',
  templateUrl: './ajout-hotel.component.html',
  styleUrls: ['./ajout-hotel.component.css']
})
export class AjoutHotelComponent  {
  hotelForm: FormGroup;
  selectedRating: number = 0;
  selectedFile: File | null = null;
  chambres: Chambre[] = [
    { numero: 'Chambre 1', disponible: true , type: 'simple'},
    { numero: 'Chambre 2', disponible: true , type: 'double'},
    { numero: 'Chambre 3', disponible: false,type: 'suite' }
  ];

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private router: Router,
    private toastr: ToastrService

  ) {
    this.hotelForm = this.fb.group({
      nomHotel: ['', Validators.required],
      adresseHotel: ['', Validators.required],
      tel: ['', Validators.required],
      serviceDescription: ['', Validators.required],
    });
  }

  onRatingChange(rating: number): void {
    this.selectedRating = rating;
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  toggleChambreDisponibility(chambre: Chambre): void {
    chambre.disponible = !chambre.disponible;
  }
 // Tableaux séparés par type (calculés à partir du tableau principal)
  get chambresSimples(): Chambre[] {
    return this.chambres.filter(chambre => chambre.type === 'simple');
  }

  get chambresDoubles(): Chambre[] {
    return this.chambres.filter(chambre => chambre.type === 'double');
  }

  get suites(): Chambre[] {
    return this.chambres.filter(chambre => chambre.type === 'suite');
  }
 onSubmit(): void {
  if (this.hotelForm.valid && this.selectedRating > 0) {
    const formData = new FormData();
    formData.append('nomHotel', this.hotelForm.get('nomHotel')?.value);
    formData.append('adresseHotel', this.hotelForm.get('adresseHotel')?.value);
      formData.append('serviceDescription', this.hotelForm.get('serviceDescription')?.value);
    formData.append('rating', this.selectedRating.toString());
    formData.append('tel', this.hotelForm.get('tel')?.value);
    
    // Stringify chambres array
    formData.append('chambres', JSON.stringify(
      this.chambres.map(chambre => ({
        numero: chambre.numero,
        disponible: chambre.disponible,
        type: chambre.type
      }))
    ));

    // Add image if selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.hotelService.createHotel(formData).subscribe({
      next: (response) => {
        console.log('Hotel created successfully:', response);
 this.toastr.success('<span class="toast-msg">Hôtel ajouté avec succès!</span>', '', {
  timeOut: 6000,
  progressBar: true,
  enableHtml: true
});
    setTimeout(() => this.router.navigate(['/home']), 500);
  },
      error: (error) => {
        console.error('Error creating hotel:', error);
 this.toastr.error('<span class="toast-msg">Erreur lors de l\'ajout</span>', '', {
  timeOut: 5000,
  enableHtml: true
});
      }
    });
  }
}
  private uploadImage(hotelId: number): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    // Vous devrez implémenter cette méthode dans votre backend
    this.hotelService.createHotelWithImage(formData).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.router.navigate(['/home']);
      }
    });
  }
  goBack() {
  this.router.navigate(['/home']);
}

}