import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  id: string;
  type: 'user' | 'api';
  content: string;
  timestamp: string;
  parentId?: string;
}

export interface Chat {
  id: string;
  date: string;
  messages: ChatMessage[];
}

export interface ApiRequest {
  prompt: string;
}

export interface ApiResponse {
  response: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly API_URL = environment.apiUrl;
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private chats: Chat[] = [];
  private currentChatId: string | null = null;

  constructor(private http: HttpClient) {}

  sendMessage(prompt: string): Observable<ApiResponse> {
    const request: ApiRequest = { prompt };
    return this.http.post<ApiResponse>(
      `${this.API_URL}/chat`,
      request,
      this.getAuthHeaders()
    );
  }

  createNewChat(): string {
    const chatId = this.generateId();
    const newChat: Chat = {
      id: chatId,
      date: new Date().toISOString(),
      messages: [],
    };
    this.chats.unshift(newChat);
    this.currentChatId = chatId;
    return chatId;
  }

  addUserMessage(content: string): string {
    if (!this.currentChatId) {
      this.createNewChat();
    }

    const messageId = this.generateId();
    const message: ChatMessage = {
      id: messageId,
      type: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    const chat = this.getCurrentChat();
    if (chat) {
      chat.messages.push(message);
    }

    return messageId;
  }

  addApiMessage(content: string, parentId: string): string {
    const messageId = this.generateId();
    const message: ChatMessage = {
      id: messageId,
      type: 'api',
      content,
      timestamp: new Date().toISOString(),
      parentId,
    };

    const chat = this.getCurrentChat();
    if (chat) {
      chat.messages.push(message);
    }

    return messageId;
  }

  getCurrentChat(): Chat | null {
    return this.chats.find((chat) => chat.id === this.currentChatId) || null;
  }

  getAllChats(): Chat[] {
    return this.chats;
  }

  setCurrentChat(chatId: string): void {
    this.currentChatId = chatId;
  }

  deleteChat(chatId: string): void {
    this.chats = this.chats.filter((chat) => chat.id !== chatId);
    if (this.currentChatId === chatId) {
      this.currentChatId = this.chats.length > 0 ? this.chats[0].id : null;
    }
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get authorization headers for HTTP requests
   */
  private getAuthHeaders(): { headers: { Authorization: string } } {
    const token = this.getAccessToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
}
