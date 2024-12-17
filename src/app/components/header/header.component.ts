import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { InforService } from 'src/app/services/infor.service';
import { SanPhamService } from 'src/app/services/sanpham.service';

declare var require: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit{
  @ViewChildren('myslide') myslides!: QueryList<ElementRef> ;
  @ViewChildren('dot') dots!: QueryList<ElementRef>;
  counter: number = 1;
  timer: any; 
  searchQuery: string = '';
  userEmail: string = '';
  name: string = '';
  idUser: number = 0;
  gioHang: number = 0;
  shouldReloadHeader: boolean = false;

  constructor(private sanPhamService: SanPhamService,private inforService : InforService,) { }

  ngOnInit(): void {
    this.userEmail = this.sanPhamService.userEmailLoggedIn;
    this.loadIdUser();
    this.getNameTK();
    this.sanPhamService.reloadHeader$.subscribe(() => {
      this.reloadHeader();
    });
  }

  reloadHeader() {
    this.loadIdUser();
  }

  loadIdUser(){
    console.log("email: " +this.userEmail);
    this.sanPhamService.getID(this.userEmail).subscribe({
      next: (response) => {
        this.idUser = response;
        console.log(this.idUser);
        this.sanPhamService.getTotalQuantityByUserId(this.idUser).subscribe({
          next: (data) => {
            this.gioHang = data;
          }
        });
      }
    });
  }
  getNameTK(){
    this.inforService.getName()
    .subscribe(val=>{
      const nameFromToken = this.sanPhamService.getfullNameFromToken();
      this.name = val || nameFromToken;
    });
  }

  


  onSearch(query: string) {
    this.sanPhamService.updateSearchQuery(query);
  }
  
  logOut(){
    this.sanPhamService.logout();
  }

  ngAfterViewInit(): void {
    this.slidefun(this.counter);
    this.timer = setInterval(() => this.autoSlide(), 5000);
  }

  autoSlide() {
    this.counter += 1;
    this.slidefun(this.counter);
  }

  plusSlides(n: number) {
    this.counter += n;
    this.slidefun(this.counter);
    this.resetTimer();
  }

  currentSlide(n: number) {
    this.counter = n;
    this.slidefun(this.counter);
    this.resetTimer();
  }

  resetTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => this.autoSlide(), 5000);
  }

  slidefun(n: number) {
    this.myslides.toArray().forEach((slide, index) => {
      slide.nativeElement.style.display = "none";
      if (index === n - 1) {
        slide.nativeElement.style.display = "block";
      }
    });
    this.dots.toArray().forEach((dot, index) => {
      dot.nativeElement.classList.remove('active');
      if (index === n - 1) {
        dot.nativeElement.classList.add('active');
      }
    });
    if (n >= 3) {
      this.counter = 0;
    }
    if (n<1){
      this.counter = 3;
    }
  }
}
