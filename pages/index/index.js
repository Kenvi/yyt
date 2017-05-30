Page({
  data:{
    imageList:[
      '/image/banner01.jpg',
      '/image/banner02.jpg'
    ]
  },
  onLoad:function () {
    // wx.navigateTo({
    //   url:'/pages/about/about'
    //   // url:'/pages/completeOrder/completeOrder?type=' + 7
    //   // url:'/pages/orderDetail/orderDetail?uuid=' + 1495802018468
    //   // url:'/pages/previewOrderImage/previewOrderImage'
    // })
  },
  toPageOrder:function (e) {
    wx.setStorageSync('orderType',e)

    wx.switchTab({
      url:'/pages/order/order',
      success:function () {
      }
    })
  }
})