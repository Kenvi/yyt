/**
 * Created by Administrator on 2017/5/29/029.
 */
"use strict"
export default {
  backToLastPage:function () {
    wx.navigateBack({
      delta:1
    })
  },
  backToIndex:function () {
    wx.switchTab({
      url:'/pages/index/index'
    })
  }
}