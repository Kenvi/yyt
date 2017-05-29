/**
 * Created by Administrator on 2017/5/23/023.
 */
"use strict"
const app = getApp()
const objAssign = require('../../util/objectAssign')
import headTitle from  '../../components/headTitle/headTitle.js'
Page({
  data:{
    orderInfo:{}
  },
  onLoad:function () {
    const that = this
    objAssign(that, headTitle)
    const orderDetail = JSON.parse(wx.getStorageSync('orderDetail'))
    const Account = wx.getStorageSync('Account')
    that.setData({
      orderInfo:orderDetail
    })
    // wx.removeStorageSync('orderDetail')
    wx.request({
      url: 'https://www.emtsos.com/emMiniApi.do',
      data: {
        method:'userLogin1',
        account:Account
      },
      success:function (data) {
        if(data.data.ret === 1){

          app.globalData.menuList =  data.data.data

        }else {
          console.log(data.data)
        }
      },
      fail:function (err) {
        console.log(err)
      }
    })


  },
  callCustomer:function () {
    wx.makePhoneCall({
      phoneNumber: '4000966120'
    })
  },
  toPageOrderDetail:function (e) {
    wx.navigateTo({
      url:'/pages/orderDetail/orderDetail?uuid=' + e.currentTarget.dataset.uuid
    })
  }
})