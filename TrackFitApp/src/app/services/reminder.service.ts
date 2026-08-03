import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reminder } from '../interfaces/reminder';

@Injectable({ providedIn: 'root' })
export class ReminderService {

  constructor(private http: HttpClient) { }

  getRemindersByUser(userId: number): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(
      'https://localhost:7263/api/Reminder/GetRemindersByUser?userId=' + userId
    );
  }

  addReminder(reminder: Reminder): Observable<number> {
    return this.http.post<number>(
      'https://localhost:7263/api/Reminder/AddReminder', reminder
    );
  }

  updateReminder(reminder: Reminder): Observable<number> {
    return this.http.post<number>(
      'https://localhost:7263/api/Reminder/UpdateReminder', reminder
    );
  }

  deleteReminder(reminderId: number): Observable<number> {
    return this.http.post<number>(
      'https://localhost:7263/api/Reminder/DeleteReminder?reminderId='
      + reminderId, {}
    );
  }

  markComplete(reminderId: number): Observable<number> {
    return this.http.post<number>(
      'https://localhost:7263/api/Reminder/MarkReminderComplete?reminderId='
      + reminderId, {}
    );
  }
}
