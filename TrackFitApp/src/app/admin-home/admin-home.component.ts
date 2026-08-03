import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({

  selector: 'app-admin-home',

  templateUrl: './admin-home.component.html',

  styleUrls: ['./admin-home.component.css']

})

export class AdminHomeComponent {

  constructor(private router: Router) { }

  goToUsers() {
    this.router.navigate(['/admin/users']);
  }

  goToActiveUsers() {
    this.router.navigate(['/admin/active-users']);
  }

  goToFeedback() {
    this.router.navigate(['/admin/feedback']);
  }

  goToActivity() {
    this.router.navigate(['/admin/activity']);
  }

  logout() {

    localStorage.clear();
    this.router.navigate(['/home']);

  }

}



