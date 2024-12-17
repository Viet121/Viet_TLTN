import { Component, Injectable, OnInit } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { HoaDon } from 'src/app/models/hoadon';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit{
  hoaDons: HoaDon[] = [];

  totalRecords: number = 0; // Tổng số bản ghi
  page: number = 1;         // Trang hiện tại
  pageSize: number = 3;     // Số hóa đơn mỗi trang
  tinhTrang: number = 0;

  constructor(private hoaDonService: SanPhamService) {}
  ngOnInit(): void {
    this.loadHoaDons();
  }

  loadHoaDons(): void {
    this.hoaDonService.getHoaDon0(this.tinhTrang, this.page, this.pageSize)
      .subscribe(response => {
        this.hoaDons = response.data;
        this.totalRecords = response.totalRecords;
      });
  }

  // Xử lý sự kiện thay đổi trang
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;  // Cập nhật trang hiện tại
    this.pageSize = event.pageSize;  // Cập nhật số lượng mục mỗi trang
    this.loadHoaDons();              // Tải lại dữ liệu theo trang mới
  }

}
