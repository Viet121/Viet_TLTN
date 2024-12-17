import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    DashboardAdminComponent
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    FormsModule,
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    DashboardAdminComponent
  ]
})
export class ComponentsModule { }
