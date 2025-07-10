import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Permission } from '../models/Permission';
import { Observable } from 'rxjs';
import { Role } from '../role';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private baseUrl = 'http://localhost:8080/api/permissions';

  constructor(private http: HttpClient) {}

  savePermissions(permissions: Permission[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/save`, permissions);
  }

  getPermissionsByUser(userId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.baseUrl}/user/${userId}`);
  }

}