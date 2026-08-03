import { Component } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-admin-activeusers',
  templateUrl: './admin-activeusers.component.html',
  styleUrls: ['./admin-activeusers.component.css']
})
export class AdminActiveusersComponent {

  todayUsers: any[] = [];

  todayCount = 0;
  goalCalories = 500;
  constructor(private adminService: AdminService, private commonService: CommonService) { }


  ngOnInit() {

    this.getTodayActiveUsers();

  }

  getTodayActiveUsers() {
    this.adminService.getActiveUsers().subscribe({
      next: (res: any) => {
        const users = res.users;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        this.todayUsers = [];
        users.forEach((user: any) => {
          if (!user.lastActiveDate) return;
          const lastDate = new Date(user.lastActiveDate);
          lastDate.setHours(0, 0, 0, 0);
          const diffDays =
            (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

          if (diffDays <= 1) {
            this.adminService.getCompleteHealthDashboard(user.userId).subscribe({
                next: (health: any) => {
                  const calories = health?.avgCaloriesPerWorkout || 0;
                  const progress = Math.min((calories / 300) * 100, 100);

                  this.todayUsers.push({
                    ...user,
                    calories,
                    progress
                  });
                  this.todayCount = this.todayUsers.length;

                },

                error: () => {
                  this.todayUsers.push({
                    ...user,
                    calories: 0,
                    progress: 0
                  });

                  this.todayCount = this.todayUsers.length;
                }              });          }
        });
      },

      error: (err) => {
        console.error("Error fetching users", err);
      }
    });

  }


    }
