import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../profile/user.model';

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient) {}
  url = 'http://localhost:3000';
  userToBeEdited = new EventEmitter<User>();

  getUsers() {
    return this.http
    .get<User[]>(`${this.url}/users`)
    .pipe(
      catchError(this.handleError)
    );
  }

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

  postAvatarByAdmin(file, id) {
    return this.http
    .post(`${this.url}/users/${id}/avatar`, file, {
      reportProgress: true,
      observe: 'events'
    })
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

  editUser(payload) {
    return this.http
    .patch(`${this.url}/users/me`, payload)
    .pipe(
      catchError(this.handleError)
    )
  }

  editUserByAdmin(id, payload) {
    return this.http
    .patch(`${this.url}/users/${id}`, payload)
    .pipe(
      catchError(this.handleError)
    );
  }
}