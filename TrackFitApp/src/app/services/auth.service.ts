import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private warningTimer: any;
  private sessionTimer: any;
 
  startSessionTimer() {
    this.clearTimers();

    const loginTime = Number(localStorage.getItem("loginTime"));

    if (!loginTime) return;

    const now = new Date().getTime();
    const sessionDuration = 60 * 60 * 1000; 
    const warningTime = 58 * 60 * 1000; 

    const timePassed = now - loginTime;

    const remainingTime = sessionDuration - timePassed;
    const warningRemaining = warningTime - timePassed;
    if (warningRemaining > 0) {
      this.warningTimer = setTimeout(() => {
        alert("⚠️ Your session will expire in 2 minutes!");
      }, warningRemaining);
    }

    if (remainingTime > 0) {
      this.sessionTimer = setTimeout(() => {
        alert("⏳ Session expired. Logging out...");
        this.logout();
      }, remainingTime);
    } else {
      // already expired
      this.logout();
    }
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  clearTimers() {
    clearTimeout(this.sessionTimer);
    clearTimeout(this.warningTimer);
  }


  logout() {
    this.clearTimers();
    localStorage.clear();
  }
  constructor(private router: Router) { }
}
