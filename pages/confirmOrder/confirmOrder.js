/**
 * Created by Administrator on 2017/5/18/018.
 */
"use strict"
Page({
  data:{

  },
  uploadImage:function () {
    wx.chooseImage({
      success:function (res) {
        console.log(res)
      },
      fail:function (err) {
        console.log(err)
      }
    })
  }
})