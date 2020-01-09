import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authSevice: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authSevice.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReqeq = req.clone({
          setHeaders: {
            'Authorization': `Bearer ${user.token}`,
          }
        });
    
        return next.handle(modifiedReqeq);
      })
      )
  }
}