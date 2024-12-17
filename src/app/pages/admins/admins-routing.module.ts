import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsComponent } from './statistics/statistics.component';
import { BrowseComponent } from './browse/browse.component';
import { ApprovedComponent } from './approved/approved.component';
import { DetailComponent } from './detail/detail.component';
import { VoucherAdminComponent } from './voucher-admin/voucher-admin.component';
import { CreateVoucherComponent } from './create-voucher/create-voucher.component';
import { UpdateVoucherComponent } from './update-voucher/update-voucher.component';

const routes: Routes = [
  {path: 'statistics', component: StatisticsComponent},
  {path: 'browse', component: BrowseComponent},
  {path: 'approved', component:  ApprovedComponent},
  {path: 'detail/:maHD', component: DetailComponent},
  {path: 'voucher-admin', component:  VoucherAdminComponent},
  {path: 'create-voucher', component:  CreateVoucherComponent},
  {path: 'update-voucher', component: UpdateVoucherComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminsRoutingModule { }
