import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'TrackFitApp';
  isLightTheme = false;
    currentUrl: any;
  previousUrl: any;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.startSessionTimer();


    this.router.events

      .pipe(filter(event => event instanceof NavigationEnd))

      .subscribe((event: any) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.urlAfterRedirects;
        if (this.previousUrl && this.previousUrl !== '/login') {
          localStorage.setItem('lastRoute', this.previousUrl);
        }
        console.log("Previous:", this.previousUrl);
        console.log("Current:", this.currentUrl);
      });

  }

  toggleTheme() {
    this.isLightTheme = !this.isLightTheme;
  }

}
