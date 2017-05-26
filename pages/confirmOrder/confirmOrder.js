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
        // console.log(res)
        let arr = that.data.uploadImgArr
        if(res.tempFilePaths){
          res.tempFilePaths.forEach(function (item) {
            that.saveTempImg(item)
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
  saveTempImg:function (path) {
    wx.showLoading({
      title:'上传图片',
      mask:true
    })

    const that = this
    let data = {
      uuid:that.data.orderDetail.uuid,
      returnList:0
    }
    wx.uploadFile({
      url: 'https://www.emtsos.com/emMiniUpload.do',
      header: {
        'content-type': 'multipart/form-data'
      },
      filePath:path,
      name:'orderImages',
      formData: data,
      success:function (res) {
        const msg = JSON.parse(res.data)
        if(msg.ret === 1){
          wx.hideLoading()

        }
      },
      fail:function (err) {
        console.log(222)
        console.log(err)
      }
    })
  },
  submitData:function () {
    wx.showLoading({
      title:'提交订单',
      mask:true
    })
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
        if(res.data.ret === 1){
          wx.hideLoading()
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