import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Setting} from "../../../public/setting/setting";
import {HomeService} from "../home.service";
import {SettingUrl} from "../../../public/setting/setting_url";
import {Util} from "../../../public/util/util";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  chartOption: any = {}; //订单流量图表配置项
  contactUs: Array<any> = new Array(); //联系我们的信息内容
  commonFunctions: Array<any> = new Array(); //常见功能的信息内容
  storeCount: Array<any> = new Array(); //统计信息内容
  companyUrl: string = SettingUrl.ROUTERLINK.basic.company; //企业信息路由地址
  shopsUrl: string = SettingUrl.ROUTERLINK.basic.shops; //店铺信息路由地址
  shopsUrlShow: boolean = Util.haveJurisdiction(Setting.MENUS, this.shopsUrl); //是否显示店铺信息操作按钮
  storeName: string = Setting.STOREINFO.name;//店铺名称
  storeAvatar: string = Setting.STOREINFO.storePicture; //店铺头像

  constructor() {
  }

  ngOnInit() {
    let _this = this;
    //设置统计信息内容
    _this.storeStatistics();
    //设置快捷操作功能模块
    _this.commonFunctions = [
      {
        icon: "anticon anticon-plus-square-o color-pink",
        info: "发布商品",
        url: SettingUrl.ROUTERLINK.store.goodsPublish,
        isShow: Util.haveJurisdiction(Setting.MENUS, SettingUrl.ROUTERLINK.store.goodsPublish)
      },
      {
        icon: "anticon anticon-appstore-o color-orange",
        info: "管理商品",
        url: SettingUrl.ROUTERLINK.store.goodsManage,
        isShow: Util.haveJurisdiction(Setting.MENUS, SettingUrl.ROUTERLINK.store.goodsManage)
      },
      {
        icon: "anticon anticon-tool color-blue",
        info: "运费模板",
        url: SettingUrl.ROUTERLINK.store.goodsFreightTemplate,
        isShow: Util.haveJurisdiction(Setting.MENUS, SettingUrl.ROUTERLINK.store.goodsFreightTemplate)
      },
      {
        icon: "icon icon-fahuo color-purple",
        info: "去发货",
        url: SettingUrl.ROUTERLINK.store.orderPendingShipment,
        isShow: Util.haveJurisdiction(Setting.MENUS, SettingUrl.ROUTERLINK.store.orderPendingShipment)
      },
      {
        icon: "anticon anticon-bank color-red",
        info: "收入/提现",
        url: SettingUrl.ROUTERLINK.store.cashSettle,
        isShow: Util.haveJurisdiction(Setting.MENUS, SettingUrl.ROUTERLINK.store.cashSettle)
      },
      {
        icon: "icon icon-tuikuan color-blue",
        info: "处理退款",
        url: SettingUrl.ROUTERLINK.store.serviceRefund,
        isShow: Util.haveJurisdiction(Setting.MENUS, SettingUrl.ROUTERLINK.store.serviceRefund)
      },
      {
        icon: "icon icon-tuihuo color-blue",
        info: "处理退货",
        url: SettingUrl.ROUTERLINK.store.serviceReturnGoods,
        isShow: Util.haveJurisdiction(Setting.MENUS, SettingUrl.ROUTERLINK.store.serviceReturnGoods)
      },
      {
        icon: "anticon anticon-red-envelope color-pink",
        info: "红包统计",
        url: SettingUrl.ROUTERLINK.store.redPacketStatistics,
        isShow: Util.haveJurisdiction(Setting.MENUS, SettingUrl.ROUTERLINK.store.redPacketStatistics)
      },
      {
        icon: "anticon anticon-usergroup-add color-orange",
        info: "设置员工",
        url: SettingUrl.ROUTERLINK.store.staff,
        isShow: Util.haveJurisdiction(Setting.MENUS, SettingUrl.ROUTERLINK.store.staff)
      }
    ];
    //绘制订单浏览的图表
    _this.storeTreeGraphStatistics();
    //设置联系我们的信息内容
    _this.contactUsInfo();
  }

  /**
   * 获取平台汇总信息（商品数、待发货订单数、已完成订单数，红包广告投放次数，红包广告总点击数，员工数）
   */
  storeStatistics() {
    let me = this, infos: any = HomeService.storeStatistics();
    me.storeCount = [
      {
        num: infos ? (infos.goods || 0) : 0,
        info: "商品数",
        isShow: true
      },
      {
        num: infos ? (infos.deliverGoods || 0) : 0,
        info: "待发货订单",
        isShow: true
      },
      {
        num: infos ? (infos.completedGoods || 0) : 0,
        info: "已完成订单",
        isShow: true
      },
      {
        num: infos ? (infos.redPack || 0) : 0,
        info: "红包广告发放次数",
        isShow: true
      },
      {
        num: infos ? (infos.redPackClick || 0) : 0,
        info: "红包广告点击量",
        isShow: true
      },
      {
        num: infos ? (infos.money || 0) : 0,
        info: "账户余额（元）",
        isShow: Util.haveJurisdiction(Setting.MENUS, SettingUrl.ROUTERLINK.store.cashSettle)
      }
    ];
  };

  /**
   * 设置联系我们的信息内容
   */
  contactUsInfo() {
    let me = this;
    //联系我们的信息内容
    Setting.APP.contactInformation.email = HomeService.loadInfoByCode(Setting.APP.storeSettings.email);
    Setting.APP.contactInformation.phone = HomeService.loadInfoByCode(Setting.APP.storeSettings.phone);
    Setting.AJAX.errorTip += Setting.APP.contactInformation.phone;
    me.contactUs = [
      {
        icon: "anticon anticon-phone color-pink",
        info: "电话：" + Setting.APP.contactInformation.phone
      },
      {
        icon: "icon icon-email color-blue",
        info: "Email：" + Setting.APP.contactInformation.email
      }
    ];
  }

  /**
   * 查询近一周订单的信息统计（已完成、退款、退货）
   */
  storeTreeGraphStatistics() {
    let me = this, infos: any = HomeService.storeTreeGraphStatistics();
    if (!infos) infos = {
      orders: {keys: ["0", "0", "0", "0", "0", "0", "0"], yaxis: ["0", "0", "0", "0", "0", "0", "0"]},
      refund: {keys: ["0", "0", "0", "0", "0", "0", "0"], yaxis: ["0", "0", "0", "0", "0", "0", "0"]},
      returnGoods: {keys: ["0", "0", "0", "0", "0", "0", "0"], yaxis: ["0", "0", "0", "0", "0", "0", "0"]}
    }
    setTimeout(() => {
      me.chartOption = {
        backgroundColor: "#f8f8f8",
        grid: {
          left: "5%",
          right: "5%"
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          top: 10,
          right: 10,
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        legend: {
          top: 10,
          data: ['已完成', '退款', '退货']
        },
        xAxis: [
          {
            type: 'category',
            data: infos.orders.keys,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '单数',
            min: 0,
            axisLabel: {
              formatter: '{value} 单'
            }
          }
        ],
        series: [
          {
            name: '已完成',
            type: 'bar',
            itemStyle: {
              normal: {
                opacity: 0.8
              }
            },
            data: infos.orders.yaxis
          },
          {
            name: '退款',
            type: 'bar',
            itemStyle: {
              normal: {
                opacity: 0.8
              }
            },
            data: infos.refund.yaxis
          },
          {
            name: '退货',
            type: 'bar',
            itemStyle: {
              normal: {
                opacity: 0.8
              }
            },
            data: infos.returnGoods.yaxis
          }
        ]
      };
    });
  };

}
