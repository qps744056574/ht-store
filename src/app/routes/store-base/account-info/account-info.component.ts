import {Component, OnInit} from "@angular/core";
import {StoreBaseService} from "../store-base.service";
import {SettleStepsComponent} from "../settle-steps/settle-steps.component";
import {FileUploader} from "ng2-file-upload";
import {SettingUrl} from "../../../public/setting/setting_url";
import {MainService} from "../../../public/service/main.service";
import {NzNotificationService} from "ng-zorro-antd";
import {Util} from "../../../public/util/util";
import {AREA_LEVEL_3_JSON} from "../../../public/util/area_level_3";
import {Setting} from "../../../public/setting/setting";
import {isNullOrUndefined} from "util";
import {PatternService} from "../../../public/service/pattern.service";
declare var $: any;

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  validateForm: any = {};                   //表单
  _options: any;                            //三级联动区域数据
  ngValidateStatus = Util.ngValidateStatus;//表单项状态
  ngValidateErrorMsg = Util.ngValidateErrorMsg;//表单项提示状态
  valitateState: any = Setting.valitateState;//表单验证状态

  public bankLicenceUploader: FileUploader = new FileUploader({
    url: SettingUrl.URL.enterprise.upload,
    itemAlias: "limitFile",
    allowedFileType: ["image"]
  }); //银行开户许可证电子版,初始化上传方法

  constructor(public storeBaseService: StoreBaseService,
              public steps: SettleStepsComponent,
              public patternService: PatternService,
              public _notification: NzNotificationService) {
    this.steps.current = 2;
    Util.transAreas(AREA_LEVEL_3_JSON);//将地区数据转成联级组件需要的格式
    this._options = AREA_LEVEL_3_JSON;//地区数据
    this.validateForm.isSettlementAccount = true;
  }

  ngOnInit() {
    const me = this;
    me.loadStoreData();//查询企业信息
  }

  /**
   * 查询企业信息
   * @param data
   */
  loadStoreData() {
    let me = this;
    $.when(StoreBaseService.loadStoreInfo()).done(data => {
      if (data) me.validateForm = data, me.transInfo(); //企业信息
      else {
        let epAccountInfo = localStorage.getItem('epAccountInfo');
        if(!isNullOrUndefined(epAccountInfo)) me.validateForm = JSON.parse(epAccountInfo);
        me.transInfo();
      }
    })
  }

  /**
   * 转换数据信息
   */
  transInfo(){
    let me = this;
    if(me.validateForm && me.validateForm.isSettlementAccount == Setting.ENUMSTATE.yes) me.validateForm.isSettlementAccount = true;
    else if(me.validateForm.isSettlementAccount == Setting.ENUMSTATE.no) me.validateForm.isSettlementAccount = false;
  }


  /**
   * 监听图片选择
   * @param $event
   */
  bankLicenceFileChangeListener() {
    // 当选择了新的图片的时候，把老图片从待上传列表中移除
    if (this.bankLicenceUploader.queue.length > 1) this.bankLicenceUploader.queue[0].remove();
  }

  /**
   * 点击下一步按钮时会提交表单，成功后跳转下一步
   * 1.先上传图片，获得图片暗码
   * 2.将图片暗码付给表单值对象
   * 3.提交表单数据
   * @param $event
   * @param value
   */
  public uploadImg() {
    let me = this, uploadedNum = 0, uploader = me.bankLicenceUploader;
    let uuid = '';//置空暗码

    //如果该组不需要上传图片则uploadedNum+1
    //需要上传图片的则在图片上传完成后uploadedNum+1
    if (uploader.getNotUploadedItems().length == 0) uploadedNum += 1;
    //上传之前，获取暗码
    uploader.onBuildItemForm = function (fileItem, form) {
      uuid = MainService.uploadUid();
      form.append('uuid', uuid);
    };
    uploader.uploadAll();//执行上传
    // 上传成功
    uploader.onSuccessItem = function (item, response, status, headers) {
      let res = JSON.parse(response);
      if (res.success) {
        if (uuid) me.validateForm.bankLicenceElectronic = uuid;//上传成功将暗码赋值给相应字段
      } else {
        me._notification.error(`上传失败`, '图片' + item._file.name + '上传失败，请重新选择图片并上传')
      }
    }
    // 上传失败
    uploader.onErrorItem = function (item, response, status, headers) {
      let res = JSON.parse(response);
      me._notification.error(`上传失败`, '图片' + uploader.queue[0]._file.name + '上传失败，请重新选择图片并上传')
    };
    // 完成上传
    uploader.onCompleteAll = function () {
      me.submitFormData()     //提交表单数据
    }
  }

  /**
   * 提交表单
   */
  submitCompleteForm($event){
    $event.preventDefault();
    let me = this;
    if (me.bankLicenceUploader.queue[0]) me.uploadImg();
    else me.submitFormData();
  }

  /**
   * 提交上传图片之后的表单数据
   * @param $event
   * @param value
   */
  submitFormData = () => {
    let formValue = Object.assign({}, this.validateForm);
    if (formValue.isSettlementAccount) formValue.isSettlementAccount = Setting.ENUMSTATE.yes;
    else formValue.isSettlementAccount = Setting.ENUMSTATE.no;
    this.storeBaseService.enterpriseAccount(formValue);
    localStorage.setItem('epAccountInfo',JSON.stringify(formValue));//每次点击提交时在本地保存表单数据，如果用户刷新页面可保证数据不丢失
  };

  /**
   * 跳转页面
   */
  skipTo(stepName) {
    this.storeBaseService.routerSkip(stepName);
  }

}
