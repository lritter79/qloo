import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { Chat, ChatService } from '../../../services/chat.service';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { MessagesComponent } from "./messages/messages.component";
import { FormatDatePipe } from "../../../pipes/format-date.pipe";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [Button, ProgressSpinner, TextareaModule, CommonModule, FormsModule, MessagesComponent, FormatDatePipe],
})
export class ChatbotComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  currentMessage = '';
  isLoading = false;
  chats: Chat[] = [];
  currentChat: Chat | null = null;

  private destroy$ = new Subject<void>();
  private shouldScrollToBottom = false;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    console.log('Chat component constructor called');
  }

  ngOnInit(): void {
    console.log('Chat component initialized');

    // Subscribe to chats and current chat changes first
    combineLatest([
      this.chatService.chats$,
      this.chatService.currentChatId$,
      this.route.paramMap,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([chats, currentChatId, params]) => {
        this.chats = chats;

        const routeId = params.get('id');

        // If route has an ID but it's different from current chat, update current chat
        if (routeId && routeId !== currentChatId) {
          const foundChat = chats.find((c) => c.id === routeId);
          if (foundChat) {
            this.chatService.setCurrentChat(routeId);
            this.currentChat = foundChat;
          } else if (chats.length > 0) {
            // Route ID doesn't exist, redirect to base chat route (no selection)
            this.router.navigate(['/chat']);
            return;
          }
        }
        // If no route ID, ensure no chat is selected (don't auto-navigate)
        else if (!routeId) {
          if (currentChatId) {
            // Clear any selected chat when on base /chat route
            this.chatService.setCurrentChat(null);
          }
          this.currentChat = null;
        }
        // If route ID matches current chat ID, just update the current chat reference
        else if (routeId === currentChatId) {
          this.currentChat = chats.find((c) => c.id === currentChatId) || null;
        }

        this.shouldScrollToBottom = true;
      });

    // Load chats only once, after setting up subscriptions
    this.chatService.getUserChats().subscribe({
      error: (err) => {
        console.error('Failed to load chats:', err);
      },
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createNewChat(): void {
    this.chatService.createNewChat().subscribe({
      next: (chat) => {
        // Navigation will be handled by the subscription to currentChatId$
        this.shouldScrollToBottom = true;
      },
      error: (err) => {
        console.error('Failed to create chat:', err);
      },
    });
  }

  selectChat(chat: Chat): void {
    // Just navigate to the chat - the subscription will handle the rest
    this.router.navigate(['/chat', chat.id]);
  }

  deleteChat(chat: Chat, event: Event): void {
    event.stopPropagation();
    this.chatService.deleteChat(chat.id).subscribe({
      next: () => {
        // Navigation will be handled by the subscription to currentChatId$
      },
      error: (err) => {
        console.error('Failed to delete chat:', err);
      },
    });
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading || !this.currentChat) {
      return;
    }

    const messageContent = this.currentMessage.trim();
    const chatId = this.currentChat.id;
    this.currentMessage = '';

    // Add user message
    const userMessageId = this.chatService.addUserMessage(
      messageContent,
      chatId
    );
    this.shouldScrollToBottom = true;

    // Send to API
    this.isLoading = true;
    this.chatService.sendMessage(messageContent, chatId).subscribe({
      next: (response) => {
        this.chatService.addApiMessage(
          response.response,
          userMessageId,
          chatId
        );
        this.isLoading = false;
        this.shouldScrollToBottom = true;
      },
      error: (error) => {
        console.error('API Error:', error);
        this.chatService.addApiMessage(
          'Sorry, I encountered an error. Please try again.',
          userMessageId,
          chatId
        );
        this.isLoading = false;
        this.shouldScrollToBottom = true;
      },
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
