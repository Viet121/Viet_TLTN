import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Code } from 'src/app/models/code';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit{

  codeForm!: FormGroup;
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
    this.codeForm = this.fb.group({
      email: ['',Validators.required],
      code: [''],
    })
  }

  isCodeInputVisible: boolean = false;
  isSend: boolean = false;
  onSignupEmail(){
    if (this.codeForm.valid) {
      this.code.email = this.codeForm.value.email;
      this.loginService.checkEmail(this.codeForm.value.email) .subscribe({
        next: (isCheck) => {
          if(!isCheck){
            this.toast.error({detail:"ERROR", summary:"Email này chưa được dùng để đăng ký", duration: 5000});
          } else{
            this.isSend = true; // Hiển thị thông báo người dùng chờ trong giây lát
            this.codeForm.controls['email'].disable();
            this.loginService.updateCodeEmail(this.code.email).subscribe({
              next: (mes) => {
                this.isSend = false; // Tắt thông báo người dùng chờ trong giây lát
                this.toast.success({detail:"SUCCESS", summary:"Đã gửi mã code qua gmail", duration: 5000});
                this.isCodeInputVisible = true; // Hiển thị input mã code
              },
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
              this.router.navigate(['/change-pass'], { queryParams: { email: email } });
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
