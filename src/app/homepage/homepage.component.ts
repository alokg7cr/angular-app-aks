import { Component, OnInit } from '@angular/core';
import { Injectable } from "@angular/core";
import{ProductService} from '../product.service';
import { Subscription,Subject } from "rxjs";
import{CartCountService} from '../cart-count.service'
import {MatSnackBar} from '@angular/material/snack-bar';
import{OrderService} from '../order.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
@Injectable({ providedIn: "root" })
export class HomepageComponent implements OnInit {
  private productdSub: Subscription;
  private cartNumberCount = new Subject<{cartNmbr:number}>();
  private cartProduct = new Subject<{cartProds:any}>();

  searchText;
  caouroselProduct;
  noProductFound=false;
  searchedProduct;
  allProductList;
  products =[];
  productInfo;
  cartNumber=0;
  cartProd=[];
  cartList;
  cartItems=[];
  constructor(
    public productService: ProductService,
    public cartCountService:CartCountService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.productService.getPosts();
    this.productdSub = this.productService
    .getProductUpdateListener()
    .subscribe((productData: { products: any }) => {
      // this.isLoading = false;
      console.log(productData.products);
      this.products = productData.products;
      this.caouroselProduct=productData.products;
      this.allProductList=productData.products;
    });
    let validateSessionStorage=JSON.parse(sessionStorage.getItem("inCartList"));
    if(validateSessionStorage !== null){
      for(let i=0;i<validateSessionStorage.length;i++){
        this.cartItems.push(validateSessionStorage[i]);
      }
    }
    console.log(validateSessionStorage);
    if(validateSessionStorage==null)
    {
    this.cartCountService.getCart()
    }

  }

  addToCart(details){
    this._snackBar.open(details.name,'Added Successfully in you Cart!!', {
      duration: 2000,
    });
  this.cartCountService.getCount();
    // let checkCartSession=JSON.parse(sessionStorage.getItem("inCartList"));
    // console.log(checkCartSession);  
    // if(checkCartSession!=null){
    // console.log(checkCartSession[0].cartProduct); 
    // checkCartSession[0].cartProduct.push(details);
    // console.log(details);
    // console.log(checkCartSession[0]);
    // sessionStorage.removeItem("inCartList");
    // sessionStorage.setItem("inCartList", JSON.stringify(checkCartSession));
    // }
    // else{

    let checkCartSession=JSON.parse(sessionStorage.getItem("inCartList"));
    console.log(checkCartSession);  
     
    if(checkCartSession!== null)
    {
      this.cartProd.length=0;
      for(let u=0;u<checkCartSession.cartProd.length;u++){
        this.cartProd.push(checkCartSession.cartProd[u]);
      }
      console.log(this.cartProd);
      this.cartProd.push(details);
      this.cartList={cartProd:this.cartProd}
      sessionStorage.setItem("inCartList", JSON.stringify(this.cartList));

    }
    else{
      this.cartProd.push(details);
      this.cartList={cartProd:this.cartProd}
      sessionStorage.setItem("inCartList", JSON.stringify(this.cartList));
    }
	

    
    // sessionStorage.setItem("inCartList", JSON.stringify(this.cartItems));
    // let chk=JSON.parse(sessionStorage.getItem("inCartList"));
    // console.log(chk);
    // console.log(chk.length);
    // this.cartNumber =this.cartNumber;
    // console.log(this.cartNumber);
    // this.cartNumberCount.next({
    //   cartNmbr: this.cartNumber+chk.length
    // });
    // this.cartProduct.next({
    //   cartProds: this.cartItems
    // });
  }
  getCartCountListener() {
    return this.cartNumberCount.asObservable();
  }
  getCartProductsListener() {
    return this.cartProduct.asObservable();
  }

  info(productInfo){
console.log(productInfo);
this.productInfo=productInfo;
  }


  search_product(a){
console.log(a.toUpperCase());
this.products=this.allProductList;
this.searchedProduct = this.products.filter(
  (val)=> val['name'].toUpperCase().includes(a.toUpperCase()))
//Searched Data
// this.products.length=0;
// this.products=[...this.searchedProduct]
console.log(this.searchedProduct);
this.products=this.searchedProduct;
if(this.products.length<=0){
this.noProductFound=true;
}
else{
  this.noProductFound=false;
}

  }
}
