import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SettingUrl} from "../../../public/setting/setting_url";
import {CashSettleService} from "../cash-settle.service";
import {Page} from "../../../public/util/page";
import {Setting} from "../../../public/setting/setting";
declare var $: any;
@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css']
})
export class CashComponent implements OnInit {
  public cashPage: Page = new Page();          //提现信息
  public _loading = false;             //查询时锁屏
  public  enum = Setting.ENUM;//获取枚举名 如（1001,2002）
  constructor(public router: Router) {
  }

  ngOnInit() {
   this.qeuryCashData();//查询企业提现信息
  }

  /**
   * 查询提现数据
   */
  qeuryCashData(){
    let me = this;
    me._loading = true; //锁屏
    me.cashPage.params = { //查询参数
      curPage: me.cashPage.curPage, //目标页码
      pageSize: me.cashPage.pageSize, //每页条数
    }
    $.when(CashSettleService.settleList(me.cashPage.params)).done(data => {
      me._loading = false //解除锁屏
      if(data) me.cashPage = data; //赋值
    })
  };

  /**
   * 返回上一级页面
   */
  back() {
    this.router.navigate([SettingUrl.ROUTERLINK.store.cashSettle])
  }

}
