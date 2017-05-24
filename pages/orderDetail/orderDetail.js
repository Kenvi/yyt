/**
 * Created by Administrator on 2017/5/23/023.
 */
"use strict"
const app = getApp()
Page({
  data:{
    orderDetail:{},
    orderStatus:{},
    imageList:[]
  },
  onLoad:function (opt) {
    const that = this
    let orderstatusMap = JSON.stringify(app.globalData.orderParams.orderstatusMap)
    wx.request({
      url: 'https://www.emtsos.com/emMiniApi.do',
      data: {
        method:'getOrderDetail',
        userid: app.globalData.userId,
        uuid:opt.uuid
      },
      success:function (data) {
        if(data.data.ret === 1){

          that.setData({
            orderDetail:data.data.data.order,
            orderStatus:JSON.parse(orderstatusMap)
          })
          that.getOrderImageList()

        }else {
          console.log(data.data)
        }
      },
      fail:function (err) {
        console.log(err)
      }
    })
  },
  getOrderImageList:function () {
    const that = this
    wx.request({
      url: 'https://www.emtsos.com/emMiniApi.do',
      data: {
        method:'getOrderImageList',
        orderid:that.data.orderDetail.orderid
      },
      success:function (data) {
        if(data.data.ret === 1){

          that.setData({
            imageList:data.data.data.orderImageList
          })

        }else {
          console.log(data.data)
        }
      },
      fail:function (err) {
        console.log(err)
      }
    })
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