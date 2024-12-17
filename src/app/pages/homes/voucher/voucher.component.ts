import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Voucher } from 'src/app/models/voucher';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent implements OnInit{

  vouchers: Voucher[]=[]; 
  totalRecords: number = 0; // Tổng số bản ghi
  page: number = 1;         // Trang hiện tại
  pageSize: number = 9;

  constructor(private voucherService: SanPhamService,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getVouchers();
  }

  getVouchers(){
      this.voucherService.getVouchersPage(this.page, this.pageSize).subscribe(response => {
          this.vouchers = response.data; // Gán dữ liệu vào dataSource
          this.totalRecords = response.totalRecords; // Lấy tổng số bản ghi
        });
    }
    onPageChange(event: PageEvent): void {
      this.page = event.pageIndex + 1;  // Cập nhật trang hiện tại
      this.pageSize = event.pageSize;  // Cập nhật số lượng mục mỗi trang
      this.getVouchers();             
    }

}
