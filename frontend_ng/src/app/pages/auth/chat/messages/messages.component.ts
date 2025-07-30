import { Component, Input } from '@angular/core';
import { ChatMessage } from '../../../../services/chat.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  imports: [ProgressSpinner, CommonModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
  @Input() messages: ChatMessage[] | null = null;
  @Input() isLoading = false;
  formatMessageTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  }
}
