/**
 * Created by Administrator on 2017/5/23/023.
 */
"use strict"
const app = getApp()
const objAssign = require('../../util/objectAssign')
import headTitle from  '../../components/headTitle/headTitle.js'

Page({
  data:{
    orderDetail:{},
    orderStatus:{},
    imageList:[],
    uuid:'',
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/normal1.png',
    selectedSrc: '../../images/selected.png',
    halfSrc:'../../images/half.png',
    key: 5//评分
  },
  onLoad:function (opt) {
    const that = this
    objAssign(that, headTitle)

    if(!opt || !opt.uuid){
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
    that.getDetail(opt.uuid)
  },
  getDetail:function (uuid) {
    const that = this
    wx.showLoading({
      title:'加载中',
      mask:true
    })
    wx.request({
      url: 'https://www.emtsos.com/emMiniApi.do',
      data: {
        method:'getOrderDetail',
        userid: app.globalData.userId,
        // userid: 10033,
        uuid:uuid
      },
      success:function (data) {
        wx.hideLoading()
        if(data.data.ret === 1){
          let _data = {
            orderDetail:data.data.data.order,
            orderStatus:data.data.data,
            uuid:uuid
          }

          if(data.data.data.order.score1 > 0){
            _data.key = data.data.data.order.score1
          }

          that.setData(_data)

        }else {
          console.log(data.data)
        }
      },
      fail:function (err) {
        wx.hideLoading()
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
                      wx.redirectTo({
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
                wx.setStorageSync('orderDetail', JSON.stringify(that.data.orderDetail))
                let type
                if(that.data.orderDetail.status === 3){
                  type = 5
                }else{
                  type = 7
                }

                wx.redirectTo({
                  url:'/pages/completeOrder/completeOrder?type=' + type
                })
              },
              fail:function(err){
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
  callCustomer:function () {
    wx.makePhoneCall({
      phoneNumber: '020966120'
    })
  },
  //点击右边,半颗星
  selectLeft: function (e) {
    if(this.data.orderDetail.score1 > 0){
      return
    }

    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 1;
    }
    console.log("得" + key + "分")
    this.setData({
      key: key
    })

  },
  //点击左边,整颗星
  selectRight: function (e) {
    if(this.data.orderDetail.score1 > 0){
      return
    }
    var key = e.currentTarget.dataset.key
    console.log("得" + key + "分")
    this.setData({
      key: key
    })
  },
  submitAssess:function (e) {
    wx.showLoading({
      title:'正在提交',
      mask:true
    })
    const data = {
      method:'saveOrderScore',
      uuid:this.data.uuid,
      score:this.data.key,
      scoreNote:e.detail.value.assessText
    }
    console.log(data)

    wx.request({
      url: 'https://www.emtsos.com/emMiniApi.do',
      header: {
        'Charset': 'utf-8',
        'content-type': 'application/x-www-form-urlencoded'
      },
      method:'POST',
      data: data,
      success:function (res) {
        if(res.data.ret === 1){
          wx.hideLoading()
          wx.redirectTo({
            url:'/pages/orderDetail/orderDetail?uuid=' + data.uuid
          })
        }else{
          wx.showModal({
            title:'提示',
            showCancel:false,
            content:res.data.msg
          })
          return wx.hideLoading()
        }
      },
      fail:function (err) {
        wx.hideLoading()
        console.log(err)
      }
    })
  }
})