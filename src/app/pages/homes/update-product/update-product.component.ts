import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { SanPham } from 'src/app/models/sanpham';
import { SanPhamService } from 'src/app/services/sanpham.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { SanPhamSize } from 'src/app/models/sanphamsize';
import { Kho } from 'src/app/models/kho';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit{
  updateProduct: FormGroup ;
  productDetails:SanPhamSize={ 
    maSP: '',
    tenSP: '',
    gioiTinh: '',
    trangThai: '',
    kieuDang: '',
    giaSP: 0,
    chatLieu: '',
    mauSac: '',
    image_URL: '',
    soLuong38: 0,
    soLuong39: 0,
    soLuong40: 0,
    soLuong41: 0,
    soLuong42: 0,
    soLuong43: 0,
  }
  addKhoRequest: Kho = {
    maSP: '',
    maSize: 0,
    soLuong: 0,
  }
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private sanPhamService: SanPhamService, 
    private router: Router,
    private toast: NgToastService, 
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<UpdateProductComponent>

  ){ 
      this.updateProduct = this.fb.group({
        maSP: '',
        tenSP: '',
        gioiTinh: '',
        trangThai: '',
        kieuDang: '',
        giaSP: 0,
        chatLieu: '',
        mauSac: '',
        image_URL: '',
        soLuong38: 0,
        soLuong39: 0,
        soLuong40: 0,
        soLuong41: 0,
        soLuong42: 0,
        soLuong43: 0,
      });
    }
  ngOnInit(): void {
    this.loadSP(this.data.maSP);
  }

  loadSP(maSP: string){
    this.sanPhamService.getProductSize(maSP).subscribe({
      next: (response) => {
        this.productDetails = response;
      }
    });
  }

  updateKho(maSP:string,maSize:number,soLuong:number){
    this.addKhoRequest.maSP = maSP;
    this.addKhoRequest.maSize = maSize;
    this.addKhoRequest.soLuong = soLuong;
    this.sanPhamService.updateKho(this.addKhoRequest).subscribe({
      next: (val: any) => {
        console.log(this.addKhoRequest);
    }
    });
  }


  onFormSubmit(){
    if(this.updateProduct.valid){
      this.updateProduct.value.maSP = this.data.maSP;
      this.updateProduct.value.image_URL = 'https://localhost:7035/Upload/product/' + this.data.maSP + '.jpg';
      console.log(this.updateProduct.value);
      this.sanPhamService.updatepProduct(this.updateProduct.value).subscribe({
        next: (val: any) => {
          this.updateKho(this.data.maSP,38,this.updateProduct.value.soLuong38);
          this.updateKho(this.data.maSP,39,this.updateProduct.value.soLuong39);
          this.updateKho(this.data.maSP,40,this.updateProduct.value.soLuong40);
          this.updateKho(this.data.maSP,41,this.updateProduct.value.soLuong41);
          this.updateKho(this.data.maSP,42,this.updateProduct.value.soLuong42);
          this.updateKho(this.data.maSP,43,this.updateProduct.value.soLuong43);
          this.toast.success({detail:"SUCCESS", summary:"Sửa sản phẩm thành công", duration: 5000});
          this.dialogRef.close(true);
        }    
      });
    }
    else{
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }
  

}
