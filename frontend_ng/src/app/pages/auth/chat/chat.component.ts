import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { Chat, ChatService } from '../../../services/chat.service';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [Button, ProgressSpinner, TextareaModule, CommonModule, FormsModule],
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  currentMessage = '';
  isLoading = false;
  chats: Chat[] = [];
  currentChat: Chat | null = null;
  chatId: string | null = null;
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
    this.chatService.getUserChats().subscribe({
      next: (chats) => {
        this.chats = chats;
        this.loadChats();
        this.shouldScrollToBottom = true;
      },
      error: (err) => {
        console.error('Failed to load chats:', err);
      },
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.chatId = id;
      if (id) {
        const foundChat = this.chats.find((c) => c.id === id);
        if (foundChat) {
          this.selectChat(foundChat);
        } else {
          this.router.navigate(['/chat']);
        }
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  loadChats(): void {
    this.chats = this.chatService.getAllChats();
    this.currentChat = this.chatService.getCurrentChat();
  }

  createNewChat(): void {
    this.chatService.createNewChat().subscribe({
      next: (chat) => {
        this.loadChats();
        this.shouldScrollToBottom = true;
        this.router.navigate(['/chat', chat.id]);
      },
      error: (err) => {
        console.error('Failed to create chat:', err);
      },
    });
  }

  selectChat(chat: Chat): void {
    this.chatService.setCurrentChat(chat.id);
    this.currentChat = chat;
    this.shouldScrollToBottom = true;
  }

  deleteChat(chat: Chat, event: Event): void {
    event.stopPropagation();
    this.chatService.deleteChat(chat.id).subscribe({
      next: () => {
        this.loadChats();
        this.router.navigate(['/chat']);
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
    this.currentMessage = '';

    // Add user message
    const userMessageId = this.chatService.addUserMessage(messageContent);
    this.loadChats();
    this.shouldScrollToBottom = true;

    // Send to API
    this.isLoading = true;
    this.chatService
      .sendMessage(messageContent, this.currentChat.id)
      .subscribe({
        next: (response) => {
          this.chatService.addApiMessage(response.response, userMessageId);
          this.loadChats();
          this.isLoading = false;
          this.shouldScrollToBottom = true;
        },
        error: (error) => {
          console.error('API Error:', error);
          this.chatService.addApiMessage(
            'Sorry, I encountered an error. Please try again.',
            userMessageId
          );
          this.loadChats();
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    console.log(date);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  formatMessageTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
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
