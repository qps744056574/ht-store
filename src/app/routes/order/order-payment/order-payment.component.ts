import { Component, OnInit } from '@angular/core';
import {Page} from "../../../public/util/page";
import {OrderService} from "../order.service";
import {SettingUrl} from "../../../public/setting/setting_url";
import {Setting} from "../../../public/setting/setting";
declare var $: any;

@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.css']
})
export class OrderPaymentComponent implements OnInit {
  orderList: Page = new Page();  //待付款订单信息
  _loading:boolean = false;             //查询时锁屏
  orderquery = {
    phone: '',//收货人手机号
    agentOrdno: ''//订单号
  }//查询条件
  showOrderList: boolean = true;//判断子组件的显示/隐藏
  orderDetail:string = SettingUrl.ROUTERLINK.store.orderDetailSimple; //订单详情页面
  enum = Setting.ENUM;  // 订单状态类型
  orderState :any= Setting.ENUMSTATE;               //定义枚举状态
  state: string = this.orderState.ordState.cr;     //待付款状态的订单

  constructor() { }

  ngOnInit() {
    const me = this
    me.queryPayment()//查询待付款订单列表
  }
  /**
   * 子组件加载时
   * @param event
   */
  isactivate(event) {
    this.showOrderList = false;
  }

  /**
   * 子组件注销时
   * @param event
   */
  isDeactivate(event) {
    this.showOrderList = true;
  }

  /**
   * 重置搜索条件
   */
  public resetQuery(){
    this.orderquery = {
      phone: '',//收货人手机号
      agentOrdno: ''//订单号
    }
  }


  /**
   * 查询待付款订单列表
   * @param event
   * @param curPage
   */
  public queryPayment() {
    let me = this;
    me._loading = true; //锁屏
    me.orderList.params = { //查询参数
      curPage: me.orderList.curPage, //目标页码
      pageSize: me.orderList.pageSize, //每页条数
      phone: me.orderquery.phone,//收货人手机号
      ordno: me.orderquery.agentOrdno,//订单号
      ordState:me.state,//待付款状态的订单
    }
    $.when(OrderService.queryOrderList(me.orderList.params)).done(data => {
      me._loading = false //解除锁屏
      if(data) me.orderList = data; //赋值
    })
  }

}
