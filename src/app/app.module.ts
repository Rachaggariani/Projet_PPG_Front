import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // <-- Ajoutez cette ligne
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { ChambreComponent } from './chambre/chambre.component';
import { ChatComponent } from './chat/chat.component';
import { ReservationComponent } from './reservation/reservation.component';
import { FactureComponent } from './facture/facture.component';
import { PaiementEspeceComponent } from './paiement_espece/paiementEspece.component';
import { PaiementCarteComponent } from './paiement_carte/paiementCarte.component';
import { HabilitationComponent } from './habilitation/habilitation.component';
import { ChatAdminComponent } from './chat-admin/chat-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from './Services/chat.service';
import { UserService } from './Services/user.service';
import { AjoutHotelComponent } from './ajout-hotel/ajout-hotel.component';
import { HotelService } from './Services/hotel.service';
import { EditHotelComponent } from './edit-hotel/edit-hotel.component';
import { TranslateComponent } from './translate/translate.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TokenInterceptorService } from './Services/token-interceptor.service';
import { RadioButtonModule } from 'primeng/radiobutton';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    ChambreComponent,
    ChatComponent,
    ReservationComponent,
    FactureComponent,
    PaiementEspeceComponent,
    PaiementCarteComponent,
    HabilitationComponent,
    ChatAdminComponent,
    AjoutHotelComponent,
    EditHotelComponent,
    TranslateComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,// Ajoutez ceci
    FormsModule, // <-- Ajoutez ce module
    HttpClientModule, // <-- Ajoutez ce module
    AppRoutingModule,
    BrowserAnimationsModule, // Doit être avant ToastrModule
    RadioButtonModule,
    ToastrModule.forRoot({
    toastClass: 'ngx-toastr', // Doit correspondre à votre classe CSS
    positionClass: 'toast-top-right',
    timeOut: 4000,
    closeButton: true,
    progressBar: false, // Désactivé pour plus de propreté
    tapToDismiss: false,
    enableHtml: true
}),
  TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService, // Remplacez par votre interceptor personnalisé
      multi: true
    },
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
