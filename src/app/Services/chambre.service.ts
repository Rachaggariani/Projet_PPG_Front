import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Hotel } from './hotel.service';

export interface Chambre {
  id?: number;
  numero: string;
  type: string;
  disponible: boolean;
  hotel?: Hotel;
}


@Injectable({
  providedIn: 'root'
})
export class ChambreService {

 private apiUrl = 'http://localhost:8080/chambres';

  constructor(private http: HttpClient) { }
getChambresByHotel(hotelId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${hotelId}/chambres`);
  }

  getDisponibilite(hotelId: number): Observable<{
    simple: boolean;
    double: boolean;
    suite: boolean;
  }> {
    return this.http.get<{
      simple: boolean;
      double: boolean;
      suite: boolean;
    }>(`${this.apiUrl}/${hotelId}/disponibilite`);
  }


getFirstRoomImage(hotelId: number, roomType: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/${hotelId}/image/${roomType}`, {
      responseType: 'blob'
    }).pipe(
      map(blob => URL.createObjectURL(blob)),
      catchError(() => of(this.getDefaultImage(roomType)))
    );
  }

  getDefaultImage(roomType: string): string {
    const defaultImages: {[key: string]: string} = {
      simple: 'assets/images/SimpleChambre.png',
      double: 'assets/images/DoubleChambre.png',
      suite: 'assets/images/SuiteChambre.png'
    };
    return defaultImages[roomType] || 'assets/images/default-room.png';
  }

updateDisponibilite(hotelId: number, type: string, disponible: boolean): Observable<{simple: boolean, double: boolean, suite: boolean}> {
  return this.http.put<{simple: boolean, double: boolean, suite: boolean}>(
    `${this.apiUrl}/hotels/${hotelId}/disponibilite?type=${type}&disponible=${disponible}`,
    {}
  ).pipe(
    catchError(error => {
      console.error('Error updating disponibilité:', error);
      throw error;
    })
  );
}
createRoomType(roomType: Chambre): Observable<Chambre> {
  return this.http.post<Chambre>(this.apiUrl, roomType).pipe(
    catchError(error => {
      console.error('Error creating room type:', error);
      throw error;
    })
  );
}
}

