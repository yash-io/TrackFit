
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errMsg: string = "";
  emailId: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() { }

  login(form: any) {

    if (form.invalid) return;

    this.emailId = form.value.email;
    this.password = form.value.password;

    this.userService.loginUser(this.emailId, this.password).subscribe({
      next: (res: any) => {
        if (res.status !== 1) {
          this.errorMessage = res.message;
          return;
        }
        console.log(res);
        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", res.userId);
        localStorage.setItem("isAdmin", res.isAdmin);
        localStorage.setItem("loginTime", new Date().getTime().toString());
        this.authService.startSessionTimer();
        const loginTime = localStorage.getItem("loginTime");
        const readable = new Date(Number(loginTime));
        console.log(readable);
        this.successMessage = res.message;
        alert('Login Successful');
        form.reset();
        if (res.isAdmin) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        this.errorMessage = "Server error";
      }
    });

  }
}
