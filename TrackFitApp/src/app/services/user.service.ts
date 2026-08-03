import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { IUser } from '../interfaces/user';
import { IUserProfile } from '../interfaces/userProfile';
import { ILeaderboard } from '../interfaces/leaderBoard';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private base = 'https://localhost:7263/api';
  constructor(private http: HttpClient) { }

  registerUser(user: IUser): Observable<number> {
    console.log(user);
    let temp = this.http.post<number>("https://localhost:7263/api/User/RegisterUserDetails", user).pipe(catchError(this.errorHandler))
    return temp;
  }

  createProfile(profile: IUserProfile): Observable<any> {
    let temp = this.http.post<any>("https://localhost:7263/api/User/AddProfileDetails", profile).pipe(catchError(this.errorHandler));
    return temp;
  }

  loginUser(emailId: string, password: string): Observable<any> {
    let temp = this.http.post<any>(`https://localhost:7263/api/User/LoginUserDetails?emailId=${emailId}&password=${password}`, {}).pipe(catchError(this.errorHandler));
    return temp;
  }

  calculateFoodCalories(items: string): Observable<any> {
    let body = {
      items: items
    }
    let temp = this.http.post<any>('https://localhost:7263/api/Food/calculate', body, {
      headers: {
      'Content-Type':'application/json'
    } }).pipe(catchError(this.errorHandler));
    return temp;
  }

  getUserProfile(userId: any): Observable<any> {
    let temp = this.http.get<any>
      (`https://localhost:7263/api/User/GetUserProfile?userId=${userId}`, {})
      .pipe(catchError(this.errorHandler));
    return temp;
  }

  updateUserName(userId: any, userName: any) {
    return this.http.put(
      `https://localhost:7263/api/User/UpdateUserName?userId=${userId}&userName=${userName}`,
      {}).pipe(catchError(this.errorHandler));
  }

  changePassword(data: any): Observable<any> {
    return this.http.put<any>('https://localhost:7263/api/User/ChangePassword', data).pipe(catchError(this.errorHandler));
  }

  getFoodCalories(food: string) {
    return this.http.get(`https://localhost:7263/api/Food/Calculate?items= ${food}`);
  }

  getLeaderboard(): Observable<any>{
    return this.http.get<any>("https://localhost:7263/api/User/GetLeaderboard");
  }
  getMeals(userId: number) {
    return this.http.get(`${this.base}/Meal/GetMeals/${userId}`);
  }
  updateMeal(data: any) {
    return this.http.put(`${this.base}/Meal/UpdateMeal`, data);
  }
  addMeal(data: any) {
    return this.http.post(`${this.base}/Meal/AddMeal`, data);
  }
  deleteMeal(mealId: number) {
    return this.http.delete(`${this.base}/Meal/DeleteMeal/${mealId}`);
  }

  //ErrorHandler
  errorHandler(error: HttpErrorResponse) {
    console.error(error)
    return throwError(error.message || 'ERROR')
  }
}
