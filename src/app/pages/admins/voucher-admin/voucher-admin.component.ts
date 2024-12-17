import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Voucher } from 'src/app/models/voucher';
import { SanPhamService } from 'src/app/services/sanpham.service';
import { CreateVoucherComponent } from '../create-voucher/create-voucher.component';
import { UpdateVoucherComponent } from '../update-voucher/update-voucher.component';


@Component({
  selector: 'app-voucher-admin',
  templateUrl: './voucher-admin.component.html',
  styleUrls: ['./voucher-admin.component.css'],
})

export class VoucherAdminComponent implements OnInit{

  vouchers: Voucher[]=[]; 
  totalRecords: number = 0; // Tổng số bản ghi
  page: number = 1;         // Trang hiện tại
  pageSize: number = 10;     // Số sp mỗi trang
  tinhTrangFilter: string | null = null;
  dataSource = new MatTableDataSource<Voucher>(); // Sử dụng MatTableDataSource để quản lý dữ liệu
  displayedColumns: string[] = ['code', 'soLuong', 'daDung', 'phanTram', 'actions'];

  constructor(private voucherService: SanPhamService,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getVouchers();
  }

   
  getVouchers(){
    this.voucherService.getVouchersPage(this.page, this.pageSize).subscribe(response => {
        this.dataSource.data = response.data; // Gán dữ liệu vào dataSource
        this.totalRecords = response.totalRecords; // Lấy tổng số bản ghi
      });
  }
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;  // Cập nhật trang hiện tại
    this.pageSize = event.pageSize;  // Cập nhật số lượng mục mỗi trang
    this.getVouchers();             
  }
  
  openAddProduct(){
    const dialogRef = this.dialog.open(CreateVoucherComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => { 
        if (val) {
          this.getVouchers();
        }
      },
    });
  }
  openUpdateProduct(code:string){
      const dialogRef = this.dialog.open(UpdateVoucherComponent, {
        data: { code: code } 
      });
      dialogRef.afterClosed().subscribe({
        next: (val) => { 
          if (val) {
            this.getVouchers();
          }
        },
      });
  }

  deleteVoucher(code:string) {
    const confirmation = window.confirm('Bạn có muốn xoá voucher này không !');
    if (confirmation) {
      // Nếu người dùng xác nhận xóa, thì thực hiện hàm delete
      this.voucherService.deleteVoucher(code).subscribe({
        next: (data) => {
          this.getVouchers(); 
        }
      });
    }
  }

}
