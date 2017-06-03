/**
 * Created by Administrator on 2017/5/30/030.
 */
"use strict"
const app = getApp()
Page({
  data:{
    newsDetail:[],
    detailTitle:'',
    detailDate:''
  },
  onLoad:function (opts) {
    const that = this
    if(!opts || !opts.id || !opts.title || !opts.date){
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'无法找到该资讯，请在资讯中心页重新查找',
        success:function (res) {
          if(res.confirm){
            wx.redirectTo({
              url:'/pages/newsList/newsList'
            })
          }
        }
      })

    }else{
      wx.showLoading({
        title:'加载中',
        mask:true
      })
      app.api.getInformationContent(opts.id)
        .then(function (content) {
          wx.hideLoading()
          that.setData({
            newsDetail:content,
            detailTitle:opts.title,
            detailDate:opts.date
          })
        })


    }
  },
  getImageOpts:function (opts,index,path) {
    const info = wx.getSystemInfoSync()
    let img = new Image()
    return new Promise(function (resolve,reject) {
      img.src= path
      img.onload = function (img) {
        opts.index = index
        // opts.width = img.path[0].width
        opts.height = img.path[0].height / img.path[0].width * (info.windowWidth-30)
        resolve(opts)
      }
    })
  }
})