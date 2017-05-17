/**
 * Created by Administrator on 2017/5/17/017.
 */
"use strict"
export default {
  data:{
    hideNoticePage:true,
    agreeNoticePage:false
  },
  //显示医疗转运通知书
  showNoticePage:function () {
    let ifShow = !this.data.hideNoticePage
    this.setData({
      hideNoticePage: ifShow
    })
  },
  //同意医疗转运通知书
  checkNoticePageAgreement:function (e) {
    this.setData({
      agreeNoticePage: !this.data.agreeNoticePage
    })
  }
}