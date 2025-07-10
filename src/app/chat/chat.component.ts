import { Component, OnInit } from '@angular/core';
import { ChatService, User, Message } from '../Services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  clientId: number | null = null;
  client!: User;
  admin!: User;
  messages: Message[] = [];
  content: string = '';
  initialized = false;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    setInterval(() => this.loadMessages(), 4000);
  }

  async onClientIdChange() {
    if (!this.clientId) return;

    try {
      const users = await this.chatService.getAllUsers();

      if (!users || users.length === 0) {
        alert('Aucun utilisateur trouvé !');
        return;
      }

      const foundClient = users.find(u => u.id === this.clientId && u.role === 'CLIENT');
      if (!foundClient) {
        alert('Client introuvable !');
        return;
      }

      this.client = foundClient;

      const messages = await this.chatService.getMessages(this.client.id);
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
        this.admin = users.find(u => u.role === 'ADMIN')!;
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
      const messages = await this.chatService.getMessages(this.client.id);

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