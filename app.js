//app.js
const config = require('/config/config')

App({
  onLaunch: function () {
    const that = this
    //调用API从本地缓存中获取数据
    const CityList = wx.getStorageSync('CityList')
    if(CityList === ''){
      that.getCityList()
    }else{
      that.globalData.cityList = CityList
    }
    that.checkWxSession()
    if(that.globalData.userInfo === null){
      that.getUserInfo(function () {
        that.getParams()
      })
    }

  },
  checkWxSession:function () {
    const that = this
    wx.checkSession({
      success:function (res) {
        console.log(res)
      },
      fail:function (err) {
        console.log(err)
        that.getUserInfo()
      }
    })
  },
  getUserInfo:function(cb){
    var that = this
    wx.getUserInfo({
      success:function (res) {
        that.globalData.userInfo = res.userInfo
        typeof cb == "function" && cb(res.userInfo)
      },
      fail:function () {
        wx.showModal({
          title:'提示',
          content:'用户拒绝授权，无法获取微信信息，请点击右上角->关于易医通->点击右上角->设置->允许获取用户信息授权',
          showCancel:false
        })
      }
    })
  },
  wxLogin:function (cb) {
    var that = this
    //调用登录接口
    wx.login({
      success: function (res) {
        that.getUserInfo()
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
              appid:config.AppId,
              secret:config.Secret,
              js_code: res.code,
              grant_type:'authorization_code'
            },
            success:function (data) {
             console.log(data)
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
  getParams:function () {
    const that = this
    let data = {
      method:'getParams',
      username:that.globalData.userId
    }
    if(that.globalData.userInfo !== null){
      data.wx_nickname = that.globalData.userInfo.nickName
      data.wx_headimgurl = that.globalData.userInfo.avatarUrl
      data.wx_sex = that.globalData.userInfo.gender === 1 ? '男' : '女'
    }
    wx.request({
      url: 'https://www.emtsos.com/emMiniApi.do',
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if(res.data.ret === 1){
          that.globalData.orderParams = res.data
        }
      }
    })
  },
  globalData:{
    userInfo:null,
    userId:10018,
    cityList:null,
    orderParams:null
  }
})