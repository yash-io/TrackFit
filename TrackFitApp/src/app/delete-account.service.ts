import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteAccountService {

  private apiUrl = 'https://localhost:7263/api/DeleteAccount/delete';

  constructor(private http: HttpClient) { }

  deleteUser(): Observable<any> {
    return this.http.delete('https://localhost:7263/api/DeleteAccount/DeleteAccount/delete/${userId}');
  }
}
