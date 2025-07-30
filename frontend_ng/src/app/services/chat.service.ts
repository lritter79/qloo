import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
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
  createdAt: string;
  messages: ChatMessage[];
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

  // Use BehaviorSubjects for reactive state management
  private chatsSubject = new BehaviorSubject<Chat[]>([]);
  private currentChatIdSubject = new BehaviorSubject<string | null>(null);

  // Public observables
  public chats$ = this.chatsSubject.asObservable();
  public currentChatId$ = this.currentChatIdSubject.asObservable();

  constructor(protected http: HttpClient) {}

  getUserChats(): Observable<ChatApiResponse[]> {
    return this.http
      .get<ChatApiResponse[]>(`${this.API_URL}/chats`, this.getAuthHeaders())
      .pipe(
        tap((chats) => {
          const mappedChats = chats.map((chat) => ({
            id: chat.id,
            createdAt: chat.createdAt,
            messages: [] as ChatMessage[],
          }));
          this.chatsSubject.next(mappedChats);

          // Set current chat to first one if none selected
          const currentId = this.currentChatIdSubject.value;
          if (!currentId && mappedChats.length > 0) {
            this.setCurrentChat(mappedChats[0].id);
          } else if (
            currentId &&
            !mappedChats.find((c) => c.id === currentId)
          ) {
            // Current chat no longer exists, select first available or null
            this.setCurrentChat(
              mappedChats.length > 0 ? mappedChats[0].id : null
            );
          }
        })
      );
  }

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
          const newChat: Chat = {
            ...chat,
            messages: [],
          };
          const currentChats = this.chatsSubject.value;
          this.chatsSubject.next([newChat, ...currentChats]);
          this.setCurrentChat(newChat.id);
        })
      );
  }

  addUserMessage(content: string, chatId: string): string {
    const messageId = this.generateId();
    const message: ChatMessage = {
      id: messageId,
      type: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    this.addMessageToChat(chatId, message);
    return messageId;
  }

  addApiMessage(content: string, parentId: string, chatId: string): string {
    const messageId = this.generateId();
    const message: ChatMessage = {
      id: messageId,
      type: 'api',
      content,
      timestamp: new Date().toISOString(),
      parentId,
    };

    this.addMessageToChat(chatId, message);
    return messageId;
  }

  private addMessageToChat(chatId: string, message: ChatMessage): void {
    const currentChats = this.chatsSubject.value;
    const updatedChats = currentChats.map((chat) =>
      chat.id === chatId
        ? { ...chat, messages: [...chat.messages, message] }
        : chat
    );
    this.chatsSubject.next(updatedChats);
  }

  getCurrentChat(): Chat | null {
    const currentId = this.currentChatIdSubject.value;
    return currentId
      ? this.chatsSubject.value.find((chat) => chat.id === currentId) || null
      : null;
  }

  getAllChats(): Chat[] {
    return this.chatsSubject.value;
  }

  setCurrentChat(chatId: string | null): void {
    this.currentChatIdSubject.next(chatId);
  }

  getCurrentChatId(): string | null {
    return this.currentChatIdSubject.value;
  }

  deleteChat(chatId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/chat/${chatId}`, this.getAuthHeaders())
      .pipe(
        tap(() => {
          const currentChats = this.chatsSubject.value;
          const updatedChats = currentChats.filter(
            (chat) => chat.id !== chatId
          );
          this.chatsSubject.next(updatedChats);

          // Update current chat if the deleted one was selected
          if (this.currentChatIdSubject.value === chatId) {
            this.setCurrentChat(
              updatedChats.length > 0 ? updatedChats[0].id : null
            );
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
