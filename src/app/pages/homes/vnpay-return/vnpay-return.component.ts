import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { concatMap, map, switchMap } from 'rxjs';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-vnpay-return',
  templateUrl: './vnpay-return.component.html',
  styleUrls: ['./vnpay-return.component.css']
})
export class VnpayReturnComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private vnPayService: SanPhamService,
    private router: Router,
    private toast: NgToastService,
  ) {}

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
  
    // Gửi yêu cầu xác nhận thanh toán đến backend
    this.vnPayService.validatePayment(queryParams).pipe(
      switchMap((response) => {
        // Cập nhật tạm tính sau khi xác nhận thanh toán
        return this.vnPayService.updateTamTinh(response.orderId, 0).pipe(
          map(() => response) // Truyền tiếp dữ liệu nếu cần dùng sau
        );
      })
    ).subscribe({
      next: (response) => {
        this.router.navigate(['/order']).then(() => {
          this.toast.success({
            detail: "SUCCESS", 
            summary: "Thanh toán online thành công", 
            duration: 5000
          });
        });
      },
      error: (err) => {
        this.toast.error({
          detail: "ERROR", 
          summary: err?.error?.message || 'Đã xảy ra lỗi', 
          duration: 5000
        });
      }
    });
  }
  

  

}
