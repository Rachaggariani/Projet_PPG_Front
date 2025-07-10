import { Component, OnInit } from '@angular/core';
import { ChatService, User, Message } from '../Services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  clientName: string = '';
  client: User = {
    id: 0,
    username: '',
    role: ''
  };
  admin!: User;
  messages: Message[] = [];
  content: string = '';
  initialized = false;
  clients: User[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    //this.loadClients();
    
    this.onClientSelect();
    //setInterval(() => this.loadMessages(), 4000);
  }

  // async loadClients() {
  //   try {
  //     const users = await this.chatService.getAllUsers();
  //     this.clients = users ? users.filter(u => u.role === 'CLIENT') : [];
  //   } catch (error) {
  //     console.error('Erreur lors du chargement des clients:', error);
  //     this.clients = [];
  //   }
  // }

  async onClientSelect() {
    //if (!this.clientName) return;
    this.client.id = Number(sessionStorage.getItem("userId"));
    this.client.username = sessionStorage.getItem("username") || "";
    this.client.role = JSON.parse(sessionStorage.getItem("roles") || '[""]')[0] || "";
    console.log("cilient", this.client);
    try {
      const users = await this.chatService.getAllUsers();

      if (!users || users.length === 0) {
        alert('Aucun utilisateur trouvé !');
        return;
      }

      // const foundClient = users.find(u => u.username === this.clientName && u.role === 'CLIENT');
      // if (!foundClient) {
      //   alert('Client introuvable !');
      //   return;
      // }

      //this.client = foundClient;
console.log("tets", this.client.id);

      const messages = await this.chatService.getMessages(this.client.id);
      console.log("messages11",messages);
      if (!messages) {
        console.error('Aucun message trouvé pour ce client.');
        return;
      }

      const adminMessage = messages.find(
        m => m.sender.role === 'ADMIN' || m.receiver.role === 'ADMIN'
      );

      if (adminMessage) {
        this.admin = adminMessage.sender.role === 'ADMIN' ? adminMessage.sender : adminMessage.receiver;
      } else {
        const admin = users.find(u => u.role === 'ADMIN');
        if (admin) {
          this.admin = admin;
        } else {
          throw new Error('Aucun administrateur trouvé');
        }
      }

      this.initialized = true;
      await this.loadMessages();
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  }

  async loadMessages() {
    if (!this.initialized || !this.client || !this.admin) return;

    try {
      console.log("client",this.client);
      const messages = await this.chatService.getMessages(this.client.id);
console.log("messages",messages);

      if (!messages) {
        console.error('Aucun message trouvé.');
        return;
      }

      this.messages = messages.filter(
        m =>
          (m.sender.id === this.client.id && m.receiver.id === this.admin.id) ||
          (m.sender.id === this.admin.id && m.receiver.id === this.client.id)
      );
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  }

  async sendMessage() {
    if (!this.content.trim() || !this.client || !this.admin) return;

    const payload = {
      sender: { id: this.client.id, role: this.client.role },
      receiver: { id: this.admin.id, role: this.admin.role },
      content: this.content
    };
console.log("payload send msg to admin",payload);
    try {
      await this.chatService.sendMessage(payload);
      this.content = '';
      await this.loadMessages();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}