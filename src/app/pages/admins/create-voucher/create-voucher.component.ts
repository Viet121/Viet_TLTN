import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-create-voucher',
  templateUrl: './create-voucher.component.html',
  styleUrls: ['./create-voucher.component.css']
})
export class CreateVoucherComponent implements OnInit{

  addProduct: FormGroup;

  constructor(
      private voucherService: SanPhamService, 
      private router: Router,
      private toast: NgToastService, 
      private fb: FormBuilder, 
      private dialogRef: MatDialogRef<CreateVoucherComponent>
    ){  
        this.addProduct = this.fb.group({
          code: '',
          soLuong: 0,
          daDung: 0,
          phanTram: 0,
        });
      }
  ngOnInit(): void {
    this.addProduct = this.fb.group({
      code: ['', Validators.required], 
      soLuong: ['', Validators.min(1)],
      daDung: 0, 
      phanTram: ['', Validators.min(1)],
    });
  }

  onFormSubmit(){
    if(this.addProduct.valid){
      this.voucherService.addVoucher(this.addProduct.value).subscribe({
        next: (val: any) => {
          this.toast.success({detail:"SUCCESS", summary:"Thêm voucher thành công", duration: 5000});
          this.dialogRef.close(true);
        }    
      });
    }
    else{
      alert('Vui lòng điền đầy đủ thông tin');
    }
  }


}
