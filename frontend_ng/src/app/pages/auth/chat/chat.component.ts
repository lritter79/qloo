import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { Chat, ChatService } from '../../../services/chat';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  private shouldScrollToBottom = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadChats();
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
    this.chatService.createNewChat();
    this.loadChats();
    this.shouldScrollToBottom = true;
  }

  selectChat(chat: Chat): void {
    this.chatService.setCurrentChat(chat.id);
    this.currentChat = chat;
    this.shouldScrollToBottom = true;
  }

  deleteChat(chat: Chat, event: Event): void {
    event.stopPropagation();
    this.chatService.deleteChat(chat.id);
    this.loadChats();
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading) {
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
    this.chatService.sendMessage(messageContent).subscribe({
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
