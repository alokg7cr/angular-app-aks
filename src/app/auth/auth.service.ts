import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import {MatSnackBar} from '@angular/material/snack-bar';

import { environment } from "../../environments/environment";
import { AuthData } from "./auth-data.model";
import {ErrorService} from "../error/error.service"

// http://20.193.153.219:3016/api/user/login

const BACKEND_URL = "http://20.193.153.219:3016/api/user";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient,private _snackBar: MatSnackBar, private router: Router,private error:ErrorService) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    console.log(BACKEND_URL);
    const authData: AuthData = { email: email.toUpperCase(), password: password };
    console.log(authData);
    this.http.post(BACKEND_URL + "/signup", authData).subscribe(
      () => {

            this._snackBar.open('registered successfully!!',authData.email, {
              duration: 6000,
            });
        this.router.navigate(["/"]);
      },
      error => {
          console.log(error.error.message);
          this._snackBar.open('Error Ocurred!!',error.error.message, {
            duration: 6000,
          });
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email.toUpperCase(), password: password };
    this.error.getLoggedUser(null);
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + "/login",
        authData
      )
      .subscribe(
        response => {
            console.log(response);
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(["/homepage"]);
          }
        },
        error => {
            console.log(error);
                this._snackBar.open('Error Ocurred!!',error.error.message, {
                  duration: 6000,
                })
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
      console.log('in auto auth');
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer in minutes: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("expiration", expirationDate.toISOString());
    sessionStorage.setItem("userId", userId);
    this.error.getLoggedUser(userId);
  }

  private clearAuthData() {

    sessionStorage.removeItem("cartId");
    sessionStorage.removeItem("inCartList");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiration");
    sessionStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = sessionStorage.getItem("token");
    const expirationDate = sessionStorage.getItem("expiration");
    const userId = sessionStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
