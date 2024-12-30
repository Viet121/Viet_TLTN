import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ReadProductAdminComponent } from './read-product-admin/read-product-admin.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { ReadProductUserComponent } from './read-product-user/read-product-user.component';
import { YourCartComponent } from './your-cart/your-cart.component';
import { ShippingInformationComponent } from './shipping-information/shipping-information.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { OrderComponent } from './order/order.component';
import { DetailUserComponent } from './detail-user/detail-user.component';
import { VoucherComponent } from './voucher/voucher.component';
import { ConfirmPaymentComponent } from './confirm-payment/confirm-payment.component';
import { VnpayReturnComponent } from './vnpay-return/vnpay-return.component';
import { TestComponent } from './test/test.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path:'product', component:ProductComponent},
  {path:'create-product', component:CreateProductComponent,canActivate:[authGuard], data: { roles: ['admin'] }},
  {path:'read-product-admin/:maSP', component:ReadProductAdminComponent,canActivate:[authGuard], data: { roles: ['admin'] }},
  {path:'update-product/:maSP', component:UpdateProductComponent,canActivate:[authGuard], data: { roles: ['admin'] }},
  {path:'read-product-user/:maSP', component:ReadProductUserComponent},
  {path:'your-cart', component:YourCartComponent},
  {path:'shipping-information', component:ShippingInformationComponent},
  {path: 'order', component: OrderComponent},
  {path: 'detail-user/:maHD', component: DetailUserComponent},
  {path: 'voucher', component: VoucherComponent},
  {path: 'confirm-payment', component: ConfirmPaymentComponent},
  { path: 'vnpay-return', component: VnpayReturnComponent },
  { path: 'test', component: TestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomesRoutingModule { }
