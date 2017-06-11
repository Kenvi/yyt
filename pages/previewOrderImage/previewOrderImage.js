/**
 * Created by Administrator on 2017/5/26/026.
 */
"use strict"
const objAssign = require('../../util/objectAssign')
import headTitle from  '../../components/headTitle/headTitle.js'
Page({
  data:{
    uuid:null,
    orderid:null,
    imageList:[]
  },
  onLoad:function (opt) {
    const that = this
    objAssign(that, headTitle)
    that.setWindowHeight()
    that.getOrderImageList(opt.orderid)
    that.setData({
      uuid:opt.uuid,
      orderid:opt.orderid
    })
  },
  onUnload:function () {
    const that = this
    wx.redirectTo({
      url:'/pages/orderDetail/orderDetail?uuid=' + that.data.uuid
    })
  },
  setWindowHeight:function () {
    const info = wx.getSystemInfoSync()
    this.setData({
      clientHeight:info.windowHeight - info.windowWidth/375 * 50
    })
  },
  getOrderImageList:function (orderid) {
    const that = this
    wx.request({
      url: 'https://www.emtsos.com/emMiniApi.do',
      data: {
        method:'getOrderImageList',
        orderid:orderid
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
  uploadImage:function () {
    const that = this
    wx.chooseImage({
      success:function (res) {
        // console.log(res)
        let uploadArr = []
        if(res.tempFilePaths){
          res.tempFilePaths.forEach(function (item) {
            uploadArr.push(that.saveTempImg(item))
          })
        }
        Promise.all(uploadArr).then(function (res) {
          that.getOrderImageList(that.data.orderid)
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
        uuid:that.data.uuid,
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
          console.log(err)
          reject(err)
        }
      })
    })

  },
  previewImage:function (e) {
    let imgArr = []

    this.data.imageList.forEach(function (item) {
      imgArr.push('https://www.emtsos.com'+ item.photo)
    })

    wx.previewImage({
      current:imgArr[e.currentTarget.dataset.index],
      urls:imgArr
    })
  }
})