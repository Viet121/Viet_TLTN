import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminsRoutingModule } from './admins-routing.module';
import { AdminComponent } from './admin/admin.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { NgChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { BrowseComponent } from './browse/browse.component';
import { ApprovedComponent } from './approved/approved.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DetailComponent } from './detail/detail.component';
import { VoucherAdminComponent } from './voucher-admin/voucher-admin.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { UpdateVoucherComponent } from './update-voucher/update-voucher.component';
import { CreateVoucherComponent } from './create-voucher/create-voucher.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { EmployeeComponent } from './employee/employee.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';



@NgModule({
  declarations: [
    AdminComponent,
    StatisticsComponent,
    BrowseComponent,
    ApprovedComponent,
    DetailComponent,
    VoucherAdminComponent,
    UpdateVoucherComponent,
    CreateVoucherComponent,
    EmployeeComponent,
    CreateEmployeeComponent
  ],
  imports: [
    CommonModule,
    AdminsRoutingModule,
    NgChartsModule,
    NgApexchartsModule,
    FormsModule,
    ComponentsModule,
    NgxPaginationModule,
    MatPaginatorModule,
    MatIconModule,
    BrowserModule,
    BrowserAnimationsModule, // Cần thiết để sử dụng Angular Material
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule
  ],
})
export class AdminsModule { }
