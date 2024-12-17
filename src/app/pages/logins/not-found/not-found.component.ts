import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  constructor( private notFoundService : SanPhamService,private router: Router){}
  logOut(){
    this.notFoundService.logout();
  }
}
