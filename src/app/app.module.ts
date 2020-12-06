import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HttpClientModule ,HTTP_INTERCEPTORS} from "@angular/common/http";
import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './auth/signup/signup.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { LoaderComponent } from './loader/loader.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthInterceptor } from "./auth-interceptor";
import {MatBadgeModule} from '@angular/material/badge';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartDetailsComponent } from './cart-details/cart-details.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import {DeleteDialog} from './cart-details/delete-dialog.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import {ConfirmDialog} from './cart-details/confirm-dialog.component';
import {LogoutDialog} from './header/logout-dialog.component';
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from "./error/error.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    HeaderComponent,
    SignupComponent,
    LoaderComponent,
    HomepageComponent,
    CartDetailsComponent,
    DeleteDialog,
    OrderDetailsComponent,
    ConfirmDialog,
    LogoutDialog

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatSnackBarModule,
    FormsModule,
    MatDialogModule,
    HttpClientModule,
    NgbModule,
    MatBadgeModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }

  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]


})
export class AppModule { }
