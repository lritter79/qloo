import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import id from '@angular/common/locales/id';

export interface ChatMessage {
  id: string;
  type: 'user' | 'api';
  content: string;
  timestamp: string;
  parentId?: string;
}

export interface Chat {
  id: string;
  createdAt: string;
}

export interface ApiRequest {
  prompt: string;
}

export interface ApiResponse {
  response: string;
}

export interface ChatApiResponse {
  id: string;
  createdAt: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  protected readonly API_URL = environment.apiUrl;
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private chats: Chat[] = [];
  private currentChatId: string | null = null;

  constructor(protected http: HttpClient) {}

  sendMessage(prompt: string, chatId: string): Observable<ApiResponse> {
    const request: ApiRequest = { prompt };
    return this.http.post<ApiResponse>(
      `${this.API_URL}/chat/${chatId}/message`,
      request,
      this.getAuthHeaders()
    );
  }

  createNewChat(): Observable<Chat> {
    return this.http
      .post<Chat>(`${this.API_URL}/chat`, {}, this.getAuthHeaders())
      .pipe(
        tap((chat) => {
          this.chats.unshift(chat);
          this.currentChatId = chat.id;
        })
      );
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
      //chat.messages.push(message);
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
      //chat.messages.push(message);
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

  deleteChat(chatId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/chat/${chatId}`, this.getAuthHeaders())
      .pipe(
        tap(() => {
          this.chats = this.chats.filter((chat) => chat.id !== chatId);
          if (this.currentChatId === chatId) {
            this.currentChatId =
              this.chats.length > 0 ? this.chats[0].id : null;
          }
        })
      );
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
