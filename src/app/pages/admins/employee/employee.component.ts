import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgToastService } from 'ng-angular-popup';
import { UserForm } from 'src/app/models/userform';
import { SanPhamService } from 'src/app/services/sanpham.service';
import * as XLSX from 'xlsx';
import { CreateEmployeeComponent } from '../create-employee/create-employee.component';
import Swal from 'sweetalert2';
import { InforService } from 'src/app/services/infor.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit{
  selectedFile: File | undefined;
  users: UserForm[] = [];
  user: UserForm = {
    id: 0,
    name: '',
    email: '',
    password: '',
    user_type: 'user',
  }
  userEmail!: string;
  
  totalRecords: number = 0; // Tổng số bản ghi
  page: number = 1;         // Trang hiện tại
  pageSize: number = 10;     // Số hóa đơn mỗi trang

  type: string = 'admin';
  dataSource = new MatTableDataSource<UserForm>(); // Sử dụng MatTableDataSource để quản lý dữ liệu
  displayedColumns: string[] = ['name', 'email', 'actions'];
  constructor(
    private sanPhamService: SanPhamService,
    private toast: NgToastService,
    private dialog: MatDialog,
    private inforService: InforService,
  ){}
  ngOnInit(): void {
    this.inforService.getEmail().subscribe({
      next: (val) => {
        const emailFromToken = this.sanPhamService.getEmailFromToken();
        this.userEmail = val || emailFromToken;
        console.log(this.userEmail);
        this.loadEmployees(); // Gọi hàm loadEmployees sau khi xử lý xong email
      },
      error: (err) => {
        console.error('Lỗi khi lấy email:', err);
      }
    });
  }
  

  loadEmployees(){
    if(this.userEmail == 'viet@gmail.com'){
      this.sanPhamService.getEmployeesPage(this.type, this.page, this.pageSize).subscribe(response => {
        this.dataSource.data = response.data; // Gán dữ liệu vào dataSource
        this.totalRecords = response.totalRecords; // Lấy tổng số bản ghi
      });
    }
  }
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;  // Cập nhật trang hiện tại
    this.pageSize = event.pageSize;  // Cập nhật số lượng mục mỗi trang
    this.loadEmployees();             
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  } 

  importData(): void {
    if (this.selectedFile) {
      if (!this.selectedFile.name.endsWith('.xlsx')) {
        this.toast.error({ detail: "ERROR", summary: "File không hợp lệ", duration: 5000 });
        return;
      }
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        try{
          // Chuyển đổi nội dung file từ ArrayBuffer sang Uint8Array
          const data = new Uint8Array(e.target.result);
          // Đọc dữ liệu Excel từ Uint8Array
          const workbook = XLSX.read(data, { type: 'array' });
          // Lấy tên sheet đầu tiên
          const sheetName = workbook.SheetNames[0];
          // Lấy dữ liệu từ sheet
          const worksheet = workbook.Sheets[sheetName];
          // Chuyển đổi dữ liệu Excel thành mảng JSON
          const dataArray: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          this.sanPhamService.importNhanVienData(this.convertArrayToNhanVienModel(dataArray)).subscribe({
            next: (res) => {
              this.loadEmployees();
              this.toast.success({detail:"SUCCESS", summary:"Thêm nhân viên thành công", duration: 5000});
              console.log(res);
            },
            error: (error) => {
              this.toast.error({detail:"ERROR", summary:"Thêm nhân viên thất bại", duration: 5000});
              console.error(error);
            }
          });
        } catch (err) {
          this.toast.error({ detail: "ERROR", summary: "Đọc file thất bại", duration: 5000 });
          console.error(err);
        }
      };
      reader.readAsArrayBuffer(this.selectedFile);
    } else{
      this.toast.error({ detail: "ERROR", summary: "Vui lòng chọn file trước khi import", duration: 5000 });
    }
  }
  
  convertArrayToNhanVienModel(data: any[]): UserForm[] {
    const userData: UserForm[] = [];
    for (let i = 1; i < data.length; i++) { 
      const userModel: UserForm = {
        id: data[i][0],
        name: data[i][1],
        email: data[i][2],
        password: data[i][3],
        user_type: data[i][4],
      };
      userData.push(userModel);
    }
    return userData;
  }

  openAddProduct(){
    const dialogRef = this.dialog.open(CreateEmployeeComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => { 
        if (val) {
          this.loadEmployees();
        }
      },
    });
  }

  openUpdateProduct(email: string){
    Swal.fire({
      title: "Xóa quyền nhân viên?",
      text: "Bạn sẽ không thể hoàn tác nếu thực hiện!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Thực hiện thay đổi!",
      cancelButtonText: "Hủy thay đổi!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.user.email = email;
        this.sanPhamService.updateType(this.user) 
        .subscribe({
          next: (response) => {
            Swal.fire({
              title: "Thay đổi!",
              text: "Bạn đã đổi quyền thành công.",
              icon: "success"
            }).then((res) =>{
              this.loadEmployees();
            });
          },
          error: (err) => {
            this.toast.error({detail:"ERROR", summary:err?.error.message, duration: 5000});
          }
        });
      }
    });
  }
  

}
