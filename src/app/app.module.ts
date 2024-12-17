import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentsModule } from './components/components.module';
import { HomesModule } from './pages/homes/homes.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import { NgToastModule } from 'ng-angular-popup';
import { LoginComponent } from './pages/logins/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './pages/logins/sign-up/sign-up.component';
import { NotFoundComponent } from './pages/logins/not-found/not-found.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AddPassComponent } from './pages/logins/add-pass/add-pass.component';
import { BackLoginComponent } from './pages/logins/back-login/back-login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ForgotComponent } from './pages/logins/forgot/forgot.component';
import { ChangePassComponent } from './pages/logins/change-pass/change-pass.component';
import { AdminsModule } from './pages/admins/admins.module';
import { NgChartsModule } from 'ng2-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    NotFoundComponent,
    AddPassComponent,
    BackLoginComponent,
    ForgotComponent,
    ChangePassComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ComponentsModule,
    HttpClientModule,
    HomesModule,
    AdminsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    NgToastModule,
    ReactiveFormsModule,
    NgChartsModule,
    NgxPaginationModule,
    MatPaginatorModule
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,
      useClass:TokenInterceptor,
      multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
