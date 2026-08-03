import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workout, WorkoutPlanDay } from '../interfaces/workout';



@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  constructor(private http: HttpClient) { }

  getWorkoutsByGoalType(userId: number, goalType: string): Observable<Workout[]> {
    return this.http.get<Workout[]>(
      'https://localhost:7263/api/Workout/GetWorkoutsByGoalType?userId='
      + userId + '&goalType=' + goalType
    );
  }

  addWorkout(workout: Workout): Observable<number> {
    return this.http.post<number>(
      'https://localhost:7263/api/Workout/AddWorkout', workout
    );
  }

  updateWorkout(workout: Workout): Observable<number> {
    return this.http.post<number>(
      'https://localhost:7263/api/Workout/UpdateWorkout', workout
    );
  }

  deleteWorkout(workoutId: number): Observable<number> {
    return this.http.post<number>(
      'https://localhost:7263/api/Workout/DeleteWorkout?workoutId=' + workoutId, {}
    );
  }

  generatePlan(goalType: string): Observable<WorkoutPlanDay[]> {
    return this.http.get<WorkoutPlanDay[]>(
      'https://localhost:7263/api/Workout/GenerateWorkoutPlan?goalType=' + goalType
    );
  }

}
