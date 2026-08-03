import { Component } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-feedback',
  templateUrl: './admin-feedback.component.html',
  styleUrls: ['./admin-feedback.component.css']
})
export class AdminFeedbackComponent {
  feedbacks: any[] = [];

  totalFeedbacks = 0;

  ngOnInit() {

    this.getFeedbacks();

  }
  constructor(private adminService: AdminService) { }

  getFeedbacks() {

    this.adminService.getAllFeedbacks().subscribe({

      next: (res: any) => {

        console.log("Feedbacks:", res);

        this.feedbacks = res.data;

        this.totalFeedbacks = res.count;

      },

      error: (err) => {

        console.error("Error fetching feedbacks", err);

      }

    });

  }


}
