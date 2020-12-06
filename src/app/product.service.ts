import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../environments/environment";

// http://20.193.249.136:3017/api/products/details

const BACKEND_URL = "http://20.193.249.136:3017/api/products";

@Injectable({ providedIn: "root" })

export class ProductService {
    private products = [];
    private productsUpdated = new Subject<{ products:any }>();

    constructor(private http: HttpClient, private router: Router) {}
  
    getPosts() {
      this.http
        .get<{ message: string; productsList: any}>(
          BACKEND_URL+ "/details",
        )
        .pipe(
          map(productData => {
            return {
              products: productData.productsList.map(productsList => {
                return {
                  name: productsList.poductName,
                  price: productsList.price,
                  id: productsList._id,
                  productDescription: productsList.productDescription,
                  imagePath: productsList.imageUrl,
                  quantity: productsList.stockQuantity
                };
              }),
            };
          })
        )
        .subscribe(transformedProductData => {
            console.log(transformedProductData);
            this.products = transformedProductData.products
            this.productsUpdated.next({
                products: [...this.products],
              });
          
        },error=>{
          console.log(error);
        }
        );
    }
    getProductUpdateListener() {
        return this.productsUpdated.asObservable();
      }
   
  }
  