
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendarDay } from '../interfaces/calendar';

@Injectable({ providedIn: 'root' })
export class CalendarService {

  constructor(private http: HttpClient) { }

  getCalendarData(
    userId: number,
    month: number,
    year: number
  ): Observable<CalendarDay[]> {
    return this.http.get<CalendarDay[]>(
      'https://localhost:7263/api/Calendar/GetCalendarData'
      + '?userId=' + userId
      + '&month=' + month
      + '&year=' + year
    );
  }
}
