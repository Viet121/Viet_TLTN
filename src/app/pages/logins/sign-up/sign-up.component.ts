import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Code } from 'src/app/models/code';
import { UserForm } from 'src/app/models/userform';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit{
  signupForm!: FormGroup;
  codeForm!: FormGroup;
  user: UserForm = {
    id: 0,
    name: '',
    email: '',
    password: '',
    user_type: 'user',
  }
  code: Code = {
    id: 0,
    email:'', 
    code: '',
  }
  constructor(private fb: FormBuilder, 
    private loginService: SanPhamService, 
    private router: Router,
    private toast: NgToastService, 
  ){}
  ngOnInit(): void {
    /*this.signupForm = this.fb.group({
      name: ['',Validators.required],
      email: ['',Validators.required],
      password: ['',Validators.required],
      password2: ['',Validators.required]
    })*/
    this.codeForm = this.fb.group({
      email: ['',Validators.required],
      code: [''],
    })
  }
  
  EmailExists: boolean = false;
  isCodeInputVisible: boolean = false;
  isSend: boolean = false;
  onSignupEmail(){
    if (this.codeForm.valid) {
      this.code.email = this.codeForm.value.email;
      this.loginService.checkEmail(this.codeForm.value.email) .subscribe({
        next: (isCheck) => {
          if(isCheck){
            this.toast.error({detail:"ERROR", summary:"Email này đã được dùng để đăng ký", duration: 5000});
          } else{
            this.isSend = true; // Hiển thị thông báo người dùng chờ trong giây lát
            this.codeForm.controls['email'].disable();
            
            this.loginService.checkEmailCode(this.code.email).subscribe({
              next: (checkCode) => {
                if(checkCode){
                  //thuc hien sua
                  this.loginService.updateCodeEmail(this.code.email).subscribe({
                    next: (mes) => {
                      this.isSend = false; // Tắt thông báo người dùng chờ trong giây lát
                      this.toast.success({detail:"SUCCESS", summary:"Đã gửi mã code qua gmail", duration: 5000});
                      this.isCodeInputVisible = true; // Hiển thị input mã code
                    },
                  });
                } else{
                  //thuc hien them
                  this.code.code = '0000'
                  this.loginService.addCodeEmail(this.code).subscribe({
                    next: (mes) => {
                      this.isSend = false;
                      this.toast.success({detail:"SUCCESS", summary:"Đã gửi mã code qua gmail !", duration: 5000});
                      this.isCodeInputVisible = true;
                    },
                  });
                }
              }
            });
          }
        }
      });
    } else {
      this.loginService.validateAllFormFileds(this.codeForm);
    }
  }
  onSubmitCode(){
    if (this.codeForm.valid){
      const email = this.code.email;
      const code = this.codeForm.value.code;

      if (code) {
        this.loginService.verifyCode(email,code).subscribe({
          next: (yes) => {
            console.log(yes);
            if(yes){
              this.toast.success({ detail: "SUCCESS", summary: "Xác nhận thành công!", duration: 5000 });
              //chuyển qua trang add-pass với tham số gửi qua trang đó là email 
              this.router.navigate(['/add-pass'], { queryParams: { email: email } });
            }
            else{
              this.toast.error({ detail: "ERROR", summary: "Xác nhận thất bại!", duration: 5000 });
            }
          },
          error: (err) => {
            this.toast.error({ detail: "ERROR", summary: err?.error.message, duration: 5000 });
          }
        });
      }
    }else {
      this.loginService.validateAllFormFileds(this.codeForm);
    }
  }


}
