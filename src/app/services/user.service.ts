import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../profile/user.model';

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient) {}
  url = 'http://localhost:3000';

  getUser() {
    return this.http
    .get<User>(`${this.url}/users/me`)
    .pipe(
      catchError(this.handleError)
    )
  }

  postAvatar(file) { 
    return this.http
    .post(`${this.url}/users/me/avatar`, file, {
      reportProgress: true,
      observe: 'events' })
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteUser() {
    return this.http
    .delete(`${this.url}/users/me`)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMsg = 'An error ocurred';
    if (!errorRes.error) {
      return throwError(errorMsg);
    }    
    return throwError(errorRes.error);
  }
}