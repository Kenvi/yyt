
const app = getApp()
const objAssign = require('../../util/objectAssign')
import headTitle from  '../../components/headTitle/headTitle.js'
Page({
  data:{
    bannerList:[
      '/image/banner01.jpg',
      '/image/banner02.jpg'
    ],
    informationList:[]
  },
  onLoad:function () {
    // wx.navigateTo({
    //   // url:'/pages/newsList/newsList'
    //   // url:'/pages/about/about'
    //   // url:'/pages/completeOrder/completeOrder?type=' + 7
    //   // url:'/pages/confirmOrder/confirmOrder?type=' + 7
    //   url:'/pages/orderDetail/orderDetail?uuid=' + 1495644516721
    //   // url:'/pages/orderList/orderList'
    //   // url:'/pages/previewOrderImage/previewOrderImage'
    // })
    const that = this
    objAssign(that, headTitle)
    app.api.getIndexInformation()
      .then(function (data) {

        that.setData({
          informationList:data.informationList,
          bannerList:data.bannerList
        })
      })
  },
  toPageOrder:function (e) {
    wx.setStorageSync('orderType',e)

    wx.switchTab({
      url:'/pages/order/order',
      success:function () {
      }
    })
  },
  toPageNewsDetail:function (e) {
    wx.navigateTo({
      url:'/pages/newsDetail/newsDetail?id=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title + '&date=' +e.currentTarget.dataset.date
    })
  }
})