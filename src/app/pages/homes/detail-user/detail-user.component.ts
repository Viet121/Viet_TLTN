import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CTHoaDonSanPham } from 'src/app/models/cthoadonsanpham';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.css']
})
export class DetailUserComponent implements OnInit{

  maHDURL: string | null = null;
  chiTietHDs: CTHoaDonSanPham[] = [];

  constructor(
    private gioHangService: SanPhamService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.maHDURL = this.route.snapshot.paramMap.get('maHD'); 
    this.loadCTHD(this.maHDURL!);
  }
  loadCTHD(maHD:string): void {
    this.gioHangService.getCTDHadmin(maHD)
      .subscribe(datas => {
        this.chiTietHDs = datas;
      });
  }

}
