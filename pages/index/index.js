Page({
  data:{
    imageList:[
      '/image/banner01.jpg',
      '/image/banner02.jpg'
    ]
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