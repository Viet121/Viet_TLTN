import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { UserForm } from 'src/app/models/userform';
import { SanPhamService } from 'src/app/services/sanpham.service';
import { BackLoginComponent } from '../back-login/back-login.component';

@Component({
  selector: 'app-add-pass',
  templateUrl: './add-pass.component.html',
  styleUrls: ['./add-pass.component.css']
})
export class AddPassComponent implements OnInit{
  
  emailSignUp!: string;
  signupForm!: FormGroup;
  user: UserForm = {
    id: 0,
    name: '',
    email: '',
    password: '',
    user_type: 'user',
  }

  constructor(private fb: FormBuilder, 
    private loginService: SanPhamService, 
    private router: Router,
    private toast: NgToastService, 
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ){}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.emailSignUp = params['email']; // 'email' phải khớp với key trong queryParams
    });
    this.signupForm = this.fb.group({
      name: ['',Validators.required],
      email: [this.emailSignUp],
      password: ['',Validators.required],
      password2: ['',Validators.required]
    });
  }
  isAccount: boolean = false;
  onSignup(){
    if (this.signupForm.valid) {

      this.user.email = this.signupForm.value.email; // can kiem tra lai tai vi email o form bi null
      this.user.name = this.signupForm.value.name;
      this.user.password = this.signupForm.value.password;
      if(this.signupForm.value.password != this.signupForm.value.password2){
        this.toast.error({detail:"ERROR", summary:"Mật khẩu xác nhận không khớp", duration: 5000});
      }else{
        this.loginService.signUp(this.user) 
        .subscribe({
          next: (response) => {
            this.toast.success({detail:"SUCCESS", summary:"Đăng ký tài khoản thành công", duration: 5000});
            this.isAccount = true;
            this.backLogin(); 
          },
          error: (err) => {
            this.toast.error({detail:"ERROR", summary:err?.error.message, duration: 5000});
            this.isAccount = true;
            console.log(err?.error.message);
            console.log(this.user);
          }
        });
      }
    } else {
      this.loginService.validateAllFormFileds(this.signupForm);
    }
    
  }

  backLogin() {
    const dialogRef = this.dialog.open(BackLoginComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Nếu người dùng xác nhận thì quay lại trang đăng nhập
        this.router.navigate(['/login']);
      }
    });
  }

}
