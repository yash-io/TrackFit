import { Component, OnInit } from '@angular/core';

import { AdminService } from '../services/admin.service';

@Component({

  selector: 'app-admin-users',

  templateUrl: './admin-users.component.html',

  styleUrls: ['./admin-users.component.css']

})

export class AdminUsersComponent implements OnInit {

  users: any[] = [];
  totalUsers: number = 0;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {

    this.getUsers();

  }

  // 🔹 Fetch users from backend

  getUsers() {
    this.adminService.getAllUsers().subscribe({

      next: (res) => {

        console.log("Users:", res);

        this.users = res.users;
        this.totalUsers = res.totalUsers;
        this.users = this.users.map(user => {

          const lastDate = new Date(user.lastActiveDate);
          const now = new Date();
          const diffDays =
            (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
          return {
            ...user,
            status: diffDays > 30 ? 'Inactive' : 'Active'
          };
        });
      },
      error: (err) => {
        console.error("Error fetching users:", err);
      }

    });

  }

}
