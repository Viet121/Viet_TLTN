import { Component, Injectable, OnInit } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { HoaDon } from 'src/app/models/hoadon';
import { SanPhamService } from 'src/app/services/sanpham.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit{

  userEmail: string = '';
  idUser: number = 0;

  hoaDons: HoaDon[] = [];

  totalRecords: number = 0; // Tổng số bản ghi
  page: number = 1;         // Trang hiện tại
  pageSize: number = 3;     // Số hóa đơn mỗi trang
  

  constructor(private hoaDonService: SanPhamService) {}
  ngOnInit(): void {
    this.userEmail = this.hoaDonService.userEmailLoggedIn;
    this.loadIdUser();
  }

  loadHoaDons(): void {
    this.hoaDonService.getHoaDonId(this.idUser, this.page, this.pageSize)
      .subscribe(response => {
        this.hoaDons = response.data;
        this.totalRecords = response.totalRecords;
      });
  }

  loadIdUser(){
    this.hoaDonService.getID(this.userEmail).subscribe({
      next: (response) => {
        this.idUser = response;
        this.hoaDonService.getHoaDonId(this.idUser, this.page, this.pageSize)
        .subscribe(response => {
          this.hoaDons = response.data;
          this.totalRecords = response.totalRecords;
        });
      }
    });
  }
  getTinhTrang(tinhTrang: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'Chờ shop xác nhận',
      1: 'Shop đã xác nhận',
      2: 'Shop đã giao cho bên vận chuyển',
      3: 'Đang giao hàng',
      4: 'Đã giao hàng',
      5: 'Đơn hàng bị hủy'
    };
    return statusMap[tinhTrang] || 'Trạng thái không xác định';
  }
  

  // Xử lý sự kiện thay đổi trang
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;  // Cập nhật trang hiện tại
    this.pageSize = event.pageSize;  // Cập nhật số lượng mục mỗi trang
    this.loadIdUser();              // Tải lại dữ liệu theo trang mới
  }

}
