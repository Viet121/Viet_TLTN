import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CMT } from 'src/app/models/cmt';
import { CMTS } from 'src/app/models/cmts';
import { GioHang } from 'src/app/models/giohang';
import { SanPham } from 'src/app/models/sanpham';
import { InforService } from 'src/app/services/infor.service';
import { SanPhamService } from 'src/app/services/sanpham.service';
import { TestComponent } from '../test/test.component';

@Component({
  selector: 'app-read-product-user',
  templateUrl: './read-product-user.component.html',
  styleUrls: ['./read-product-user.component.css']
}) 
export class ReadProductUserComponent implements OnInit {
  userEmail!: string;
  userName!: string;
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
  addCMT: FormGroup;
  cmtReply: boolean = false;
  CMTSs: CMTS[] = [];
  cmt: CMT = {
    id: 0,
    maSP: '',
    name: '',
    noiDung: '',
    thoiGian: '2023-01-01',
    replyCount: 0,
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
    this.addCMT = this.fb.group({
      id: 0,
      maSP: '',
      name: '',
      noiDung: ['', Validators.required],
      thoiGian: '2023-01-01',
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
          this.loadCMT();
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

  loadCMT(){
    this.sanPhamService.getCMT(this.maSP2)
    .subscribe(response => {
      this.cmt = response;
    });
  }
  loadReplies(id: number){
    this.cmtReply = !this.cmtReply;
    if (this.cmtReply == true) {
      this.sanPhamService.getReplies(id).subscribe(
          response => {
              // Lưu dữ liệu phản hồi vào vị trí index trong CMTSs
              this.CMTSs = response;
          }
      );
    } else {
      // Nếu trạng thái tắt (ẩn), xóa dữ liệu phản hồi tại vị trí index
      this.CMTSs = [];
    }
  }
  openCMTs(){
    const dialogRef = this.dialog.open(TestComponent, {
      data: { // Dữ liệu muốn truyền
        email: this.userEmail,
        maSP: this.maSP2,
        tenSP: this.sanphamDetails.tenSP
      },
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => { 
        this.loadCMT();
      },
    });
  }
  submitCMT(){
    if(this.userEmail){
      this.sanPhamService.getName(this.userEmail).subscribe({
        next: (response) => {
          this.userName = response.name;
          console.log('test teenen',this.userName);
          if (this.addCMT.valid){
            this.addCMT.value.maSP = this.maSP2;
            this.addCMT.value.name = this.userName;
            this.addCMT.value.thoiGian = '2023-01-01';
            this.sanPhamService.addCMT(this.addCMT.value).subscribe({
              next: (val: any) => {
                this.addCMT.reset();
                this.loadCMT();
                this.toast.success({detail:"SUCCESS", summary:"Thêm đánh giá thành công", duration: 5000});
              }    
            });
          } else{
            this.sanPhamService.validateAllFormFileds(this.addCMT);
          }
        } 
      });
    }
    else{
      this.toast.error({detail:"ERROR", summary:"Bạn cần đăng nhập để thực hiện chức năng này!", duration: 5000});
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
