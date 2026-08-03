import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  private baseUrl = 'https://localhost:7263/api/Admin';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetUsers`).pipe(catchError(this.errorHandler));
  }

  getActiveUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetActiveUsers`).pipe(catchError(this.errorHandler));
  }

  getAllFeedbacks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetAllFeedbacks`).pipe(catchError(this.errorHandler));
  }

  getWeeklyActivity(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetWeeklyActivity`).pipe(catchError(this.errorHandler));
  }

  getCompleteHealthDashboard(userId: number) {
    return this.http.get<any>(`https://localhost:7263/completeHealthDashboard?UserId=${userId}`).pipe(catchError(this.errorHandler));

  }

  errorHandler(error: HttpErrorResponse) {
    console.error(error)
    return throwError(error.message || 'ERROR')
  }
}
