import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Buffer } from 'buffer';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient) {}
  url = 'http://localhost:3000';

  postAvatar(file) { 
    return this.http
    .post(`${this.url}/users/me/avatar`, file, {
      reportProgress: true,
      observe: 'events' })
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