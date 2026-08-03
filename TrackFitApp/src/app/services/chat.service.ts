import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseApi = 'https://localhost:7263/api';

  constructor(private http: HttpClient) {}

  send(message: string, history: ChatTurn[]): Observable<{ success: boolean; response: string }> {
    return this.http.post<{ success: boolean; response: string }>(
      `${this.baseApi}/Chatbot/Send`,
      { message, history }
    );
  }
}
