import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CTHoaDonSanPham } from 'src/app/models/cthoadonsanpham';
import { HoaDon } from 'src/app/models/hoadon';
import { LSDuyet } from 'src/app/models/lsduyet';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit{

  maHDURL: string | null = null;

  userEmail: string = '';
  idAdmin: number = 0;

  chiTietHDs: CTHoaDonSanPham[] = [];
  hoaDon: HoaDon = {
    maHD: '',
    idUser: 0,
    tongTien: 0,
    thoiGian: '2023-01-01',
    hoTen: '',
    sdt: '',
    email: '',
    diaChi: '',
    tinhTrang: 0,
  }
  addLSDRequest: LSDuyet = {
    maLSD: 0,
    maHD: '',
    idAdmin: 0,
    ngayD: '2024-01-01',
  }
  constructor(
    private gioHangService: SanPhamService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: NgToastService,
  ) { }
  ngOnInit(): void {
    this.maHDURL = this.route.snapshot.paramMap.get('maHD');
    this.userEmail = this.gioHangService.userEmailLoggedIn;
    this.loadHD(this.maHDURL!);
    this.loadCTHD(this.maHDURL!);
    this.loadIdAdmin();
  }

  loadHD(maHD:string): void{
    this.gioHangService.getHoaDon( maHD).subscribe(data => {
      this.hoaDon = data;
    });
  }

  loadCTHD(maHD:string): void {
    this.gioHangService.getCTDHadmin(maHD)
      .subscribe(datas => {
        this.chiTietHDs = datas;
      });
  } 

  loadIdAdmin(){
    this.gioHangService.getID(this.userEmail).subscribe({
      next: (response) => {
        this.idAdmin = response;
      }
    });
  }

  updateTinhTrang(maHD: string, tinhTrang: number): void{
    this.gioHangService.checkTinhTrang0(maHD,0).subscribe({
      next:(check) => {
        if(check){
          this.addLSDRequest.maHD = maHD;
          this.addLSDRequest.idAdmin = this.idAdmin;
          this.gioHangService.addLSDuyet1(this.addLSDRequest).subscribe({
            next: (val: any) => {
              this.gioHangService.updateTinhTrangHD(maHD,tinhTrang).subscribe({
                next: (val: any) => {
                  console.log(val.Message);
                  this.router.navigate(['/browse']).then(() => {
                    if(tinhTrang==1){
                      this.toast.success({detail:"SUCCESS", summary:"Duyệt đơn thành công", duration: 5000});
                    } else{
                      this.toast.error({detail:"ERROR", summary:"Hủy đơn thành công", duration: 5000});
                    }
                    
                  });
                }
              });
          }
          });
        }else{
          this.router.navigate(['/browse']).then(() => {
            this.toast.success({detail:"SUCCESS", summary:"Đơn này đã được admin khác duyệt", duration: 5000});
          });
        }
      }
    });
  }

  updateTinhTrang2(maHD: string, tinhTrang: number): void{
    this.gioHangService.updateTinhTrangHD(maHD,tinhTrang).subscribe({
      next: (val: any) => {
        console.log(val.Message);
        this.router.navigate(['/approved']).then(() => {
          if(tinhTrang==2){
            this.toast.success({detail:"SUCCESS", summary:"Gửi đơn thành công", duration: 5000});
          } else{
            this.toast.error({detail:"ERROR", summary:"Hủy đơn thành công", duration: 5000});
          }
          
        });
      }
    });
  }

}
