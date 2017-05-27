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
    this.getDetail(opt.uuid)
  },
  getDetail:function (uuid) {
    const that = this
    wx.request({
      url: 'https://www.emtsos.com/emMiniApi.do',
      data: {
        method:'getOrderDetail',
        userid: app.globalData.userId,
        uuid:uuid
      },
      success:function (data) {
        if(data.data.ret === 1){

          that.setData({
            orderDetail:data.data.data.order,
            orderStatus:data.data.data
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

    app.wxLogin(function (openid) {
      let data = {
        method:'payWeixinH5',
        uid:app.globalData.userId,
        mini:1,
        sn:that.data.orderDetail.uuid,
        openid:openid
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
                wx.navigateTo({
                  url:'/pages/orderDetail/orderDetail?uuid=' + that.data.orderDetail.uuid
                })
              },
              fail:function(err){
                console.log(222)
                console.log(err)
              }
            })
          }
        },
        fail:function (err) {
          console.log(err)
        }
      })
    })



  },
  previewOrderImage:function () {
    const that = this
    wx.navigateTo({
      url:'/pages/previewOrderImage/previewOrderImage?orderid=' + that.data.orderDetail.orderid + '&uuid=' + that.data.orderDetail.uuid
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