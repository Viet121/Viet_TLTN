import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SanPham } from 'src/app/models/sanpham';
import { SanPhamService } from 'src/app/services/sanpham.service';
import { UpdateProductComponent } from '../update-product/update-product.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CMTS } from 'src/app/models/cmts';
import { CMT } from 'src/app/models/cmt';
import { TestComponent } from '../test/test.component';
import { NgToastService } from 'ng-angular-popup';
import { InforService } from 'src/app/services/infor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-read-product-admin',
  templateUrl: './read-product-admin.component.html',
  styleUrls: ['./read-product-admin.component.css']
})
export class ReadProductAdminComponent implements OnInit{
  userEmail!: string;
  userName!: string;
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
  addCMT: FormGroup;
  cmtReply: boolean = false;
  CMTSs: CMTS[] = [];
  cmt: CMT = {
    id: 0,
    maSP: '',
    name: '',
    noiDung: '',
    thoiGian: '2023-01-01',
    replyCount: 0,
  }
  constructor(private route: ActivatedRoute, 
    private sanPhamService: SanPhamService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toast: NgToastService,
    private inforService : InforService,
  )
  {
    this.addCMT = this.fb.group({
          id: 0,
          maSP: '',
          name: '',
          noiDung: ['', Validators.required],
          thoiGian: '2023-01-01',
        });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => { 
        const maSP = params.get('maSP');
        console.log(maSP);
        if(maSP){
          this.maSP2 = maSP;
          this.loadSP( maSP);  
          this.getTotalSLBanVaSLTonKho(maSP);
          this.getEmailTK();
          this.loadCMT();
        }
      }
    })
  }
  getEmailTK(){
    this.inforService.getEmail()
    .subscribe(val=>{
      const emailFromToken = this.sanPhamService.getEmailFromToken();
      this.userEmail = val || emailFromToken;
      console.log(this.userEmail);
    });
  }

  loadSP(maSP: string){
    this.sanPhamService.getProduct(maSP).subscribe({
      next: (response) => {
        this.sanphamDetails = response;
      }
    });
  }

  loadCMT(){
    this.sanPhamService.getCMT(this.maSP2)
    .subscribe(response => {
      this.cmt = response;
    });
  }
  loadReplies(id: number){
    this.cmtReply = !this.cmtReply;
    if (this.cmtReply == true) {
      this.sanPhamService.getReplies(id).subscribe(
          response => {
            // Lưu dữ liệu phản hồi vào vị trí index trong CMTSs
            this.CMTSs = response;
          }
      );
    } else {
      // Nếu trạng thái tắt (ẩn), xóa dữ liệu phản hồi tại vị trí index
      this.CMTSs = [];
    }
  }
  openCMTs(){
    const dialogRef = this.dialog.open(TestComponent, {
      data: { // Dữ liệu muốn truyền
        email: this.userEmail,
        maSP: this.maSP2,
        tenSP: this.sanphamDetails.tenSP
      },
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => { 
        this.loadCMT();
      },
    });
  }
    submitCMT(){
      if(this.userEmail){
        this.sanPhamService.getName(this.userEmail).subscribe({
          next: (response) => {
            this.userName = response.name;
            console.log('test teenen',this.userName);
            if (this.addCMT.valid){
              this.addCMT.value.maSP = this.maSP2;
              this.addCMT.value.name = this.userName;
              this.addCMT.value.thoiGian = '2023-01-01';
              this.sanPhamService.addCMT(this.addCMT.value).subscribe({
                next: (val: any) => {
                  this.addCMT.reset();
                  this.loadCMT();
                  this.toast.success({detail:"SUCCESS", summary:"Thêm đánh giá thành công", duration: 5000});
                }    
              });
            } else{
              this.sanPhamService.validateAllFormFileds(this.addCMT);
            }
          } 
        });
      }
      else{
        this.toast.error({detail:"ERROR", summary:"Bạn cần đăng nhập để thực hiện chức năng này!", duration: 5000});
      }
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

  deleteSP(maSP: string){
    Swal.fire({
      title: "Xóa xoá sản phẩm này?",
      text: "Bạn sẽ không thể hoàn tác nếu thực hiện!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Thực hiện xóa!",
      cancelButtonText: "Hủy!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.sanPhamService.deleteProductKho(maSP).subscribe({
          next: (data) => {
            this.sanPhamService.deleteProduct(maSP).subscribe({
              next: (response) => {
                Swal.fire({
                  title: "Thay đổi!",
                  text: "Bạn đã xóa sản phẩm thành công.",
                  icon: "success"
                }).then((res) =>{
                  this.router.navigate(['/product']);
                });
              },
              error: (err) => {
                this.toast.error({detail:"ERROR", summary:err?.error.message, duration: 5000});
              }
            }); 
          }
        });
      }
    });
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
