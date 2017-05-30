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
      wx.navigateTo({
        url:'/pages/newsList/newsList'
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