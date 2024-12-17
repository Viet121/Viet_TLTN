import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { concatMap, from, Observable, of, tap } from 'rxjs';
import { CTHoaDon } from 'src/app/models/cthoadon';
import { GioHangSanPham } from 'src/app/models/giohangsanpham';
import { HoaDon } from 'src/app/models/hoadon';
import { SanPham } from 'src/app/models/sanpham';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-shipping-information',
  templateUrl: './shipping-information.component.html',
  styleUrls: ['./shipping-information.component.css']
})
export class ShippingInformationComponent implements OnInit{
  userRole: string = '';
  userEmail: string = '';
  idUser: number = 0;
  gioHangs: GioHangSanPham[] = [];
  tongTien: number = 0;
  tongTienGio : number = 0;
  newMaHD!: string;
  addInfor: FormGroup ;
  voucherPhanTram: number = 0;
  kho:any={
    maSP: '',
    maSize: 0,
    soLuong: 0,
  }
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
  ctHoaDon:CTHoaDon={
    maCTHD: 0,
    maHD: '',
    maSP: '',
    soLuong: 0,
    giaSP: 0,
    maSize: 0,
    giaTong: 0,
  }
  hoaDon:HoaDon={
    maHD: '',
    idUser: 0,
    tongTien: 0,
    thoiGian: '2023-01-01',
    hoTen: '',
    sdt: '',
    email: '',
    diaChi: '',
    tinhTrang: 0,
    thanhToan: 0,
    tamTinh: 0,
  }

  //Call API Location tu Vietnam Localized API
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  lct!: string;

  constructor(
    private gioHangService: SanPhamService,
    private fb: FormBuilder,
    private toast: NgToastService, 
    private router: Router,
    private route: ActivatedRoute
  ){
    this.addInfor = this.fb.group({
      maHD: '',
      idUser: 0,
      tongTien: 0,
      ngayTao: '2023-01-01',
      hoTen: ['', Validators.required], 
      sdt: ['', Validators.required],
      email: ['', Validators.required],
      province: [''],
      district: [{ value: '', disabled: true }], // Ban đầu disabled
      ward: [{ value: '', disabled: true }],    // Ban đầu disabled // phuong xa
      soNha: ['', Validators.required],
      diaChi:''
    }); 
   }

  

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.voucherPhanTram = params['voucherPhanTram'] || null;
      console.log('Voucher Phan Tram:', this.voucherPhanTram);
    });
    this.userEmail = this.gioHangService.userEmailLoggedIn;
    this.loadIdUser();
    this.loadNewMaHD();
    this.loadProvinces();
    this.handleProvinceChange();
    this.handleDistrictChange();
  }

  // Lấy danh sách Tỉnh/Thành phố
  private loadProvinces() {
    this.gioHangService.getProvinces().subscribe((data) => {
      this.provinces = data;
    });
  }
  
  private handleProvinceChange() {
    this.addInfor.get('province')?.valueChanges.subscribe((provinceCode) => {
      if (provinceCode) {
        this.addInfor.get('district')?.enable();
        this.gioHangService.getDistricts(provinceCode).subscribe((data) => {
          this.districts = data.districts;
          this.addInfor.get('ward')?.disable(); // Reset phường/xã
        });
      } else {
        this.addInfor.get('district')?.disable();
        this.addInfor.get('ward')?.disable();
        this.districts = [];
        this.wards = [];
      }
    });
  }
  
  private handleDistrictChange() {
    this.addInfor.get('district')?.valueChanges.subscribe((districtCode) => {
      if (districtCode) {
        this.addInfor.get('ward')?.enable();
        this.gioHangService.getWards(districtCode).subscribe((data) => {
          this.wards = data.wards;
        });
      } else {
        this.addInfor.get('ward')?.disable();
        this.wards = [];
      }
    });
  }

  location(tp: string, qh: string, px: string): Observable<any> {
    return this.gioHangService.getLocation(tp, qh, px).pipe(
      tap((data) => {
        // Cập nhật giá trị cho this.lct khi nhận được dữ liệu từ API
        this.lct = `${data.province},${data.district},${data.ward}`;
      })
    );
  }

  loadIdUser(){
    console.log("email: " +this.userEmail);
    console.log("role: " + this.userRole)
    this.gioHangService.getID(this.userEmail).subscribe({
      next: (response) => {
        this.idUser = response;
        console.log(this.idUser);
        this.loadGioHangs2(this.idUser);
      }
    });
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

  loadGioHangs2(userId: number): void { // chan cac sp khong dap ung so luong
    this.gioHangService.getGioHangWithProductInfo(userId)
      .subscribe(gioHangs => {
        // Lọc và tính tổng tiền trong một bước
        this.gioHangs = gioHangs.filter(item => item.soLuongDapUng! > 0);
  
        this.tongTienGio = this.gioHangs.reduce((total, item) => {
          return total + (item.tongTienKho || 0);
        }, 0);
      });
  }

  loadNewMaHD() {
    this.gioHangService.getNewMaHD().subscribe({
      next: (response) => {
        this.newMaHD = response.productCode;
        console.log(this.newMaHD);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    }
    );
  }


  addCTHoaDon2(userId: number,maHD: string): void { // ham nay bi loi
    this.gioHangService.getGioHangWithProductInfo(userId)
      .subscribe(gioHangs => {
        this.gioHangs = gioHangs;
        this.gioHangs.forEach((item)=>{
          this.ctHoaDon.maHD = maHD;
          this.ctHoaDon.maSP = item.maSP;
          this.ctHoaDon.soLuong = item.soLuongDapUng;
          this.ctHoaDon.giaSP = item.tongTien;
          this.ctHoaDon.maSize = item.maSize;
          this.ctHoaDon.giaTong = item.tongTien!*item.soLuongDapUng!;
          if(this.ctHoaDon.soLuong! > 0){
            this.kho.maSP = this.ctHoaDon.maSP;
            this.kho.maSize = this.ctHoaDon.maSize;
            this.kho.soLuong = item.soLuongKho! - item.soLuongDapUng!;
            this.gioHangService.updateKho(this.kho).subscribe({
              next: (val: any) => {
                  this.gioHangService.addCTHoaDon(this.ctHoaDon).subscribe({
                    next: (da: any) =>{
                      if(item.soLuong! - item.soLuongDapUng! == 0){
                        this.gioHangService.deleteGioHang(item.maGH!).subscribe({
                          next: (va: any) =>{
                            this.router.navigate(['product']).then(() => {
                              this.gioHangService.triggerReload();
                              this.toast.success({detail:"SUCCESS", summary:"Đặt hàng thành công! Cảm ơn quý khách", duration: 5000});
                            });
                          }
                        });
                      }
                      else{
                        this.gioHangService.updateQuantityGioHang(this.idUser, this.kho.maSP, this.kho.maSize, item.soLuong! - item.soLuongDapUng!).subscribe({
                          next: (va: any) =>{
                            this.gioHangService.triggerReload();
                            this.toast.success({detail:"SUCCESS", summary:"Đặt hàng thành công! Cảm ơn quý khách", duration: 5000});
                          }
                        });
                      }
                    }
                  });
              }
            });
          }
        });
      });
  }

  addCTHoaDon(userId: number,maHD: string): void { 
    this.gioHangService.getGioHangWithProductInfo(userId).pipe(
      concatMap(gioHangs => from(gioHangs)), // Biến mảng `gioHangs` thành Observable từng item
      concatMap(item => {
        this.ctHoaDon.maHD = maHD;
        this.ctHoaDon.maSP = item.maSP;
        this.ctHoaDon.soLuong = item.soLuongDapUng;
        this.ctHoaDon.giaSP = item.tongTien;
        this.ctHoaDon.maSize = item.maSize;
        this.ctHoaDon.giaTong = item.tongTien! * item.soLuongDapUng!;
    
        if (this.ctHoaDon.soLuong! > 0) {
          this.kho.maSP = this.ctHoaDon.maSP;
          this.kho.maSize = this.ctHoaDon.maSize;
          this.kho.soLuong = item.soLuongKho! - item.soLuongDapUng!;
    
          return this.gioHangService.updateKho(this.kho).pipe(
            concatMap(() => this.gioHangService.addCTHoaDon(this.ctHoaDon)),
            concatMap(() => {
              if (item.soLuong! - item.soLuongDapUng! === 0) {
                return this.gioHangService.deleteGioHang(item.maGH!);
              } else {
                return this.gioHangService.updateQuantityGioHang(
                  this.idUser,
                  this.kho.maSP,
                  this.kho.maSize,
                  item.soLuong! - item.soLuongDapUng!
                );
              }
            })
          );
        }
    
        return of(null); // Nếu không có số lượng thì bỏ qua
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['product']).then(() => {
          this.gioHangService.triggerReload();
          this.toast.success({ detail: "SUCCESS", summary: "Đặt hàng thành công! Cảm ơn quý khách", duration: 5000 });
        });
      },
      error: (error) => {
        console.error("Lỗi xử lý đơn hàng:", error);
        this.toast.error({ detail: "ERROR", summary: "Có lỗi xảy ra khi đặt hàng!", duration: 5000 });
      }
    });    
  }

  addInformation() {
    if (this.addInfor.valid) {
      const { province, district, ward } = this.addInfor.value;
      
      // Gọi location và đợi kết quả
      this.location(province, district, ward).subscribe({
        next: (data) => {
          // Dữ liệu từ location đã có, có thể cập nhật hoaDon
          this.hoaDon.maHD = this.newMaHD;
          this.hoaDon.idUser = this.idUser;
          this.hoaDon.tongTien = this.tongTienGio;
          this.hoaDon.hoTen = this.addInfor.value.hoTen;
          this.hoaDon.sdt = this.addInfor.value.sdt;
          this.hoaDon.email = this.addInfor.value.email;
          this.hoaDon.diaChi = `${this.lct},${this.addInfor.value.soNha}`;
          this.hoaDon.tinhTrang = 0;
          this.hoaDon.thanhToan = 1; // Thanh toan COD là 1
          this.hoaDon.tamTinh = this.tongTienGio - (this.tongTienGio * this.voucherPhanTram / 100); //tam tinh se giam neu co % giam
          console.log(this.hoaDon);
          
          // Tiến hành gửi yêu cầu addHoaDon nếu cần
          /*
          this.gioHangService.addHoaDon(this.hoaDon).subscribe({ 
            next: (val: any) => {
              this.addCTHoaDon(this.idUser,this.newMaHD); 
          }  
          });
          */
        },
        error: (err) => {
          console.error('Error fetching location data:', err);
        }
      });
    } else {
      this.gioHangService.validateAllFormFileds(this.addInfor);
    }
  }
  
  

} 
