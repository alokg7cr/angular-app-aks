import { Component, OnInit } from '@angular/core';
import{OrderService} from '../order.service';
import * as moment from 'moment';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  orderList=[];
  noOrderBtn=true;
  constructor(private ProdOrderService: OrderService) { }

  ngOnInit(): void {
    this.ProdOrderService.getOderedProd().subscribe(a=>{
      console.log(a);

      // for (let j=0;j<a.cartList.length;j++){
      // this.orderList.push(a.cartList[j].orderedProduct.cartProd[0]);
      // }
      console.log(moment(a.cartList[0].date).format('MM/DD/YYYY HH:mm'));

for (let j=0;j<a.cartList.length;j++){  
  for (let k=0;k<a.cartList[j].orderedProduct.cartProd.length;k++){ 
      this.orderList.push({orderDate:moment(a.cartList[j].date).format('MM/DD/YYYY HH:mm'),orderedProd:a.cartList[j].orderedProduct.cartProd[k]});
  }
      }
      console.log(this.orderList);
      console.log(this.orderList.length);
      if(this.orderList.length>0){
        console.log(this.noOrderBtn)
        this.noOrderBtn=false;
      }
    })

  }


}
