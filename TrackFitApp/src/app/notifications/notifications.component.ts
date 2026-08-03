import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  userId: number = 0;
  notifications: any[] = [];
  responseMessage: string = '';

  constructor(private notificationService: NotificationsService) { }

  ngOnInit() {
    // ✅ Get userId automatically (no input field)
    const storedId = localStorage.getItem('userId');

    if (storedId) {
      this.userId = Number(storedId);
      this.fetchNotifications(); // auto load
    } else {
      this.responseMessage = 'User not logged in';
    }
  }

  fetchNotifications() {
    this.notificationService.getNotifications(this.userId).subscribe({
      next: (data: any[]) => {
        this.notifications = data || [];   //handles null/undefined
        this.responseMessage = '';
      },
      error: () => {
        this.responseMessage = 'Failed to load notifications';
        this.notifications = [];
      }
    });
  }
}
