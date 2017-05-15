//app.js
const AppId = 'wx124c238afb015486'
const Secret = 'd5091a4fdbe6abdd000a8160471dc89c'
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var CityList = wx.getStorageSync('CityList')
    if(CityList === ''){
      this.getCityList()
    }
    this.checkWxSession()
  },
  checkWxSession:function () {
    wx.checkSession({
      success:function (res) {
        console.log('success')
        console.log(res)
      },
      fail:function (err) {
        console.log('fail')
        console.log(err)
      }
    })
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data: {
                appid:AppId,
                secret:Secret,
                js_code: res.code,
                grant_type:'authorization_code'
              },
              success:function (res) {
                console.log(res)
              },
              fail:function (err) {
                console.log(err)
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
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