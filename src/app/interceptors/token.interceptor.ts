import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { SanPhamService } from '../services/sanpham.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: SanPhamService, private toast: NgToastService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.auth.getToken();
    if(myToken){
      request = request.clone({
        setHeaders: {Authorization:`Bearer ${myToken}` }
      })
    }
    return next.handle(request).pipe(
      catchError((err:any)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            this.toast.warning({detail:"Warning", summary:"Phiên làm việc đã hểt hạn, vui lòng đăng nhập lại"});
            this.router.navigate(['login'])
          }
        }
        return throwError(()=> err)
      })
    );
  }
}
