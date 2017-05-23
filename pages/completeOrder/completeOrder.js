/**
 * Created by Administrator on 2017/5/23/023.
 */
"use strict"
Page({
  data:{
    orderInfo:{}
  },
  onLoad:function () {
    const orderDetail = JSON.parse(wx.getStorageSync('orderDetail'))
    this.setData({
      orderInfo:orderDetail
    })
    // wx.removeStorageSync('orderDetail')

  },
  backToLastPage:function () {
    wx.navigateBack({
      delta:1
    })
  },
  callCustomer:function () {
    wx.makePhoneCall({
      phoneNumber: '4000966120'
    })
  }
})