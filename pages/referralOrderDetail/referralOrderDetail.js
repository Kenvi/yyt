/**
 * Created by 60411 on 2018/4/29.
 */
"use strict"
const app = getApp()
import login from  '../../components/login/login.js'
const objAssign = require('../../util/objectAssign')

Page({
  data: {
    status:6,
    statusName:'已取消',
    account:wx.getStorageSync('Account')
  },
  onLoad: function(options) {
    console.log(typeof this.data.account)

    const that = this
    objAssign(that, login)
    that.setData(that.data)
    // Do some initialize when page load.
  },
  onReady: function() {
    // Do something when page ready.
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
  onShareAppMessage: function (options) {
    return{
      title:'转诊申请订单',
      // imageUrl:app.api.imgBaseUrl+'mine-bg.png'
    }
    // return custom share data when user share.
  },
  onPageScroll: function() {
    // Do something when page scroll
  },
  onTabItemTap(item) {
    console.log(item.index)
    console.log(item.pagePath)
    console.log(item.text)
  },
  // Event handler.
  viewTap: function() {
    this.setData({
      text: 'Set some data for updating view.'
    }, function() {
      // this is setData callback
    })
  },
  customData: {
    hi: 'MINA'
  }
})