/**
 * Created by Administrator on 2017/5/18/018.
 */
"use strict"
Page({
  data:{
    orderDetail:{},
    otherRequest:'',
    uploadImgArr:[]
  },
  onLoad:function () {
    const orderDetail = JSON.parse(wx.getStorageSync('orderDetail'))
    let data = {
      orderDetail:orderDetail
    }
    if(orderDetail.servicetype !== ''){
      const orderParams = wx.getStorageSync('OrderParams')
      const serviceoptiontypeMap = orderParams.serviceoptiontypeMap
      let arr = orderDetail.servicetype.split(','),
        serve = ''
      arr.forEach(function (item) {
        if(serviceoptiontypeMap[item]) serve += serviceoptiontypeMap[item] + ' '
      })
      data.serve = serve
    }
    this.setData(data)
  },
  onUnload:function () {
    wx.removeStorageSync('orderDetail') // 清除缓存的订单信息
  },
  backToLastPage:function () {
    wx.navigateBack({
      delta:1
    })
  },
  inputOtherRequest:function (e) {
    this.setData({
      otherRequest:e.detail.value
    })
  },
  uploadImage:function () {
    const that = this
    wx.chooseImage({
      success:function (res) {
        let arr = that.data.uploadImgArr
        if(res.tempFilePaths){
          res.tempFilePaths.forEach(function (item) {
            arr.push(item)
          })
        }
        that.setData({
          uploadImgArr:arr
        })
      },
      fail:function (err) {
        console.log(err)
      }
    })
  },
  submitData:function () {
    const that = this
    let data = {
      method:'submitOrder',
      uuid:that.data.orderDetail.uuid
    }
    if(that.data.otherRequest !== ''){
      data.note = that.data.otherRequest
    }
    if(that.data.uploadImgArr.length > 0){
      let imgs = ''
      that.data.uploadImgArr.forEach(function (item) {
        imgs += item + ','
      })
      data.imgs = imgs.replace(/,$/,'')
    }


    wx.request({
      url: 'https://www.emtsos.com/emMiniApi.do',
      header: {
        'Charset': 'utf-8',
        'content-type': 'application/x-www-form-urlencoded'
      },
      method:'POST',
      data: data,
      success:function (res) {
        console.log(res)
        if(res.data.ret === 1){
          wx.navigateTo({
            url:'/pages/completeOrder/completeOrder'
          })
        }
      },
      fail:function (err) {
        console.log(err)
      }
    })
  }
})