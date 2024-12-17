import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import { HomesRoutingModule } from './homes-routing.module';
import { HomeComponent } from './home/home.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ProductComponent } from './product/product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { ReadProductAdminComponent } from './read-product-admin/read-product-admin.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { ReadProductUserComponent } from './read-product-user/read-product-user.component';
import { YourCartComponent } from './your-cart/your-cart.component';
import { ShippingInformationComponent } from './shipping-information/shipping-information.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderComponent } from './order/order.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DetailUserComponent } from './detail-user/detail-user.component';
import { VoucherComponent } from './voucher/voucher.component';

@NgModule({
  declarations: [
    HomeComponent,
    ProductComponent,
    CreateProductComponent,
    ReadProductAdminComponent,
    UpdateProductComponent,
    ReadProductUserComponent,
    YourCartComponent,
    ShippingInformationComponent,
    OrderComponent,
    DetailUserComponent,
    VoucherComponent,
  ],
  imports: [
    CommonModule,
    HomesRoutingModule,
    ComponentsModule,
    FormsModule, 
    MatDialogModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxPaginationModule,
    MatPaginatorModule
  ]
})
export class HomesModule { }
