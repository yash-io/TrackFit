import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  showPassword = false;
  showConfirmPassword = false;
  confirmPassword: string = '';
  passwordStrength: string = '';
  strengthColor: string = 'red';
  id: string = "";
  successMsg: string = '';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  checkStrength(password: string) {

    if (!password) {
      this.passwordStrength = '';
      return;
    }

    if (password.length < 8) {
      this.strengthColor = 'red';
    }
    else if (password.length < 10) {
      this.strengthColor = 'orange';
    }
    else {
      this.passwordStrength = '';
      this.strengthColor = 'green';
    }
  }


password: string = '';

rules = {

  length: false,
  upper: false,
  lower: false,
  number: false,
  special: false
};

checkPassword() {
  const val = this.password || '';
  this.rules.length = val.length >= 8;
  this.rules.upper = /[A-Z]/.test(val);
  this.rules.lower = /[a-z]/.test(val);
  this.rules.number = /[0-9]/.test(val);
  this.rules.special = /[!@#$%^&*]/.test(val);
  }



  register(form: any) {
    let user = form.value;
    this.userService.registerUser(user).subscribe(
      (responseData: number) => {
        if (responseData >= 1) {
          console.log(responseData);
          this.id = responseData.toString();
          sessionStorage.setItem('userId', this.id);
          this.successMsg = "Registration Successful";
          alert('Registration Successful');
          form.reset();
          this.router.navigate(['/profile']);
        }
        else {
          this.successMsg = "Registration Failed";
          alert('Registration Failed');
        }

      },
      (error: any) => {
        console.log(error);
      },
      () => console.log("Register method executed")
    );
  }

}
