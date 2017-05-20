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
    this.setData({
      orderDetail:orderDetail
    })
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
    const data = this.data
    wx.removeStorageSync('orderDetail')
    console.log(data)
  }
})