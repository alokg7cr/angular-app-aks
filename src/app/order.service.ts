import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../environments/environment";

// http://20.193.148.66:3012/api/order/getOrders/5f590da6c9b9ad00136a54fb

const BACKEND_URL = "http://20.193.148.66:3012/api/order";

@Injectable({ providedIn: "root" })

export class OrderService {
    private products = [];
    private productsUpdated = new Subject<{ products:any }>();
    private orderPlacedCheck=false;

    constructor(private http: HttpClient, private router: Router) {}

    
  getOrderedPlacedStatus() {
    return this.orderPlacedCheck;
  }

    placeOrder():Observable<any>{
        let orderedProd=JSON.parse(sessionStorage.getItem("inCartList"));
        console.log(orderedProd);
        let chkCartUserId=sessionStorage.getItem("userId");
        console.log(chkCartUserId);
        let cartId =JSON.parse(sessionStorage.getItem("cartId"));
        let storeInCartDb={userId:chkCartUserId,orderedProduct:orderedProd};
        console.log(storeInCartDb);
        return this.http
        .post<{ message: string }>(
          BACKEND_URL,
          storeInCartDb
        )

    }


    getOderedProd():Observable<any> {
        let sendUserId=sessionStorage.getItem("userId");
        console.log(sendUserId);
       return this.http
          .get<{ message: string; cartList: any}>(
            BACKEND_URL+'/getOrders/'+sendUserId
          )
      }
   
  }
  