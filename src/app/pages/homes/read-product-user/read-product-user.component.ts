import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { GioHang } from 'src/app/models/giohang';
import { SanPham } from 'src/app/models/sanpham';
import { InforService } from 'src/app/services/infor.service';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-read-product-user',
  templateUrl: './read-product-user.component.html',
  styleUrls: ['./read-product-user.component.css']
}) 
export class ReadProductUserComponent implements OnInit {
  userEmail!: string;
  maSP2!: string;
  gia2!: number;
  sizes: number[] = [];
  maSize!: number;
  soLuongCheck!: number;
  soLuongKho!: number;
  soLuongBan: number = 0;
  checkKho: boolean = false;
  checkKho2: boolean = false;
  updateProduct: FormGroup ;
  sanphamDetails: SanPham = {
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
  giohangDetails: GioHang = {
    maGH: 0,
    idUser: 0,
    maSP: '',
    soLuong: 0,
    maSize: 0,
    tongTien: 0,
  }
  constructor(private route: ActivatedRoute, private sanPhamService: SanPhamService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder, 
    private toast: NgToastService, 
    private inforService : InforService,
  ){
    this.updateProduct = this.fb.group({
      size: ['', Validators.required], 
      soLuong: ['', [Validators.required, Validators.min(1)]], 
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => { 
        const maSP = params.get('maSP');
        if(maSP){
          this.maSP2 = maSP;
          this.loadSP(maSP);
          this.getSizes(maSP);
          this.getTotalSoLuongBan(maSP);
          this.getEmailTK();
        }
      }
    })
  }

  getEmailTK(){
    this.inforService.getEmail()
    .subscribe(val=>{
      const emailFromToken = this.sanPhamService.getEmailFromToken();
      this.userEmail = val || emailFromToken;
      console.log(this.userEmail);
    });
  }
  
  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    } 
  }
  
  getTotalSoLuongBan(maSP: string): void {
    this.sanPhamService.getTotalSoLuongByMaSPCTHD(maSP).subscribe({
      next: (total) => {
        this.soLuongBan = total; // Lưu tổng số lượng
        console.log(`Tổng số lượng của ${maSP} là: ${total}`);
      },
      error: (err) => {
        console.error(`Lỗi khi lấy tổng số lượng: ${err.message}`);
        this.soLuongBan = 0; // Đặt lại giá trị nếu lỗi
      }
    });
  }

  getSizes(maSP: string): void {
    this.sanPhamService.getSizesByProduct(maSP)
      .subscribe(sizes => this.sizes = sizes);
  }

  onSizeChange(maSP:string): void {
    const sizeControl = this.updateProduct.get('size');
    if (sizeControl) {
      this.maSize = sizeControl.value;
      if (this.maSize) {
        const soLuongControl = this.updateProduct.get('soLuong');
        if (soLuongControl) {
          soLuongControl.enable();
          this.getQuantity(maSP);
        }
      } else {
        const soLuongControl = this.updateProduct.get('soLuong');
        if (soLuongControl) {
          soLuongControl.disable();
        }
      }
    } 
  }

  getQuantity(maSP:string): void {
    const soLuongControl = this.updateProduct.get('soLuong');
    if (soLuongControl) {
      this.sanPhamService.getQuantityByProductAndSize(maSP, this.maSize)
        .subscribe(quantity => {
          soLuongControl.setValue('', { emitEvent: false });
          soLuongControl.setValidators([Validators.required, Validators.max(quantity)]);
          soLuongControl.updateValueAndValidity();
        });
    }
  }
 
  loadSP(maSP: string){
    this.sanPhamService.getProduct(maSP).subscribe({
      next: (response) => {
        this.sanphamDetails = response;
      }
    });
  }

  addGioHang(maSP: string, gia: number) {
    if (this.userEmail) {
      console.log(maSP);
      console.log(this.userEmail);
      this.sanPhamService.getID(this.userEmail).subscribe({
        next: (response) => {
          this.giohangDetails.idUser = response;
          //kt form xem hop le khong
          if (this.updateProduct.valid) {
            const sizeControl = this.updateProduct.get('size');
            const soLuongControl = this.updateProduct.get('soLuong');
            //chua xu ly tra ve loi
            if (sizeControl && soLuongControl) {
              const size = sizeControl.value;
              const soLuong = soLuongControl.value;
              if(soLuong==0){
                this.sanPhamService.validateAllFormFileds(this.updateProduct);
                console.log('Số lượng đã nhập:', soLuong);
              }
              else{
                this.giohangDetails.maSP = maSP;
                this.giohangDetails.maSize = size;
                this.giohangDetails.soLuong = soLuong;
                this.giohangDetails.tongTien = gia;
                this.sanPhamService.checkGioHang(this.giohangDetails.idUser , maSP, size).subscribe({
                  next: (tonTai) => {
                    //kt gio hang da co sp nay chua
                    if(tonTai){
                      this.sanPhamService.getSoLuong(this.giohangDetails.idUser!, maSP, size).subscribe({ next:
                        (soLuong: number) => {
                          this.soLuongCheck = soLuong;
                          this.sanPhamService.getQuantityByProductAndSize(maSP, this.maSize).subscribe({
                            next: (quantity) => {
                              this.soLuongKho = quantity;
                              if((this.soLuongCheck + this.giohangDetails.soLuong!) > this.soLuongKho){
                                this.checkKho = true;
                                this.updateProduct.valueChanges.subscribe(() => {
                                  this.checkKho = false; 
                                });
                              }
                              else{
                                this.sanPhamService.updateQuantityGioHang(this.giohangDetails.idUser!, maSP, size, this.soLuongCheck + this.giohangDetails.soLuong!).subscribe({
                                  next: (val: any) => {
                                    //trigger de theo doi su kien xay ra va cap nhat header
                                    this.sanPhamService.triggerReload();
                                    this.toast.success({detail:"SUCCESS", summary:"Thêm giỏ hàng thành công", duration: 5000});
                                  }   
                                });
                              }
                            }
                          });
                        }
                      });
                    }
                    else{
                      this.sanPhamService.addGioHang(this.giohangDetails).subscribe({
                        next: (val: any) => {
                          this.sanPhamService.triggerReload();
                          this.toast.success({detail:"SUCCESS", summary:"Thêm giỏ hàng thành công", duration: 5000});
                        }    
                      });
                    }
                  }
                })
              }
            }
          }
          else{
            this.sanPhamService.validateAllFormFileds(this.updateProduct);
          }
        }
      });
    }
    else{
      this.toast.error({detail:"ERROR", summary:"Bạn cần đăng nhập để thực hiện chức năng này!", duration: 5000});
    }
  }

  addThanhToan(maSP: string, gia: number) {
    if (this.userEmail) {
      console.log(maSP);
      console.log(this.userEmail);
      this.sanPhamService.getID(this.userEmail).subscribe({
        next: (response) => {
          this.giohangDetails.idUser = response;
          if (this.updateProduct.valid) {
            const sizeControl = this.updateProduct.get('size');
            const soLuongControl = this.updateProduct.get('soLuong');
          
            if (sizeControl && soLuongControl) {
              const size = sizeControl.value;
              const soLuong = soLuongControl.value;
              if(soLuong==0){
                this.sanPhamService.validateAllFormFileds(this.updateProduct);
                console.log('Số lượng đã nhập:', soLuong);
              }
              else{
                //Kiem tra xem gio hang da co chua
                this.giohangDetails.maSP = maSP;
                this.giohangDetails.maSize = size;
                this.giohangDetails.soLuong = soLuong;
                this.giohangDetails.tongTien = gia;
                this.sanPhamService.checkGioHang(this.giohangDetails.idUser , maSP, size).subscribe({
                  next: (tonTai) => {
                    if(tonTai){
                      this.sanPhamService.getSoLuong(this.giohangDetails.idUser!, maSP, size).subscribe({ next:
                        (soLuong: number) => {
                          this.soLuongCheck = soLuong;
                          this.sanPhamService.getQuantityByProductAndSize(maSP, this.maSize).subscribe({
                            next: (quantity) => {
                              this.soLuongKho = quantity;
                              // tra ve checkKho2 cho ben html kt 
                              if((this.soLuongCheck + this.giohangDetails.soLuong!) > this.soLuongKho){
                                this.checkKho2 = true;
                                this.updateProduct.valueChanges.subscribe(() => {
                                  this.checkKho2 = false; 
                                });
                              }
                              else{
                                this.sanPhamService.updateQuantityGioHang(this.giohangDetails.idUser!, maSP, size, this.soLuongCheck + this.giohangDetails.soLuong!).subscribe({
                                  next: (val: any) => {
                                    this.router.navigate(['/your-cart']);
                                  }   
                                });
                              }
                            }
                          });
                        }
                      });
                    }
                    else{
                      this.sanPhamService.addGioHang(this.giohangDetails).subscribe({
                        next: (val: any) => {
                          this.router.navigate(['/your-cart']);
                        }     
                      });
                    }
                  }
                })
              }
            }
          }
          else{
            this.sanPhamService.validateAllFormFileds(this.updateProduct);
          }
        }
      });
    }
    else{
      this.toast.error({detail:"ERROR", summary:"Bạn cần đăng nhập để thực hiện chức năng này!", duration: 5000});
    }
  }

  submitForm(): void {
    if (this.updateProduct.valid) {
      const sizeControl = this.updateProduct.get('size');
      const soLuongControl = this.updateProduct.get('soLuong');
    
      if (sizeControl && soLuongControl) {
        const size = sizeControl.value;
        const soLuong = soLuongControl.value;
        if(soLuong==0){
          this.sanPhamService.validateAllFormFileds(this.updateProduct);
          console.log('Số lượng đã nhập:', soLuong);
        }
        else{
          console.log('Size đã chọn:', size);
          console.log('Số lượng đã nhập:', soLuong);
        }
      }
    }
    else{
      this.sanPhamService.validateAllFormFileds(this.updateProduct);
    }
  }
  

}
