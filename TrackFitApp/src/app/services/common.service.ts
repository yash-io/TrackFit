import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,catchError,throwError } from 'rxjs';
import { log } from 'console';
import { Affirmation } from '../interfaces/Affirmation';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  userId: any = localStorage.getItem('userId') || 0;
  constructor(private http: HttpClient) { }

  submitFeedbackData(data: any): Observable<number> {
    return this.http.post<number>("https://localhost:7263/api/UserData/SubmitFeedback", data).pipe(catchError(this.handleError));
  }

  GetHealthDashBoardDetails(): Observable<any> {
    let tempvar = this.http.get<any>("https://localhost:7263/api/Dashboard?UserId=" + this.userId).pipe(catchError(this.handleError));

    return tempvar;
  }

  UpdateFeedbackData(data: any): Observable<number> {
    return this.http.put<number>("https://localhost:7263/api/UserData/UpdateFeedback", data).pipe(catchError(this.handleError));
  }

  GetCompleteHealthDashboard(): Observable<any> {
    let tempvar = this.http.get<any>("https://localhost:7263/completeHealthDashboard?UserId=" + this.userId).pipe(catchError(this.handleError));
    return tempvar;
  }

  GetStreakDetails(): Observable<any> {
    let tempvar = this.http.get<any>("https://localhost:7263/getStreak?userId=" + this.userId).pipe(catchError(this.handleError));
    return tempvar;
  }

  GetTip(): Observable<Affirmation> {
    let quote = this.http.get<Affirmation>("https://localhost:7263/api/UserData/getTip").pipe(catchError(this.handleError));
    return quote;
  }

  TriggerStreak(): Observable<any> {
    let status = this.http.get<any>("https://localhost:7263/api/UserData/triggerStreak?userId=" + this.userId).pipe(catchError(this.handleError));
    return status;
  }

  GetBadges(): Observable<any> {
    let Badges = this.http.get<any>("https://localhost:7263/getAchievements?userId=" + this.userId).pipe(catchError(this.handleError));
    return Badges;
  }

  GetRecords(): Observable<any> {
    let records = this.http.get<any>("https://localhost:7263/getRecords?userId=" + this.userId).pipe(catchError(this.handleError));
    return records;
  }

  AddSleep(userId: number, sleepHours: number, sleepDate: string): Observable<any> {
    return this.http.post<any>(
      `https://localhost:7263/api/Sleep/AddSleep?userId=${userId}&sleepHours=${sleepHours}&sleepDate=${sleepDate}`,
      {}
    ).pipe(catchError(this.handleError));
  }

  GetSleepHistory(userId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `https://localhost:7263/api/Sleep/GetSleepHistory?userId=${userId}`
    ).pipe(catchError(this.handleError));
  }

  GetSleepByWeek(userId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `https://localhost:7263/api/Sleep/GetSleepByWeek?userId=${userId}`
    ).pipe(catchError(this.handleError));
  }

  UpdateSleep(sleepId: number, sleepHours: number): Observable<any> {
    return this.http.post<any>(
      `https://localhost:7263/api/Sleep/UpdateSleep?sleepId=${sleepId}&sleepHours=${sleepHours}`,
      {}
    ).pipe(catchError(this.handleError));
  }

  DeleteSleep(sleepId: number): Observable<any> {
    return this.http.post<any>(
      `https://localhost:7263/api/Sleep/DeleteSleep?sleepId=${sleepId}`,
      {}
    ).pipe(catchError(this.handleError));
  }

  handleError(error: any) {
    console.log("Error occured: ", error);
    return throwError(() => error);
  }
  
}
