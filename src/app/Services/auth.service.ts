import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { SignupRequest } from '../models/SignupRequest';
import { LoginRequest } from '../models/LoginRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl + "api/auth";
  constructor(private http: HttpClient) { }

  register(user: SignupRequest): Observable<any> {
    // On force le rôle "client"
    // const signupData = {
    //   ...user,
    //   role: ["client"]
    // };
     //console.log("Signup payload:", signupData);
    return this.http.post(this.apiUrl + "/signup", user);
  };

  authenticate(loginReq: LoginRequest) {
    let userData: any = this.http.post(this.apiUrl + "/signin",
      { "username": loginReq.username, "password": loginReq.password }).pipe(
        map(
          (response: any) => {
            sessionStorage.setItem('jwtToken', response.accessToken);
            sessionStorage.setItem('username', response.username);
            sessionStorage.setItem("userId", response.id.toString());
            sessionStorage.setItem('roles', JSON.stringify(response.roles));
            userData = response;
          }
        )
      );
    return userData;
  };

  /**
   * Vérifie si un utilisateur est connecté.
   */
  isUserLoggedIn() {
    let user = sessionStorage.getItem('username')
    //console.log(!(user === null))
    return !(user === null)
  };

  /**
   * Déconnexion de l'utilisateur.
   */
  logOut() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('roles');
  };

  /**
   * Récupère les rôles de l'utilisateur connecté.
   */
  // getUserRoles(): string[] {
  //   const roles = sessionStorage.getItem('roles');
  //   return roles ? JSON.parse(roles) : [];
  // }

  /**
   * Récupère le token JWT.
   */
  getToken(): string | null {
    return sessionStorage.getItem('jwtToken');
  }
}
