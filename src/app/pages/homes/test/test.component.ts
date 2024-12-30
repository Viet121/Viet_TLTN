import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CMT } from 'src/app/models/cmt';
import { CMTS } from 'src/app/models/cmts';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit{

  userName!: string;
  jrole!: string;

  adReply: boolean[] = []; // Mảng trạng thái để kiểm soát hiển thị của từng comment
  comments = Array(6).fill(0); // Tạo mảng giả để lặp qua 6 bình luận

  cmtReply: boolean[] = [];

  addCMT: FormGroup;
  addReply: FormGroup;

  CMTs: CMT[] = [];
  CMTSs: CMTS[][] = [];
  cmt: CMT = {
    id: 0,
    maSP: '',
    name: '',
    noiDung: '',
    thoiGian: '2023-01-01',
    replyCount: 0,
  }
  
  totalRecords: number = 0; // Tổng số bản ghi
  page: number = 1;         // Trang hiện tại
  pageSize: number = 6;     // Số hóa đơn mỗi trang
  

  constructor(
    private fb: FormBuilder,
    private cmtService: SanPhamService,
    private toast: NgToastService, 
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any, // Nhận dữ liệu
    private dialogRef: MatDialogRef<TestComponent>
  ) {
    // Khởi tạo trạng thái adReply ban đầu cho từng bình luận
    this.adReply = this.comments.map(() => false);
    this.cmtReply = this.comments.map(() => false);
    this.addCMT = this.fb.group({
      id: 0,
      maSP: '',
      name: '',
      noiDung: ['', Validators.required],
      thoiGian: '2023-01-01',
    });
    this.addReply = this.fb.group({
      id: 0,
      idCmt: 0,
      name: '',
      noiDung: ['', Validators.required],
      thoiGian: '2023-01-01',
    });
  }

  ngOnInit(): void {
    this.loadRole();
    this.loadCMTs();
  }

  loadRole(){
    this.cmtService.getJRolo(this.data.email).subscribe(response => {
      this.jrole = response.role;
    });
  }
  closeDialog() {
    this.dialogRef.close(true); // Đóng dialog và gửi dữ liệu về
  }

  replyCmt(index: number) {
    // Chuyển đổi trạng thái adReply của bình luận được click
    this.adReply[index] = !this.adReply[index];
  }
  sendReply(index: number) {
    // Chuyển đổi trạng thái adReply của bình luận được click
    this.cmtReply[index] = !this.cmtReply[index];
  }


  loadCMTs(){
    this.cmtService.getCMTsPage(this.data.maSP, this.page, this.pageSize)
    .subscribe(response => {
      this.CMTs = response.data;
      this.totalRecords = response.totalRecords;
    });
  }

  loadReplies(id: number,index: number){
    this.cmtReply[index] = !this.cmtReply[index];
    if (this.cmtReply[index] == true) {
      this.cmtService.getReplies(id).subscribe(
          response => {
              // Lưu dữ liệu phản hồi vào vị trí index trong CMTSs
              this.CMTSs[index] = response;
          }
      );
    } else {
      // Nếu trạng thái tắt (ẩn), xóa dữ liệu phản hồi tại vị trí index
      this.CMTSs[index] = [];
    }
  }
  
  submitCMT(){
    if(this.data.email){
      this.cmtService.getName(this.data.email).subscribe({
        next: (response) => {
          this.userName = response.name;
          console.log('test teenen',this.userName);
          if (this.addCMT.valid){
            this.addCMT.value.maSP = this.data.maSP;
            this.addCMT.value.name = this.userName;
            this.addCMT.value.thoiGian = '2023-01-01';
            this.cmtService.addCMT(this.addCMT.value).subscribe({
              next: (val: any) => {
                this.addCMT.reset();
                this.loadCMTs();
                this.toast.success({detail:"SUCCESS", summary:"Thêm đánh giá thành công", duration: 5000});
              }    
            });
          } else{
            this.cmtService.validateAllFormFileds(this.addCMT);
          }
        } 
      });
    }
    else{
      this.toast.error({detail:"ERROR", summary:"Bạn cần đăng nhập để thực hiện chức năng này!", duration: 5000});
    }
  }
  submitReply(id: number, index: number){
    if (this.addReply.valid){
      this.addReply.value.idCmt = id;
      this.addReply.value.name = 'Nhân viên';
      this.addReply.value.thoiGian = '2023-01-01';
      this.cmtService.addReply(this.addReply.value).subscribe({
        next: (val: any) => {
          this.addReply.reset();
          this.loadCMTs();
          this.loadReplies(id, index);
          this.toast.success({detail:"SUCCESS", summary:"Trả lời thành công", duration: 5000});
        }    
      });
    } else{
      this.cmtService.validateAllFormFileds(this.addReply);
    }
  }

  onPageChange(event: PageEvent): void {
      this.page = event.pageIndex + 1;  // Cập nhật trang hiện tại
      this.pageSize = event.pageSize;  // Cập nhật số lượng mục mỗi trang
      this.loadCMTs();              // Tải lại dữ liệu theo trang mới
  }

  // ham get 1 ở trang chi tiết sp
  // ham post gửi cmt sp
  // ham get 6 theo trang nhung ở dialog


}
