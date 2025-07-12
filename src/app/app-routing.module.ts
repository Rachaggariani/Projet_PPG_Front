import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { ChambreComponent } from './chambre/chambre.component';
import { ReservationComponent } from './reservation/reservation.component';
import { FactureComponent } from './facture/facture.component';
import { PaiementEspeceComponent } from './paiement_espece/paiementEspece.component';
import { PaiementCarteComponent } from './paiement_carte/paiementCarte.component';
import { HabilitationComponent } from './habilitation/habilitation.component';
import { ChatAdminComponent } from './chat-admin/chat-admin.component';
import { AjoutHotelComponent } from './ajout-hotel/ajout-hotel.component';
import { EditHotelComponent } from './edit-hotel/edit-hotel.component';
import { TranslateComponent } from './translate/translate.component';
import { AuthGuardService } from './Services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirection vers /home
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  { path: 'auth', component: AuthComponent },
  { path: 'hotels/:hotelId/chambres', component: ChambreComponent, canActivate: [AuthGuardService] },
  { path: 'reservation/:hotelId/:roomType', component: ReservationComponent },
  { path: 'facture', component: FactureComponent },
  { path: 'paiement_espece', component: PaiementEspeceComponent },
  { path: 'paiement_carte', component: PaiementCarteComponent },
  { path: 'chat_Admin', component: ChatAdminComponent, canActivate: [AuthGuardService] },
  { path: 'habilitation', component: HabilitationComponent, canActivate: [AuthGuardService] },  // ... autres routes
  { path: 'AjoutHotel', component: AjoutHotelComponent, canActivate: [AuthGuardService] },
  { path: 'EditHotel/:id', component: EditHotelComponent, canActivate: [AuthGuardService] },
  { path: 'translate', component: TranslateComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
