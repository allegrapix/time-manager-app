import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../profile/user.model';

interface UserObj {
  count: number;
  noOfPages: number;
  users: User[];
}

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient) {}
  url = 'http://localhost:3000';
  @Output() userToBeEdited = new EventEmitter<User>();
  @Output() avatarChanged = new EventEmitter<User>();
  @Output() userDeleted = new EventEmitter<string>();
  @Output() searchUser = new EventEmitter<string>();

  searchUserByAdmin(search, limit, skip) {
    let params = new HttpParams();
    if (limit !== undefined) {
      params = params.append('limit', limit.toString());
    }
    if (skip !== undefined) {
      params = params.append('skip', skip.toString());
    }
    if (search !== undefined) {
      params = params.append('search', search.toString());
    }
    return this.http
    .get<UserObj>(`${this.url}/users/search`, {params})
    .pipe(
      catchError(this.handleError)
    );
  }

  getUsers(limit, skip) {
    let params = new HttpParams();
    if (limit !== undefined) {
      params = params.append('limit', limit.toString());
    }
    if (skip !== undefined) {
      params = params.append('skip', skip.toString());
    }
    return this.http
    .get<UserObj>(`${this.url}/users`, {params})
    .pipe(
      catchError(this.handleError)
    );
  }

  getUser() {
    return this.http
    .get<User>(`${this.url}/users/me`)
    .pipe(
      catchError(this.handleError)
    );
  }

  getUserByAdmin(id) {
    return this.http
    .get<User>(`${this.url}/users/${id}`)
    .pipe(
      catchError(this.handleError)
    );
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
    .post(`${this.url}/users/${id}/avatar`, file)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteUser() {
    return this.http
    .delete<User>(`${this.url}/users/me`)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteUserByAdmin(id) {
    return this.http
    .delete<User>(`${this.url}/users/${id}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(errorRes: HttpErrorResponse) {
    const errorMsg = 'An error ocurred';
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
    );
  }

  editUserByAdmin(id, payload) {
    return this.http
    .patch(`${this.url}/users/${id}`, payload)
    .pipe(
      catchError(this.handleError)
    );
  }
}
