import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WaterIntake } from '../interfaces/water';


@Injectable({
  providedIn: 'root'
})
export class WaterService {
  constructor(private http: HttpClient) { }

  getWaterByUser(userId: number): Observable<WaterIntake[]> {
    return this.http.get<WaterIntake[]>(
      'https://localhost:7263/api/Water/GetWaterByUser?userId=' + userId
    );
  }

  getTodayWater(userId: number): Observable<WaterIntake[]> {
    return this.http.get<WaterIntake[]>(
      'https://localhost:7263/api/Water/GetTodayWater?userId=' + userId
    );
  }

  getRecommendedIntake(userId: number): Observable<{ recommended: number }> {
    return this.http.get<{ recommended: number }>(
      'https://localhost:7263/api/Water/GetRecommendedIntake?userId=' + userId
    );
  }

  addWater(water: WaterIntake): Observable<number> {
    return this.http.post<number>(
      'https://localhost:7263/api/Water/AddWater', water
    );
  }

  updateWater(water: WaterIntake): Observable<number> {
    return this.http.post<number>(
      'https://localhost:7263/api/Water/UpdateWater', water
    );
  }

  deleteWater(waterId: number): Observable<number> {
    return this.http.post<number>(
      'https://localhost:7263/api/Water/DeleteWater?waterId=' + waterId, {}
    );
  }

}
