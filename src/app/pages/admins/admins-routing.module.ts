import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsComponent } from './statistics/statistics.component';
import { BrowseComponent } from './browse/browse.component';
import { ApprovedComponent } from './approved/approved.component';
import { DetailComponent } from './detail/detail.component';
import { VoucherAdminComponent } from './voucher-admin/voucher-admin.component';
import { CreateVoucherComponent } from './create-voucher/create-voucher.component';
import { UpdateVoucherComponent } from './update-voucher/update-voucher.component';
import { EmployeeComponent } from './employee/employee.component';
import { authGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {path: 'statistics', component: StatisticsComponent,canActivate:[authGuard], data: { roles: ['admin'] }}, 
  {path: 'browse', component: BrowseComponent,canActivate:[authGuard], data: { roles: ['admin'] }},
  {path: 'approved', component:  ApprovedComponent,canActivate:[authGuard], data: { roles: ['admin'] }},
  {path: 'detail/:maHD', component: DetailComponent,canActivate:[authGuard], data: { roles: ['admin'] }},
  {path: 'voucher-admin', component:  VoucherAdminComponent,canActivate:[authGuard], data: { roles: ['admin'] }},
  {path: 'create-voucher', component:  CreateVoucherComponent,canActivate:[authGuard], data: { roles: ['admin'] }},
  {path: 'update-voucher', component: UpdateVoucherComponent,canActivate:[authGuard], data: { roles: ['admin'] }},
  {path: 'employee',component: EmployeeComponent,canActivate:[authGuard], data: { roles: ['admin'] }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminsRoutingModule { }
