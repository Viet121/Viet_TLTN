import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { SanPhamService } from 'src/app/services/sanpham.service';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTitleSubtitle, ApexStroke, ApexGrid } from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit{
  barChartData: any;
  barChartOptions: any;

  currentYear: number = new Date().getFullYear(); // Năm hiện tại
  years: number[] = []; // Danh sách các năm
  selectedYear: number = this.currentYear; // Năm được chọn


  //line
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};
  //

  constructor(private productService: SanPhamService) {
    this.chartOptions = {
      series: [
        {
          name: "Monthly Revenue",
          data: [] , // Dữ liệu sẽ được cập nhật từ API
        },
      ],
      chart: {
        height: 350,
        type: "line", // Đây là thuộc tính bắt buộc
        zoom: { enabled: false },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "",
        align: "left",
        style: {
          fontSize: "20px", // Kích thước phông chữ
          fontWeight: "bold", // Độ đậm của chữ
          fontFamily: "Arial, sans-serif", // Tên phông chữ
          color: "#333", // Màu chữ
        },
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ], // Các tháng trong năm
      },
    };
  }

  ngOnInit(): void {
    this.years = this.getYears(2020, this.currentYear);
    this.loadChartData();
    this.loadMonthlyRevenue(this.selectedYear);
  }

  loadChartData(): void {
    this.productService.getTopSellingProducts().subscribe({
      next: (data) => {
        const labels = data.map((item) => item.tenSanPham);
        const values = data.map((item) => item.tongSoLuongBan);

        this.barChartData = {
          labels: labels,
          datasets: [
            {
              label: 'Số lượng bán',
              data: values,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            },
          ],
        };

        this.barChartOptions = {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        };
      },
      error: (err) => console.error(err),
    });
  } // ket thuc bd cot

  getYears(startYear: number, endYear: number): number[] {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  }

  //bat dau bd duong
  loadMonthlyRevenue(year: number): void {
    this.productService.getMonthlyRevenue(year).subscribe({
      next: (data: number[]) => {
        this.chartOptions.series = [
          {
            name: "Monthly Revenue",
            data: data , // Gán dữ liệu trả về từ API
          },
        ];
      },
      error: (err) => {
        console.error("Lỗi khi lấy dữ liệu doanh thu theo tháng:", err);
      },
    });
  }

}
