import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { HomepageComponent } from "../homepage/homepage.component";
import { Router } from "@angular/router";
import{CartCountService} from '../cart-count.service';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {LogoutDialog} from './logout-dialog.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

const BACKEND_URL = "http://20.193.150.137:3011/api/cart";

// const BACKEND_URL = environment.apiUrl + "/cart";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  userIsAuthenticated = false;
  prodLst;
  cartProdlst=[];
  private authListenerSubs: Subscription;
  private cartNumber:Subscription;
  constructor(private authService: AuthService,
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,public cartCountService: HomepageComponent,
    public cartCout:CartCountService) { }
  badgecount=0;
  private cartNmbr: Subscription;
  private cartProdList: Subscription;
  private deletecartNmbr: Subscription;
  ngOnInit() {
    console.log('dyusddsdsj');
    
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
     this.cartNumber=this.cartCout.getCartCountUpdateListener().subscribe(a=>{
       console.log(a);
       if(a.count==0){
        this.badgecount=0;
       }
       else{
        this.badgecount=this.badgecount+a.count;

       }
     })

     this.deletecartNmbr=this.cartCout.getDeleteCartCountUpdateListener().subscribe(b=>{
      console.log(b);
      this.badgecount=this.badgecount-b.deletecount;
    })
    let checkCartSessionCount=JSON.parse(sessionStorage.getItem("inCartList"));
    console.log(checkCartSessionCount);
    if(checkCartSessionCount!=null && checkCartSessionCount.cartProd.length>0){
    console.log(checkCartSessionCount.cartProd.length); 
    this.badgecount=checkCartSessionCount.cartProd.length;
    }
  }

  onLogout() {
 
    const dialogRef = this.dialog.open(LogoutDialog,{
      data:{
        message: 'Do you really want to Logout!!',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });
  
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log(confirmed);
        

    console.log('in svsusa');
    console.log(this.cartCout.checkCartBoolean);
    let chkCartProd=JSON.parse(sessionStorage.getItem("inCartList"));
    console.log(chkCartProd);
    if(chkCartProd!==null){
    let chkCartUserId=sessionStorage.getItem("userId");
    console.log(chkCartUserId);
    let cartId =JSON.parse(sessionStorage.getItem("cartId"));
    let storeInCartDb={id:cartId,userId:chkCartUserId,cartProduct:chkCartProd}
    console.log(storeInCartDb);
    console.log(cartId);
    
      
    if(this.cartCout.checkCartBoolean==false){
      this.http
        .post<{ message: string }>(
          BACKEND_URL,
          storeInCartDb
        )
        .subscribe(responseData => {
         console.log(responseData);
        });
      }
      else{
        console.log('sdhsdhjdsjksd');
        
        this.http
        .put(BACKEND_URL +'/updateCart/'+ cartId, storeInCartDb).subscribe(response =>{
          console.log(response);
          
        })
      }
      }
    this.authService.logout();
      }
    })




  }


  cartProductsList(){
    // if(this.prodLst!==undefined){
    // let inCartItem=[];
    // inCartItem.push(this.prodLst)
    // console.log(this.prodLst.cartProds);
    // console.log(sessionStorage.getItem("inCartList"));
    //sessionStorage.setItem("inCartList", JSON.stringify(this.prodLst.cartProds));

    this.router.navigate(["/cartdetails"]);
    

  }
  orderDetail(){
    this.router.navigate(["/orderdetail"]);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    

 this.cartNumber.unsubscribe();

  }
}
