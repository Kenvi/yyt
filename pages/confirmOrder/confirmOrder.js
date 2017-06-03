/**
 * Created by Administrator on 2017/5/18/018.
 */
"use strict"
const app = getApp()
const objAssign = require('../../util/objectAssign')
import headTitle from  '../../components/headTitle/headTitle.js'
Page({
  data:{
    orderDetail:{},
    otherRequest:'',
    uploadImgNum:0
  },
  onLoad:function () {
    const that = this
    objAssign(that, headTitle)
    const orderDetail = JSON.parse(wx.getStorageSync('orderDetail'))
    let data = {
      orderDetail:orderDetail
    }
    if(orderDetail.servicetype !== ''){
      const orderParams = app.globalData.orderParams
      const serviceoptiontypeMap = orderParams.serviceoptiontypeMap
      let arr = orderDetail.servicetype.split(','),
        serve = ''
      arr.forEach(function (item) {
        if(serviceoptiontypeMap[item]) serve += serviceoptiontypeMap[item] + ' '
      })
      data.serve = serve
    }
    that.setData(data)
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
        let uploadArr = [] , num = that.data.uploadImgNum

        if(res.tempFilePaths){
          res.tempFilePaths.forEach(function (item) {
            uploadArr.push(that.saveTempImg(item))
          })
        }
        Promise.all(uploadArr).then(function (res) {
          console.log(res)
          that.setData({
            uploadImgNum:num + uploadArr.length
          })
        })
      },
      fail:function (err) {
        console.log(err)
      }
    })
  },
  saveTempImg:function (path) {
    const that = this

    return new Promise(function (resolve,reject) {
      wx.showLoading({
        title:'上传图片',
        mask:true
      })
      let data = {
        uuid:that.data.orderDetail.uuid,
        returnList:1
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
            resolve(msg.data.orderImageList)
          }
        },
        fail:function (err) {
          console.log(222)
          console.log(err)
          reject(err)
        }
      })
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
            url:'/pages/completeOrder/completeOrder?type=3'
          })
        }
      },
      fail:function (err) {
        console.log(err)
      }
    })
  }
})