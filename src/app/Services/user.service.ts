import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../user';
import { Observable } from 'rxjs';
import { Role } from '../role';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/Allusers`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/`, user);
  }

    getUsersByRole(role: String): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/by-role/${role}`);
  }
}