//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var CityList = wx.getStorageSync('CityList')
    if(CityList === ''){
      this.getCityList()
    }
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getCityList:function () {
    wx.request({
      url: 'https://www.emtsos.com/emMiniApi.do',
      data: {
        method:'getCityList'
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if(res.data.ret === 1){
          var CityList = {}
          CityList.NEIDI = res.data.data.cityList
          CityList.GANGAO = res.data.data.cityList4
          CityList.Usual = res.data.data.cityList1
          wx.setStorageSync('CityList', CityList)
        }
      }
    })
  },
  globalData:{
    userInfo:null
  }
})