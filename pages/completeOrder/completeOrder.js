/**
 * Created by Administrator on 2017/5/23/023.
 */
"use strict"
Page({
  data:{

  },
  backToLastPage:function () {
    wx.navigateBack({
      delta:1
    })
  }
})