import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService, ChatTurn, ChatMessage } from '../services/chat.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('msgBox') msgBox!: ElementRef;

  isOpen = false;
  isLoading = false;
  userInput = '';
  messages: ChatMessage[] = [];
  history: ChatTurn[] = [];

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.messages.push({
      sender: 'bot',
      text: '👋 Hi! I am your TrackFit Assistant. Ask me anything about workouts, nutrition, hydration, or your fitness goals!'
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text || this.isLoading) return;

    this.messages.push({ sender: 'user', text });
    this.userInput = '';
    this.isLoading = true;
    this.messages.push({ sender: 'bot', text: '...' });

    this.chatService.send(text, this.history).subscribe({
      next: (res) => {
        this.messages.pop();
        this.messages.push({ sender: 'bot', text: res.response });

        this.history.push({ role: 'user', content: text });
        this.history.push({ role: 'assistant', content: res.response });

        if (this.history.length > 10)
          this.history = this.history.slice(this.history.length - 10);

        this.isLoading = false;
      },
      error: () => {
        this.messages.pop();
        this.messages.push({ sender: 'bot', text: '⚠️ Something went wrong. Please try again.' });
        this.isLoading = false;
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  scrollToBottom(): void {
    try {
      this.msgBox.nativeElement.scrollTop = this.msgBox.nativeElement.scrollHeight;
    } catch (e) { }
  }
}
