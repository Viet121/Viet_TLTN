import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { GioHang } from 'src/app/models/giohang';
import { GioHangSanPham } from 'src/app/models/giohangsanpham';
import { SanPham } from 'src/app/models/sanpham';
import { Voucher } from 'src/app/models/voucher';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-your-cart', 
  templateUrl: './your-cart.component.html',
  styleUrls: ['./your-cart.component.css']
})
export class YourCartComponent implements OnInit{
  userRole: string = '';
  userEmail: string = '';
  idUser: number = 0;
  gioHangs: GioHangSanPham[] = [];
  tongTien: number = 0;
  tongTienGio : number = 0;
  voucherDetail: Voucher = {
    code: '',
    soLuong: 0,
    daDung: 0,
    phanTram: 0
  };
  voucherCode: string = '';
  voucherPhanTram: number = 0;
  productDetails:SanPham={ 
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
  constructor(
    private gioHangService: SanPhamService,
    private toast: NgToastService, 
    private route: ActivatedRoute,
    private router: Router,
  ) { }
  ngOnInit(): void {
    this.userEmail = this.gioHangService.userEmailLoggedIn;
    this.loadIdUser();                                    
  }  

  loadGioHangs(userId: number): void {
    this.gioHangService.getGioHangWithProductInfo(userId)
      .subscribe(gioHangs => {
        this.gioHangs = gioHangs;
        this.gioHangs.forEach((item)=>{
          this.tongTienGio = this.tongTienGio + item.tongTienKho!;
        });
      });
  } 
  
  deleteGH(maGH: number) {
    const confirmation = window.confirm('Bạn có muốn bỏ sản phẩm này ra khỏi giỏ không !');
    if (confirmation) {
      // Nếu người dùng xác nhận xóa, thì thực hiện hàm delete
      console.log(maGH);
      this.gioHangService.deleteGioHang(maGH).subscribe({
        next: (response) => {
          this.gioHangService.triggerReload();
          this.tongTienGio = 0;
          this.loadGioHangs(this.idUser);
        } 
      });
    }
  }
 
  loadIdUser(){
    console.log("email: " +this.userEmail);
    console.log("role: " + this.userRole)
    this.gioHangService.getID(this.userEmail).subscribe({
      next: (response) => {
        this.idUser = response;
        console.log(this.idUser); 
        this.loadGioHangs(this.idUser);
      }
    });
  }

  loadSP(maSP: string){
    this.gioHangService.getProduct(maSP).subscribe({
      next: (response) => {
        this.productDetails = response;
      }
    });
  }

  onVoucher(voucher:string){
    if (voucher) {
      this.gioHangService.getVoucher(voucher).subscribe({
        next: (response) => {
          if(response){
            this.voucherDetail = response;
            if(this.voucherDetail.soLuong! <= this.voucherDetail.daDung!){
              this.toast.error({detail:"ERROR", summary:"Số lượt sử dụng mã này đã hết", duration: 5000});
            }else{
              this.voucherPhanTram = this.voucherDetail.phanTram!;
              this.gioHangService.autoVoucher(this.voucherDetail).subscribe({
                next: (response) => {
                  this.toast.success({detail:"SUCCESS", summary:"Áp mã giảm thành công!", duration: 5000});
                  console.log('Phan tram giam ne may ma',this.voucherPhanTram);
                }
              });
            }
          }else{
            this.toast.error({detail:"ERROR", summary:"Mã giảm giá không tồn tại", duration: 5000});
          }
        }
      });
    } else {
      this.toast.error({detail:"ERROR", summary:"Vui lòng nhập mã giảm giá", duration: 5000});
    }
  }

  goToShipping(phanTram: number) {
    this.router.navigate(['/shipping-information'], { queryParams: { voucherPhanTram: phanTram } });
  }

}
