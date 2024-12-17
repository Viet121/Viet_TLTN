import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { InforService } from 'src/app/services/infor.service';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  userEmail: string = '';
  
  
  constructor(
    private fb: FormBuilder, 
    private loginService: SanPhamService, 
    private router: Router,
    private toast: NgToastService, 
    private infor: InforService,
  ){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',Validators.required]
    })
  }

  EmailOrPassExists: boolean = false;
  onLogin(){
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value) 
        .subscribe({
          next: (response) => { 
            this.loginService.setLoggedInEmail(response.mail);
            this.loginForm.reset();

            this.loginService.storeToken(response.token);
            const tokenPayload = this.loginService.decodedToken();
            this.infor.setName(tokenPayload.name);
            this.infor.setRole(tokenPayload.role);
            this.infor.setEmail(tokenPayload.email);

            this.userEmail = this.loginService.userEmailLoggedIn;
            console.log("role_check: " + tokenPayload.role);
            console.log("email_check: " +tokenPayload.email);
            if (response.role === 'admin') {
              this.router.navigate(['/product']).then(() => {
                window.location.reload();
              });
            } else {
              this.router.navigate(['/product']).then(() => {
                window.location.reload();
              });
            }
          },
          error: (err) => {
            this.toast.error({detail:"ERROR", summary:err?.error.message, duration: 5000});
            console.log(err?.error.message)
          }
        });
    } else {
      this.loginService.validateAllFormFileds(this.loginForm);
    }
  }


}
