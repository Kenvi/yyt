/**
 * Created by Administrator on 2017/5/24/024.
 */
"use strict"
const app = getApp()
Page({
  data:{
    orderList:[],
    orderStatus:{}
  },
  onLoad:function () {
    const that = this
    let orderstatusMap = JSON.stringify(app.globalData.orderParams.orderstatusMap)
    if(app.globalData.userId === null){
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'您未登陆，请先登陆',
        success:function () {

        }
      })
    }
    wx.request({
      url: 'https://www.emtsos.com/emMiniApi.do',
      data: {
        method:'getOrderList',
        userid: app.globalData.userId
      },
      success:function (data) {
        if(data.data.ret === 1){
          that.setData({
            orderList:data.data.data.orderList,
            orderStatus:JSON.parse(orderstatusMap)
          })
        }else {
          console.log(data.data)
        }
      },
      fail:function (err) {
        console.log(err)
      }
    })
  }
})