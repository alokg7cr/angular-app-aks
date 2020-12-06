import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "../app/auth/login/login.component";
import { SignupComponent } from "../app/auth/signup/signup.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { AuthGuard } from "./auth.guard";
import { CartDetailsComponent } from "./cart-details/cart-details.component";
import { OrderDetailsComponent } from './order-details/order-details.component';





const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "homepage", component: HomepageComponent,canActivate: [AuthGuard] },
  { path: "cartdetails", component: CartDetailsComponent,canActivate: [AuthGuard] },
{path:"orderdetail",component: OrderDetailsComponent,canActivate: [AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
