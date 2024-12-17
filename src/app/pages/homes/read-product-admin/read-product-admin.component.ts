import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SanPham } from 'src/app/models/sanpham';
import { SanPhamService } from 'src/app/services/sanpham.service';
import { UpdateProductComponent } from '../update-product/update-product.component';

@Component({
  selector: 'app-read-product-admin',
  templateUrl: './read-product-admin.component.html',
  styleUrls: ['./read-product-admin.component.css']
})
export class ReadProductAdminComponent implements OnInit{
  maSP2!: string;
  soLuongTonKho: number = 0;
  soLuongBan: number = 0;
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
  constructor(private route: ActivatedRoute, private sanPhamService: SanPhamService,private router: Router,private dialog: MatDialog){}
  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => { 
        const maSP = params.get('maSP');
        console.log(maSP);
        if(maSP){
          this.maSP2 = maSP;
          this.loadSP( maSP);  
          this.getTotalSLBanVaSLTonKho(maSP);
        }
      }
    })
  }

  loadSP(maSP: string){
    this.sanPhamService.getProduct(maSP).subscribe({
      next: (response) => {
        this.sanphamDetails = response;
      }
    });
  }

  getTotalSLBanVaSLTonKho(maSP: string): void {
    this.sanPhamService.getTotalSoLuongByMaSPCTHD(maSP).subscribe({
      next: (total) => {
        this.soLuongBan = total; // Lưu tổng số lượng
        this.sanPhamService.getTotalSoLuongTonKhoByMaSP(maSP).subscribe({
          next: (val) => {
            this.soLuongTonKho = val;
          }
        });
      },
      error: (err) => {
        console.error(`Lỗi khi lấy tổng số lượng: ${err.message}`);
        this.soLuongBan = 0; // Đặt lại giá trị nếu lỗi
      }
    });
  }

  deleteSP(maSP: string) {
    const confirmation = window.confirm('Bạn có muốn xoá sản phẩm này không !');
    if (confirmation) {
      // Nếu người dùng xác nhận xóa, thì thực hiện hàm delete
      console.log(maSP);
      this.sanPhamService.deleteProductKho(maSP).subscribe({
        next: (data) => {
          this.sanPhamService.deleteProduct(maSP).subscribe({
            next: (response) => {
              this.router.navigate(['/product']);
            }
          }); 
        }
      });
    }
  }
 
  openUpdateProduct(maSP:string){
    const dialogRef = this.dialog.open(UpdateProductComponent, {
      data: { maSP: maSP } 
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => { 
        if (val) {
          this.loadSP(maSP);
        }
      },
    });
  }


}
