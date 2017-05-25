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
  cancelOrder:function () {
    const that = this
    wx.showModal({
      title:'提示',
      content:'确认取消订单吗',

      success:function (res) {
        if(res.confirm){
          wx.request({
            url: 'https://www.emtsos.com/emMiniApi.do',
            data: {
              method:'cancelOrder',
              uuid:that.data.orderDetail.uuid
            },
            success:function (data) {
              if(data.data.ret === 1){

                wx.showModal({
                  title:'提示',
                  content:'取消成功',
                  showCancel:false,
                  success:function (res) {
                    if(res.confirm){
                      wx.navigateTo({
                        url:'/pages/orderList/orderList'
                      })
                    }
                  }
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
      }
    })
  },
  wxPaySubmit:function () {
    const that = this
    let data = {
      method:'payWeixinH5',
      uid:app.globalData.userId,
      mini:1,
      sn:that.data.orderDetail.uuid
    }

    wx.request({
      url: 'https://www.emtsos.com/emApp.do',
      header: {
        'Charset': 'utf-8',
        'content-type': 'application/x-www-form-urlencoded'
      },
      method:'POST',
      data: data,
      success:function (res) {
        if(res.data.ret === 1){
          const payMsg = res.data.data.platformData
          wx.requestPayment({
            timeStamp: payMsg.timeStamp,
            nonceStr: payMsg.nonceStr,
            package: payMsg.packageValue,
            signType: 'MD5',
            paySign: payMsg.paySign,
            success:function(res){
              console.log(111)
              console.log(res)
            },
            fail:function(err){
              console.log(222)
              console.log(err)
            }
          })
          console.log(res.data.data.platformData)
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