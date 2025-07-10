import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface Message {
  sender: User;
  receiver: User;
  content: string;
    timestamp: string; 

}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly API = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<any[]>(`${this.API}/Allusers`).toPromise();
  }

  getMessages(adminId: number) {
    return this.http.get<any[]>(`${this.API}/messages/${adminId}`).toPromise();
  }

  sendMessage(payload: any) {
    return this.http.post(`${this.API}/message`, payload).toPromise();
  }
}