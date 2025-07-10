import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('jwtToken');
    //console.log("Token récupéré:", token);

    // Clonage unique des requêtes avec tous les headers nécessaires
    if (token) {
      req = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          //'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    } else {
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    }

    // Gestion des erreurs
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log("Erreur 401 Unauthorized - Token invalide ou expiré");
          // (optionnel) redirection vers la page de login :
          // this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
