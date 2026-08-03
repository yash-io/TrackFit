import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { UserService } from '../services/user.service';

@Component({

  selector: 'app-change-password',

  templateUrl: './change-password.component.html',

  styleUrls: ['./change-password.component.css']

})

export class ChangePasswordComponent {

  currentPassword: string = '';

  newPassword: string = '';

  confirmPassword: string = '';

  showCurrent: boolean = false;

  showNew: boolean = false;

  showConfirm: boolean = false;

  userId: any;

  constructor(

    private userService: UserService,

    private router: Router

  ) { }

  // Password validation rules

  rules = {

    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  };

  ngOnInit() {

    this.userId = localStorage.getItem('userId');

  }

  checkPassword() {

    const val = this.newPassword || '';
    this.rules.length = val.length >= 8;
    this.rules.upper = /[A-Z]/.test(val);
    this.rules.lower = /[a-z]/.test(val);
    this.rules.number = /[0-9]/.test(val);
    this.rules.special = /[!@#$%^&*]/.test(val);
      }

  changePassword(form: any) {

    if (form.invalid) {

      alert("Please fill all fields");

      return;

    }

    if (this.newPassword !== this.confirmPassword) {

      alert("New password and confirm password do not match");

      return;

    }

    if (
      !this.rules.length ||
      !this.rules.upper ||
      !this.rules.lower ||
      !this.rules.number ||
      !this.rules.special
    ) {

      alert("Password does not meet required rules");

      return;

    }

    let obj = {
      userId: this.userId,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    this.userService.changePassword(obj).subscribe(

      (res: any) => {

        if (res == 1) {
          alert("Password changed successfully. Please login again.");
          localStorage.clear();
          this.router.navigate(['/login']);

        }

        else if (res == -1) {
          alert("Current password is incorrect");

        }

        else if (res == -2) {
          alert("User not found");

        }

        else if (res == -3) {

          alert("Current password cannot be empty");

        }

        else if (res == -4) {

          alert("New password cannot be empty");

        }

        else if (res == -5) {
          alert("Current and new password cannot be same");

        }

        else {
          alert("Something went wrong");

        }
      },

      error => {

        console.log(error);

        alert("API Error");

      }

    );

  }

  goBackToProfile() {

    this.router.navigate(['/view-profile']);

  }

}

