import { Component } from '@angular/core';
//import { DeleteAccountService } from './delete-account.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent {

  responseMessage: string = '';
  showPopup: boolean = false;

  constructor(private http: HttpClient) { }

  openConfirm() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  confirmDelete() {
    this.showPopup = false;
    const userId = sessionStorage.getItem('userId');
    console.log(userId)
    this.http.delete(`https://localhost:7263/api/DeleteAccount/DeleteAccount/delete?userId=${userId}`).subscribe({
      next: () => {
        this.responseMessage = "Account deleted successfully";
      },
      error: () => {
        this.responseMessage = "Failed to delete account";
      }
    });
  }
}

