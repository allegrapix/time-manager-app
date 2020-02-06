import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from '../profile/user.model';
import { Router } from '@angular/router';

interface AuthResponseData {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    preferredWorkingHours: number;
    createdAt: Date;
    updatedAt: Date;
    expiresIn: string;
    __v: number
  };
  token: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  url = 'http://localhost:3000';
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  pageNotAllowed =  new EventEmitter<void>();

  constructor(
    private http: HttpClient,
    private router: Router
    ) {}

  register(name: string, email: string, role: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `${this.url}/users/singup`,
        {
          name,
          email,
          role,
          password
        }
      ).pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.user._id,
            resData.user.name,
            resData.user.email,
            resData.user.role,
            resData.user.createdAt,
            resData.user.updatedAt,
            resData.user.preferredWorkingHours,
            +resData.user.expiresIn,
            resData.token
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
    .post<AuthResponseData>(
      `${this.url}/users/login`,
      {
        email,
        password
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(
          resData.user._id,
          resData.user.name,
          resData.user.email,
          resData.user.role,
          resData.user.createdAt,
          resData.user.updatedAt,
          resData.user.preferredWorkingHours,
          +resData.user.expiresIn,
          resData.token
        );
      })
    );
  }

  autoLogin() {
    const userData: {
      _id: string,
      name: string,
      email: string,
      role: string,
      createdAt: Date,
      updatedAt: Date,
      preferredWorkingHours: number,
      _tokenExpirationDate: string,
      _token: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData._id,
      userData.name,
      userData.email,
      userData.role,
      userData.createdAt,
      userData.updatedAt,
      userData.preferredWorkingHours,
      new Date(userData._tokenExpirationDate),
      userData._token
      );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMsg = 'An error ocurred';
    if (!errorRes.error) {
      return throwError(errorMsg);
    }
    if (errorRes.error.code) {
      errorMsg = errorRes.error.code === 11000 ? 'The email already exists in the database' : 'An error ocurred';
    }
    return throwError(errorMsg);
  }

  private handleAuthentication(
    _id: string,
    name: string,
    email: string,
    role: string,
    createdAt: Date,
    updatedAt: Date,
    preferredWorkingHours: number,
    expiresIn: number,
    token: string
    ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User( _id, name, email, role,  createdAt, updatedAt, preferredWorkingHours, expirationDate, token);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
