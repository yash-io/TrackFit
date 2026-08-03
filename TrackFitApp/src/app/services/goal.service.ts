import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Goal } from '../interfaces/goal';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  constructor(private http: HttpClient) { }

  getGoalsByUser(userId: number): Observable<Goal[]> {
    return this.http.get<Goal[]>(
      'https://localhost:7263/api/Goal/GetGoalsByUser?userId=' + userId
    );
  }

  addGoal(goal: Goal): Observable<number> {
    return this.http.post<number>(
      'https://localhost:7263/api/Goal/AddGoal', goal
    );
  }

  updateGoal(goal: Goal): Observable<number> {
    return this.http.post<number>(
      'https://localhost:7263/api/Goal/UpdateGoal', goal
    );
  }

  deleteGoal(goalId: number): Observable<number> {
    return this.http.post<number>(
      'https://localhost:7263/api/Goal/DeleteGoal?goalId=' + goalId, {}
    );
  }

  markGoalComplete(goalId: number): Observable<number> {
    return this.http.post<number>(
      'https://localhost:7263/api/Goal/MarkGoalComplete?goalId=' + goalId, {}
    );
  }

}
