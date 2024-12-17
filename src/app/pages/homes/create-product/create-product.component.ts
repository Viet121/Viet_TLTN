import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SanPham } from 'src/app/models/sanpham';
import { SanPhamService } from 'src/app/services/sanpham.service';
import { NgToastService } from 'ng-angular-popup';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Kho } from 'src/app/models/kho';


@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit{
   
  addProduct: FormGroup;
  selectedImage!: File;
  duongDanAnh: any;
  anhSanPham: any;
  addSanPhamRequest: SanPham = {
    maSP: '',
    tenSP: '',
    gioiTinh: '',
    trangThai: '',
    kieuDang: '',
    giaSP: 0,
    chatLieu: '',
    mauSac: '',
    image_URL: '',
  }
  newMaSP!: string;
  addKhoRequest: Kho = {
    maSP: '',
    maSize: 0,
    soLuong: 0,
  }

  constructor(
    private sanPhamService: SanPhamService, 
    private router: Router,
    private toast: NgToastService, 
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<CreateProductComponent>
  ){  
      this.addProduct = this.fb.group({
        maSP: '',
        tenSP: '',
        gioiTinh: '',
        trangThai: '',
        kieuDang: '',
        giaSP: 0,
        chatLieu: '',
        mauSac: '',
        image_URL: '',
      });
    }

  ngOnInit(): void {
    this.loadNewMaSP();
    this.addProduct = this.fb.group({
      tenSP: ['', Validators.required], 
      gioiTinh: ['', Validators.required], 
      trangThai: ['', Validators.required], 
      kieuDang: ['', Validators.required], 
      chatLieu: ['', Validators.required], 
      giaSP: ['', [Validators.required, Validators.min(1)]], 
      image_URL: [null, Validators.required] ,
      mauSac: '',
      s38: ['', [Validators.required, Validators.min(0)]],
      s39: ['', [Validators.required, Validators.min(0)]],
      s40: ['', [Validators.required, Validators.min(0)]],
      s41: ['', [Validators.required, Validators.min(0)]],
      s42: ['', [Validators.required, Validators.min(0)]],
      s43: ['', [Validators.required, Validators.min(0)]],
    });
  }
  
  loadNewMaSP() {
    this.sanPhamService.getNewMaSP().subscribe({
      next: (response) => {
        this.newMaSP = response.productCode;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    }
    );
  }
  
  uploadPhoto(event: any){
    var file = event.target.files[0];
    const formData:FormData = new FormData();
    formData.append('uploadedFile',file,file.name);
    formData.append('tenSP', this.newMaSP);

    this.sanPhamService.uploadFile(formData).subscribe((data:any)=>{
      this.anhSanPham = data.toString();
      this.duongDanAnh = "444";
    })
  }

  addKho(maSP:string,maSize:number,soLuong:number){
    this.addKhoRequest.maSP = maSP;
    this.addKhoRequest.maSize = maSize;
    this.addKhoRequest.soLuong = soLuong;
    this.sanPhamService.addSanPhamKho(this.addKhoRequest).subscribe({
      next: (val: any) => {
        console.log(this.addKhoRequest);
    }
    });
  }

  onFormSubmit(){
    if(this.addProduct.valid){
      this.addProduct.value.maSP = this.newMaSP;
      this.addProduct.value.image_URL = 'https://localhost:7035/Upload/product/' + this.newMaSP + '.jpg';
      console.log(this.addProduct.value);
      
      this.sanPhamService.addProduct(this.addProduct.value).subscribe({
        next: (val: any) => {
          this.addKho(this.newMaSP,38,this.addProduct.value.s38);
          this.addKho(this.newMaSP,39,this.addProduct.value.s39);
          this.addKho(this.newMaSP,40,this.addProduct.value.s40);
          this.addKho(this.newMaSP,41,this.addProduct.value.s41);
          this.addKho(this.newMaSP,42,this.addProduct.value.s42);
          this.addKho(this.newMaSP,43,this.addProduct.value.s43);
          this.toast.success({detail:"SUCCESS", summary:"Thêm sản phẩm thành công", duration: 5000});
          this.dialogRef.close(true);
        }    
      });
    }
    else{
      alert('Vui lòng điền đầy đủ thông tin và chọn hình ảnh!');
    }
  }

}
