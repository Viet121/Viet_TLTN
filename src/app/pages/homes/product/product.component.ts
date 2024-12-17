import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { SanPham } from 'src/app/models/sanpham';
import { SanPhamService } from 'src/app/services/sanpham.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateProductComponent } from '../create-product/create-product.component';
import { Subject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserForm } from 'src/app/models/userform';
import { SanPhamKho } from 'src/app/models/sanphamkho';
import { InforService } from 'src/app/services/infor.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy{
  sanphams: SanPhamKho[] = [];
  //tim kiem
  searchQuerySubscription: Subscription | undefined;
  currentQuery: string = '';
  //kiem tra quyen
  userEmail: string = '';
  userRole: string = '';
  public role!:string;
  //chon loc
  optionsSubscription: Subscription | undefined;
  options1: string [] = [];
  options2: string [] = [];
  options3: string [] = [];
  options4: string [] = [];

  user: UserForm = {
    id: 0,
    name: '',
    email: '',
    password: '',
    user_type: 'user',
  }
  gioiTinhFilter: string | null = null;
  tinhTrangFilter: string | null = null;

  totalRecords: number = 0; // Tổng số bản ghi
  page: number = 1;         // Trang hiện tại
  pageSize: number = 9;     // Số sp mỗi trang

  constructor(private route: ActivatedRoute,private sanPhamService: SanPhamService, private dialog: MatDialog,private fb: FormBuilder,private inforService : InforService){  }

  ngOnInit(): void {
    this.loadAllImage();
    this.loadSanPhams();
    this.getRoleTK();
    /*this.userEmail = this.sanPhamService.userEmailLoggedIn;
    console.log(this.userEmail);
    this.getRole(this.userEmail);*/
    this.route.queryParams.subscribe(params => {
      this.gioiTinhFilter = params['gioiTinh'] || null;
      this.tinhTrangFilter = params['tinhTrang'] || null;
      // Gọi hàm lọc sản phẩm theo điều kiện
      this.filterProducts();
    });

    this.searchQuerySubscription = this.sanPhamService.currentSearchQuery.subscribe(query => {
      this.fetchProducts(query);
    });
    this.optionsSubscription = this.sanPhamService.optionsUpdated.subscribe(data => {
      const array0 = data.array0;
      const array1 = data.array1;
      const array2 = data.array2;
      const array3 = data.array3;
      this.checkedProduct(array0,array1,array2,array3); // gia, chatlieu
    });
  }

  //URL
  filterProducts() {
    if (this.gioiTinhFilter) {
      this.sanPhamService.getProductsURLgioiTinh(this.gioiTinhFilter,this.page,this.pageSize).subscribe(response => {
        this.sanphams = response.data;
        this.totalRecords = response.totalRecords;
      });
    } else if (this.tinhTrangFilter) {
      this.sanPhamService.getProductsURLtinhTrang(this.tinhTrangFilter,this.page,this.pageSize).subscribe(response => {
        this.sanphams = response.data;
        this.totalRecords = response.totalRecords;
      });
    } else {
      // Hiển thị tất cả sản phẩm nếu không có điều kiện
      this.loadSanPhams();
    }
  }

  //ham get role cu khi chua co jwt
  getRole(email:string){
    this.sanPhamService.getRoleUser(email).subscribe({
      next: (response) => {
        this.user = response;
      }
    });
  }
  //ham get role moi khi co jwt
  getRoleTK(){
    this.inforService.getRole()
    .subscribe(val=>{
      const roleFromToken = this.sanPhamService.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }

  // theo doi ng dung xem co tim kiem hay loc sp ko
  ngOnDestroy() {
    this.searchQuerySubscription?.unsubscribe();
    this.optionsSubscription?.unsubscribe();
  }
  //ham tim kiem
  fetchProducts(query: string) {
    this.currentQuery = query;
    if (query) {
      this.sanPhamService.getSanPhamsByTenSPKho(query,this.page,this.pageSize).subscribe(response => {
        this.sanphams = response.data;
        this.totalRecords = response.totalRecords;
      });
    } else {
      this.loadSanPhams();
    }
  }
  //ham loc
  checkedProduct(trangThai: string[],kieuDang: string[], gia: string[],chatLieu: string[]){
    this.options1 = trangThai; this.options2 = kieuDang; this.options3 = gia; this.options4 = chatLieu;
    if (trangThai || kieuDang || gia || chatLieu){
      this.sanPhamService.getProducts(trangThai , kieuDang , gia , chatLieu,this.page,this.pageSize).subscribe(response => {
        this.sanphams = response.data;
        this.totalRecords = response.totalRecords;
      });
    }else {
      this.loadSanPhams();
    }
  }

  //ham load image
  loadAllImage(){
    this.sanPhamService.loadImage().subscribe({ 
      next: (val) => {
        console.log('load image ok');
    }  
    });
  }
  //ham load toan bo sp
  loadSanPhams(){
    //this.sanPhamService.getSanPhamKhos().subscribe((result: SanPham[]) => (this.sanphams = result));
    this.sanPhamService.getSanPhamKhos(this.page, this.pageSize).subscribe(response => {
        this.sanphams = response.data;
        this.totalRecords = response.totalRecords;
      });
  }

  // Xử lý sự kiện thay đổi trang
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;  // Cập nhật trang hiện tại
    this.pageSize = event.pageSize;  // Cập nhật số lượng mục mỗi trang
    if(this.gioiTinhFilter && this.gioiTinhFilter.trim() !== ''){
      this.filterProducts();
    }
    else if(this.tinhTrangFilter && this.tinhTrangFilter.trim() !== ''){
      this.filterProducts();
    }
    else if (this.currentQuery && this.currentQuery.trim() !== '') {
      // Nếu đang tìm kiếm, tải lại dữ liệu theo từ khóa tìm kiếm
      this.fetchProducts(this.currentQuery);
    } 
    else if((this.options1 && this.options1.length === 0) || (this.options2 && this.options2.length === 0) || (this.options3 && this.options3.length === 0) || (this.options4 && this.options4.length === 0)){
      this.checkedProduct(this.options1,this.options2,this.options3,this.options4);
    }
    else {
        // Nếu không tìm kiếm, tải lại danh sách sản phẩm mặc định
        this.loadSanPhams();
    }              
  }

  // ham them sp
  openAddProduct(){
    const dialogRef = this.dialog.open(CreateProductComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => { 
        if (val) {
          this.loadSanPhams();
        }
      },
    });
  }

}
