import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import html2pdf from 'html2pdf.js';


@Component({
  selector: 'app-chambre',
  templateUrl: './paiementCarte.component.html',
  styleUrls: ['./paiementCarte.component.css']
})
export class PaiementCarteComponent {
  @ViewChild('invoiceContent', { static: false }) invoiceContent!: ElementRef;
  isLoading = false;
  constructor(private router: Router) {}

  navigateToAccueil() {
    this.isLoading = true;
    
    setTimeout(() => {
      this.router.navigate(['/home'], { 
        queryParams: {} 
      });
      this.isLoading = false;
    }, 2000);
  }

  navigateToFacture() {
    this.isLoading = true;
    
    setTimeout(() => {
      this.router.navigate(['/facture'], { 
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
SuccessMessage() {
  alert("✅ Paiement réussi ! (C'est une simulation)");
}

}
