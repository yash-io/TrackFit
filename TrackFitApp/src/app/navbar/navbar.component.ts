import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuOpen = false;
  latestPhoto = '';
  isLight = false;
  profilePhoto: string = '';
  isAdmin = false;
  ngOnInit() {
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    const latestPhoto = localStorage.getItem('profilePhoto');

    if (latestPhoto && this.profilePhoto !== latestPhoto) {
      this.profilePhoto = latestPhoto;
    }
  }

  @Output() themeToggle = new EventEmitter<void>();
  
  constructor(public auth: AuthService, private router: Router) { }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  onToggleClick() {
    this.themeToggle.emit();
  }

  goToLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }

  logout() {
    this.auth.logout();       
    window.location.href = '/home';
  }
  closeMenu() {
    this.isMenuOpen = false;
  }

  handleLogoClick() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
      this.router.navigate(['/admin']);

    } else {
      this.goToLastPage();

    }

  }



  goToLastPage() {
    const lastRoute = localStorage.getItem('lastRoute');
    if (lastRoute) {
      this.router.navigateByUrl(lastRoute);
    } else {
      this.router.navigate(['/home']); 
    }

  }

  toggleTheme() {
    this.isLight = !this.isLight;

    if (this.isLight) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }
}
