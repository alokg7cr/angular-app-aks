import { Component, OnInit,OnDestroy } from '@angular/core';
import { Subscription,Observable } from "rxjs";
import { HomepageComponent } from "../homepage/homepage.component";
import { ActivatedRoute, ParamMap } from "@angular/router";
import {
  Router
} from "@angular/router";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import{CartCountService} from '../cart-count.service';
import {DeleteDialog} from './delete-dialog.component';
import {ConfirmDialog} from './confirm-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import{OrderService} from '../order.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
  private cartProductList;
  prodList;
  isLoading=false;
  private state$: Observable<object>;
chk;
checkOutProd;
amountTobePaid;
productCount;
checkOutBtn=false;
  constructor(private dialog: MatDialog,
    public cartService: HomepageComponent,
    private _snackBar: MatSnackBar,
    public CartCount:CartCountService ,
    public route: ActivatedRoute,private activateRouter:ActivatedRoute,
    public ProdOrderService:OrderService,
    public router: Router) { }

  ngOnInit(): void {
    console.log(this.ProdOrderService.getOrderedPlacedStatus());
    let prodListession;
    prodListession=JSON.parse(sessionStorage.getItem("inCartList"));
    console.log(prodListession);
    console.log(this.prodList);
    if(prodListession!== null){
      this.prodList=prodListession.cartProd;
     if(this.prodList.length>0){
       this.checkOutBtn=true;
    }
  }
    // this.route.queryParamMap.subscribe(params => this.chk = params.getAll('words'));
    // console.log(JSON.parse( this.chk[0]));

    // const queryParamMap = this.route.snapshot['queryParamMap'];
    // console.log(queryParamMap['params'])

    // console.log('dsgyusdguyds cart');
    // this.route.paramMap.subscribe((paramMap: ParamMap) => {
    //   console.log(paramMap.get("prdlst"));
    //   if (paramMap.has("prdlst")) {
    //     this.prodList = JSON.parse(JSON.stringify(paramMap.get("prdlst")));
    //   } 
    // });
  }

  removeFromCart(a){
  }

  getCartDetails()
{
  let prodSession=JSON.parse(sessionStorage.getItem("inCartList"));
  this.amountTobePaid=0;
  this.checkOutProd=prodSession.cartProd;
  console.log(this.checkOutProd); 
  this.productCount=this.checkOutProd.length;
 for(let j=0;j<this.checkOutProd.length;j++){
   this.amountTobePaid+=this.checkOutProd[j].price;
 }
 console.log(this.amountTobePaid);
 console.log(this.productCount);
 
 
}


openDialog(z) {
  const dialogRef = this.dialog.open(DeleteDialog,{
    data:{
      message: 'Are you sure you want to remove this product from your cart!!',
      buttonText: {
        ok: 'Yes',
        cancel: 'No'
      }
    }
  });

  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (confirmed) {
      //snack.dismiss();
      console.log(confirmed);
      
   
    let cartAfterRemove=[];
    console.log(z);
    this.CartCount.getdeleteCount();
    console.log(this.prodList);



     for(let i=0;i<this.prodList.length;i++){
       console.log(this.prodList[i].id);
       console.log(z.id);
      if(z.id==this.prodList[i].id){
        const index = this.prodList.indexOf(this.prodList[i]);
        console.log(index);
        
    if (index > -1) {
      this.prodList.splice(index, 1);
    }
    break;
      }
    }
       
console.log(this.prodList); 
    
    // for(let i=0;i<this.prodList.length;i++){
    //   if(z.id!=this.prodList[i].id){
    //    cartAfterRemove.push(this.prodList[i]);
    //   }
    // }
  //   console.log(cartAfterRemove);
  //   this.prodList.length=0;
  //   this.prodList=[...cartAfterRemove]
  //   console.log(this.prodList);
    if(this.prodList.length==0){
      this.checkOutBtn=false;
   }

   
    sessionStorage.removeItem("inCartList");
    let setProd={cartProd:this.prodList}
    console.log(this.prodList);
    console.log(setProd);
    sessionStorage.setItem('inCartList',JSON.stringify(setProd));

      
      const a = document.createElement('a');
      a.click();
      a.remove();
     // snack.dismiss();
      // this.snackBar.open('Closing snack bar in a few seconds', 'Fechar', {
      //   duration: 2000,
      // });
      this._snackBar.open(z.name,'Removed from your Cart!!', {
        duration: 2000,
      });
    }
  });
}

placeOrder(){
  this.isLoading=true;

  let a=this.ProdOrderService.placeOrder().subscribe(a=>{
    this.isLoading=false;
    console.log(a);
    this.checkOutBtn=false;
    let chkCartProd={cartProd:[]};
    console.log(chkCartProd);
    if(chkCartProd!==null){
    let chkCartUserId=sessionStorage.getItem("userId");
    console.log(chkCartUserId);
    let cartId =JSON.parse(sessionStorage.getItem("cartId"));
    let storeInCartDb={id:cartId,userId:chkCartUserId,cartProduct:chkCartProd}
    console.log(storeInCartDb);
    console.log(cartId);
    if(cartId!==null){
    this.CartCount.onPlaceOrder(cartId,storeInCartDb)
    }
    }
    sessionStorage.removeItem("inCartList");
    this.prodList.length=0;
    this.CartCount.removeCartCount();
 
  })
  // console.log(a);
  // console.log(this.ProdOrderService.getOrderedPlacedStatus());

  const dialogRef = this.dialog.open(DeleteDialog,{
    data:{
      message: 'Order placed Successfully,Would you like to see your order history!!',
      buttonText: {
        ok: 'Yes',
        cancel: 'No'
      }
    }
  });

  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (confirmed) {
      console.log(confirmed);
      this.router.navigate(['/orderdetail'])
    }
    else{
      this.router.navigate(['/homepage'])

    }
  })
}

}

