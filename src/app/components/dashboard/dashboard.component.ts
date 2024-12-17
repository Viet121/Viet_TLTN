import { Component } from '@angular/core';
import { SanPhamService } from 'src/app/services/sanpham.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  treeArray!: boolean[];
  labelTreeArray!: boolean[][];

  constructor(private sanPhamService: SanPhamService,){
    this.treeArray = Array(7).fill(true);
    const rows = 4; // Số hàng 
    const cols = 12; // Số cột 
    this.labelTreeArray = Array(rows).fill(null).map(() => Array(cols).fill(false));
  }

  toggleLabelColor(index: number) {
    this.treeArray[index] = !this.treeArray[index];
  }
  toggleLabelChecked(index1: number,index2: number) {
    this.labelTreeArray[index1][index2] = !this.labelTreeArray[index1][index2];
  }

  onSubmit() {
    let trangThaiValues: string[] = [];
    let kieuDangValues: string[]= [];
    let chatLieuValues: string[] = [];
    let giaValues: string[] = [];
  
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 12; j++) {
        if (this.labelTreeArray[i][j]) {
          if(i==0){
            trangThaiValues.push(this.getValue(i, j));
          }
          else if(i==1){
            kieuDangValues.push(this.getValue(i, j));
          }
          else if(i==2){
            giaValues.push(this.getValue(i, j)); 
          }
          else if(i==3){
            chatLieuValues.push(this.getValue(i, j));
          }
        }
      }
    }
    
    console.log("Chat lieu san pham:", chatLieuValues);
    console.log("Chat lieu gia:", giaValues);
    const dataToSend = { array0: trangThaiValues, array1: kieuDangValues, array2: giaValues, array3:chatLieuValues };
    // Gửi dữ liệu lựa chọn cho sản phẩm component
    this.sanPhamService.optionsUpdated.next(dataToSend);
    
  }
  
  getValue(mainIndex: number, subIndex: number): string {
    // Xác định giá trị của checkbox dựa trên mainIndex và subIndex
    if (mainIndex === 0) {
      if (subIndex === 0) {
        return "limited-edition";
      } else if (subIndex === 1) {
        return "online-only";
      } else if (subIndex === 2) {
        return "sale-off";
      } else if (subIndex === 3) {
        return "new-arrival";
      }
    } else if (mainIndex === 1) {
      if (subIndex === 0) {
        return "low-top";
      } else if (subIndex === 1) {
        return "hight-top";
      } else if (subIndex === 2) {
        return "slip-on";
      } else if (subIndex === 3) {
        return "mid-top";
      } else if (subIndex === 4) {
        return "mule";
      }
    } else if (mainIndex === 2) {
      if (subIndex === 0) {
        return "> 600";
      } else if (subIndex === 1) {
        return "BETWEEN 500 AND 599";
      } else if (subIndex === 2) {
        return "BETWEEN 400 AND 499";
      } else if (subIndex === 3) {
        return "BETWEEN 300 AND 399";
      } else if (subIndex === 4) {
        return "BETWEEN 200 AND 299";
      } else if (subIndex === 5) {
        return "< 200";
      }
    } else if (mainIndex === 3) {
      if (subIndex === 0) {
        return "canvas";
      } else if (subIndex === 1) {
        return "suede-dalon";
      } else if (subIndex === 2) {
        return "leather-da";
      } else if (subIndex === 3) {
        return "cotton";
      } else if (subIndex === 4) {
        return "taslan";
      } else if (subIndex === 5) {
        return "knit";
      } else if (subIndex === 6) {
        return "ripstop";
      } else if (subIndex === 7) {
        return "single-jerey";
      } else if (subIndex === 8) {
        return "flannel";
      } else if (subIndex === 9) {
        return "acrylic";
      } else if (subIndex === 10) {
        return "corduroy";
      } else if (subIndex === 11) {
        return "polyester";
      }
    }
  
    return ""; // Trường hợp mặc định, không phù hợp
  }
  
}
