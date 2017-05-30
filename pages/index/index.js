
const app = getApp()
Page({
  data:{
    imageList:[
      '/image/banner01.jpg',
      '/image/banner02.jpg'
    ],
    informationList:[]
  },
  onLoad:function () {
    // wx.navigateTo({
    //   url:'/pages/newsList/newsList'
    //   // url:'/pages/about/about'
    //   // url:'/pages/completeOrder/completeOrder?type=' + 7
    //   // url:'/pages/orderDetail/orderDetail?uuid=' + 1495802018468
    //   // url:'/pages/previewOrderImage/previewOrderImage'
    // })
    const that = this
    app.api.getInformationList()
      .then(function (list) {
        let arr = []
        for(let i=0;i<5;i++){
          arr.push(list[i])
        }
        that.setData({
          informationList:arr
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
      url:'/pages/newsDetail/newsDetail?id=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title
    })
  }
})