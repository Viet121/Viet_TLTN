import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { SanPhamService } from 'src/app/services/sanpham.service';
import { CreateVoucherComponent } from '../create-voucher/create-voucher.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Voucher } from 'src/app/models/voucher';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-voucher',
  templateUrl: './update-voucher.component.html',
  styleUrls: ['./update-voucher.component.css']
})
export class UpdateVoucherComponent implements OnInit{

  addProduct: FormGroup;
  voucherDetail: Voucher = {
    code: '',
    soLuong: 0,
    daDung: 0,
    phanTram: 0
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
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
    this.loadVoucher(this.data.code)
  }

  loadVoucher(code: string){
    this.voucherService.getVoucher(code).subscribe({
      next: (response) => {
        this.voucherDetail = response;
      }
    });
  }

  onFormSubmit(){
    if(this.addProduct.valid){
      this.voucherService.updateVoucher(this.addProduct.value).subscribe({
        next: (val: any) => {
          this.toast.success({detail:"SUCCESS", summary:"Update voucher thành công", duration: 5000});
          this.dialogRef.close(true);
        }    
      });
    }
    else{
      alert('Vui lòng điền đầy đủ thông tin');
    }
  }

}
