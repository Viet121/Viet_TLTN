import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { UserForm } from 'src/app/models/userform';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit{
  signupForm!: FormGroup;
  user: UserForm = {
    id: 0,
    name: '',
    email: '',
    password: '',
    user_type: 'admin',
  }
  constructor(private fb: FormBuilder, 
    private loginService: SanPhamService, 
    private router: Router,
    private toast: NgToastService,
    private dialogRef: MatDialogRef<CreateEmployeeComponent> 
  ){}
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['',Validators.required],
      email: ['',Validators.required],
      password: ['',Validators.required],
      password2: ['',Validators.required]
    })
  }
  closeDialog(success: boolean): void {
    this.dialogRef.close(success); // Trả về giá trị true/false
  }
  EmailExists: boolean = false;
  onSignup(){
    if (this.signupForm.valid) {
      this.user.email = this.signupForm.value.email;
      this.user.name = this.signupForm.value.name;
      this.user.password = this.signupForm.value.password;
      if(this.signupForm.value.password != this.signupForm.value.password2){
        this.toast.error({detail:"ERROR", summary:"Mật khẩu xác nhận không khớp", duration: 5000});
      }else{
        this.loginService.signUp(this.user) 
        .subscribe({
          next: (response) => {
            this.closeDialog(true);
            this.toast.success({detail:"SUCCESS", summary:"Đăng ký tài khoản thành công", duration: 5000});
          },
          error: (err) => {
            this.toast.error({detail:"ERROR", summary:err?.error.message, duration: 5000});
            console.log(err?.error.message)
          }
        });
      }
    } else {
      this.loginService.validateAllFormFileds(this.signupForm);
    }
  }

}
