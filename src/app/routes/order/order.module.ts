import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPendingShipmentComponent } from './order-pending-shipment/order-pending-shipment.component';
import { OrderBeenShippedComponent } from './order-been-shipped/order-been-shipped.component';
import { OrderCancelComponent } from './order-cancel/order-cancel.component';
import { OrderCompleteComponent } from './order-complete/order-complete.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {OrderService} from "./order.service";
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderPaymentComponent } from './order-payment/order-payment.component';


const routes: Routes = [
  {path: 'pendingShipment', component: OrderPendingShipmentComponent,children: [
    {path: 'orderDetail', component: OrderDetailComponent}
  ]},
  {path: 'beenShipped', component:OrderBeenShippedComponent,children: [
    {path: 'orderDetail', component: OrderDetailComponent}
  ]},
  {path: 'cancel', component:OrderCancelComponent,children: [
    {path: 'orderDetail', component: OrderDetailComponent}
  ]},
  {path: 'complete', component:OrderCompleteComponent,children: [
    {path: 'orderDetail', component: OrderDetailComponent}
  ]},
  {path: 'orderPayment', component:OrderPaymentComponent,children: [
    {path: 'orderDetail', component: OrderDetailComponent}
  ]},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [OrderPendingShipmentComponent, OrderBeenShippedComponent, OrderCancelComponent, OrderCompleteComponent, OrderDetailComponent, OrderPaymentComponent],
  providers: [
    OrderService
  ]
})
export class OrderModule { }
