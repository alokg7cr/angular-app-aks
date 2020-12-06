import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../environments/environment";

// http://20.193.150.137:3011/api/cart/getCart

const BACKEND_URL = "http://20.193.150.137:3011/api/cart";

@Injectable({ providedIn: "root" })

export class CartCountService {
    private cartCountUpdated = new Subject<{ count:number }>();
    private deleteCartCountUpdated = new Subject<{ deletecount:number }>();
    constructor(private http: HttpClient, private router: Router) {}

    cartCout=0;
    deleteCount=0;
   checkCartBoolean;

   getCount(){
       this.cartCout=1;
    this.cartCountUpdated.next({
        count: this.cartCout,
      });
   }

   getdeleteCount(){
    this.deleteCount=1;
 this.deleteCartCountUpdated.next({
     deletecount: this.deleteCount,
   });
}

removeCartCount(){
  this.cartCountUpdated.next({
    count: 0,
  });
}


    getCartCountUpdateListener() {
        return this.cartCountUpdated.asObservable();
      }
      getDeleteCartCountUpdateListener() {
        return this.deleteCartCountUpdated.asObservable();
      }

      getCart() {
        this.checkCartBoolean=false;
        let sendUserId=sessionStorage.getItem("userId");
        console.log(sendUserId);
        this.http
          .get<{ message: string; cartList: any}>(
            BACKEND_URL+'/getCart/'+sendUserId
          )
          .subscribe(transformedProductData => {
              console.log(transformedProductData);
              let loggedInUserId=sessionStorage.getItem("userId");
              console.log(loggedInUserId);
              console.log(transformedProductData.cartList);
              console.log(transformedProductData.cartList.length);
              console.log(this.checkCartBoolean);
              //console.log(transformedProductData.cartList[0].cartProduct.cartProd.length);
              if(transformedProductData.cartList.length>0)
              {
                sessionStorage.setItem("cartId", JSON.stringify(transformedProductData.cartList[0]._id));
                this.checkCartBoolean=true;
              if(transformedProductData.cartList[0].cartProduct.cartProd.length>0)
              {
             
              if(loggedInUserId == transformedProductData.cartList[0].userId)
              {
                console.log('innn check cart');
                
                console.log(transformedProductData.cartList[0].cartProduct);
                console.log(transformedProductData.cartList[0].cartProduct.length);
                this.cartCountUpdated.next({
                  count: transformedProductData.cartList[0].cartProduct.cartProd.length,
                });
                sessionStorage.setItem("inCartList", JSON.stringify(transformedProductData.cartList[0].cartProduct));

              }
            }
          }
          },error=>{
            console.log(error);
          }
          );
      }

      getProdCount(){
        let checkCartSession=JSON.parse(sessionStorage.getItem("inCartList"));
        let currentCount=checkCartSession.cartProduct.length;
        console.log(currentCount);
        this.cartCountUpdated.next({
          count: currentCount
        });
      }


      onPlaceOrder(cartId,storeInCartDb){
        console.log(cartId);
        console.log(storeInCartDb);
        
        this.http
        .put(BACKEND_URL +'/updateCart/'+ cartId, storeInCartDb).subscribe(response =>{
          console.log(response);
          
        })
      }

}