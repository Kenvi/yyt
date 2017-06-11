/**
 * Created by Administrator on 2017/5/23/023.
 */
"use strict"
const app = getApp()
const objAssign = require('../../util/objectAssign')
import headTitle from  '../../components/headTitle/headTitle.js'
Page({
  data:{
    orderInfo:{},
    statusImage:'https://www.emtsos.com/image/ordersta1.png'
  },
  onLoad:function (opt) {
    const that = this
    objAssign(that, headTitle)


    if(!opt || !opt.type || wx.getStorageSync('orderDetail')===''){
      wx.redirectTo({
        url:'/pages/orderList/orderList'
      })
    }else{
      const orderDetail = JSON.parse(wx.getStorageSync('orderDetail'))
      const Account = wx.getStorageSync('Account')

      that.setData({
        orderInfo:orderDetail
      })

      that.switchStatusPage(opt.type)

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
    }

  },
  switchStatusPage:function (type) {
    const that = this
    let data = {}
    switch (type){
      case '3' :
        data = {
          statusTitle:'下单成功',
          statusImage:'https://www.emtsos.com/image/ordersta1.png',
          statusText:'的医疗转运预约下单成功，请保持电话畅通，五分钟内客服专员将与您确认预约信息。'
        }
        break
      case '5' :
        data = {
          statusTitle:'预付款支付成功',
          statusImage:'https://www.emtsos.com/image/ordersta4.png',
          statusText:'转运预约，'+ that.data.orderInfo.price4 +'元预付款支付成功，客服人员会尽快处理您的订单。'
        }
        break
      case '7' :
        data = {
          statusTitle:'尾款支付成功',
          statusImage:'https://www.emtsos.com/image/ordersta7a.png',
          statusText:'转运预约订单总价'+ that.data.orderInfo.price3 +'元，'+ that.data.orderInfo.price5 +'元尾款支付成功，本订单服务已完成，谢谢您的支持和配合。'
        }
        break
    }
    that.setData(data)
  },
  onShow:function () {
    if(wx.getStorageSync('orderDetail') === ''){
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'订单状态已改变，请在订单列表页重新查看订单',
        success:function (res) {
          if(res.confirm){
            wx.redirectTo({
              url:'/pages/orderList/orderList'
            })
          }
        }
      })
    }
  },
  onUnload:function () {
    if(wx.getStorageSync('orderDetail') !=='' ){
      wx.removeStorageSync('orderDetail')
    }

  },
  callCustomer:function () {
    wx.makePhoneCall({
      phoneNumber: '4000966120'
    })
  },
  toPageOrderDetail:function (e) {
    wx.removeStorageSync('orderDetail')
    wx.redirectTo({
      url:'/pages/orderDetail/orderDetail?uuid=' + e.currentTarget.dataset.uuid
    })
  }
})