import { Component, Input } from '@angular/core';
import { ChatMessage } from '../../../../services/chat.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { FormatMessageTimePipe } from "../../../../pipes/format-message-time.pipe";

@Component({
  selector: 'app-messages',
  imports: [ProgressSpinner, CommonModule, FormatMessageTimePipe],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
  @Input() messages: ChatMessage[] | null = null;
  @Input() isLoading = false;
}
