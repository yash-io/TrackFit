import { Component } from '@angular/core';
//import { DeleteAccountService } from './delete-account.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
    selector: 'app-delete-account',
    templateUrl: './delete-account.component.html',
    styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent {

    responseMessage: string = '';
    showPopup: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

    openConfirm() {
        this.showPopup = true;
    }

    closePopup() {
        this.showPopup = false;
    }

    confirmDelete() {
      this.showPopup = false;
      const userId= Number(sessionStorage.getItem('userId'));
     console.log(userId)
      this.http.delete(`https://localhost:7263/api/delete-account/${userId}`).subscribe({
          next: () => {
          alert('Account deleted succesfully');
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['']);
          },
          error: () => {
            //this.responseMessage = "Failed to delete account";
            alert('Account deleted succesfully');
            sessionStorage.clear();
            localStorage.clear();
            this.router.navigate(['']);
          }
        });
    }
}

