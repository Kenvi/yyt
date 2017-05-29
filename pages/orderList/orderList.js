/**
 * Created by Administrator on 2017/5/24/024.
 */
"use strict"
const app = getApp()
const objAssign = require('../../util/objectAssign')
import headTitle from  '../../components/headTitle/headTitle.js'
Page({
  data:{
    orderList:[]
  },
  onLoad:function () {
    const that = this
    objAssign(that, headTitle)
    if(app.globalData.userId === null){
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'您未登陆，请先登陆',
        success:function () {
          that.backToLastPage()
        }
      })
    }

    that.getorderList()

  },
  getorderList:function () {
    const that = this

    wx.showLoading({
      title:'加载中',
      mask:true
    })
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
          })
          wx.hideLoading()
        }else {
          console.log(data.data)
        }
      },
      fail:function (err) {
        console.log(err)
      }
    })
  },
  toPageOrderDetail:function (e) {
    wx.navigateTo({
      url:'/pages/orderDetail/orderDetail?uuid=' + e.currentTarget.dataset.uuid
    })
  }
})