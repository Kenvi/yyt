/**
 * Created by Administrator on 2017/5/29/029.
 */
"use strict"
const app = getApp()
const objAssign = require('../../util/objectAssign')
import headTitle from  '../../components/headTitle/headTitle.js'
Page({
  data:{
    informationList:[]
  },
  onLoad:function () {
    const that = this
    objAssign(that, headTitle)
    app.api.getInformationList()
      .then(function (list) {
        that.setData({
          informationList:list
        })
      })

  },
  toPageNewsDetail:function (e) {
    app.globalData.newsDetailHtml = e.currentTarget.dataset.description
    wx.navigateTo({
      url:'/pages/newsDetail/newsDetail?id=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title + '&date=' +e.currentTarget.dataset.date
    })
  }
})