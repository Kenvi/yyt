/**
 * Created by Administrator on 2018/1/24.
 */
"use strict"

const app = getApp()
const objAssign = require('../../util/objectAssign')

import login from  '../../components/login/login.js'


Page({
  data: {
    phone:''
  },
  onLoad: function(options) {
    // Do some initialize when page load.
    const that = this
    objAssign(that, login)
    that.setData(that.data)

  },
  onReady: function() {
    // Do something when page ready.
    if(app.globalData.orderParams !== null){
      this.setData({
        phone: app.globalData.orderParams.user.tel
      })
    }

  },
  onShow: function() {
    // Do something when page show.
  },
  onHide: function() {
    // Do something when page hide.
  },
  onUnload: function() {
    // Do something when page close.
  },
  onPullDownRefresh: function() {
    // Do something when pull down.
  },
  onReachBottom: function() {
    // Do something when page reach bottom.
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  submitSuggestion(e){
    let data = e.detail.value
    data.formid = e.detail.formId
    data.method = 'saveComment'


    if(!/^1[34578][0-9]{9}$/.test(data.contactmobile)){
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'请输入正确的手机号'
      })
      return
    }

    if(data.content == ''){
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'意见不能为空'
      })
      return
    }

    if(app.globalData.userId === null){
      this.setData({
        showLoginModal:true
      })
      return
    }

    data.userid = app.globalData.userId
    data.openid = app.globalData.orderParams.user.openid

    wx.request({
      url: 'https://www.emtsos.com/emApp.do',
      method:'POST',
      data: data,
      success:function (res) {
        console.log(res)
      },
      fail:function (err) {
        console.log(err)
      }
    })
  },
  onPageScroll: function() {
    // Do something when page scroll
  }
})