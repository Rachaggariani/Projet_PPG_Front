import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { HotelService } from '../Services/hotel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChambreService } from '../Services/chambre.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-edit-hotel',
  templateUrl: './edit-hotel.component.html',
  styleUrls: ['./edit-hotel.component.css']
})
export class EditHotelComponent implements OnInit {
  hotelForm: FormGroup;
  hotelId: number = 0;
  selectedFile: File | null = null;
  groupedChambres: {[type: string]: FormGroup[]} = {};
    constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private chambreService: ChambreService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService

  ) {
    this.hotelForm = this.fb.group({
      nomHotel: [''],
      adresseHotel: [''],
      serviceDescription:[''],
      tel: [''],
      rating: [0],
      chambres: this.fb.array([]),
      imageFile: [null]
    });
  }

  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.hotelId = +id;
    this.loadHotelData();
  } else {
    console.error('No hotel ID provided in route');
    // Rediriger ou gérer l'erreur
  }
}

  loadHotelData(): void {
    this.hotelService.getHotelById(this.hotelId).subscribe(hotel => {
      this.hotelForm.patchValue({
        nomHotel: hotel.nomHotel,
        adresseHotel: hotel.adresseHotel,
        serviceDescription: hotel.serviceDescription,
        rating: hotel.rating,
        tel: hotel.tel,
        
      });

     const chambresArray = this.hotelForm.get('chambres') as FormArray;
    chambresArray.clear();
    
   if (hotel.chambres) {
        hotel.chambres.forEach(chambre => {
    const type = chambre.type;
        
        chambresArray.push(this.fb.group({
            id: [chambre.id],
            type: [type],
            disponible: [chambre.disponible]
          }));
        });
          this.groupChambresByType();
    }
  });
  
}

 // Modifiez groupChambresByType() pour initialiser toujours les 3 types :
groupChambresByType(): void {
  // Initialiser les 3 catégories même vides
  this.groupedChambres = {
    simple: [],
    double: [],
    suite: []
  };

  this.chambres.controls.forEach(control => {
    const type = control.get('type')?.value;
    if (type && this.groupedChambres[type]) {
      this.groupedChambres[type].push(control as FormGroup);
    }
  });
}

  get chambres(): FormArray {
    return this.hotelForm.get('chambres') as FormArray;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
    this.hotelForm.patchValue({
      imageFile: this.selectedFile
    });
  }

  onSubmit(): void {
  // Vérifier que l'ID est bien défini
  if (!this.hotelId || this.hotelId === 0) {
    console.error('Hotel ID is missing');
    return;
  }

  const formData = new FormData();
  const hotelData = this.hotelForm.value;

  // Créer l'objet hotel avec toutes les propriétés nécessaires
  const hotel = {
    id: this.hotelId,
    nomHotel: hotelData.nomHotel,
    adresseHotel: hotelData.adresseHotel,
    serviceDescription: hotelData.serviceDescription,
    rating: hotelData.rating,
    tel: hotelData.tel,
    chambres: hotelData.chambres,
    images: '' // Initialiser avec une valeur par défaut
  };

  // Ajouter les données au FormData
  formData.append('hotel', new Blob([JSON.stringify(hotel)], { type: 'application/json' }));

  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  this.hotelService.updateHotel(formData).subscribe({
    next: () => {
this.toastr.success('<span class="toast-msg">Hôtel modifié avec succès !</span>', '', {
  timeOut: 6000,
  progressBar: true,
  enableHtml: true
});
    setTimeout(() => this.router.navigate(['/home']), 500);
  }, 
    error: (err) => {
      console.error('Error updating hotel:', err);
   this.toastr.error('<span class="toast-msg">Erreur lors de modification</span>', '', {
  timeOut: 5000,
  enableHtml: true
});
      }
    });
  }
formatAsNumber() {
  const rawValue = this.hotelForm.get('tel')?.value;
  const numericValue = Number(String(rawValue).replace(/\D/g, ''));
  
  this.hotelForm.patchValue({
    tel: numericValue
  });
}
toggleDisponibilite(chambre: FormGroup): void {
  const newValue = !chambre.get('disponible')?.value;
  chambre.get('disponible')?.patchValue(newValue);
  
  // Utilisez directement le type stocké dans le formulaire
  const roomType = chambre.get('type')?.value;

  if (roomType) {
    this.chambreService.updateDisponibilite(
      this.hotelId,
      roomType,
      newValue
    ).subscribe({
      error: (err) => {
        console.error('Erreur lors de la mise à jour', err);
        chambre.get('disponible')?.patchValue(!newValue); // Annuler en cas d'erreur
      }
    });
  }
}
goBack() {
  this.router.navigate(['/home']);
}

}