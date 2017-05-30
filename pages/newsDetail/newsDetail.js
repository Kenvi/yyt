/**
 * Created by Administrator on 2017/5/30/030.
 */
"use strict"
const app = getApp()
Page({
  data:{
    newsDetail:[],
    detailTitle:''
  },
  onLoad:function (opts) {
    const that = this
    if(!opts || !opts.id || !opts.title){
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'无法找到该资讯，请在资讯中心页重新查找',
        success:function (res) {
          if(res.confirm){
            wx.navigateTo({
              url:'/pages/newsList/newsList'
            })
          }
        }
      })

    }else{
      app.api.getInformationContent(opts.id)
        .then(function (content) {
          that.setData({
            newsDetail:content,
            detailTitle:opts.title
          })
        })
    }
  }
})