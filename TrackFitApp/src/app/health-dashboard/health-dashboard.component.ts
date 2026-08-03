

import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-health-dashboard',
  templateUrl: './health-dashboard.component.html',
  styleUrls: ['./health-dashboard.component.css']
})
export class HealthDashboardComponent implements OnInit {
  errMsg: any;
  DashBoardDetails: any;
  CompleteDetails: any;
  selectedMetric: string = "calories";
  selectedCard: string = "";
  currentVal: number = 0;
  currentLeadVal: number = 0;
  healthGoals = {
    water: 2000
  };
  leaderBoardStats: any = {
    waterPerDrink: 5000,
    caloriesBurned: 1200,
    bmi: 50
  }

  getMetricChange() {

    switch (this.selectedMetric) {
      case "caloriesBurned":
        this.currentLeadVal = this.leaderBoardStats.leaderboardCaloriesBurned;
        this.currentVal = Math.round(this.CompleteDetails.avgCaloriesPerWorkout);
        break;
      case "waterIntake(in Ml)":
        this.currentLeadVal = this.leaderBoardStats.leaderboardWaterIntake;
        this.currentVal = Math.round(this.CompleteDetails.avgWaterPerDrink);
        break;
      case "bmi":
        this.currentLeadVal = this.leaderBoardStats.leaderboardBMI;
        this.currentVal = Math.round(this.CompleteDetails.latestBMI);
        break;

    }

  }
  constructor(private _commonService: CommonService) { }

  ngOnInit() {
    this.getHealthDashboard();
  }

  getHealthDashboard() {
    this._commonService.GetHealthDashBoardDetails().subscribe(
      response => {
        this.DashBoardDetails = response.user;
        this.leaderBoardStats = response.leaderboard;
        //console.log(response);
        this.getCompleteHealthDashboard();
      },
      error => {
        this.errMsg = error
      }
    );
  }

  openCard(card: string) {
    this.selectedCard = card;
  }

  closeCard() {
    this.selectedCard = "";
  }


  getProgressOffset(value: number, goal: number): number {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    const percent = Math.min((value || 0) / goal, 1);
    return circumference * (1 - percent);
  }


  getCompleteHealthDashboard() {
    this._commonService.GetCompleteHealthDashboard().subscribe(
      response => {
        this.CompleteDetails = response;
        this.currentVal = this.CompleteDetails.avgCaloriesPerWorkout;
        this.currentLeadVal = this.leaderBoardStats.caloriesBurned;
      },
      error => {
        this.errMsg = error
      }
    );


  }


  getTitle(): string {
    switch (this.selectedCard) {
      case 'steps': return 'Steps Today';
      case 'calories': return 'Calories Burned';
      case 'water': return 'Water Intake';
      case 'sleep': return 'Sleep Hours';
      case 'bmi': return 'BMI';
      case 'streak': return 'Current Streak';
      default: return '';
    }
  }
}
