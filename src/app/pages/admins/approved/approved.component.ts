import { Component, Injectable, OnInit } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { HoaDon } from 'src/app/models/hoadon';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-approved',
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.css']
})
export class ApprovedComponent implements OnInit{

  hoaDons: HoaDon[] = [];
  userEmail: string = '';
  idAdmin: number = 0;
  
  totalRecords: number = 0; // Tổng số bản ghi
  page: number = 1;         // Trang hiện tại
  pageSize: number = 3;     // Số hóa đơn mỗi trang
  tinhTrang: number = 1; 
  constructor(private hoaDonService: SanPhamService) {}
  
  ngOnInit(): void {
    this.userEmail = this.hoaDonService.userEmailLoggedIn;
    this.loadIdAdmin();
    //this.loadHoaDons();
  }

  loadHoaDons(): void {
    this.hoaDonService.getHoaDon1(this.tinhTrang,this.idAdmin, this.page, this.pageSize)
      .subscribe(response => {
        this.hoaDons = response.data;
        this.totalRecords = response.totalRecords;
      });
  }

  // Xử lý sự kiện thay đổi trang
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;  // Cập nhật trang hiện tại
    this.pageSize = event.pageSize;  // Cập nhật số lượng mục mỗi trang
    this.loadIdAdmin();              // Tải lại dữ liệu theo trang mới
  }

  loadIdAdmin(){
    this.hoaDonService.getID(this.userEmail).subscribe({
      next: (response) => {
        this.idAdmin = response;
        this.hoaDonService.getHoaDon1(this.tinhTrang,this.idAdmin, this.page, this.pageSize)
        .subscribe(response => {
          this.hoaDons = response.data;
          this.totalRecords = response.totalRecords;
        });
      }
    });
  }

}
