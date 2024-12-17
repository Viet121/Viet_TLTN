import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/homes/home/home.component';
import { LoginComponent } from './pages/logins/login/login.component';
import { SignUpComponent } from './pages/logins/sign-up/sign-up.component';
import { NotFoundComponent } from './pages/logins/not-found/not-found.component';
import { AddPassComponent } from './pages/logins/add-pass/add-pass.component';
import { ChangePassComponent } from './pages/logins/change-pass/change-pass.component';
import { ForgotComponent } from './pages/logins/forgot/forgot.component';

const routes: Routes = [
  {path:'',pathMatch: 'full',redirectTo: 'home'},
  {path: 'login', component: LoginComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'add-pass', component: AddPassComponent},
  {path: 'forgot', component: ForgotComponent},
  {path: 'change-pass', component: ChangePassComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
