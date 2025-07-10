import { Component, OnInit,OnDestroy  } from '@angular/core';
import { ChatService, User, Message } from '../Services/chat.service';


@Component({
  selector: 'app-chat-admin',
  templateUrl: './chat-admin.component.html',
  styleUrls: ['./chat-admin.component.css']
})
export class ChatAdminComponent implements OnInit, OnDestroy {
  admin: User | null = null;
  clients: User[] = [];
  filteredClients: User[] = [];
  selectedClient: User | null = null;
  messages: Message[] = [];
  content: string = '';
  searchTerm: string = '';
  intervalId: any;

  constructor(private chatService: ChatService) {}

  async ngOnInit(): Promise<void> {
    await this.loadAdminAndClients();
    this.startAutoRefresh();
  }

  async loadAdminAndClients(): Promise<void> {
    try {
      // Supposons que vous ayez un admin avec ID 1 (ou autre selon votre logique)
      const users = (await this.chatService.getAllUsers()) as User[];
      this.admin = users.find(u => u.role === 'ADMIN') || null;

      if (!this.admin) {
        console.error('Aucun admin trouvé');
        return;
      }

      const allMessages = (await this.chatService.getMessages(this.admin.id)) as Message[];
      const clientIds = [...new Set(allMessages.map(m => 
        m.sender.role === 'CLIENT' ? m.sender.id : m.receiver.id
      ))];
      
      this.clients = users.filter(u => 
        u.role === 'CLIENT' && clientIds.includes(u.id)
      );
      this.filteredClients = [...this.clients];
      
      if (this.clients.length > 0) {
        this.selectedClient = this.clients[0];
        await this.loadMessages();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
    }
  }

  filterClients(): void {
    if (!this.searchTerm) {
      this.filteredClients = [...this.clients];
      return;
    }
    
    this.filteredClients = this.clients.filter(client =>
      client.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  async loadMessages(): Promise<void> {
    if (!this.admin || !this.selectedClient) return;

    try {
      const allMessages = (await this.chatService.getMessages(this.admin.id)) as Message[];
      this.messages = allMessages.filter(
        (m) =>
          (m.sender.id === this.admin!.id && m.receiver.id === this.selectedClient!.id) ||
          (m.sender.id === this.selectedClient!.id && m.receiver.id === this.admin!.id)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (error) {
      console.error('Erreur lors du chargement des messages', error);
    }
  }

  async sendMessage(): Promise<void> {
    if (!this.content.trim() || !this.admin || !this.selectedClient) return;

    try {
      await this.chatService.sendMessage({
        sender: { id: this.admin.id, role: 'ADMIN' },
        receiver: { id: this.selectedClient.id, role: 'CLIENT' },
        content: this.content.trim(),
        timestamp: new Date().toISOString()
      });

      this.content = '';
      await this.loadMessages();
    } catch (error) {
      console.error('Erreur lors de l envoi du message', error);
    }
  }

  selectClient(client: User): void {
    this.selectedClient = client;
    this.loadMessages();
  }

  startAutoRefresh(): void {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        if (this.selectedClient) {
          this.loadMessages();
        }
      }, 4000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}