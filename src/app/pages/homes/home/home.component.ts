import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  soLuong!: number;

  constructor(private gioHangService: SanPhamService) { }

  ngOnInit(): void {
    this.laySoLuong();
  }

  laySoLuong() {
    const idUser = 3; // Thay idUser bằng giá trị thích hợp
    const maSP = 'SP_3'; // Thay maSP bằng giá trị thích hợp
    const maSize = 38; // Thay maSize bằng giá trị thích hợp
    this.gioHangService.checkGioHang(idUser, maSP, 39).subscribe({
      next: (tonTai) => {
        if(tonTai){
          this.gioHangService.getSoLuong(idUser, maSP, maSize).subscribe(
            (soLuong: number) => {
              this.soLuong = soLuong;
            },
            (error) => {
              console.log('Lỗi khi lấy số lượng:', error);
            }
          );
        }
      }
    })
    
  }
}